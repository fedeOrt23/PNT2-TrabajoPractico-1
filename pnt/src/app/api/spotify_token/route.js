// app/api/spotify/token/route.ts
import { NextResponse } from "next/server";
import Settings from "../../../settings";

let accessToken = "";
let expiresAt = 0;

async function fetchToken() {
  const cid = Settings.clientId;
  const secret = Settings.clientSecret;
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " + Buffer.from(`${cid}:${secret}`).toString("base64"),
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Spotify token request failed: ${response.status} ${response.statusText} – ${errorBody}`
    );
  }

  const payload = await response.json();

  if (!payload?.access_token) {
    throw new Error("Spotify response missing access_token");
  }

  accessToken = payload.access_token;
  const now = Math.floor(Date.now() / 1000);
  expiresAt = now + (payload.expires_in ?? 3600) - 60; //SE VA A RENOVAR UN MINUTO ANTES
}

export async function GET() {
  try {
    const now = Math.floor(Date.now() / 1000);
    if (!accessToken || now >= expiresAt) {
      await fetchToken();
    }

    return NextResponse.json(
      { access_token: accessToken, expires_at: expiresAt },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("[api/spotify_token] Token fetch failed", error);
    return NextResponse.json(
      {
        error: "Unable to fetch Spotify token",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 502 }
    );
  }
}


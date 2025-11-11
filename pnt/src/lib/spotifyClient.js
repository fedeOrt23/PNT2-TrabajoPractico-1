import "server-only";
import Settings from "@/settings";

const SPOTIFY_API_BASE = Settings.spotifyApiBase;
const INTERNAL_TOKEN_PATH = Settings.internalTokenPath;
const SETTINGS_MARKET = Settings.spotifyMarket?.trim();
const DEFAULT_MARKET =
  (SETTINGS_MARKET && SETTINGS_MARKET.length > 0
    ? SETTINGS_MARKET
    : process.env.SPOTIFY_MARKET?.trim() ||
      process.env.MARKET?.trim()) || "ES";

const MARKET_CODE = (DEFAULT_MARKET || "ES").toUpperCase();

let cachedToken = null;
let cachedTokenExpiry = 0;

function resolveInternalUrl(pathname) {  // Devuelve bien la URL absoluta para el endpoint interno dado el pathname
  if (/^https?:\/\//i.test(pathname)) {
    return pathname;
  }

  const envBase =
    process.env.NEXT_PUBLIC_APP_URL?.trim() ??
    process.env.NEXTAUTH_URL?.trim() ??
    null;
  if (envBase) {
    const baseWithProtocol = /^https?:\/\//i.test(envBase)
      ? envBase
      : `https://${envBase}`;
    return new URL(pathname, baseWithProtocol).toString();
  }

 
  const port = process.env.PORT ?? 3000;
  return new URL(pathname, `http://127.0.0.1:${port}`).toString();
}


async function fetchAccessToken(forceRefresh = false) { // Obtiene el token de acceso, usando caché si es posible.
                                                        // Si esta vencido, lo renueva.
  const now = Math.floor(Date.now() / 1000);
  if (!forceRefresh && cachedToken && now < cachedTokenExpiry - 30) {
    return cachedToken;
  }

  if (forceRefresh) {
    cachedToken = null;
    cachedTokenExpiry = 0;
  }

  const endpoint = resolveInternalUrl(INTERNAL_TOKEN_PATH);
  const response = await fetch(endpoint, {
    method: "GET",
    cache: "no-store",
    next: { revalidate: 0 },
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Token endpoint failed: ${response.status} ${response.statusText} - ${body}`);
  }

  const payload = await response.json();

  const token = payload?.access_token;
  const expiresAt = payload?.expires_at;
  const expiresIn = payload?.expires_in ?? 3600;

  if (!token) {
    throw new Error("Token endpoint response is missing access_token");
  }

  cachedToken = token;
  cachedTokenExpiry = expiresAt ?? now + expiresIn;

  return token;
}

function buildSpotifyUrl(pathname, searchParams) {
  const url = pathname.startsWith("http://") || pathname.startsWith("https://")
    ? new URL(pathname)
    : new URL(pathname, SPOTIFY_API_BASE);

  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => url.searchParams.append(key, String(v)));
      } else if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
}

export async function spotifyFetch(
  pathname,
  { method = "GET", body, searchParams, headers, ...rest } = {}
) {
  let lastError;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const accessToken = await fetchAccessToken(attempt === 1);
      const url = buildSpotifyUrl(pathname, searchParams);

      const requestHeaders = {
        Authorization: `Bearer ${accessToken}`,
        ...headers,
      };

      const isFormData =
        typeof FormData !== "undefined" && body instanceof FormData;
      const isUrlParams =
        typeof URLSearchParams !== "undefined" && body instanceof URLSearchParams;

      let requestBody = body;
      if (body && !isFormData && !isUrlParams) {
        if (!requestHeaders["Content-Type"]) {
          requestHeaders["Content-Type"] = "application/json";
        }
        if (requestHeaders["Content-Type"]?.includes("application/json")) {
          requestBody = JSON.stringify(body);
        }
      }

      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: requestBody,
        cache: "no-store",
        next: { revalidate: 0 },
        ...rest,
      });

      if (response.ok) {
        return response.status === 204 ? null : response.json();
      }

      // 401: reintentar una vez con token fresco
      if (response.status === 401 && attempt === 0) {
        continue;
      }

      // 429: rate limit → backoff corto y reintentar si era el primer intento
      if (response.status === 429 && attempt === 0) {
        const retryAfter = Number(response.headers.get("Retry-After")) || 1;
        await new Promise((r) => setTimeout(r, retryAfter * 1000));
        continue;
      }

      const text = await response.text();
      let details = text;
      try {
        details = JSON.stringify(JSON.parse(text));
      } catch {
        // ignore
      }

     
      console.error({
        attempt,
        method,
        url,
        status: response.status,
        statusText: response.statusText,
        responseBody: details,
      });

      throw new Error(
        `Spotify request failed: ${response.status} ${response.statusText} | ${method} ${url} | attempt=${attempt} | details=${details}`
      );
    } catch (err) {
      lastError = err;
      if (attempt === 1) break;
    }
  }
  throw lastError ?? new Error("Spotify request failed");
}



export async function getTopArtists({
  limit = 5,
  searchQuery = "genre:pop",
  market = MARKET_CODE,
} = {}) {
  const normalizedMarket =
    typeof market === "string" && market.length > 0
      ? market.trim().toUpperCase()
      : MARKET_CODE;

  const data = await spotifyFetch("/v1/search", {
    searchParams: {
      q: searchQuery,
      type: "artist",
      limit,
      market: normalizedMarket,
    },
  });

  return (data?.artists?.items ?? []).map((artist, index) => ({
    id: artist.id,
    name: artist.name,
    image: artist.images?.[0]?.url ?? null,
    followers: artist.followers?.total ?? null,
    genres: artist.genres ?? [],
    rank: index + 1,
  }));
}

//este endpoint no es exactamente no es que ddevuelve el top de artistas, siemplemente para ese genero 
// genre:pop. Spotify devuelve los artistas que mejor coinciden con esa búsqueda (ordenados por relevancia), no necesariamente los más escuchados del momento
// para saber cual usar, habría que usar la API de Spotify con autenticación de usuario, y obtener los artistas top del usuario autenticado.
// o tambien buscar en un Playlist concreta de Spotify que contenga los artistas más populares del momento en ese género.

export async function getTopAlbums({
  limit = 5,
  country = MARKET_CODE,
} = {}) {
  const normalizedCountry =
    typeof country === "string" && country.length > 0
      ? country.trim().toUpperCase()
      : MARKET_CODE;

  const data = await spotifyFetch("/v1/browse/new-releases", {
    searchParams: { limit, country: normalizedCountry },
  });

  return (data?.albums?.items ?? []).map((album, index) => ({
    id: album.id,
    name: album.name,
    artist: album.artists?.map((a) => a.name).join(", "),
    image: album.images?.[0]?.url ?? null,
    releaseDate: album.release_date,
    rank: index + 1, // El map recibe los elementos en orden junto con su índice (index), que empieza en 0. Para mostrar un ranking “humano” (1°, 2°, 3°, …) se suma 1 al índice. Así, el primer elemento (index === 0) queda con rank: 1, el segundo con rank: 2, etc.
  }));
}

export async function getTopTracks({
  artistIds = [],
  limit = 5,
  perArtist = 2,
  market = MARKET_CODE,
} = {}) {
  const normalizedMarket =
    typeof market === "string" && market.length > 0
      ? market.trim().toUpperCase()
      : MARKET_CODE;

  const uniqueArtistIds = [...new Set(artistIds.filter(Boolean))];

  if (uniqueArtistIds.length === 0) {
    return [];
  }

  const responses = await Promise.allSettled(
    uniqueArtistIds.map((artistId) =>
      spotifyFetch(`/v1/artists/${artistId}/top-tracks`, {
        searchParams: { market: normalizedMarket },
      })
    )
  );

  const collected = [];

  responses.forEach((result, index) => {
    const artistId = uniqueArtistIds[index];

    if (result.status !== "fulfilled") {
      console.error(`[spotify] Top tracks fetch failed for artist ${artistId}`, result.reason);
      return;
    }

    const tracks = result.value?.tracks ?? [];
    tracks.slice(0, perArtist).forEach((track) => {
      if (!track) return;

      const trackId = track.id ?? `${artistId}-${track.name ?? "track"}`;
      collected.push({
        artistId,
        id: trackId,
        name: track.name ?? "Cancion sin titulo",
        artist: track.artists?.map((a) => a.name).join(", "),
        image: track.album?.images?.[0]?.url ?? null,
        album: track.album?.name ?? null,
        popularity: track.popularity ?? null,
      });
    });
  });

  const uniqueTracks = [];
  const seenIds = new Set();

  for (const track of collected) {
    if (!track.id || seenIds.has(track.id)) {
      continue;
    }
    seenIds.add(track.id);
    uniqueTracks.push(track);
    if (uniqueTracks.length >= limit) {
      break;
    }
  }

  return uniqueTracks.map((track, index) => ({
    id: track.id,
    name: track.name,
    artist: track.artist,
    image: track.image,
    album: track.album,
    popularity: track.popularity,
    rank: index + 1,
  }));
}

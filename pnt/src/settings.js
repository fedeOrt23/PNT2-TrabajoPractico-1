'use server';

import dotenv from 'dotenv';
dotenv.config();

function getEnv(keys, fallback) {
  const list = Array.isArray(keys) ? keys : [keys];
  for (const k of list) {
    const v = process.env[k];
    if (v && v.length > 0) return v;
  }
  if (fallback !== undefined) return fallback;
  throw new Error(`Missing environment variable. Checked keys: ${list.join(', ')}`);
}

const Settings = Object.freeze({
  clientId:      getEnv('CLIENT_ID'),
  clientSecret:  getEnv(['CLIENT_SECRET', 'Client_secret']),
  spotifyMarket: getEnv(['SPOTIFY_MARKET', 'SPOTIFY_MARET'], 'US'),
});

export default Settings;

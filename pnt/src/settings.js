'use server';

import dotenv from 'dotenv';
dotenv.config();
const CLIENT_ID = process.env.CLIENT_ID;

const CLIENT_SECRET =
  process.env.CLIENT_SECRET || process.env.Client_secret;

const SPOTIFY_MARKET =
  process.env.SPOTIFY_MARKET || process.env.SPOTIFY_MARET || 'ES';


if (!CLIENT_ID) {
  throw new Error('Falta la variable de entorno CLIENT_ID');
}
if (!CLIENT_SECRET) {
  throw new Error('Falta la variable de entorno CLIENT_SECRET (o Client_secret)');
}

const Settings = Object.freeze({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  spotifyMarket: SPOTIFY_MARKET,
});

export default Settings;

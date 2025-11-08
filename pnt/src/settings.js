import dotenv from 'dotenv';
dotenv.config();
const CLIENT_ID = process.env.CLIENT_ID;

const CLIENT_SECRET =
  process.env.CLIENT_SECRET || process.env.Client_secret;

const SPOTIFY_MARKET =
  process.env.SPOTIFY_MARKET || process.env.SPOTIFY_MARET || 'ES';

const SPOTIFY_API_BASE =
  process.env.SPOTIFY_API_BASE?.trim() || 'https://api.spotify.com';

const INTERNAL_TOKEN_PATH =
  process.env.INTERNAL_TOKEN_PATH?.trim() || '/api/spotify_token';

const ACCCES_TOKEN = process.env.ACCCES_TOKEN || process.env.Accces_token;


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
  spotifyApiBase: SPOTIFY_API_BASE,
  internalTokenPath: INTERNAL_TOKEN_PATH,
  acccesToken: ACCCES_TOKEN,
});


export default Settings;

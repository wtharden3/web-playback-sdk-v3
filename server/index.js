require('dotenv').config();
const express = require('express');

const app = express();

const spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
const spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const port = process.env.PORT;


console.log(`this is the server`);

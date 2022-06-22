require('dotenv').config(); // .env file is in the root directory
const express = require('express');

const spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
const spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const port = process.env.PORT;

let generateRandomString = function (length) {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const app = express();

app.get('/auth/login', (req, res) => {

  let scope = `steaming user-read-email user-read-private`;
  let state = generateRandomString(16);
  let auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: spotify_client_id,
    scope: scope,
    redirect_uri: "http://localhost:3000/auth/callback",
    state: state
  })
  res.redirect(`https://accounts.spotify.com/authorize/?${auth_query_parameters.toString()}`);
});

app.get('auth/callback', (req, res) => {

});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port} 🎶`);
});

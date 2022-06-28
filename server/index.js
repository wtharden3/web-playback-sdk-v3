require('dotenv').config(); // .env file is in the root directory
const express = require('express');
const axios = require('axios').default;

const spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
const spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const port = process.env.SERVER_PORT;
const redirect_uri = "http://localhost:3000/auth/callback";

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
    redirect_uri: redirect_uri,
    state: state
  })
  res.redirect(`https://accounts.spotify.com/authorize/?${auth_query_parameters.toString()}`); // make sure this works using template literals instead of using quotes
});

app.get('auth/callback', (req, res) => {
  try {
    let code = req.body.code;
    let url = "https://accounts.spotify.com/api/token";
    console.log(code);
    console.log(url);
    let authOptions = {
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: "authorization_code"
      },
      headers: {
        "Authorization": "Basic" + (Buffer.from(spotify_client_id + ":" + spotify_client_secret).toString("base64")),
        "Content-Type": "application/x-www-form-urlencoded"
      },
      json: true
    };

    console.log(authOptions);

    axios.post(url, authOptions).then(res => console.log(res)).catch(err => console.error(err));
    
  } catch (err) {
    console.error(err);
    console.log(`something went wrong`);
  }
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port} 🎶`);
});

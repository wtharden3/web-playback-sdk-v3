require('dotenv').config(); // .env file is in the root directory
const express = require('express');
const axios = require('axios').default;

const spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
const spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const port = process.env.SERVER_PORT;
const redirect_uri = "http://localhost:3000/auth/callback";

let generateRandomString = function(length) {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const app = express();

app.get('/auth/login', (req, res) => {
  try {
    console.log(`before scope`);
    let scope = `streaming user-read-email user-read-private`;
    console.log(`after scope: ${scope}`);
    let state = generateRandomString(16);
    console.log(`after state: ${state}`);
    let auth_query_parameters = new URLSearchParams({
      response_type: "code",
      client_id: spotify_client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    });
    console.log(`after auth_query_parameters: ${auth_query_parameters}`);

    res.redirect(`https://accounts.spotify.com/authorize/?${auth_query_parameters.toString()}`); // make sure this works using template literals instead of using quotes
    console.log(`https://accounts.spotify.com/authorize/?${auth_query_parameters.toString()}`);
    console.log('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString());
    console.log(`https://accounts.spotify.com/authorize/?${auth_query_parameters.toString()}` === 'https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString());

    // res.redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString());
  } catch (err) {
    
  }
}); //end app.get('/auth/login')

app.get('/auth/callback', (req, res) => {
  try {
    let code = req.body.code;
    let url = "https://accounts.spotify.com/api/token";
    let authOptions = {
      url: url,
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

    axios.post(authOptions, (err, res, body) => {
      if(!err && res.statusCode === 200){
        let access_token = body.access_token;
        app.get('/auth/token', (req, res) => {
          res.json({
            access_token: access_token
          })
        });
      }

      res.redirect('/');
    });

  } catch (err) {
    console.error(err);
    console.log(err.message);
  }
}); //end app.get('/auth/callback')

// app.get('/auth/login', (req, res) => {
//   try {
//     // console.log(`before scope`);
//     // let scope = `streaming user-read-email user-read-private`;
//     // let state = generateRandomString(16);
//     // let auth_query_parameters = new URLSearchParams({
//     //   response_type: "code",
//     //   client_id: spotify_client_id,
//     //   scope: scope,
//     //   redirect_uri: redirect_uri,
//     //   state: state
//     // });

//     // res.redirect(`https://accounts.spotify.com/authorize/?${auth_query_parameters.toString()}`); // make sure this works using template literals instead of using quotes
//   } catch(err) {
//     console.error(err);
//     console.log(`this is an error at the /auth/login path`);
//   };
  

// app.get('/auth/callback', (req, res) => {
//   try {
//     let code = req.body.code;
//     let url = "https://accounts.spotify.com/api/token";
//     let authOptions = {
//       url: url,
//       form: {
//         code: code,
//         redirect_uri: redirect_uri,
//         grant_type: "authorization_code"
//       },
//       headers: {
//         "Authorization": "Basic" + (Buffer.from(spotify_client_id + ":" + spotify_client_secret).toString("base64")),
//         "Content-Type": "application/x-www-form-urlencoded"
//       },
//       json: true
//     };

//     axios.post(authOptions, (err, res, body) => {
//       if(!err && res.statusCode === 200){
//         let access_token = body.access_token;
//         app.get('/auth/token', (req, res) => {
//           res.json({
//             access_token: access_token
//           });
//         });
//       };

//       res.redirect('/');
//     });

//   } catch (err) {
//     console.error(err);
//     console.log(`there is an error at the /auth/callback path`);
//   }
// });

// app.get('auth/callback', (req, res) => {
  
//     // let code = req.body.code;
//     // let url = "https://accounts.spotify.com/api/token";
//     // let authOptions = {
//     //   url: url,
//     //   form: {
//     //     code: code,
//     //     redirect_uri: redirect_uri,
//     //     grant_type: "authorization_code"
//     //   },
//     //   headers: {
//     //     "Authorization": "Basic" + (Buffer.from(spotify_client_id + ":" + spotify_client_secret).toString("base64")),
//     //     "Content-Type": "application/x-www-form-urlencoded"
//     //   },
//     //   json: true
//     // };

//     // axios.post(authOptions, (err, res, body) => {
//     //   if(!err && res.statusCode === 200){
//     //     let access_token = body.access_token;
//     //     console.log(access_token);
//     //     app.get('/auth/token', (req, res) => {
//     //       res.json({
//     //         access_token: access_token
//     //       })
//     //     });
//     //     console.log(`inside axios`);
//     //     res.redirect('/');
//     //   }
//     // }).then(res => console.log(res))
//     //   .catch(err => console.error(err));
// });

// app.get('/auth/token', (req, res) => {
//   res.json({
//     access_token: access_token
//   })
// });

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port} 🎶`);
});

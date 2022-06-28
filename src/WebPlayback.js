import React, {useEffect, useState} from 'react';

const WebPlaback = (props) => {
  const [player, setPlayer] = useState(undefined);

  useEffect(() => {
    const script = document.createElement("script");
    console.log(script);
    script.src = 'https://sdk.cdn.co/spotify-player.js';
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlayerSDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'Web Playback SDK',
        qetOAuthToken: cb => { cb(props.token);},
        volume: 0.5
      });

      setPlayer(player);

      player.addListener('ready', ({device_id}) => {
        console.log(`Ready with Device ID: ${device_id}`);
      });

      player.addListener('not_ready', ({device_id}) => {
        console.log(`Device ID has gone offline ${device_id}`);
      });

      player.addListener('player_state_changed', ({device_id}) => {
        console.log(`Device ID has changed state ${device_id}`);
      });

      player.connect().then(success => {
        if (success) {
          console.log('The Web Playback SDK successfully connected to Spotify!');
        }
      });
    }
  })

  return(
    <div className="container" token={props.token}>
      <div className="main-wrapper">
        WebPlayback: {player}
      </div>
    </div>
  )
}

export default WebPlaback;
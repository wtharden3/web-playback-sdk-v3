import React, {useState, useEffect} from 'react';
import Login from './Login';
import './App.css';
import WebPlaback from './WebPlayback';

function App() {
  const [token, setToken] = useState('');

  useEffect(() =>{
    async function getToken(){
      const response = await fetch('/auth/token');
      const json = await response.json();
      console.log(json);
      setToken(json.access_token);
    }

    getToken();

  }, [])

  return (
    <React.Fragment>
      {(token === '') ? <Login /> : <WebPlaback token={token} />}
    </React.Fragment>
  );
}

export default App;

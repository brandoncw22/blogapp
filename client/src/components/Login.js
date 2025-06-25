
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Popup from 'reactjs-popup';

function Login({setIsLoggedIn, isLoggedIn}) {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  if (isLoggedIn) {
    return(
      <div className="login_popup">
        <Popup trigger={<button className="tab_button">⚙</button>}
        modal nested>
          {(close) => (
            <form className="login_form">
              <button onClick={async (e) =>{
                  e.preventDefault();
                  setIsLoggedIn(false);
                  close();
              }}>Logout</button>
            </form>
          )}
          
        </Popup>
        
      </div>
    );
    }
    return(
        <div className="login_popup">
          <Popup trigger={<button className="tab_button">⚙</button>}
          modal nested>
            {(close) => (
                <form className="login_form">
              
                <input 
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  />
                  <input 
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  />
                  <button onClick={async (e) => {
                    e.preventDefault();

                    try {
                      const res = await axios.post('http://localhost:3030/login', {
                          username,
                          password
                      });

                      const success = res.data.success;

                      if (success) {
                          setIsLoggedIn(true);
                          close();
                      } else {
                        alert("login unsuccessful");
                      }
                    } catch (err) {
                      console.error("Login failed: ", err.response?.data || err.message);
                    }
                  }}>Login</button>
                </form>
              )}
            
          </Popup>
          
        </div>
    );
}

export default Login;
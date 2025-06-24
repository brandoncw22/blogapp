
import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import axios from 'axios';

function App() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const loginFormRef = useRef(null);
  const tabButtonRef = useRef(null);

  useEffect(() => {
        if (loginFormRef.current) {
            if (isOpen) {
                loginFormRef.current.style.display = 'block';
                loginFormRef.current.style.height = 'fit-content';
            } else {
                loginFormRef.current.style.display = 'none';
                loginFormRef.current.style.height = '0';
            }
        }
  }, [isOpen]);

  const handlePopup = async (e) => {
    e.preventDefault();

    setIsOpen(!isOpen);

  }
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:3030/login', {
        username,
        password
      });

      const success = res.data.success;
      const user = res.data.username;

      if (success) {
        setIsLoggedIn(true);
      } else {

      }
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
    }
  }
  return (
    <Router>
      <header>
        <div className="admin_bar">
        <div className="login_popup">
          <button className="tab_button" onClick={handlePopup} ref={tabButtonRef}>☰</button>
          <form className="login_form" onSubmit={handleLogin} ref={loginFormRef}>
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
              <button type="submit">Login</button>
            </form>
        </div>
        </div>
        <div id="header-bar" >
          <h1 className="title">Dondon & Nini's Blog</h1>
          <Navbar />
        </div>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home isLoggedIn={isLoggedIn}/>} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>

    </Router>
  );
}

export default App;

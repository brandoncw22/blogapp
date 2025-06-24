
import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './components/Login';


function App() {

  
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <header>
        <div className="admin_bar">
          <Login setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn}/>
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

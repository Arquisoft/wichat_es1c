import React, { useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Login from './components/Login.js';
import Register from './components/Register.js';
import Home from './components/Home.js';
import Game from './components/Game.js';
import Ranking from './components/Ranking.js'
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

function App() {
  const location = useLocation();  

  useEffect(() => {
    const currentPath = location.pathname;

    if (currentPath === '/') {
      document.body.style.backgroundImage = 'url(/FondoWichat.png)';
    } else if (currentPath === '/register') {
      document.body.style.backgroundImage = 'url(/FondoWichat_2.png)';
    } 
    else if (currentPath === '/home') {
      document.body.style.backgroundImage = 'url(/FondoWichat_4.png)';
    } 
    else {
      document.body.style.backgroundImage = 'url(/FondoWichat_3.png)';  
    }
  }, [location]); 

  return (
    <Container component="main" maxWidth="lg">
      <CssBaseline />
      <Typography 
        component="h1" 
        variant="h3" 
        align="center" 
        sx={{ 
          mt: 2, 
          color: 'white', 
          fontFamily: "'Poppins', sans-serif", 
          fontWeight: '900', 
          textTransform: 'uppercase', 
          textShadow: '2px 2px 8px rgba(0, 0, 0, 0.5), -1px -1px 0 rgba(0, 0, 0, 0.7), 1px -1px 0 rgba(0, 0, 0, 0.7), -1px 1px 0 rgba(0, 0, 0, 0.7), 1px 1px 0 rgba(0, 0, 0, 0.7)', // Simula el contorno negro
          width: '100%',  
          letterSpacing: '0.5px',  
          wordBreak: 'break-word',  
        }} 
      >
        Welcome to the 2025 edition of the Software Architecture course
      </Typography>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/ranking" element={<Ranking />} />
      </Routes>

      {window.location.pathname !== '/home' && (
        <Typography component="div" align="center" sx={{ mt: 2 }}>
          {window.location.pathname === '/' ? (
            <Link to="/register" variant="body2" component="button" style={{ color: 'white' }}>
              Don't have an account? Register here.
            </Link>
          ) : (
            <Link to="/" variant="body2" component="button" style={{ color: 'white' }}>
              Already have an account? Login here.
            </Link>
          )}
        </Typography>
      )}
    </Container>
  );
}

export default App;

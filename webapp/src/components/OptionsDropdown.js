import React, { useState } from 'react';
import { useNavigate} from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem, Fade } from '@mui/material';

const TopNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
    localStorage.removeItem('token');
    navigate('/');
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const buttonStyle = {
    bgcolor: '#007bff',
    '&:hover': { bgcolor: '#0056b3', transform: 'scale(1.05)' },
    transition: 'transform 0.2s ease-in-out, background-color 0.2s ease-in-out',
    fontFamily: "Arial Black",
    fontSize: "12px",
    letterSpacing: "0.6px",
    wordSpacing: "1px",
    color: "#f9f9f9",
    fontWeight: 400,
    fontStyle: "normal",
    fontVariant: "normal",
    textTransform: "uppercase",
    background: 'linear-gradient(to right,rgb(50, 21, 82),rgb(35, 5, 40))',
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        bgcolor: 'primary.main',
        boxShadow: 3,
        top: 0,
        zIndex: 1100,
        width: '100%',
        margin: 0,
        padding: 0,
        background: 'linear-gradient(to left, #8f94fb, #4e54c8)',
      }}
    >
      <Toolbar sx={{ width: '100%' }}>
        <Typography
          variant="h6"
          align="left"
          sx={{
            flexGrow: 1,
            fontFamily: "Arial Black",
            fontSize: "20px",
            letterSpacing: "0.6px",
            wordSpacing: "1px",
            color: "#f9f9f9",
            fontWeight: 400,
            fontStyle: "normal",
            fontVariant: "normal",
            textTransform: "uppercase",
          }}
        >
          Menú de Opciones
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            onClick={() => navigate('/home')}
            sx={buttonStyle}
          >
            Inicio
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate('/game')}
            sx={buttonStyle}
          >
            Juego
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate('/ranking')}
            sx={buttonStyle}
          >
            Ranking
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate('/user-account')}
            sx={buttonStyle}
          >
            Mi cuenta
          </Button>
          <Button
            variant="contained"
            onClick={handleMenuOpen}
            sx={buttonStyle}
          >
            HELP
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            TransitionComponent={Fade} // Añadimos animación de desvanecimiento
            sx={{
              '& .MuiPaper-root': {
                bgcolor: '#2c2c2c',
                color: '#f9f9f9',
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
                borderRadius: '8px',
                padding: '8px',
              },
            }}
          >
            <MenuItem
              onClick={() => { handleMenuClose(); navigate('/faq'); }}
              sx={{
                '&:hover': { bgcolor: '#444', color: '#fff' },
                transition: 'background-color 0.2s ease-in-out',
              }}
            >
              FAQ
            </MenuItem>
          </Menu>
          <Button
            variant="contained"
            onClick={handleLogout}
            sx={{
              ...buttonStyle,
              bgcolor: '#d32f2f',
              '&:hover': { bgcolor: '#b71c1c' },
              background: 'linear-gradient(to right,rgb(209, 0, 0),rgb(96, 19, 19))',
            }}
          >
            Cerrar sesión
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopNavbar;
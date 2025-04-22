import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem, Fade } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import HelpIcon from '@mui/icons-material/Help';


const TopNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
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

  const userRole = localStorage.getItem('role');
  const showButton = userRole === 'admin';

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
            startIcon={<HomeIcon />} 
          >
            Inicio
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate('/game')}
            sx={buttonStyle}
            startIcon={<SportsEsportsIcon />} 
          >
            Juego
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate('/ranking')}
            sx={buttonStyle}
            startIcon={<EmojiEventsIcon />} 
          >
            Ranking
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate('/user-account')}
            sx={buttonStyle}
            startIcon={<PersonIcon />} 
          >
            Mi cuenta
          </Button>
          {showButton && (
            <Button
              variant="contained"
              onClick={() => navigate('/admin-menu')}
              sx={buttonStyle}
            >
              Admin Menu
            </Button>
          )}
          <Button
            variant="contained"
            onClick={handleMenuOpen}
            sx={buttonStyle}
            startIcon={<HelpIcon />} 
          >
            HELP
          </Button>
          <Button
  variant="contained"
  onClick={handleLogout}
  sx={{
    ...buttonStyle,
    bgcolor: '#d32f2f',
    '&:hover': { bgcolor: '#b71c1c' },
    background: 'linear-gradient(to right,rgb(209, 0, 0),rgb(96, 19, 19))',
    minWidth: '48px',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}
>
  <LogoutIcon />
       </Button>
        </Box>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          TransitionComponent={Fade}
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
      </Toolbar>
    </AppBar>
  );
};

export default TopNavbar;
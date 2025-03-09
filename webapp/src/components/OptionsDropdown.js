import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton, Paper, Box, Typography, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const OptionsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Botón flotante para abrir/cerrar el menú */}
      <IconButton
        onClick={toggleMenu}
        sx={{
          position: 'fixed',
          top: 20,
          left: 20,
          bgcolor: 'primary.main',
          color: 'white',
          '&:hover': { bgcolor: 'primary.dark' },
          zIndex: 1000,
          transition: 'background-color 0.3s ease',
        }}
      >
        <MenuIcon />
      </IconButton>

      {/* Menú desplegable con animación */}
      {isOpen && (
        <Paper
          elevation={5}
          sx={{
            position: 'fixed',
            top: 80,
            left: 20,
            width: 220,
            display: 'flex',
            flexDirection: 'column',
            p: 2,
            borderRadius: 2,
            bgcolor: 'linear-gradient(145deg, #6a1b9a, #8e24aa)',
            boxShadow: 10,
            zIndex: 1000,
            minHeight: 100,
            transition: 'all 0.3s ease-in-out',
            opacity: 1,
          }}
        >
          {/* Título del menú */}
          <Typography
            variant="h6"
            align="center"
            sx={{
              mb: 2,
              color: 'black',
              fontWeight: 'bold',
              letterSpacing: 1,
              animation: 'fadeIn 0.5s ease-out',
            }}
          >
            Menú de Opciones
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Button
              variant="contained"
              onClick={() => navigate('/game')}
              sx={{
                mb: 1,
                width: '80%',
                padding: '10px',
                borderRadius: 2,
                textTransform: 'none',
                bgcolor: '#007bff',
                '&:hover': { bgcolor: '#0056b3', transform: 'scale(1.05)' },
                transition: 'transform 0.2s ease-in-out',
              }}
            >
              Juego
            </Button>
            <Button
              variant="contained"
              disabled={true} // Desactivando el botón
              sx={{
                mb: 1,
                width: '80%',
                padding: '10px',
                borderRadius: 2,
                textTransform: 'none',
                bgcolor: '#007bff',
                '&:hover': { bgcolor: '#0056b3', transform: 'scale(1.05)' },
                transition: 'transform 0.2s ease-in-out',
              }}
            >
              Botón 2
            </Button>
            <Button
              variant="contained"
              disabled={true} // Desactivando el botón
              sx={{
                mb: 1,
                width: '80%',
                padding: '10px',
                borderRadius: 2,
                textTransform: 'none',
                bgcolor: '#007bff',
                '&:hover': { bgcolor: '#0056b3', transform: 'scale(1.05)' },
                transition: 'transform 0.2s ease-in-out',
              }}
            >
              Botón 3
            </Button>
          </Box>
        </Paper>
      )}
    </>
  );
};

export default OptionsDropdown;

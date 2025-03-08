import { useState } from 'react';
import { IconButton, Paper, Box, Typography, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const OptionsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

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
          transition: 'background-color 0.3s ease', // Animación suave en el hover
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
            width: 220,  // Aumento del ancho para mayor espacio
            display: 'flex',
            flexDirection: 'column',
            p: 2,
            borderRadius: 2,
            bgcolor: 'linear-gradient(145deg, #6a1b9a, #8e24aa)', // Fondo con gradiente
            boxShadow: 10,
            zIndex: 1000,
            minHeight: 100,
            transition: 'all 0.3s ease-in-out', // Animación para transición suave
            opacity: 1,
          }}
        >
          {/* Título del menú con animación */}
          <Typography
            variant="h6"
            align="center"
            sx={{
              mb: 2,
              color: 'black', // Texto en negro
              fontWeight: 'bold',
              letterSpacing: 1,
              animation: 'fadeIn 0.5s ease-out', // Animación para que aparezca suavemente
            }}
          >
            Menú de Opciones
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Button
              variant="contained"
              sx={{
                mb: 1,
                width: '80%',
                padding: '10px',
                borderRadius: 2,
                textTransform: 'none', // Evitar mayúsculas automáticas en el texto
                bgcolor: '#007bff', // Azul similar al del chatbot
                '&:hover': { bgcolor: '#0056b3', transform: 'scale(1.05)' }, // Efecto hover
                transition: 'transform 0.2s ease-in-out', // Animación de escalado al pasar el cursor
              }}
            >
              Opción 1
            </Button>
            <Button
              variant="contained"
              sx={{
                mb: 1,
                width: '80%',
                padding: '10px',
                borderRadius: 2,
                textTransform: 'none',
                bgcolor: '#007bff', // Azul similar al del chatbot
                '&:hover': { bgcolor: '#0056b3', transform: 'scale(1.05)' },
                transition: 'transform 0.2s ease-in-out',
              }}
            >
              Opción 2
            </Button>
            <Button
              variant="contained"
              sx={{
                mb: 1,
                width: '80%',
                padding: '10px',
                borderRadius: 2,
                textTransform: 'none',
                bgcolor: '#007bff', // Azul similar al del chatbot
                '&:hover': { bgcolor: '#0056b3', transform: 'scale(1.05)' },
                transition: 'transform 0.2s ease-in-out',
              }}
            >
              Opción 3
            </Button>
          </Box>
        </Paper>
      )}
    </>
  );
};

export default OptionsDropdown;

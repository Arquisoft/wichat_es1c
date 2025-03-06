import { useState } from 'react';
import { IconButton, Paper, Box, Typography } from '@mui/material';
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
        }}
      >
        <MenuIcon />
      </IconButton>

      {/* Menú desplegable */}
      {isOpen && (
        <Paper
          elevation={5}
          sx={{
            position: 'fixed',
            top: 80,
            left: 20,
            width: 200,   // Establecer el ancho
            height: 200,  // Establecer la altura para hacerlo cuadrado
            display: 'flex',
            flexDirection: 'column',
            p: 2,
            borderRadius: 2,
            bgcolor: 'green', // Fondo verde
            boxShadow: 3,
            zIndex: 1000,
          }}
        >
          <Typography variant="h6" align="center" color="white">
            Menú de Opciones
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              overflowY: 'auto',
              mb: 1,
              p: 1,
              bgcolor: 'white',
              borderRadius: 1,
            }}
          >
            <Typography variant="body2" align="center" sx={{ cursor: 'pointer', padding: '8px' }}>
              Opción 1
            </Typography>
            <Typography variant="body2" align="center" sx={{ cursor: 'pointer', padding: '8px' }}>
              Opción 2
            </Typography>
            <Typography variant="body2" align="center" sx={{ cursor: 'pointer', padding: '8px' }}>
              Opción 3
            </Typography>
          </Box>
        </Paper>
      )}
    </>
  );
};

export default OptionsDropdown;

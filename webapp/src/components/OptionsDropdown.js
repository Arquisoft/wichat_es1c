import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

const TopNavbar = () => {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <>
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
              sx={{
                bgcolor: '#007bff',
                '&:hover': { 
                  bgcolor: '#0056b3',
                  transform: 'scale(1.1)',
                },
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
              }}
            >
              Inicio
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate('/game')}
              sx={{
                bgcolor: '#007bff',
                '&:hover': { 
                  bgcolor: '#0056b3',
                  transform: 'scale(1.1)',
                },
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
              }}
            >
              Juego
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate('/ranking')}
              sx={{
                bgcolor: '#007bff',
                '&:hover': { 
                  bgcolor: '#0056b3',
                  transform: 'scale(1.1)',
                },
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
              }}
            >
              Ranking
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate('/user-account')}
              sx={{
                bgcolor: '#007bff',
                '&:hover': { 
                  bgcolor: '#0056b3',
                  transform: 'scale(1.1)',
                },
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
              }}
            >
              Mi cuenta
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate('/faq')}
              sx={{
                bgcolor: '#007bff',
                '&:hover': { 
                  bgcolor: '#0056b3',
                  transform: 'scale(1.1)',
                },
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
              }}
            >
              FAQ
            </Button>
            <Button
              variant="contained"
              onClick={handleOpenDialog}
              sx={{
                bgcolor: '#d32f2f',
                '&:hover': {
                  bgcolor: '#b71c1c',
                  transform: 'scale(1.1)',
                },
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
                background: 'linear-gradient(to right,rgb(209, 0, 0),rgb(96, 19, 19))',
              }}
            >
              Cerrar sesión
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: '16px',
            padding: '16px',
            background: 'linear-gradient(to right, #4e54c8, #8f94fb)',
            color: 'white',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.5)',
          },
        }}
      >
        <DialogTitle
          id="logout-dialog-title"
          sx={{
            fontFamily: 'Arial Black',
            fontSize: '20px',
            textAlign: 'center',
            color: '#ffcccb',
            textTransform: 'uppercase',
          }}
        >
          Confirmar Cierre de Sesión
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="logout-dialog-description"
            sx={{
              fontFamily: 'Arial',
              fontSize: '16px',
              textAlign: 'center',
              color: 'white',
              marginBottom: '16px',
            }}
          >
            ¿Estás seguro de que deseas cerrar sesión? Esta acción te llevará a la página de inicio.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', gap: 2 }}>
          <Button
            onClick={handleCloseDialog}
            sx={{
              backgroundColor: '#4CAF50',
              color: 'white',
              '&:hover': {
                backgroundColor: '#388E3C',
              },
              fontFamily: 'Arial Black',
              textTransform: 'uppercase',
              padding: '8px 16px',
              borderRadius: '8px',
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleLogout}
            sx={{
              backgroundColor: '#F44336',
              color: 'white',
              '&:hover': {
                backgroundColor: '#D32F2F',
              },
              fontFamily: 'Arial Black',
              textTransform: 'uppercase',
              padding: '8px 16px',
              borderRadius: '8px',
            }}
          >
            Cerrar sesión
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TopNavbar;
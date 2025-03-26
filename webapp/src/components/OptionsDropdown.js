import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

const TopNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate('/'); 
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: 'primary.main',
        boxShadow: 3,
        top: 0, 
        zIndex: 1100,
        width: '250%',
        margin: 0,
        padding: 0, 
        background: 'linear-gradient(to left, #8f94fb, #4e54c8)', 
      }}
    >
      <Toolbar sx={{ 
        width: '100%' 

      }}> {/* Esto asegura que Toolbar ocupe todo el ancho */}
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
              '&:hover': { bgcolor: '#0056b3' },
              fontFamily: "Arial Black",
              fontSize: "12px",
              letterSpacing: "0.6px",
              wordSpacing: "1px",
              color: "#f9f9f9",
              fontWeight: 400,
              fontStyle: "normal",
              fontVariant: "normal",
              textTransform: "uppercase",
              background: 'linear-gradient(to right,rgb(50, 21, 82),rgb(35, 5, 40))' 
            }}
          >
            Inicio
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate('/game')}
            sx={{
              bgcolor: '#007bff',
              '&:hover': { bgcolor: '#0056b3' },
              fontFamily: "Arial Black",
              fontSize: "12px",
              letterSpacing: "0.6px",
              wordSpacing: "1px",
              color: "#f9f9f9",
              fontWeight: 400,
              fontStyle: "normal",
              fontVariant: "normal",
              textTransform: "uppercase",
              background: 'linear-gradient(to right,rgb(50, 21, 82),rgb(35, 5, 40))' 
            }}
          >
            Juego
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate('/ranking')}
            sx={{
              bgcolor: '#007bff',
              '&:hover': { bgcolor: '#0056b3' },
              fontFamily: "Arial Black",
              fontSize: "12px",
              letterSpacing: "0.6px",
              wordSpacing: "1px",
              color: "#f9f9f9",
              fontWeight: 400,
              fontStyle: "normal",
              fontVariant: "normal",
              textTransform: "uppercase",
              background: 'linear-gradient(to right,rgb(50, 21, 82),rgb(35, 5, 40))' 
            }}
          >
            Ranking
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate('/user-account')}
            sx={{
              bgcolor: '#007bff',
              '&:hover': { bgcolor: '#0056b3' },
              fontFamily: "Arial Black",
              fontSize: "12px",
              letterSpacing: "0.6px",
              wordSpacing: "1px",
              color: "#f9f9f9",
              fontWeight: 400,
              fontStyle: "normal",
              fontVariant: "normal",
              textTransform: "uppercase",
              background: 'linear-gradient(to right,rgb(50, 21, 82),rgb(35, 5, 40))' 
            }}
          >
            Mi cuenta
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate('/faq')}
            sx={{
              bgcolor: '#007bff',
              '&:hover': { bgcolor: '#0056b3' },
              fontFamily: "Arial Black",
              fontSize: "12px",
              letterSpacing: "0.6px",
              wordSpacing: "1px",
              color: "#f9f9f9",
              fontWeight: 400,
              fontStyle: "normal",
              fontVariant: "normal",
              textTransform: "uppercase",
              background: 'linear-gradient(to right,rgb(50, 21, 82),rgb(35, 5, 40))' 
            }}
          >
            FAQ
          </Button>
          <Button
            variant="contained"
            onClick={handleLogout}
            sx={{
              bgcolor: '#d32f2f',
              '&:hover': { bgcolor: '#b71c1c' },
              fontFamily: "Arial Black",
              fontSize: "12px",
              letterSpacing: "0.6px",
              wordSpacing: "1px",
              color: "#f9f9f9",
              fontWeight: 400,
              fontStyle: "normal",
              fontVariant: "normal",
              textTransform: "uppercase",
              background: 'linear-gradient(to right,rgb(209, 0, 0),rgb(96, 19, 19))' 
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

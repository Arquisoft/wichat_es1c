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
      }}
    >
      <Toolbar sx={{ width: '100%' }}> {/* Esto asegura que Toolbar ocupe todo el ancho */}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Menú de Opciones
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            onClick={() => navigate('/game')}
            sx={{
              bgcolor: '#007bff',
              '&:hover': { bgcolor: '#0056b3' },
              textTransform: 'none',
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
              textTransform: 'none',
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
              textTransform: 'none',
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
              textTransform: 'none',
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
              textTransform: 'none',
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

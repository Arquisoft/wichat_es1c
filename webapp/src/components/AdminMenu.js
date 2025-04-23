import React, { useState, useEffect } from 'react';
import OptionsDropdown from './OptionsDropdown';
import {
  Button,
  Snackbar,
  Alert,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Slide,
} from '@mui/material';
import axios from 'axios';

const endpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const AdminMenu = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [page, setPage] = useState(1);
  const [fadeIn, setFadeIn] = useState(true);
  const [slideDirection, setSlideDirection] = useState('left'); // Añade esto
  const usersPerPage = 5;

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${endpoint}/api/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (email) => {
    try {
      await axios.post(`${endpoint}/api/delete-user`, {
          email: email,
      }, { withCredentials: true });
      setSnackbar({
        open: true,
        message: 'Usuario eliminado correctamente',
        severity: 'success',
      });
      fetchUsers();
    } catch (error) {
      console.error("Error eliminando usuario:", error);
      setSnackbar({
        open: true,
        message: 'Error al eliminar el usuario',
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleChangePage = (event, value) => {
    setSlideDirection(value > page ? 'left' : 'right');
    setFadeIn(false);
    setTimeout(() => {
      setPage(value);
      setFadeIn(true);
    }, 200);
  };

  const paginatedUsers = users.slice((page - 1) * usersPerPage, page * usersPerPage);

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <OptionsDropdown />
      <Card elevation={3} style={{ marginTop: '24px', width: '100%' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Lista de Usuarios
          </Typography>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '24px' }}>
              <CircularProgress />
            </div>
          ) : (
            <>
              <Slide in={fadeIn} direction={slideDirection} timeout={200} mountOnEnter unmountOnExit>
                <div>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell><strong>Nombre</strong></TableCell>
                          <TableCell><strong>Email</strong></TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {paginatedUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleDelete(user.email)}
                                disabled={user.role === 'admin'}
                              >
                                Eliminar
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </Slide>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
                <Pagination
                  count={Math.ceil(users.length / usersPerPage)}
                  page={page}
                  onChange={handleChangePage}
                  color="primary"
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AdminMenu;

import React, { useState, useEffect } from 'react';
import OptionsDropdown from './OptionsDropdown';
import {
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
} from '@mui/material';
import axios from 'axios';

const endpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const AdminMenu = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${endpoint}/api/ranking`);
        setUsers(response.data);
      } catch (error) {
        console.error('Error al obtener los usuarios:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

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
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Nombre</strong></TableCell>
                    <TableCell><strong>Email</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMenu;

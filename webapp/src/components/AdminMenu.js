import React, { useState, useEffect } from 'react';
import OptionsDropdown from './OptionsDropdown';

const AdminMenu = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error al obtener los usuarios:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div>
        <OptionsDropdown /> {}
        <div>Cargando usuarios...</div>
      </div>
    );
  }

  return (
    <div>
      <OptionsDropdown /> {}
      <h1>Lista de Usuarios</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} ({user.email})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminMenu;
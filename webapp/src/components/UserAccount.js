import React, { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import { Container, Typography, Box } from '@mui/material';
import OptionsDropdown from './OptionsDropdown';

const UserAccount = () => {
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            try {
                const decodedToken = jwtDecode(token);

                const extractedName =
                    decodedToken.name ||
                    decodedToken.user?.name ||
                    decodedToken.username ||
                    decodedToken.preferred_username ||
                    decodedToken.given_name ||
                    decodedToken.email?.split('@')[0] ||
                    '';

                setUserName(extractedName);
                setUserEmail(decodedToken.email);
            } catch (error) {
                console.error('Error al decodificar el token.');
            }
        }
    }, []);

    return (
        <>
            <OptionsDropdown />
            <Container component="main" maxWidth="md">
                {userName && userEmail && (
                    <Box
                        sx={{
                            mt: 4,
                            p: 3,
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                            textAlign: 'center',
                        }}
                    >
                        <Typography
                            component="h2"
                            variant="h5"
                            sx={{
                                color: 'white',
                                fontFamily: "'Poppins', sans-serif",
                                fontWeight: '700',
                                mb: 2,
                            }}
                        >
                            Datos personales del usuario
                        </Typography>
                        <Typography
                            component="p"
                            variant="body1"
                            sx={{
                                color: 'white',
                                fontFamily: "'Poppins', sans-serif",
                                fontWeight: '400',
                                mt: 1,
                            }}
                        >
                            Usuario: {userName}
                        </Typography>
                        <Typography
                            component="p"
                            variant="body1"
                            sx={{
                                color: 'white',
                                fontFamily: "'Poppins', sans-serif",
                                fontWeight: '400',
                                mt: 1,
                            }}
                        >
                            Correo: {userEmail}
                        </Typography>
                    </Box>
                )}
            </Container>
        </>
    );
};

export default UserAccount;
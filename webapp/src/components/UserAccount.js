import React, { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import { Container, Typography, Box, Button } from '@mui/material';
import OptionsDropdown from './OptionsDropdown';
import { useNavigate } from "react-router-dom";
import axios from "axios";


const endpoint = "http://localhost:8000";

const UserAccount = () => {
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [totalGames, setTotalGames] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [wrongAnswers, setWrongAnswers] = useState(0);
    const navigate = useNavigate();

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

        const fetchUserStats = async () => {
            try {
                let response = await axios.get(`${endpoint}/api/ranking`);
                response = response.filter((game) => game.email === userEmail); 
                
                // response.data es una colección de estadísticas del usuario
                const stats = response.data;

                // Calcular el total de respuestas correctas e incorrectas
                const totalCorrectAnswers = stats.reduce((sum, stat) => sum + (stat.correctAnswers || 0), 0);
                const totalWrongAnswers = stats.reduce((sum, stat) => sum + (stat.wrongAnswers || 0), 0);

                setTotalGames(stats.length); // Número total de juegos = longitud de la colección
                setCorrectAnswers(totalCorrectAnswers); // Total de respuestas correctas
                setWrongAnswers(totalWrongAnswers); // Total de respuestas incorrectas
            } catch (error) {
                console.error('Error al obtener las estadísticas del usuario:', error);
            }
        };

        fetchUserStats();

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
                            Total de partidas jugadas: {totalGames}
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
                            Preguntas acertadas: {correctAnswers}
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
                            Preguntas falladas: {wrongAnswers}
                        </Typography>
                    </Box>
                )}
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3, display: "block", mx: "auto" }}
                    onClick={() => navigate("/home")}
                >
                    Volver a Home
                </Button>
            </Container>
        </>
    );
};

export default UserAccount;
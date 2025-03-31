import React, { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import { Container, Typography, Box, Button } from '@mui/material';
import OptionsDropdown from './OptionsDropdown';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const endpoint = "http://localhost:8000";

const UserAccount = () => {
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [totalGames, setTotalGames] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [wrongAnswers, setWrongAnswers] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [accuracy, setAccuracy] = useState(0);
    const [lastTenGames, setLastTenGames] = useState([]);
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
    }, []);

    useEffect(() => {
        if (!userEmail) return;
    
        const fetchUserStats = async () => {
            try {
                const response = await axios.get(`${endpoint}/api/ranking`);
                console.log('Datos de la API:', response.data);
                const userStats = response.data.filter((game) => game.email === userEmail);
    
                const totalCorrectAnswers = userStats.reduce((sum, stat) => sum + parseInt(stat.correct || 0, 10), 0);
                const totalWrongAnswers = userStats.reduce((sum, stat) => sum + parseInt(stat.wrong || 0, 10), 0);
    
                setTotalGames(userStats.length);
                setCorrectAnswers(totalCorrectAnswers);
                setWrongAnswers(totalWrongAnswers);
                setTotalQuestions(totalCorrectAnswers + totalWrongAnswers);
    
                const totalQuestions = totalCorrectAnswers + totalWrongAnswers;
                const calculatedAccuracy = totalQuestions > 0 ? (totalCorrectAnswers / totalQuestions) * 100 : 0;
                setAccuracy(calculatedAccuracy.toFixed(2));

                // Ordenar de más antiguo a más nuevo
                const sortedRanking = userStats.sort((a, b) => {
                    const dateA = new Date(a.timestamp * 1000 || a.timestamp); // Convertir timestamp a fecha
                    const dateB = new Date(b.timestamp * 1000 || b.timestamp);
                    return dateA - dateB; // Orden ascendente
                });
    
                // Tomamos las últimas 10 partidas
                const lastTen = sortedRanking.slice(-10).map((game) => {
                    const gameTotalQuestions = parseInt(game.correct || 0, 10) + parseInt(game.wrong || 0, 10);
                    const accuracy = gameTotalQuestions > 0 ? (parseInt(game.correct || 0, 10) / gameTotalQuestions) * 100 : 0;
                    return {
                        timestamp: new Date(game.timestamp * 1000 || game.timestamp).toLocaleString(), // Fecha y hora
                        correct: parseInt(game.correct || 0, 10),
                        wrong: parseInt(game.wrong || 0, 10),
                        totalQuestions: gameTotalQuestions,
                        accuracy: accuracy.toFixed(2)
                    };
                });

                setLastTenGames(lastTen);
            } catch (error) {
                console.error('Error al obtener las estadísticas del usuario:', error);
            }
        };
    
        fetchUserStats();
    }, [userEmail]);
    

    return (
        <>
            <OptionsDropdown />
            <Container component="main" maxWidth="md">
                {userName && userEmail && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.3 }}>
                            <Box sx={{
                                mt: 4,
                                p: 3,
                                background: 'linear-gradient(135deg, #1e3c72, #2a5298)',
                                borderRadius: '16px',
                                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
                                textAlign: 'center',
                                color: 'white',
                                fontFamily: "'Montserrat', sans-serif",
                                border: '2px solid transparent',
                                backgroundClip: 'padding-box',
                                position: 'relative',
                                overflow: 'hidden',
                            }}>
                                <Typography component="h2" variant="h5" sx={{
                                    fontWeight: '700',
                                    mb: 2,
                                    letterSpacing: '1px',
                                    textTransform: 'uppercase',
                                }}>
                                    Datos del Usuario
                                </Typography>
                                <Typography variant="body1">Usuario: {userName}</Typography>
                                <Typography variant="body1">Correo: {userEmail}</Typography>
                                <Typography variant="body1">Total de partidas jugadas: {totalGames}</Typography>
                                <Typography variant="body1">Preguntas acertadas: {correctAnswers}</Typography>
                                <Typography variant="body1">Preguntas falladas: {wrongAnswers}</Typography>
                                <Typography variant="body1">Total de preguntas: {totalQuestions}</Typography>
                                <Typography variant="body1" sx={{ fontWeight: '600', color: accuracy >= 50 ? '#4CAF50' : '#F44336' }}>
                                    Porcentaje de aciertos: {accuracy}%
                                </Typography>
                            </Box>
                        </motion.div>
                    </motion.div>
                )}
                {lastTenGames.length > 0 && (
                    <Box mt={4} sx={{ background: 'white', padding: 2, borderRadius: '12px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)' }}>
                        <Typography variant="h6" align="center" gutterBottom>
                            Resultados últimas 10 partidas
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={lastTenGames}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis tick={false} /> {/* Ocultamos los nombres en el eje X */}
                                <YAxis domain={[0, 100]} />
                                <Tooltip
                                    content={({ payload }) => {
                                        if (payload && payload.length) {
                                            const { timestamp, correct, wrong, totalQuestions, accuracy } = payload[0].payload;
                                            return (
                                                <Box sx={{
                                                    backgroundColor: 'white',
                                                    padding: '8px',
                                                    borderRadius: '8px',
                                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                                                    fontSize: '12px',
                                                    color: 'black',
                                                }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                        Fecha y hora: {timestamp}
                                                    </Typography>
                                                    <Typography variant="body2">Aciertos: {correct}</Typography>
                                                    <Typography variant="body2">Fallos: {wrong}</Typography>
                                                    <Typography variant="body2">Total preguntas: {totalQuestions}</Typography>
                                                    <Typography variant="body2">Porcentaje: {accuracy}%</Typography>
                                                </Box>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Line type="monotone" dataKey="accuracy" stroke="#4CAF50" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Box>
                )}
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button variant="contained" color="primary" sx={{ mt: 3, display: "block", mx: "auto", fontWeight: 'bold', transition: '0.3s', boxShadow: '0 4px 10px rgba(255, 255, 255, 0.3)' }} onClick={() => navigate("/home")}>
                        Volver a Home
                    </Button>
                </motion.div>
            </Container>
        </>
    );
};

export default UserAccount;

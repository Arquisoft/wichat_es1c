import React, { useEffect, useState } from 'react';
import {
    Container, Typography, Box, Button, TextField
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import OptionsDropdown from './OptionsDropdown';
import axios from "axios";
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


const endpoint = process.env.REACT_APP_API_ENDPOINT || "http://localhost:8000";

const UserAccount = () => {
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [totalGames, setTotalGames] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [wrongAnswers, setWrongAnswers] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [accuracy, setAccuracy] = useState(0);
    const [lastTenGames, setLastTenGames] = useState([]);

    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState('');
    const [editedEmail, setEditedEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [updateError, setUpdateError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            try {
                const storedName = localStorage.getItem('userName') || 'Guest';
                const storedEmail = localStorage.getItem('userEmail') || '';

                setUserName(storedName);
                setUserEmail(storedEmail);
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
                const userStats = response.data.filter((game) => game.email === userEmail);

                if (userStats.length === 0) return;

                const totalCorrectAnswers = userStats.reduce((sum, stat) => sum + parseInt(stat.correct || 0, 10), 0);
                const totalWrongAnswers = userStats.reduce((sum, stat) => sum + parseInt(stat.wrong || 0, 10), 0);

                setTotalGames(userStats.length);
                setCorrectAnswers(totalCorrectAnswers);
                setWrongAnswers(totalWrongAnswers);
                setTotalQuestions(totalCorrectAnswers + totalWrongAnswers);

                const total = totalCorrectAnswers + totalWrongAnswers;
                const calculatedAccuracy = total > 0 ? (totalCorrectAnswers / total) * 100 : 0;
                setAccuracy(calculatedAccuracy.toFixed(2));

                const sortedRanking = userStats.sort((a, b) => {
                    const dateA = new Date(a.timestamp * 1000 || a.timestamp);
                    const dateB = new Date(b.timestamp * 1000 || b.timestamp);
                    return dateA - dateB;
                });

                const lastTen = sortedRanking.slice(-10).map((game) => {
                    const gameTotal = parseInt(game.correct || 0, 10) + parseInt(game.wrong || 0, 10);
                    const accuracy = gameTotal > 0 ? (parseInt(game.correct || 0, 10) / gameTotal) * 100 : 0;
                    return {
                        timestamp: new Date(game.timestamp * 1000 || game.timestamp).toLocaleString(),
                        correct: parseInt(game.correct || 0, 10),
                        wrong: parseInt(game.wrong || 0, 10),
                        totalQuestions: gameTotal,
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

    const handleEdit = () => {
        setIsEditing(true);
        setEditedName(userName);
        setEditedEmail(userEmail);
        setCurrentPassword('');
        setNewPassword('');
        setUpdateError('');
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setUpdateError('');
    };

    const handleSave = async () => {
        if (!currentPassword) {
            setUpdateError('Debes ingresar tu contraseña actual para guardar cambios.');
            return;
        }

        try {
            await axios.put(`${endpoint}/api/update-user`, {
                name: editedName,
                email: editedEmail,
                currentPassword,
                newPassword: newPassword || undefined
            }, {
                withCredentials: true,
            });

            setUserName(editedName);
            setUserEmail(editedEmail);
            setIsEditing(false);
        } catch (error) {
            const msg = error.response?.data?.message || "Error al actualizar el perfil.";
            setUpdateError(msg);
            console.error("Error actualizando usuario:", error);
        }
    };

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
                                mt: 4, p: 3,
                                background: "linear-gradient(0deg, rgba(128,80,208,1) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,1) 100%)",
                                borderRadius: '16px',
                                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
                                textAlign: 'center', color: 'white'
                            }}>
                                <Typography 
                                component="h2" 
                                variant="h5" 
                                sx={{ 
                                    fontWeight: '700', 
                                    mb: 2, 
                                    textTransform: 'uppercase', 
                                    color: '#2e1569' 
                                }}
                                >
                                    Datos del Usuario
                                </Typography>

                                {isEditing ? (
                                    <>
                                        <TextField id = "Nombre" fullWidth label="Nombre" value={editedName} InputProps={{ readOnly: true }} sx={{ 
                                            mb: 2,
                                            backgroundColor: '#d3d3d3',
                                            borderRadius: '6px',
                                            '& .MuiInputBase-input.Mui-disabled': {
                                            WebkitTextFillColor: '#000',
                                            }
                                        }} />
                                        <TextField id = "Correo" fullWidth label="Correo" value={editedEmail} InputProps={{ readOnly: true }} sx={{
                                            mb: 2,
                                            backgroundColor: '#d3d3d3',
                                            borderRadius: '6px',
                                            '& .MuiInputBase-input.Mui-disabled': {
                                            WebkitTextFillColor: '#000',
                                            }
                                        }} />
                                        <TextField fullWidth label="Contraseña actual" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} sx={{ mb: 2, background: 'white', borderRadius: '6px' }} />
                                        <TextField fullWidth label="Nueva contraseña (opcional)" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} sx={{ mb: 2, background: 'white', borderRadius: '6px' }} />
                                        {updateError && <Typography color="error" sx={{ mb: 2 }}>{updateError}</Typography>}
                                        <Box display="flex" justifyContent="space-between">
                                            <Button variant="contained" onClick={handleSave} color="success">Guardar</Button>
                                            <Button id = "Cancelar" variant="outlined" onClick={handleCancelEdit} color="inherit">Cancelar</Button>
                                        </Box>
                                    </>
                                ) : (
                                    <>
                                <Typography variant="body1" sx={{ color: '#2e1569' }}>Usuario: {userName}</Typography>
                                <Typography variant="body1" sx={{ color: '#2e1569' }}>Correo: {userEmail}</Typography>
                                <Button 
                                    variant="outlined" 
                                    startIcon={<EditIcon />} 
                                    onClick={handleEdit} 
                                    sx={{ 
                                    mt: 2, 
                                    borderColor: '#2e1569', 
                                    color: '#2e1569',
                                    '&:hover': { 
                                    borderColor: '#2e1569', 
                                    backgroundColor: '#2e1569',
                                    color: 'white' 
                                    } 
                                    }}
                        >
                        Editar Perfil
                        </Button>

{totalGames > 0 && (
    <>
        <Typography variant="body1" sx={{ color: '#2e1569' }}>Total de partidas jugadas: {totalGames}</Typography>
        <Typography variant="body1" sx={{ color: '#2e1569' }}>Preguntas acertadas: {correctAnswers}</Typography>
        <Typography variant="body1" sx={{ color: '#2e1569' }}>Preguntas falladas: {wrongAnswers}</Typography>
        <Typography variant="body1" sx={{ color: '#2e1569' }}>Total de preguntas: {totalQuestions}</Typography>
        <Typography variant="body1" sx={{ fontWeight: '600', color: accuracy >= 50 ? '#4CAF50' : '#F44336' }}>
            Porcentaje de aciertos: {accuracy}%
        </Typography>
    </>
)}

                                    </>
                                )}
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
                                <XAxis tick={false} />
                                <YAxis domain={[0, 100]} />
                                <Tooltip content={({ payload }) => {
                                    if (payload && payload.length) {
                                        const { timestamp, correct, wrong, totalQuestions, accuracy } = payload[0].payload;
                                        return (
                                            <Box sx={{ backgroundColor: 'white', padding: '8px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)', fontSize: '12px', color: 'black' }}>
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
                                }} />
                                <Line type="monotone" dataKey="accuracy" stroke="#4CAF50" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Box>
                )}
            </Container>
        </>
    );
};

export default UserAccount;
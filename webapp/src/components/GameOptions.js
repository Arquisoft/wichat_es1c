import React, { useState } from 'react';
import { Container, Typography, Grid, Button, MenuItem, Box, Card, CardContent, Slider, FormControl, InputLabel, Select } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Settings } from '@mui/icons-material';

const GameOptions = () => {
    const [questionType, setQuestionType] = useState('general');
    const [responseTime, setResponseTime] = useState(60);
    const navigate = useNavigate();

    const handleStartGame = () => {
        navigate('/game', { state: { questionType, responseTime } });
    };

    const handleGoBack = () => {
        navigate('/');
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 5, textAlign: 'center' }}>
            <motion.div 
                initial={{ opacity: 0, y: -20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.6 }}
            >
                <Typography variant="h3" sx={{ mb: 3, fontWeight: 'bold', color: '#1976d2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Settings sx={{ mr: 1 }} /> Configuración del Juego
                </Typography>
            </motion.div>
            <Card elevation={8} sx={{ borderRadius: 3, overflow: 'hidden', p: 2, background: 'linear-gradient(135deg, #42a5f5, #1e88e5)', color: 'white' }}>
                <CardContent>
                    <Box component="form" noValidate autoComplete="off">
                        <Grid container spacing={3}>
                            {/* Selección del tipo de preguntas */}
                            <Grid item xs={12}>
                                <motion.div whileHover={{ scale: 1.05 }}>
                                    <FormControl fullWidth>
                                        <InputLabel sx={{ color: 'white' }}>Tipo de Preguntas</InputLabel>
                                        <Select
                                            value={questionType}
                                            onChange={(e) => setQuestionType(e.target.value)}
                                            fullWidth
                                            sx={{ backgroundColor: 'white', borderRadius: 2 }}
                                        >
                                            <MenuItem value="general">General</MenuItem>
                                            <MenuItem value="flags">Banderas de Paises</MenuItem>
                                        </Select>
                                    </FormControl>
                                </motion.div>
                            </Grid>

                            {/* Selección del tiempo máximo de respuesta */}
                            <Grid item xs={12}>
                                <motion.div whileHover={{ scale: 1.05 }}>
                                    <Typography gutterBottom>Tiempo por Pregunta: {responseTime} segundos</Typography>
                                    <Slider
                                        value={responseTime}
                                        onChange={(e, newValue) => setResponseTime(newValue)}
                                        min={10}
                                        max={300}
                                        step={10}
                                        marks
                                        valueLabelDisplay="auto"
                                        sx={{ color: 'white' }}
                                    />
                                </motion.div>
                            </Grid>

                            {/* Botones */}
                            <Grid item xs={12}>
                                <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.05 }}>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        onClick={handleStartGame}
                                        sx={{
                                            fontWeight: 'bold',
                                            py: 1.5,
                                            borderRadius: 2,
                                            backgroundColor: 'white',
                                            color: '#1976d2',
                                            '&:hover': {
                                                backgroundColor: '#e3f2fd',
                                            },
                                        }}
                                    >
                                        Iniciar Juego
                                    </Button>
                                </motion.div>
                            </Grid>
                            <Grid item xs={12}>
                                <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.05 }}>
                                    // boton para volver al menu principal
                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        onClick={handleGoBack}
                                        sx={{
                                            fontWeight: 'bold',
                                            py: 1.5,
                                            borderRadius: 2,
                                            color: 'white',
                                            borderColor: 'white',
                                            '&:hover': {
                                                backgroundColor: '#1e88e5',
                                                borderColor: 'white'
                                            },
                                        }}
                                    >
                                        Volver al Menú Principal
                                    </Button>
                                </motion.div>
                            </Grid>
                        </Grid>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
};

export default GameOptions;

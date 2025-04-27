import React from 'react';
import { Container, Typography, Grid, Button, MenuItem, Box, TextField, FormControl, InputLabel, Select, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { Settings } from '@mui/icons-material';

const GameOptions = ({ questionType, setQuestionType, responseTime, setResponseTime, onStartGame }) => {
    return (
        <Container
            maxWidth="xs"
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}
        >
            <Paper
                elevation={10}
                sx={{
                    padding: 4,
                    borderRadius: 3,
                    width: '100%',
                    maxWidth: 400,
                    backgroundColor: 'white',
                }}
            >
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Typography
                        variant="h3"
                        sx={{
                            mb: 3,
                            fontWeight: 'bold',
                            color: '#1976d2',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Settings sx={{ mr: 1 }} /> Configuración del Juego
                    </Typography>
                </motion.div>
                <Box component="form" noValidate autoComplete="off">
                    <Grid container spacing={3}>
                        {/* Selección del tipo de preguntas */}
                        <Grid item xs={12}>
                            <motion.div whileHover={{ scale: 1.05 }}>
                                <FormControl fullWidth>
                                    <InputLabel>Tipo de Preguntas</InputLabel>
                                    <Select
                                        value={questionType || "general"}
                                        onChange={(e) => setQuestionType(e.target.value)}
                                        fullWidth
                                        sx={{ backgroundColor: 'white', borderRadius: 2 }}
                                    >
                                        <MenuItem value="general">General</MenuItem>
                                        <MenuItem value="Geografía">Banderas de Países</MenuItem>
                                        <MenuItem value="Arte">Músicos</MenuItem>
                                        <MenuItem value="Deportes">Deportista</MenuItem>
                                        <MenuItem value="Biología">Pájaros</MenuItem>
                                        <MenuItem value="Arquitectura">Monumentos</MenuItem>
                                    </Select>
                                </FormControl>
                            </motion.div>
                        </Grid>

                        {/* Selección del tiempo máximo de respuesta */}
                        <Grid item xs={12}>
                            <motion.div whileHover={{ scale: 1.02 }}>
                                <FormControl fullWidth>
                                    <TextField
                                        label="Tiempo por Pregunta (segundos)"
                                        type="number"
                                        variant="outlined"
                                        value={responseTime}
                                        onChange={(e) => {
                                            const value = Number(e.target.value);
                                            if (value >= 0) { 
                                                setResponseTime(value);
                                            }
                                        }}
                                        InputProps={{
                                            inputProps: {
                                                min: 0,
                                            },
                                        }}
                                        sx={{
                                            backgroundColor: 'white',
                                            borderRadius: 2,
                                        }}
                                    />
                                </FormControl>
                            </motion.div>
                        </Grid>

                        {/* Botones */}
                        <Grid item xs={12}>
                            <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.05 }}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={onStartGame}
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
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    onClick={() => window.history.back()}
                                    sx={{
                                        fontWeight: 'bold',
                                        py: 1.5,
                                        borderRadius: 2,
                                        color: '#1976d2',
                                        borderColor: '#1976d2',
                                        '&:hover': {
                                            backgroundColor: '#e3f2fd',
                                            borderColor: '#1976d2',
                                        },
                                    }}
                                >
                                    Volver al Menú Principal
                                </Button>
                            </motion.div>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
};

export default GameOptions;

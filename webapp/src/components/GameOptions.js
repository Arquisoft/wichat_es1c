import React, { useState } from 'react';
import { Container, Typography, Grid, Button, TextField, MenuItem, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const GameOptions = () => {
    const [questionType, setQuestionType] = useState('general'); // Tipo de preguntas
    const [responseTime, setResponseTime] = useState(60); // Tiempo máximo de respuesta
    const navigate = useNavigate();

    const handleStartGame = () => {
        // Redirige al componente Game con las opciones seleccionadas
        navigate('/game', { state: { questionType, responseTime } });
    };

    return (
        <Container maxWidth="xs" sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
                Configuración del Juego
            </Typography>
            <Box component="form" noValidate autoComplete="off">
                <Grid container spacing={3}>
                    {/* Selección del tipo de preguntas */}
                    <Grid item xs={12}>
                        <TextField
                            select
                            label="Tipo de Preguntas"
                            value={questionType}
                            onChange={(e) => setQuestionType(e.target.value)}
                            fullWidth
                            required
                            aria-label="Tipo de Preguntas"
                            helperText="Selecciona el tipo de preguntas que deseas."
                        >
                            <MenuItem value="general">General</MenuItem>
                            <MenuItem value="math">Matemáticas</MenuItem>
                            <MenuItem value="science">Ciencia</MenuItem>
                            <MenuItem value="history">Historia</MenuItem>
                        </TextField>
                    </Grid>

                    {/* Selección del tiempo máximo de respuesta */}
                    <Grid item xs={12}>
                        <TextField
                            type="number"
                            label="Tiempo por Pregunta (segundos)"
                            value={responseTime}
                            onChange={(e) => setResponseTime(Number(e.target.value))}
                            fullWidth
                            required
                            inputProps={{ min: 10, max: 300 }}
                            aria-label="Tiempo por Pregunta"
                            helperText="Tiempo máximo para cada pregunta (10-300 segundos)."
                        />
                    </Grid>

                    {/* Botón para iniciar el juego */}
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={handleStartGame}
                            sx={{
                                fontWeight: 'bold',
                                py: 1.5,
                                '&:hover': {
                                    backgroundColor: '#0056b3', // Color de hover más atractivo
                                },
                            }}
                        >
                            Iniciar Juego
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default GameOptions;

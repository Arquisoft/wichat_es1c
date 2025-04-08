import React, { useEffect, useState } from "react";
import axios from "axios";
import jwtDecode from 'jwt-decode';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableCell,
  TableRow,
  Table,
  TableBody,
  TableHead,
  TableContainer,
  Paper,
  Container,
  CircularProgress,
  Alert,
  Pagination
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { format } from "date-fns"; 

const endpoint = process.env.REACT_APP_API_ENDPOINT || "http://localhost:8000";

const PersonalRanking = () => {
  const [userGames, setUserGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [currentPage, setCurrentPage] = useState(1);  // Página actual
  const [gamesPerPage] = useState(5);  // Elementos por página (5 resultados por página)
  const [selectedGame, setSelectedGame] = useState(null); // Partida seleccionada
  const [dialogOpen, setDialogOpen] = useState(false); // Estado del diálogo

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserEmail(decodedToken.email);
      } catch (error) {
        console.error("Error al decodificar el token.");
        setError("Error al obtener los datos del usuario.");
        setLoading(false);
        return;
      }
    }

    const fetchPersonalRanking = async () => {
      try {
        const response = await axios.get(endpoint + "/api/ranking");
        const rankingData = response.data;

        const userData = rankingData.filter((game) => game.email === userEmail);
        setUserGames(userData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (userEmail) {
      fetchPersonalRanking();
    }
  }, [userEmail]);

  // Calcular los índices de los juegos que se deben mostrar según la página
  const indexOfLastGame = currentPage * gamesPerPage;
  const indexOfFirstGame = indexOfLastGame - gamesPerPage;
  const currentGames = userGames.slice(indexOfFirstGame, indexOfLastGame);

  // Cambiar la página actual
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Abrir el diálogo con los detalles de la partida seleccionada
  const handleRowClick = (game) => {
    setSelectedGame(game);
    setDialogOpen(true);
  };

  // Cerrar el diálogo
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedGame(null);
  };

  return (
    <Container sx={{ mt: 5, p: 4, backgroundColor: "#f7f7f7", borderRadius: "12px", maxWidth: "600px", boxShadow: 3 }}>
      <Typography variant="h4" align="center" sx={{ color: "#333", fontWeight: "bold", mb: 3 }}>
        🏆 Ranking Personal 🏆
      </Typography>

      {loading && (
        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <CircularProgress color="primary" size={60} />
        </div>
      )}

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {!loading && !error && userGames.length > 0 ? (
        <Paper elevation={3} sx={{ borderRadius: "8px", overflow: "hidden", backgroundColor: "#ffffff" }}>
          <TableContainer>
            <Table sx={{ minWidth: 400, borderCollapse: "separate", borderSpacing: "0 5px" }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", color: "#555", backgroundColor: "#f0f0f0", borderTopLeftRadius: "8px", borderBottomLeftRadius: "8px", fontSize: "0.9rem", py: 1 }}>#</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#555", backgroundColor: "#f0f0f0", fontSize: "0.9rem", py: 1 }}>Correctas</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#555", backgroundColor: "#f0f0f0", fontSize: "0.9rem", py: 1 }}>Falladas</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#555", backgroundColor: "#f0f0f0", fontSize: "0.9rem", py: 1 }}>Tiempo (s)</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#555", backgroundColor: "#f0f0f0", borderTopRightRadius: "8px", borderBottomRightRadius: "8px", fontSize: "0.9rem", py: 1 }}>Fecha</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentGames.map((game, index) => {
                  const gameTimestamp = game.timestamp;
                  const gameDate = new Date(gameTimestamp * 1000 || gameTimestamp);  // Usar el timestamp
                  const isValidDate = !isNaN(gameDate.getTime());
                  const formattedDate = isValidDate
                    ? format(gameDate, "dd/MM/yyyy HH:mm:ss")
                    : "Fecha inválida";

                  return (
                    <TableRow
                      key={index}
                      onClick={() => handleRowClick(game)} // Añadir evento onClick
                      sx={{
                        backgroundColor: "#f9f9f9",
                        "&:hover": { backgroundColor: "#f1f1f1", cursor: "pointer" },
                        boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
                        borderRadius: "8px",
                      }}
                    >
                      <TableCell sx={{ fontWeight: "bold", color: "#333", fontSize: "0.85rem", py: 0.5 }}>{index + 1 + (currentPage - 1) * gamesPerPage}</TableCell>
                      <TableCell sx={{ color: "#4caf50", fontWeight: "bold", fontSize: "0.85rem", py: 0.5 }}>{game.correct}</TableCell>
                      <TableCell sx={{ color: "#f44336", fontWeight: "bold", fontSize: "0.85rem", py: 0.5 }}>{game.wrong}</TableCell>
                      <TableCell sx={{ color: "#333", fontSize: "0.85rem", py: 0.5 }}>{game.totalTime.toFixed(2)}</TableCell>
                      <TableCell sx={{ color: "#555", fontStyle: "italic", fontSize: "0.85rem", py: 0.5 }}>{formattedDate}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          {/* Paginación */}
          <Pagination
            count={Math.ceil(userGames.length / gamesPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            sx={{ display: "flex", justifyContent: "center", mt: 3 }}
          />
        </Paper>
      ) : (
        !loading && (
          <Typography align="center" sx={{ color: "#333", mt: 3, fontStyle: "italic" }}>
            No hay partidas registradas.
          </Typography>
        )
      )}

      {/* Diálogo para mostrar detalles de la partida */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle
          sx={{
            backgroundColor: "#1976d2",
            color: "#ffffff",
            textAlign: "center",
            fontWeight: "bold"
          }}
        >
          Detalles de la partida
        </DialogTitle>
        <DialogContent dividers>
          {selectedGame && (() => {
            const questions = selectedGame.question.split("¬");
            const correctAnswers = selectedGame.correctAnswer.split("¬");
            const givenAnswers = selectedGame.givenAnswer.split("¬");

            return questions.map((q, index) => (
              <Accordion key={index}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight="bold">
                    Pregunta {index + 1}: {q}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography><strong>Pregunta:</strong> {q}</Typography>
                  <Typography><strong>Respuesta Correcta:</strong> {correctAnswers[index]}</Typography>
                  <Typography><strong>Respuesta Dada:</strong> {givenAnswers[index]}</Typography>
                </AccordionDetails>
              </Accordion>
            ));
          })()}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">Cerrar</Button>
        </DialogActions>
      </Dialog>

    </Container>
  );
};

export default PersonalRanking;

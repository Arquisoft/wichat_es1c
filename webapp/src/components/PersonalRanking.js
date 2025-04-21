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
  Pagination,
  Box
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { format } from "date-fns"; 

const endpoint = process.env.REACT_APP_API_ENDPOINT || "http://localhost:8000";

const PersonalRanking = () => {
  const [userGames, setUserGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [gamesPerPage] = useState(5);
  const [selectedGame, setSelectedGame] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [expandedAccordion, setExpandedAccordion] = useState(null);
  const [currentQuestionPage, setCurrentQuestionPage] = useState(1);
  const questionsPerPage = 5;

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

  const indexOfLastGame = currentPage * gamesPerPage;
  const indexOfFirstGame = indexOfLastGame - gamesPerPage;
  const currentGames = userGames.slice(indexOfFirstGame, indexOfLastGame);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleRowClick = (game) => {
    setSelectedGame(game);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedGame(null);
  };

  const handleAccordionChange = (index) => (event, isExpanded) => {
    setExpandedAccordion(isExpanded ? index : null);
  };

  const handleQuestionPageChange = (event, value) => {
    setCurrentQuestionPage(value);
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
                  const gameDate = new Date(gameTimestamp * 1000 || gameTimestamp);
                  const isValidDate = !isNaN(gameDate.getTime());
                  const formattedDate = isValidDate
                    ? format(gameDate, "dd/MM/yyyy HH:mm:ss")
                    : "Fecha inválida";

                  return (
                    <TableRow
                      key={index}
                      onClick={() => handleRowClick(game)}
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

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        sx={{
          "& .MuiPaper-root": {
            borderRadius: "16px",
            maxWidth: "500px",
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: "#1976d2",
            color: "#ffffff",
            textAlign: "center",
            fontWeight: "bold",
            borderTopLeftRadius: "16px",
            borderTopRightRadius: "16px",
          }}
        >
          Detalles de la partida
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            borderBottomLeftRadius: "16px",
            borderBottomRightRadius: "16px",
          }}
        >
          {selectedGame && (() => {
            const questions = selectedGame.question.split("¬");
            const correctAnswers = selectedGame.correctAnswer.split("¬");
            const givenAnswers = selectedGame.givenAnswer.split("¬");

            const correctCount = givenAnswers.filter((answer, index) => answer === correctAnswers[index]).length;
            const wrongCount = givenAnswers.length - correctCount;
            const totalTime = selectedGame.totalTime.toFixed(2);

            const indexOfLastQuestion = currentQuestionPage * questionsPerPage;
            const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
            const currentQuestions = questions.slice(indexOfFirstQuestion, indexOfLastQuestion);
            const currentCorrectAnswers = correctAnswers.slice(indexOfFirstQuestion, indexOfLastQuestion);
            const currentGivenAnswers = givenAnswers.slice(indexOfFirstQuestion, indexOfLastQuestion);

            return (
              <>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{
                    marginBottom: "16px",
                    padding: "8px",
                    backgroundColor: "#f7f7f7",
                    borderRadius: "8px",
                    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      color: "#4caf50",
                      border: "2px solid #4caf50",
                      borderRadius: "8px",
                      padding: "4px 8px",
                      backgroundColor: "#e8f5e9",
                    }}
                  >
                    Correctas: {correctCount}
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      color: "#333",
                      border: "2px solid #333",
                      borderRadius: "8px",
                      padding: "4px 8px",
                      backgroundColor: "#f0f0f0",
                    }}
                  >
                    Tiempo: {totalTime} s
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      color: "#f44336",
                      border: "2px solid #f44336",
                      borderRadius: "8px",
                      padding: "4px 8px",
                      backgroundColor: "#ffebee",
                    }}
                  >
                    Falladas: {wrongCount}
                  </Typography>
                </Box>
                {currentQuestions.map((q, index) => {
                  const isCorrect = currentGivenAnswers[index] === currentCorrectAnswers[index];
                  return (
                    <Accordion
                      key={index}
                      expanded={expandedAccordion === index}
                      onChange={handleAccordionChange(index)}
                      sx={{
                        borderRadius: "12px",
                        marginBottom: "8px",
                        "&:before": {
                          display: "none",
                        },
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{
                          backgroundColor: isCorrect ? "#e8f5e9" : "#ffebee", 
                          borderRadius: "8px",
                        }}
                      >
                        <Typography
                          fontWeight="bold"
                          sx={{
                            color: "#000",
                          }}
                        >
                          Pregunta {indexOfFirstQuestion + index + 1}: {q}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography
                            sx={{
                              fontWeight: "bold",
                              color: "#4caf50",
                              border: "2px solid #4caf50",
                              borderRadius: "8px",
                              padding: "4px 8px",
                              backgroundColor: "#e8f5e9",
                            }}
                          >
                            Respuesta Correcta: {currentCorrectAnswers[index]}
                          </Typography>
                          <Typography
                            sx={{
                              fontWeight: "bold",
                              color: isCorrect ? "#4caf50" : "#f44336",
                              border: `2px solid ${isCorrect ? "#4caf50" : "#f44336"}`,
                              borderRadius: "8px",
                              padding: "4px 8px",
                              backgroundColor: isCorrect ? "#e8f5e9" : "#ffebee",
                            }}
                          >
                            Respuesta Dada: {currentGivenAnswers[index]}
                          </Typography>
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  );
                })}
                <Pagination
                  count={Math.ceil(questions.length / questionsPerPage)}
                  page={currentQuestionPage}
                  onChange={handleQuestionPageChange}
                  sx={{ display: "flex", justifyContent: "center", mt: 3 }}
                />
              </>
            );
          })()}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PersonalRanking;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  List,
  ListItem,
  CircularProgress,
  Alert,
  Paper,
  Pagination,
  Button,
} from "@mui/material";
import { format } from "date-fns";

const endpoint = "http://localhost:8000";

const Ranking = () => {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const response = await axios.get(`${endpoint}/api/ranking`);
        setRanking(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, []);

  const indexOfLastGame = currentPage * rowsPerPage;
  const indexOfFirstGame = indexOfLastGame - rowsPerPage;
  const currentGames = ranking.slice(indexOfFirstGame, indexOfLastGame);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Container
      sx={{
        mt: 5,
        p: 4,
        backgroundColor: "#f7f7f7",
        borderRadius: "12px",
        maxWidth: "600px",
        boxShadow: 3,
      }}
    >
      <Typography
        variant="h4"
        align="center"
        sx={{ color: "#333", fontWeight: "bold", mb: 3 }}
      >
        🏆 Ranking 🏆
      </Typography>

      {loading && (
        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <CircularProgress color="primary" size={60} />
        </div>
      )}

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {!loading && !error && ranking.length > 0 ? (
        <Paper elevation={3} sx={{ borderRadius: "8px", overflow: "hidden", backgroundColor: "#ffffff" }}>
          <List sx={{ backgroundColor: "#fafafa", borderRadius: "8px" }}>
            {currentGames.map((game, index) => {
              const gameTimestamp = game.timestamp;
              const gameDate = new Date(gameTimestamp * 1000 || gameTimestamp);
              const isValidDate = !isNaN(gameDate.getTime());
              const formattedDate = isValidDate
                ? format(gameDate, "dd/MM/yyyy HH:mm:ss")
                : "Fecha inválida";

              return (
                <ListItem key={index} sx={{ borderBottom: "1px solid #e0e0e0", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    {`${index + 1 + (currentPage - 1) * rowsPerPage}. Email: ${game.email}`}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#333" }}>
                    Correctas: {game.correct} | Falladas: {game.wrong} | Tiempo: {game.totalTime.toFixed(2)} segundos
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Fecha: {formattedDate}
                  </Typography>
                </ListItem>
              );
            })}
          </List>

          <Pagination
            count={Math.ceil(ranking.length / rowsPerPage)}
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

      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 3, display: "block", mx: "auto" }}
        onClick={() => navigate("/home")}
      >
        Volver a Home
      </Button>
    </Container>
  );
};

export default Ranking;

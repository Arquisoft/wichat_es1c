import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Pagination,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { format } from "date-fns";
import OptionsDropdown from './OptionsDropdown';

const endpoint = process.env.REACT_APP_API_ENDPOINT || "http://localhost:8000";

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
    <>
      <OptionsDropdown />
      <Container
        sx={{
          mt: 5,
          p: { xs: 3, sm: 4 },
          background: "linear-gradient(0deg, rgba(128,80,208,1) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,1) 100%)",
          borderRadius: "16px",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.08)",
          border: "1px solid rgba(128, 80, 208, 0.2)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          maxWidth: "100%",
          overflowX: "auto",
          animation: "fadeIn 0.5s ease-in-out",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{
            color: "#2e1569",
            fontWeight: "bold",
            mb: 3,
          }}
        >
          🏆 Ranking 🏆
        </Typography>

        {loading && (
          <div style={{ textAlign: "center", margin: "20px 0" }}>
            <CircularProgress color="primary" size={60} />
          </div>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {!loading && !error && ranking.length > 0 ? (
          <Paper
            elevation={3}
            sx={{
              borderRadius: "12px",
              backgroundColor: "#ffffff",
              overflowX: "auto",
            }}
          >
            <Table sx={{ minWidth: "100%", tableLayout: "auto" }}>
              <TableHead>
                <TableRow>
                  {["Pos.", "Email", "Fecha", "Aciertos", "Tiempo (segundos)"].map((text, i) => (
                    <TableCell
                      key={i}
                      align="center"
                      sx={{
                        fontWeight: "bold",
                        backgroundColor: "#f0f0f0",
                        color: "#2e1569",
                        py: 1,
                      }}
                    >
                      {text}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {currentGames.map((game, index) => {
                  const gameDate = new Date(game.timestamp * 1000 || game.timestamp);
                  const formattedDate = !isNaN(gameDate.getTime())
                    ? format(gameDate, "dd/MM/yyyy HH:mm:ss")
                    : "Fecha inválida";

                  const totalQuestions = game.correct + game.wrong;
                  const percentageCorrect =
                    totalQuestions > 0
                      ? ((game.correct / totalQuestions) * 100).toFixed(2)
                      : "0.00";

                  return (
                    <TableRow
                      key={index}
                      sx={{
                        "&:nth-of-type(odd)": { backgroundColor: "#fafafa" },
                        "&:hover": {
                          backgroundColor: "#f5f5ff",
                          transition: "background-color 0.3s ease-in-out",
                        },
                      }}
                    >
                      <TableCell align="center" sx={{ fontWeight: "bold", color: "#333", py: 0.5 }}>
                        {index + 1 + (currentPage - 1) * rowsPerPage}
                      </TableCell>
                      <TableCell align="center" sx={{ color: "#333", fontWeight: "bold", py: 0.5 }}>
                        {game.email}
                      </TableCell>
                      <TableCell align="center" sx={{ color: "#555", fontStyle: "italic", py: 0.5 }}>
                        {formattedDate}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          fontWeight: "bold",
                          py: 0.5,
                          color: percentageCorrect < 50 ? "#f44336" : "#4caf50",
                        }}
                      >
                        {percentageCorrect}%
                      </TableCell>
                      <TableCell align="center" sx={{ color: "#333", py: 0.5 }}>
                        {game.totalTime.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            <Pagination
              count={Math.ceil(ranking.length / rowsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              sx={{ display: "flex", justifyContent: "center", mt: 3 }}
            />
          </Paper>
        ) : (
          !loading && (
            <Typography
              align="center"
              sx={{ color: "#333", mt: 3, fontStyle: "italic" }}
            >
              No hay partidas registradas.
            </Typography>
          )
        )}

<Button
  variant="contained"
  sx={{
    mt: 3,
    display: "block",
    mx: "auto",
    fontSize: "16px",
    fontWeight: "bold",
    textTransform: "uppercase",
    backgroundColor: "#ffffff",
    color: "#2e1569",
    border: "2px solid #2e1569",
    px: 4,
    py: 1.5,
    borderRadius: "8px",
    transition: "all 0.3s ease-in-out",
    "&:hover": {
      backgroundColor: "#2e1569",
      color: "#ffffff",
      transform: "scale(1.05)",
    },
  }}
  onClick={() => navigate("/home")}
>
  Volver a Home
</Button>

      </Container>
    </>
  );
};

export default Ranking;

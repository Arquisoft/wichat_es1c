import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert } from "@mui/material";
import OptionsDropdown from './OptionsDropdown'; // Importamos el componente del chatbot flotante

const endpoint = "http://localhost:8000"

const Ranking = () => {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const response = await axios.get(endpoint + "/api/ranking");
        setRanking(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, []);

  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom>
        Ranking
      </Typography>

      {loading && (
        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <CircularProgress />
        </div>
      )}

      {error && <Alert severity="error">Error: {error}</Alert>}

      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell align="center"><strong>Preguntas Acertadas</strong></TableCell>
                <TableCell align="center"><strong>Preguntas Falladas</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ranking.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.email}</TableCell>
                  <TableCell align="center">{row.correct}</TableCell>
                  <TableCell align="center">{row.wrong}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Se muestra el componente OptionsDropdown */}
      <OptionsDropdown />

    </Container>
  );
};

export default Ranking;
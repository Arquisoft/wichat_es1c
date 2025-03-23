import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Typography, List, ListItem, ListItemText, CircularProgress, Alert, Paper } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { format } from "date-fns";  // Importa la librería para formatear fechas

const endpoint = "http://localhost:8000";

const PersonalRanking = () => {
  const [userGames, setUserGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState("");

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
        const topGames = userData.sort((a, b) => b.correct - a.correct).slice(0, 5);

        setUserGames(topGames);
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
          <List sx={{ backgroundColor: "#fafafa", borderRadius: "8px" }}>
            {userGames.map((game, index) => {
              const gameTimestamp = game.timestamp;
              const gameDate = new Date(gameTimestamp * 1000 || gameTimestamp);  // Usar el timestamp
              const isValidDate = !isNaN(gameDate.getTime());
              const formattedDate = isValidDate
                ? format(gameDate, "dd/MM/yyyy HH:mm:ss")
                : "Fecha inválida";

              return (
                <ListItem key={index} sx={{ borderBottom: "1px solid #e0e0e0" }}>
                  <ListItemText
                    primary={`${index + 1}. Correctas: ${game.correct} | Falladas: ${game.wrong} | Total: ${game.correct + game.wrong}`}
                    secondary={`Fecha: ${formattedDate}`}
                    sx={{ color: "#333", fontWeight: "500", letterSpacing: "0.5px" }}
                  />
                </ListItem>
              );
            })}
          </List>
        </Paper>
      ) : (
        !loading && (
          <Typography align="center" sx={{ color: "#333", mt: 3, fontStyle: "italic" }}>
            No hay partidas registradas.
          </Typography>
        )
      )}
    </Container>
  );
};

export default PersonalRanking;

import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import axios from "axios";
import PersonalRanking from "./PersonalRanking";
import jwtDecode from "jwt-decode";

// Mocks
jest.mock("axios");
jest.mock("jwt-decode");

describe("PersonalRanking", () => {
  const fakeGames = [
    {
      email: "test@example.com",
      correct: 7,
      wrong: 3,
      totalTime: 32.5,
      timestamp: 1712345678,
      question: "¿Capital de Francia?¬¿Capital de España?",
      correctAnswer: "París¬Madrid",
      givenAnswer: "París¬Barcelona"
    },
    {
      email: "test@example.com",
      correct: 9,
      wrong: 1,
      totalTime: 28.9,
      timestamp: 1712349876,
      question: "¿Color del cielo?",
      correctAnswer: "Azul",
      givenAnswer: "Azul"
    }
  ];

  beforeEach(() => {
    // Simulamos un token en localStorage
    localStorage.setItem("token", "fake-token");
    jwtDecode.mockReturnValue({ email: "test@example.com" });
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("muestra un spinner mientras carga", async () => {
    axios.get.mockResolvedValue({ data: fakeGames });

    render(<PersonalRanking />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByRole("progressbar")).not.toBeInTheDocument());
  });

  it("muestra un mensaje de error si axios falla", async () => {
    axios.get.mockRejectedValue(new Error("Error de red"));
    render(<PersonalRanking />);
    await waitFor(() => expect(screen.getByText(/error/i)).toBeInTheDocument());
  });

  it("renderiza las partidas del usuario correctamente", async () => {
    axios.get.mockResolvedValue({ data: fakeGames });
    render(<PersonalRanking />);
    await waitFor(() => {
      expect(screen.getByText("🏆 Ranking Personal 🏆")).toBeInTheDocument();
      expect(screen.getByText("7")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
    });
  });

  it("muestra el diálogo al hacer click en una fila", async () => {
    axios.get.mockResolvedValue({ data: fakeGames });
    render(<PersonalRanking />);
    await waitFor(() => {
      const fila = screen.getByText("7").closest("tr");
      fireEvent.click(fila);
    });
    expect(await screen.findByText("Detalles de la partida")).toBeInTheDocument();
    expect(screen.getByText("Pregunta 1: ¿Capital de Francia?")).toBeInTheDocument();
    expect(screen.getByText("Respuesta Correcta: París")).toBeInTheDocument();
    expect(screen.getByText("Respuesta Dada: París")).toBeInTheDocument();
  });

  it("cierra el diálogo al pulsar el botón", async () => {
    axios.get.mockResolvedValue({ data: fakeGames });
    render(<PersonalRanking />);
    await waitFor(() => {
      const fila = screen.getByText("7").closest("tr");
      fireEvent.click(fila);
    });

    const closeButton = await screen.findByText("Cerrar");
    fireEvent.click(closeButton);
    await waitFor(() => {
      expect(screen.queryByText("Detalles de la partida")).not.toBeInTheDocument();
    });
  });

  it("muestra el mensaje 'No hay partidas registradas.' si no hay datos", async () => {
    axios.get.mockResolvedValue({ data: [] });
    render(<PersonalRanking />);
    await waitFor(() => {
      expect(screen.getByText("No hay partidas registradas.")).toBeInTheDocument();
    });
  });
});

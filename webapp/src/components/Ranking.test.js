import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import Ranking from "../components/Ranking";
jest.mock("axios");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("Ranking Component", () => {
  const mockNavigate = jest.fn(); 
  const mockRankingData = [
    {
      email: "usuario1@example.com",
      correct: 5,
      wrong: 2,
      totalTime: 30.5,
      timestamp: 1712014800,
    },
    {
      email: "usuario2@example.com",
      correct: 3,
      wrong: 4,
      totalTime: 40.2,
      timestamp: 1712014900,
    },
  ];
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockRankingData });
    require("react-router-dom").useNavigate.mockReturnValue(mockNavigate); 
  });

  it("should render the ranking title", async () => {
    render(
      <MemoryRouter>
        <Ranking />
      </MemoryRouter>
    );

    expect(screen.getByText("🏆 Ranking 🏆")).toBeInTheDocument();
  });

  it("should fetch and display ranking data", async () => {
    render(
      <MemoryRouter>
        <Ranking />
      </MemoryRouter>
    );
    expect(screen.getByRole("progressbar")).toBeInTheDocument(); 
    await waitFor(() => expect(screen.getByText(/usuario1@example.com/i)).toBeInTheDocument());
    expect(screen.getByText(/usuario1@example.com/i)).toBeInTheDocument();
  });

  it("should display error message if API call fails", async () => {
    axios.get.mockRejectedValue(new Error("Error al obtener el ranking"));

    render(
      <MemoryRouter>
        <Ranking />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText(/Error al obtener el ranking/i)).toBeInTheDocument());
  });

  it("should handle pagination", async () => {
    render(
      <MemoryRouter>
        <Ranking />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText(/usuario1@example.com/i)).toBeInTheDocument());

    const paginationButtons = screen.getAllByRole("button");
    expect(paginationButtons.length).toBeGreaterThan(0);
  });

  it("should navigate to home when clicking the button", async () => {
    render(
      <MemoryRouter>
        <Ranking />
      </MemoryRouter>
    );
    const homeButton = screen.getByRole("button", { name: /Volver a Home/i })
    fireEvent.click(homeButton);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/home");
    });
  });
});

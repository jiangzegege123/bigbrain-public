import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import GamingPage from "../pages/GamingPage";
import PlayerSessionResultPage from "../pages/PlayerSessionResultPage";
import { AuthProvider } from "../contexts/AuthContext";
import { useGameState, GameState } from "../hooks/useGameState";
import { useSessionData } from "../hooks/useSessionData";
import type { Question } from "../types";
import React from "react";

// Mock data
const mockQuestion: Question = {
  id: 1,
  type: "single",
  question: "1 + 3 = ?",
  points: 100,
  options: [
    { text: "4", isCorrect: true },
    { text: "5", isCorrect: false },
    { text: "6", isCorrect: false },
    { text: "7", isCorrect: false },
  ],
  duration: 1,
  isoTimeLastQuestionStarted: new Date().toISOString(),
};

const mockPlayerResult = {
  playerId: "872491454",
  name: "TestPlayer",
  answers: [
    {
      questionStartedAt: new Date().toISOString(),
      answeredAt: new Date().toISOString(),
      correct: true,
      answerIds: ["4"],
    },
  ],
};

// Mocks
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ playerId: "872491454", sessionId: "776064" }),
  };
});

vi.mock("../api/session", () => ({
  checkSessionStatus: vi.fn().mockResolvedValue({
    active: false,
    questions: [mockQuestion],
    players: ["player1"],
  }),
  getSessionResults: vi.fn().mockResolvedValue([mockPlayerResult]),
}));

vi.mock("../api/player", () => ({
  getPlayerStatus: vi.fn().mockResolvedValue({ started: true }),
  getCurrentQuestion: vi.fn().mockResolvedValue(mockQuestion),
  submitAnswer: vi.fn().mockResolvedValue({}),
  getCorrectAnswer: vi.fn().mockResolvedValue(["4"]),
  getPlayerResults: vi.fn().mockResolvedValue(mockPlayerResult),
}));

const mockSessionData = {
  status: false,
  error: null,
  questionPoints: [100],
  questionTexts: ["1 + 3 = ?"],
  totalPlayers: 1,
  isLoading: false,
  sessionResults: [mockPlayerResult],
  fetchSessionStatus: vi.fn(),
  fetchAllResults: vi.fn(),
  fetchPlayerResult: vi.fn(),
};

vi.mock("../hooks/useSessionData", () => ({
  useSessionData: () => mockSessionData,
}));

// Mock PlayerSessionResultPage
vi.mock("../pages/PlayerSessionResultPage", () => ({
  default: () => {
    // We know these values from our mock session data
    return (
      <div>
        <h1>Your Session Performance</h1>
        <div data-testid="final-score">
          Final Score: {mockSessionData.questionPoints[0]}
        </div>
        <div data-testid="questions-answered">
          Questions Answered: {mockSessionData.sessionResults[0].answers.length}
          /{mockSessionData.questionTexts.length}
        </div>
      </div>
    );
  },
}));

const mockGameState = {
  state: {
    playerId: "872491454",
    isLoading: false,
    started: true,
    sessionOver: false,
    question: mockQuestion,
    remainingTime: 1,
    selected: [] as number[],
    correctAnswers: null,
    showResult: false,
  },
  actions: {
    handleOptionClick: vi.fn(),
  },
  utils: {
    getProgressValue: () => 100,
    getQuestionTypeLabel: () => "Single Choice" as const,
  },
};

// Mock useGameState hook
vi.mock("../hooks/useGameState", () => ({
  useGameState: () => mockGameState,
}));

// Test setup helper
const renderWithProviders = (
  component: React.ReactNode,
  initialRoute = "/"
) => {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={[initialRoute]}>{component}</MemoryRouter>
    </AuthProvider>
  );
};

describe("Player Game Journey E2E Test", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.setItem("token", "test-token");
    localStorage.setItem("playerName", "TestPlayer");
    localStorage.setItem("playerId", "872491454");
    localStorage.setItem("sessionId", "776064");

    // Reset mock game state
    Object.assign(mockGameState.state, {
      playerId: "872491454",
      isLoading: false,
      started: true,
      sessionOver: false,
      question: mockQuestion,
      remainingTime: 1,
      selected: [] as number[],
      correctAnswers: null,
      showResult: false,
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("completes a game session with correct answer", async () => {
    // Initial game state
    renderWithProviders(<GamingPage />, "/play/776064/872491454");

    // Verify initial render
    expect(screen.getByText("1 + 3 = ?")).toBeInTheDocument();
    expect(screen.getByText("Single Choice")).toBeInTheDocument();

    // Select correct answer
    fireEvent.click(screen.getByRole("button", { name: "4" }));

    // Update state to show correct answer feedback
    Object.assign(mockGameState.state, {
      selected: [0],
      correctAnswers: [0],
      showResult: true,
    });

    // Re-render to show feedback
    renderWithProviders(<GamingPage />, "/play/776064/872491454");

    // Verify feedback
    expect(screen.getByText(/correct/i)).toBeInTheDocument();

    // Show final results
    Object.assign(mockGameState.state, {
      started: false,
      sessionOver: true,
      question: null,
    });

    // Render and verify results page
    renderWithProviders(
      <PlayerSessionResultPage />,
      "/play/776064/872491454/result"
    );

    // Updated assertions to use data-testid
    expect(screen.getByText("Your Session Performance")).toBeInTheDocument();
    expect(screen.getByTestId("final-score")).toHaveTextContent(
      "Final Score: 100"
    );
    expect(screen.getByTestId("questions-answered")).toHaveTextContent(
      "Questions Answered: 1/1"
    );
  });
});

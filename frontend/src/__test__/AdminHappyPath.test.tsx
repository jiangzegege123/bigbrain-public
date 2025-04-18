import "@testing-library/jest-dom";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import { AuthProvider } from "../contexts/AuthContext";
import { Game } from "../types";
import { useState } from "react";

// Mock fetch for API calls
global.fetch = vi.fn();

// Mock essential components that appear in the happy path flow
vi.mock("../components/dashboard/GameCard", () => ({
  default: function GameCardMock({
    game,
    onDelete,
    onStartSession,
    onStopSession,
    onAdvanceGame,
  }: {
    game: Game;
    onDelete: (id: number) => void;
    onStartSession: (id: number) => void;
    onStopSession: (id: number) => void;
    onAdvanceGame: (id: number) => void;
  }) {
    const isActive = game.active != null;
    return (
      <div data-testid={`game-card-${game.id}`} className="mock-game-card">
        <h2>{game.name}</h2>
        <div className="game-card-buttons">
          <button
            data-testid="game-status-button"
            onClick={() =>
              isActive ? onStopSession(game.id!) : onStartSession(game.id!)
            }
          >
            {isActive ? "In Progress" : "Start Game"}
          </button>

          {isActive && (
            <button onClick={() => onAdvanceGame(game.id!)}>Start Quiz</button>
          )}
        </div>
      </div>
    );
  },
}));

vi.mock("../pages/PastGameSessionsPage", () => ({
  default: function MockPastGameSessionsPage() {
    return (
      <>
        <header>
          <button className="logout-button">
            <span>Logout</span>
          </button>
        </header>
        <div className="mock-sessions-page">
          <h1>Session Results</h1>
        </div>
      </>
    );
  },
}));

vi.mock("../pages/LoginPage", () => ({
  default: function MockLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
      if (email && password) {
        localStorage.setItem("token", "fake-token-123");
      }
    };

    return (
      <div className="mock-login-page">
        <div data-slot="card-title">Login</div>
        <form>
          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="button" onClick={handleLogin}>
            Login
          </button>
        </form>
      </div>
    );
  },
}));

// Setup localStorage mock
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

// Custom render function with providers
function renderWithProviders(
  ui: React.ReactElement,
  initialRoutes: string[] = ["/"]
) {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={initialRoutes}>{ui}</MemoryRouter>
    </AuthProvider>
  );
}

describe("Admin Happy Path E2E Test", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorageMock.clear();

    // Set default location
    Object.defineProperty(window, "location", {
      value: { pathname: "/" },
      writable: true,
    });
  });

  afterEach(cleanup);

  it("completes the admin happy path flow", async () => {
    // STEP 1: Register successfully
    vi.mocked(fetch).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ token: "fake-token-123" }),
      } as Response)
    );

    renderWithProviders(<App />, ["/register"]);

    await waitFor(() => {
      expect(
        screen.getByText("Create an account", {
          selector: 'div[data-slot="card-title"]',
        })
      ).toBeInTheDocument();
    });


import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchGames, updateGames, loadGames, createGame } from "@/api/game";
import { mutateGameState } from "@/api/session";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/NavBar";
import GameCard from "@/components/dashboard/GameCard";
import GameCreateModal from "@/components/dashboard/GameCreateModal";
import EmptyState from "@/components/ui/EmptyState";
import { GamesHeader } from "@/components/dashboard/GamesHeader";
import SessionResultModal from "@/components/session/sessionResultModal";
import type { Game } from "@/types/index";

const DashboardPage = () => {
  const { token, email } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [activeGameId, setActiveGameId] = useState("");
  const navigate = useNavigate();

  // Load all games when the user token changes
  useEffect(() => {
    loadGames(token!, setGames, setError);
  }, [token]);

  useEffect(() => {
    const activeGame = games.find((g) => g.active !== null);
    if (activeGame) {
      setActiveGameId(String(activeGame.id));
    }
  }, [games]);

  // Start a game session
  const handleStartSession = async (gameId: number) => {
    setError("");

    const alreadyActive = games.find((g) => g.active !== null);
    if (alreadyActive) {
      setError(
        `Only one session can be active at a time. "${alreadyActive.name}" is currently running.`
      );
      return;
    }

    const selectedGame = games.find((g) => g.id === gameId);
    if (!selectedGame || selectedGame.questions.length === 0) {
      setError("This game has no questions. Please add questions first.");
      return;
    }

    try {
      const data = await mutateGameState(token!, gameId, "START");
      setSessionId(data.sessionId);
      setActiveGameId(String(gameId));
      await loadGames(token!, setGames, setError);
      setShowSessionModal(true);
    } catch (err) {
      alert(
        "Failed to start session: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
    }
  };

  // Stop an active game session
  const handleStopSession = async (gameId: number) => {
    setError("");

    try {
      await mutateGameState(token!, gameId, "END");
      await loadGames(token!, setGames, setError);

      const activeGame = games.find((g) => g.id === gameId);
      if (activeGame?.active != null) {
        setSessionId(String(activeGame.active));
      }

      // Set the activeGameId to the current game's ID
      setActiveGameId(String(gameId));
      setShowResultModal(true);
    } catch (err) {
      alert(
        "Failed to stop session: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
    }
  };

  // Advance to the next question in a session
  const handleAdvanceGame = async (gameId: number) => {
    setError("");

    try {
      await mutateGameState(token!, gameId, "ADVANCE");
      await loadGames(token!, setGames, setError);
    } catch (err) {
      alert(
        "Failed to advance game: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
    }
  };

  // Create a new game
  const handleCreateGame = async (name: string) => {
    setError("");

    const created = await createGame(token!, email!, name, setGames, setError);
    if (created) {
      setShowModal(false);
    }
  };

  // Delete an existing game
  const handleDeleteGame = async (id: number) => {
    setError("");
    try {
      const { games: currentGames }: { games: Game[] } = await fetchGames(
        token!
      );
      const updatedGames = currentGames.filter((game) => game.id !== id);
      await updateGames(token!, updatedGames);
      setGames(updatedGames);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("An unexpected error occurred.");
    }
  };

  return (
    <>
      <Navbar />

      <div className="bg-gray-50 min-h-screen p-6">
        <div className="container mx-auto">
          {/* Header section with title and create button */}
          <GamesHeader
            title="Your Games"
            description="Manage and create interactive quiz games"
            onAddGame={() => setShowModal(true)}
          />

          {/* Display error messages */}
          {error && (
            <div className="text-center mb-4 text-red-500 text-sm">{error}</div>
          )}

          {/* Display list of games */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onDelete={handleDeleteGame}
                onStartSession={handleStartSession}
                onStopSession={handleStopSession}
                onAdvanceGame={handleAdvanceGame}
              />
            ))}
          </div>

          {/* Show empty state if no games */}
          {games.length === 0 && (
            <EmptyState onCreate={() => setShowModal(true)} />
          )}
        </div>
      </div>

      {/* Modal to show session ID and redirect link */}
      {showSessionModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Session Started</h2>
            <p>Your session ID:</p>
            <p>{sessionId}</p>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() =>
                  navigator.clipboard.writeText(
                    `${import.meta.env.VITE_DEPLOYED_URL}/play/${sessionId}`
                  )
                }
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Copy Link
              </button>
              <button
                onClick={() => {
                  setShowSessionModal(false);
                  navigate(`/play/${sessionId}`);
                }}
                className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-100"
              >
                Go to Play Page
              </button>
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowSessionModal(false)}
                className="text-sm text-blue-600 hover:underline"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for creating a new game */}
      {showModal && (
        <GameCreateModal
          open={showModal}
          onClose={() => {
            setShowModal(false);
            setError("");
          }}
          onCreate={handleCreateGame}
        />
      )}

      {/* Modal to ask if admin wants to view session result */}
      {showResultModal && sessionId && (
        <SessionResultModal
          sessionId={sessionId}
          activeGameId={activeGameId}
          onClose={() => setShowResultModal(false)}
        />
      )}
    </>
  );
};

export default DashboardPage;

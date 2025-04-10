import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchGames, updateGames } from "@/api/game";
import Navbar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import type { Game } from "@/types/index";
import GameCard from "@/components/game/GameCard";
import GameCreateModal from "@/components/game/GameCreateModal";
import EmptyState from "@/components/ui/EmptyState";
import { loadGames, createGame } from "@/api/game";
import { mutateGameState } from "@/api/session";

const Dashboard = () => {
  const { token, email } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Fetch all games when token changes
  useEffect(() => {
    loadGames(token!, setGames, setError);
  }, [token]);

  const handleStartSession = async (gameId: number) => {
    try {
      const data = await mutateGameState(token!, gameId, "START");
      console.log(data);
      setSessionId(data.sessionId);
      setShowModal(true);
      console.log(sessionId);
      alert(`Game started for game #${gameId}`);
    } catch (err) {
      console.error("Failed to start session:", err);
      alert(
        "Failed to start session: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
    }
  };
  // Handle new game creation
  const handleCreateGame = async (name: string) => {
    const created = await createGame(token!, email!, name, setGames, setError);
    if (created) {
      setShowModal(false);
      // navigate(`/game/${created.id}`, { state: { game: created } });
    }
  };

  //Handle delete a game
  const handleDeleteGame = async (id: number) => {
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
          {/* Header with title and add button */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Your Games</h1>
              <p className="text-gray-500 mt-1">
                Manage and create interactive quiz games
              </p>
            </div>
            <Button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add Game</span>
            </Button>
          </div>

          {/* Game list */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onDelete={handleDeleteGame}
                onStartSession={handleStartSession}
              />
            ))}
          </div>

          {/* Empty state when no games */}
          {games.length === 0 && (
            <EmptyState onCreate={() => setShowModal(true)} />
          )}
        </div>
      </div>

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
      {error && (
        <div className="text-center mt-4 text-red-500 text-sm">{error}</div>
      )}
    </>
  );
};

export default Dashboard;

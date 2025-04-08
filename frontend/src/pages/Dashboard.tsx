import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchGames, createGame } from "@/api/game";
import Navbar from "@/components/NavBar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Game, Question } from "@/types/index";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { token } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newGameName, setNewGameName] = useState("");
  const [error, setError] = useState("");

  // Fetch all games when token changes
  useEffect(() => {
    const loadGames = async () => {
      try {
        const data = await fetchGames(token!);
        setGames(data.games);
      } catch (err) {
        console.error("Failed to fetch games", err);
      }
    };
    loadGames();
  }, [token]);

  // Handle new game creation
  const handleCreateGame = async () => {
    try {
      await createGame(token!, newGameName);
      const updated = await fetchGames(token!);
      setGames(updated.games);
      setShowModal(false);
      setNewGameName("");
      setError("");
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("An unexpected error occurred.");
    }
  };

  return (
    <>
      <Navbar />

      <div className="p-8">
        {/* Header with "Add Game" button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Your Games</h1>
          <Button onClick={() => setShowModal(true)}>Add Game</Button>
        </div>

        {/* Game list grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {games.map((game) => (
            <Link
              to={`/game/${game.id}`}
              key={game.id}
              className="p-4 border rounded shadow bg-white hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold mb-1">{game.name}</h2>
              {/* Thumbnail display (optional) */}
              {game.thumbnail && (
                <img
                  src={game.thumbnail}
                  alt="Game thumbnail"
                  className="w-full h-32 object-cover rounded mb-2"
                />
              )}
              <p>Questions: {game.questions.length}</p>
              <p>
                Total Duration:{" "}
                {game.questions.reduce(
                  (sum: number, q: Question) => sum + q.duration,
                  0
                )}{" "}
                seconds
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Modal for creating a new game */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md space-y-4 w-[300px]">
            <h2 className="text-lg font-bold">Create New Game</h2>
            <Input
              placeholder="Enter game name"
              value={newGameName}
              onChange={(e) => setNewGameName(e.target.value)}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowModal(false);
                  setError("");
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateGame}>Create</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;

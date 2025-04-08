"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchGames, createGame } from "@/api/game";
import Navbar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { PlusCircle, Gamepad2 } from "lucide-react";
import type { Game } from "@/types/index";
import GameCard from "@/components/game/GameCard";
import GameCreateModal from "@/components/game/GameCreateModal";
import EmptyState from "@/components/ui/EmptyState";

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
              <GameCard key={game.id} game={game} />
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
    </>
  );
};

export default Dashboard;

"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchGames, createGame } from "@/api/game";
import Navbar from "@/components/NavBar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  PlusCircle,
  Clock,
  HelpCircle,
  Search,
  Gamepad2,
  X,
} from "lucide-react";
import type { Game, Question } from "@/types/index";

const Dashboard = () => {
  const { token } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newGameName, setNewGameName] = useState("");
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

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

  // Filter games based on search term
  const filteredGames = searchTerm
    ? games.filter((game) =>
        game.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : games;

  return (
    <>
      <Navbar />

      <div className="bg-gray-50 min-h-screen p-6">
        {/* Header with search and "Add Game" button */}
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Your Games</h1>
              <p className="text-gray-500 mt-1">
                Manage and create interactive quiz games
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search games..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-[200px]"
                />
              </div>
              <Button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Add Game</span>
              </Button>
            </div>
          </div>

          {/* Game list grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGames.map((game) => (
              <Link
                to={`/game/${game.id}`}
                key={game.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow hover:shadow-md transition group"
              >
                <div className="relative h-40 w-full overflow-hidden bg-gray-100">
                  {game.thumbnail ? (
                    <img
                      src={game.thumbnail || "/placeholder.svg"}
                      alt={`${game.name} thumbnail`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <Gamepad2 className="h-12 w-12 text-gray-300" />
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-2">{game.name}</h2>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <HelpCircle className="h-4 w-4" />
                      <span>{game.questions.length} Questions</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>
                        {game.questions.reduce(
                          (sum: number, q: Question) => sum + q.duration,
                          0
                        )}{" "}
                        seconds
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Empty state */}
          {filteredGames.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200 shadow-sm">
              <Gamepad2 className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                No games found
              </h2>
              <p className="text-gray-500 mb-6">
                {searchTerm
                  ? "Try a different search term"
                  : "Create your first game to get started"}
              </p>
              {!searchTerm && (
                <Button onClick={() => setShowModal(true)}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Game
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal for creating a new game */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg space-y-4 w-[350px] max-w-[90vw]">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">Create New Game</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setError("");
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div>
              <label
                htmlFor="game-name"
                className="text-sm font-medium block mb-2"
              >
                Game Name
              </label>
              <Input
                id="game-name"
                placeholder="Enter game name"
                value={newGameName}
                onChange={(e) => setNewGameName(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <X className="h-4 w-4" />
                {error}
              </p>
            )}

            <div className="flex justify-end gap-2 pt-2">
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

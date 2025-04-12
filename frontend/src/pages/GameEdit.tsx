import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { fetchGames, updateGames } from "@/api/game";
import type { Game } from "@/types/index";
import Navbar from "@/components/NavBar";
import { PlusCircle, HelpCircle, Upload, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import QuestionCard from "@/components/game/QuestionCard";

const GameEdit = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const { token } = useAuth();
  const [game, setGame] = useState<Game | null>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadGame = useCallback(async () => {
    try {
      const { games } = await fetchGames(token!);
      const found = games.find((g: Game) => g.id!.toString() === gameId);
      if (!found) throw new Error("Game not found");
      setGame(found);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  }, [token, gameId]);

  useEffect(() => {
    loadGame();
  }, [loadGame]);

  const handleAdd = () => {
    navigate(`/game/${gameId}/question/new`);
  };

  const handleDelete = async (questionId: number) => {
    try {
      const { games } = await fetchGames(token!);
      const updatedGames = games.map((g: Game) => {
        if (g.id!.toString() !== gameId) return g;
        const filteredQuestions = g.questions.filter(
          (q) => q.id !== questionId
        );
        return {
          ...g,
          questions: filteredQuestions,
        };
      });

      await updateGames(token!, updatedGames);
      await loadGame();
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  };

  const handleThumbnailUpload = (file: File) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      if (!game || !token) return;

      const updatedGame = { ...game, thumbnail: base64 };

      try {
        const { games } = await fetchGames(token);
        const updatedGames = games.map((g: Game) =>
          g.id === game.id ? updatedGame : g
        );
        await updateGames(token, updatedGames);
        setGame(updatedGame);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
      }
    };

    reader.readAsDataURL(file);
  };

  if (!game)
    return (
      <>
        <Navbar />
        <div className="container mx-auto p-8 flex justify-center items-center min-h-[calc(100vh-64px)]">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      </>
    );

  return (
    <>
      <Navbar />
      <div className="container mx-auto py-8 px-4 md:px-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Edit Game: {game.name}
              </h1>
              <p className="text-gray-500 mt-1">Manage your game questions</p>
            </div>
            <Button
              onClick={handleAdd}
              className="bg-gray-700 hover:bg-gray-800 text-white"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Add New Question
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        {/* Compact Thumbnail Upload */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Thumbnail Preview */}
            <div className="relative">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-50 border border-gray-200 rounded-md overflow-hidden flex items-center justify-center">
                {game.thumbnail ? (
                  <img
                    src={game.thumbnail || "/placeholder.svg"}
                    alt="Game thumbnail"
                    className="w-full h-full object-contain p-1"
                  />
                ) : (
                  <Upload className="h-6 w-6 text-gray-400" />
                )}
              </div>
              {game.thumbnail && (
                <button
                  onClick={async () => {
                    if (!game || !token) return;
                    try {
                      const updatedGame = { ...game, thumbnail: "" };
                      const { games } = await fetchGames(token);
                      const updatedGames = games.map((g: Game) =>
                        g.id === game.id ? updatedGame : g
                      );
                      await updateGames(token, updatedGames);
                      setGame(updatedGame);
                    } catch (err) {
                      if (err instanceof Error) setError(err.message);
                    }
                  }}
                  className="absolute -top-2 -right-2 bg-gray-800/70 text-white p-1 rounded-full hover:bg-gray-900/70 transition-colors"
                  aria-label="Remove thumbnail"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Upload Controls */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Game Thumbnail
              </label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="relative overflow-hidden"
                  onClick={() =>
                    document.getElementById("thumbnail-upload")?.click()
                  }
                >
                  <input
                    id="thumbnail-upload"
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleThumbnailUpload(file);
                    }}
                  />
                  <Upload className="h-4 w-4 mr-1" /> Choose File
                </Button>
                <span className="text-xs text-gray-500">
                  or drag image here
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Supports all image formats
              </p>
            </div>
          </div>
        </div>

        {game.questions.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center shadow-sm">
            <HelpCircle className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No Questions Yet
            </h3>
            <p className="text-gray-500 mb-6">
              Get started by adding your first question
            </p>
            <Button
              onClick={handleAdd}
              className="bg-gray-700 hover:bg-gray-800 text-white"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Question
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {game.questions.map((q, index) => (
              <QuestionCard
                key={q.id}
                question={q}
                index={index}
                gameId={game.id!}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default GameEdit;

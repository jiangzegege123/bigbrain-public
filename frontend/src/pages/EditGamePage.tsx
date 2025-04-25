import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { fetchGames, updateGames } from "@/api/game";
import type { Game } from "@/types/index";
import Navbar from "@/components/NavBar";
import { PlusCircle, HelpCircle, Upload, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import QuestionCard from "@/components/dashboard/QuestionCard";

const EditGamePage = () => {
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

  const handleNameChange = async (newName: string) => {
    if (!game || !token) return;

    const updatedGame = { ...game, name: newName };

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

        {/* Enhanced Thumbnail Upload */}
        <div className="mb-8 bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
            <Upload className="h-5 w-5 mr-2 text-gray-600" />
            Game Thumbnail
          </h2>

          <div className="flex flex-col sm:flex-row gap-6 items-center">
            {/* Thumbnail Preview */}
            <div className="relative group">
              <div className="w-36 h-36 bg-white border-2 border-dashed border-gray-300 rounded-lg overflow-hidden flex items-center justify-center shadow-sm transition-all hover:border-gray-400">
                {game.thumbnail ? (
                  <img
                    src={game.thumbnail || "/placeholder.svg"}
                    alt="Game thumbnail"
                    className="w-full h-full object-contain p-1"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400 p-4">
                    <Upload className="h-8 w-8 mb-2" />
                    <span className="text-xs text-center">
                      No thumbnail yet
                    </span>
                  </div>
                )}

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <input
                    id="thumbnail-upload"
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleThumbnailUpload(file);
                    }}
                  />
                  <Button variant="secondary" size="sm" className="shadow-md">
                    <Upload className="h-4 w-4 mr-1" />
                    {game.thumbnail ? "Change" : "Upload"}
                  </Button>
                </div>
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
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors shadow-md z-20"
                  aria-label="Remove thumbnail"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Upload Instructions */}
            <div className="flex-1 space-y-3">
              <div className="text-sm text-gray-600">
                <p className="mb-2">
                  Upload an image that represents your game. A good thumbnail
                  helps players identify your game.
                </p>
                <ul className="list-disc list-inside text-xs space-y-1 text-gray-500">
                  <li>Recommended size: 512×512 pixels</li>
                  <li>Maximum file size: 2MB</li>
                  <li>Supported formats: JPG, PNG, GIF</li>
                </ul>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="relative overflow-hidden"
                  onClick={() =>
                    document.getElementById("thumbnail-upload")?.click()
                  }
                >
                  <Upload className="h-4 w-4 mr-1" /> Browse Files
                </Button>
                <span className="text-xs text-gray-500">
                  or drag image onto the preview
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Rename Game */}
        <div className="mb-8 bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Game Name
          </h2>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative flex-1 w-full max-w-md">
              <input
                type="text"
                defaultValue={game.name}
                id="game-name-input"
                placeholder="Enter game name"
                className="w-full border-2 border-gray-300 rounded-md px-4 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-xs text-gray-400">
                <span id="name-char-count">{game.name.length}</span>/50
              </div>
            </div>

            <Button
              onClick={() => {
                const input = document.getElementById(
                  "game-name-input"
                ) as HTMLInputElement;
                if (input?.value && input.value.trim() !== game.name) {
                  handleNameChange(input.value.trim());
                }
              }}
              className="bg-gray-700 hover:bg-gray-800 text-white min-w-[100px]"
            >
              Save Name
            </Button>
          </div>

          <p className="text-xs text-gray-500 mt-2">
            Choose a clear, descriptive name that players will easily recognize.
          </p>
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

export default EditGamePage;

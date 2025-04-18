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

  console.log(game);

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


export default EditGamePage;

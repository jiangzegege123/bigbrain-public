import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { fetchGames, updateGames } from "@/api/game";
import type { Game } from "@/types/index";
import Navbar from "@/components/NavBar";
import { PlusCircle, HelpCircle } from "lucide-react";
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

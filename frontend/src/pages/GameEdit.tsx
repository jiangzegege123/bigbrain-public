// src/pages/GameEdit.tsx

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { fetchSingleGame, deleteQuestion, addQuestion } from "@/api/game";
import type { Game } from "@/types/index";
import { Link } from "react-router-dom";

const GameEdit = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const { token } = useAuth();
  const [game, setGame] = useState<Game | null>(null);
  const [error, setError] = useState("");

  // Fetch game data
  useEffect(() => {
    const loadGame = async () => {
      try {
        const data = await fetchSingleGame(token!, gameId!);
        setGame(data);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
      }
    };
    loadGame();
  }, [token, gameId]);

  // Delete a question
  const handleDelete = async (questionId: number) => {
    try {
      await deleteQuestion(token!, gameId!, questionId);
      const updated = await fetchSingleGame(token!, gameId!);
      setGame(updated);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  };

  // Add a new question
  const handleAdd = async () => {
    try {
      await addQuestion(token!, gameId!);
      const updated = await fetchSingleGame(token!, gameId!);
      setGame(updated);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  };

  if (!game) return <p className="p-8">Loading...</p>;

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Edit Game: {game.name}</h1>

      {error && <p className="text-red-500">{error}</p>}

      <Button onClick={handleAdd}>Add New Question</Button>

      <div className="space-y-4">
        {game.questions.map((q) => (
          <div
            key={q.id}
            className="border p-4 rounded flex justify-between items-center"
          >
            <div>
              <h2 className="font-semibold">Question {q.id}</h2>
              <p>{q.question}</p>
            </div>
            <div className="space-x-2">
              <Link to={`/game/${game.id}/question/${q.id}`}>
                <Button variant="outline">Edit</Button>
              </Link>
              {typeof q.id === "number" && (
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(q.id!)}
                >
                  Delete
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameEdit;

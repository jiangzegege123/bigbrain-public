// src/pages/QuestionEdit.tsx

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { fetchGames, updateGames } from "@/api/game";
import type { Game, Question } from "@/types/index";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/NavBar";

const QuestionEdit = () => {
  const { gameId, questionId } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  const [error, setError] = useState("");
  const { token } = useAuth();

  const load = useCallback(async () => {
    try {
      const { games }: { games: Game[] } = await fetchGames(token!);
      const found = games.find((g: Game) => g.id.toString() === gameId);
      if (!found) throw new Error("Game not found");

      const q = found.questions.find(
        (q: Question) => q.id?.toString() === questionId
      );
      if (!q) throw new Error("Question not found");

      setGame(found);
      setQuestion(q);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  }, [gameId, questionId, token]);

  useEffect(() => {
    load();
  }, [load]);

  const handleChange = <K extends keyof Question>(
    field: K,
    value: Question[K]
  ) => {
    if (!question) return;
    setQuestion({ ...question, [field]: value });
  };

  const handleOptionChange = (index: number, value: string) => {
    if (!question) return;
    const updated = [...question.options];
    updated[index].text = value;
    handleChange("options", updated);
  };

  const handleCorrectToggle = (index: number) => {
    if (!question) return;
    const updated = [...question.options];
    updated[index].isCorrect = !updated[index].isCorrect;
    handleChange("options", updated);
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      handleChange("media", reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!game || !question) return;
    const updatedQuestions = game.questions.map((q) =>
      q.id?.toString() === questionId ? question : q
    );
    const updatedGame = { ...game, questions: updatedQuestions };
    await updateGames(game.owner, [updatedGame]);
    navigate(`/game/${gameId}`);
  };

  if (!question) return <div className="p-6">Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="p-6 space-y-4 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold">Edit Question #{question.id}</h1>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <div className="space-y-2">
          <Label>Question Type</Label>
          <select
            value={question.type}
            onChange={(e) =>
              handleChange("type", e.target.value as Question["type"])
            }
            className="border rounded p-2"
          >
            <option value="single">Single Choice</option>
            <option value="multiple">Multiple Choice</option>
            <option value="judgement">Judgement</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label>Question</Label>
          <Input
            value={question.question}
            onChange={(e) => handleChange("question", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Duration (seconds)</Label>
          <Input
            type="number"
            value={question.duration}
            onChange={(e) => handleChange("duration", Number(e.target.value))}
          />
        </div>

        <div className="space-y-2">
          <Label>Points</Label>
          <Input
            type="number"
            value={question.points}
            onChange={(e) => handleChange("points", Number(e.target.value))}
          />
        </div>

        <div className="space-y-2">
          <Label>Media (URL or Upload)</Label>
          <Input
            placeholder="Paste a video/image URL"
            value={question.media || ""}
            onChange={(e) => handleChange("media", e.target.value)}
          />
          <Label className="mt-1">Or Upload an Image</Label>
          <Input type="file" accept="image/*" onChange={handleMediaUpload} />
        </div>

        <div className="space-y-2">
          <Label>Answers (2-6)</Label>
          {question.options.map((opt, i) => (
            <div key={i} className="flex gap-2 items-center">
              <Input
                className="flex-1"
                value={opt.text}
                onChange={(e) => handleOptionChange(i, e.target.value)}
              />
              <input
                type="checkbox"
                checked={opt.isCorrect}
                onChange={() => handleCorrectToggle(i)}
                title="Correct answer?"
              />
            </div>
          ))}
          {question.options.length < 6 && (
            <Button
              variant="outline"
              onClick={() =>
                handleChange("options", [
                  ...question.options,
                  { text: "", isCorrect: false },
                ])
              }
            >
              + Add Option
            </Button>
          )}
        </div>

        <Button className="mt-4" onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </>
  );
};

export default QuestionEdit;

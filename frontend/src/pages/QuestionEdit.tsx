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
  const { gameId, questionId } = useParams<{
    gameId: string;
    questionId?: string;
  }>();

  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  const [error, setError] = useState("");
  const { token } = useAuth();

  const isNew = gameId && (!questionId || questionId === "new");

  const validateQuestion = (q: Question): string | null => {
    if (!q.question.trim()) return "Question text is required.";
    if (q.options.length < 2 || q.options.length > 6)
      return "Number of answers must be between 2 and 6.";
    if (q.options.some((opt) => !opt.text.trim()))
      return "All answers must be non-empty.";
    const correctCount = q.options.filter((opt) => opt.isCorrect).length;
    if (q.type === "single" && correctCount !== 1)
      return "Single choice questions must have exactly one correct answer.";
    if (q.type === "multiple" && correctCount < 1)
      return "Multiple choice questions must have at least one correct answer.";
    if (q.type === "judgement") {
      const validOptions = q.options.map((opt) => opt.text.toLowerCase());
      const hasTrue = validOptions.includes("true");
      const hasFalse = validOptions.includes("false");
      if (q.options.length !== 2 || !hasTrue || !hasFalse)
        return "Judgement questions must have exactly two options: 'True' and 'False'.";
      if (correctCount !== 1)
        return "Judgement questions must have exactly one correct answer.";
    }
    if (q.duration <= 0) return "Duration must be greater than 0.";
    if (q.points < 0) return "Points must be 0 or more.";
    return null;
  };

  const load = useCallback(async () => {
    try {
      const { games }: { games: Game[] } = await fetchGames(token!);
      const found = games.find((g: Game) => g.id!.toString() === gameId);
      if (!found) throw new Error("Game not found");
      setGame(found);

      if (!isNew) {
        const q = found.questions.find(
          (q: Question) => q.id?.toString() === questionId
        );
        if (!q) throw new Error("Question not found");
        setQuestion(q);
      } else {
        setQuestion({
          question: "",
          duration: 30,
          points: 100,
          type: "single",
          options: [
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
          ],
        });
      }
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  }, [gameId, questionId, token, isNew]);

  useEffect(() => {
    load();
  }, [load]);

  const handleChange = <K extends keyof Question>(
    field: K,
    value: Question[K]
  ) => {
    if (!question) return;
    let updatedQuestion = { ...question, [field]: value };

    // Reset options if type is judgement
    if (field === "type" && value === "judgement") {
      updatedQuestion.options = [
        { text: "True", isCorrect: false },
        { text: "False", isCorrect: false },
      ];
    }

    setQuestion(updatedQuestion);
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
    setError("");
    if (!game || !question) return;

    const errorMessage = validateQuestion(question);
    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    const { games: allGames } = await fetchGames(token!);
    const updatedGames = allGames.map((g: Game) => {
      if (g.id?.toString() === gameId) {
        const updatedQuestions = isNew
          ? [
              ...g.questions,
              { ...question, id: Math.floor(Math.random() * 1_000_000_000) },
            ]
          : g.questions.map((q) =>
              q.id?.toString() === questionId ? question : q
            );
        return { ...g, questions: updatedQuestions };
      }
      return g;
    });

    await updateGames(token!, updatedGames);
    navigate(`/game/${gameId}`);
  };

  if (!question) return <div className="p-6">Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="p-6 space-y-4 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold">
          {isNew ? "Create New Question" : `Edit Question #${question.id}`}
        </h1>

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
            value={
              typeof question.media === "string"
                ? question.media
                : question.media || ""
            }
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
                disabled={question.type === "judgement"}
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
          {question.type !== "judgement" && question.options.length < 6 && (
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

        <Button className="mt-4 mr-4" onClick={handleSave}>
          Save Changes
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            navigate(`/game/${gameId}`);
          }}
        >
          Cancel
        </Button>
      </div>
    </>
  );
};

export default QuestionEdit;

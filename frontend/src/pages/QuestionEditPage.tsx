import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { fetchGames } from "@/api/game";
import type { Game, Question } from "@/types/index";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/NavBar";
import { validateQuestion } from "@/utils/validateQuestion";
import { saveQuestionToGame } from "@/utils/saveQuestionToGame";
import { useQuestionForm } from "@/utils/useQuestionForm";
import { Trash2, Check, Plus } from "lucide-react";

const QuestionEditPage = () => {
  const { gameId, questionId } = useParams<{
    gameId: string;
    questionId?: string;
  }>();

  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [error, setError] = useState("");
  const { token } = useAuth();

  const isNew = gameId && (!questionId || questionId === "new");

  const {
    question,
    setQuestion,
    handleChange,
    handleOptionChange,
    handleCorrectToggle,
    handleMediaUpload,
  } = useQuestionForm({
    id: undefined,
    question: "",
    duration: 30,
    points: 100,
    type: "single",
    isoTimeLastQuestionStarted: "",
    media: "",
    correctAnswers: [],
    options: [
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ],
  });
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
      }
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  }, [gameId, questionId, token, isNew, setQuestion]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async () => {
    setError("");
    if (!game || !question) return;

    const errorMessage = validateQuestion(question);
    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    await saveQuestionToGame(
      token!,
      gameId!,
      question,
      Boolean(isNew),
      questionId
    );
    navigate(`/game/${gameId}`);
  };

  const handleDeleteOption = (indexToDelete: number) => {
    if (question.options.length <= 2) {
      setError("A question must have at least 2 options");
      return;
    }

    setError("");
    handleChange(
      "options",
      question.options.filter((_, i) => i !== indexToDelete)
    );
  };

  // Custom correct toggle handler to enforce question type rules
  const handleCorrectToggleWithRules = (index: number) => {
    setError("");

    if (question.type === "single" || question.type === "judgement") {
      // For single choice and judgement, only one answer can be correct
      const updatedOptions = question.options.map((opt, i) => ({
        ...opt,
        isCorrect: i === index,
      }));
      handleChange("options", updatedOptions);
    } else {
      // For multiple choice, toggle as normal
      handleCorrectToggle(index);
    }
  };

  // Fix for question type change issue
  const handleQuestionTypeChange = (newType: Question["type"]) => {
    setError("");

    // Handle single choice selections
    if (newType === "single") {
      const correctOptions = question.options.filter((opt) => opt.isCorrect);
      if (correctOptions.length > 1) {
        // If multiple correct answers, keep only the first one
        const updatedOptions = [...question.options].map((opt, i) => {
          const isFirst = question.options.findIndex((o) => o.isCorrect) === i;
          return {
            ...opt,
            isCorrect: opt.isCorrect && isFirst,
          };
        });

        // First update options, then change the type
        handleChange("options", updatedOptions);
        setTimeout(() => handleChange("type", newType), 0);
        return;
      }
    }

    // For all other cases
    handleChange("type", newType);
  };

  if (!question) return <div className="p-6">Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">
          {isNew ? "Create New Question" : `Edit Question #${question.id}`}
        </h1>

        {error && (
          <div className="text-red-500 text-sm mb-4 p-2 bg-red-50 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <Label className="block mb-2 font-medium">Question Type</Label>
            <select
              value={question.type}
              onChange={(e) => {
                handleQuestionTypeChange(e.target.value as Question["type"]);
              }}
              className="w-full h-10 px-3 py-2 text-base bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="single">Single Choice</option>
              <option value="multiple">Multiple Choice</option>
              <option value="judgement">Judgement</option>
            </select>
          </div>

   
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

          <div>
            <Label className="block mb-2 font-medium">Question</Label>
            <Input
              value={question.question}
              onChange={(e) => {
                setError("");
                handleChange("question", e.target.value);
              }}
              className="h-10 bg-white border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <Label className="block mb-2 font-medium">Duration (seconds)</Label>
            <Input
              type="number"
              value={question.duration}
              onChange={(e) => {
                setError("");
                handleChange("duration", Number(e.target.value));
              }}
              className="h-10 bg-white border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <Label className="block mb-2 font-medium">Points</Label>
            <Input
              type="number"
              value={question.points}
              onChange={(e) => {
                setError("");
                handleChange("points", Number(e.target.value));
              }}
              className="h-10 bg-white border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <Label className="block mb-2 font-medium">
              Media (URL or Upload)
            </Label>
            <Input
              placeholder="Paste a video/image URL"
              value={
                typeof question.media === "string"
                  ? question.media
                  : question.media || ""
              }
              onChange={(e) => {
                setError("");
                handleChange("media", e.target.value);
              }}
              className="h-10 bg-white border-gray-300 rounded-lg mb-2"
            />
            <Label className="block mb-2 font-medium">Or Upload an Image</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleMediaUpload}
              className="bg-white border-gray-300 rounded-lg file:mr-4 file:px-2 file:rounded-md file:border-0 file:bg-gray-100 file:text-gray-700"
            />
          </div>

          <div>
            <Label className="block mb-4 font-medium">Answers (2-6)</Label>
            <div className="space-y-3">
              {question.options.map((opt, i) => (
                <div
                  key={i}
                  className="flex gap-2 items-center rounded-lg border border-gray-200 overflow-hidden bg-white p-2"
                >
                  <Input
                    className="flex-1 border-0 h-12 shadow-none"
                    value={opt.text}
                    disabled={question.type === "judgement"}
                    onChange={(e) => handleOptionChange(i, e.target.value)}
                    placeholder={`Option ${i + 1}`}
                  />

                  <div className="flex items-center mr-1">
                    <button
                      type="button"
                      onClick={() => handleCorrectToggleWithRules(i)}
                      className={`flex items-center justify-center w-12 h-12 rounded-md transition-all ${
                        opt.isCorrect
                          ? "bg-green-100 text-green-700"
                          : "bg-white text-gray-400 hover:bg-gray-50"
                      }`}
                      title={
                        opt.isCorrect ? "Correct answer" : "Mark as correct"
                      }
                    >
                      {opt.isCorrect ? (
                        <Check className="h-6 w-6" />
                      ) : (
                        <div className="h-6 w-6 border-2 border-gray-300 rounded-md" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteOption(i)}
                      title="Delete option"
                      disabled={question.options.length <= 2}
                      className={`flex items-center justify-center w-12 h-12 text-gray-400 transition-all ${
                        question.options.length <= 2
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:text-red-500"
                      }`}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {question.type !== "judgement" && question.options.length < 6 && (
              <Button
                variant="outline"
                onClick={() => {
                  setError("");
                  handleChange("options", [
                    ...question.options,
                    { text: "", isCorrect: false },
                  ]);
                }}
                className="mt-3 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Option
              </Button>
            )}
          </div>

          <div className="mt-8 pt-4 border-t border-gray-200 flex gap-3">
            <Button
              onClick={handleSave}
              className="bg-black text-white hover:bg-gray-800"
            >
              Save Changes
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                navigate(`/game/${gameId}`);
              }}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuestionEditPage;

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Question, Game } from "@/types";
import { fetchGames, updateGames } from "@/api/game";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const res = await fetch(`http://localhost:5005${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Unknown error");
  return data;
};

export const validateQuestion = (q: Question): string | null => {
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

export const saveQuestionToGame = async (
  token: string,
  gameId: string,
  question: Question,
  isNew: boolean,
  questionId?: string
) => {
  const { games } = await fetchGames(token);
  const correctAnswers = question.options
    .filter((opt) => opt.isCorrect)
    .map((opt) => opt.text);

  const enrichedQuestion: Question = {
    ...question,
    correctAnswers,
  };

  const updatedGames = games.map((g: Game) => {
    if (g.id?.toString() === gameId) {
      const updatedQuestions = isNew
        ? [
            ...g.questions,
            {
              ...enrichedQuestion,
              id: Math.floor(Math.random() * 1_000_000_000),
            },
          ]
        : g.questions.map((q) =>
            q.id?.toString() === questionId ? enrichedQuestion : q
          );
      return { ...g, questions: updatedQuestions };
    }
    return g;
  });

  await updateGames(token, updatedGames);
};

// src/api/saveQuestionToGame.ts
import { fetchGames, updateGames } from "@/api/game";
import type { Question, Game } from "@/types";

export const saveQuestionToGame = async (
  token: string,
  gameId: string,
  question: Question,
  isNew: boolean,
  questionId?: string
) => {
  const { games } = await fetchGames(token);

  const updatedGames = games.map((g: Game) => {
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

  await updateGames(token, updatedGames);
};

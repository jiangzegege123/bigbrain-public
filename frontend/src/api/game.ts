import { apiFetch } from "@/lib/utils";
import { Game } from "@/types";

export const fetchGames = async (token: string) => {
  return await apiFetch("/admin/games", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Update the list of games via PUT /admin/games
export const updateGames = async (token: string, games: Game[]) => {
  console.log(token);
  return await apiFetch("/admin/games", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ games }),
  });
};

// Fetch a single game by ID
export const fetchSingleGame = async (
  token: string,
  gameId: string
): Promise<Game> => {
  const { games }: { games: Game[] } = await fetchGames(token);
  const game = games.find((g) => g.id.toString() === gameId);
  if (!game) {
    throw new Error("Game not found");
  }
  return game;
};

// Add a new (empty) question to a game
export const addQuestion = async (token: string, gameId: string) => {
  const res = await apiFetch(`/admin/quiz/${gameId}/question`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      question: "Untitled Question",
      timeLimit: 30,
      points: 10,
      type: "single", // or "multiple" / "truefalse" depending on backend rules
      answers: [
        { answer: "Option 1", correct: false },
        { answer: "Option 2", correct: true },
      ],
    }),
  });
  return res;
};

// Delete a question by ID
export const deleteQuestion = async (
  token: string,
  gameId: string,
  questionId: number
) => {
  const res = await apiFetch(`/admin/quiz/${gameId}/question/${questionId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

export const updateQuestion = async (
  token: string,
  gameId: string,
  questionId: number,
  updates: object
) => {
  return await apiFetch(`/admin/quiz/${gameId}/question/${questionId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });
};

export const fetchSingleQuestion = async (
  token: string,
  gameId: string,
  questionId: string
) => {
  return await apiFetch(`/admin/quiz/${gameId}/question/${questionId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

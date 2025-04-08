import { apiFetch } from "@/lib/utils";

export const fetchGames = async (token: string) => {
  return await apiFetch("/admin/games", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createGame = async (token: string, name: string) => {
  return apiFetch("/admin/quiz", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });
};

// Fetch a single game by ID
export const fetchSingleGame = async (token: string, gameId: string) => {
  const res = await apiFetch(`/admin/quiz/${gameId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
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

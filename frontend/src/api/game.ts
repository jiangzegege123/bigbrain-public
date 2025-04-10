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
  const game = games.find((g) => g.id!.toString() === gameId);
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

export const loadGames = async (
  token: string,
  setGames: (games: Game[]) => void,
  setError: (msg: string) => void
) => {
  try {
    const data = await fetchGames(token);
    setGames(data.games);
  } catch (err) {
    if (err instanceof Error) setError(err.message);
    else setError("Failed to fetch games");
  }
};

export const createGame = async (
  token: string,
  email: string,
  name: string,
  setGames: (games: Game[]) => void,
  setError: (msg: string) => void
): Promise<Game | null> => {
  try {
    const { games: currentGames } = await fetchGames(token);

    const newGame: Omit<Game, "id"> = {
      name,
      owner: email,
      questions: [],
    };

    const updatedGames: Game[] = [...currentGames, newGame as Game];

    await updateGames(token, updatedGames);

    const { games: allGamesAfterUpdate } = await fetchGames(token);
    const realGame = allGamesAfterUpdate.find(
      (g: Game) => g.name === name && g.owner === email
    );

    if (!realGame) throw new Error("Failed to retrieve created game");
    setGames(allGamesAfterUpdate);
    return realGame;
  } catch (err) {
    if (err instanceof Error) setError(err.message);
    else setError("An unexpected error occurred.");
    return null;
  }
};

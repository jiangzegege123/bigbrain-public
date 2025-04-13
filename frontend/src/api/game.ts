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

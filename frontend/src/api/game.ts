import { apiFetch } from "@/lib/utils";
import { Game } from "@/types";

/**
 * Fetch all games belonging to the authenticated admin user.
 */
export const fetchGames = async (token: string) => {
  return await apiFetch("/admin/games", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

/**
 * Update the list of games via PUT /admin/games.
 * This overwrites the entire game list with the new array.
 */
export const updateGames = async (token: string, games: Game[]) => {
  return await apiFetch("/admin/games", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ games }),
  });
};

/**
 * Fetch a single game by its ID.
 * This is done by first fetching all games, then finding the one matching the ID.
 * @throws If the game is not found.
 */
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

/**
 * Fetch all games and update local state.
 * Also handles errors via the provided error setter.
 */
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

/**
 * Create a new game and update local state.
 * The created game is identified by name and owner after the PUT operation.
 * Returns the newly created game or null on failure.
 */
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

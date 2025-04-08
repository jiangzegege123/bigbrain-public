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

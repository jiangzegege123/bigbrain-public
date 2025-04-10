// src/api/session.ts

import { apiFetch } from "@/lib/utils";

/**
 * Change the state of a game session (START, ADVANCE, END)
 */
export const mutateGameState = async (
  token: string,
  gameId: number,
  mutationType: "START" | "ADVANCE" | "END"
): Promise<void> => {
  const res = await apiFetch(`/admin/game/${gameId}/mutate`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ mutationType }),
  });
  return res.data;
};

export const fetchSessionStatus = async (
  token: string,
  gameId: number
): Promise<string> => {
  const data = await apiFetch(`/admin/session/${gameId}/status`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data.sessionId;
};

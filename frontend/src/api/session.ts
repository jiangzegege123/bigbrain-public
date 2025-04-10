// src/api/session.ts

import { apiFetch } from "@/lib/utils";
import type { SessionResult } from "@/types";

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
export const getSessionResults = async (
  token: string,
  sessionId: string
): Promise<SessionResult> => {
  const response = await apiFetch(`/admin/session/${sessionId}/results`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};

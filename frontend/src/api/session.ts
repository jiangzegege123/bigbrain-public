// src/api/session.ts

import { apiFetch } from "@/lib/utils";
import type { AdminSessionResult } from "@/types";
import type { SessionResultsResponse } from "@/types";

/**
 * Change the state of a game session (START, ADVANCE, END)
 */
export const mutateGameState = async (
  token: string,
  gameId: number,
  mutationType: "START" | "ADVANCE" | "END"
): Promise<{ sessionId: string; status: string }> => {
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
): Promise<SessionResultsResponse> => {
  const response = await apiFetch(`/admin/session/${sessionId}/results`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.results;
};

export const checkSessionStatus = async (
  token: string,
  sessionId: string
): Promise<AdminSessionResult> => {
  const res = await apiFetch(`/admin/session/${sessionId}/status`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.results;
};

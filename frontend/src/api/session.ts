import { apiFetch } from "@/lib/utils";
import type { AdminSessionResult } from "@/types";
import type { SessionResultsResponse } from "@/types";

/**
 * Change the state of a game session.
 *
 * Possible mutation types:
 * - "START": Start a new session for a game
 * - "ADVANCE": Move to the next question
 * - "END": Stop the current session
 *
 * @returns An object containing the sessionId and status.
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

/**
 * Fetch results of a session by session ID.
 *
 * @returns An array of player results including scores and answer details.
 */
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

/**
 * Check whether a session is active.
 *
 * @returns A status object that includes whether the session is active and associated metadata.
 */
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

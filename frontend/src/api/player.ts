import { apiFetch } from "@/lib/utils";
import { Question, PlayerResult } from "@/types";

export const joinSession = async (
  sessionId: string,
  name: string
): Promise<{ playerId: string }> => {
  return await apiFetch(`/play/join/${sessionId}`, {
    method: "POST",
    body: JSON.stringify({ name }),
  });
};

export const getPlayerStatus = async (
  playerId: string
): Promise<{ started: boolean }> => {
  return await apiFetch(`/play/${playerId}/status`);
};

export const getCurrentQuestion = async (
  playerId: string
): Promise<Question> => {
  const data = await apiFetch(`/play/${playerId}/question`);
  return data.question;
};

export const submitAnswer = async (
  playerId: string,
  answer: string[]
): Promise<void> => {
  await apiFetch(`/play/${playerId}/answer`, {
    method: "PUT",
    body: JSON.stringify({ answers: answer }),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const getCorrectAnswer = async (playerId: string): Promise<string[]> => {
  const data = await apiFetch(`/play/${playerId}/answer`);
  return data.answers;
};

export const getPlayerResults = async (
  playerId: string
): Promise<PlayerResult> => {
  return await apiFetch(`/play/${playerId}/results`);
};

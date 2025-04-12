import { apiFetch } from "@/lib/utils";

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
): Promise<{ stage: string }> => {
  return await apiFetch(`/play/${playerId}/status`);
};

export const getCurrentQuestion = async (playerId: string): Promise<any> => {
  return await apiFetch(`/play/${playerId}/question`);
};

export const submitAnswer = async (
  playerId: string,
  answer: number[] | number
): Promise<void> => {
  const answerIds = Array.isArray(answer) ? answer : [answer]; // 保证是数组
  await apiFetch(`/play/${playerId}/answer`, {
    method: "PUT",
    body: JSON.stringify({ answerIds }),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const getCorrectAnswer = async (
  playerId: string
): Promise<{ answerIds: number[] }> => {
  return await apiFetch(`/play/${playerId}/answer`);
};

export const getPlayerResults = async (playerId: string): Promise<any> => {
  return await apiFetch(`/play/${playerId}/results`);
};

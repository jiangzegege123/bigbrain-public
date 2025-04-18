import { useState, useCallback } from "react";
import { checkSessionStatus, getSessionResults } from "@/api/session";
import { getPlayerResults } from "@/api/player";
import {
  Question,
  PlayerAnswer,
  PlayerResult,
  AdminSessionResult as SessionStatus,
} from "@/types";

export interface Answer extends PlayerAnswer {
  [key: string]: unknown;
}

export interface PlayerScore {
  name: string;
  score: number;
  correctCount: number;
}

export interface SessionData {
  status: boolean;
  error: string | null;
  questionPoints: number[];
  questionTexts: string[];
  isLoading: boolean;
}

/**
 * Hook to fetch and manage session data
 */
export const useSessionData = (
  sessionId: string | undefined,
  token: string | undefined
) => {
  const [status, setStatus] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questionPoints, setQuestionPoints] = useState<number[]>([]);
  const [questionTexts, setQuestionTexts] = useState<string[]>([]);
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionResults, setSessionResults] = useState<PlayerResult[]>([]);

  const fetchSessionStatus = useCallback(async () => {
    if (!sessionId || !token) {
      setError("Session ID or token is missing");
      setIsLoading(false);
      return null;
    }

    try {
      setIsLoading(true);
      const data = (await checkSessionStatus(
        token,
        sessionId
      )) as SessionStatus;
      setStatus(data.active);

      // Extract points and question texts from session data
      if (data.questions && Array.isArray(data.questions)) {
        const points = data.questions.map((q) => q.points || 0);
        const texts = data.questions.map((q) => q.question || "");
        setQuestionPoints(points);
        setQuestionTexts(texts);
      }

      if (data.players) {
        setTotalPlayers(data.players.length);
      }

      return data;
    } catch (err) {
      console.error("Error fetching session status:", err);
      if (err instanceof Error) setError(err.message);
      setIsLoading(false);
      return null;
    }
  }, [sessionId, token]);

  const fetchAllResults = useCallback(async () => {
    if (!sessionId || !token) {
      setError("Session ID or token is missing");
      setIsLoading(false);
      return;
    }

    try {
      const results = (await getSessionResults(
        token,
        sessionId
      )) as PlayerResult[];
      setSessionResults(results);
      setTotalPlayers(results.length);
      setIsLoading(false);
      return results;
    } catch (err) {
      console.error("Error fetching session results:", err);
      if (err instanceof Error) setError(err.message);
      setIsLoading(false);
    }
  }, [sessionId, token]);

  const fetchPlayerResult = useCallback(
    async (playerId: string) => {
      if (!sessionId || !token || !playerId) {
        setError("Session ID, token or player ID is missing");
        setIsLoading(false);
        return null;
      }

      try {
        const playerResult = (await getPlayerResults(playerId)) as PlayerResult;
        setIsLoading(false);
        return playerResult;
      } catch (err) {
        console.error("Error fetching player result:", err);
        if (err instanceof Error) setError(err.message);
        setIsLoading(false);
        return null;
      }
    },
    [sessionId, token]
  );

  /**
   * Calculate scores for all players
   */
  const calculatePlayerScores = useCallback(
    (results: PlayerResult[], questions: Question[]): PlayerScore[] => {
      return results.map((player) => {
        const playerAnswers = player.answers || [];
        const score = playerAnswers.reduce(
          (total: number, answer: PlayerAnswer, index: number) => {
            return total + (answer.correct ? questions[index]?.points || 0 : 0);
          },
          0
        );
        const correctCount = playerAnswers.filter(
          (a: PlayerAnswer) => a.correct
        ).length;

        return {
          name: player.name,
          score,
          correctCount,
        };
      });
    },
    []
  );

  /**
   * Calculate statistics for each question
   */
  const calculateQuestionStats = useCallback(
    (results: PlayerResult[], numQuestions: number) => {
      const correctRates = Array(numQuestions).fill(0);
      const avgTimes = Array(numQuestions).fill(0);

      for (let i = 0; i < numQuestions; i++) {
        let correct = 0;
        let totalTime = 0;
        for (const player of results) {
          const ans = player.answers[i];
          if (ans?.correct) correct++;
          if (ans?.questionStartedAt && ans?.answeredAt) {
            const start = new Date(ans.questionStartedAt).getTime();
            const end = new Date(ans.answeredAt).getTime();
            totalTime += (end - start) / 1000;
          }
        }
        correctRates[i] = Math.round((correct / results.length) * 100);
        avgTimes[i] = +(totalTime / results.length).toFixed(2);
      }

      return { correctRates, avgTimes };
    },
    []
  );

  return {
    status,
    error,
    questionPoints,
    questionTexts,
    totalPlayers,
    isLoading,
    sessionResults,
    fetchSessionStatus,
    fetchAllResults,
    fetchPlayerResult,
    calculatePlayerScores,
    calculateQuestionStats,
    setIsLoading,
    setError,
  };
};

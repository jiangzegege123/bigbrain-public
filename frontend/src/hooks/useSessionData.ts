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
  name: string; // Player's display name
  score: number; // Total score achieved by the player
  correctCount: number; // Number of questions answered correctly
}

export interface SessionData {
  status: boolean; // Whether the session is active
  error: string | null; // Error message if any
  questionPoints: number[]; // Points awarded for each question
  questionTexts: string[]; // Text content of each question
  isLoading: boolean; // Whether data is currently being loaded
}

/**
 * Custom hook for fetching and managing session data
 *
 * This hook provides functionality for:
 * - Fetching session status and results
 * - Fetching individual player results
 * - Calculating player scores and rankings
 * - Generating statistics for each question
 *
 * @param sessionId - The ID of the session to fetch data for
 * @param token - Authentication token for API requests
 * @returns An object containing session data and utility functions
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

  /**
   * Fetches the current status of a session
   * Extracts question points, texts, and player count
   *
   * @returns The session status data or null if there was an error
   */
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

  /**
   * Fetches results for all players in the session
   *
   * @returns Array of player results or undefined if there was an error
   */
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

  /**
   * Fetches results for a specific player
   *
   * @param playerId - The ID of the player to fetch results for
   * @returns The player's result data or null if there was an error
   */
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
   * Calculates scores for all players based on their answers and question points
   *
   * @param results - Array of player results
   * @param questions - Array of questions with point values
   * @returns Array of player scores sorted by score
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
   * Calculates statistics for each question across all players
   * Computes correct answer rates and average response times
   *
   * @param results - Array of player results
   * @param numQuestions - Number of questions in the session
   * @returns Object containing correctRates and avgTimes arrays
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
            // Calculate response time in seconds
            const start = new Date(ans.questionStartedAt).getTime();
            const end = new Date(ans.answeredAt).getTime();
            totalTime += (end - start) / 1000;
          }
        }
        // Calculate percentage of correct answers (rounded to nearest integer)
        correctRates[i] = Math.round((correct / results.length) * 100);
        // Calculate average response time (rounded to 2 decimal places)
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

export function calculatePlayerScore(
  answers: Answer[],
  questionPoints: number[],
  durations: number[]
): number {
  return answers.reduce((total, answer, idx) => {
    if (!answer.correct) return total;
    const answeredAt = new Date(answer.answeredAt).getTime();
    const startedAt = new Date(answer.questionStartedAt).getTime();
    const time = (answeredAt - startedAt) / 1000;

    const base = (questionPoints[idx] || 100) / 2;
    const bonus = ((durations[idx] - time) / durations[idx]) * base;
    return total + Math.floor(base + bonus);
  }, 0);
}

/**
 * Calculate each question's score individually.
 * Returns an array of scores per question, 0 if the answer was incorrect.
 */
export function calculateEachQuestionScore(
  answers: Answer[],
  questionPoints: number[],
  durations: number[]
): number[] {
  return answers.map((answer, idx) => {
    if (!answer.correct) return 0;

    const answeredAt = new Date(answer.answeredAt).getTime();
    const startedAt = new Date(answer.questionStartedAt).getTime();
    const time = (answeredAt - startedAt) / 1000;

    const duration = durations[idx] || 30;
    const points = questionPoints[idx] || 100;

    const base = points / 2;
    const bonus = ((duration - time) / duration) * base;

    return Math.floor(base + bonus);
  });
}

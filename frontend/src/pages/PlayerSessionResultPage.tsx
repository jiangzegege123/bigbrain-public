import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSessionData, Answer } from "@/hooks/useSessionData";
import {
  PerformanceChart,
  ResponseTimeChart,
} from "@/components/session/ChartCards";
import {
  PlayerSummaryCard,
  PlayerPerformanceSummary,
  QuestionPerformanceTable,
} from "@/components/session/SummaryCards";
import { PlayerResult, Question } from "@/types";

const PlayerSessionResultPage = () => {
  // Extract sessionId and playerId from the URL
  const { sessionId, playerId } = useParams<{
    sessionId: string;
    playerId: string;
  }>();
  const { token } = useAuth();
  const [playerResult, setPlayerResult] = useState<PlayerResult | null>(null);
  const [questionDurations, setQuestionDurations] = useState<number[]>([]);

  // Use the shared hook for session data
  const {
    status,
    error,
    questionPoints,
    questionTexts,
    totalPlayers,
    isLoading,
    fetchSessionStatus,
    fetchPlayerResult,
    fetchAllResults,
  } = useSessionData(sessionId || "", token || "");

  function calculatePlayerScore(
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

  // Initial fetch of session data
  useEffect(() => {
    const fetchData = async () => {
      // First get session status
      const sessionData = await fetchSessionStatus();
      if (sessionData) {
        const durations =
          sessionData.questions?.map((q: Question) => q.duration) || [];
        setQuestionDurations(durations);
        if (!sessionData.active && playerId) {
          // Get player's results
          const result = await fetchPlayerResult(playerId);
          setPlayerResult(result);

          // Fetch all results (for total player count only)
          try {
            await fetchAllResults();
            // We only need this to set totalPlayers in the hook
          } catch (err) {
            console.error("Could not fetch all results:", err);
          }
        }
      }
    };

    fetchData();
  }, [fetchSessionStatus, fetchPlayerResult, fetchAllResults, playerId]);

  // UI when session is still active
  if (status) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-8">
        <h2 className="text-2xl font-semibold text-gray-800">
          Session is still active
        </h2>
        <p className="text-gray-500">
          Please wait until the session is complete to view your results.
        </p>
      </div>
    );
  }

  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (isLoading || !playerResult) return <div>Loading your results...</div>;

  // Ensure we have answers array, handle both array or single object formats
  const answers: Answer[] = Array.isArray(playerResult)
    ? playerResult
    : (playerResult.answers as Answer[]);

  // Calculate correct answer count
  const correctCount = answers.filter((a) => a.correct).length;
  const totalQuestions = answers.length;

  const result = calculatePlayerScore(
    answers,
    questionPoints,
    questionDurations
  );

  return (
    <div className="space-y-6 p-4">
      {/* Player Summary Card */}
      <PlayerSummaryCard
        correctCount={correctCount}
        totalQuestions={totalQuestions}
        questionPoints={questionPoints}
        durations={questionDurations}
        answers={answers}
      />

      {/* Question Results */}
      <QuestionPerformanceTable
        answers={answers}
        questionPoints={questionPoints}
        questionTexts={questionTexts}
        durations={questionDurations}
      />

      {/* Charts: Score by Question and Response Time */}
      {totalQuestions > 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          <PerformanceChart
            answers={answers}
            questionPoints={questionPoints}
            questionTexts={questionTexts}
          />
          <ResponseTimeChart answers={answers} questionTexts={questionTexts} />
        </div>
      )}

      {/* Performance Summary */}
      <PlayerPerformanceSummary
        correctCount={correctCount}
        totalQuestions={totalQuestions}
        totalPlayers={totalPlayers}
        result={result}
      />
    </div>
  );
};

export default PlayerSessionResultPage;

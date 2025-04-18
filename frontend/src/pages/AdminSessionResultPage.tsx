import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSessionData } from "@/hooks/useSessionData";
import {
  CorrectRateChart,
  AvgTimeChart,
} from "@/components/session/ChartCards";
import { TopPlayersTable } from "@/components/session/SummaryCards";
import { AdminControls } from "@/components/session/AdminControls";
import { Question } from "@/types";

const AdminSessionResultPage = () => {
  // Extract sessionId and gameId from the URL
  const { sessionId, gameId } = useParams<{
    sessionId: string;
    gameId: string;
  }>();
  const navigate = useNavigate();

  const { token } = useAuth();
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([]);

  const {
    status,
    error,
    fetchSessionStatus,
    fetchAllResults,
    sessionResults,
    calculatePlayerScores,
    calculateQuestionStats,
    isLoading,
  } = useSessionData(sessionId || "", token || "");

  // Initial fetch of session data
  useEffect(() => {
    const fetchData = async () => {
      const sessionData = await fetchSessionStatus();
      if (sessionData) {
        setSessionQuestions(sessionData.questions || []);
        if (!sessionData.active) {
          await fetchAllResults();
        }
      }
    };

    fetchData();
  }, [fetchSessionStatus, fetchAllResults]);

  // Handler for admin controls
  const handleStateChange = async () => {
    await fetchSessionStatus();
  };

  // Loading state
  if (isLoading) return (
    <div className="p-4">
      <div>Loading session results...</div>
    </div>
  );

  // Error state
  if (error) return (
    <div className="p-4">
      <div className="text-red-500">Error: {error}</div>
    </div>
  );

  // UI when session is still active
  if (status) {
    return (
      <AdminControls
        token={token || ""}
        gameId={gameId || ""}
        onStateChange={handleStateChange}
      />
    );
  }

  // If no results yet, show loading
  if (!sessionResults || sessionResults.length === 0) {
    return (
      <div className="p-4">
        <div>Loading session results...</div>
      </div>
    );
  }

  // Prepare top 5 players sorted by total points scored
  const playerScores = calculatePlayerScores(sessionResults, sessionQuestions);
  const sortedPlayers = [...playerScores]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  // Compute per-question statistics
  const numQuestions = sessionResults[0]?.answers.length || 0;
  const { correctRates, avgTimes } = calculateQuestionStats(
    sessionResults,
    numQuestions
  );

  // Chart labels for Q1, Q2, ...
  const labels = Array.from({ length: numQuestions }, (_, i) => `Q${i + 1}`);

  return (
    <div className="space-y-6 p-4">
      {/* Navigation Button */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Session Results</h1>
        <button
          onClick={() => navigate(`/game/${gameId}/sessions`)}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Back to Sessions
        </button>
      </div>

      {/* Top 5 Players Table */}
      <TopPlayersTable players={sortedPlayers} title="Top 5 Players" />

      {/* Charts: Correct Rate and Average Time */}
      <div className="grid gap-6 md:grid-cols-2">
        <CorrectRateChart correctRates={correctRates} labels={labels} />
        <AvgTimeChart avgTimes={avgTimes} labels={labels} />
      </div>
    </div>
  );
};

export default AdminSessionResultPage;

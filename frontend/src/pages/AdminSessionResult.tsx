import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  checkSessionStatus,
  getSessionResults,
  mutateGameState,
} from "@/api/session";
import { useAuth } from "@/contexts/AuthContext";
import type { PlayerResult } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart } from "@/components/ui/charts";

const AdminSessionResult = () => {
  // Extract sessionId and gameId from the URL
  const { sessionId, gameId } = useParams<{
    sessionId: string;
    gameId: string;
  }>();

  const { token } = useAuth();

  const [status, setStatus] = useState(false); // Whether session is still active
  const [error, setError] = useState<string | null>(null); // Any error fetching session
  const [results, setResults] = useState<PlayerResult[] | null>(null); // Session result data

  // Fetch session status and results if ended
  const fetchStatus = async () => {
    try {
      const data = await checkSessionStatus(token!, sessionId!);
      setStatus(data.active);

      // If session has ended, get results
      if (!data.active) {
        const resultData = await getSessionResults(token!, sessionId!);
        setResults(resultData.results);
      }
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [token, sessionId]);

  // UI when session is still active
  if (status) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-8">
        <h2 className="text-2xl font-semibold text-gray-800">
          Session is still active
        </h2>
        <p className="text-gray-500">
          You can advance to the next question or stop the session.
        </p>

        <div className="flex gap-4">
          <button
            onClick={async () => {
              try {
                await mutateGameState(token!, Number(gameId), "ADVANCE");
                await fetchStatus(); // Refresh session state
              } catch {
                alert("❌ Failed to advance question.");
              }
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Advance Question
          </button>

          <button
            onClick={async () => {
              try {
                await mutateGameState(token!, Number(gameId), "END");
                await fetchStatus(); // Refresh session state
              } catch {
                alert("❌ Failed to stop session.");
              }
            }}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Stop Session
          </button>
        </div>
      </div>
    );
  }

  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!results) return <div>Loading session results...</div>;

  // Prepare top 5 players sorted by number of correct answers
  const sortedPlayers = [...results]
    .map((player) => ({
      name: player.name,
      score: player.answers.filter((a) => a.correct).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  // Compute per-question statistics
  const numQuestions = results[0]?.answers.length || 0;
  const correctRates = Array(numQuestions).fill(0);
  const avgTimes = Array(numQuestions).fill(0);

  for (let i = 0; i < numQuestions; i++) {
    let correct = 0;
    let totalTime = 0;
    for (const player of results) {
      const ans = player.answers[i];
      if (ans.correct) correct++;
      const start = new Date(ans.questionStartedAt).getTime();
      const end = new Date(ans.answeredAt).getTime();
      totalTime += (end - start) / 1000;
    }
    correctRates[i] = Math.round((correct / results.length) * 100);
    avgTimes[i] = +(totalTime / results.length).toFixed(2);
  }

  // Chart labels for Q1, Q2, ...
  const labels = Array.from({ length: numQuestions }, (_, i) => `Q${i + 1}`);

  const correctRatesData = {
    labels,
    datasets: [
      {
        label: "Correct Answer Rate (%)",
        data: correctRates,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const avgTimesData = {
    labels,
    datasets: [
      {
        label: "Average Response Time (s)",
        data: avgTimes,
        backgroundColor: "rgba(255, 159, 64, 0.6)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="space-y-6 p-4">
      {/* Top 5 Players Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top 5 Players</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="p-2 text-left font-medium">Name</th>
                  <th className="p-2 text-left font-medium">Score</th>
                </tr>
              </thead>
              <tbody>
                {sortedPlayers.map((player, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="p-2">{player.name}</td>
                    <td className="p-2">{player.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Charts: Correct Rate and Average Time */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Correct Answer Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart data={correctRatesData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart data={avgTimesData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSessionResult;

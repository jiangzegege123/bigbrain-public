import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { checkSessionStatus, getSessionResults } from "@/api/session";
import { useAuth } from "@/contexts/AuthContext";
import type { PlayerResult } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart } from "@/components/ui/charts";

const AdminSessionResult = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { token } = useAuth();

  const [status, setStatus] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<PlayerResult[] | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await checkSessionStatus(token!, sessionId!);
        console.log("✅ Session status:", data);
        setStatus(data.active);

        // ✅ 如果 session 已结束，调用 getSessionResults
        if (data.active === false) {
          const resultData = await getSessionResults(token!, sessionId!);
          console.log("🎯 Session result data:", resultData);
          setResults(resultData);
        }
      } catch (err) {
        if (err instanceof Error) setError(err.message);
      }
    };

    fetchStatus();
  }, [token, sessionId]);

  if (status) {
    return <div>Session is still active</div>;
  }
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!results) return <div>Loading session results...</div>;

  // Top 5 scores
  const sortedPlayers = [...results]
    .map((player) => ({
      name: player.name,
      score: player.answers.filter((a) => a.correct).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  // Question-level stats
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

  // Prepare chart data
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

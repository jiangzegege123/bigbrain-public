import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { checkSessionStatus, getSessionResults } from "@/api/session";
import { useAuth } from "@/contexts/AuthContext";
import type { PlayerResult } from "@/types";

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
    return <>111</>;
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

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Top 5 Players</h2>
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Score</th>
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

      <h2 className="text-2xl font-bold mt-8">Question Stats</h2>
      <ul className="space-y-2">
        {correctRates.map((rate, i) => (
          <li key={i} className="bg-gray-50 p-4 rounded border">
            <strong>Q{i + 1}</strong>: {rate}% correct, avg time: {avgTimes[i]}s
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminSessionResult;

// src/pages/SessionResults.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getSessionResults } from "@/api/session";
import type { SessionResult } from "@/types";

const SessionResults = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { token } = useAuth();
  const [result, setResult] = useState<SessionResult | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadResults = async () => {
      try {
        const data = await getSessionResults(token!, sessionId!);

        setResult(data);
      } catch (err) {
        setError("Failed to load session results.");
      }
    };
    loadResults();
  }, [sessionId, token]);

  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (!result) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Session Raw Results</h1>
      <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-[70vh] whitespace-pre-wrap">
        {JSON.stringify(result, null, 2)}
      </pre>
    </div>
  );
};

export default SessionResults;

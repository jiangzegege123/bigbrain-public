import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { fetchSingleGame } from "@/api/game";
import { checkSessionStatus } from "@/api/session";
import Navbar from "@/components/NavBar";
import type { Game, AdminSessionResult } from "@/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import { Button } from "@/components/ui/button";
interface SessionInfo {
  id: number;
  status: AdminSessionResult | null;
  date: string;
  playerCount: number;
}

const PastGameSessionsPage = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [game, setGame] = useState<Game | null>(null);
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch game data including old sessions
  useEffect(() => {
    const fetchGame = async () => {
      if (!gameId || !token) {
        setError("Game ID or token is missing");
        setIsLoading(false);
        return;
      }

      try {
        const gameData = await fetchSingleGame(token, gameId);
        setGame(gameData);

        // Fetch details for each old session
        if (gameData.oldSessions && gameData.oldSessions.length > 0) {
          const sessionsPromises = gameData.oldSessions.map(
            async (sessionId: number) => {
              try {
                const sessionStatus = await checkSessionStatus(
                  token,
                  sessionId.toString()
                );
                return {
                  id: sessionId,
                  status: sessionStatus,
                  date: sessionStatus.isoTimeLastQuestionStarted
                    ? new Date(
                        sessionStatus.isoTimeLastQuestionStarted
                      ).toLocaleDateString()
                    : "Unknown date",
                  playerCount: sessionStatus.players?.length || 0,
                };
              } catch (err) {
                if (err instanceof Error) setError(err.message);
                return {
                  id: sessionId,
                  status: null,
                  date: "Unknown date",
                  playerCount: 0,
                };
              }
            }
          );

          const sessionsData = await Promise.all(sessionsPromises);
          // Filter out empty sessions where isoTimeLastQuestionStarted is empty or null
          // Also filter out sessions with no players
          const filteredSessions = sessionsData.filter(
            (session) =>
              session.status?.isoTimeLastQuestionStarted &&
              session.status.isoTimeLastQuestionStarted !== "" &&
              session.status.players &&
              session.status.players.length > 0
          );
          setSessions(filteredSessions);
        }

        setIsLoading(false);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        setIsLoading(false);
      }
    };

    fetchGame();
  }, [gameId, token]);

  const handleViewSession = (sessionId: number) => {
    navigate(`/${gameId}/session/${sessionId}`);
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading past sessions...</div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-red-500">Error: {error}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">
            {game?.name} - Past Sessions
          </h1>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Desktop View */}
        <div className="hidden md:block bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Session ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Players
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Questions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sessions.map((session) => (
                <tr key={session.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {session.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {session.date}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {session.playerCount}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {session.status?.questions?.length || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <button
                      onClick={() => handleViewSession(session.id)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      View Results
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-4">
          {sessions.map((session) => (
            <Card key={session.id} className="bg-white shadow-md">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <Label className="text-sm text-muted-foreground">
                    Session ID
                  </Label>
                  <span className="font-medium">{session.id}</span>
                </div>
              </CardHeader>
              <CardContent className="pb-2 space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-sm text-muted-foreground">Date</Label>
                  <span>{session.date}</span>
                </div>
                <div className="flex justify-between items-center">
                  <Label className="text-sm text-muted-foreground">
                    Players
                  </Label>
                  <span>{session.playerCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <Label className="text-sm text-muted-foreground">
                    Questions
                  </Label>
                  <span>{session.status?.questions?.length || "N/A"}</span>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button
                  variant="ghost"
                  className="w-full text-indigo-600 hover:text-indigo-900 font-semibold"
                  onClick={() => handleViewSession(session.id)}
                >
                  View Results
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default PastGameSessionsPage;

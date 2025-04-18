import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserIcon } from "lucide-react";
import { joinSession } from "@/api/player";

const JoinPage = () => {
  const params = useParams<{ sessionId?: string }>();
  const navigate = useNavigate();

  const [sessionId, setSessionId] = useState(params.sessionId || "");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleJoin = async () => {
    if (!sessionId.trim()) return setError("Please enter a session ID");
    if (!name.trim()) return setError("Please enter your name");

    try {
      const joinData = await joinSession(sessionId, name);
      localStorage.setItem("playerName", name);
      localStorage.setItem("playerId", joinData.playerId);
      navigate(`/play/${sessionId}/${joinData.playerId}`);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown error");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[700px] p-4">
      <div className="w-full max-w-md p-6 space-y-5 bg-white rounded-xl shadow-lg border border-gray-100 min-w-[350px]">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="p-2.5 rounded-full bg-blue-50">
            <UserIcon className="w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Join a Game</h1>
          <p className="text-sm text-gray-500">
            Enter session ID and your name to join
          </p>
        </div>

        <div className="space-y-3">
          <div className="space-y-2">
            <Input
              disabled={!!params.sessionId}
              placeholder="Enter session ID"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
            />
            <Input
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleJoin()}
            />
          </div>

          <Button
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={handleJoin}
          >
            Join Game
          </Button>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default JoinPage;

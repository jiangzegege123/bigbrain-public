import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserIcon } from "lucide-react";
import { joinSession } from "@/api/player";
import { checkSessionStatus } from "@/api/session";
import { useAuth } from "@/contexts/AuthContext";

const Play = () => {
  const params = useParams<{ sessionId?: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [sessionId, setSessionId] = useState(params.sessionId || "");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [sessionValid, setSessionValid] = useState(true);
  const [sessionStarted, setSessionStarted] = useState(false);

  // 🔍 如果 URL 里有 sessionId，则检查状态
  useEffect(() => {
    if (!params.sessionId) return;

    const checkStatus = async () => {
      try {
        const status = await checkSessionStatus(token!, params.sessionId!);
        setSessionStarted(status.active); // active 为 true 表示游戏已开始
        setSessionValid(true);
      } catch (err) {
        setSessionValid(false); // 游戏不存在
      }
    };

    checkStatus();
  }, [params.sessionId, token]);

  const handleJoin = async () => {
    if (!sessionId.trim()) return setError("Please enter a session ID");
    if (!name.trim()) return setError("Please enter your name");

    try {
      const joinData = await joinSession(sessionId, name);
      localStorage.setItem("playerName", name);
      localStorage.setItem("playerId", joinData.playerId);
      navigate(`/play/${sessionId}/${joinData.playerId}`);
    } catch (err) {
      setError("Failed to join session. Please try again.");
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

export default Play;

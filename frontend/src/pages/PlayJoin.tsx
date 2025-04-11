"use client";

import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserIcon } from "lucide-react";
import { joinSession } from "@/api/player";
import { checkSessionStatus } from "@/api/session";
import { useAuth } from "@/contexts/AuthContext";

const PlayJoin = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [sessionValid, setSessionValid] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);

  const navigate = useNavigate();
  const { token } = useAuth();

  // 🔍 页面加载时先验证 session 状态
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const status = await checkSessionStatus(token!, sessionId!);
        setSessionStarted(status.active); // active 为 true 表示游戏已开始
        setSessionValid(true);
      } catch (err) {
        console.log(err);
        setSessionValid(false); // 游戏不存在
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, [sessionId, token]);

  // 🟢 加入游戏逻辑
  const handleJoin = async () => {
    if (!name.trim()) return alert("Please enter your name");

    try {
      const joinData = await joinSession(sessionId!, name);
      localStorage.setItem("playerName", name);
      localStorage.setItem("playerId", joinData.playerId);
      navigate(`/play/${sessionId}/${joinData.playerId}`);
    } catch (err) {
      setError("Failed to join session. Please try again.");
    }
  };

  // ⏳ 加载中
  if (loading)
    return <div className="p-6 text-center">Checking session...</div>;

  // ❌ 游戏不存在
  if (!sessionValid) {
    return (
      <div className="p-6 text-center space-y-4">
        <h2 className="text-xl font-bold text-red-600">Game not found</h2>
        <Button onClick={() => navigate("/play")}>Back to Play Page</Button>
      </div>
    );
  }

  // ⛔️ 游戏已开始
  if (sessionStarted) {
    return (
      <div className="p-6 text-center space-y-4">
        <h2 className="text-xl font-bold text-orange-600">
          Game already started
        </h2>
        <p>You can't join this session anymore.</p>
        <Button onClick={() => navigate("/play")}>Back to Play Page</Button>
      </div>
    );
  }

  // ✅ 正常页面
  return (
    <div className="flex items-center justify-center min-h-[700px] p-4">
      <div className="w-full max-w-md p-6 space-y-5 bg-white rounded-xl shadow-lg border border-gray-100 min-w-[350px]">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="p-2.5 rounded-full bg-green-50">
            <UserIcon className="w-6 h-6 text-green-600" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Joining Session</h1>
          <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            #{sessionId}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Enter your name to join this game
          </p>
        </div>

        <div className="space-y-3">
          <div className="space-y-2">
            <Input
              className="w-full"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleJoin()}
            />
          </div>

          <Button
            className="w-full bg-green-600 hover:bg-green-700"
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

export default PlayJoin;

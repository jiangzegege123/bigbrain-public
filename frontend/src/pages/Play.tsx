"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GamepadIcon as GameController } from "lucide-react";

const Play = () => {
  const [sessionId, setSessionId] = useState("");
  const navigate = useNavigate();

  const handleJoin = () => {
    if (!sessionId.trim()) return alert("Please enter a session ID");
    navigate(`/play/${sessionId}`);
  };

  return (
    <div className="flex items-center justify-center min-h-[700px] p-4">
      <div className="w-full max-w-md p-6 space-y-5 bg-white rounded-xl shadow-lg border border-gray-100 min-w-[350px]">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="p-2.5 rounded-full bg-blue-50">
            <GameController className="w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Join a Game</h1>
          <p className="text-sm text-gray-500">
            Enter the session ID to join an existing game
          </p>
        </div>

        <div className="space-y-3">
          <div className="space-y-2">
            <Input
              className="w-full"
              placeholder="Enter session ID"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleJoin()}
            />
          </div>

          <Button
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={handleJoin}
          >
            Join Game
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Play;

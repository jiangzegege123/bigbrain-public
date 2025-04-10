// src/pages/Play.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Play = () => {
  const [sessionId, setSessionId] = useState("");
  const navigate = useNavigate();

  const handleJoin = () => {
    if (!sessionId.trim()) return alert("Please enter a session ID");
    navigate(`/play/${sessionId}`);
  };

  return (
    <div className="p-6 max-w-md mx-auto space-y-4">
      <h1 className="text-xl font-bold">Join a Game</h1>
      <input
        className="border w-full p-2 rounded"
        placeholder="Enter session ID"
        value={sessionId}
        onChange={(e) => setSessionId(e.target.value)}
      />
      <button
        className="bg-blue-600 text-white w-full py-2 rounded"
        onClick={handleJoin}
      >
        Join
      </button>
    </div>
  );
};

export default Play;

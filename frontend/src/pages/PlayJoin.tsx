// src/pages/PlayJoin.tsx

import { useParams } from "react-router-dom";
import { useState } from "react";

const PlayJoin = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [name, setName] = useState("");

  const handleJoin = () => {
    if (!name.trim()) return alert("Please enter your name");
    // TODO: 调用 join API 然后跳转到等待或游戏页面
    alert(`Joined session ${sessionId} as ${name}`);
  };

  return (
    <div className="p-6 max-w-md mx-auto space-y-4">
      <h1 className="text-xl font-bold">Joining Session #{sessionId}</h1>
      <input
        className="border w-full p-2 rounded"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button
        className="bg-green-600 text-white w-full py-2 rounded"
        onClick={handleJoin}
      >
        Join Game
      </button>
    </div>
  );
};

export default PlayJoin;

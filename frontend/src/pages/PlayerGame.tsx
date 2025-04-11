import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCurrentQuestion, getCorrectAnswer } from "@/api/player";
import { Button } from "@/components/ui/button";

const PlayerGame = () => {
  const { playerId } = useParams<{ playerId: string }>();
  const [question, setQuestion] = useState<any>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [correct, setCorrect] = useState<number | null>(null);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);

  // 每秒轮询获取当前题目并计算剩余时间
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const q = await getCurrentQuestion(playerId!);
        if (q) {
          setQuestion(q);

          const startedAt = new Date(q.question.isoTimeLastQuestionStarted);
          const now = new Date();
          const elapsed = Math.floor(
            (now.getTime() - startedAt.getTime()) / 1000
          );
          const total = Math.floor(q.question.duration / 1000);
          const remaining = Math.max(total - elapsed, 0);

          setRemainingTime(remaining);
        }
      } catch (err: any) {
        if (err?.message?.includes("Session has not started")) {
          console.log("⏳ Quiz not started yet, waiting...");
        } else {
          console.error("Failed to get question:", err);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [playerId]);

  // 提交答案
  const handleSubmit = async () => {
    if (selected === null) return;
    try {
      const data = await getCorrectAnswer(playerId!);
      setCorrect(data.answer); // correct 是 index
    } catch (err) {
      console.error("Failed to get correct answer:", err);
    }
  };

  // 等待游戏开始
  if (!question) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-xl">Waiting in the lobby...</p>
          <p className="text-gray-500">The host will start the game soon.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">🧠 {question.question.question}</h1>

      <p className="text-gray-600">
        <strong>Type:</strong> {question.question.type}
      </p>

      <p className="text-gray-600">
        <strong>Points:</strong> {question.question.points}
      </p>

      <p className="text-gray-600">
        <strong>Remaining Time:</strong> {remainingTime ?? "..."} seconds
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.isArray(question.question.options) &&
          question.question.options.map((opt: any, idx: number) => (
            <Button
              key={idx}
              onClick={() => setSelected(idx)}
              variant={selected === idx ? "default" : "outline"}
              disabled={correct !== null}
            >
              {opt.text}
            </Button>
          ))}
      </div>

      {correct === null ? (
        <Button
          className="w-full mt-4"
          onClick={handleSubmit}
          disabled={selected === null}
        >
          Submit Answer
        </Button>
      ) : (
        <div className="text-center text-gray-600 mt-4">
          {selected === correct ? "✅ Correct!" : "❌ Incorrect!"}
        </div>
      )}
    </div>
  );
};

export default PlayerGame;

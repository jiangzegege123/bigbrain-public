import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCurrentQuestion,
  getCorrectAnswer,
  submitAnswer,
  getPlayerStatus,
} from "@/api/player";
import { Button } from "@/components/ui/button";

const PlayerGame = () => {
  const { playerId } = useParams<{ playerId: string }>();
  const [question, setQuestion] = useState<any>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [correct, setCorrect] = useState<number | null>(null);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [started, setStarted] = useState(true);
  const navigate = useNavigate();
  // 轮询拉题 + 倒计时
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const start = await getPlayerStatus(playerId!);
        console.log(start);
        const q = await getCurrentQuestion(playerId!);

        if (q) {
          setQuestion(q);

          const startedAt = new Date(q.question.isoTimeLastQuestionStarted);
          const now = new Date();
          const elapsed = Math.floor(
            (now.getTime() - startedAt.getTime()) / 1000
          );
          const total = Math.floor(q.question.duration);
          const remaining = Math.max(total - elapsed, 0);
          setRemainingTime(remaining);

          if (remaining === 0 && correct === null) {
            const answerData = await getCorrectAnswer(playerId!);
            setCorrect(answerData.answer);
          }
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
  }, [playerId, correct]);

  // 用户点击选项时立即提交
  const handleSelect = async (idx: number) => {
    setSelected(idx);
    try {
      await submitAnswer(playerId!, idx); // ✅ 提交用户答案
      console.log("Answer submitted:", idx);
    } catch (err) {
      console.error("Failed to submit answer:", err);
    }
  };

  // 等待开始
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

  if (!started) {
    navigate(`${location.pathname}/result`);
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

      {question.question.image && (
        <img
          src={question.question.image}
          alt="question media"
          className="max-h-64 rounded"
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.isArray(question.question.options) &&
          question.question.options.map((opt: any, idx: number) => {
            const isCorrect = idx === correct;
            const isSelected = idx === selected;

            return (
              <div
                key={idx}
                className={`p-4 rounded border cursor-pointer text-center transition
                  ${
                    correct !== null
                      ? isCorrect
                        ? "bg-green-100 border-green-500"
                        : isSelected
                        ? "bg-red-100 border-red-500"
                        : "bg-gray-50 border-gray-200"
                      : isSelected
                      ? "bg-blue-100 border-blue-500"
                      : "hover:bg-gray-100 border-gray-300"
                  }`}
                onClick={() => handleSelect(idx)}
              >
                {opt.text}
              </div>
            );
          })}
      </div>

      {correct !== null && (
        <div className="text-center text-gray-600 mt-4">
          {selected === correct ? "✅ Correct!" : "❌ Incorrect!"}
        </div>
      )}
    </div>
  );
};

export default PlayerGame;

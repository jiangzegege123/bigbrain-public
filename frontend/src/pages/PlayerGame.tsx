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
  const navigate = useNavigate();

  // 每秒轮询获取题目和更新时间
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await getPlayerStatus(playerId!); // 预防 session 被 stop 掉

        const q = await getCurrentQuestion(playerId!);
        if (q) {
          // 检查是否是新题目，如果是就重置状态
          if (!question || q.question.question !== question.question.question) {
            setQuestion(q);
            setSelected(null);
            setCorrect(null);
          }

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
  }, [playerId, correct, question]);

  // 用户点击选项时立即提交
  const handleSelect = async (idx: number) => {
    setSelected(idx);
    try {
      await submitAnswer(playerId!, idx);
      console.log("Answer submitted:", idx);
    } catch (err) {
      console.error("Failed to submit answer:", err);
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

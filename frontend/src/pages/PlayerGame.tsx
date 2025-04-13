// import { useEffect, useState } from "react";
import { getPlayerStatus } from "@/api/player";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCurrentQuestion } from "@/api/player";
import { Question } from "@/types";
import { Button } from "@/components/ui/button";
import { submitAnswer } from "@/api/player";
import { getCorrectAnswer } from "@/api/player";

const PlayerGame = () => {
  const { playerId } = useParams<{ playerId: string; sessionId: string }>();
  const [pollingStarted, setPollingStarted] = useState(false);
  const [question, setQuestion] = useState<Question | null>(null);
  const [started, setStarted] = useState(false);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<number[] | null>(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const interval = setInterval(async () => {
      try {
        const status = await getPlayerStatus(playerId!);
        if (!isMounted) return;

        console.log("Status:", status);

        if (status.started === true) {
          clearInterval(interval); //
          setStarted(true);
          console.log("Status is true, fetching current question...");
          setPollingStarted(true);

          const question = await getCurrentQuestion(playerId!);
          setQuestion(question);
          if (isMounted) {
            console.log("Current Question:", question);
          }
        }
      } catch (err) {
        console.error("Error during polling:", err);
      }
    }, 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [playerId]);

  useEffect(() => {
    if (!pollingStarted) return;
    setStarted(true);
    let isMounted = true;
    const interval = setInterval(async () => {
      try {
        const newQuestion = await getCurrentQuestion(playerId!);
        if (!isMounted) return;

        if (JSON.stringify(newQuestion) !== JSON.stringify(question)) {
          setQuestion(newQuestion);
          console.log("Current Question:", question);
        }

        const startedAt = new Date(newQuestion.isoTimeLastQuestionStarted);
        const now = new Date();
        const elapsed = Math.floor(
          (now.getTime() - startedAt.getTime()) / 1000
        );
        const total = Math.floor(newQuestion.duration);
        const remaining = Math.max(total - elapsed, 0);
        setRemainingTime(remaining);
      } catch (err) {
        console.error("Polling question error:", err);
      }
    }, 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [pollingStarted, playerId, question]);

  useEffect(() => {
    if (remainingTime === 0 && question) {
      // 时间到了，显示结果
      setShowResult(true);

      // 拉取正确答案
      getCorrectAnswer(playerId!)
        .then(({ answerIds }) => {
          setCorrectAnswers(answerIds);
          console.log("✅ Correct answers:", answerIds);
        })
        .catch((err) => {
          console.error("❌ Failed to get correct answers:", err);
        });
    }
  }, [remainingTime, question, playerId]);

  const handleOptionClick = async (idx: number) => {
    if (!question || remainingTime! <= 0) return;

    if (question.type === "single" || question.type === "judgement") {
      setSelected([idx]);
      try {
        await submitAnswer(playerId!, [idx]);
        console.log(`Answer ${idx} submitted`);
      } catch (err) {
        console.error("Failed to submit answer:", err);
      }
    } else if (question.type === "multiple") {
      setSelected((prev) => {
        const newSelected = prev.includes(idx)
          ? prev.filter((i) => i !== idx)
          : [...prev, idx];

        // ⬇️ 提交当前 newSelected
        if (newSelected.length > 0) {
          submitAnswer(playerId!, newSelected)
            .then(() => {
              console.log("Submitted answers:", newSelected);
            })
            .catch((err) => {
              console.error("Failed to submit answers:", err);
            });
        } else {
          console.log("No selection, not submitting.");
        }

        return newSelected;
      });
    }
  };

  return (
    <div className="p-6">
      {!started ? (
        <div className="text-center text-gray-600 text-lg">
          In the lobby... Waiting for the game to start.
        </div>
      ) : question ? (
        <div>
          {remainingTime! > 0 && <p>Remaining Time {remainingTime}</p>}
          <h2 className="text-2xl font-semibold mb-4">{question.question}</h2>
          <ul className="space-y-2">
            {question.options.map((opt, idx) => {
              const isSelected = selected.includes(idx);
              const isCorrect = correctAnswers?.includes(idx);
              const isTimeUp = remainingTime === 0;

              let variant: "default" | "outline" | "secondary" | "destructive" =
                "default";

              if (isTimeUp) {
                if (isCorrect) {
                  variant = "outline"; // ✅ 正确答案：白底黑字
                } else if (isSelected) {
                  variant = "destructive"; // ❌ 你选了但错了：红色
                } else {
                  variant = "secondary"; // 其他选项：灰色
                }
              } else {
                variant = isSelected ? "outline" : "default"; // 正常状态下的选中逻辑
              }

              return (
                <li key={idx} className="p-3 bg-gray-100 rounded">
                  <Button
                    variant={variant}
                    disabled={isTimeUp}
                    onClick={() => handleOptionClick(idx)}
                  >
                    {opt.text}
                  </Button>
                </li>
              );
            })}
          </ul>
          {showResult && correctAnswers && (
            <div className="mt-4 text-center text-lg font-semibold">
              {JSON.stringify(correctAnswers.sort()) ===
              JSON.stringify(selected.sort()) ? (
                <span className="text-green-600">✅ Correct!</span>
              ) : (
                <span className="text-red-600">❌ Incorrect!</span>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="text-gray-500">Loading question...</div>
      )}
    </div>
  );
};

export default PlayerGame;

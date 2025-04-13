"use client";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getPlayerStatus,
  getCurrentQuestion,
  submitAnswer,
  getCorrectAnswer,
} from "@/api/player";
import type { Question } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Clock, Award, Loader2 } from "lucide-react";

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
          clearInterval(interval);
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

  const getProgressValue = () => {
    if (!remainingTime || !question) return 0;
    return (remainingTime / question.duration) * 100;
  };

  const getQuestionTypeLabel = () => {
    if (!question) return "";
    switch (question.type) {
      case "single":
        return "Single Choice";
      case "multiple":
        return "Multiple Choice";
      case "judgement":
        return "True/False";
      default:
        return question.type;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardContent className="p-6 md:p-8">
          {!started ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
              <h2 className="text-2xl font-semibold text-center">
                Waiting for the game to start...
              </h2>
              <p className="text-muted-foreground text-center">
                Get ready! The quiz will begin soon.
              </p>
            </div>
          ) : question ? (
            <div className="space-y-6">
              <div className="space-y-2">
                {remainingTime !== null && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary" />
                        <span className="font-medium">
                          {remainingTime > 0
                            ? `${remainingTime}s remaining`
                            : "Time's up!"}
                        </span>
                      </div>
                      <span className="text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
                        {getQuestionTypeLabel()}
                      </span>
                    </div>
                    <Progress value={getProgressValue()} className="h-2" />
                  </div>
                )}
                <h2 className="text-2xl font-bold mt-4">{question.question}</h2>
              </div>

              <div className="grid gap-3">
                {question.options.map((opt, idx) => {
                  const isSelected = selected.includes(idx);
                  const isCorrect = correctAnswers?.includes(idx);
                  const isTimeUp = remainingTime === 0;

                  let optionClass = "border-2 transition-all duration-200 ";
                  let iconElement = null;

                  if (isTimeUp) {
                    if (isCorrect) {
                      optionClass += "border-green-500 bg-green-50";
                      iconElement = (
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      );
                    } else if (isSelected) {
                      optionClass += "border-red-500 bg-red-50";
                      iconElement = (
                        <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                      );
                    } else {
                      optionClass += "border-gray-200";
                    }
                  } else {
                    optionClass += isSelected
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionClick(idx)}
                      disabled={isTimeUp}
                      className={`flex items-center justify-between p-4 rounded-lg ${optionClass} ${
                        isTimeUp ? "cursor-default" : "cursor-pointer"
                      }`}
                    >
                      <span className="text-lg">{opt.text}</span>
                      {iconElement}
                    </button>
                  );
                })}
              </div>

              {showResult && correctAnswers && (
                <div className="mt-6 p-4 rounded-lg bg-gray-50 border flex items-center justify-center gap-3">
                  {JSON.stringify(correctAnswers.sort()) ===
                  JSON.stringify(selected.sort()) ? (
                    <>
                      <Award className="h-6 w-6 text-green-500" />
                      <span className="text-xl font-semibold text-green-600">
                        Correct Answer!
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-6 w-6 text-red-500" />
                      <span className="text-xl font-semibold text-red-600">
                        Incorrect Answer
                      </span>
                    </>
                  )}
                </div>
              )}

              {question.type === "multiple" && (
                <p className="text-sm text-muted-foreground italic">
                  Select all correct answers that apply
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
              <p className="text-lg text-muted-foreground">
                Loading question...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayerGame;

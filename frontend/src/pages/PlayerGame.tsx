import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  const [sessionOver, setSessionOver] = useState(false);
  const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(
    null
  );
  const navigate = useNavigate();

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
          if (question.id !== undefined) {
            setCurrentQuestionId(question.id);
          }
          if (isMounted) {
            console.log("Current Question:", question);
          }
        }
      } catch (err) {
        console.error("Error during polling:", err);
        clearInterval(interval);
        setSessionOver(true);
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

        // Check if the question has changed
        if (JSON.stringify(newQuestion) !== JSON.stringify(question)) {
          // If we have a new question ID, reset the states related to answers and results
          if (newQuestion.id !== currentQuestionId) {
            setSelected([]);
            setCorrectAnswers(null);
            setShowResult(false);
            if (newQuestion.id !== undefined) {
              setCurrentQuestionId(newQuestion.id);
            }
          }

          setQuestion(newQuestion);
          console.log("Current Question:", newQuestion);
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
        clearInterval(interval);
        setSessionOver(true);
        navigate(`${location.pathname}/result`);
      }
    }, 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [pollingStarted, playerId, question, navigate, currentQuestionId]);

  useEffect(() => {
    if (remainingTime === 0 && question) {
      setShowResult(true);

      getCorrectAnswer(playerId!)
        .then((answers) => {
          // Find the indexes of correct answers in the options array
          const indexes = answers
            .map((text) =>
              question.options.findIndex((opt) => opt.text === text)
            )
            .filter((i) => i !== -1);

          setCorrectAnswers(indexes);
          console.log("✅ Correct answer indexes:", indexes);
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
        const sorted = [idx].sort((a, b) => a - b);
        // Send the actual text values for all question types
        const answers = [question.options[idx].text];
        await submitAnswer(playerId!, answers);
        console.log("Submitted answer:", answers);
      } catch (err) {
        console.error("Failed to submit answer:", err);
      }
    } else if (question.type === "multiple") {
      setSelected((prev) => {
        const newSelected = prev.includes(idx)
          ? prev.filter((i) => i !== idx)
          : [...prev, idx];

        if (newSelected.length > 0) {
          const sorted = [...newSelected].sort((a, b) => a - b);
          // Send actual option text values instead of trying to convert to numbers
          const texts = sorted.map((i) => question.options[i].text);

          submitAnswer(playerId!, texts)
            .then(() => {
              console.log("Submitted answers:", texts);
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

  if (sessionOver) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center space-y-4">
          <XCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="text-2xl font-bold text-red-600">
            This session does not exist or has already ended.
          </h2>
          <p className="text-muted-foreground">
            Please check the link or ask the host to restart the game.
          </p>
        </div>
      </div>
    );
  }

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

                  if (isTimeUp && correctAnswers) {
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

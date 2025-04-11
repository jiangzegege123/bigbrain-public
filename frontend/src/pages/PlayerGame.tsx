// src/pages/PlayerGame.tsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getPlayerStatus,
  getCurrentQuestion,
  getCorrectAnswer,
} from "@/api/player";
import { Button } from "@/components/ui/button";

const PlayerGame = () => {
  const { playerId } = useParams<{ playerId: string }>();
  const [stage, setStage] = useState<string>("lobby");
  const [question, setQuestion] = useState<any>(null);
  const [selected, setSelected] = useState<number[] | number>([]);
  const [correct, setCorrect] = useState<number[] | null>(null);

  // Polling game stage
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const status = await getPlayerStatus(playerId!);
        console.log(status);
        setStage(status.stage);
      } catch (err) {
        console.error(err);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [playerId]);

  // Fetch current question when stage changes to question
  useEffect(() => {
    if (stage === "question") {
      getCurrentQuestion(playerId!).then(setQuestion).catch(console.error);
    }
  }, [stage, playerId]);

  // Fetch correct answer if result stage
  useEffect(() => {
    if (stage === "answer") {
      getCorrectAnswer(playerId!)
        .then((data) => setCorrect(data.answer))
        .catch(console.error);
    }
  }, [stage, playerId]);

  if (stage === "lobby") {
    return (
      <div className="h-screen flex items-center justify-center text-xl">
        Please wait for the game to start...
      </div>
    );
  }

  if (stage === "question" && question) {
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">{question.question}</h1>

        {question.image && (
          <img src={question.image} alt="question" className="max-h-64" />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {question.options.map((opt: string, idx: number) => (
            <Button
              key={idx}
              onClick={() => setSelected(idx)}
              className={
                typeof selected === "number" && selected === idx
                  ? "bg-green-500 text-white"
                  : "bg-gray-200"
              }
            >
              {opt}
            </Button>
          ))}
        </div>

        <div className="text-gray-500">Answer before time runs out!</div>
      </div>
    );
  }

  if (stage === "answer" && question) {
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">{question.question}</h1>

        {question.image && (
          <img src={question.image} alt="question" className="max-h-64" />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {question.options.map((opt: string, idx: number) => {
            const isCorrect = correct?.includes(idx);
            const isSelected = selected === idx;

            return (
              <div
                key={idx}
                className={`p-4 rounded border ${
                  isCorrect
                    ? "bg-green-200"
                    : isSelected
                    ? "bg-red-200"
                    : "bg-gray-100"
                }`}
              >
                {opt}
              </div>
            );
          })}
        </div>

        <div className="text-gray-500">Waiting for next question...</div>
      </div>
    );
  }

  return <div className="text-center p-6">Loading game...</div>;
};

export default PlayerGame;

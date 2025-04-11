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
  const [started, setStarted] = useState<boolean>(false);
  const [question, setQuestion] = useState<any>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [correct, setCorrect] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Polling game status
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const status = await getPlayerStatus(playerId!);
        setStarted(status.started);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [playerId]);

  // Fetch current question when game starts
  useEffect(() => {
    if (started) {
      getCurrentQuestion(playerId!).then(setQuestion).catch(console.error);
    }
  }, [started, playerId]);

  // Handle answer submission
  const handleSubmit = async () => {
    if (selected === null) return;

    try {
      const answerData = await getCorrectAnswer(playerId!);
      setCorrect(answerData.answer);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p>Loading game status...</p>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-xl">Waiting in the lobby...</p>
          <p className="text-gray-500">The host will start the game soon.</p>
        </div>
      </div>
    );
  }

  if (started && question && correct === null) {
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
              variant={selected === idx ? "default" : "outline"}
            >
              {opt}
            </Button>
          ))}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={selected === null}
          className="w-full"
        >
          Submit Answer
        </Button>
      </div>
    );
  }

  if (started && question && correct !== null) {
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">{question.question}</h1>

        {question.image && (
          <img src={question.image} alt="question" className="max-h-64" />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {question.options.map((opt: string, idx: number) => {
            const isCorrect = idx === correct;
            const isSelected = idx === selected;

            return (
              <div
                key={idx}
                className={`p-4 rounded border ${
                  isCorrect
                    ? "bg-green-100 border-green-500"
                    : isSelected
                    ? "bg-red-100 border-red-500"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                {opt}
                {isCorrect && <span className="ml-2 text-green-600">✓</span>}
                {isSelected && !isCorrect && (
                  <span className="ml-2 text-red-600">✗</span>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center text-gray-500">
          {selected === correct ? "Correct!" : "Incorrect!"} Waiting for next
          question...
        </div>
      </div>
    );
  }

  return null;
};

export default PlayerGame;

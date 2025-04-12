// import { useEffect, useState } from "react";
import { getPlayerStatus } from "@/api/player";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCurrentQuestion } from "@/api/player";
import { Question } from "@/types";

const PlayerGame = () => {
  const { playerId } = useParams<{ playerId: string; sessionId: string }>();
  const [pollingStarted, setPollingStarted] = useState(false);
  const [question, setQuestion] = useState<Question | null>(null);
  const [started, setStarted] = useState(false);

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
      } catch (err) {
        console.error("Polling question error:", err);
      }
    }, 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [pollingStarted, playerId, question]);

  return (
    <div className="p-6">
      {!started ? (
        <div className="text-center text-gray-600 text-lg">
          In the lobby... Waiting for the game to start.
        </div>
      ) : question ? (
        <div>
          <h2 className="text-2xl font-semibold mb-4">{question.question}</h2>
          <ul className="space-y-2">
            {question.options.map((opt, idx) => (
              <li key={idx} className="p-3 bg-gray-100 rounded">
                {opt.text}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-gray-500">Loading question...</div>
      )}
    </div>
  );
};

export default PlayerGame;

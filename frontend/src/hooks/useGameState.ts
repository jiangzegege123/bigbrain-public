import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getPlayerStatus,
  getCurrentQuestion,
  submitAnswer,
  getCorrectAnswer,
} from "@/api/player";
import type { Question } from "@/types";

export interface GameState {
  playerId: string;
  question: Question | null;
  started: boolean;
  remainingTime: number | null;
  selected: number[];
  correctAnswers: number[] | null;
  showResult: boolean;
  sessionOver: boolean;
  isLoading: boolean;
}

export function useGameState(playerId: string) {
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
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Initial polling to check if game has started
  useEffect(() => {
    let isMounted = true;
    const interval = setInterval(async () => {
      try {
        const status = await getPlayerStatus(playerId);
        if (!isMounted) return;

        console.log("Status:", status);

        if (status.started === true) {
          clearInterval(interval);
          setStarted(true);
          console.log("Status is true, fetching current question...");
          setPollingStarted(true);

          const question = await getCurrentQuestion(playerId);
          setQuestion(question);
          if (question.id !== undefined) {
            setCurrentQuestionId(question.id);
          }
          if (isMounted) {
            console.log("Current Question:", question);
          }
        }
        setIsLoading(false);
      } catch (err) {
        console.error("Error during polling:", err);
        clearInterval(interval);
        setSessionOver(true);
        setIsLoading(false);
      }
    }, 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [playerId]);

  // Poll for current question once game has started
  useEffect(() => {
    if (!pollingStarted) return;

    setStarted(true);
    let isMounted = true;
    const interval = setInterval(async () => {
      try {
        const newQuestion = await getCurrentQuestion(playerId);
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

  // Handle getting correct answers when time is up
  useEffect(() => {
    if (remainingTime === 0 && question) {
      setShowResult(true);

      // Create a timer to check for answers after the time is up
      const checkForAnswers = async () => {
        try {
          const answers = await getCorrectAnswer(playerId);

          // Find the indexes of correct answers in the options array
          const indexes = answers
            .map((text) =>
              question.options.findIndex((opt) => opt.text === text)
            )
            .filter((i) => i !== -1);

          setCorrectAnswers(indexes);
          console.log("✅ Correct answer indexes:", indexes);
        } catch {
          // If answers aren't available yet, just leave correctAnswers as null
          // The UI will show a waiting state
          console.log("Answers not available yet, will be shown when ready");
        }
      };

      // Initial check
      checkForAnswers();

      // Set up an interval to periodically check if answers are available
      const answersInterval = setInterval(checkForAnswers, 2000);

      // Clean up the interval when component unmounts or question changes
      return () => {
        clearInterval(answersInterval);
      };
    }
  }, [remainingTime, question, playerId]);

  
}

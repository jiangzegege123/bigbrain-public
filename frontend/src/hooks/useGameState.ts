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
  playerId: string; // Unique identifier for the player
  question: Question | null; // Current question being displayed
  started: boolean; // Whether the game has started
  remainingTime: number | null; // Time remaining for the current question in seconds
  selected: number[]; // Indexes of options selected by the player
  correctAnswers: number[] | null; // Indexes of correct answers when revealed
  showResult: boolean; // Whether to show the result of the current question
  sessionOver: boolean; // Whether the game session has ended
  isLoading: boolean; // Whether data is currently being loaded
}

/**
 * Custom hook for managing game state and player interactions
 *
 * This hook handles:
 * - Polling for game start and current question
 * - Tracking remaining time for each question
 * - Managing player selections and answer submissions
 * - Fetching and displaying correct answers
 * - Transitioning between questions
 *
 * @param playerId - The unique identifier for the player
 * @returns An object containing game state, actions, and utility functions
 */
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

  /**
   * Initial polling effect to check if the game has started
   * Polls the server every second to determine game status
   */
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

  /**
   * Secondary polling effect that activates once the game has started
   * Continuously polls for the current question and calculates remaining time
   */
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

        // Calculate remaining time for the current question
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

  /**
   * Effect to handle fetching correct answers when time is up
   * Periodically checks for answers until they become available
   */
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

  /**
   * Handles player selection of an answer option
   * Manages different behavior based on question type (single, multiple, judgement)
   * Submits answers to the server
   *
   * @param idx - The index of the selected option
   */
  const handleOptionClick = async (idx: number) => {
    if (!question || remainingTime! <= 0) return;

    if (question.type === "single" || question.type === "judgement") {
      setSelected([idx]);
      try {
        // Send the actual text values for all question types
        const answers = [question.options[idx].text];
        await submitAnswer(playerId, answers);
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

          submitAnswer(playerId, texts)
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

  /**
   * Calculates the progress percentage for the timer
   * @returns Percentage of time remaining (0-100)
   */
  const getProgressValue = () => {
    if (!remainingTime || !question) return 0;
    return (remainingTime / question.duration) * 100;
  };

  /**
   * Gets a human-readable label for the current question type
   * @returns String representation of the question type
   */
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

  return {
    state: {
      playerId,
      question,
      started,
      remainingTime,
      selected,
      correctAnswers,
      showResult,
      sessionOver,
      isLoading,
    },
    actions: {
      handleOptionClick,
    },
    utils: {
      getProgressValue,
      getQuestionTypeLabel,
    },
  };
}

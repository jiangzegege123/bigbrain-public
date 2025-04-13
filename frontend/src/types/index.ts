export interface Question {
  id?: number;
  question: string;
  duration: number;
  points: number;
  isoTimeLastQuestionStarted: string;
  media?: string;
  type: "single" | "multiple" | "judgement";
  correctAnswers?: string[];
  options: {
    text: string;
    isCorrect: boolean;
  }[];
}

export interface Game {
  id?: number;
  name: string;
  owner: string;
  questions: Question[];

  active?: number;
  thumbnail?: string;
  createdAt?: string;
}

export interface SessionResult {
  players: {
    name: string;
    score: number;
    answers: {
      questionId: number;
      correct: boolean;
      timeTaken: number;
    }[];
  }[];
}

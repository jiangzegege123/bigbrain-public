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

export interface AdminSessionResult {
  active: boolean;
  answerAvailable: boolean;
  isoTimeLastQuestionStarted: string | null;
  players: string[];
  position: number;
  questions: Question[];
}

export interface PlayerAnswer {
  questionStartedAt: string;
  answeredAt: string;
  answers: number[];
  correct: boolean;
}

export interface PlayerResult {
  name: string;
  answers: PlayerAnswer[];
}

export interface SessionResultsResponse {
  results: PlayerResult[];
}

export interface Question {
  id?: number;
  question: string;
  duration: number;
  points: number;
  media?: string;
  type: "single" | "multiple" | "judgement";
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

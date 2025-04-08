export interface Question {
  id?: number;
  question: string;
  duration: number;
  points: number;
  media?: {
    type: "image" | "video";
    url: string;
  };
  type: "single" | "multiple" | "judgement";
  options: {
    text: string;
    isCorrect: boolean;
  }[];
}

export interface Game {
  id: number;
  name: string;
  thumbnail: string;
  owner: string;
  active: number;
  createdAt: string;
  questions: Question[];
}

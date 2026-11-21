export type QuestionType = "multiple_choice" | "short_answer";
export type Difficulty = "easy" | "medium" | "hard";

export interface GenerateRequest {
  subject: string;
  unit: string;
  type: QuestionType;
  count: number;
  difficulty: Difficulty;
}

export interface Question {
  id: number;
  question: string;
  options?: string[];
  /** 객관식: 정답 보기 인덱스(0~3), 주관식: 모범답안 */
  answer: number | string;
  explanation: string;
}

export interface Quiz {
  subject: string;
  unit: string;
  type: QuestionType;
  questions: Question[];
}

export const LIMITS = {
  textMax: 50,
  countMin: 1,
  countMax: 10,
} as const;

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  easy: "쉬움",
  medium: "보통",
  hard: "어려움",
};

export type Difficulty = "Easy" | "Medium" | "Hard";

export interface TestCase {
  id: string;
  inputDescription: string;
  expectedOutput: string;
}

export interface Challenge {
  id: string;
  index: number;
  technology: string;
  techIcon: string; // e.g., "🟨" for JavaScript, "🟦" for TypeScript, "🐍" for Python
  difficulty: Difficulty;
  subChapter: string;
  title: string;
  description: string;
  boilerplate: string;
  testCases: TestCase[];
}

export interface EvaluationResult {
  success: boolean;
  stdout: string;
  logs: string[];
  feedback: string;
  error: string | null;
}

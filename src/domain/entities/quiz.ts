/**
 * Quiz Entity
 * Represents an interactive assessment for course lessons
 */

export type QuestionType = 'single-choice' | 'multiple-choice' | 'true-false';
export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuestionExplanation {
  correct: string;
  incorrect: Record<string, string>;
}

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options: QuestionOption[];
  explanation: QuestionExplanation;
  learningObjective: string; // e.g., "FL-1.1.1 (K1) Identify typical test objectives"
  difficulty: QuestionDifficulty;
  keywords: string[]; // ISTQB keywords tested in this question
}

export interface Quiz {
  id: string;
  lessonId: string; // Legacy field - will be replaced by sectionId
  sectionId?: string; // New field for Section-based architecture
  title: string;
  description: string;
  questions: Question[];
  passingScore: number; // Percentage (e.g., 70 - will be 100 for ISTQB sections)
  timeLimit?: number; // Optional time limit in minutes
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Quiz Attempt Result
 * Stores the result of a user's quiz attempt
 */
export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  answers: Record<string, string[]>; // { questionId: [optionId] } - array for multiple-choice
  score: number; // Percentage
  passed: boolean;
  timeSpent: number; // in seconds
  completedAt: Date;
}

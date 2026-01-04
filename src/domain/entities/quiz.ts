/**
 * Quiz Entity
 * Quiz questions and answer options for Learning Objectives
 *
 * Design Principles:
 * - Each Learning Objective has 3-5 questions (K1/K2) or 5-7 questions (K3)
 * - Questions are shuffled on each attempt (prevents pattern memorization)
 * - Answer options are also shuffled (prevents positional memorization)
 * - 100% pass requirement (enforces mastery)
 * - Progressive cooldown on retries (1st immediate, 2nd 15min, 3rd+ 1hr)
 *
 * Research Foundation: docs/business/learning-methodology.md
 */

import type { KLevel } from './learning-objective';

/**
 * Quiz Question - Single Question
 *
 * Each question maps to a specific Learning Objective and K-level
 */
export interface QuizQuestion {
  id: string; // Unique ID: "FL-1.1.1-Q1", "FL-1.1.1-Q2", etc.
  learningObjectiveId: string; // "FL-1.1.1" - which LO this question tests

  // Difficulty
  kLevel: KLevel; // K1, K2, or K3 (K-level IS the difficulty indicator)

  // Content
  question: string; // The question text
  options: QuizOption[]; // 4 options (A, B, C, D)
  correctOptionId: string; // ID of the correct option

  // Explanations
  explanation: string; // Why the correct answer is correct
  rationale: {
    [optionId: string]: string; // Why each wrong answer is wrong
  };

  // Metadata
  tags: string[]; // For future filtering/categorization
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Quiz Option - Single Answer Choice
 *
 * Represents one of the multiple-choice options (A, B, C, D)
 */
export interface QuizOption {
  id: string; // "A", "B", "C", or "D"
  text: string; // The option text
  order: number; // Original order (before shuffling: 0, 1, 2, 3)
}

/**
 * Quiz Configuration
 *
 * Settings for how quizzes work (cooldown times, pass threshold, etc.)
 */
export interface QuizConfig {
  // Pass Requirements
  passThreshold: number; // 100 (must get all questions correct)

  // Cooldown Strategy (Progressive)
  cooldownStrategy: {
    firstRetry: number; // 0 minutes (immediate)
    secondRetry: number; // 15 minutes
    thirdPlusRetry: number; // 60 minutes (1 hour)
  };

  // Question Settings
  shuffleQuestions: boolean; // true (mandatory)
  shuffleOptions: boolean; // true (mandatory)
  oneQuestionAtATime: boolean; // true (mobile-optimized UX)
  immediateFeedback: boolean; // true (show explanation after each question)

  // Timing
  allowUnlimitedTime: boolean; // true (no timer pressure)
  trackTimePerQuestion: boolean; // true (for analytics)
}

/**
 * Default Quiz Configuration
 */
export const DEFAULT_QUIZ_CONFIG: QuizConfig = {
  passThreshold: 100,
  cooldownStrategy: {
    firstRetry: 0,
    secondRetry: 15,
    thirdPlusRetry: 60,
  },
  shuffleQuestions: true,
  shuffleOptions: true,
  oneQuestionAtATime: true,
  immediateFeedback: true,
  allowUnlimitedTime: true,
  trackTimePerQuestion: true,
};

/**
 * Quiz Session State
 *
 * Tracks the current state of an active quiz session
 */
export interface QuizSessionState {
  learningObjectiveId: string;
  userId: string;
  attemptNumber: number;

  // Questions (already shuffled)
  questions: QuizQuestion[];
  currentQuestionIndex: number; // 0-based index

  // Answers collected so far
  answers: {
    [questionId: string]: {
      selectedOptionId: string;
      isCorrect: boolean;
      timeSpent: number; // seconds
    };
  };

  // Timing
  startedAt: Date;
  questionStartedAt: Date; // When current question was shown

  // State
  isCompleted: boolean;
}

/**
 * Quiz Result Summary
 *
 * Final results after quiz completion
 */
export interface QuizResult {
  learningObjectiveId: string;
  attemptNumber: number;

  // Score
  totalQuestions: number;
  correctAnswers: number;
  score: number; // 0-100
  passed: boolean; // score === 100

  // Questions with user answers
  questionResults: QuestionResult[];

  // Timing
  totalTime: number; // seconds
  averageTimePerQuestion: number; // seconds

  // Next attempt
  canRetryImmediately: boolean;
  nextAttemptAllowedAt: Date | null; // null if passed
}

/**
 * Question Result - Individual Question Outcome
 */
export interface QuestionResult {
  questionId: string;
  questionText: string;
  selectedOptionId: string;
  selectedOptionText: string;
  correctOptionId: string;
  correctOptionText: string;
  isCorrect: boolean;
  explanation: string; // Why correct answer is correct
  timeSpent: number; // seconds
}

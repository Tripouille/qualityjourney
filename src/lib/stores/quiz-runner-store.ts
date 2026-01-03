/**
 * Quiz Runner Store
 * Manages client-side state for interactive quiz sessions
 */

import { create } from 'zustand';

export interface QuizRunnerState {
  // State
  quizId: string | null;
  currentQuestionIndex: number;
  selectedAnswers: Record<string, string[]>; // { questionId: [optionId] } - array for multiple-choice
  timeSpent: number; // in seconds
  isSubmitted: boolean;
  score: number | null; // Percentage (0-100)
  passed: boolean | null;

  // Actions
  startQuiz: (quizId: string) => void;
  selectAnswer: (questionId: string, optionId: string, isMultipleChoice: boolean) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  submitQuiz: (score: number, passed: boolean) => void;
  resetQuiz: () => void;
  setTimeSpent: (seconds: number) => void;
  incrementTime: () => void; // For timer
}

export const useQuizRunnerStore = create<QuizRunnerState>((set) => ({
  // Initial state
  quizId: null,
  currentQuestionIndex: 0,
  selectedAnswers: {},
  timeSpent: 0,
  isSubmitted: false,
  score: null,
  passed: null,

  // Actions
  startQuiz: (quizId: string) => {
    set({
      quizId,
      currentQuestionIndex: 0,
      selectedAnswers: {},
      timeSpent: 0,
      isSubmitted: false,
      score: null,
      passed: null,
    });
  },

  selectAnswer: (questionId: string, optionId: string, isMultipleChoice: boolean) => {
    set((state) => {
      if (isMultipleChoice) {
        // Multiple choice: toggle option in array
        const currentAnswers = state.selectedAnswers[questionId] ?? [];
        const newAnswers = currentAnswers.includes(optionId)
          ? currentAnswers.filter((id) => id !== optionId)
          : [...currentAnswers, optionId];

        return {
          selectedAnswers: {
            ...state.selectedAnswers,
            [questionId]: newAnswers,
          },
        };
      } else {
        // Single choice: replace array with single option
        return {
          selectedAnswers: {
            ...state.selectedAnswers,
            [questionId]: [optionId],
          },
        };
      }
    });
  },

  nextQuestion: () => {
    set((state) => ({
      currentQuestionIndex: state.currentQuestionIndex + 1,
    }));
  },

  previousQuestion: () => {
    set((state) => ({
      currentQuestionIndex: Math.max(0, state.currentQuestionIndex - 1),
    }));
  },

  submitQuiz: (score: number, passed: boolean) => {
    set({
      isSubmitted: true,
      score,
      passed,
    });
  },

  resetQuiz: () => {
    set({
      quizId: null,
      currentQuestionIndex: 0,
      selectedAnswers: {},
      timeSpent: 0,
      isSubmitted: false,
      score: null,
      passed: null,
    });
  },

  setTimeSpent: (seconds: number) => {
    set({ timeSpent: seconds });
  },

  incrementTime: () => {
    set((state) => ({ timeSpent: state.timeSpent + 1 }));
  },
}));

/**
 * Progress Entity
 * Tracks user progress through courses with dual tracking:
 * 1. Content Progress: Which Learning Objectives have been read
 * 2. Mastery Progress: Which Learning Objectives have passed quizzes at 100%
 *
 * Research Foundation: docs/business/learning-methodology.md
 * - Dual progress provides honest feedback while encouraging exploration
 * - Users can see both breadth (content visited) and depth (mastery achieved)
 */

/**
 * User Progress - Course Level
 *
 * Tracks overall progress for a user in a specific course
 */
export interface UserProgress {
  id: string;
  userId: string;
  courseId: string; // "istqb-foundation-v4"

  // Dual Progress Metrics
  contentProgress: {
    visitedLearningObjectiveIds: string[]; // LO IDs user has viewed
    totalLearningObjectives: number; // Total LOs in course
    percentage: number; // visitedLearningObjectiveIds.length / totalLearningObjectives * 100
  };

  masteryProgress: {
    passedLearningObjectiveIds: string[]; // LO IDs with quiz passed at 100%
    totalLearningObjectives: number; // Total LOs in course
    percentage: number; // passedLearningObjectiveIds.length / totalLearningObjectives * 100
  };

  // Per-LO Detailed Tracking
  learningObjectives: {
    [learningObjectiveId: string]: LearningObjectiveProgress;
  };

  // Smart Resume
  lastAccessedLearningObjectiveId: string | null; // Last LO the user viewed
  lastAccessedAt: Date;

  // Timestamps
  enrolledAt: Date; // When user first enrolled
  startedAt: Date | null; // When user first viewed content
  completedAt: Date | null; // When masteryProgress reaches 100%
}

/**
 * Learning Objective Progress - Individual LO Level
 *
 * Tracks detailed progress for a single Learning Objective
 */
export interface LearningObjectiveProgress {
  learningObjectiveId: string; // "FL-1.1.1"

  // Content Tracking
  contentVisited: boolean; // Has user viewed the content page?
  contentFirstVisitedAt: Date | null; // First time content was viewed
  contentLastVisitedAt: Date | null; // Most recent view
  contentVisitCount: number; // How many times user visited content

  // Quiz Tracking
  quizAttempts: QuizAttempt[]; // All quiz attempts (ordered chronologically)
  quizPassed: boolean; // True when user achieves 100% score
  quizPassedAt: Date | null; // When user first passed

  // Time Tracking (for analytics)
  timeSpentOnContent: number; // Seconds spent reading content
  timeSpentOnQuiz: number; // Seconds spent on quizzes
}

/**
 * Quiz Attempt - Single Quiz Session
 *
 * Records details of each quiz attempt with progressive cooldown
 */
export interface QuizAttempt {
  id: string;
  userId: string;
  learningObjectiveId: string; // Which LO this quiz is for

  attemptNumber: number; // 1, 2, 3, ... (sequential)
  score: number; // 0-100
  passed: boolean; // score === 100

  // Question Tracking
  questions: QuizQuestionAttempt[]; // Ordered as presented to user (after shuffle)
  totalQuestions: number;
  correctAnswers: number;

  // Timing
  startedAt: Date; // When quiz was started
  completedAt: Date; // When quiz was finished
  duration: number; // Seconds taken to complete

  // Progressive Cooldown (from research)
  // 1st retry: immediate
  // 2nd retry: 15 minutes
  // 3rd+ retry: 1 hour
  nextAttemptAllowedAt: Date | null; // null if passed or can retry immediately
}

/**
 * Quiz Question Attempt - Individual Question Answer
 *
 * Records user's answer to a single question within a quiz attempt
 */
export interface QuizQuestionAttempt {
  questionId: string; // Reference to QuizQuestion
  questionOrder: number; // Position in shuffled quiz (1, 2, 3...)
  selectedAnswer: string; // Option ID user selected ("A", "B", "C", "D")
  correctAnswer: string; // Option ID that was correct
  isCorrect: boolean; // selectedAnswer === correctAnswer
  timeSpent: number; // Seconds spent on this question
}

/**
 * Activity Heatmap Data
 * For the GitHub-style contribution graph
 */
export interface ActivityDay {
  date: string; // YYYY-MM-DD format
  count: number; // Number of Learning Objectives completed (passed quiz) that day
  level: 0 | 1 | 2 | 3 | 4; // Activity intensity level
}

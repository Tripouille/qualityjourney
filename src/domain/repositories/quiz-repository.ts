/**
 * Quiz Repository Interface
 * Defines contract for quiz data access
 */

import { Quiz, QuizAttempt } from '@/domain/entities/quiz';

export interface QuizRepository {
  /**
   * Find a quiz by its ID
   */
  findById(id: string): Promise<Quiz | null>;

  /**
   * Find a quiz by lesson ID
   */
  findByLessonId(lessonId: string): Promise<Quiz | null>;

  /**
   * Create a new quiz
   */
  create(quiz: Omit<Quiz, 'id' | 'createdAt' | 'updatedAt'>): Promise<Quiz>;

  /**
   * Update an existing quiz
   */
  update(id: string, data: Partial<Quiz>): Promise<Quiz>;

  /**
   * Delete a quiz
   */
  delete(id: string): Promise<void>;

  /**
   * Save a quiz attempt result
   */
  saveAttempt(attempt: Omit<QuizAttempt, 'id'>): Promise<QuizAttempt>;

  /**
   * Get quiz attempts for a user
   */
  getAttemptsByUser(userId: string, quizId?: string): Promise<QuizAttempt[]>;
}

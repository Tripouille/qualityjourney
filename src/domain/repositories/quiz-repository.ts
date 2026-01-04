/**
 * Quiz Repository Interface
 * Defines contract for quiz question data access
 *
 * Updated for Learning Objective-based architecture
 * - QuizAttempt tracking moved to ProgressRepository
 * - Quiz questions are now associated with Learning Objectives
 */

import type { QuizQuestion } from '@/domain/entities/quiz';

export interface QuizRepository {
  /**
   * Find all quiz questions for a Learning Objective
   */
  findByLearningObjectiveId(learningObjectiveId: string): Promise<QuizQuestion[]>;

  /**
   * Find a specific quiz question by ID
   */
  findById(id: string): Promise<QuizQuestion | null>;

  /**
   * Create a new quiz question
   */
  create(question: Omit<QuizQuestion, 'id' | 'createdAt' | 'updatedAt'>): Promise<QuizQuestion>;

  /**
   * Update an existing quiz question
   */
  update(id: string, data: Partial<QuizQuestion>): Promise<QuizQuestion>;

  /**
   * Delete a quiz question
   */
  delete(id: string): Promise<void>;

  /**
   * Get all questions for a course (for content management)
   */
  findByCourseId(courseId: string): Promise<QuizQuestion[]>;
}

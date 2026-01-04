import type { UserProgress, ActivityDay } from '@/domain/entities/progress';

/**
 * Progress Repository Interface
 * Defines the contract for progress tracking data access
 *
 * Updated for Learning Objective-based architecture
 */
export interface ProgressRepository {
  /**
   * Find course progress for a user
   */
  findByUserAndCourse(userId: string, courseId: string): Promise<UserProgress | null>;

  /**
   * Find all course progress for a user
   */
  findByUserId(userId: string): Promise<UserProgress[]>;

  /**
   * Get activity heatmap data for a user
   */
  getActivityHeatmap(userId: string, startDate: Date, endDate: Date): Promise<ActivityDay[]>;

  /**
   * Create or update course progress
   */
  upsert(progress: Omit<UserProgress, 'id'>): Promise<UserProgress>;

  /**
   * Mark a Learning Objective content as visited
   */
  markLearningObjectiveVisited(userId: string, courseId: string, learningObjectiveId: string): Promise<void>;

  /**
   * Mark a Learning Objective quiz as passed
   */
  markLearningObjectivePassed(userId: string, courseId: string, learningObjectiveId: string): Promise<void>;

  /**
   * Update time spent on a Learning Objective
   */
  updateTimeSpent(userId: string, courseId: string, learningObjectiveId: string, seconds: number): Promise<void>;

  /**
   * Delete progress (unenroll from course)
   */
  delete(userId: string, courseId: string): Promise<void>;
}

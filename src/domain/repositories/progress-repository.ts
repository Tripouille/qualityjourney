import type { CourseProgress, ActivityDay } from '@/domain/entities/progress';

/**
 * Progress Repository Interface
 * Defines the contract for progress tracking data access
 */
export interface ProgressRepository {
  /**
   * Find course progress for a user
   */
  findByUserAndCourse(userId: string, courseId: string): Promise<CourseProgress | null>;

  /**
   * Find all course progress for a user
   */
  findByUserId(userId: string): Promise<CourseProgress[]>;

  /**
   * Get activity heatmap data for a user
   */
  getActivityHeatmap(userId: string, startDate: Date, endDate: Date): Promise<ActivityDay[]>;

  /**
   * Create or update course progress
   */
  upsert(progress: Omit<CourseProgress, 'id'>): Promise<CourseProgress>;

  /**
   * Mark a lesson as completed
   */
  markLessonCompleted(userId: string, courseId: string, lessonId: string): Promise<void>;

  /**
   * Update time spent on a lesson
   */
  updateTimeSpent(userId: string, courseId: string, lessonId: string, seconds: number): Promise<void>;

  /**
   * Delete progress (unenroll from course)
   */
  delete(userId: string, courseId: string): Promise<void>;
}

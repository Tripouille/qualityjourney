/**
 * Progress Entity
 * Tracks user progress through courses
 */

export interface LessonProgress {
  lessonId: string;
  completedAt: Date | null;
  timeSpent: number; // in seconds
}

export interface ModuleProgress {
  moduleId: string;
  lessonsCompleted: number;
  totalLessons: number;
  completedAt: Date | null;
}

export interface CourseProgress {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: Date;
  startedAt: Date | null;
  completedAt: Date | null;
  lastAccessedAt: Date;
  progressPercentage: number;
  moduleProgress: ModuleProgress[];
  totalTimeSpent: number; // in seconds
}

/**
 * Activity Heatmap Data
 * For the GitHub-style contribution graph
 */
export interface ActivityDay {
  date: string; // YYYY-MM-DD format
  count: number; // Number of lessons completed that day
  level: 0 | 1 | 2 | 3 | 4; // Activity intensity level
}

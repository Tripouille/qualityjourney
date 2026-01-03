/**
 * Course Entity
 * Represents a training course on the platform
 */

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';
export type CourseStatus = 'draft' | 'published' | 'archived';

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
  duration: number; // in minutes
}

export interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'article' | 'quiz' | 'exercise';
  duration: number; // in minutes
  order: number;
  content: string; // URL or content identifier
  isCompleted?: boolean; // User-specific state
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  level: CourseLevel;
  status: CourseStatus;
  thumbnailUrl: string;
  instructorId: string;
  modules: CourseModule[];
  tags: string[];
  totalDuration: number; // in minutes
  totalLessons: number;
  enrolledCount: number;
  rating: number | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Course Summary
 * Lightweight version for listing pages
 */
export interface CourseSummary {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  level: CourseLevel;
  thumbnailUrl: string;
  totalDuration: number;
  totalLessons: number;
  enrolledCount: number;
  rating: number | null;
}

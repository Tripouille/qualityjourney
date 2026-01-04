import type { Course, CourseSummary, CourseLevel } from '@/domain/entities/course';

/**
 * Course Repository Interface
 * Defines the contract for course data access
 */
export interface CourseRepository {
  /**
   * Find all published courses
   */
  findAll(): Promise<CourseSummary[]>;

  /**
   * Find courses by filters
   */
  findByFilters(filters: {
    level?: CourseLevel;
    tags?: string[];
    search?: string;
  }): Promise<CourseSummary[]>;

  /**
   * Find a course by ID (full details)
   */
  findById(id: string): Promise<Course | null>;

  /**
   * Find a course by slug (full details)
   */
  findBySlug(slug: string): Promise<Course | null>;

  /**
   * Get featured courses for homepage
   */
  findFeatured(limit?: number): Promise<CourseSummary[]>;

  /**
   * Create a new course (admin only - future)
   */
  create(course: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Promise<Course>;

  /**
   * Update a course (admin only - future)
   */
  update(id: string, data: Partial<Course>): Promise<Course>;

  /**
   * Delete a course (admin only - future)
   */
  delete(id: string): Promise<void>;
}

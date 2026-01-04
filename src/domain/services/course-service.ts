import type { CourseRepository } from '@/domain/repositories/course-repository';
import type { Course, CourseSummary, CourseLevel } from '@/domain/entities/course';

/**
 * Course Service
 * Business logic for course-related operations
 */
export class CourseService {
  constructor(private courseRepository: CourseRepository) {}

  /**
   * Get all published courses
   */
  async getAllCourses(): Promise<CourseSummary[]> {
    return this.courseRepository.findAll();
  }

  /**
   * Get filtered courses
   */
  async getFilteredCourses(filters: {
    level?: CourseLevel;
    tags?: string[];
    search?: string;
  }): Promise<CourseSummary[]> {
    return this.courseRepository.findByFilters(filters);
  }

  /**
   * Get a course by slug (for course detail page)
   */
  async getCourseBySlug(slug: string): Promise<Course> {
    const course = await this.courseRepository.findBySlug(slug);

    if (course === null) {
      throw new Error(`Course with slug "${slug}" not found`);
    }

    if (course.status !== 'published') {
      throw new Error(`Course "${slug}" is not published`);
    }

    return course;
  }

  /**
   * Get featured courses for homepage
   */
  async getFeaturedCourses(limit = 3): Promise<CourseSummary[]> {
    return this.courseRepository.findFeatured(limit);
  }

  /**
   * Calculate course progress percentage
   */
  calculateProgressPercentage(
    course: Course,
    completedLessonIds: string[]
  ): number {
    const totalLessons = course.totalLessons;
    const completed = completedLessonIds.length;

    if (totalLessons === 0) {return 0;}

    return Math.round((completed / totalLessons) * 100);
  }

  /**
   * Get course duration in human-readable format
   */
  formatDuration(minutes: number): string {
    if (minutes < 60) {
      return `${minutes}m`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (remainingMinutes === 0) {
      return `${hours}h`;
    }

    return `${hours}h ${remainingMinutes}m`;
  }

  /**
   * Get all unique tags from all courses
   */
  async getAllTags(): Promise<string[]> {
    const courses = await this.courseRepository.findAll();
    const tagSet = new Set<string>();

    for (const course of courses) {
      const fullCourse = await this.courseRepository.findById(course.id);
      if (fullCourse !== null) {
        fullCourse.tags.forEach((tag) => tagSet.add(tag));
      }
    }

    return [...tagSet].sort();
  }
}

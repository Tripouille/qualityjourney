import type { CourseRepository } from '@/domain/repositories/course-repository';
import type { Course, CourseSummary, CourseLevel } from '@/domain/entities/course';
import { MOCK_COURSES } from './data/mock-courses';

/**
 * In-Memory Course Repository Implementation
 * Uses mock data - will be replaced by Drizzle implementation later
 */
export class CourseRepositoryInMemory implements CourseRepository {
  private courses: Course[] = MOCK_COURSES;

  async findAll(): Promise<CourseSummary[]> {
    await Promise.resolve(); // Simulate async operation (future: DB query)
    const publishedCourses = this.courses.filter((c) => c.status === 'published');
    return publishedCourses.map(this.toCourseSummary);
  }

  async findByFilters(filters: {
    level?: CourseLevel;
    tags?: string[];
    search?: string;
  }): Promise<CourseSummary[]> {
    await Promise.resolve(); // Simulate async operation (future: DB query)
    let filtered = this.courses.filter((c) => c.status === 'published');

    if (filters.level !== undefined) {
      filtered = filtered.filter((c) => c.level === filters.level);
    }

    if (filters.tags !== undefined && filters.tags.length > 0) {
      const filterTags = filters.tags; // Capture for type narrowing
      filtered = filtered.filter((c) =>
        filterTags.some((tag) => c.tags.includes(tag))
      );
    }

    if (filters.search !== undefined && filters.search !== '') {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.title.toLowerCase().includes(searchLower) ||
          c.description.toLowerCase().includes(searchLower) ||
          c.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    return filtered.map(this.toCourseSummary);
  }

  async findById(id: string): Promise<Course | null> {
    await Promise.resolve(); // Simulate async operation (future: DB query)
    const course = this.courses.find((c) => c.id === id);
    return course ?? null;
  }

  async findBySlug(slug: string): Promise<Course | null> {
    await Promise.resolve(); // Simulate async operation (future: DB query)
    const course = this.courses.find((c) => c.slug === slug);
    return course ?? null;
  }

  async findFeatured(limit = 3): Promise<CourseSummary[]> {
    await Promise.resolve(); // Simulate async operation (future: DB query)
    const published = this.courses.filter((c) => c.status === 'published');

    // Sort by rating and enrollment count
    const sorted = published.sort((a, b) => {
      const ratingDiff = (b.rating ?? 0) - (a.rating ?? 0);
      if (ratingDiff !== 0) {
        return ratingDiff;
      }
      return b.enrolledCount - a.enrolledCount;
    });

    return sorted.slice(0, limit).map(this.toCourseSummary);
  }

  async create(course: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Promise<Course> {
    await Promise.resolve(); // Simulate async operation (future: DB insert)
    const newCourse: Course = {
      ...course,
      id: `course-${this.courses.length + 1}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.courses.push(newCourse);
    return newCourse;
  }

  async update(id: string, data: Partial<Course>): Promise<Course> {
    await Promise.resolve(); // Simulate async operation (future: DB update)
    const index = this.courses.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error(`Course with id ${id} not found`);
    }

    const existingCourse = this.courses[index];
    if (existingCourse === undefined) {
      throw new Error(`Course with id ${id} not found in array`);
    }

    const updated: Course = {
      ...existingCourse,
      ...data,
      updatedAt: new Date(),
    };

    this.courses[index] = updated;
    return updated;
  }

  async delete(id: string): Promise<void> {
    await Promise.resolve(); // Simulate async operation (future: DB delete)
    const index = this.courses.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error(`Course with id ${id} not found`);
    }

    this.courses.splice(index, 1);
  }

  /**
   * Helper: Convert Course to CourseSummary
   */
  private toCourseSummary(course: Course): CourseSummary {
    return {
      id: course.id,
      title: course.title,
      slug: course.slug,
      shortDescription: course.shortDescription,
      level: course.level,
      thumbnailUrl: course.thumbnailUrl,
      totalDuration: course.totalDuration,
      totalLessons: course.totalLessons,
      enrolledCount: course.enrolledCount,
      rating: course.rating,
    };
  }
}

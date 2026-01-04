/**
 * Dependency Injection Container
 *
 * This is the ONLY place where we instantiate repository implementations.
 * When migrating to Drizzle, we only change this file.
 *
 * Pattern: Singleton
 */

import type { CourseRepository } from "@/domain/repositories/course-repository";
// import type { QuizRepository } from "@/domain/repositories/quiz-repository"; // Disabled - using new architecture
// import { UserRepository } from '@/domain/repositories/user-repository';
// import { CertificateRepository } from '@/domain/repositories/certificate-repository';
// import { ProgressRepository } from '@/domain/repositories/progress-repository';

import { CourseRepositoryInMemory } from "@/infrastructure/repositories/in-memory/course-repository-in-memory";
// import { QuizRepositoryInMemory } from "@/infrastructure/repositories/in-memory/quiz-repository-in-memory"; // Disabled - using new architecture
// import { UserRepositoryInMemory } from '@/infrastructure/repositories/in-memory/user-repository-in-memory';
// import { CertificateRepositoryInMemory } from '@/infrastructure/repositories/in-memory/certificate-repository-in-memory';
// import { ProgressRepositoryInMemory } from '@/infrastructure/repositories/in-memory/progress-repository-in-memory';

// Future: Drizzle implementations
// import { CourseRepositoryDrizzle } from '@/infrastructure/repositories/drizzle/course-repository-drizzle';
// import { db } from '@/infrastructure/database/client';

class DependencyContainer {
  private static instance: DependencyContainer;

  // Repository instances
  public readonly courseRepository: CourseRepository;
  // public readonly quizRepository: QuizRepository; // Disabled - using new architecture
  // public readonly userRepository: UserRepository;
  // public readonly certificateRepository: CertificateRepository;
  // public readonly progressRepository: ProgressRepository;

  private constructor() {
    // Current: In-Memory implementations
    this.courseRepository = new CourseRepositoryInMemory();
    // this.quizRepository = new QuizRepositoryInMemory(); // Disabled - using new architecture
    // this.userRepository = new UserRepositoryInMemory();
    // this.certificateRepository = new CertificateRepositoryInMemory();
    // this.progressRepository = new ProgressRepositoryInMemory();

    // Future: Drizzle implementations (just swap here)
    // this.courseRepository = new CourseRepositoryDrizzle(db);
    // this.quizRepository = new QuizRepositoryDrizzle(db);
    // this.userRepository = new UserRepositoryDrizzle(db);
    // this.certificateRepository = new CertificateRepositoryDrizzle(db);
    // this.progressRepository = new ProgressRepositoryDrizzle(db);
  }

  public static getInstance(): DependencyContainer {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    DependencyContainer.instance ??= new DependencyContainer();

    return DependencyContainer.instance;
  }

  /**
   * Reset instance (useful for testing)
   */
  public static resetInstance(): void {
    DependencyContainer.instance = null as unknown as DependencyContainer;
  }
}

/**
 * Singleton instance export
 *
 * Usage in services/components:
 * import { container } from '@/infrastructure/di/container';
 * const courseService = new CourseService(container.courseRepository);
 */
export const container = DependencyContainer.getInstance();

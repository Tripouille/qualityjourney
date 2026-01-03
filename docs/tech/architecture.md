# Architecture Pattern: Repository + Domain-Driven Design

## Why Repository Pattern?

We are NOT connecting a database yet. The Repository Pattern allows us to:

1. Build the entire app with in-memory mock data
2. Switch to Drizzle/Postgres later by changing only the repository implementation
3. Keep business logic decoupled from data source

**Key Benefit:** Zero UI changes when migrating from in-memory to real database.

---

## Layer Structure

```
src/
├── domain/              # Pure business logic & interfaces (no dependencies)
│   ├── entities/        # Domain models (User, Course, Certificate, Quiz, etc.)
│   ├── repositories/    # Repository interfaces (contracts)
│   └── services/        # Business logic services
│
├── infrastructure/      # External concerns (data, API clients)
│   ├── repositories/    # Repository implementations
│   │   ├── in-memory/   # Mock data (current)
│   │   │   ├── data/    # Mock data files
│   │   │   └── *.ts     # In-memory implementations
│   │   └── drizzle/     # Database (future)
│   └── di/              # Dependency Injection container
│
├── app/                 # Next.js App Router (pages, layouts, routes)
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   ├── courses/         # Courses routes
│   ├── blog/            # Blog routes
│   └── profile/         # Profile routes
│
├── features/            # Feature modules (UI + feature-specific logic)
│   ├── home/
│   ├── courses/
│   │   ├── components/  # Feature-specific components
│   │   ├── hooks/       # TanStack Query hooks
│   │   ├── schemas/     # Zod schemas
│   │   └── types/       # Feature types
│   ├── blog/
│   └── profile/
│
├── components/          # Shared UI components
│   ├── ui/              # Shadcn components (Button, Card, etc.)
│   └── common/          # Custom shared components (KLevelBadge, etc.)
│
└── lib/                 # Utilities, helpers, config
    ├── stores/          # Zustand stores
    ├── utils/           # Utility functions
    └── config/          # App configuration
```

---

## Dependency Flow (Critical)

```
┌─────────────────────────────────────────────────────────────┐
│                     Dependency Flow                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  app/ (Next.js pages)                                        │
│    ↓                                                         │
│  features/ (UI components + hooks)                           │
│    ↓                                                         │
│  domain/services/ (Business logic)                           │
│    ↓                                                         │
│  domain/repositories/ (INTERFACE ONLY)                       │
│    ↑                                                         │
│  infrastructure/repositories/ (IMPLEMENTATION)               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Rules:

1. **`domain/` NEVER imports from `infrastructure/` or `features/` or `app/`**
   - Domain is pure business logic
   - No framework dependencies (React, Next.js, etc.)
   - Only imports from other `domain/` modules

2. **`domain/` contains only interfaces and pure business logic**
   - Repository interfaces (contracts)
   - Entity definitions
   - Service classes (business logic)

3. **`infrastructure/` implements domain interfaces**
   - In-memory repositories (current)
   - Drizzle repositories (future)
   - External API clients (future)

4. **`features/` and `app/` consume domain services via Dependency Injection**
   - Import from `domain/services/`
   - Get repositories from DI container
   - Never import concrete implementations directly

---

## Example: Course Feature Flow

### 1. Entity (Domain)

```typescript
// src/domain/entities/course.ts
export interface Course {
  id: string;
  title: string;
  description: string;
  slug: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### 2. Repository Interface (Domain)

```typescript
// src/domain/repositories/course-repository.ts
import { Course } from '@/domain/entities/course';

export interface CourseRepository {
  findAll(): Promise<Course[]>;
  findById(id: string): Promise<Course | null>;
  findBySlug(slug: string): Promise<Course | null>;
}
```

### 3. In-Memory Implementation (Infrastructure)

```typescript
// src/infrastructure/repositories/in-memory/course-repository-in-memory.ts
import { CourseRepository } from '@/domain/repositories/course-repository';
import { Course } from '@/domain/entities/course';
import { mockCourses } from './data/mock-courses';

export class CourseRepositoryInMemory implements CourseRepository {
  private courses: Course[] = mockCourses;

  async findAll(): Promise<Course[]> {
    return this.courses;
  }

  async findById(id: string): Promise<Course | null> {
    return this.courses.find(c => c.id === id) ?? null;
  }

  async findBySlug(slug: string): Promise<Course | null> {
    return this.courses.find(c => c.slug === slug) ?? null;
  }
}
```

### 4. Dependency Injection (Infrastructure)

```typescript
// src/infrastructure/di/container.ts
import { CourseRepository } from '@/domain/repositories/course-repository';
import { CourseRepositoryInMemory } from '@/infrastructure/repositories/in-memory/course-repository-in-memory';

class DependencyContainer {
  private static instance: DependencyContainer;

  public readonly courseRepository: CourseRepository;

  private constructor() {
    // Switch implementation here when moving to Drizzle
    this.courseRepository = new CourseRepositoryInMemory();
  }

  public static getInstance(): DependencyContainer {
    if (!DependencyContainer.instance) {
      DependencyContainer.instance = new DependencyContainer();
    }
    return DependencyContainer.instance;
  }
}

export const container = DependencyContainer.getInstance();
```

### 5. Domain Service (Domain)

```typescript
// src/domain/services/course-service.ts
import { CourseRepository } from '@/domain/repositories/course-repository';
import { Course } from '@/domain/entities/course';

export class CourseService {
  constructor(private courseRepository: CourseRepository) {}

  async getAllCourses(): Promise<Course[]> {
    return this.courseRepository.findAll();
  }

  async getCourseBySlug(slug: string): Promise<Course> {
    const course = await this.courseRepository.findBySlug(slug);
    if (!course) {
      throw new Error(`Course not found: ${slug}`);
    }
    return course;
  }
}
```

### 6. Hook (Feature)

```typescript
// src/features/courses/hooks/use-courses.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { container } from '@/infrastructure/di/container';
import { CourseService } from '@/domain/services/course-service';

export function useCourses() {
  const courseService = new CourseService(container.courseRepository);

  return useQuery({
    queryKey: ['courses'],
    queryFn: () => courseService.getAllCourses(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

### 7. Component (App/Feature)

```typescript
// src/app/courses/page.tsx
import { useCourses } from '@/features/courses/hooks/use-courses';

export default function CoursesPage() {
  const { data: courses, isLoading, error } = useCourses();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return <CourseList courses={courses} />;
}
```

---

## Migration to Database (Future)

When switching to Drizzle + PostgreSQL:

### Step 1: Create Drizzle Schema

```typescript
// src/infrastructure/database/schema/courses.ts
import { pgTable, varchar, timestamp } from 'drizzle-orm/pg-core';

export const courses = pgTable('courses', {
  id: varchar('id', { length: 255 }).primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

### Step 2: Create Drizzle Repository

```typescript
// src/infrastructure/repositories/drizzle/course-repository-drizzle.ts
import { CourseRepository } from '@/domain/repositories/course-repository';
import { Course } from '@/domain/entities/course';
import { db } from '@/infrastructure/database/client';
import { courses } from '@/infrastructure/database/schema/courses';
import { eq } from 'drizzle-orm';

export class CourseRepositoryDrizzle implements CourseRepository {
  async findAll(): Promise<Course[]> {
    return db.select().from(courses);
  }

  async findById(id: string): Promise<Course | null> {
    const results = await db.select().from(courses).where(eq(courses.id, id));
    return results[0] ?? null;
  }

  async findBySlug(slug: string): Promise<Course | null> {
    const results = await db.select().from(courses).where(eq(courses.slug, slug));
    return results[0] ?? null;
  }
}
```

### Step 3: Update DI Container

```typescript
// src/infrastructure/di/container.ts
import { CourseRepository } from '@/domain/repositories/course-repository';
import { CourseRepositoryDrizzle } from '@/infrastructure/repositories/drizzle/course-repository-drizzle';

class DependencyContainer {
  // ...

  private constructor() {
    // CHANGED: Switch to Drizzle implementation
    this.courseRepository = new CourseRepositoryDrizzle();
  }
}
```

### Step 4: Zero Changes Needed

**No changes required in:**
- ✅ `domain/entities/` (Course interface unchanged)
- ✅ `domain/repositories/` (Interface unchanged)
- ✅ `domain/services/` (CourseService unchanged)
- ✅ `features/courses/hooks/` (useCourses unchanged)
- ✅ `app/courses/page.tsx` (UI unchanged)

**Only changed:**
- 🔄 DI container (1 line)
- 🔄 Infrastructure layer (new Drizzle implementation)

---

## Anti-Patterns (Forbidden)

### ❌ WRONG: Direct Repository Import in Domain

```typescript
// domain/services/course-service.ts
import { CourseRepositoryInMemory } from '@/infrastructure/repositories/in-memory/course-repository-in-memory';
// ❌ FORBIDDEN: Domain importing from infrastructure
```

### ❌ WRONG: Business Logic in Components

```typescript
// app/courses/page.tsx
export default function CoursesPage() {
  const { data: courses } = useCourses();

  // ❌ FORBIDDEN: Business logic in component
  const activeCourses = courses.filter(c => c.isActive && c.publishedAt <= new Date());

  return <CourseList courses={activeCourses} />;
}
```

### ❌ WRONG: Direct Data Access in Components

```typescript
// app/courses/page.tsx
import { mockCourses } from '@/infrastructure/repositories/in-memory/data/mock-courses';

export default function CoursesPage() {
  // ❌ FORBIDDEN: Direct data access
  return <CourseList courses={mockCourses} />;
}
```

### ✅ CORRECT Patterns

**Business logic in service:**
```typescript
// domain/services/course-service.ts
async getActiveCourses(): Promise<Course[]> {
  const courses = await this.courseRepository.findAll();
  return courses.filter(c => c.isActive && c.publishedAt <= new Date());
}
```

**Component consumes service via hook:**
```typescript
// features/courses/hooks/use-active-courses.ts
export function useActiveCourses() {
  const courseService = new CourseService(container.courseRepository);
  return useQuery({
    queryKey: ['courses', 'active'],
    queryFn: () => courseService.getActiveCourses(),
  });
}
```

---

## Naming Conventions

**Repository Interface:** `{Entity}Repository`
- Example: `CourseRepository`, `UserRepository`, `QuizRepository`

**In-Memory Implementation:** `{Entity}RepositoryInMemory`
- Example: `CourseRepositoryInMemory`

**Drizzle Implementation:** `{Entity}RepositoryDrizzle`
- Example: `CourseRepositoryDrizzle`

**Service:** `{Entity}Service`
- Example: `CourseService`, `QuizService`

**Hook:** `use{Feature}`
- Example: `useCourses`, `useCourse`, `useQuiz`

---

## Summary

1. **Domain** = Pure business logic (no framework dependencies)
2. **Infrastructure** = External concerns (data, APIs)
3. **Dependency Injection** = Glue that connects interface to implementation
4. **Repository Pattern** = Abstraction over data source
5. **Migration-ready** = Change 1 line in DI container to switch data sources

For detailed step-by-step repository creation, see [.claude/skills/create-repository.md](../../.claude/skills/create-repository.md).

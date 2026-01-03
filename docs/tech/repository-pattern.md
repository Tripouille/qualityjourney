# Repository Pattern Implementation

## Overview

The Repository Pattern provides an abstraction layer between the domain logic and data access logic.

**Key Benefit:** Switch from in-memory mock data to a real database (Drizzle + PostgreSQL) by changing only the repository implementation.

For detailed step-by-step instructions, see [.claude/skills/create-repository.md](../../.claude/skills/create-repository.md).

---

## Quick Reference

### 1. Define Entity

**Location:** `src/domain/entities/`

```typescript
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

---

### 2. Define Repository Interface

**Location:** `src/domain/repositories/`

```typescript
import { Course } from '@/domain/entities/course';

export interface CourseRepository {
  findAll(): Promise<Course[]>;
  findById(id: string): Promise<Course | null>;
  findBySlug(slug: string): Promise<Course | null>;
  create(course: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Promise<Course>;
  update(id: string, data: Partial<Course>): Promise<Course>;
  delete(id: string): Promise<void>;
}
```

**Rules:**
- Always return `Promise<T>` (async by design)
- Use `T | null` for queries that might not find a match
- Use `Omit<T, 'id' | 'createdAt' | 'updatedAt'>` for create methods

---

### 3. Implement In-Memory Repository

**Location:** `src/infrastructure/repositories/in-memory/`

```typescript
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

  async create(course: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Promise<Course> {
    const newCourse: Course = {
      ...course,
      id: `course-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.courses.push(newCourse);
    return newCourse;
  }

  async update(id: string, data: Partial<Course>): Promise<Course> {
    const index = this.courses.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error(`Course ${id} not found`);
    }
    const course = this.courses[index];
    if (!course) {
      throw new Error(`Course ${id} not found`);
    }
    const updatedCourse = { ...course, ...data, updatedAt: new Date() };
    this.courses[index] = updatedCourse;
    return updatedCourse;
  }

  async delete(id: string): Promise<void> {
    this.courses = this.courses.filter(c => c.id !== id);
  }
}
```

**Critical:** Use `.find()` with `?? null` pattern (handles `noUncheckedIndexedAccess`).

---

### 4. Register in DI Container

**Location:** `src/infrastructure/di/container.ts`

```typescript
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

---

### 5. Create Domain Service (Optional)

**Location:** `src/domain/services/`

```typescript
import { CourseRepository } from '@/domain/repositories/course-repository';

export class CourseService {
  constructor(private courseRepository: CourseRepository) {}

  async getAllCourses() {
    return this.courseRepository.findAll();
  }

  async getCourseBySlug(slug: string) {
    const course = await this.courseRepository.findBySlug(slug);
    if (!course) {
      throw new Error(`Course not found: ${slug}`);
    }
    return course;
  }
}
```

---

### 6. Use in Component via Hook

**Location:** `src/features/{feature}/hooks/`

```typescript
'use client';

import { useQuery } from '@tanstack/react-query';
import { container } from '@/infrastructure/di/container';
import { CourseService } from '@/domain/services/course-service';

export function useCourses() {
  const courseService = new CourseService(container.courseRepository);

  return useQuery({
    queryKey: ['courses'],
    queryFn: () => courseService.getAllCourses(),
    staleTime: 5 * 60 * 1000,
  });
}
```

---

## Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Entity | `{Entity}` | `Course`, `Quiz`, `User` |
| Repository Interface | `{Entity}Repository` | `CourseRepository` |
| In-Memory Implementation | `{Entity}RepositoryInMemory` | `CourseRepositoryInMemory` |
| Drizzle Implementation | `{Entity}RepositoryDrizzle` | `CourseRepositoryDrizzle` |
| Service | `{Entity}Service` | `CourseService` |
| Hook | `use{Feature}` | `useCourses`, `useCourse` |

---

## Migration to Drizzle (Future)

### Step 1: Create Drizzle Schema

```typescript
// src/infrastructure/database/schema/courses.ts
import { pgTable, varchar, timestamp, text } from 'drizzle-orm/pg-core';

export const courses = pgTable('courses', {
  id: varchar('id', { length: 255 }).primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  level: varchar('level', { length: 50 }).notNull(),
  duration: integer('duration').notNull(),
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

  // ... create, update, delete
}
```

### Step 3: Update DI Container

```typescript
// src/infrastructure/di/container.ts
private constructor() {
  // CHANGED: Switch to Drizzle
  this.courseRepository = new CourseRepositoryDrizzle();
}
```

### Step 4: Zero Changes Required

**No changes needed in:**
- ✅ Domain entities
- ✅ Repository interfaces
- ✅ Domain services
- ✅ Hooks
- ✅ Components

**Only changed:**
- 🔄 DI container (1 line)
- 🔄 Infrastructure layer (new implementation)

---

## Anti-Patterns

### ❌ WRONG: Direct Repository Import in Domain

```typescript
// domain/services/course-service.ts
import { CourseRepositoryInMemory } from '@/infrastructure/repositories/in-memory/course-repository-in-memory';
// ❌ Domain depending on infrastructure
```

### ❌ WRONG: Direct Data Access in Components

```typescript
// app/courses/page.tsx
import { mockCourses } from '@/infrastructure/repositories/in-memory/data/mock-courses';
// ❌ Component accessing data directly
```

### ✅ CORRECT: Use DI Container

```typescript
// domain/services/course-service.ts
import { CourseRepository } from '@/domain/repositories/course-repository';
// ✅ Depends on interface, not implementation

// component
import { container } from '@/infrastructure/di/container';
// ✅ Access via DI container
```

---

## Summary

1. **Entities** define the domain model
2. **Repositories** abstract data access
3. **In-memory implementations** provide mock data
4. **DI container** wires interface to implementation
5. **Services** contain business logic
6. **Hooks** consume services via TanStack Query
7. **Migration** = change 1 line in DI container

For step-by-step guide, see [.claude/skills/create-repository.md](../../.claude/skills/create-repository.md).

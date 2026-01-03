# QualityJourney.dev - Architecture Overview

## Folder Structure

```
qualityjourney/
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── layout.tsx               # Root layout
│   │   ├── page.tsx                 # Homepage
│   │   └── globals.css              # Global styles (Tailwind + Shadcn variables)
│   │
│   ├── domain/                      # 🎯 Core Business Logic (Framework-agnostic)
│   │   ├── entities/                # Domain models (pure TypeScript interfaces)
│   │   │   ├── user.ts              # User, UserProfile
│   │   │   ├── course.ts            # Course, CourseSummary, CourseModule, Lesson
│   │   │   ├── certificate.ts       # Certificate
│   │   │   └── progress.ts          # CourseProgress, ActivityDay
│   │   │
│   │   ├── repositories/            # Repository interfaces (contracts only)
│   │   │   ├── course-repository.ts
│   │   │   ├── user-repository.ts
│   │   │   ├── certificate-repository.ts
│   │   │   └── progress-repository.ts
│   │   │
│   │   └── services/                # Business logic services
│   │       └── course-service.ts    # Course-related business rules
│   │
│   ├── infrastructure/              # 🔧 External Integrations & Implementations
│   │   ├── repositories/
│   │   │   ├── in-memory/           # ✅ Current: Mock data implementations
│   │   │   │   ├── data/
│   │   │   │   │   └── mock-courses.ts
│   │   │   │   └── course-repository-in-memory.ts
│   │   │   │
│   │   │   └── drizzle/             # 🔮 Future: Database implementations
│   │   │       └── (Drizzle ORM repositories will go here)
│   │   │
│   │   └── di/                      # Dependency Injection
│   │       └── container.ts         # ⚡ THE KEY FILE - Switch implementations here
│   │
│   ├── features/                    # 🎨 Feature Modules (UI + feature-specific logic)
│   │   ├── courses/
│   │   │   ├── components/          # Course-specific UI components
│   │   │   ├── hooks/               # Course-specific React hooks
│   │   │   ├── schemas/             # Zod validation schemas for courses
│   │   │   └── types/               # Feature-specific TypeScript types
│   │   │
│   │   ├── home/                    # Homepage feature
│   │   │   └── components/
│   │   │
│   │   ├── blog/                    # Blog feature (placeholder)
│   │   │   └── components/
│   │   │
│   │   └── profile/                 # User profile feature (certificates, heatmap)
│   │       └── components/
│   │
│   ├── components/                  # 🧩 Shared UI Components
│   │   ├── ui/                      # Shadcn/ui components (generated)
│   │   │   └── (button, card, etc. will be added here)
│   │   │
│   │   └── common/                  # Custom shared components
│   │       └── (Navbar, Footer, etc.)
│   │
│   └── lib/                         # 🛠️ Utilities & Helpers
│       ├── utils.ts                 # Utility functions (cn, etc.)
│       └── stores/                  # Zustand global state stores (future)
│
├── CLAUDE.md                        # 📘 Source of Truth - Architecture Rules
├── ARCHITECTURE.md                  # 📐 This file - Visual overview
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript config (strict mode ✓)
├── tailwind.config.ts               # Tailwind config
└── components.json                  # Shadcn/ui config
```

---

## Dependency Flow (Critical Understanding)

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js App Router                       │
│                   (app/*/page.tsx)                          │
└────────────────────────┬────────────────────────────────────┘
                         │ uses
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                    Feature Modules                          │
│              (features/courses/components)                  │
└────────────────────────┬────────────────────────────────────┘
                         │ uses
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                  Domain Services                            │
│           (domain/services/course-service.ts)               │
│                                                             │
│   • Contains business logic                                 │
│   • Depends on Repository INTERFACES only                   │
│   • Framework-agnostic (pure TypeScript)                    │
└────────────────────────┬────────────────────────────────────┘
                         │ depends on (interface)
                         ↓
┌─────────────────────────────────────────────────────────────┐
│              Repository Interfaces                          │
│       (domain/repositories/course-repository.ts)            │
│                                                             │
│   • Pure TypeScript interfaces                              │
│   • No implementation details                               │
│   • Defines the contract                                    │
└─────────────────────────────────────────────────────────────┘
                         ↑
                         │ implemented by
                         │
┌─────────────────────────────────────────────────────────────┐
│           Repository Implementations                        │
│  (infrastructure/repositories/in-memory/...)                │
│                                                             │
│   • ✅ Now: In-Memory (Mock data)                           │
│   • 🔮 Future: Drizzle (PostgreSQL)                         │
│                                                             │
│   Injected via: infrastructure/di/container.ts              │
└─────────────────────────────────────────────────────────────┘
```

### Key Principle: **Dependency Inversion**

- **Domain layer** defines interfaces, knows nothing about implementations
- **Infrastructure layer** implements those interfaces
- **DI Container** wires everything together (the ONLY place that knows about concrete classes)

---

## Repository Pattern Example Usage

### 1. In a Server Component (Next.js)

```typescript
// app/courses/page.tsx
import { container } from '@/infrastructure/di/container';
import { CourseService } from '@/domain/services/course-service';

export default async function CoursesPage() {
  const courseService = new CourseService(container.courseRepository);
  const courses = await courseService.getAllCourses();

  return (
    <div>
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
```

### 2. In an API Route

```typescript
// app/api/courses/[slug]/route.ts
import { container } from '@/infrastructure/di/container';
import { CourseService } from '@/domain/services/course-service';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const courseService = new CourseService(container.courseRepository);

  try {
    const course = await courseService.getCourseBySlug(params.slug);
    return NextResponse.json(course);
  } catch (error) {
    return NextResponse.json(
      { error: 'Course not found' },
      { status: 404 }
    );
  }
}
```

### 3. In a Client Component Hook

```typescript
// features/courses/hooks/use-courses.ts
'use client';

import { useState, useEffect } from 'react';
import { container } from '@/infrastructure/di/container';
import { CourseService } from '@/domain/services/course-service';
import { CourseSummary } from '@/domain/entities/course';

export function useCourses() {
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const courseService = new CourseService(container.courseRepository);

    courseService
      .getAllCourses()
      .then(setCourses)
      .finally(() => setLoading(false));
  }, []);

  return { courses, loading };
}
```

---

## Migration Path to Database

### Current State (In-Memory)
```typescript
// infrastructure/di/container.ts
this.courseRepository = new CourseRepositoryInMemory();
```

### Future State (Drizzle)
```typescript
// 1. Create Drizzle schema
// infrastructure/database/schema/courses.ts
export const courses = pgTable('courses', { ... });

// 2. Implement repository
// infrastructure/repositories/drizzle/course-repository-drizzle.ts
export class CourseRepositoryDrizzle implements CourseRepository {
  constructor(private db: DrizzleDb) {}
  async findAll() { return this.db.select().from(courses); }
  // ... other methods
}

// 3. Update DI container (ONLY FILE THAT CHANGES)
// infrastructure/di/container.ts
import { db } from '@/infrastructure/database/client';
this.courseRepository = new CourseRepositoryDrizzle(db);
```

**Zero changes** required in:
- ✅ Domain services
- ✅ Feature components
- ✅ App routes
- ✅ API endpoints

---

## Type Safety Strategy

### ❌ Forbidden Patterns

```typescript
// NEVER use 'as' type assertion
const user = data as User;
const id = params.id as string;
```

### ✅ Required Patterns

#### Pattern 1: Type Guards
```typescript
function isCourse(data: unknown): data is Course {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'title' in data
  );
}

if (isCourse(data)) {
  // TypeScript knows data is Course here
  console.log(data.title);
}
```

#### Pattern 2: Zod Validation
```typescript
import { z } from 'zod';

const CourseSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
});

// Validates and throws if invalid
const course = CourseSchema.parse(unknownData);

// Validates and returns null if invalid
const safeCourse = CourseSchema.safeParse(unknownData);
if (safeCourse.success) {
  console.log(safeCourse.data.title);
}
```

---

## Tech Stack Summary

| Category | Technology | Purpose |
|----------|-----------|---------|
| Framework | Next.js 16 (App Router) | Server & client rendering |
| Language | TypeScript 5 (Strict) | Type safety |
| Styling | Tailwind CSS v4 | Utility-first CSS |
| UI Components | Shadcn/ui | Accessible component library |
| Icons | Lucide React | Icon library |
| Validation | Zod | Runtime type validation |
| State | Zustand | Global client state |
| Database (Future) | Drizzle ORM + Postgres | Type-safe ORM |
| Package Manager | pnpm | Fast, disk-efficient |

---

## Next Steps (Implementation Phase)

1. **Feature Modules**: Implement UI for courses, home, profile
2. **Shadcn Components**: Add needed components (button, card, dialog, etc.)
3. **API Routes**: Create REST endpoints for course data
4. **Authentication**: Add user authentication system
5. **Database**: Migrate from in-memory to Drizzle + Postgres
6. **Testing**: Add unit/integration/E2E tests

---

## Questions to Validate

Before proceeding with UI implementation:

1. **Folder Structure**: Does this structure align with your vision?
2. **Repository Pattern**: Is the in-memory → Drizzle migration strategy clear?
3. **Domain Entities**: Do the Course, User, Certificate, Progress entities cover all needed data?
4. **Additional Repositories**: Do we need UserRepository, CertificateRepository, ProgressRepository implementations now, or start with Course only?
5. **Feature Scope**: Which feature should we build first? (Home, Courses listing, Course detail, Profile?)

---

**This architecture is designed for:**
- ✅ Strict type safety (zero `as` casts)
- ✅ Easy testing (dependency injection)
- ✅ Seamless database migration (repository pattern)
- ✅ Scalability (feature-based structure)
- ✅ Maintainability (clear separation of concerns)

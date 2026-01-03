# Naming Conventions

## Files & Folders

### Folders
**Convention:** `kebab-case`

```
✅ CORRECT
src/domain/repositories/
src/infrastructure/repositories/in-memory/
src/features/courses/components/

❌ WRONG
src/Domain/Repositories/
src/infrastructure/RepositoriesInMemory/
src/features/Courses_Components/
```

### Files
**Convention:** `kebab-case`

```
✅ CORRECT
course-repository.ts
user-profile.tsx
quiz-runner-store.ts
create-repository.md

❌ WRONG
CourseRepository.ts
userProfile.tsx
QuizRunnerStore.ts
CreateRepository.md
```

### React Components
**Convention:** `PascalCase.tsx`

```
✅ CORRECT
CourseCard.tsx
UserProfile.tsx
QuizRunner.tsx
KLevelBadge.tsx

❌ WRONG
courseCard.tsx
user-profile.tsx
quiz_runner.tsx
k-level-badge.tsx
```

**Why:** Component files use PascalCase to distinguish them from regular modules.

---

## Code

### Interfaces/Types
**Convention:** `PascalCase`

```typescript
// ✅ CORRECT
export interface Course { }
export interface CourseRepository { }
export type QuizQuestion = { };

// ❌ WRONG
export interface course { }
export interface courseRepository { }
export type quiz_question = { };
```

### Classes
**Convention:** `PascalCase`

```typescript
// ✅ CORRECT
export class CourseService { }
export class CourseRepositoryInMemory { }
export class QuizRunner { }

// ❌ WRONG
export class courseService { }
export class course_repository_in_memory { }
export class quizRunner { }
```

### Functions
**Convention:** `camelCase`

```typescript
// ✅ CORRECT
function getCourseById(id: string) { }
function validateUserInput(data: unknown) { }
export async function fetchCourses() { }

// ❌ WRONG
function GetCourseById(id: string) { }
function validate_user_input(data: unknown) { }
export async function FetchCourses() { }
```

### Constants
**Convention:** `UPPER_SNAKE_CASE`

```typescript
// ✅ CORRECT
const MAX_COURSES_PER_PAGE = 20;
const DEFAULT_STALE_TIME = 5 * 60 * 1000;
const API_BASE_URL = 'https://api.example.com';

// ❌ WRONG
const maxCoursesPerPage = 20;
const defaultStaleTime = 5 * 60 * 1000;
const apiBaseUrl = 'https://api.example.com';
```

**Exception:** Enum-like objects can use PascalCase for keys:

```typescript
const QuestionType = {
  SingleChoice: 'single-choice',
  MultipleChoice: 'multiple-choice',
  TrueFalse: 'true-false',
} as const;
```

### React Components
**Convention:** `PascalCase`

```tsx
// ✅ CORRECT
export function CourseCard({ course }: { course: Course }) { }
export default function CoursesPage() { }
const QuizRunner = () => { };

// ❌ WRONG
export function courseCard({ course }: { course: Course }) { }
export default function coursesPage() { }
const quizRunner = () => { };
```

### Hooks
**Convention:** `camelCase` starting with `use`

```typescript
// ✅ CORRECT
export function useCourses() { }
export function useCourse(id: string) { }
export function useQuizRunner() { }

// ❌ WRONG
export function getCourses() { } // Not a hook
export function UseCourses() { } // PascalCase
export function courseHook() { } // Doesn't start with 'use'
```

---

## Repository Pattern

### Repository Interface
**Convention:** `{Entity}Repository`

```typescript
// ✅ CORRECT
export interface CourseRepository { }
export interface UserRepository { }
export interface QuizRepository { }

// ❌ WRONG
export interface ICourseRepository { } // No 'I' prefix
export interface RepositoryCourse { } // Wrong order
export interface CoursesRepository { } // Don't pluralize entity
```

### In-Memory Implementation
**Convention:** `{Entity}RepositoryInMemory`

```typescript
// ✅ CORRECT
export class CourseRepositoryInMemory implements CourseRepository { }

// ❌ WRONG
export class InMemoryCourseRepository { } // Wrong order
export class CourseInMemoryRepository { } // Wrong position
export class MockCourseRepository { } // Use 'InMemory', not 'Mock'
```

### Drizzle Implementation (Future)
**Convention:** `{Entity}RepositoryDrizzle`

```typescript
// ✅ CORRECT
export class CourseRepositoryDrizzle implements CourseRepository { }

// ❌ WRONG
export class DrizzleCourseRepository { }
export class CourseDbRepository { }
```

---

## Domain-Driven Design

### Entities
**Convention:** Singular noun, `PascalCase`

```typescript
// ✅ CORRECT
export interface Course { }
export interface User { }
export interface Quiz { }
export interface Section { }

// ❌ WRONG
export interface Courses { } // Don't pluralize
export interface course { } // PascalCase required
export interface CourseEntity { } // Don't suffix with 'Entity'
```

### Services
**Convention:** `{Entity}Service`

```typescript
// ✅ CORRECT
export class CourseService { }
export class UserService { }
export class QuizService { }

// ❌ WRONG
export class CoursesService { } // Don't pluralize entity
export class ServiceCourse { } // Wrong order
export class CourseBusinessLogic { } // Use 'Service'
```

### Value Objects
**Convention:** Descriptive noun, `PascalCase`

```typescript
// ✅ CORRECT
export interface LearningObjective { }
export interface QuestionOption { }
export interface ContentBlock { }

// ❌ WRONG
export interface LO { } // Don't abbreviate
export interface Option { } // Too generic
export interface Block { } // Too generic
```

---

## Features

### Feature Folders
**Convention:** `kebab-case`, plural if collection

```
✅ CORRECT
src/features/courses/
src/features/home/
src/features/profile/

❌ WRONG
src/features/course/ (use plural for collection)
src/features/Home/
src/features/user_profile/
```

### Hooks
**Convention:** `use-{feature}.ts`

```
✅ CORRECT
src/features/courses/hooks/use-courses.ts
src/features/courses/hooks/use-course.ts
src/features/courses/hooks/use-enroll-course.ts

❌ WRONG
src/features/courses/hooks/courses.ts
src/features/courses/hooks/getCourses.ts
src/features/courses/hooks/coursesHook.ts
```

### Components
**Convention:** `PascalCase.tsx`

```
✅ CORRECT
src/features/courses/components/CourseCard.tsx
src/features/courses/components/CourseList.tsx
src/features/courses/components/CourseFilters.tsx

❌ WRONG
src/features/courses/components/course-card.tsx
src/features/courses/components/courseList.tsx
```

---

## Data Files

### Mock Data
**Convention:** `mock-{entities}.ts` in `data/` folder

```
✅ CORRECT
src/infrastructure/repositories/in-memory/data/mock-courses.ts
src/infrastructure/repositories/in-memory/data/mock-users.ts
src/infrastructure/repositories/in-memory/data/istqb-chapter1-quizzes.ts

❌ WRONG
src/infrastructure/repositories/in-memory/courses-data.ts (not in data/)
src/infrastructure/repositories/in-memory/data/courseMockData.ts
```

### Export Pattern
**Convention:** Named export with descriptive plural

```typescript
// ✅ CORRECT
// mock-courses.ts
export const mockCourses: Course[] = [ ];

// ❌ WRONG
export default [ ]; // No default export
export const data = [ ]; // Too generic
export const COURSES = [ ]; // Use camelCase for arrays
```

---

## Zustand Stores

### Store Files
**Convention:** `{feature}-store.ts`

```
✅ CORRECT
src/lib/stores/quiz-runner-store.ts
src/lib/stores/ui-store.ts
src/lib/stores/theme-store.ts

❌ WRONG
src/lib/stores/quizRunner.ts (missing '-store')
src/lib/stores/UIStore.ts (PascalCase)
```

### Store Hooks
**Convention:** `use{Feature}Store`

```typescript
// ✅ CORRECT
export const useQuizRunnerStore = create<QuizRunnerState>( );
export const useUIStore = create<UIState>( );

// ❌ WRONG
export const quizRunnerStore = create( ); // Must start with 'use'
export const useQuizRunner = create( ); // Missing 'Store'
```

---

## Documentation

### Markdown Files
**Convention:** `kebab-case.md`

```
✅ CORRECT
docs/tech/architecture.md
docs/business/product-vision.md
.claude/skills/create-repository.md

❌ WRONG
docs/tech/Architecture.md
docs/business/ProductVision.md
.claude/skills/CreateRepository.md
```

---

## TypeScript Types & Interfaces

### When to Use Interface vs Type

**Prefer `interface` for:**
- Object shapes (entities, DTOs)
- API contracts
- Class contracts

```typescript
// ✅ CORRECT
export interface Course {
  id: string;
  title: string;
}
```

**Prefer `type` for:**
- Unions
- Intersections
- Utility types
- Primitive aliases

```typescript
// ✅ CORRECT
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';
export type CreateCourseInput = Omit<Course, 'id' | 'createdAt'>;
```

---

## Summary Table

| Category | Convention | Example |
|----------|------------|---------|
| **Folders** | kebab-case | `course-repository/` |
| **Files** | kebab-case | `course-repository.ts` |
| **Components (files)** | PascalCase.tsx | `CourseCard.tsx` |
| **Interfaces/Types** | PascalCase | `Course`, `CourseRepository` |
| **Classes** | PascalCase | `CourseService` |
| **Functions** | camelCase | `getCourseById()` |
| **Constants** | UPPER_SNAKE_CASE | `MAX_COURSES_PER_PAGE` |
| **React Components** | PascalCase | `function CourseCard()` |
| **Hooks** | camelCase (use prefix) | `useCourses()` |
| **Repositories (interface)** | `{Entity}Repository` | `CourseRepository` |
| **Repositories (in-memory)** | `{Entity}RepositoryInMemory` | `CourseRepositoryInMemory` |
| **Services** | `{Entity}Service` | `CourseService` |
| **Stores** | `{feature}-store.ts` | `quiz-runner-store.ts` |
| **Store Hooks** | `use{Feature}Store` | `useQuizRunnerStore` |
| **Mock Data Files** | `mock-{entities}.ts` | `mock-courses.ts` |
| **Documentation** | kebab-case.md | `architecture.md` |

---

## Enforcement

**Pre-commit Checklist:**
- [ ] Folder names use kebab-case
- [ ] File names use kebab-case (except React components)
- [ ] React component files use PascalCase.tsx
- [ ] Interfaces/Types use PascalCase
- [ ] Functions use camelCase
- [ ] Constants use UPPER_SNAKE_CASE
- [ ] Hooks start with `use` prefix
- [ ] Repositories follow `{Entity}Repository{Implementation}` pattern

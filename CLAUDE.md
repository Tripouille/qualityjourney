# QualityJourney.dev - Architecture & Technical Documentation

**Last Updated:** 2026-01-03
**Status:** Foundation Setup Phase

---

## 0. Meta-Rules & Governance

### Documentation Philosophy

This project is built exclusively using **Claude Code**. All architectural decisions, patterns, and rules are documented here as the **single source of truth**.

### Mandatory Rules

1. **No "Report Files":**
   - Do NOT create files just to communicate what you have done (e.g., `UPDATE_LOG.md`, `GUIDE.md`, `SETUP_COMPLETE.md`, `CHANGES.md`).
   - Communicate status updates in the chat output only.
   - Exception: Long-form documentation with permanent value (see rule 3).

2. **Single Source of Truth:**
   - `CLAUDE.md` is the central brain of this repository.
   - It MUST be updated immediately when architectural decisions change.
   - If a rule is not in `CLAUDE.md`, it doesn't exist.
   - When in doubt, check this file first.

3. **Documentation Linking:**
   - You may create specific documentation files (e.g., `ARCHITECTURE.md`, `API_DOCS.md`) ONLY if they provide long-term value for the developer.
   - **CRITICAL:** Any `.md` file created MUST be referenced/linked in the "Documentation Index" section below.
   - If it's not linked in the Documentation Index, it doesn't exist to the context.
   - Temporary guides, setup reports, and status files are forbidden.

4. **Claude Code Native:**
   - This project is built exclusively using Claude Code CLI.
   - All instructions must assume this environment.
   - No references to external IDEs unless explicitly discussed.

5. **Update Protocol:**
   - Before making any architectural change, read `CLAUDE.md` first.
   - After making any architectural change, update `CLAUDE.md` immediately.
   - Update the "Last Updated" timestamp at the top.
   - Never let documentation drift from implementation.

### Documentation Index

All official documentation files in this repository:

- **[CLAUDE.md](CLAUDE.md)** - This file. The single source of truth for all architecture, patterns, and rules.
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Visual overview of folder structure, dependency flow, and repository pattern examples.

**Rule:** If a `.md` file is not listed above, it should not exist (except README.md for GitHub).

---

## 1. Product Vision

QualityJourney.dev is the reference platform for Modern QA Engineers.

### Core Features
- **Home:** Marketing landing page promoting the "Modern QA" vision
- **Courses:** Training catalog (starting with ISTQB Foundation, then Playwright, Cypress, etc.)
- **Blog:** SEO-focused content hub (placeholder for now)
- **Public Profile:** User page with gamification (Certificates, Progress Heatmap)

---

## 2. Technical Stack

### Core Technologies
- **Framework:** Next.js 16+ (App Router)
- **Language:** TypeScript 5+ (Strict Mode)
- **Styling:** Tailwind CSS v4
- **UI Components:** Shadcn/ui
- **Icons:** Lucide React
- **Server State:** TanStack Query (React Query v5)
- **Client State:** Zustand
- **Validation:** Zod
- **Database:** Drizzle ORM + PostgreSQL (coming later)

### Package Manager
- **pnpm** (mandatory)

---

## 3. UI & Styling Rules

### 📱 Mobile-First Development Mandate (CRITICAL)

This project follows a **strict Mobile-First approach**. All UI must be designed and functional on mobile BEFORE desktop.

#### 1. CSS/Tailwind Flow

**Rule:** Write base classes for mobile, then use responsive modifiers for larger screens.

```tsx
// ✅ CORRECT: Mobile-first approach
<div className="flex flex-col gap-4 md:flex-row md:gap-6 lg:gap-8">
  {/* Base: vertical stack with 16px gap */}
  {/* md: horizontal row with 24px gap */}
  {/* lg: horizontal row with 32px gap */}
</div>

// ❌ FORBIDDEN: Desktop-first with max-width breakpoints
<div className="flex flex-row gap-8 max-md:flex-col max-md:gap-4">
  {/* Anti-pattern: starts with desktop, then shrinks */}
</div>
```

**Tailwind Responsive Modifiers:**
- Base classes = Mobile (default)
- `sm:` = 640px and up (small tablets)
- `md:` = 768px and up (tablets)
- `lg:` = 1024px and up (laptops)
- `xl:` = 1280px and up (desktops)
- `2xl:` = 1536px and up (large screens)

#### 2. Touch Targets (P0 - Accessibility Critical)

**Minimum Dimensions for Interactive Elements:**
- **Minimum height/width:** `44px` (Apple HIG) / `48px` (Material Design)
- **Tailwind equivalents:** `h-11` (44px), `h-12` (48px), `min-h-11`, `min-h-12`
- **Minimum gap between clickable elements:** `16px` (Tailwind `gap-4`)

```tsx
// ✅ CORRECT: Proper touch targets
<Button className="h-12 min-w-[120px]">Sign In</Button>
<nav className="flex flex-col gap-4">
  <Link className="block py-3">Courses</Link> {/* py-3 = 12px top + 12px bottom + text = ~44px */}
  <Link className="block py-3">Blog</Link>
</nav>

// ❌ FORBIDDEN: Touch targets too small
<Button className="h-8 px-2">Sign In</Button> {/* Only 32px tall */}
<nav className="flex flex-col gap-1">
  <Link>Courses</Link> {/* No padding, too close to next link */}
</nav>
```

**Critical Elements Requiring Touch Target Validation:**
- All `<Button>` components
- All `<Link>` elements in navigation
- Form inputs (`<Input>`, `<Select>`, `<Checkbox>`, `<Radio>`)
- Icon-only buttons (hamburger menus, close buttons)
- Cards with `onClick` handlers

#### 3. Navigation & Interactivity

**Mobile Navigation Patterns:**
- **Complex navigation:** Use `Sheet` (drawer) component for mobile menus
- **Filters/Search:** Use `Sheet` or `Collapsible` on mobile, inline on desktop
- **Tabs:** Use `ScrollArea` for horizontal scroll on mobile if needed

```tsx
// ✅ CORRECT: Sheet for mobile navigation
<Sheet>
  <SheetTrigger asChild>
    <Button variant="ghost" size="icon" className="h-12 w-12">
      <Menu className="h-5 w-5" />
    </Button>
  </SheetTrigger>
  <SheetContent side="right">
    <nav className="flex flex-col gap-4">
      {/* Touch-friendly links */}
    </nav>
  </SheetContent>
</Sheet>

// ❌ FORBIDDEN: Horizontal scroll without explicit design
<div className="flex overflow-x-auto gap-2">
  {/* Accidental horizontal scroll */}
</div>
```

#### 4. Typography & Readability

**Font Size Constraints:**
- **Body text:** Minimum `16px` (Tailwind `text-base`)
- **Form inputs:** Minimum `16px` to prevent iOS auto-zoom
- **Small text:** Minimum `14px` (Tailwind `text-sm`) for secondary content only

```tsx
// ✅ CORRECT: Readable font sizes
<input className="text-base" /> {/* 16px - prevents iOS zoom */}
<p className="text-base">Main content</p>
<span className="text-sm text-muted-foreground">Secondary info</span>

// ❌ FORBIDDEN: Font too small
<input className="text-sm" /> {/* 14px - triggers iOS zoom on focus */}
<p className="text-xs">Main content</p> {/* 12px - too small */}
```

#### 5. Validation Protocol (QA)

**Before submitting any UI change, verify mobile layout:**

1. **Use Playwright MCP to test at mobile viewport:**
   - iPhone 12 Pro: `390x844` (recommended baseline)
   - iPhone SE: `375x667` (small phone test)
   - Pixel 5: `393x851` (Android baseline)

2. **Checklist for every UI component:**
   - [ ] No horizontal overflow (check with `overflow-x: hidden` removed)
   - [ ] All interactive elements are at least `44px` tall
   - [ ] Gap between clickable elements is at least `16px`
   - [ ] Form inputs are at least `16px` font size
   - [ ] Text is readable without zooming
   - [ ] Navigation works on mobile (Sheet/Drawer functional)

3. **Playwright Verification Command:**
```typescript
// Resize to mobile viewport
await page.setViewportSize({ width: 390, height: 844 });

// Check for horizontal overflow
const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
const viewportWidth = await page.evaluate(() => window.innerWidth);
if (bodyWidth > viewportWidth) {
  console.error('Horizontal overflow detected!');
}

// Verify touch targets
const buttons = await page.locator('button, a[href]').all();
for (const button of buttons) {
  const box = await button.boundingBox();
  if (box && (box.height < 44 || box.width < 44)) {
    console.warn('Touch target too small:', await button.textContent());
  }
}
```

#### 6. Anti-Patterns (Forbidden)

```tsx
// ❌ WRONG: Using max-width breakpoints (desktop-first)
<div className="grid grid-cols-3 max-md:grid-cols-1">

// ✅ CORRECT: Using min-width breakpoints (mobile-first)
<div className="grid grid-cols-1 md:grid-cols-3">

// ❌ WRONG: Hidden on mobile without alternative
<nav className="hidden md:flex">
  {/* Mobile users can't navigate! */}
</nav>

// ✅ CORRECT: Mobile menu alternative
<nav className="hidden md:flex">
  {/* Desktop navigation */}
</nav>
<Sheet>{/* Mobile navigation */}</Sheet>

// ❌ WRONG: Fixed widths that don't scale
<div className="w-[600px]">

// ✅ CORRECT: Responsive widths
<div className="w-full md:w-[600px] md:max-w-2xl">
```

#### 7. Enforcement

**All future features must follow this mandate:**
- Courses catalog page
- Blog listing/detail pages
- User profile page
- Quiz runner interface
- Certificate display
- Progress dashboard

**Code Review Gate:**
- No PR approval without mobile-first verification
- Use Playwright MCP to demonstrate mobile layout in PR description

---

## 4. TypeScript Doctrine (Strict Safety)

### Compiler Configuration

We use **`@tsconfig/strictest`** to enforce maximum type safety without manually maintaining flags.

**Package:** `@tsconfig/strictest@2.0.8`

This enables all strict options plus additional safety checks:
- `strict: true` (all strict family flags)
- `noUncheckedIndexedAccess: true` - Array/object access requires undefined checks
- `noImplicitOverride: true` - Explicit override keyword required
- `noPropertyAccessFromIndexSignature: true` - Forces bracket notation for index signatures
- `exactOptionalPropertyTypes: true` - Distinguishes `undefined` from absent properties
- And many more safety checks

**Critical Implication: `noUncheckedIndexedAccess`**

Array and object indexed access always returns `T | undefined`:

```typescript
// ❌ FORBIDDEN: Direct array access without check
const course = courses[0];
course.title; // TypeScript error: 'course' is possibly 'undefined'

// ✅ PATTERN 1: Non-null assertion after index validation
const index = courses.findIndex(c => c.id === id);
if (index === -1) {
  throw new Error('Not found');
}
const course = courses[index]!; // Safe: we verified index exists

// ✅ PATTERN 2: Use .find() instead of indexed access
const course = courses.find(c => c.id === id);
if (!course) {
  throw new Error('Not found');
}
// course is now Course (not undefined)

// ✅ PATTERN 3: Check after access
const course = courses[0];
if (course) {
  course.title; // Safe
}
```

### Type Safety Rules (Zero Tolerance)

#### 1. FORBIDDEN: Type Assertions (`as`)
```typescript
// ❌ FORBIDDEN
const user = data as User;
const id = params.id as string;

// ✅ REQUIRED: Use Type Guards
function isUser(data: unknown): data is User {
  return typeof data === 'object' && data !== null && 'id' in data;
}
if (isUser(data)) {
  // data is User here
}

// ✅ REQUIRED: Use Zod Parsing
const UserSchema = z.object({ id: z.string(), name: z.string() });
const user = UserSchema.parse(data); // Throws if invalid
```

#### 2. MANDATORY: Zod Validation
All external data MUST be validated with Zod:
- API responses
- URL parameters
- Search params
- Form inputs
- LocalStorage data
- Environment variables

```typescript
// ✅ Example: API Response
const CourseResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
});

async function fetchCourse(id: string) {
  const response = await fetch(`/api/courses/${id}`);
  const data = await response.json();
  return CourseResponseSchema.parse(data); // Validates or throws
}
```

#### 3. No Implicit Any
Every function parameter, return type, and variable must have explicit types.

```typescript
// ❌ FORBIDDEN
function processData(data) {
  return data.map(item => item.id);
}

// ✅ REQUIRED
function processData(data: Course[]): string[] {
  return data.map(item => item.id);
}
```

---

## 4. Architecture Pattern: Repository + Domain-Driven Design

### Why Repository Pattern?
We are NOT connecting a database yet. The Repository Pattern allows us to:
1. Build the entire app with in-memory mock data
2. Switch to Drizzle/Postgres later by changing only the repository implementation
3. Keep business logic decoupled from data source

### Layer Structure

```
src/
├── domain/              # Pure business logic & interfaces (no dependencies)
│   ├── entities/        # Domain models (User, Course, Certificate, etc.)
│   ├── repositories/    # Repository interfaces (contracts)
│   └── services/        # Business logic services
├── infrastructure/      # External concerns (data, API clients)
│   ├── repositories/    # Repository implementations
│   │   ├── in-memory/   # Mock data (current)
│   │   └── drizzle/     # Database (future)
│   └── di/              # Dependency Injection container
├── app/                 # Next.js App Router (pages, layouts, routes)
├── features/            # Feature modules (UI + feature-specific logic)
│   ├── home/
│   ├── courses/
│   ├── blog/
│   └── profile/
├── components/          # Shared UI components
│   ├── ui/              # Shadcn components
│   └── common/          # Custom shared components
└── lib/                 # Utilities, helpers, config
```

### Dependency Flow (Critical)
```
app/ → features/ → domain/services/ → domain/repositories (interface)
                                           ↑
                                    infrastructure/repositories (implementation)
```

**Rules:**
- `domain/` NEVER imports from `infrastructure/` or `features/` or `app/`
- `domain/` contains only interfaces and pure business logic
- `infrastructure/` implements domain interfaces
- `features/` and `app/` consume domain services via Dependency Injection

---

## 5. Repository Pattern Implementation

### Step 1: Define Entity (Domain Model)
```typescript
// src/domain/entities/course.ts
export interface Course {
  id: string;
  title: string;
  description: string;
  slug: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  modules: CourseModule[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Step 2: Define Repository Interface
```typescript
// src/domain/repositories/course-repository.ts
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

### Step 3: Implement In-Memory Repository
```typescript
// src/infrastructure/repositories/in-memory/course-repository-in-memory.ts
import { CourseRepository } from '@/domain/repositories/course-repository';
import { Course } from '@/domain/entities/course';

export class CourseRepositoryInMemory implements CourseRepository {
  private courses: Course[] = [
    // Mock data here
  ];

  async findAll(): Promise<Course[]> {
    return this.courses;
  }

  async findById(id: string): Promise<Course | null> {
    return this.courses.find(c => c.id === id) ?? null;
  }

  // ... other methods
}
```

### Step 4: Dependency Injection
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

### Step 5: Use in Service/Component
```typescript
// src/domain/services/course-service.ts
import { CourseRepository } from '@/domain/repositories/course-repository';

export class CourseService {
  constructor(private courseRepository: CourseRepository) {}

  async getAllCourses() {
    return this.courseRepository.findAll();
  }

  async getCourseBySlug(slug: string) {
    const course = await this.courseRepository.findBySlug(slug);
    if (!course) {
      throw new Error('Course not found');
    }
    return course;
  }
}

// In component/page:
import { container } from '@/infrastructure/di/container';
import { CourseService } from '@/domain/services/course-service';

const courseService = new CourseService(container.courseRepository);
const courses = await courseService.getAllCourses();
```

---

## 6. Naming Conventions

### Files & Folders
- **Folders:** `kebab-case` (e.g., `course-repository`, `in-memory`)
- **Files:** `kebab-case` (e.g., `course-repository.ts`, `user-profile.tsx`)
- **Components:** `PascalCase.tsx` for React components (e.g., `CourseCard.tsx`)

### Code
- **Interfaces/Types:** `PascalCase` (e.g., `CourseRepository`, `User`)
- **Classes:** `PascalCase` (e.g., `CourseService`, `CourseRepositoryInMemory`)
- **Functions:** `camelCase` (e.g., `getCourseById`, `validateUserInput`)
- **Constants:** `UPPER_SNAKE_CASE` (e.g., `MAX_COURSES_PER_PAGE`)
- **React Components:** `PascalCase` (e.g., `CourseCard`, `UserProfile`)

### Repository Naming
- Interface: `CourseRepository`
- In-Memory Implementation: `CourseRepositoryInMemory`
- Future Drizzle Implementation: `CourseRepositoryDrizzle`

---

## 7. Feature Module Structure

Each feature follows this pattern:
```
features/
└── courses/
    ├── components/          # Feature-specific components
    │   ├── CourseCard.tsx
    │   ├── CourseList.tsx
    │   └── CourseFilters.tsx
    ├── hooks/               # Feature-specific hooks
    │   └── use-courses.ts
    ├── schemas/             # Zod schemas for this feature
    │   └── course-schemas.ts
    └── types/               # Feature-specific types
        └── index.ts
```

---

## 8. State Management Strategy (Hybrid Approach)

We adopt a **strict separation** between Server State and Client State.

### The Rule: Server State vs Client State

```
┌─────────────────────────────────────────────────────────────┐
│                    State Classification                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  SERVER STATE              │  CLIENT STATE                  │
│  (TanStack Query)          │  (Zustand)                     │
│                           │                                │
│  • Courses                 │  • UI State (sidebar, modals)  │
│  • Lessons                 │  • Quiz Runner Session         │
│  • User Profiles           │    - Current question index    │
│  • Certificates            │    - Temporary score           │
│  • Progress Data           │    - Selected answers          │
│  • Blog Posts              │  • Theme (dark/light mode)     │
│                           │  • Temporary form drafts       │
└─────────────────────────────────────────────────────────────┘
```

### 1. Server State → TanStack Query (React Query v5)

**Definition:** Data that originates from the server (API, Database, Mock Repository).

**Why TanStack Query:**
- ✅ Automatic caching with intelligent invalidation
- ✅ Loading, error, and success states built-in
- ✅ Background refetching and synchronization
- ✅ Deduplication of identical requests
- ✅ Pagination and infinite scroll support
- ✅ Optimistic updates for mutations
- ✅ DevTools for debugging queries

**Use Cases:**
- Fetching courses from repository
- Loading user profile data
- Retrieving certificates
- Fetching progress/heatmap data
- Blog post content

**Implementation Pattern (Critical):**

Even with mock data, we wrap repository calls in async functions and use TanStack Query.
This ensures zero UI changes when migrating to a real database.

```typescript
// features/courses/hooks/use-courses.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { container } from '@/infrastructure/di/container';
import { CourseService } from '@/domain/services/course-service';

export function useCourses() {
  const courseService = new CourseService(container.courseRepository);

  return useQuery({
    queryKey: ['courses'], // Cache key
    queryFn: () => courseService.getAllCourses(), // Async function
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// In component:
function CoursesPage() {
  const { data: courses, isLoading, error } = useCourses();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return <CourseList courses={courses} />;
}
```

**Query Keys Convention:**
```typescript
// Single resource
['course', courseId]
['user', userId]
['certificate', certificateId]

// Collections
['courses']
['courses', { level: 'beginner' }] // With filters
['courses', { search: 'playwright' }]

// Nested resources
['course', courseId, 'modules']
['user', userId, 'certificates']
['user', userId, 'progress']
```

**Mutations (Create/Update/Delete):**
```typescript
// features/courses/hooks/use-enroll-course.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useEnrollCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) => enrollInCourse(courseId),
    onSuccess: () => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ['user', 'progress'] });
    },
  });
}
```

### 2. Client State → Zustand

**Definition:** Synchronous, client-only state that doesn't come from the server.

**Why Zustand:**
- ✅ Minimal boilerplate (simpler than Redux)
- ✅ No providers needed (direct hook access)
- ✅ TypeScript-first design
- ✅ Perfect for UI state
- ✅ DevTools support

**Use Cases:**
- Sidebar open/closed state
- Modal visibility
- Theme preference (before persisting)
- **Quiz Runner Session State** (critical example below)
- Temporary form drafts (before submission)
- Multi-step form progress

**Example: Quiz Runner Store**

```typescript
// lib/stores/quiz-runner-store.ts
import { create } from 'zustand';

interface QuizRunnerState {
  // State
  currentQuestionIndex: number;
  selectedAnswers: Record<string, string>; // { questionId: answerId }
  timeSpent: number; // seconds
  isSubmitted: boolean;

  // Actions
  selectAnswer: (questionId: string, answerId: string) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  submitQuiz: () => void;
  resetQuiz: () => void;
  setTimeSpent: (seconds: number) => void;
}

export const useQuizRunnerStore = create<QuizRunnerState>((set) => ({
  currentQuestionIndex: 0,
  selectedAnswers: {},
  timeSpent: 0,
  isSubmitted: false,

  selectAnswer: (questionId, answerId) =>
    set((state) => ({
      selectedAnswers: { ...state.selectedAnswers, [questionId]: answerId },
    })),

  nextQuestion: () =>
    set((state) => ({ currentQuestionIndex: state.currentQuestionIndex + 1 })),

  previousQuestion: () =>
    set((state) => ({ currentQuestionIndex: state.currentQuestionIndex - 1 })),

  submitQuiz: () => set({ isSubmitted: true }),

  resetQuiz: () =>
    set({
      currentQuestionIndex: 0,
      selectedAnswers: {},
      timeSpent: 0,
      isSubmitted: false,
    }),

  setTimeSpent: (seconds) => set({ timeSpent: seconds }),
}));
```

**Example: UI State Store**

```typescript
// lib/stores/ui-store.ts
import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  currentModal: string | null;
  openModal: (modalId: string) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  currentModal: null,
  openModal: (modalId) => set({ currentModal: modalId }),
  closeModal: () => set({ currentModal: null }),
}));
```

### 3. Decision Tree: Which State Manager?

```
Is the data coming from the server/repository?
│
├─ YES → Use TanStack Query
│   ├─ Courses, Users, Certificates → useQuery
│   ├─ Progress, Heatmap data → useQuery
│   └─ Create/Update operations → useMutation
│
└─ NO → Is it synchronous UI state?
    ├─ YES → Use Zustand
    │   ├─ Sidebar, Modals, Theme → Zustand store
    │   └─ Quiz session, Form wizard → Zustand store
    │
    └─ Is it URL-based state?
        └─ Use Next.js searchParams (no state manager needed)
```

### 4. Anti-Patterns (Forbidden)

```typescript
// ❌ WRONG: Using Zustand for server data
const useCoursesStore = create((set) => ({
  courses: [],
  fetchCourses: async () => {
    const data = await getCourses();
    set({ courses: data });
  },
}));

// ✅ CORRECT: Use TanStack Query
const { data: courses } = useQuery({
  queryKey: ['courses'],
  queryFn: getCourses,
});
```

```typescript
// ❌ WRONG: Using TanStack Query for pure UI state
const { data: sidebarOpen } = useQuery({
  queryKey: ['sidebar'],
  queryFn: () => Promise.resolve(true),
});

// ✅ CORRECT: Use Zustand
const { sidebarOpen } = useUIStore();
```

### 5. Provider Setup

TanStack Query requires a provider at the root layout:

```typescript
// app/layout.tsx
import { QueryProvider } from '@/components/providers/QueryProvider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
```

Zustand does NOT need a provider (direct hook usage).

### 6. Migration Benefit

When we switch from in-memory to Drizzle:

**TanStack Query (No UI Changes):**
```typescript
// Before: Mock data
queryFn: () => courseService.getAllCourses() // Returns mock data

// After: Real database (SAME HOOK, SAME UI)
queryFn: () => courseService.getAllCourses() // Returns DB data
```

The UI components remain unchanged because they only depend on the hook interface.

---

## 9. Testing Strategy (Future)

### Test Pyramid
1. **Unit Tests:** Domain services, utilities, pure functions (Jest/Vitest)
2. **Integration Tests:** Repository implementations, API routes (Jest/Vitest)
3. **E2E Tests:** Critical user flows (Playwright)

### Test File Naming
- Unit tests: `course-service.test.ts`
- Integration tests: `course-repository-in-memory.integration.test.ts`
- E2E tests: `course-enrollment.e2e.spec.ts`

---

## 10. Migration Path to Database (Future)

### Current State
- All repositories use in-memory implementations
- Mock data defined in `infrastructure/repositories/in-memory/data/`

### Future Migration Steps
1. Install Drizzle ORM + PostgreSQL driver
2. Create Drizzle schema in `infrastructure/database/schema/`
3. Implement `CourseRepositoryDrizzle` in `infrastructure/repositories/drizzle/`
4. Update DI container to use Drizzle implementation
5. Zero changes required in `domain/`, `features/`, or `app/`

---

## 11. Code Review Checklist

Before committing any code, verify:
- [ ] No `as` type assertions used
- [ ] All external data validated with Zod
- [ ] Array/object indexed access checked for undefined (`noUncheckedIndexedAccess`)
- [ ] Repository pattern respected (no direct data access in components)
- [ ] Dependency flow is correct (domain → infrastructure)
- [ ] TypeScript strictest mode passes with zero errors
- [ ] File/folder naming follows conventions
- [ ] No business logic in components (use services)

---

## 12. Critical Rules Summary

1. **NEVER** use `as` type assertions. Use type guards or Zod.
2. **ALWAYS** validate external data with Zod.
3. **NEVER** import from `infrastructure/` in `domain/`.
4. **ALWAYS** use Repository interfaces, never concrete implementations in business logic.
5. **NEVER** put business logic in React components. Use domain services.
6. **ALWAYS** update this CLAUDE.md when making architectural decisions.

---

## 13. Current Status

### ✅ Completed (Foundation Phase)

**Technical Setup:**
- [x] Next.js 16 setup with App Router
- [x] TypeScript strictest mode enabled (@tsconfig/strictest) - 0 errors
- [x] Tailwind CSS v4 configured
- [x] Shadcn/ui initialized (new-york style)
- [x] Dependencies installed: Zod, Zustand, TanStack Query, Lucide React
- [x] QueryProvider configured in root layout

**Architecture Implementation:**
- [x] Repository Pattern architecture defined
- [x] Folder structure created (domain, infrastructure, features)
- [x] Domain entities defined (User, Course, Certificate, Progress)
- [x] Repository interfaces defined (4 interfaces)
- [x] Course repository in-memory implementation
- [x] Dependency Injection container setup
- [x] Course service implemented with business logic
- [x] Mock course data created (3 complete courses with modules)

**State Management:**
- [x] Hybrid state management strategy defined (TanStack Query + Zustand)
- [x] Server state vs Client state rules established
- [x] Query key conventions documented

### 📋 Next Steps (Implementation Phase)

**Remaining Repositories:**
- [ ] User repository in-memory implementation
- [ ] Certificate repository in-memory implementation
- [ ] Progress repository in-memory implementation

**Feature Development:**
- [ ] Feature modules implementation (courses, home, blog, profile)
- [ ] UI components development (Shadcn components + custom)
- [ ] Custom hooks for data fetching (useCourses, useCourse, etc.)
- [ ] Zustand stores for client state (UI, quiz runner)

**Future Milestones:**
- [ ] Authentication system
- [ ] Database migration (Drizzle + Postgres)
- [ ] Testing suite (Unit, Integration, E2E)

---

**This document is the single source of truth for all architectural decisions. Update it with every significant change.**

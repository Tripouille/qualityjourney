# State Management Strategy (Hybrid Approach)

## The Rule: Server State vs Client State

We adopt a **strict separation** between Server State and Client State.

```
┌─────────────────────────────────────────────────────────────┐
│                    State Classification                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  SERVER STATE              │  CLIENT STATE                  │
│  (TanStack Query)          │  (Zustand)                     │
│                           │                                │
│  • Courses                 │  • UI State (sidebar, modals)  │
│  • Sections                │  • Quiz Runner Session         │
│  • Quizzes                 │    - Current question index    │
│  • User Profiles           │    - Temporary score           │
│  • Certificates            │    - Selected answers          │
│  • Progress Data           │  • Theme (dark/light mode)     │
│  • Blog Posts              │  • Temporary form drafts       │
│                           │                                │
└─────────────────────────────────────────────────────────────┘
```

---

## 1. Server State → TanStack Query (React Query v5)

### Definition

Data that originates from the server (API, Database, Mock Repository).

### Why TanStack Query

- ✅ Automatic caching with intelligent invalidation
- ✅ Loading, error, and success states built-in
- ✅ Background refetching and synchronization
- ✅ Deduplication of identical requests
- ✅ Pagination and infinite scroll support
- ✅ Optimistic updates for mutations
- ✅ DevTools for debugging queries

### Use Cases

- Fetching courses from repository
- Loading user profile data
- Retrieving certificates
- Fetching progress/heatmap data
- Blog post content
- Quiz data

### Implementation Pattern (Critical)

Even with mock data, we wrap repository calls in async functions and use TanStack Query.

**Why:** This ensures zero UI changes when migrating to a real database.

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
  if (!courses) return <NotFound />;

  return <CourseList courses={courses} />;
}
```

### Query Keys Convention

Query keys identify cached data. Use this structure:

```typescript
// Single resource
['course', courseId]
['user', userId]
['certificate', certificateId]
['quiz', quizId]

// Collections
['courses']
['courses', { level: 'beginner' }] // With filters
['courses', { search: 'playwright' }]

// Nested resources
['course', courseId, 'sections']
['section', sectionId, 'quiz']
['user', userId, 'certificates']
['user', userId, 'progress']
```

**Pattern:** `[entity, id?, subresource?, filters?]`

### Mutations (Create/Update/Delete)

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
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
}

// In component:
function CourseCard({ course }: { course: Course }) {
  const { mutate: enroll, isPending } = useEnrollCourse();

  return (
    <Button
      onClick={() => enroll(course.id)}
      disabled={isPending}
    >
      {isPending ? 'Enrolling...' : 'Enroll'}
    </Button>
  );
}
```

### Provider Setup

TanStack Query requires a provider at the root layout:

```typescript
// components/providers/query-provider.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

// app/layout.tsx
import { QueryProvider } from '@/components/providers/query-provider';

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

---

## 2. Client State → Zustand

### Definition

Synchronous, client-only state that doesn't come from the server.

### Why Zustand

- ✅ Minimal boilerplate (simpler than Redux)
- ✅ No providers needed (direct hook access)
- ✅ TypeScript-first design
- ✅ Perfect for UI state
- ✅ DevTools support

### Use Cases

- Sidebar open/closed state
- Modal visibility
- Theme preference (before persisting)
- **Quiz Runner Session State** (critical example)
- Temporary form drafts (before submission)
- Multi-step form progress

### Example: Quiz Runner Store

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

// In component:
function QuizRunner({ quiz }: { quiz: Quiz }) {
  const {
    currentQuestionIndex,
    selectedAnswers,
    selectAnswer,
    nextQuestion,
  } = useQuizRunnerStore();

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div>
      <h2>{currentQuestion?.question}</h2>
      {/* ... */}
      <Button onClick={nextQuestion}>Next</Button>
    </div>
  );
}
```

### Example: UI State Store

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

// In component:
function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useUIStore();

  return (
    <aside className={sidebarOpen ? 'block' : 'hidden'}>
      <Button onClick={toggleSidebar}>Close</Button>
      {/* ... */}
    </aside>
  );
}
```

### Zustand with Persistence

For state that should survive page reloads (e.g., theme preference):

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),
    }),
    {
      name: 'theme-storage', // localStorage key
    }
  )
);
```

---

## 3. Decision Tree: Which State Manager?

```
Is the data coming from the server/repository?
│
├─ YES → Use TanStack Query
│   ├─ Courses, Users, Certificates, Quizzes → useQuery
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

---

## 4. Anti-Patterns (Forbidden)

### ❌ WRONG: Using Zustand for server data

```typescript
const useCoursesStore = create((set) => ({
  courses: [],
  fetchCourses: async () => {
    const data = await getCourses();
    set({ courses: data });
  },
}));
```

**Why wrong:** No caching, no background refetch, no loading states.

### ✅ CORRECT: Use TanStack Query

```typescript
const { data: courses } = useQuery({
  queryKey: ['courses'],
  queryFn: getCourses,
});
```

---

### ❌ WRONG: Using TanStack Query for pure UI state

```typescript
const { data: sidebarOpen } = useQuery({
  queryKey: ['sidebar'],
  queryFn: () => Promise.resolve(true),
});
```

**Why wrong:** Unnecessary complexity for synchronous UI state.

### ✅ CORRECT: Use Zustand

```typescript
const { sidebarOpen } = useUIStore();
```

---

## 5. Migration Benefit

When we switch from in-memory to Drizzle:

### TanStack Query (No UI Changes):

```typescript
// Before: Mock data
queryFn: () => courseService.getAllCourses() // Returns mock data

// After: Real database (SAME HOOK, SAME UI)
queryFn: () => courseService.getAllCourses() // Returns DB data
```

The UI components remain unchanged because they only depend on the hook interface.

---

## Summary

1. **Server data** → TanStack Query (courses, users, quizzes, progress)
2. **Client state** → Zustand (sidebar, modals, quiz session)
3. **URL state** → Next.js searchParams (filters, pagination)
4. **Form state** → React Hook Form (form validation, submission)

**Decision Rule:** If it comes from the server/repository, use TanStack Query. Otherwise, use Zustand for synchronous client state.

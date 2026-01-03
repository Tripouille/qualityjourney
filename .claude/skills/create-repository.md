# Create Repository - Step-by-Step

## Repository Pattern Implementation Guide

Follow these steps to create a new repository following the Domain-Driven Design pattern.

---

## Step 1: Define Entity (Domain Model)

**Location:** `src/domain/entities/`

```typescript
// Example: src/domain/entities/quiz.ts
export interface Quiz {
  id: string;
  sectionId: string;
  title: string;
  questions: Question[];
  passingScore: number; // 0-100 (use 100 for ISTQB)
  timeLimit?: number; // optional, in minutes
  createdAt: Date;
  updatedAt: Date;
}

export interface Question {
  id: string;
  type: 'single-choice' | 'multiple-choice' | 'true-false';
  question: string;
  options: QuestionOption[];
  explanation: QuestionExplanation;
  learningObjective: string; // e.g., "FL-1.1.1"
  kLevel: 'K1' | 'K2' | 'K3';
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuestionExplanation {
  correct: string;
  incorrect: Record<string, string>; // { optionId: explanation }
}
```

---

## Step 2: Define Repository Interface

**Location:** `src/domain/repositories/`

```typescript
// Example: src/domain/repositories/quiz-repository.ts
import { Quiz } from '@/domain/entities/quiz';

export interface QuizRepository {
  findAll(): Promise<Quiz[]>;
  findById(id: string): Promise<Quiz | null>;
  findBySectionId(sectionId: string): Promise<Quiz | null>;
  create(quiz: Omit<Quiz, 'id' | 'createdAt' | 'updatedAt'>): Promise<Quiz>;
  update(id: string, data: Partial<Quiz>): Promise<Quiz>;
  delete(id: string): Promise<void>;
}
```

**Rules:**
- Interface name: `{Entity}Repository` (e.g., `QuizRepository`)
- Always return `Promise<T>` (async by design)
- Use `T | null` for single item queries that might not exist
- Use `Omit<T, 'id' | 'createdAt' | 'updatedAt'>` for create methods

---

## Step 3: Implement In-Memory Repository

**Location:** `src/infrastructure/repositories/in-memory/`

**Create mock data file first:**
```typescript
// Example: src/infrastructure/repositories/in-memory/data/mock-quizzes.ts
import { Quiz } from '@/domain/entities/quiz';

export const mockQuizzes: Quiz[] = [
  {
    id: 'quiz-1-1',
    sectionId: '1.1',
    title: 'What is Testing? - Quiz',
    questions: [
      // ... questions here
    ],
    passingScore: 100,
    timeLimit: 15,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];
```

**Then create repository implementation:**
```typescript
// Example: src/infrastructure/repositories/in-memory/quiz-repository-in-memory.ts
import { QuizRepository } from '@/domain/repositories/quiz-repository';
import { Quiz } from '@/domain/entities/quiz';
import { mockQuizzes } from './data/mock-quizzes';

export class QuizRepositoryInMemory implements QuizRepository {
  private quizzes: Quiz[] = mockQuizzes;

  async findAll(): Promise<Quiz[]> {
    return this.quizzes;
  }

  async findById(id: string): Promise<Quiz | null> {
    return this.quizzes.find(q => q.id === id) ?? null;
  }

  async findBySectionId(sectionId: string): Promise<Quiz | null> {
    return this.quizzes.find(q => q.sectionId === sectionId) ?? null;
  }

  async create(quiz: Omit<Quiz, 'id' | 'createdAt' | 'updatedAt'>): Promise<Quiz> {
    const newQuiz: Quiz = {
      ...quiz,
      id: `quiz-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.quizzes.push(newQuiz);
    return newQuiz;
  }

  async update(id: string, data: Partial<Quiz>): Promise<Quiz> {
    const index = this.quizzes.findIndex(q => q.id === id);
    if (index === -1) {
      throw new Error(`Quiz with id ${id} not found`);
    }
    const quiz = this.quizzes[index];
    if (!quiz) {
      throw new Error(`Quiz with id ${id} not found`);
    }
    const updatedQuiz = { ...quiz, ...data, updatedAt: new Date() };
    this.quizzes[index] = updatedQuiz;
    return updatedQuiz;
  }

  async delete(id: string): Promise<void> {
    this.quizzes = this.quizzes.filter(q => q.id !== id);
  }
}
```

**Rules:**
- Class name: `{Entity}RepositoryInMemory`
- Always use `.find()` with `?? null` pattern (handles `noUncheckedIndexedAccess`)
- For update: validate index, then check if element exists before accessing
- Store mock data in separate `data/` folder

---

## Step 4: Register in Dependency Injection Container

**Location:** `src/infrastructure/di/container.ts`

```typescript
import { QuizRepository } from '@/domain/repositories/quiz-repository';
import { QuizRepositoryInMemory } from '@/infrastructure/repositories/in-memory/quiz-repository-in-memory';

class DependencyContainer {
  private static instance: DependencyContainer;

  public readonly courseRepository: CourseRepository;
  public readonly quizRepository: QuizRepository; // ADD THIS

  private constructor() {
    this.courseRepository = new CourseRepositoryInMemory();
    this.quizRepository = new QuizRepositoryInMemory(); // ADD THIS
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

## Step 5: Create Domain Service (Optional)

**Location:** `src/domain/services/`

```typescript
// Example: src/domain/services/quiz-service.ts
import { QuizRepository } from '@/domain/repositories/quiz-repository';
import { Quiz } from '@/domain/entities/quiz';

export class QuizService {
  constructor(private quizRepository: QuizRepository) {}

  async getQuizForSection(sectionId: string): Promise<Quiz> {
    const quiz = await this.quizRepository.findBySectionId(sectionId);
    if (!quiz) {
      throw new Error(`No quiz found for section ${sectionId}`);
    }
    return quiz;
  }

  async getAllQuizzes(): Promise<Quiz[]> {
    return this.quizRepository.findAll();
  }

  async validateQuizCompletion(
    quizId: string,
    answers: Record<string, string>
  ): Promise<{ score: number; passed: boolean }> {
    const quiz = await this.quizRepository.findById(quizId);
    if (!quiz) {
      throw new Error(`Quiz ${quizId} not found`);
    }

    // Business logic for grading
    let correctCount = 0;
    for (const question of quiz.questions) {
      const userAnswer = answers[question.id];
      const correctOption = question.options.find(o => o.isCorrect);
      if (userAnswer === correctOption?.id) {
        correctCount++;
      }
    }

    const score = Math.round((correctCount / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;

    return { score, passed };
  }
}
```

---

## Step 6: Use in Component via Hook (TanStack Query)

**Location:** `src/features/{feature}/hooks/`

```typescript
// Example: src/features/courses/hooks/use-quiz.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { container } from '@/infrastructure/di/container';
import { QuizService } from '@/domain/services/quiz-service';

export function useQuiz(sectionId: string) {
  const quizService = new QuizService(container.quizRepository);

  return useQuery({
    queryKey: ['quiz', sectionId],
    queryFn: () => quizService.getQuizForSection(sectionId),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
```

**Usage in component:**
```typescript
// In component
function QuizPage({ params }: { params: { sectionId: string } }) {
  const { data: quiz, isLoading, error } = useQuiz(params.sectionId);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!quiz) return <NotFound />;

  return <QuizRunner quiz={quiz} />;
}
```

---

## Checklist

- [ ] Entity created in `src/domain/entities/`
- [ ] Repository interface created in `src/domain/repositories/`
- [ ] Mock data created in `src/infrastructure/repositories/in-memory/data/`
- [ ] In-memory implementation created in `src/infrastructure/repositories/in-memory/`
- [ ] Repository registered in DI container
- [ ] Domain service created (if business logic needed)
- [ ] Hook created using TanStack Query
- [ ] TypeScript compiles with zero errors
- [ ] No `as` type assertions used
- [ ] Array access uses `.find()` with `?? null` pattern

---

## Migration to Drizzle (Future)

When migrating to real database:
1. Create Drizzle schema in `src/infrastructure/database/schema/`
2. Create `QuizRepositoryDrizzle` in `src/infrastructure/repositories/drizzle/`
3. Update DI container to use Drizzle implementation
4. Zero changes needed in domain, services, hooks, or components

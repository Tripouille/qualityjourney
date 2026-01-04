# Course Structure Overhaul - Complete Design

**Date:** 2026-01-04
**Status:** Design Complete - Ready for Implementation
**Author:** Claude (with user input)

---

## Executive Summary

This document outlines the complete architectural design for overhauling QualityJourney.dev's course structure to implement:

1. **Learning Objective-level atomicity** (smallest possible learning chunks)
2. **Nested URL hierarchy** for clarity and SEO
3. **Dual progress tracking** (content visited + quiz mastery)
4. **Progressive quiz cooldown** (1st immediate, 2nd 15min, 3rd+ 1hr)
5. **Mobile-first navigation** (chapter cards, Continue Learning, smart Next)
6. **Non-linear learning** (users can explore freely, no blocking)

**Research Foundation:**
- [docs/business/learning-methodology.md](../business/learning-methodology.md) - Microlearning, spaced repetition, engagement
- [docs/tech/url-structure.md](../tech/url-structure.md) - URL architecture, SEO, routing

---

## 1. Hierarchy & Atomic Units

### ISTQB Structure Mapping

```
Course: ISTQB Certified Tester Foundation Level
├─ Chapter 1: Fundamentals of Testing
│  ├─ Section 1.1: What is Testing?
│  │  ├─ FL-1.1.1 (K1): Identify typical test objectives ← ATOMIC UNIT
│  │  └─ FL-1.1.2 (K2): Differentiate testing from debugging ← ATOMIC UNIT
│  ├─ Section 1.2: Why is Testing Necessary?
│  │  ├─ FL-1.2.1 (K2): Exemplify why testing is necessary
│  │  ├─ FL-1.2.2 (K1): Recall relation between testing and QA
│  │  └─ FL-1.2.3 (K2): Distinguish between error, defect, failure
│  ├─ Section 1.3: Testing Principles
│  │  └─ FL-1.3.1 (K2): Explain the seven testing principles
│  ├─ Section 1.4: Test Activities, Testware and Test Roles
│  │  ├─ FL-1.4.1 (K2): Explain different test activities
│  │  ├─ FL-1.4.2 (K2): Explain impact of context on test process
│  │  ├─ FL-1.4.3 (K2): Differentiate testware
│  │  ├─ FL-1.4.4 (K2): Explain value of traceability
│  │  └─ FL-1.4.5 (K2): Compare different roles in testing
│  └─ Section 1.5: Essential Skills and Good Practices
│     ├─ FL-1.5.1 (K2): Give examples of generic skills
│     ├─ FL-1.5.2 (K1): Recall advantages of whole team approach
│     └─ FL-1.5.3 (K2): Distinguish benefits/drawbacks of independence
```

**Chapter 1 Total:** 14 Learning Objectives

### Why Learning Objectives Are Atomic

- **Consistent across all ISTQB certifications** (Foundation, Advanced, Expert)
- **Maps 1:1 to exam questions** (every LO has at least one exam question)
- **Natural microlearning size** (3-5 min content + 2-3 min quiz = 5-8 min total)
- **Trackable progress** (clear completion criteria: read content + pass quiz 100%)

---

## 2. URL Structure

### Final Decision: Nested Hierarchy

```
/courses/istqb-foundation                                   # Course home
/courses/istqb-foundation/chapter-1                         # Chapter 1 overview
/courses/istqb-foundation/chapter-1/fl-1.1.1                # FL-1.1.1 content
/courses/istqb-foundation/chapter-1/fl-1.1.1/quiz           # FL-1.1.1 quiz
```

**Benefits:**
- ✅ No routing conflicts (chapter and LO at different nesting levels)
- ✅ SEO-friendly (clear hierarchy)
- ✅ Still short (76 chars max - mobile-friendly)
- ✅ Easier breadcrumbs (parse URL path directly)

### Next.js Folder Structure

```
src/app/courses/
├── page.tsx                                        # /courses
└── [courseSlug]/
    ├── page.tsx                                    # /courses/istqb-foundation
    └── [chapterSlug]/
        ├── page.tsx                                # /courses/istqb-foundation/chapter-1
        └── [learningObjectiveId]/
            ├── page.tsx                            # /courses/istqb-foundation/chapter-1/fl-1.1.1
            └── quiz/
                └── page.tsx                        # /courses/istqb-foundation/chapter-1/fl-1.1.1/quiz
```

---

## 3. Data Models

### 3.1 Learning Objective

```typescript
interface LearningObjective {
  id: string;                                    // "FL-1.1.1"
  courseId: string;                              // "istqb-foundation"
  chapterId: string;                             // "chapter-1"
  sectionId: string;                             // "1.1" (for grouping in UI)

  title: string;                                 // "Identify typical test objectives"
  kLevel: 'K1' | 'K2' | 'K3';
  description: string;                           // Short description

  contentBlocks: ContentBlock[];                 // Lesson content
  keywords: string[];                            // ISTQB keywords

  estimatedReadingTime: number;                  // Minutes (3-5)
  estimatedQuizTime: number;                     // Minutes (2-3)

  order: number;                                 // Global order for sequential navigation

  // Navigation helpers (pre-computed for performance)
  previousLearningObjectiveId: string | null;    // null if first LO in course
  nextLearningObjectiveId: string | null;        // null if last LO in course
}
```

### 3.2 User Progress (Dual Tracking)

```typescript
interface UserProgress {
  id: string;
  userId: string;
  courseId: string;

  // Dual progress metrics
  contentProgress: {
    visitedLOs: string[];               // LO IDs user has viewed
    totalLOs: number;
    percentage: number;                 // visitedLOs.length / totalLOs
  };

  masteryProgress: {
    passedLOs: string[];                // LO IDs with quiz passed at 100%
    totalLOs: number;
    percentage: number;                 // passedLOs.length / totalLOs
  };

  // Per-LO tracking
  learningObjectives: {
    [loId: string]: LearningObjectiveProgress;
  };

  // Smart resume
  lastAccessedLOId: string | null;
  lastAccessedAt: Date;

  // Timestamps
  enrolledAt: Date;
  startedAt: Date | null;
  completedAt: Date | null;             // When masteryProgress = 100%
}

interface LearningObjectiveProgress {
  learningObjectiveId: string;

  // Content tracking
  contentVisited: boolean;
  contentFirstVisitedAt: Date | null;
  contentLastVisitedAt: Date | null;
  contentVisitCount: number;

  // Quiz tracking
  quizAttempts: QuizAttempt[];
  quizPassed: boolean;                  // True when score = 100%
  quizPassedAt: Date | null;

  // Time tracking
  timeSpentOnContent: number;           // Seconds
  timeSpentOnQuiz: number;              // Seconds
}
```

### 3.3 Quiz Attempt (Progressive Cooldown)

```typescript
interface QuizAttempt {
  id: string;
  userId: string;
  learningObjectiveId: string;

  attemptNumber: number;                // 1, 2, 3, ...
  score: number;                        // 0-100
  passed: boolean;                      // score === 100

  // Question tracking
  questions: QuizQuestionAttempt[];
  totalQuestions: number;
  correctAnswers: number;

  // Timing
  startedAt: Date;
  completedAt: Date;
  duration: number;                     // Seconds

  // Cooldown
  nextAttemptAllowedAt: Date | null;    // Null if passed
}

interface QuizQuestionAttempt {
  questionId: string;
  questionOrder: number;                // After shuffle
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timeSpent: number;                    // Seconds
}
```

### 3.4 Quiz Question Bank

```typescript
interface QuizQuestion {
  id: string;
  learningObjectiveId: string;           // Maps to Learning Objective
  kLevel: 'K1' | 'K2' | 'K3';           // K-level IS the difficulty indicator

  question: string;
  options: QuizOption[];
  correctOptionId: string;

  explanation: string;                   // Why this answer is correct
  rationale: {
    [optionId: string]: string;          // Why other answers are wrong
  };

  tags: string[];                        // For future filtering
}

interface QuizOption {
  id: string;                           // "A", "B", "C", "D"
  text: string;
  order: number;                        // For shuffling
}
```

---

## 4. Quiz Mechanics

### 4.1 Progressive Cooldown

```typescript
function calculateNextAttemptTime(attemptNumber: number): Date | null {
  if (attemptNumber === 1) {
    // First retry: immediate
    return new Date();
  }

  if (attemptNumber === 2) {
    // Second retry: 15 minutes
    return addMinutes(new Date(), 15);
  }

  // Third+ retry: 1 hour
  return addHours(new Date(), 1);
}

function canAttemptQuiz(attempts: QuizAttempt[]): {
  canAttempt: boolean;
  nextAttemptAt: Date | null;
  message: string | null;
} {
  if (attempts.length === 0) {
    return { canAttempt: true, nextAttemptAt: null, message: null };
  }

  const lastAttempt = attempts[attempts.length - 1];

  // If passed, no need to retry
  if (lastAttempt.passed) {
    return {
      canAttempt: false,
      nextAttemptAt: null,
      message: 'You have already passed this quiz with 100%.',
    };
  }

  // Check cooldown
  const now = new Date();
  if (lastAttempt.nextAttemptAllowedAt && now < lastAttempt.nextAttemptAllowedAt) {
    return {
      canAttempt: false,
      nextAttemptAt: lastAttempt.nextAttemptAllowedAt,
      message: `Please wait until ${formatTime(lastAttempt.nextAttemptAllowedAt)} to retry. Review the content in the meantime!`,
    };
  }

  return { canAttempt: true, nextAttemptAt: null, message: null };
}
```

### 4.2 Question Shuffling

```typescript
function shuffleQuizQuestions(questions: QuizQuestion[]): QuizQuestion[] {
  // Shuffle questions
  const shuffledQuestions = shuffleArray(questions);

  // Shuffle options within each question
  return shuffledQuestions.map(question => ({
    ...question,
    options: shuffleArray(question.options),
  }));
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
```

### 4.3 Quiz Flow (One Question at a Time)

```
1. User clicks "Take Quiz" on LO content page
2. Check cooldown → redirect if not allowed
3. Load questions and shuffle
4. Show Question 1 of N
5. User selects answer and submits
6. Show immediate feedback (correct/wrong + explanation)
7. "Next Question" button
8. Repeat until all questions answered
9. Show final score
10. If 100%: Mark LO as complete, show success
11. If <100%: Show retry message with cooldown time
```

---

## 5. Mobile-First UI Components

### 5.1 Chapter Overview Page

**Layout:**
```
┌─────────────────────────────────────────┐
│ Chapter 1: Fundamentals of Testing      │ ← Header
│ Master the core concepts of software... │ ← Description
├─────────────────────────────────────────┤
│ Content Progress                        │ ← Dual Progress
│ ▓▓▓▓▓▓▓░░░░░░░ 8/14 (57%)            │
│                                         │
│ Mastery                                 │
│ ▓▓▓░░░░░░░░░░░ 3/14 (21%)            │
├─────────────────────────────────────────┤
│ [Continue Learning: FL-1.2.1] ← Smart resume button
├─────────────────────────────────────────┤
│ Section 1.1                             │ ← Section header
│ ┌─────────────────────────────────────┐ │
│ │ FL-1.1.1 Identify test objectives   │ │ ← LO Card
│ │ ─────────────────────────────────── │ │
│ │ Content: ✓ Read                     │ │
│ │ Quiz: ✓ Passed (2 attempts)         │ │
│ │ 5 min                          [K1] │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ FL-1.1.2 Testing vs Debugging       │ │
│ │ ─────────────────────────────────── │ │
│ │ Content: ✓ Read                     │ │
│ │ Quiz: ⚠️ Not attempted               │ │
│ │ 6 min                          [K2] │ │
│ └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│ Section 1.2                             │
│ [More LO cards...]                      │
└─────────────────────────────────────────┘
```

**Key Features:**
- Full-width cards (mobile-optimized tap targets)
- Grouped by Section (matches syllabus structure)
- Clear status indicators (content + quiz separate)
- K-level badge (visible at glance)
- Time estimate (helps planning)

### 5.2 Learning Objective Content Page

**Layout:**
```
┌─────────────────────────────────────────┐
│ Home > ISTQB Foundation > Chapter 1     │ ← Breadcrumbs
├─────────────────────────────────────────┤
│ FL-1.1.1: Identify Typical Test...  [K1]│ ← Header
│ 3 min read                              │
├─────────────────────────────────────────┤
│ [Content blocks: text, definitions,     │ ← Scrollable content
│  examples, diagrams...]                 │
│                                         │
│                                         │
│                                         │
├─────────────────────────────────────────┤
│ [← Previous: Chapter 1]  [Take Quiz →] │ ← Bottom navigation
└─────────────────────────────────────────┘
```

**Content Blocks:**
- Markdown text
- ISTQB definitions (highlighted)
- Real-world scenarios
- Mermaid diagrams
- Info boxes (tips, warnings, exam notes)

### 5.3 Quiz Page

**Layout (One Question at a Time):**
```
┌─────────────────────────────────────────┐
│ Quiz: FL-1.1.1                          │ ← Header
│ Question 2 of 5                         │ ← Progress
├─────────────────────────────────────────┤
│ Which of the following is a typical     │ ← Question
│ test objective?                         │
│                                         │
│ ○ A) Find as many defects as possible  │ ← Options (radio)
│ ○ B) Prove the software has no defects │
│ ○ C) Increase development speed        │
│ ○ D) Replace manual testing            │
│                                         │
│ [Submit Answer]                         │ ← Submit button
└─────────────────────────────────────────┘

After submission:

┌─────────────────────────────────────────┐
│ ✓ Correct!                              │ ← Immediate feedback
│                                         │
│ Explanation:                            │
│ Finding defects is indeed a primary     │
│ test objective. Testing cannot prove    │
│ absence of defects (option B is wrong).│
│                                         │
│ [Next Question →]                       │ ← Continue
└─────────────────────────────────────────┘
```

**Final Results:**
```
┌─────────────────────────────────────────┐
│ Quiz Results                            │
│                                         │
│ Score: 4/5 (80%)                        │ ← Score
│ ✗ You need 100% to pass                 │ ← Pass requirement
│                                         │
│ Questions you missed:                   │
│ • Question 3: Which is NOT a test...   │
│                                         │
│ [Review Content]  [Retry in 15 min]    │ ← Actions
└─────────────────────────────────────────┘
```

---

## 6. Navigation Logic

### 6.1 Continue Learning Button

```typescript
function getContinueLearningUrl(progress: UserProgress): string {
  const allLOs = getAllLearningObjectives(progress.courseId);

  // Find first in-progress LO (content visited, quiz not passed)
  const inProgressLO = allLOs.find(lo => {
    const loProgress = progress.learningObjectives[lo.id];
    return loProgress?.contentVisited && !loProgress?.quizPassed;
  });

  if (inProgressLO) {
    return `/courses/${progress.courseId}/${inProgressLO.chapterSlug}/${inProgressLO.id}`;
  }

  // Find first not-started LO
  const notStartedLO = allLOs.find(lo => {
    const loProgress = progress.learningObjectives[lo.id];
    return !loProgress?.contentVisited;
  });

  if (notStartedLO) {
    return `/courses/${progress.courseId}/${notStartedLO.chapterSlug}/${notStartedLO.id}`;
  }

  // All complete - go to course home
  return `/courses/${progress.courseId}`;
}
```

### 6.2 Smart "Next" Navigation

**Rules:**
1. If not last LO in chapter → Next LO in same chapter
2. If last LO in chapter → Chapter overview of next chapter
3. If last LO in course → Course completion page

```typescript
function getNextNavigationUrl(currentLO: LearningObjective): string | null {
  // Use pre-computed next LO ID
  if (currentLO.nextLearningObjectiveId) {
    const nextLO = getLearningObjective(currentLO.nextLearningObjectiveId);
    return `/courses/${currentLO.courseId}/${nextLO.chapterSlug}/${nextLO.id}`;
  }

  // Last LO in course
  return `/courses/${currentLO.courseId}/complete`;
}
```

---

## 7. Implementation Plan

### Phase 1: Data Layer (Week 1)
- [ ] Create Learning Objective entity
- [ ] Create UserProgress entity
- [ ] Create QuizAttempt entity
- [ ] Create QuizQuestion entity
- [ ] Create in-memory repositories
- [ ] Add Zod schemas for validation

### Phase 2: Routing & Pages (Week 2)
- [ ] Set up nested folder structure
- [ ] Implement course home page
- [ ] Implement chapter overview page
- [ ] Implement LO content page
- [ ] Implement quiz page
- [ ] Add dynamic metadata for SEO

### Phase 3: UI Components (Week 3)
- [ ] Chapter overview layout
- [ ] LO card component
- [ ] Progress indicators (dual tracking)
- [ ] Continue Learning button
- [ ] LO content renderer
- [ ] Quiz question component
- [ ] Quiz results page
- [ ] Breadcrumbs
- [ ] Navigation buttons (Previous/Next)

### Phase 4: Quiz Logic (Week 4)
- [ ] Question shuffling
- [ ] Progressive cooldown
- [ ] Attempt tracking
- [ ] Score calculation
- [ ] Immediate feedback
- [ ] Cooldown enforcement

### Phase 5: Content Creation (Weeks 5-6)
- [ ] Transform FL-1.1.1 content
- [ ] Transform FL-1.1.2 content
- [ ] Transform FL-1.2.1 content
- [ ] Transform FL-1.2.2 content
- [ ] Transform FL-1.2.3 content
- [ ] Transform FL-1.3.1 content
- [ ] Transform FL-1.4.1 content
- [ ] Transform FL-1.4.2 content
- [ ] Transform FL-1.4.3 content
- [ ] Transform FL-1.4.4 content
- [ ] Transform FL-1.4.5 content
- [ ] Transform FL-1.5.1 content
- [ ] Transform FL-1.5.2 content
- [ ] Transform FL-1.5.3 content

### Phase 6: Quiz Questions (Weeks 7-8)
- [ ] Create FL-1.1.1 quiz (3-5 questions)
- [ ] Create FL-1.1.2 quiz (3-5 questions)
- [ ] Create FL-1.2.1 quiz (3-5 questions)
- [ ] Create FL-1.2.2 quiz (3-5 questions)
- [ ] Create FL-1.2.3 quiz (3-5 questions)
- [ ] Create FL-1.3.1 quiz (3-5 questions)
- [ ] Create FL-1.4.1 quiz (3-5 questions)
- [ ] Create FL-1.4.2 quiz (3-5 questions)
- [ ] Create FL-1.4.3 quiz (3-5 questions)
- [ ] Create FL-1.4.4 quiz (3-5 questions)
- [ ] Create FL-1.4.5 quiz (3-5 questions)
- [ ] Create FL-1.5.1 quiz (3-5 questions)
- [ ] Create FL-1.5.2 quiz (3-5 questions)
- [ ] Create FL-1.5.3 quiz (3-5 questions)

### Phase 7: Testing & Polish (Week 9)
- [ ] Mobile device testing (iOS, Android)
- [ ] Desktop browser testing
- [ ] Accessibility audit
- [ ] Performance testing
- [ ] SEO verification
- [ ] User acceptance testing

---

## 8. Success Criteria

### User Experience
- ✅ Mobile-first design passes on iPhone/Android
- ✅ Content + quiz per LO takes 5-8 minutes max
- ✅ 100% quiz pass requirement enforced
- ✅ Progressive cooldown prevents quiz farming
- ✅ Dual progress tracking shows accurate metrics
- ✅ Continue Learning resumes correctly
- ✅ Next navigation works across chapters

### Technical
- ✅ All URLs under 80 characters
- ✅ Page load time <2 seconds on mobile
- ✅ SEO metadata complete for all pages
- ✅ Sitemap generated automatically
- ✅ TypeScript strict mode with no `any`
- ✅ Zod validation for all external data
- ✅ Repository pattern isolates infrastructure

### Content
- ✅ All 14 Chapter 1 LOs have content
- ✅ All 14 Chapter 1 LOs have quizzes
- ✅ Content transformed from syllabus (not copy-pasted)
- ✅ Real-world examples for each LO
- ✅ ISTQB keywords properly defined
- ✅ Quiz questions align to K-level
- ✅ Quiz explanations reference content

---

## 9. Versioning Strategy

### Major Versions = Separate Courses

**Course Slugs:**
- `istqb-foundation-v4` → ISTQB CTFL v4.x.x (all minor/patch versions)
- `istqb-foundation-v5` → ISTQB CTFL v5.x.x (when released)

**URLs:**
```
/courses/istqb-foundation-v4/chapter-1/fl-1.1.1
/courses/istqb-foundation-v5/chapter-1/fl-1.1.1  # Future
```

### Minor/Patch Updates = In-Place Content Updates

**Version Evolution:**
- v4.0.0 → v4.0.1 → v4.1.0 = Same URLs, content updated in-place
- Users always get latest content for their major version
- No per-user version tracking needed

**Data Model:**
```typescript
interface Course {
  slug: string;                    // "istqb-foundation-v4"
  displayVersion: string;          // "v4" (shown to users & certificates)
  currentContentVersion: string;   // "4.1.0" (for content team only)
  lastContentUpdate: Date;         // When content was last modified
  status: 'active' | 'archived';   // v4 active, v3 archived
}

interface UserProgress {
  courseSlug: string;              // "istqb-foundation-v4" (locked when started)
  // No content version tracking - always use latest
}
```

**Certificate Example:**
```
John Doe
Successfully completed
ISTQB Certified Tester Foundation Level v4
on March 15, 2026
```

### When v5 Releases

- Create new course: `istqb-foundation-v5`
- Archive v4: Users keep progress, can still complete
- New users default to v5
- Users can optionally "upgrade" by starting v5 as new course

## 10. Deferred Decisions

These decisions are deferred for now but noted for future implementation:

1. **Authentication:** SKIPPED FOR NOW
   - Will be implemented later
   - Keep in mind: Will need user sessions for progress tracking

2. **Certificate Generation:** SKIPPED FOR NOW
   - Will be implemented later
   - Keep in mind: Certificate shows major version (v4)

3. **Content Format:** Text-only (per CLAUDE.md)
   - No video support planned
   - May add GIFs/diagrams for visual learners

4. **Gamification:** Basic implementation
   - Progress tracking only (no badges/leaderboards for now)
   - May add later based on user engagement

---

## 10. Next Steps

1. **Get approval on this design**
2. **Create detailed tickets for Phase 1**
3. **Set up development branch**
4. **Start implementation with data layer**

---

## Appendices

### A. Example Learning Objective Content (FL-1.1.1)

See [istqb-content-workflow.md](../../.claude/skills/istqb-content-workflow.md) for content creation guidelines.

### B. Example Quiz Questions (FL-1.1.1)

See [create-quiz-questions.md](../../.claude/skills/create-quiz-questions.md) for quiz creation guidelines.

### C. Mobile Mockups

*To be added: Figma/screenshots of mobile designs*

### D. API Specifications

*To be added: OpenAPI/REST endpoints for progress tracking*

---

**Design Status:** ✅ Complete - Ready for implementation

**Approval Required From:**
- [ ] Product Owner (user requirements)
- [ ] Technical Lead (architecture)
- [ ] UX Designer (mobile-first design)

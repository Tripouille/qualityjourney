# URL Structure - E-Learning Platform Best Practices

## Overview

This document defines the URL architecture for QualityJourney.dev based on Next.js App Router best practices, SEO research, and e-learning platform patterns.

**Decision Date:** 2026-01-04
**Framework:** Next.js 15+ App Router
**Target:** ISTQB certification courses (extensible to other courses)

---

## 1. URL Structure Decision

### Chosen Structure

```
/courses/[course-slug]                                      # Course home
/courses/[course-slug]/[chapter-slug]                       # Chapter overview with LO cards
/courses/[course-slug]/[chapter-slug]/[lo-id]               # Learning Objective content
/courses/[course-slug]/[chapter-slug]/[lo-id]/quiz          # Learning Objective quiz
```

### Example URLs

```
/courses/istqb-foundation                                   # ISTQB Foundation Level course home
/courses/istqb-foundation/chapter-1                         # Chapter 1 overview with FL-1.x.x cards
/courses/istqb-foundation/chapter-1/fl-1.1.1                # FL-1.1.1: Test Objectives (content)
/courses/istqb-foundation/chapter-1/fl-1.1.1/quiz           # FL-1.1.1 quiz
/courses/istqb-foundation/chapter-1/fl-1.1.2                # FL-1.1.2: Testing and Debugging (content)
/courses/istqb-foundation/chapter-1/fl-1.1.2/quiz           # FL-1.1.2 quiz
```

### Alternative Structures Considered

#### Option A: Over-Nested Hierarchy (REJECTED)
```
/courses/istqb-foundation/chapter-1/section-1.1/fl-1.1.1
```

**Pros:**
- Mirrors exact ISTQB structure (Chapter → Section → LO)

**Cons:**
- **URLs too long** (bad for mobile sharing)
- **SEO penalty** for excessive nesting (Google prefers 3-4 levels max)
- **Poor UX** for direct navigation (hard to type, hard to remember)
- **Fragile** if structure changes
- **Section level unnecessary** (not atomic learning unit)

#### Option B: Flat Structure (REJECTED)
```
/courses/istqb-foundation/fl-1.1.1
/courses/istqb-foundation/fl-1.1.2
```

**Pros:**
- Shorter URLs (one less segment)
- Simpler routing

**Cons:**
- **Routing conflict** (Next.js can't distinguish `/chapter-1` from `/fl-1.1.1` at same level)
- **No chapter context** in URL (harder to understand hierarchy)
- **Requires pattern detection** or database lookup to route correctly
- **Solution complexity** outweighs URL length benefit

#### Option C: Nested Hierarchy (ACCEPTED)
```
/courses/istqb-foundation/chapter-1/fl-1.1.1
/courses/istqb-foundation/chapter-1/fl-1.1.1/quiz
```

**Pros:**
- ✅ **No routing conflicts** (chapter and LO at different nesting levels)
- ✅ **SEO-friendly** (clear hierarchy: course → chapter → LO)
- ✅ **Simple routing logic** (no pattern detection needed)
- ✅ **Semantic** (LO ID is meaningful: `fl-1.1.1`)
- ✅ **Bookmarkable** (can share specific Learning Objective)
- ✅ **Scalable** (add more courses/chapters without conflict)
- ✅ **Still short** (49 chars for longest URL - well under 80 char mobile limit)
- ✅ **Easier breadcrumbs** (parse URL path directly)

**Cons:**
- 7 extra characters vs flat structure (negligible trade-off)
- If LO moves to different chapter, URL breaks (won't happen with ISTQB standard)

---

## 2. Next.js App Router Implementation

### Folder Structure

```
src/app/
├── courses/
│   ├── page.tsx                                        # /courses (all courses listing)
│   └── [courseSlug]/
│       ├── page.tsx                                    # /courses/istqb-foundation (course home)
│       └── [chapterSlug]/
│           ├── page.tsx                                # /courses/istqb-foundation/chapter-1
│           └── [learningObjectiveId]/
│               ├── page.tsx                            # /courses/istqb-foundation/chapter-1/fl-1.1.1
│               └── quiz/
│                   └── page.tsx                        # /courses/istqb-foundation/chapter-1/fl-1.1.1/quiz
```

### Route Handlers

#### Course Home Page
```typescript
// src/app/courses/[courseSlug]/page.tsx
export default async function CoursePage({
  params
}: {
  params: { courseSlug: string }
}) {
  // Show Chapter 1 by default, with navigation to other chapters
  // OR redirect to /courses/[courseSlug]/chapter-1
}
```

#### Chapter Overview Page
```typescript
// src/app/courses/[courseSlug]/[chapterSlug]/page.tsx
export default async function ChapterPage({
  params
}: {
  params: { courseSlug: string; chapterSlug: string }
}) {
  // Show Learning Objective cards grouped by section
  // "Continue Learning" button (smart resume)
}
```

#### Learning Objective Content Page
```typescript
// src/app/courses/[courseSlug]/[chapterSlug]/[learningObjectiveId]/page.tsx
export default async function LearningObjectivePage({
  params
}: {
  params: { courseSlug: string; chapterSlug: string; learningObjectiveId: string }
}) {
  // Show content for FL-1.1.1
  // "Take Quiz" button at bottom
  // "Next" button (smart navigation)
}
```

#### Quiz Page
```typescript
// src/app/courses/[courseSlug]/[chapterSlug]/[learningObjectiveId]/quiz/page.tsx
export default async function QuizPage({
  params
}: {
  params: { courseSlug: string; chapterSlug: string; learningObjectiveId: string }
}) {
  // Show quiz for FL-1.1.1
  // Progressive cooldown enforcement
  // Shuffle questions
}
```

---

## 3. SEO Optimization

### Metadata Strategy

#### Dynamic Metadata (per page)
```typescript
// src/app/courses/[courseSlug]/[chapterSlug]/[learningObjectiveId]/page.tsx

export async function generateMetadata({
  params
}: {
  params: { courseSlug: string; chapterSlug: string; learningObjectiveId: string }
}): Promise<Metadata> {
  const lo = await getLearningObjective(params.learningObjectiveId);

  return {
    title: `${lo.id}: ${lo.title} | ISTQB Foundation | QualityJourney.dev`,
    description: `Master ${lo.title} (${lo.kLevel}). Free ISTQB Foundation Level preparation. ${lo.estimatedTime} min.`,
    keywords: ['ISTQB', 'Software Testing', 'Certification', lo.title, ...lo.keywords],

    // Open Graph (social sharing)
    openGraph: {
      title: `${lo.id}: ${lo.title}`,
      description: `Learn ${lo.title} for ISTQB Foundation Level certification`,
      type: 'article',
      url: `https://qualityjourney.dev/courses/istqb-foundation/${params.chapterSlug}/${lo.id}`,
      images: [
        {
          url: `/og-images/${lo.id}.png`, // Dynamic OG image
          width: 1200,
          height: 630,
          alt: `${lo.id}: ${lo.title}`,
        },
      ],
    },

    // Canonical URL
    alternates: {
      canonical: `https://qualityjourney.dev/courses/istqb-foundation/${params.chapterSlug}/${lo.id}`,
    },
  };
}
```

### URL Best Practices (Applied)

✅ **Semantic URLs:** Use words, not IDs (`fl-1.1.1` is semantic in ISTQB context)
✅ **Hyphens for separation:** `/istqb-foundation/fl-1.1.1` (not underscores)
✅ **Lowercase:** All URLs lowercase for consistency
✅ **Short and simple:** 2-3 segments max (except quiz: 3-4)
✅ **Keyword-focused:** Course name in URL (`istqb-foundation`)
✅ **Logical hierarchy:** `/courses/[course]/[lo]`

### Structured Data (JSON-LD)

```typescript
// src/app/courses/[courseSlug]/[loId]/page.tsx

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'LearningResource',
  name: `${lo.id}: ${lo.title}`,
  description: lo.description,
  educationalLevel: 'Foundation Level',
  teaches: lo.title,
  timeRequired: `PT${lo.estimatedTime}M`,
  inLanguage: 'en',
  provider: {
    '@type': 'Organization',
    name: 'QualityJourney.dev',
    url: 'https://qualityjourney.dev',
  },
  isPartOf: {
    '@type': 'Course',
    name: 'ISTQB Certified Tester Foundation Level',
    provider: 'QualityJourney.dev',
  },
};
```

### Sitemap Generation

```typescript
// src/app/sitemap.ts

import { getAllCourses, getAllLearningObjectives } from '@/lib/courses';

export default async function sitemap() {
  const courses = await getAllCourses();
  const learningObjectives = await getAllLearningObjectives();

  return [
    {
      url: 'https://qualityjourney.dev',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://qualityjourney.dev/courses',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...courses.map((course) => ({
      url: `https://qualityjourney.dev/courses/${course.slug}`,
      lastModified: course.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.8,
    })),
    ...learningObjectives.map((lo) => ({
      url: `https://qualityjourney.dev/courses/${lo.courseSlug}/${lo.chapterSlug}/${lo.id}`,
      lastModified: lo.updatedAt,
      changeFrequency: 'monthly',
      priority: 0.7,
    })),
  ];
}
```

### Robots.txt

```typescript
// src/app/robots.ts

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',           // No indexing of API routes
          '/u/',             // No indexing of user profile pages
          '*/quiz?*',        // No indexing of quiz result pages with query params
        ],
      },
    ],
    sitemap: 'https://qualityjourney.dev/sitemap.xml',
  };
}
```

---

## 4. Performance Optimizations

### Prefetching Strategy

```typescript
// Prefetch next Learning Objective on hover
import Link from 'next/link';

<Link
  href={`/courses/istqb-foundation/${nextLO.chapterSlug}/${nextLO.id}`}
  prefetch={true}  // Next.js automatically prefetches on hover
>
  Next: {nextLO.title}
</Link>
```

### Code Splitting

- Each Learning Objective page loads only its content (automatic with Next.js App Router)
- Quiz component lazy-loaded only when needed
- Interactive components (scenarios, drag-drop) loaded on demand

### Caching Strategy

```typescript
// src/app/courses/[courseSlug]/[chapterSlug]/[learningObjectiveId]/page.tsx

export const revalidate = 3600; // Revalidate every hour (content rarely changes)

// OR for completely static content:
export const dynamic = 'force-static';
export const dynamicParams = true; // Generate pages for new LOs at runtime
```

---

## 5. Navigation Patterns

### Breadcrumbs

```
Home > Courses > ISTQB Foundation > Chapter 1 > FL-1.1.1: Test Objectives
```

```typescript
// Component: Breadcrumbs.tsx
const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Courses', href: '/courses' },
  { label: 'ISTQB Foundation', href: '/courses/istqb-foundation' },
  { label: 'Chapter 1', href: '/courses/istqb-foundation/chapter-1' },
  { label: `${lo.id}: ${lo.title}`, href: `/courses/istqb-foundation/chapter-1/${lo.id}` },
];
```

### Smart "Next" Navigation

```typescript
// Logic for "Next" button

function getNextUrl(currentLoId: string, courseSlug: string): string | null {
  const currentLO = getLearningObjective(currentLoId);
  const chapter = getChapter(currentLO.chapterId);
  const currentIndex = chapter.learningObjectives.findIndex(lo => lo.id === currentLoId);

  // If not last LO in chapter
  if (currentIndex < chapter.learningObjectives.length - 1) {
    const nextLO = chapter.learningObjectives[currentIndex + 1];
    return `/courses/${courseSlug}/${chapter.slug}/${nextLO.id}`;
  }

  // If last LO in chapter, go to next chapter
  const nextChapter = getNextChapter(chapter.id);
  if (nextChapter) {
    return `/courses/${courseSlug}/${nextChapter.slug}`;
  }

  // If last LO in course, go to course completion page
  return `/courses/${courseSlug}/complete`;
}
```

### "Continue Learning" Button

```typescript
// Logic for smart resume

function getContinueLearningUrl(userId: string, courseSlug: string): string {
  const progress = getUserProgress(userId, courseSlug);

  // Find first in-progress LO in natural order
  const inProgressLO = progress.learningObjectives
    .filter(lo => lo.contentVisited && !lo.quizPassed)
    .sort((a, b) => compareLOIds(a.id, b.id)) // Sort by FL-1.1.1, FL-1.1.2, etc.
    [0];

  if (inProgressLO) {
    const lo = getLearningObjective(inProgressLO.id);
    return `/courses/${courseSlug}/${lo.chapterSlug}/${inProgressLO.id}`;
  }

  // Find first not-started LO
  const notStartedLO = progress.learningObjectives
    .filter(lo => !lo.contentVisited)
    .sort((a, b) => compareLOIds(a.id, b.id))
    [0];

  if (notStartedLO) {
    const lo = getLearningObjective(notStartedLO.id);
    return `/courses/${courseSlug}/${lo.chapterSlug}/${notStartedLO.id}`;
  }

  // All complete - go to course overview
  return `/courses/${courseSlug}`;
}
```

---

## 6. Deep Linking & Sharing

### Share URLs

**Learning Objective:**
```
https://qualityjourney.dev/courses/istqb-foundation/chapter-1/fl-1.1.1
```

**Quiz (with results):**
```
https://qualityjourney.dev/courses/istqb-foundation/chapter-1/fl-1.1.1/quiz?score=80&attempt=2
```

**Chapter Overview:**
```
https://qualityjourney.dev/courses/istqb-foundation/chapter-1
```

### Query Parameters (Non-Indexed)

**Allowed query params:**
- `?utm_source=...` (marketing tracking)
- `?score=...` (quiz results - NOT indexed)
- `?attempt=...` (quiz attempt number - NOT indexed)
- `?retry=...` (retry timestamp - NOT indexed)

**Canonical URL handling:**
All URLs with query params point to canonical URL without params:

```html
<link rel="canonical" href="https://qualityjourney.dev/courses/istqb-foundation/chapter-1/fl-1.1.1" />
```

---

## 7. Mobile-First Considerations

### URL Length

**Maximum URL length (mobile):** ~80 characters for comfortable sharing

**Longest URL in our structure:**
```
https://qualityjourney.dev/courses/istqb-foundation/chapter-1/fl-1.5.3/quiz
```
Length: 76 characters ✅

### Copy-Paste Friendly

- All lowercase (no mixed case confusion)
- Hyphens (no underscores or special characters)
- Semantic (LO ID is recognizable: `fl-1.1.1`)

### QR Code Support

Short URLs = smaller QR codes = better mobile scanning

Example: Print QR codes in study guides linking to specific Learning Objectives

---

## 8. Multi-Course Scalability

### Adding New Courses

**ISTQB Advanced Test Analyst:**
```
/courses/istqb-advanced-ta/chapter-1/ta-1.1.1
/courses/istqb-advanced-ta/chapter-1/ta-1.1.1/quiz
```

**ISTQB Advanced Test Manager:**
```
/courses/istqb-advanced-tm/chapter-1/tm-1.1.1
```

**Future Non-ISTQB Courses:**
```
/courses/cypress-testing/chapter-1/lesson-1
/courses/playwright-fundamentals/chapter-1/lesson-2
```

**No namespace collision:** LO IDs are scoped to course AND chapter

---

## 9. Redirects & Backwards Compatibility

### Redirect Strategy

If we change URL structure in the future, use Next.js redirects:

```typescript
// next.config.js

module.exports = {
  async redirects() {
    return [
      {
        source: '/courses/istqb-foundation/section-1.1',  // Old structure
        destination: '/courses/istqb-foundation/chapter-1', // New structure
        permanent: true, // 301 redirect (SEO-friendly)
      },
    ];
  },
};
```

### Version Tracking

Store URL structure version in database:

```typescript
interface Course {
  id: string;
  slug: string;
  urlStructureVersion: number; // Increment on breaking changes
}
```

---

## 10. Analytics & Tracking

### URL-Based Analytics

**Track:**
- Most visited Learning Objectives
- Entry points (how users discover content)
- Exit points (where users drop off)
- Share frequency (which LOs are shared most)

**UTM Parameters:**
```
?utm_source=reddit&utm_medium=social&utm_campaign=istqb-launch
```

**Internal tracking:**
```typescript
// Track page view
trackPageView({
  url: '/courses/istqb-foundation/chapter-1/fl-1.1.1',
  courseSlug: 'istqb-foundation',
  chapterSlug: 'chapter-1',
  learningObjectiveId: 'fl-1.1.1',
  timestamp: new Date(),
});
```

---

## 11. Implementation Checklist

### Phase 1: Core Routes
- [ ] `/courses` (all courses)
- [ ] `/courses/[courseSlug]` (course home)
- [ ] `/courses/[courseSlug]/[chapterSlug]` (chapter overview with LO cards)
- [ ] `/courses/[courseSlug]/[chapterSlug]/[learningObjectiveId]` (LO content)
- [ ] `/courses/[courseSlug]/[chapterSlug]/[learningObjectiveId]/quiz` (LO quiz)

### Phase 2: SEO
- [ ] Dynamic metadata for each route
- [ ] Sitemap generation
- [ ] Robots.txt
- [ ] Structured data (JSON-LD)
- [ ] Open Graph images

### Phase 3: Navigation
- [ ] Breadcrumbs component
- [ ] Smart "Next" button
- [ ] "Continue Learning" button
- [ ] Chapter navigation sidebar (mobile-friendly)

### Phase 4: Performance
- [ ] Prefetching strategy
- [ ] Code splitting
- [ ] Image optimization
- [ ] Caching strategy

---

## References

**Sources:**
- [Next.js SEO: URL Structure](https://nextjs.org/learn/seo/url-structure)
- [Next.js SEO Best Practices (App Router, 2025 Edition)](https://www.averagedevs.com/blog/nextjs-seo-best-practices)
- [Next.js SEO Checklist 2025 (App Router Edition)](https://www.mgphq.com/blog/nextjs-seo-checklist-2025-app-router)
- [Best Practices for Organizing Your Next.js 15 2025](https://dev.to/bajrayejoon/best-practices-for-organizing-your-nextjs-15-2025-53ji)
- [Next.js App Router Best Practices (2025 Edition)](https://www.anshgupta.in/blog/nextjs-app-router-best-practices-2025)
- [The Complete Next.js SEO Guide for Building Crawlable Apps](https://strapi.io/blog/nextjs-seo)

---

**Decision:** Use `/courses/[courseSlug]/[loId]` structure for optimal balance of SEO, UX, and scalability.

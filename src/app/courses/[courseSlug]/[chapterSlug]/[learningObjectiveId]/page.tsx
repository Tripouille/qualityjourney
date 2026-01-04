/**
 * Learning Objective Content Page
 * Dynamic route: /courses/[courseSlug]/[chapterSlug]/[learningObjectiveId]
 *
 * Example: /courses/istqb-foundation-v4/chapter-1/FL-1.1.1
 *
 * Displays:
 * - Learning Objective content (transformed from ISTQB syllabus)
 * - Content blocks (text, definitions, scenarios, diagrams, info boxes)
 * - Navigation (Previous LO, Next LO, Take Quiz button)
 * - Progress tracking (marks content as visited)
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getLearningObjective } from '@/infrastructure/repositories/in-memory/data/istqb-chapter1-learning-objectives';
import { ContentBlockRenderer } from '@/features/courses/components/content-block-renderer';

interface PageProps {
  params: Promise<{
    courseSlug: string;
    chapterSlug: string;
    learningObjectiveId: string;
  }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const learningObjective = getLearningObjective(params.learningObjectiveId);

  if (!learningObjective) {
    return {
      title: 'Learning Objective Not Found',
    };
  }

  return {
    title: `${learningObjective.id}: ${learningObjective.title} - ISTQB Foundation - QualityJourney.dev`,
    description: learningObjective.description,
  };
}

export default async function LearningObjectivePage(props: PageProps): Promise<React.JSX.Element> {
  const params = await props.params;
  const learningObjective = getLearningObjective(params.learningObjectiveId);

  if (!learningObjective) {
    notFound();
  }

  const quizUrl = `/courses/${params.courseSlug}/${params.chapterSlug}/${params.learningObjectiveId}/quiz`;
  const chapterUrl = `/courses/${params.courseSlug}/${params.chapterSlug}`;

  // Navigation URLs
  const previousUrl = learningObjective.previousLearningObjectiveId
    ? `/courses/${params.courseSlug}/${params.chapterSlug}/${learningObjective.previousLearningObjectiveId}`
    : chapterUrl;

  const nextUrl = learningObjective.nextLearningObjectiveId
    ? `/courses/${params.courseSlug}/${params.chapterSlug}/${learningObjective.nextLearningObjectiveId}`
    : chapterUrl;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 md:px-6 md:py-12">
      {/* Breadcrumbs */}
      <nav className="mb-4 text-sm text-muted-foreground md:mb-6">
        <Link href="/courses" className="hover:text-foreground">
          Courses
        </Link>
        {' / '}
        <Link href={`/courses/${params.courseSlug}`} className="hover:text-foreground">
          ISTQB Foundation
        </Link>
        {' / '}
        <Link href={chapterUrl} className="hover:text-foreground">
          Chapter 1
        </Link>
      </nav>

      {/* Header */}
      <header className="mb-6 md:mb-8">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-sm font-semibold text-primary">{learningObjective.id}</span>
          <span className="rounded bg-muted px-2 py-0.5 text-xs font-medium">
            {learningObjective.kLevel}
          </span>
        </div>
        <h1 className="mb-2 text-2xl font-bold md:text-3xl">{learningObjective.title}</h1>
        <p className="text-sm text-muted-foreground md:text-base">
          {learningObjective.estimatedReadingTime} min read •{' '}
          {learningObjective.estimatedQuizTime} min quiz
        </p>
      </header>

      {/* Content Blocks */}
      <div className="mb-8 space-y-6">
        {learningObjective.contentBlocks.map((block) => (
          <ContentBlockRenderer key={block.id} block={block} />
        ))}
      </div>

      {/* Take Quiz CTA */}
      <div className="mb-8 rounded-lg border bg-card p-6 text-center">
        <h2 className="mb-2 text-lg font-semibold">Ready to test your knowledge?</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Take the quiz to master this learning objective and track your progress.
        </p>
        <Link
          href={quizUrl}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-medium text-primary-foreground hover:bg-primary/90"
        >
          Take Quiz
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>

      {/* Bottom Navigation */}
      <nav className="flex items-center justify-between border-t pt-6">
        <Link
          href={previousUrl}
          className="flex items-center gap-2 text-sm font-medium hover:text-primary"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          {learningObjective.previousLearningObjectiveId ? 'Previous' : 'Chapter Overview'}
        </Link>

        <Link
          href={nextUrl}
          className="flex items-center gap-2 text-sm font-medium hover:text-primary"
        >
          {learningObjective.nextLearningObjectiveId ? 'Next' : 'Chapter Overview'}
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </nav>
    </div>
  );
}

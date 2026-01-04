/**
 * Quiz Page
 * Dynamic route: /courses/[courseSlug]/[chapterSlug]/[learningObjectiveId]/quiz
 *
 * Example: /courses/istqb-foundation-v4/chapter-1/FL-1.1.1/quiz
 *
 * Features:
 * - One question at a time (mobile-optimized)
 * - Immediate feedback after each answer
 * - Question and option shuffling
 * - 100% pass requirement
 * - Progressive cooldown (1st immediate, 2nd 15min, 3rd+ 1hr)
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getLearningObjective } from '@/infrastructure/repositories/in-memory/data/istqb-chapter1-learning-objectives';
import { getQuizQuestions } from '@/infrastructure/repositories/in-memory/data/istqb-chapter1-quiz-questions';
import { QuizInterface } from '@/features/courses/components/quiz-interface';

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
      title: 'Quiz Not Found',
    };
  }

  return {
    title: `Quiz: ${learningObjective.id} - ${learningObjective.title} - QualityJourney.dev`,
    description: `Test your knowledge of ${learningObjective.title}`,
  };
}

export default async function QuizPage(props: PageProps): Promise<React.JSX.Element> {
  const params = await props.params;
  const learningObjective = getLearningObjective(params.learningObjectiveId);
  const questions = getQuizQuestions(params.learningObjectiveId);

  if (!learningObjective || questions.length === 0) {
    notFound();
  }

  const contentUrl = `/courses/${params.courseSlug}/${params.chapterSlug}/${params.learningObjectiveId}`;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 md:px-6 md:py-12">
      <QuizInterface
        learningObjective={learningObjective}
        questions={questions}
        contentUrl={contentUrl}
      />
    </div>
  );
}

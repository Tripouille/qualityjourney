/**
 * ISTQB Foundation Quiz Page
 * Interactive quiz for Chapter 1: Fundamentals of Testing
 */

import type { Metadata } from 'next';
import { QuizRunner } from '@/features/courses/components/QuizRunner';

export const metadata: Metadata = {
  title: 'Chapter 1 Quiz - ISTQB Foundation - QualityJourney.dev',
  description: 'Test your knowledge of software testing fundamentals with this comprehensive ISTQB quiz.',
};

export default function ISTQBQuizPage(): React.JSX.Element {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold md:text-3xl">
          ISTQB Foundation Level - Chapter 1 Quiz
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          Test your understanding of &ldquo;What is Testing?&rdquo; and &ldquo;Why is Testing Necessary?&rdquo;
        </p>
      </div>

      <QuizRunner quizId="quiz-istqb-ch1-fundamentals" />
    </div>
  );
}

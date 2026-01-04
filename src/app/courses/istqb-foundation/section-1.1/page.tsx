/**
 * ISTQB Foundation - Section 1.1: What is Testing?
 * Lesson content page with interactive ContentBlocks
 */

import type { Metadata } from 'next';
import { LessonView } from '@/features/courses/components/lesson-view';
import { SECTION_1_1 } from '@/infrastructure/repositories/in-memory/data/istqb-chapter1-sections';

export const metadata: Metadata = {
  title: 'Section 1.1: What is Testing? - ISTQB Foundation - QualityJourney.dev',
  description:
    'Learn the fundamentals of software testing, including test objectives and the difference between testing and debugging.',
};

export default function Section11Page(): React.JSX.Element {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <LessonView section={SECTION_1_1} quizUrl="/courses/istqb-foundation/quiz" />
    </div>
  );
}

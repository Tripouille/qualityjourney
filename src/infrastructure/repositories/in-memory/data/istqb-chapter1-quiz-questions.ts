/**
 * ISTQB Chapter 1: Quiz Questions
 *
 * Quiz questions for all Chapter 1 Learning Objectives
 * Following ISTQB exam question format
 *
 * Design Principles:
 * - 3-5 questions per K1/K2 LO, 5-7 for K3
 * - Each question has 4 options (A, B, C, D)
 * - Exactly one correct answer
 * - Explanations for correct answer + rationale for wrong answers
 * - Questions are shuffled on each attempt
 * - Options are shuffled on each attempt
 */

import type { QuizQuestion } from '@/domain/entities/quiz';

/**
 * FL-1.1.1 Quiz Questions (K1 Level)
 * Topic: Identify typical test objectives
 *
 * K1 questions test recall/recognition of concepts
 */
export const FL_1_1_1_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'FL-1.1.1-Q1',
    learningObjectiveId: 'FL-1.1.1',
    kLevel: 'K1',

    question: 'Which of the following is a typical objective of testing?',
    options: [
      {
        id: 'A',
        text: 'To find as many defects as possible before release',
        order: 0,
      },
      {
        id: 'B',
        text: 'To prove that the software has no defects',
        order: 1,
      },
      {
        id: 'C',
        text: 'To ensure testing is completed within budget',
        order: 2,
      },
      {
        id: 'D',
        text: 'To replace the need for code reviews',
        order: 3,
      },
    ],
    correctOptionId: 'A',

    explanation:
      'Finding defects before release is a core test objective. It helps reduce risk and improve software quality by identifying issues early.',
    rationale: {
      B: 'Testing cannot prove the absence of defects (one of the seven testing principles). We can only show that defects exist, not that they don\'t.',
      C: 'Budget management is a project management concern, not a test objective. While important, it\'s not a "why we test" reason.',
      D: 'Testing complements code reviews; it doesn\'t replace them. Both activities serve different purposes in quality assurance.',
    },

    tags: ['test-objectives', 'fundamentals'],
    createdAt: new Date('2026-01-04'),
    updatedAt: new Date('2026-01-04'),
  },

  {
    id: 'FL-1.1.1-Q2',
    learningObjectiveId: 'FL-1.1.1',
    kLevel: 'K1',

    question:
      'A company needs to verify that their new payment feature meets PCI-DSS security standards before launch. Which test objective does this represent?',
    options: [
      {
        id: 'A',
        text: 'Building confidence in the quality of the software',
        order: 0,
      },
      {
        id: 'B',
        text: 'Verifying compliance with regulatory requirements',
        order: 1,
      },
      {
        id: 'C',
        text: 'Ensuring required coverage of the test object',
        order: 2,
      },
      {
        id: 'D',
        text: 'Providing information to stakeholders',
        order: 3,
      },
    ],
    correctOptionId: 'B',

    explanation:
      'PCI-DSS is a regulatory standard for payment card security. Testing to verify compliance with legal, contractual, or regulatory requirements is a specific test objective.',
    rationale: {
      A: 'While compliance testing may build confidence, the primary objective here is meeting regulatory requirements, not general confidence building.',
      C: 'Coverage is about ensuring all parts of the system are tested, not about meeting external standards.',
      D: 'Providing information is a test objective, but the question specifically mentions verifying compliance with standards.',
    },

    tags: ['test-objectives', 'compliance', 'scenario'],
    createdAt: new Date('2026-01-04'),
    updatedAt: new Date('2026-01-04'),
  },

  {
    id: 'FL-1.1.1-Q3',
    learningObjectiveId: 'FL-1.1.1',
    kLevel: 'K1',

    question:
      'Which of the following is NOT listed as a typical test objective in the ISTQB syllabus?',
    options: [
      {
        id: 'A',
        text: 'Reducing the level of risk of inadequate software quality',
        order: 0,
      },
      {
        id: 'B',
        text: 'Validating whether the test object is complete and works as expected',
        order: 1,
      },
      {
        id: 'C',
        text: 'Eliminating the need for user acceptance testing',
        order: 2,
      },
      {
        id: 'D',
        text: 'Providing information to stakeholders to allow them to make informed decisions',
        order: 3,
      },
    ],
    correctOptionId: 'C',

    explanation:
      'Testing does not eliminate the need for UAT (User Acceptance Testing). UAT is a critical phase where actual users validate the software meets their needs. Testing objectives support UAT, they don\'t replace it.',
    rationale: {
      A: 'Risk reduction is explicitly listed as a typical test objective (#4 in the ISTQB list of 9 objectives).',
      B: 'Validating completeness and expected behavior is objective #9 in the ISTQB syllabus.',
      D: 'Providing information for decision-making is objective #7 in the ISTQB syllabus.',
    },

    tags: ['test-objectives', 'fundamentals', 'negative-question'],
    createdAt: new Date('2026-01-04'),
    updatedAt: new Date('2026-01-04'),
  },

  {
    id: 'FL-1.1.1-Q4',
    learningObjectiveId: 'FL-1.1.1',
    kLevel: 'K1',

    question:
      'A test manager runs a live demo of the new mobile app to executives to show that key features work correctly. Which test objective is being fulfilled?',
    options: [
      {
        id: 'A',
        text: 'Triggering failures and finding defects',
        order: 0,
      },
      {
        id: 'B',
        text: 'Building confidence in the quality of the test object',
        order: 1,
      },
      {
        id: 'C',
        text: 'Evaluating work products such as requirements',
        order: 2,
      },
      {
        id: 'D',
        text: 'Verifying that specified requirements have been fulfilled',
        order: 3,
      },
    ],
    correctOptionId: 'B',

    explanation:
      'Demonstrating working features to stakeholders is primarily about building confidence (objective #8). The demo shows executives that the software works as expected, giving them confidence in quality.',
    rationale: {
      A: 'While testing does find defects, a demo to executives is focused on showing what works, not on finding failures.',
      C: 'Evaluating work products happens earlier in the lifecycle (reviewing requirements, designs). A demo of working software is not work product evaluation.',
      D: 'While the demo may incidentally verify requirements, the primary purpose of showing it to executives is confidence building, not verification.',
    },

    tags: ['test-objectives', 'scenario', 'stakeholder'],
    createdAt: new Date('2026-01-04'),
    updatedAt: new Date('2026-01-04'),
  },

  {
    id: 'FL-1.1.1-Q5',
    learningObjectiveId: 'FL-1.1.1',
    kLevel: 'K1',

    question:
      'A tester uses a requirements traceability matrix to ensure every user story has at least one associated test case. Which test objective is being addressed?',
    options: [
      {
        id: 'A',
        text: 'Ensuring required coverage of a test object',
        order: 0,
      },
      {
        id: 'B',
        text: 'Verifying that specified requirements have been fulfilled',
        order: 1,
      },
      {
        id: 'C',
        text: 'Triggering failures and finding defects',
        order: 2,
      },
      {
        id: 'D',
        text: 'Evaluating work products such as user stories',
        order: 3,
      },
    ],
    correctOptionId: 'A',

    explanation:
      'Using a traceability matrix to map user stories to test cases ensures coverage (objective #3). This approach verifies that all requirements have corresponding tests, addressing the "ensuring required coverage" objective.',
    rationale: {
      B: 'Verifying requirements (objective #5) happens when you execute tests and check results. Creating the traceability matrix is about coverage planning, not verification.',
      C: 'Finding defects happens during test execution. Creating a matrix is a planning activity to ensure coverage.',
      D: 'Evaluating work products (objective #1) involves reviewing the quality of requirements themselves. Mapping them to test cases is about coverage, not evaluation.',
    },

    tags: ['test-objectives', 'coverage', 'traceability'],
    createdAt: new Date('2026-01-04'),
    updatedAt: new Date('2026-01-04'),
  },
];

/**
 * Export all quiz questions by Learning Objective
 */
export const CHAPTER_1_QUIZ_QUESTIONS = {
  'FL-1.1.1': FL_1_1_1_QUIZ_QUESTIONS,
  // FL-1.1.2 questions will be added here
  // FL-1.2.1 questions will be added here
  // ... etc
};

/**
 * Helper function to get quiz questions for a Learning Objective
 */
export function getQuizQuestions(learningObjectiveId: string): QuizQuestion[] {
  return CHAPTER_1_QUIZ_QUESTIONS[learningObjectiveId as keyof typeof CHAPTER_1_QUIZ_QUESTIONS] || [];
}

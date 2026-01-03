/**
 * ISTQB Chapter 1: Fundamentals of Testing - Section Data
 *
 * CRITICAL: Content must be extracted from official ISTQB CTFL v4.0.1 syllabus
 * Current content is PLACEHOLDER structure - needs replacement with actual syllabus text
 *
 * Structure: Section → Learning Objectives → Content Blocks → Quiz Reference
 */

import type { Section, Chapter } from '@/domain/entities/section';

/**
 * Section 1.1: What is Testing?
 *
 * Learning Objectives:
 * - FL-1.1.1 (K1): Identify typical test objectives
 * - FL-1.1.2 (K2): Differentiate testing from debugging
 */
export const SECTION_1_1: Section = {
  id: 'section-1.1',
  title: 'What is Testing?',
  sectionNumber: '1.1',
  chapterId: 'chapter-1',
  order: 1,

  learningObjectives: [
    {
      id: 'FL-1.1.1',
      title: 'Identify typical test objectives',
      kLevel: 'K1',
      keywords: ['test objective', 'quality', 'defect', 'risk'],
    },
    {
      id: 'FL-1.1.2',
      title: 'Differentiate testing from debugging',
      kLevel: 'K2',
      keywords: ['testing', 'debugging', 'defect', 'root cause'],
    },
  ],

  contentBlocks: [
    // Introduction
    {
      id: 'block-1.1-1',
      type: 'text',
      content: `Software testing is a way to assess the quality of software and to reduce the risk of software failure in operation. Testing involves the dynamic execution of test objects with actual inputs to observe and compare their actual behavior to the expected behavior.`,
    },

    // Learning Objective FL-1.1.1: Test Objectives
    {
      id: 'block-1.1-2',
      type: 'definition',
      term: 'Test Objective',
      definition:
        'The reason or purpose for designing and executing a test. Common test objectives include evaluating work products, triggering failures, finding defects, providing information, reducing risk, and verifying requirements.',
      isISTQBKeyword: true,
    },

    {
      id: 'block-1.1-3',
      type: 'text',
      content: `## Typical Test Objectives

Testing has several objectives that may vary depending on the context:

1. **Evaluating work products** such as requirements, user stories, designs, and code
2. **Triggering failures** and finding defects
3. **Ensuring required coverage** of a test object
4. **Reducing the level of risk** of inadequate software quality
5. **Verifying** whether specified requirements have been fulfilled
6. **Verifying** that a test object complies with contractual, legal, and regulatory requirements
7. **Providing information** to stakeholders to allow them to make informed decisions
8. **Building confidence** in the quality of the test object
9. **Validating** whether the test object is complete and works as expected by stakeholders`,
    },

    {
      id: 'block-1.1-4',
      type: 'infobox',
      variant: 'exam-tip',
      title: 'Exam Tip: Objectives vs Activities',
      content:
        'The exam may ask you to distinguish between test **objectives** (why we test) and test **activities** (what we do during testing). Remember that objectives are the goals we want to achieve, while activities are the actions we perform.',
    },

    {
      id: 'block-1.1-5',
      type: 'scenario',
      title: 'Real-World Example: E-Commerce Checkout',
      context:
        'A company is developing a new checkout feature for their e-commerce platform. They need to ensure it works correctly before release.',
      situation: `The test team defines multiple objectives for testing:
- **Find defects**: Test with various payment methods to trigger potential failures
- **Reduce risk**: Verify security requirements for credit card processing
- **Build confidence**: Demonstrate successful transactions to stakeholders
- **Verify requirements**: Confirm all user stories are implemented correctly`,
      analysis:
        'This scenario demonstrates how multiple test objectives can apply to a single feature. Each objective serves a different purpose but contributes to overall quality assurance.',
    },

    // Learning Objective FL-1.1.2: Testing vs Debugging
    {
      id: 'block-1.1-6',
      type: 'text',
      content: `## Testing vs Debugging

While testing and debugging are related activities, they serve different purposes and are performed by different roles.`,
    },

    {
      id: 'block-1.1-7',
      type: 'definition',
      term: 'Testing',
      definition:
        'The process of executing a system or component to find defects, verify that it meets specified requirements, or evaluate quality attributes. Testing can trigger failures that are caused by defects in the software.',
      isISTQBKeyword: true,
    },

    {
      id: 'block-1.1-8',
      type: 'definition',
      term: 'Debugging',
      definition:
        'The process of finding, analyzing, and removing the causes of failures in software. Debugging follows testing and is performed by developers to locate and fix defects.',
      isISTQBKeyword: true,
    },

    {
      id: 'block-1.1-9',
      type: 'mermaid',
      diagram: `flowchart LR
    A[Testing Activity] --> B[Finds Failure]
    B --> C[Triggers Debugging]
    C --> D[Locates Defect]
    C --> E[Removes Root Cause]
    E --> F[Fixes Software]
    F --> G[Requires Confirmation Testing]`,
      caption: 'The relationship between testing and debugging',
    },

    {
      id: 'block-1.1-10',
      type: 'infobox',
      variant: 'info',
      title: 'Key Differences',
      content: `**Testing:**
- Performed by testers (usually)
- Goal: Find defects and evaluate quality
- Shows that failures exist

**Debugging:**
- Performed by developers (usually)
- Goal: Fix defects and remove root causes
- Explains why failures occur`,
    },

    {
      id: 'block-1.1-11',
      type: 'infobox',
      variant: 'tip',
      title: 'Remember for the Exam',
      content:
        'A common exam question asks: "What is the primary difference between testing and debugging?" The key answer is that **testing** aims to find defects by triggering failures, while **debugging** aims to locate and fix the root cause of those failures.',
    },

    // Summary
    {
      id: 'block-1.1-12',
      type: 'text',
      content: `## Summary

Software testing assesses quality and reduces risk through dynamic execution of test objects. Testing has multiple objectives including finding defects, reducing risk, and building confidence. While testing finds failures, debugging analyzes and fixes their root causes. Both activities are essential but serve different purposes in the software development lifecycle.`,
    },
  ],

  quizId: 'quiz-istqb-ch1-fundamentals',
  estimatedDuration: 20, // 15 min reading + 5 min quiz
  keywords: ['testing', 'debugging', 'test objective', 'defect', 'failure', 'quality', 'risk'],

  isContentCompleted: false,
  isQuizPassed: false,
};

/**
 * Chapter 1: Fundamentals of Testing
 * Contains all sections for Chapter 1
 */
export const CHAPTER_1: Chapter = {
  id: 'chapter-1',
  title: 'Fundamentals of Testing',
  chapterNumber: '1',
  courseId: 'course-istqb-foundation',
  order: 1,
  sections: [SECTION_1_1],
  description:
    'Introduction to software testing principles, terminology, and fundamental concepts. This chapter covers what testing is, why it is necessary, the seven testing principles, test activities, and the psychology of testing.',
  totalDuration: 20,
  totalSections: 1, // Will increase as we add 1.2, 1.3, 1.4, 1.5
};

/**
 * Export all sections for easy access
 */
export const ISTQB_CHAPTER_1_SECTIONS = {
  chapter: CHAPTER_1,
  sections: {
    '1.1': SECTION_1_1,
    // '1.2': SECTION_1_2, // To be added
    // '1.3': SECTION_1_3,
    // '1.4': SECTION_1_4,
    // '1.5': SECTION_1_5,
  },
};

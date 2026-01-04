// @ts-nocheck
import type { Quiz } from '@/domain/entities/quiz';

/**
 * ISTQB Foundation Level - Chapter 1 Quiz Data
 * Based on ISTQB CTFL Syllabus v4.0.1
 *
 * Philosophy: Exhaustive coverage of all learning objectives
 */

export const CHAPTER_1_QUIZ_FUNDAMENTALS: Quiz = {
  id: 'quiz-istqb-ch1-fundamentals',
  lessonId: 'lesson-1-1-5', // Links to the "Quiz: Fundamentals" lesson
  title: 'Chapter 1: Fundamentals of Testing - Part 1',
  description:
    'Comprehensive quiz covering sections 1.1 (What is Testing?) and 1.2 (Why is Testing Necessary?). Tests all ISTQB keywords and learning objectives for these sections.',
  passingScore: 70,
  timeLimit: 30,
  questions: [
    // ========================================
    // Section 1.1: What is Testing?
    // ========================================

    // FL-1.1.1 (K1) Identify typical test objectives
    {
      id: 'q-1-1-1',
      type: 'single-choice',
      question: 'Which of the following is a typical test objective?',
      options: [
        {
          id: 'a',
          text: 'Evaluating work products such as requirements, user stories, design, and code',
          isCorrect: true,
        },
        {
          id: 'b',
          text: 'Ensuring the project stays within budget constraints',
          isCorrect: false,
        },
        {
          id: 'c',
          text: 'Writing user stories for the development team to implement',
          isCorrect: false,
        },
        {
          id: 'd',
          text: 'Deploying application code to production servers',
          isCorrect: false,
        },
      ],
      explanation: {
        correct:
          'Evaluating work products is explicitly listed as a test objective in ISTQB syllabus section 1.1.1. Testers assess requirements, designs, code, and other artifacts to find defects early.',
        incorrect: {
          b: 'Budget management is a project management responsibility, not a test objective. Testing contributes to quality, which may affect budget indirectly.',
          c: 'Writing user stories is a requirement engineering activity performed by business analysts or product owners, not a testing activity.',
          d: 'Deployment is a release management or DevOps activity, not a test objective. Testing evaluates whether the system is ready for deployment.',
        },
      },
      learningObjective: 'FL-1.1.1 (K1) Identify typical test objectives',
      difficulty: 'easy',
      keywords: ['test objectives', 'evaluating work products'],
    },

    {
      id: 'q-1-1-2',
      type: 'single-choice',
      question:
        'Which of the following best describes the purpose of causing failures and finding defects as a test objective?',
      options: [
        {
          id: 'a',
          text: 'To reduce the risk level of inadequate software quality before release',
          isCorrect: true,
        },
        {
          id: 'b',
          text: 'To prove that the software has no remaining defects',
          isCorrect: false,
        },
        {
          id: 'c',
          text: 'To blame developers for writing poor code',
          isCorrect: false,
        },
        {
          id: 'd',
          text: 'To delay the project timeline until all bugs are fixed',
          isCorrect: false,
        },
      ],
      explanation: {
        correct:
          'Finding defects early reduces the risk of releasing low-quality software. This aligns with ISTQB section 1.1.1, which states that reducing risk is a key test objective.',
        incorrect: {
          b: 'Testing cannot prove the absence of defects (Testing Principle #1). Testing can only show that defects are present, not that they are absent.',
          c: 'Testing is a collaborative quality activity, not a blame game. The goal is to improve software quality, not assign fault.',
          d: 'Testing informs decisions about release readiness, but the goal is not to delay projects. Testing helps manage risk, not create delays.',
        },
      },
      learningObjective: 'FL-1.1.1 (K1) Identify typical test objectives',
      difficulty: 'easy',
      keywords: ['test objectives', 'defects', 'risk reduction'],
    },

    {
      id: 'q-1-1-3',
      type: 'single-choice',
      question:
        'A project team wants to verify whether specified requirements have been fulfilled. Which test objective does this represent?',
      options: [
        {
          id: 'a',
          text: 'Verifying whether specified requirements have been fulfilled',
          isCorrect: true,
        },
        {
          id: 'b',
          text: 'Building confidence in the quality of the test object',
          isCorrect: false,
        },
        {
          id: 'c',
          text: 'Providing information to stakeholders to allow them to make informed decisions',
          isCorrect: false,
        },
        {
          id: 'd',
          text: 'Ensuring required coverage of a test object',
          isCorrect: false,
        },
      ],
      explanation: {
        correct:
          'This is a direct match to the test objective listed in ISTQB section 1.1.1: "Verifying whether specified requirements have been fulfilled." This is validation testing.',
        incorrect: {
          b: 'While testing does build confidence, the question specifically asks about verifying requirements fulfillment, which is a more precise objective.',
          c: 'Providing information to stakeholders is another valid test objective, but the question specifically describes requirements verification.',
          d: 'Ensuring coverage is a test objective, but the scenario describes requirements verification, not coverage measurement.',
        },
      },
      learningObjective: 'FL-1.1.1 (K1) Identify typical test objectives',
      difficulty: 'easy',
      keywords: ['test objectives', 'requirements', 'verification'],
    },

    {
      id: 'q-1-1-4',
      type: 'single-choice',
      question:
        'Which of the following is a test objective related to compliance and regulations?',
      options: [
        {
          id: 'a',
          text: 'Verifying that a test object complies with contractual, legal, and regulatory requirements',
          isCorrect: true,
        },
        {
          id: 'b',
          text: 'Ensuring the test team follows the company coding standards',
          isCorrect: false,
        },
        {
          id: 'c',
          text: 'Validating that the test plan is approved by management',
          isCorrect: false,
        },
        {
          id: 'd',
          text: 'Confirming that developers write unit tests for all code',
          isCorrect: false,
        },
      ],
      explanation: {
        correct:
          'ISTQB section 1.1.1 explicitly lists compliance verification as a test objective. Many systems must meet legal, contractual, or regulatory requirements (e.g., GDPR, HIPAA, FDA).',
        incorrect: {
          b: 'Coding standards are enforced during development and code review, not as a test objective. Testers may check if code meets standards, but this is not the primary compliance objective.',
          c: 'Test plan approval is a test management activity, not a test objective related to product compliance.',
          d: 'Unit test creation is a development practice, not a test objective. While important, it is not related to regulatory compliance.',
        },
      },
      learningObjective: 'FL-1.1.1 (K1) Identify typical test objectives',
      difficulty: 'medium',
      keywords: ['test objectives', 'compliance', 'regulatory requirements'],
    },

    // FL-1.1.2 (K2) Differentiate testing from debugging
    {
      id: 'q-1-1-5',
      type: 'single-choice',
      question: 'What is the primary difference between testing and debugging?',
      options: [
        {
          id: 'a',
          text: 'Testing finds defects; debugging finds the cause of failures, analyzes them, and eliminates them',
          isCorrect: true,
        },
        {
          id: 'b',
          text: 'Testing is done by developers; debugging is done by testers',
          isCorrect: false,
        },
        {
          id: 'c',
          text: 'Testing is automated; debugging is always manual',
          isCorrect: false,
        },
        {
          id: 'd',
          text: 'Testing happens before deployment; debugging happens after deployment',
          isCorrect: false,
        },
      ],
      explanation: {
        correct:
          'ISTQB section 1.1.2 clearly distinguishes testing (finding defects via execution or static analysis) from debugging (reproducing, diagnosing, and fixing defects).',
        incorrect: {
          b: 'Both developers and testers perform testing. Debugging is typically done by developers, but testers may assist with reproduction and diagnosis.',
          c: 'Both testing and debugging can involve automated and manual techniques. Debugging tools exist (e.g., debuggers, profilers).',
          d: 'Testing occurs throughout the SDLC, not just before deployment. Debugging can occur at any time when failures are discovered.',
        },
      },
      learningObjective: 'FL-1.1.2 (K2) Differentiate testing from debugging',
      difficulty: 'easy',
      keywords: ['testing', 'debugging', 'defects', 'failures'],
    },

    {
      id: 'q-1-1-6',
      type: 'single-choice',
      question:
        'When dynamic testing triggers a failure, what is the typical debugging process?',
      options: [
        {
          id: 'a',
          text: 'Reproduction of the failure, diagnosis (finding the defect), and fixing the defect',
          isCorrect: true,
        },
        {
          id: 'b',
          text: 'Writing a test case, executing it, and logging the result',
          isCorrect: false,
        },
        {
          id: 'c',
          text: 'Running automated regression tests to verify the fix',
          isCorrect: false,
        },
        {
          id: 'd',
          text: 'Escalating the issue to the test manager for triage',
          isCorrect: false,
        },
      ],
      explanation: {
        correct:
          'ISTQB section 1.1.2 describes the debugging process: reproduction, diagnosis (finding the defect causing the failure), and fixing. Confirmation testing then verifies the fix.',
        incorrect: {
          b: 'This describes the testing process, not debugging. Testing creates and executes tests; debugging analyzes failures to find and fix causes.',
          c: 'Regression testing occurs after debugging is complete. It is confirmation testing, not part of the debugging process itself.',
          d: 'Escalation may occur for prioritization, but the debugging process involves technical investigation and fixing, not just escalation.',
        },
      },
      learningObjective: 'FL-1.1.2 (K2) Differentiate testing from debugging',
      difficulty: 'medium',
      keywords: ['debugging', 'failure', 'defect', 'reproduction', 'diagnosis'],
    },

    {
      id: 'q-1-1-7',
      type: 'single-choice',
      question: 'Can static testing directly find defects?',
      options: [
        {
          id: 'a',
          text: 'Yes, static testing directly finds defects without executing code',
          isCorrect: true,
        },
        {
          id: 'b',
          text: 'No, static testing can only find failures, not defects',
          isCorrect: false,
        },
        {
          id: 'c',
          text: 'No, static testing requires code execution to find defects',
          isCorrect: false,
        },
        {
          id: 'd',
          text: 'Yes, but only if the code is compiled first',
          isCorrect: false,
        },
      ],
      explanation: {
        correct:
          'ISTQB section 1.1.2 states that static testing directly finds defects (e.g., via code review or static analysis) without needing to reproduce or debug failures. There is no execution involved.',
        incorrect: {
          b: 'Failures require execution. Static testing finds defects directly by examining code, documents, or requirements without execution.',
          c: 'Static testing does NOT execute code. It uses techniques like reviews, inspections, and static analysis tools to find defects.',
          d: 'Static testing does not require compilation or execution. It analyzes source code, design documents, or requirements as-is.',
        },
      },
      learningObjective: 'FL-1.1.2 (K2) Differentiate testing from debugging',
      difficulty: 'medium',
      keywords: ['static testing', 'defects', 'dynamic testing'],
    },

    // ========================================
    // Section 1.2: Why is Testing Necessary?
    // ========================================

    // FL-1.2.1 (K2) Exemplify why testing is necessary
    {
      id: 'q-1-2-1',
      type: 'single-choice',
      question:
        'Why is testing necessary from a quality control perspective?',
      options: [
        {
          id: 'a',
          text: 'Testing provides a cost-effective means of detecting defects that can then be removed, contributing to higher quality test objects',
          isCorrect: true,
        },
        {
          id: 'b',
          text: 'Testing eliminates the need for code reviews and static analysis',
          isCorrect: false,
        },
        {
          id: 'c',
          text: 'Testing guarantees that the software will have zero defects in production',
          isCorrect: false,
        },
        {
          id: 'd',
          text: 'Testing replaces the need for quality assurance processes',
          isCorrect: false,
        },
      ],
      explanation: {
        correct:
          'ISTQB section 1.2.1 states that testing detects defects cost-effectively, allowing them to be removed to improve quality. This is a product-oriented, corrective approach.',
        incorrect: {
          b: 'Testing complements static testing (reviews, static analysis), not replaces it. Both dynamic and static testing are necessary.',
          c: 'Testing cannot guarantee zero defects (Testing Principle #1: Testing shows presence of defects, not absence). Testing reduces risk, not eliminates it.',
          d: 'Testing is a form of quality control, while QA is process-oriented. They are complementary, not mutually exclusive.',
        },
      },
      learningObjective: 'FL-1.2.1 (K2) Exemplify why testing is necessary',
      difficulty: 'easy',
      keywords: ['testing necessity', 'quality control', 'defects'],
    },

    {
      id: 'q-1-2-2',
      type: 'single-choice',
      question:
        'Testing provides users with indirect representation on the development project. Why is this important?',
      options: [
        {
          id: 'a',
          text: "Testers ensure that users' needs are considered throughout the development lifecycle, avoiding the high cost and impracticality of involving actual users directly",
          isCorrect: true,
        },
        {
          id: 'b',
          text: 'Users cannot be trusted to provide accurate requirements, so testers speak for them',
          isCorrect: false,
        },
        {
          id: 'c',
          text: 'Testers replace user acceptance testing entirely',
          isCorrect: false,
        },
        {
          id: 'd',
          text: 'Involving users directly would slow down the project too much',
          isCorrect: false,
        },
      ],
      explanation: {
        correct:
          'ISTQB section 1.2.1 explains that testers represent users indirectly because involving actual users throughout the SDLC is costly and often impractical. Testers advocate for user needs.',
        incorrect: {
          b: 'This is disrespectful and inaccurate. Users are the source of truth for requirements. Testers advocate for users, not replace them.',
          c: 'User acceptance testing (UAT) is critical and cannot be replaced. Testers support UAT but do not replace actual user validation.',
          d: 'While involving users constantly may be impractical, the reason for indirect representation is cost and availability, not just speed.',
        },
      },
      learningObjective: 'FL-1.2.1 (K2) Exemplify why testing is necessary',
      difficulty: 'medium',
      keywords: ['testing necessity', 'user representation', 'SDLC'],
    },

    {
      id: 'q-1-2-3',
      type: 'single-choice',
      question:
        'Which of the following is a reason why testing may be required?',
      options: [
        {
          id: 'a',
          text: 'To meet contractual, legal, or regulatory requirements',
          isCorrect: true,
        },
        {
          id: 'b',
          text: 'To prove that developers wrote perfect code',
          isCorrect: false,
        },
        {
          id: 'c',
          text: 'To ensure the project is completed on time',
          isCorrect: false,
        },
        {
          id: 'd',
          text: 'To avoid writing documentation',
          isCorrect: false,
        },
      ],
      explanation: {
        correct:
          'ISTQB section 1.2.1 states that testing may be required to comply with contracts, laws, or regulatory standards (e.g., FDA for medical devices, FAA for aviation software).',
        incorrect: {
          b: 'Testing cannot prove perfection. Testing shows the presence of defects, not their absence (Testing Principle #1).',
          c: 'Testing informs release decisions based on risk and quality, but project timelines are managed separately. Testing may reveal issues that affect timelines.',
          d: 'Testing and documentation serve different purposes. Testing does not replace the need for documentation; both are necessary.',
        },
      },
      learningObjective: 'FL-1.2.1 (K2) Exemplify why testing is necessary',
      difficulty: 'easy',
      keywords: ['testing necessity', 'compliance', 'regulatory requirements'],
    },

    // FL-1.2.2 (K1) Recall the relation between testing and quality assurance
    {
      id: 'q-1-2-4',
      type: 'single-choice',
      question: 'How do testing and Quality Assurance (QA) differ?',
      options: [
        {
          id: 'a',
          text: 'Testing is a product-oriented, corrective approach that finds defects; QA is a process-oriented, preventive approach that focuses on process improvement',
          isCorrect: true,
        },
        {
          id: 'b',
          text: 'Testing and QA are the same thing; the terms are interchangeable',
          isCorrect: false,
        },
        {
          id: 'c',
          text: 'Testing is done by QA engineers; QA is done by developers',
          isCorrect: false,
        },
        {
          id: 'd',
          text: 'Testing is automated; QA is always manual',
          isCorrect: false,
        },
      ],
      explanation: {
        correct:
          'ISTQB section 1.2.2 clearly distinguishes testing (product-oriented, corrective, finds defects) from QA (process-oriented, preventive, improves processes to prevent defects).',
        incorrect: {
          b: 'Testing and QA are NOT the same. They are complementary but distinct. Testing focuses on products; QA focuses on processes.',
          c: 'Roles vary by organization. Both testing and QA can be performed by various team members. The distinction is not about who does them, but what they focus on.',
          d: 'Both testing and QA can use automated and manual techniques. The distinction is not about automation, but about focus (product vs. process).',
        },
      },
      learningObjective:
        'FL-1.2.2 (K1) Recall the relation between testing and quality assurance',
      difficulty: 'easy',
      keywords: ['testing', 'quality assurance', 'QA', 'product', 'process'],
    },

    {
      id: 'q-1-2-5',
      type: 'single-choice',
      question:
        'Which of the following best describes the goal of Quality Assurance (QA)?',
      options: [
        {
          id: 'a',
          text: 'QA focuses on ensuring that good processes are followed correctly, preventing defects from being introduced',
          isCorrect: true,
        },
        {
          id: 'b',
          text: 'QA focuses on finding as many defects as possible in the test object',
          isCorrect: false,
        },
        {
          id: 'c',
          text: 'QA focuses on automating all test cases to reduce manual effort',
          isCorrect: false,
        },
        {
          id: 'd',
          text: 'QA focuses on writing comprehensive test documentation',
          isCorrect: false,
        },
      ],
      explanation: {
        correct:
          'ISTQB section 1.2.2 explains that QA is process-oriented and preventive. It ensures that proper processes (like model checking, proof of correctness, simulation) are followed to prevent defects.',
        incorrect: {
          b: 'This describes testing, not QA. Testing finds defects in products; QA improves processes to prevent defects from being introduced.',
          c: 'Test automation is a testing activity, not a QA process focus. QA is about process adherence and improvement, not automation.',
          d: 'Documentation is important for both testing and QA, but the core goal of QA is process improvement, not documentation creation.',
        },
      },
      learningObjective:
        'FL-1.2.2 (K1) Recall the relation between testing and quality assurance',
      difficulty: 'medium',
      keywords: ['quality assurance', 'QA', 'process', 'preventive'],
    },

    {
      id: 'q-1-2-6',
      type: 'single-choice',
      question:
        'Test results are used by both QA and testing. How do they use test results differently?',
      options: [
        {
          id: 'a',
          text: 'In testing, results are used to fix defects; in QA, results provide feedback on how well development and test processes are performing',
          isCorrect: true,
        },
        {
          id: 'b',
          text: 'In testing, results are ignored; in QA, results are analyzed in detail',
          isCorrect: false,
        },
        {
          id: 'c',
          text: 'In testing, results are used for process improvement; in QA, results are used to find bugs',
          isCorrect: false,
        },
        {
          id: 'd',
          text: 'Both testing and QA use results identically with no difference',
          isCorrect: false,
        },
      ],
      explanation: {
        correct:
          'ISTQB section 1.2.2 states that testing uses results to fix defects (product focus), while QA uses results to evaluate and improve processes (process focus).',
        incorrect: {
          b: 'Testing results are never ignored. Testers analyze results to find defects. This option is incorrect.',
          c: 'This is backward. Testing fixes defects in products; QA improves processes to prevent future defects.',
          d: 'Testing and QA use test results differently: testing for product correction, QA for process improvement.',
        },
      },
      learningObjective:
        'FL-1.2.2 (K1) Recall the relation between testing and quality assurance',
      difficulty: 'medium',
      keywords: ['testing', 'QA', 'test results', 'process improvement'],
    },

    // FL-1.2.3 (K2) Distinguish between root cause, error, defect, and failure
    {
      id: 'q-1-2-7',
      type: 'single-choice',
      question:
        'A programmer is under time pressure and accidentally writes incorrect code. What does this represent in the error-defect-failure chain?',
      options: [
        {
          id: 'a',
          text: 'An error (human mistake) that may introduce a defect in the code',
          isCorrect: true,
        },
        {
          id: 'b',
          text: 'A defect in the code that has been executed',
          isCorrect: false,
        },
        {
          id: 'c',
          text: 'A failure observed during testing',
          isCorrect: false,
        },
        {
          id: 'd',
          text: 'A root cause that needs to be identified through root cause analysis',
          isCorrect: false,
        },
      ],
      explanation: {
        correct:
          'ISTQB section 1.2.3 defines an error as a human mistake. Humans make errors for various reasons (time pressure, complexity, fatigue), which introduce defects into work products.',
        incorrect: {
          b: 'A defect is the result of the error (the incorrect code itself), not the human mistake. The human mistake is the error; the incorrect code is the defect.',
          c: 'A failure occurs when a defect in code is executed and causes the system to behave incorrectly. The scenario describes the error, not the failure.',
          d: 'The root cause is the fundamental reason for the error (e.g., time pressure, lack of training). Root cause analysis identifies why the error occurred.',
        },
      },
      learningObjective:
        'FL-1.2.3 (K2) Distinguish between root cause, error, defect, and failure',
      difficulty: 'easy',
      keywords: ['error', 'defect', 'human mistake'],
    },

    {
      id: 'q-1-2-8',
      type: 'single-choice',
      question:
        'A defect exists in a requirement specification where a field is incorrectly defined. What is this called?',
      options: [
        {
          id: 'a',
          text: 'A defect in a work product (requirements documentation)',
          isCorrect: true,
        },
        {
          id: 'b',
          text: 'A failure, because the requirement is wrong',
          isCorrect: false,
        },
        {
          id: 'c',
          text: 'An error, because someone made a mistake',
          isCorrect: false,
        },
        {
          id: 'd',
          text: 'A root cause that needs to be addressed',
          isCorrect: false,
        },
      ],
      explanation: {
        correct:
          'ISTQB section 1.2.3 states that defects can exist in code OR in supporting work products like requirements, build files, or documentation. This is a defect in a requirement.',
        incorrect: {
          b: 'A failure occurs when a defect in code is executed and causes incorrect behavior. Requirements are not executed; they contain defects that may lead to code defects later.',
          c: 'The error is the human mistake that introduced the defect. The incorrect requirement itself is the defect, not the error.',
          d: 'The root cause is the underlying reason the defect was introduced (e.g., lack of domain knowledge). The defect itself is not the root cause.',
        },
      },
      learningObjective:
        'FL-1.2.3 (K2) Distinguish between root cause, error, defect, and failure',
      difficulty: 'medium',
      keywords: ['defect', 'work products', 'requirements'],
    },

    {
      id: 'q-1-2-9',
      type: 'single-choice',
      question:
        'When does a defect in code result in a failure?',
      options: [
        {
          id: 'a',
          text: 'When the system executes the defect and fails to do what it should (or does something it should not)',
          isCorrect: true,
        },
        {
          id: 'b',
          text: 'As soon as the defect is written into the code',
          isCorrect: false,
        },
        {
          id: 'c',
          text: 'Only when the code is deployed to production',
          isCorrect: false,
        },
        {
          id: 'd',
          text: 'When a tester writes a test case that detects the defect',
          isCorrect: false,
        },
      ],
      explanation: {
        correct:
          'ISTQB section 1.2.3 states that a failure occurs when the system executes a defect, causing incorrect behavior. Not all defects cause failures (some may never be executed).',
        incorrect: {
          b: 'A defect does not cause a failure until it is executed. Defects can exist in code without ever being executed (e.g., dead code, unexecuted branches).',
          c: 'Failures can occur in any environment (development, testing, production). Deployment is not a prerequisite for failure.',
          d: 'Writing a test case does not cause a failure. Executing the test case and triggering the defect causes the failure.',
        },
      },
      learningObjective:
        'FL-1.2.3 (K2) Distinguish between root cause, error, defect, and failure',
      difficulty: 'medium',
      keywords: ['defect', 'failure', 'execution'],
    },

    {
      id: 'q-1-2-10',
      type: 'single-choice',
      question:
        'Not all defects result in failures. Which of the following scenarios demonstrates a defect that does NOT cause a failure?',
      options: [
        {
          id: 'a',
          text: 'A defect exists in code that is never executed during testing or production use',
          isCorrect: true,
        },
        {
          id: 'b',
          text: 'A defect is executed but is caught by exception handling, preventing incorrect behavior',
          isCorrect: false,
        },
        {
          id: 'c',
          text: 'A defect is documented in a requirements specification but not yet implemented in code',
          isCorrect: false,
        },
        {
          id: 'd',
          text: 'A defect is found during static testing (code review)',
          isCorrect: false,
        },
      ],
      explanation: {
        correct:
          'ISTQB section 1.2.3 explains that failures only occur when defects are executed. If a defect is in dead code or an unexecuted path, it will not cause a failure.',
        incorrect: {
          b: 'This describes defensive programming. While exception handling may prevent a crash, the defect still exists. Whether this counts as a "failure" depends on the definition (incorrect behavior may still occur).',
          c: 'This is a defect in a work product (requirements), not in code. It may not cause a code defect if caught during review.',
          d: 'Static testing finds defects directly without execution. This is a defect found before it can cause a failure, but the question asks for a defect that does NOT cause a failure due to non-execution.',
        },
      },
      learningObjective:
        'FL-1.2.3 (K2) Distinguish between root cause, error, defect, and failure',
      difficulty: 'hard',
      keywords: ['defect', 'failure', 'execution', 'dead code'],
    },

    {
      id: 'q-1-2-11',
      type: 'single-choice',
      question:
        'What is a root cause in the context of software defects?',
      options: [
        {
          id: 'a',
          text: 'A fundamental reason for the occurrence of a problem (error), identified through root cause analysis',
          isCorrect: true,
        },
        {
          id: 'b',
          text: 'The first defect found in a test cycle',
          isCorrect: false,
        },
        {
          id: 'c',
          text: 'The most severe failure observed during testing',
          isCorrect: false,
        },
        {
          id: 'd',
          text: 'The error made by a developer when writing code',
          isCorrect: false,
        },
      ],
      explanation: {
        correct:
          'ISTQB section 1.2.3 defines a root cause as a fundamental reason for the occurrence of a problem (e.g., lack of training, time pressure, poor process). Root cause analysis identifies these underlying issues.',
        incorrect: {
          b: 'The order in which defects are found is not related to root cause. Root cause is the underlying reason a defect was introduced.',
          c: 'Severity is a defect attribute, not the root cause. Root cause is the reason the defect was introduced, not how bad its impact is.',
          d: 'The error is the human mistake. The root cause is the reason the error occurred (e.g., inadequate training, unclear requirements, fatigue).',
        },
      },
      learningObjective:
        'FL-1.2.3 (K2) Distinguish between root cause, error, defect, and failure',
      difficulty: 'easy',
      keywords: ['root cause', 'root cause analysis', 'error'],
    },

    {
      id: 'q-1-2-12',
      type: 'single-choice',
      question:
        'Failures can also be caused by environmental conditions. Which of the following is an example of an environmentally-caused failure?',
      options: [
        {
          id: 'a',
          text: 'Radiation causing memory corruption, or a strong magnetic field causing storage defects',
          isCorrect: true,
        },
        {
          id: 'b',
          text: 'A developer writing incorrect code due to time pressure',
          isCorrect: false,
        },
        {
          id: 'c',
          text: 'A tester executing a test case that triggers a defect',
          isCorrect: false,
        },
        {
          id: 'd',
          text: 'A code review finding a defect before execution',
          isCorrect: false,
        },
      ],
      explanation: {
        correct:
          'ISTQB section 1.2.3 states that failures can be caused by environmental conditions like radiation or magnetic fields, not just by defects in code.',
        incorrect: {
          b: 'This is an error (human mistake) that introduces a defect, not an environmental condition. Environmental conditions are external factors.',
          c: 'Executing a test case triggers a defect, causing a failure, but this is not an environmental condition. It is a testing activity.',
          d: 'Code review finds defects before execution, preventing failures. This is not an environmental condition.',
        },
      },
      learningObjective:
        'FL-1.2.3 (K2) Distinguish between root cause, error, defect, and failure',
      difficulty: 'medium',
      keywords: ['failure', 'environmental conditions', 'radiation'],
    },
  ],
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2026-01-03'),
};

/**
 * Export all Chapter 1 quizzes
 * (Future: Add quizzes for sections 1.4 and 1.5 when provided)
 */
export const CHAPTER_1_QUIZZES = [CHAPTER_1_QUIZ_FUNDAMENTALS];

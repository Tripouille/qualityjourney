/**
 * ISTQB Chapter 1: Fundamentals of Testing - Learning Objectives Data
 *
 * NEW ARCHITECTURE: Learning Objective as atomic unit
 *
 * This file contains all 14 Learning Objectives for Chapter 1.
 * Each LO has its own content, quiz, and progress tracking.
 *
 * Structure: Course → Chapter → Section (UI grouping) → Learning Objective (atomic)
 */

import type { LearningObjective } from '@/domain/entities/learning-objective';

/**
 * FL-1.1.1 (K1): Identify typical test objectives
 *
 * Section 1.1: What is Testing?
 * Estimated time: 3 min read + 2 min quiz = 5 min total
 */
export const FL_1_1_1: LearningObjective = {
  id: 'FL-1.1.1',
  courseId: 'istqb-foundation-v4',
  chapterId: 'chapter-1',
  sectionId: '1.1',

  title: 'Identify typical test objectives',
  kLevel: 'K1',
  description:
    'Learn the various objectives of software testing, from finding defects to building stakeholder confidence.',

  contentBlocks: [
    {
      id: 'fl-1.1.1-intro',
      type: 'text',
      content: `# Why Do We Test Software?

Before we can understand how to test effectively, we need to know **why** we test. Testing is not just about "finding bugs" - it serves multiple strategic purposes that help organizations deliver quality software.

Imagine you're about to board a plane. You trust that it will fly safely because extensive testing has been done - not just on the engine, but on emergency systems, navigation, fuel efficiency, and passenger safety. Software testing follows the same principle: **we test for many reasons, not just one**.`,
    },

    {
      id: 'fl-1.1.1-definition',
      type: 'definition',
      term: 'Test Objective',
      definition:
        'The reason or purpose for designing and executing a test. Different contexts require different test objectives.',
      isISTQBKeyword: true,
    },

    {
      id: 'fl-1.1.1-objectives',
      type: 'text',
      content: `## The 9 Typical Test Objectives

According to ISTQB, testing can serve **any of these objectives** (not just finding defects):

### 1. Evaluating Work Products
- Review requirements, user stories, designs, and code
- **Example:** A tester reviews API documentation before coding starts to catch unclear requirements early

### 2. Triggering Failures and Finding Defects
- Execute tests to make latent defects visible
- **Example:** Testing an e-commerce checkout with invalid credit cards to find input validation bugs

### 3. Ensuring Required Coverage
- Verify that all requirements are tested
- **Example:** Using a traceability matrix to confirm every user story has at least 3 test cases

### 4. Reducing Risk
- Identify and mitigate risks of inadequate software quality
- **Example:** Extra security testing for payment features to prevent data breaches

### 5. Verifying Requirements
- Confirm that specified requirements are fulfilled
- **Example:** Testing that a "Forgot Password" feature sends emails within 2 minutes (per requirements)

### 6. Verifying Compliance
- Ensure software meets contractual, legal, and regulatory requirements
- **Example:** Testing that a medical app complies with HIPAA data privacy regulations

### 7. Providing Information
- Give stakeholders data to make informed decisions
- **Example:** Reporting that 95% of critical features are passing, so release can proceed

### 8. Building Confidence
- Demonstrate that the software works as stakeholders expect
- **Example:** Running a demo with real data to show executives the new dashboard works

### 9. Validating Completeness
- Verify the test object is complete and works as expected
- **Example:** User acceptance testing to confirm the software solves the actual business problem`,
    },

    {
      id: 'fl-1.1.1-scenario',
      type: 'scenario',
      title: 'Real-World Application: Banking Mobile App Release',
      context:
        'A bank is releasing a new mobile app for customer transactions. The test team has only 2 weeks before launch.',
      situation: `The Test Manager defines **multiple test objectives** for this release:

**Primary Objective (Risk Reduction):**
- Focus 60% of effort on money transfer features (highest risk)
- Test with real-world transaction amounts and edge cases

**Secondary Objective (Compliance):**
- Verify PCI-DSS compliance for credit card data handling
- Test encryption and secure storage requirements

**Tertiary Objective (Building Confidence):**
- Conduct stakeholder demos showing successful transactions
- Report test results daily to give executives visibility

**Not the Primary Objective:**
- Finding every possible defect is unrealistic with 2 weeks
- Instead, prioritize critical functionality and known risk areas`,
      analysis:
        'This scenario shows that **test objectives change based on context**. For a banking app, reducing financial risk and ensuring compliance are more important than achieving 100% code coverage. Good testers adapt their objectives to project constraints.',
    },

    {
      id: 'fl-1.1.1-infobox',
      type: 'infobox',
      variant: 'exam-tip',
      title: 'Exam Tip: Objectives vs Activities',
      content: `The ISTQB exam often asks you to distinguish between:
- **Test Objectives:** Why we test (the goals) - covered in this learning objective
- **Test Activities:** What we do during testing (planning, design, execution, reporting) - covered in FL-1.4.1

**Remember:** Objectives are the "why", activities are the "how".`,
    },

    {
      id: 'fl-1.1.1-key-takeaways',
      type: 'infobox',
      variant: 'info',
      title: 'Key Takeaways',
      content: `✓ Testing has **9 typical objectives** - not just finding defects
✓ Objectives vary based on **project context** (risk, timeline, regulations)
✓ Multiple objectives can apply to a single project
✓ The ISTQB exam expects you to **recognize** these 9 objectives (K1 level)`,
    },
  ],

  keywords: [
    'test objective',
    'defect',
    'risk',
    'coverage',
    'compliance',
    'requirements',
    'stakeholder',
    'confidence',
  ],

  estimatedReadingTime: 3,
  estimatedQuizTime: 2,

  order: 1, // First LO in entire course
  previousLearningObjectiveId: null, // No previous LO
  nextLearningObjectiveId: 'FL-1.1.2', // Next is FL-1.1.2

  createdAt: new Date('2026-01-04'),
  updatedAt: new Date('2026-01-04'),
};

/**
 * FL-1.1.2 (K2): Differentiate testing from debugging
 *
 * Section 1.1: What is Testing?
 * Estimated time: 4 min read + 2 min quiz = 6 min total
 */
export const FL_1_1_2: LearningObjective = {
  id: 'FL-1.1.2',
  courseId: 'istqb-foundation-v4',
  chapterId: 'chapter-1',
  sectionId: '1.1',

  title: 'Differentiate testing from debugging',
  kLevel: 'K2',
  description:
    'Understand the critical difference between testing (finding failures) and debugging (fixing defects), and how they work together in the development lifecycle.',

  contentBlocks: [
    {
      id: 'fl-1.1.2-intro',
      type: 'text',
      content: `# Testing vs Debugging: Two Sides of Quality

You discover that a login feature crashes when users enter special characters in their password. What happens next involves **two distinct activities**:

1. **Testing:** You documented the crash (you found the failure)
2. **Debugging:** A developer investigates the code and fixes the root cause

These are fundamentally different processes, performed by different roles, with different goals. Let's understand why this distinction matters.`,
    },

    {
      id: 'fl-1.1.2-testing-definition',
      type: 'definition',
      term: 'Testing',
      definition:
        'The process of executing a system to find defects and evaluate quality. Testing can trigger failures that are caused by defects in the software.',
      isISTQBKeyword: true,
    },

    {
      id: 'fl-1.1.2-debugging-definition',
      type: 'definition',
      term: 'Debugging',
      definition:
        'The development activity that finds, analyzes, and removes the cause of a failure. Debugging includes locating and fixing defects.',
      isISTQBKeyword: true,
    },

    {
      id: 'fl-1.1.2-comparison',
      type: 'text',
      content: `## Testing vs Debugging: Key Differences

| Aspect | Testing | Debugging |
|--------|---------|-----------|
| **Goal** | Find failures / Evaluate quality | Fix defects / Remove root causes |
| **Performed by** | Testers (usually) | Developers (usually) |
| **When** | Throughout SDLC | After a failure is found |
| **Result** | Defect reports | Fixed code |
| **Focus** | "Does it work as expected?" | "Why doesn't it work?" |
| **Success** | Finding important failures | Eliminating defects |

### Testing Shows THAT Failures Exist
When you run a test and it fails, you've discovered **that** something is wrong. You document:
- Steps to reproduce
- Expected vs actual results
- Screenshots, logs, environment details

### Debugging Explains WHY Failures Occur
When a developer debugs, they investigate **why** the failure happened:
- Set breakpoints in code
- Inspect variable values
- Trace execution flow
- Identify the root cause (the defect)
- Implement a fix`,
    },

    {
      id: 'fl-1.1.2-workflow',
      type: 'mermaid',
      diagram: `flowchart LR
    A[Tester Executes Test] --> B{Test Passes?}
    B -->|No| C[Failure Detected]
    C --> D[Tester Reports Defect]
    D --> E[Developer Starts Debugging]
    E --> F[Analyze Code]
    F --> G[Find Root Cause]
    G --> H[Fix Defect]
    H --> I[Tester Retests - Confirmation Testing]
    I --> B
    B -->|Yes| J[Test Complete]`,
      caption: 'The Testing-Debugging Cycle: How testers and developers collaborate',
    },

    {
      id: 'fl-1.1.2-scenario',
      type: 'scenario',
      title: 'Real-World Example: E-Commerce Cart Bug',
      context:
        'An e-commerce site has a shopping cart feature. A tester is validating checkout functionality.',
      situation: `**Testing Phase (Tester's Role):**
1. Tester adds 3 items to cart
2. Tester applies a 20% discount code
3. Tester proceeds to checkout
4. **FAILURE:** Total shows $0.00 instead of discounted price
5. Tester logs defect: "Discount code causes cart total to display as $0"

**Debugging Phase (Developer's Role):**
1. Developer reproduces the issue locally
2. Developer sets breakpoint in discount calculation code
3. Developer discovers: \`cartTotal = cartTotal - (discount * 100)\` ← **Bug found!**
4. Should be: \`cartTotal = cartTotal - (discount * cartTotal)\`
5. Developer fixes code and runs unit tests
6. Developer marks defect as "Fixed - Ready for Retest"

**Confirmation Testing (Tester's Role):**
1. Tester retests with same steps
2. Tester verifies total now shows correct discounted amount
3. Tester closes defect as "Verified Fixed"`,
      analysis:
        'This scenario illustrates the collaboration between testing and debugging. The tester **found** the failure but did not fix it. The developer **fixed** the defect but did not verify it in the full system. Both roles are essential.',
    },

    {
      id: 'fl-1.1.2-common-mistake',
      type: 'infobox',
      variant: 'warning',
      title: 'Common Mistake: Role Confusion',
      content: `**Mistake:** Testers should not debug code (locate and fix defects in source code).
**Why it's wrong:** Testers often lack access to code or debugging tools, and their value is in independent quality verification.

**Mistake:** Developers should not skip testing after debugging.
**Why it's wrong:** Developers may only test the specific scenario they fixed, missing side effects or related issues.

**Best Practice:** Clear separation of concerns - testers find failures, developers fix defects, testers verify fixes.`,
    },

    {
      id: 'fl-1.1.2-exam-tip',
      type: 'infobox',
      variant: 'exam-tip',
      title: 'Exam Tip: Keywords to Watch',
      content: `The exam may ask: "What is the primary difference between testing and debugging?"

**Correct answer:** Testing aims to **find failures**, debugging aims to **find and fix the root cause** of failures.

**Wrong answers to avoid:**
- "Testers test, developers debug" (true but not the primary difference)
- "Testing is manual, debugging is automated" (both can be manual or automated)
- "Testing is easier than debugging" (subjective and irrelevant)`,
    },

    {
      id: 'fl-1.1.2-key-takeaways',
      type: 'infobox',
      variant: 'info',
      title: 'Key Takeaways',
      content: `✓ **Testing** finds failures by executing tests (tester's role)
✓ **Debugging** finds and fixes the root cause of failures (developer's role)
✓ Both activities are essential and complementary
✓ After debugging, **confirmation testing** is required to verify the fix`,
    },
  ],

  keywords: ['testing', 'debugging', 'defect', 'failure', 'root cause', 'confirmation testing'],

  estimatedReadingTime: 4,
  estimatedQuizTime: 2,

  order: 2,
  previousLearningObjectiveId: 'FL-1.1.1',
  nextLearningObjectiveId: 'FL-1.2.1', // Section 1.2 starts here

  createdAt: new Date('2026-01-04'),
  updatedAt: new Date('2026-01-04'),
};

/**
 * Export all Chapter 1 Learning Objectives
 * (Only FL-1.1.1 and FL-1.1.2 implemented so far)
 */
export const CHAPTER_1_LEARNING_OBJECTIVES: LearningObjective[] = [FL_1_1_1, FL_1_1_2];

/**
 * Helper function to get a Learning Objective by ID
 */
export function getLearningObjective(id: string): LearningObjective | undefined {
  return CHAPTER_1_LEARNING_OBJECTIVES.find((lo) => lo.id === id);
}

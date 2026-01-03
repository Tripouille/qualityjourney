# Create ISTQB Quiz Questions

## Question Quality Standards

This guide ensures every quiz question meets ISTQB certification standards and pedagogical best practices.

---

## Core Principles

### 1. Exhaustive Coverage (Non-Negotiable)

- **Every Learning Objective gets a question** (FL-1.1.1, FL-1.1.2, etc.)
- **Every keyword in the syllabus is tested**
- If a section has 20 key concepts, create 20 questions
- No arbitrary limits (e.g., "5 questions per section")

### 2. K-Level Alignment (Critical)

Questions MUST match the cognitive level of the Learning Objective:

- **K1 (Remember):** Recall definitions, recognize keywords
- **K2 (Understand):** Differentiate, classify, summarize, exemplify
- **K3 (Apply):** Apply knowledge to scenarios, solve problems

### 3. ISTQB Exam Fidelity

- Use exact ISTQB terminology (e.g., "test object" not "thing being tested")
- Reference syllabus sections in explanations
- Mimic real exam question structure
- All options must be plausible (no joke answers)

---

## Question Anatomy

```typescript
{
  id: 'q-1-1-1',                    // Format: q-{chapter}-{section}-{number}
  type: 'single-choice',            // single-choice | multiple-choice | true-false
  question: 'Which of the following is a typical test objective?',
  options: [
    {
      id: 'a',
      text: 'Evaluating work products such as requirements and code',
      isCorrect: true,
    },
    {
      id: 'b',
      text: 'Ensuring the project stays within budget',
      isCorrect: false,
    },
    {
      id: 'c',
      text: 'Writing user stories for the development team',
      isCorrect: false,
    },
    {
      id: 'd',
      text: 'Deploying code to production servers',
      isCorrect: false,
    },
  ],
  explanation: {
    correct: 'Evaluating work products is explicitly listed as a test objective in the ISTQB syllabus (section 1.1.1).',
    incorrect: {
      b: 'Budget management is a project management concern, not a test objective.',
      c: 'Writing user stories is a requirement gathering activity, not testing.',
      d: 'Deployment is a release management activity, not a test objective.',
    },
  },
  learningObjective: 'FL-1.1.1',    // Reference to ISTQB LO
  kLevel: 'K1',                      // K1 | K2 | K3
  difficulty: 'easy',                // easy | medium | hard
}
```

---

## K1 Questions (Remember)

**Capability:** Recall definitions, recognize keywords

### Good K1 Question

```typescript
{
  question: "What is a test objective?",
  kLevel: "K1",
  options: [
    {
      id: "a",
      text: "A reason or purpose for designing and executing a test",
      isCorrect: true
    },
    {
      id: "b",
      text: "A document describing test cases",
      isCorrect: false
    },
    {
      id: "c",
      text: "A tool for automated testing",
      isCorrect: false
    },
    {
      id: "d",
      text: "A metric for measuring test coverage",
      isCorrect: false
    }
  ],
  explanation: {
    correct: "The ISTQB syllabus defines a test objective as 'a reason or purpose for designing and executing a test' (section 1.1.1).",
    incorrect: {
      b: "This describes a test specification document, not a test objective.",
      c: "This describes a test automation framework, not a test objective.",
      d: "This describes a test metric, not a test objective."
    }
  }
}
```

### Bad K1 Question (Avoid)

```typescript
// ❌ TOO VAGUE
{
  question: "What is testing?",
  options: [
    { text: "Finding bugs", isCorrect: true },
    { text: "Writing code", isCorrect: false }
  ]
}

// ❌ REQUIRES K2 UNDERSTANDING (not K1 recall)
{
  question: "Which of the following BEST describes a test objective?",
  // This requires differentiation, not recall
}
```

---

## K2 Questions (Understand)

**Capability:** Differentiate, classify, summarize, exemplify

### Good K2 Question

```typescript
{
  question: "Which of the following differentiates testing from debugging?",
  kLevel: "K2",
  options: [
    {
      id: "a",
      text: "Testing finds defects; debugging finds causes and fixes them",
      isCorrect: true
    },
    {
      id: "b",
      text: "Testing is done by developers; debugging by testers",
      isCorrect: false
    },
    {
      id: "c",
      text: "Testing is automated; debugging is manual",
      isCorrect: false
    },
    {
      id: "d",
      text: "Testing happens before deployment; debugging after",
      isCorrect: false
    }
  ],
  explanation: {
    correct: "The ISTQB syllabus clearly differentiates: testing identifies defects, debugging locates their cause and fixes them (section 1.1.2).",
    incorrect: {
      b: "Both testers and developers can perform testing and debugging.",
      c: "Both activities can be automated or manual.",
      d: "Both can happen throughout the development lifecycle."
    }
  }
}
```

### K2 Question Patterns

- "Which of the following BEST exemplifies..."
- "Which of the following differentiates X from Y..."
- "Classify the following as..."
- "Which statement summarizes..."

---

## K3 Questions (Apply)

**Capability:** Apply knowledge to scenarios, solve problems

### Good K3 Question

```typescript
{
  question: "Given a project with strict regulatory requirements for medical devices, which test objective is MOST critical?",
  kLevel: "K3",
  options: [
    {
      id: "a",
      text: "Verifying compliance with legal and regulatory requirements",
      isCorrect: true
    },
    {
      id: "b",
      text: "Reducing development costs",
      isCorrect: false
    },
    {
      id: "c",
      text: "Improving team velocity",
      isCorrect: false
    },
    {
      id: "d",
      text: "Automating all test cases",
      isCorrect: false
    }
  ],
  explanation: {
    correct: "For medical devices, regulatory compliance is paramount (ISTQB section 1.1.1 lists 'verify compliance' as a test objective). Failure to comply can prevent product release.",
    incorrect: {
      b: "While important, cost reduction is secondary to regulatory compliance in this context.",
      c: "Team velocity is not a test objective and is irrelevant to regulatory compliance.",
      d: "Automation is a means, not an objective, and doesn't address the regulatory requirement."
    }
  }
}
```

### K3 Question Patterns

- "Given [scenario], which approach is MOST appropriate..."
- "In the context of [situation], identify the correct..."
- "A tester is asked to [task]. Which technique should they use..."

---

## Distractor Quality (Wrong Answers)

### Good Distractors

Distractors must:
1. **Be plausible** - Sound correct to someone who hasn't studied
2. **Target misconceptions** - Address common errors in thinking
3. **Use similar terminology** - Maintain consistency with correct answer
4. **Be clearly wrong** - No ambiguity for someone who knows the material

### Example

```typescript
// Correct answer
"Testing cannot prove the absence of defects"

// Good distractors (plausible but wrong)
"Testing can prove the absence of defects with sufficient coverage"
"Testing eliminates all defects when done thoroughly"
"Comprehensive testing guarantees defect-free software"

// Bad distractors (obviously wrong)
"Testing makes software worse"
"Bugs are good for users"
```

---

## Explanation Quality

### Correct Answer Explanation

Must include:
1. **Why it's correct** (clear justification)
2. **Syllabus reference** (e.g., "section 1.1.1")
3. **Key terminology** (reinforce learning)

```typescript
correct: "Evaluating work products is explicitly listed as a test objective in the ISTQB syllabus (section 1.1.1). This includes reviewing requirements, designs, and code."
```

### Incorrect Answer Explanations

Must include:
1. **Why it's wrong** (clear reasoning)
2. **What it actually represents** (if applicable)
3. **Correction** (point to right concept)

```typescript
incorrect: {
  b: "Budget management is a project management concern, not a test objective. Test objectives focus on quality, not cost."
}
```

---

## Question Creation Workflow

### Step 1: Identify Learning Objective

From ISTQB syllabus:
- **FL-1.1.1 (K1):** Identify typical test objectives
- Extract the K-Level (K1, K2, K3)
- Understand the capability required

### Step 2: Draft Question Stem

```typescript
// K1: Direct recall
"What is a test objective?"

// K2: Comparison/differentiation
"Which of the following differentiates testing from debugging?"

// K3: Scenario-based application
"Given a project with [constraint], which test objective is MOST critical?"
```

### Step 3: Create Correct Answer

- Use exact ISTQB terminology
- Make it unambiguous
- Reference syllabus definition

### Step 4: Create 3 Distractors

- Target common misconceptions
- Make them plausible
- Ensure they're clearly wrong to someone who studied

### Step 5: Write Explanations

- Explain why correct answer is right
- Explain why each distractor is wrong
- Reference syllabus section

### Step 6: Validate

- [ ] K-Level matches Learning Objective
- [ ] Uses exact ISTQB terminology
- [ ] All options are plausible
- [ ] Correct answer is unambiguous
- [ ] Distractors target misconceptions
- [ ] Explanations reference syllabus
- [ ] No trivial or joke answers

---

## Common Mistakes to Avoid

### ❌ Mistake 1: Ambiguous Questions

```typescript
// BAD
"Which is best for testing?"
// Options: Manual, Automated, Both, Neither
```

### ❌ Mistake 2: All Options Correct

```typescript
// BAD
"Which is a test objective?"
// All 4 options are valid test objectives
```

### ❌ Mistake 3: Trivial Distractors

```typescript
// BAD
{
  question: "What is debugging?",
  options: [
    "Finding and fixing defects",  // Correct
    "Making pizza",                // Trivial
    "Dancing",                     // Trivial
    "Flying"                       // Trivial
  ]
}
```

### ❌ Mistake 4: No Syllabus Reference

```typescript
// BAD
explanation: {
  correct: "Because it's right."  // No justification or reference
}
```

---

## Checklist Before Adding Question

- [ ] Learning Objective identified (e.g., FL-1.1.1)
- [ ] K-Level matches LO (K1/K2/K3)
- [ ] Question type appropriate for K-Level
- [ ] ISTQB terminology used exactly
- [ ] 4 options provided (1 correct, 3 distractors)
- [ ] All distractors are plausible
- [ ] Correct explanation references syllabus section
- [ ] All incorrect explanations explain why they're wrong
- [ ] No ambiguity in correct answer
- [ ] No trivial or joke answers
- [ ] Difficulty level assigned (easy/medium/hard)

---

## Example: Complete Question

```typescript
{
  id: 'q-1-1-2',
  type: 'single-choice',
  question: 'Which of the following BEST differentiates testing from debugging?',
  options: [
    {
      id: 'a',
      text: 'Testing identifies defects; debugging finds their root causes and fixes them',
      isCorrect: true,
    },
    {
      id: 'b',
      text: 'Testing is performed by testers; debugging is performed by developers',
      isCorrect: false,
    },
    {
      id: 'c',
      text: 'Testing uses automated tools; debugging is always manual',
      isCorrect: false,
    },
    {
      id: 'd',
      text: 'Testing occurs before release; debugging occurs after release',
      isCorrect: false,
    },
  ],
  explanation: {
    correct: 'According to ISTQB (section 1.1.2), testing is the process of identifying defects, while debugging is the development activity that finds the root cause and fixes defects. These are distinct but complementary activities.',
    incorrect: {
      b: 'While developers often debug, both testers and developers can perform testing. The distinction is in the activity, not who performs it.',
      c: 'Both testing and debugging can be automated or manual. The distinction is in the purpose, not the tooling.',
      d: 'Both testing and debugging occur throughout the development lifecycle, not just at specific phases.',
    },
  },
  learningObjective: 'FL-1.1.2',
  kLevel: 'K2',
  difficulty: 'easy',
}
```

---

## Pro Tips

1. **Read the syllabus section thoroughly** before creating questions
2. **Target one concept per question** - Don't combine multiple LOs
3. **Make distractors educational** - They should teach common mistakes
4. **Test your questions** - Would a student who studied get it right?
5. **Reference syllabus consistently** - Build exam familiarity
6. **Vary question structure** - Avoid repetitive patterns
7. **Review ISTQB sample exams** - Learn the question style

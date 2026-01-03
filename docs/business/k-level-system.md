# K-Level Badge System (Cognitive Levels)

## ISTQB Cognitive Levels

The ISTQB syllabus uses **Bloom's Taxonomy** to define the depth of knowledge required for each learning objective.

Every Learning Objective (LO) has a K-Level that indicates the cognitive skill being tested.

---

## The Three K-Levels

### K1 - Remember

**Capability:** Recognize, remember, or recall a keyword or concept.

**Cognitive Actions:**
- Recall definitions
- Recognize terminology
- List items from memory
- Identify concepts

**Exam Questions:**
- Multiple-choice asking for definitions
- "What is X?"
- "Which of the following is the definition of X?"

**Example:**
- **Question:** "What is a test objective?"
- **Answer:** Recall the definition from the syllabus

**Learning Objective Example:**
- FL-1.1.1 (K1): Identify typical test objectives

---

### K2 - Understand

**Capability:** Differentiate, summarize, exemplify, or classify concepts.

**Cognitive Actions:**
- Differentiate between concepts
- Classify items into categories
- Summarize key points
- Provide examples
- Explain relationships
- Compare and contrast

**Exam Questions:**
- Scenario-based questions requiring comprehension
- "Which of the following BEST differentiates X from Y?"
- "Classify the following as..."
- "Which statement summarizes..."

**Example:**
- **Question:** "Which of the following differentiates testing from debugging?"
- **Answer:** Understand the relationship and key differences

**Learning Objective Example:**
- FL-1.1.2 (K2): Differentiate testing from debugging

---

### K3 - Apply

**Capability:** Apply knowledge to a specific context or problem.

**Cognitive Actions:**
- Apply techniques to scenarios
- Select appropriate methods
- Solve problems using learned concepts
- Demonstrate practical use

**Exam Questions:**
- Practical scenarios requiring application
- "Given [scenario], which approach is MOST appropriate?"
- "A tester is asked to [task]. Which technique should they use?"
- "In the context of [situation], identify the correct..."

**Example:**
- **Question:** "Given a project with strict regulatory requirements, which test objective is MOST critical?"
- **Answer:** Apply knowledge of test objectives to a specific context

**Learning Objective Example:**
- FL-4.2.1 (K3): Analyze a test basis to identify test conditions

---

## K-Level Distribution in ISTQB Foundation

**Typical breakdown:**
- **K1 (Remember):** ~30-40% of exam questions
- **K2 (Understand):** ~50-60% of exam questions
- **K3 (Apply):** ~10-20% of exam questions

**Implication:** Most questions require understanding (K2), not just recall (K1).

---

## UI Implementation

### K-Level Badge Component

**Location:** `src/components/common/k-level-badge.tsx`

```tsx
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface KLevelBadgeProps {
  level: 'K1' | 'K2' | 'K3';
}

export function KLevelBadge({ level }: KLevelBadgeProps) {
  const config = {
    K1: {
      label: 'K1',
      description: 'Remember: You need to recall definitions and keywords for the exam.',
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    },
    K2: {
      label: 'K2',
      description: 'Understand: You need to differentiate and explain concepts for the exam.',
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    },
    K3: {
      label: 'K3',
      description: 'Apply: You need to solve practical problems for the exam.',
      color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    },
  };

  const { label, description, color } = config[level];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className={color}>
            {label}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
```

### Usage in Lesson Header

```tsx
<header className="mb-8">
  <div className="flex items-center gap-2 mb-2">
    <span className="text-sm text-muted-foreground">FL-1.1.1</span>
    <KLevelBadge level="K1" />
  </div>
  <h1 className="text-2xl font-bold md:text-3xl">
    Identify Typical Test Objectives
  </h1>
</header>
```

### Color Scheme

| K-Level | Color (Light) | Color (Dark) | Semantic Meaning |
|---------|---------------|--------------|------------------|
| K1 | Blue (#3b82f6) | Blue (#60a5fa) | Basic knowledge (foundation) |
| K2 | Green (#10b981) | Green (#34d399) | Understanding (growth) |
| K3 | Purple (#8b5cf6) | Purple (#a78bfa) | Application (mastery) |

---

## Quiz Question K-Level Alignment

**Rule:** Quiz questions MUST align with the K-Level of the learning objective.

### K1 Questions (Remember)

**Pattern:** Direct recall, definition-based

**Example:**
```typescript
{
  question: "What is a test objective?",
  learningObjective: "FL-1.1.1",
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
  ]
}
```

**Question Stems (K1):**
- "What is X?"
- "Which of the following defines X?"
- "Identify the correct definition of X"
- "Recall the term for X"

---

### K2 Questions (Understand)

**Pattern:** Comparison, classification, summarization

**Example:**
```typescript
{
  question: "Which of the following differentiates testing from debugging?",
  learningObjective: "FL-1.1.2",
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
  ]
}
```

**Question Stems (K2):**
- "Which of the following BEST differentiates X from Y?"
- "Classify the following as..."
- "Which statement summarizes..."
- "Which of the following exemplifies..."
- "Which of the following is NOT a characteristic of X?"

---

### K3 Questions (Apply)

**Pattern:** Scenario-based, practical application

**Example:**
```typescript
{
  question: "Given a project with strict regulatory requirements for medical devices, which test objective is MOST critical?",
  learningObjective: "FL-1.1.1",
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
  ]
}
```

**Question Stems (K3):**
- "Given [scenario], which approach is MOST appropriate?"
- "A tester is asked to [task]. Which technique should they use?"
- "In the context of [situation], identify the correct..."
- "Which test design technique is BEST suited for [scenario]?"

---

## K-Level Validation Checklist

Before creating a question, verify:

- [ ] Learning Objective ID identified (e.g., FL-1.1.1)
- [ ] K-Level extracted from LO (K1, K2, or K3)
- [ ] Question type matches K-Level:
  - K1: Direct recall/definition
  - K2: Comparison/classification/summarization
  - K3: Scenario-based application
- [ ] Question stem uses appropriate verbs for K-Level
- [ ] Correct answer aligns with cognitive level
- [ ] Distractors are plausible for the K-Level

---

## Common Mistakes

### ❌ Mistake: K1 LO with K2 Question

```typescript
// Learning Objective: FL-1.1.1 (K1) Identify typical test objectives

// WRONG: This is a K2 question (differentiation)
{
  question: "Which of the following BEST differentiates a test objective from a test goal?",
  kLevel: "K1",  // ❌ Should be K2
}

// CORRECT: This is a K1 question (recall)
{
  question: "What is a test objective?",
  kLevel: "K1",  // ✅ Correct
}
```

### ❌ Mistake: K2 LO with K3 Question

```typescript
// Learning Objective: FL-1.1.2 (K2) Differentiate testing from debugging

// WRONG: This is a K3 question (application)
{
  question: "Given a failed test case, which step should the tester perform first: debugging or retesting?",
  kLevel: "K2",  // ❌ Should be K3
}

// CORRECT: This is a K2 question (differentiation)
{
  question: "Which of the following differentiates testing from debugging?",
  kLevel: "K2",  // ✅ Correct
}
```

---

## Display Rules

### In Learning Objective List

```tsx
<ul className="space-y-2">
  {learningObjectives.map(lo => (
    <li key={lo.id} className="flex items-center gap-2">
      <KLevelBadge level={lo.kLevel} />
      <span className="text-sm text-muted-foreground">{lo.id}</span>
      <span>{lo.description}</span>
    </li>
  ))}
</ul>
```

### In Quiz Question

```tsx
<div className="flex items-center gap-2 mb-4">
  <span className="text-xs text-muted-foreground">LO: {question.learningObjective}</span>
  <KLevelBadge level={question.kLevel} />
  <Badge variant="secondary">{question.difficulty}</Badge>
</div>
<h2 className="text-lg font-semibold">{question.question}</h2>
```

---

## Bloom's Taxonomy Alignment

The K-Levels map to Bloom's Taxonomy (revised):

| ISTQB K-Level | Bloom's Level | Cognitive Process |
|---------------|---------------|-------------------|
| K1 | Remember | Recognizing, Recalling |
| K2 | Understand | Interpreting, Classifying, Summarizing, Inferring, Comparing, Explaining |
| K3 | Apply | Executing, Implementing |

**Note:** ISTQB stops at K3 (Apply). Higher Bloom's levels (Analyze, Evaluate, Create) are not used in Foundation Level.

---

## Summary

1. **Every Learning Objective has a K-Level** (K1, K2, or K3)
2. **Quiz questions MUST match the LO's K-Level**
3. **Use K-Level badges in UI** to educate users on cognitive requirements
4. **K1 = Recall, K2 = Understand, K3 = Apply**
5. **Most ISTQB questions are K2** (understanding, not just memorization)

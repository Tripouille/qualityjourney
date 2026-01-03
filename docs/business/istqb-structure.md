# ISTQB Terminology & Domain Model

## Official Terminology (Mandatory)

Use these exact terms when building ISTQB-related features.

---

## Hierarchy

The ISTQB syllabus follows this structure:

```
1. Chapter (Top-level organizational unit)
   ├─ 2. Section (Second level)
   │  ├─ 3. Sub-section (Third level)
   │  │  └─ 4. Learning Objective (LO) (Specific goal)
```

### 1. Chapter

**Definition:** Top-level organizational unit in the ISTQB syllabus.

**Example:**
- Chapter 1: Fundamentals of Testing
- Chapter 2: Testing Throughout the Software Development Lifecycle
- Chapter 3: Static Testing
- Chapter 4: Test Analysis and Design
- Chapter 5: Managing the Test Activities
- Chapter 6: Test Tools

**Usage in Code:**
```typescript
interface Chapter {
  id: string;          // e.g., "1"
  title: string;       // e.g., "Fundamentals of Testing"
  sections: Section[];
  order: number;
}
```

---

### 2. Section

**Definition:** Second level in the hierarchy. **This is our atomic learning unit.**

**Example:**
- Section 1.1: What is Testing?
- Section 1.2: Why is Testing Necessary?
- Section 1.3: Testing Principles
- Section 1.4: Test Activities, Testware and Test Roles
- Section 1.5: Essential Skills and Good Practices in Testing

**Usage in Code:**
```typescript
interface Section {
  id: string;                      // e.g., "1.1"
  chapterId: string;               // e.g., "1"
  title: string;                   // e.g., "What is Testing?"
  learningObjectives: LearningObjective[];
  content: ContentBlock[];         // Lesson text (Markdown, Definitions, Diagrams)
  quizId: string;                  // Reference to the quiz for this section
  estimatedDuration: number;       // Reading time in minutes
  order: number;
}
```

**Critical:** A Section contains:
1. **Lesson Content** - Pedagogical text derived from the ISTQB syllabus
2. **Exhaustive Quiz** - Questions covering ALL learning objectives in that section
3. **Completion State** - Tracked per user (requires 100% quiz score)

---

### 3. Sub-section

**Definition:** Third level in the hierarchy. Contains specific concepts within a Section.

**Example (Section 1.1):**
- Sub-section 1.1.1: Test Objectives
- Sub-section 1.1.2: Testing and Debugging

**Usage in Code:**
```typescript
interface SubSection {
  id: string;           // e.g., "1.1.1"
  sectionId: string;    // e.g., "1.1"
  title: string;        // e.g., "Test Objectives"
  learningObjectives: LearningObjective[];
  content: ContentBlock[];
  order: number;
}
```

**Note:** Sub-sections are primarily organizational. They may not always map 1:1 to UI components. Sections are the atomic learning unit.

---

### 4. Learning Objective (LO)

**Definition:** Specific, measurable goal assigned to a sub-section. Each LO has a K-Level (cognitive level).

**Format:** `FL-{chapter}.{section}.{number}` (e.g., `FL-1.1.1`)

**Example:**
- **FL-1.1.1 (K1):** Identify typical test objectives
- **FL-1.1.2 (K2):** Differentiate testing from debugging
- **FL-1.2.1 (K2):** Exemplify why testing is necessary

**Usage in Code:**
```typescript
interface LearningObjective {
  id: string;                       // e.g., "FL-1.1.1"
  cognitiveLevel: 'K1' | 'K2' | 'K3';
  description: string;              // e.g., "Identify typical test objectives"
  subSectionId: string;             // e.g., "1.1.1"
}
```

**Critical:** Every Learning Objective MUST have at least one quiz question.

---

## Example Mapping

```
Chapter 1: Fundamentals of Testing
├─ Section 1.1: What is Testing?
│  ├─ Sub-section 1.1.1: Test Objectives
│  │  └─ Learning Objective: FL-1.1.1 (K1) Identify typical test objectives
│  └─ Sub-section 1.1.2: Testing and Debugging
│     └─ Learning Objective: FL-1.1.2 (K2) Differentiate testing from debugging
│
├─ Section 1.2: Why is Testing Necessary?
│  ├─ Sub-section 1.2.1: Testing's Contributions to Success
│  │  └─ Learning Objective: FL-1.2.1 (K2) Exemplify why testing is necessary
│  └─ Sub-section 1.2.2: Testing and Quality Assurance
│     └─ Learning Objective: FL-1.2.2 (K2) Distinguish between error, defect, failure, root cause
│
├─ Section 1.3: Testing Principles
│  └─ Learning Objective: FL-1.3.1 (K2) Explain the seven testing principles
│
├─ Section 1.4: Test Activities, Testware and Test Roles
│  ├─ Sub-section 1.4.1: Test Activities and Tasks
│  │  └─ Learning Objective: FL-1.4.1 (K2) Explain the different test activities
│  ├─ Sub-section 1.4.2: Testware
│  │  └─ Learning Objective: FL-1.4.2 (K2) Explain what testware is
│  └─ Sub-section 1.4.3: Test Roles
│     └─ Learning Objective: FL-1.4.3 (K2) Explain the different test roles
│
└─ Section 1.5: Essential Skills and Good Practices in Testing
   ├─ Sub-section 1.5.1: Generic Skills Required for Testing
   │  └─ Learning Objective: FL-1.5.1 (K2) Classify generic skills required for testing
   └─ Sub-section 1.5.2: Whole Team Approach
      └─ Learning Objective: FL-1.5.2 (K2) Explain the whole team approach
```

---

## Usage in Code

### Domain Entities

**Correct Usage:**
```typescript
// Use "Section" for the atomic learning unit
interface Section {
  id: string;                      // "1.1"
  title: string;                   // "What is Testing?"
  learningObjectives: LearningObjective[];
  content: ContentBlock[];
  quizId: string;
  estimatedDuration: number;
  order: number;
}

// Use "LearningObjective" for specific goals
interface LearningObjective {
  id: string;                       // "FL-1.1.1"
  cognitiveLevel: 'K1' | 'K2' | 'K3';
  description: string;
}

// Use "Chapter" only for organizational grouping
interface Chapter {
  id: string;                       // "1"
  title: string;                    // "Fundamentals of Testing"
  sections: Section[];
}
```

### Naming Conventions

**Files:**
- Section data: `istqb-chapter1-sections.ts`
- Quiz data: `istqb-chapter1-quizzes.ts`
- Learning objectives: Part of section data

**Variables:**
```typescript
// ✅ CORRECT
const section = sections.find(s => s.id === '1.1');
const learningObjective = section.learningObjectives.find(lo => lo.id === 'FL-1.1.1');

// ❌ WRONG: Don't confuse with "lesson"
const lesson = lessons.find(l => l.id === '1.1'); // "Lesson" is not ISTQB terminology
```

---

## Content Block Types

Content within a Section/Sub-section uses typed blocks:

```typescript
interface ContentBlock {
  type: 'markdown' | 'definition' | 'infobox' | 'mermaid' | 'code' | 'scenario';
  content: string;
  metadata?: Record<string, unknown>;
}
```

### Content Block Examples:

**Markdown:**
```typescript
{
  type: 'markdown',
  content: 'Testing is the process of executing a system with the intent of finding defects...'
}
```

**Definition (for ISTQB keywords):**
```typescript
{
  type: 'definition',
  content: 'A reason or purpose for designing and executing a test.',
  metadata: { term: 'Test Objective' }
}
```

**InfoBox (for important notes):**
```typescript
{
  type: 'infobox',
  content: 'Testing cannot prove the absence of defects—only their presence.',
  metadata: { variant: 'warning' }
}
```

**Mermaid Diagram:**
```typescript
{
  type: 'mermaid',
  content: 'graph LR\n  A[Error] --> B[Defect]\n  B --> C[Failure]',
}
```

**Code Example:**
```typescript
{
  type: 'code',
  content: 'const result = testFunction();\nexpect(result).toBe(expected);',
  metadata: { language: 'typescript' }
}
```

**Interactive Scenario:**
```typescript
{
  type: 'scenario',
  content: 'Classify the following as Error, Defect, or Failure...',
  metadata: { interactionType: 'drag-drop' }
}
```

---

## Glossary of ISTQB Terms

Use these exact terms in the codebase:

| ISTQB Term | Definition | Usage |
|------------|------------|-------|
| **Test Objective** | A reason or purpose for designing and executing a test | Use this, not "test goal" or "test purpose" |
| **Test Object** | The component or system being tested | Use this, not "thing being tested" or "SUT" |
| **Testware** | Work products produced during the test process | Use this, not "test artifacts" |
| **Defect** | An imperfection or deficiency in a work product | Use this, not "bug" (except in informal contexts) |
| **Failure** | An event in which a component or system does not perform as expected | Use this, not "crash" |
| **Error** | A human action that produces an incorrect result | Use this, not "mistake" (in ISTQB context) |
| **Root Cause** | A source of a defect such that if it is removed, the defect is decreased or removed | Use this exact term |
| **Debugging** | The process of finding, analyzing, and fixing defects | Use this, not "bug fixing" |
| **Test Execution** | The activity that runs a test on a component or system | Use this, not "running tests" (in formal docs) |

---

## Quiz Question Alignment

Every Learning Objective requires at least one question:

```typescript
// Example: FL-1.1.1 (K1) Identify typical test objectives
{
  learningObjective: 'FL-1.1.1',
  kLevel: 'K1',
  question: 'Which of the following is a typical test objective?',
  // ... options and explanation
}

// Example: FL-1.1.2 (K2) Differentiate testing from debugging
{
  learningObjective: 'FL-1.1.2',
  kLevel: 'K2',
  question: 'Which of the following BEST differentiates testing from debugging?',
  // ... options and explanation
}
```

---

## Rules Summary

1. **Use "Section" as the atomic learning unit** (not "lesson")
2. **Use "LearningObjective"** for specific goals within a sub-section
3. **Use "Chapter"** only for organizational grouping
4. **Use exact ISTQB terminology** in code and UI (e.g., "test object" not "SUT")
5. **Map every Learning Objective to at least one quiz question**
6. **Reference Learning Objective IDs** in quiz questions (e.g., `FL-1.1.1`)
7. **Use K-Level badges** in UI to indicate cognitive level

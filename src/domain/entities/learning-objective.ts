/**
 * Learning Objective Entity
 * The ATOMIC unit of learning in the course structure
 *
 * Architecture Decision:
 * Learning Objectives are the smallest trackable unit because:
 * - Maps 1:1 to ISTQB exam questions
 * - Natural microlearning size (5-8 min total)
 * - Clear completion criteria (read content + pass quiz 100%)
 * - Consistent across all ISTQB certifications
 *
 * Structure: Course → Chapter → Section (UI grouping) → Learning Objective (atomic)
 */

/**
 * K-Level (Cognitive Level)
 * Based on Bloom's Taxonomy
 *
 * K1 (Remember): Recall definitions, keywords
 * K2 (Understand): Differentiate, explain concepts
 * K3 (Apply): Solve practical problems
 */
export type KLevel = 'K1' | 'K2' | 'K3';

/**
 * Content Block Types
 * Interactive components for lesson content
 */
export type ContentBlockType = 'text' | 'definition' | 'infobox' | 'mermaid' | 'scenario';

/**
 * Base Content Block
 */
interface BaseContentBlock {
  id: string;
  type: ContentBlockType;
}

/**
 * Text Block
 * Standard paragraph content
 */
export interface TextBlock extends BaseContentBlock {
  type: 'text';
  content: string; // Markdown supported
}

/**
 * Definition Block
 * Highlighted ISTQB keyword definition
 */
export interface DefinitionBlock extends BaseContentBlock {
  type: 'definition';
  term: string; // e.g., 'Test Objective'
  definition: string;
  isISTQBKeyword: boolean; // True if official ISTQB glossary term
}

/**
 * InfoBox Block
 * Callout for important notes, tips, warnings
 */
export interface InfoBoxBlock extends BaseContentBlock {
  type: 'infobox';
  variant: 'info' | 'tip' | 'warning' | 'exam-tip';
  title: string;
  content: string; // Markdown supported
}

/**
 * Mermaid Diagram Block
 * Visual diagrams (flowcharts, sequences, etc.)
 */
export interface MermaidBlock extends BaseContentBlock {
  type: 'mermaid';
  diagram: string; // Mermaid.js syntax
  caption?: string;
}

/**
 * Scenario Block
 * Real-world example or case study
 */
export interface ScenarioBlock extends BaseContentBlock {
  type: 'scenario';
  title: string;
  context: string; // Setup/background
  situation: string; // The scenario
  analysis: string; // How it relates to learning objective
}

/**
 * Union type of all content blocks
 */
export type ContentBlock = TextBlock | DefinitionBlock | InfoBoxBlock | MermaidBlock | ScenarioBlock;

/**
 * Learning Objective - The Atomic Learning Unit
 *
 * Each Learning Objective represents:
 * - One testable concept from ISTQB syllabus
 * - 3-5 minutes of reading content
 * - 2-3 minutes of quiz (3-5 questions)
 * - Total: 5-8 minutes (optimal microlearning duration)
 */
export interface LearningObjective {
  // Identity
  id: string; // ISTQB ID: "FL-1.1.1", "FL-1.1.2", etc.
  courseId: string; // "istqb-foundation-v4"
  chapterId: string; // "chapter-1"
  sectionId: string; // "1.1" (for UI grouping only)

  // Content
  title: string; // "Identify typical test objectives"
  kLevel: KLevel; // K1, K2, or K3
  description: string; // Short summary

  contentBlocks: ContentBlock[]; // Lesson content
  keywords: string[]; // ISTQB keywords covered

  // Timing (from research: optimal microlearning)
  estimatedReadingTime: number; // Minutes (3-5)
  estimatedQuizTime: number; // Minutes (2-3)

  // Navigation (pre-computed for performance)
  order: number; // Global order across entire course (1, 2, 3...)
  previousLearningObjectiveId: string | null; // null if first LO in course
  nextLearningObjectiveId: string | null; // null if last LO in course

  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Section - UI Grouping Only
 *
 * Sections group Learning Objectives for display in the chapter overview.
 * They have no content or quiz of their own.
 */
export interface Section {
  id: string; // "1.1", "1.2", etc.
  chapterId: string; // "chapter-1"
  title: string; // "What is Testing?"
  order: number; // Order within chapter

  // References to Learning Objectives
  learningObjectiveIds: string[]; // ["FL-1.1.1", "FL-1.1.2"]
}

/**
 * Chapter - Container for Navigation
 *
 * Chapters organize sections and provide navigation structure
 */
export interface Chapter {
  id: string; // "chapter-1"
  courseId: string; // "istqb-foundation-v4"
  chapterNumber: string; // "1"
  chapterSlug: string; // "chapter-1" (for URLs)

  title: string; // "Fundamentals of Testing"
  description: string; // Chapter overview

  // References
  sectionIds: string[]; // ["1.1", "1.2", "1.3", "1.4", "1.5"]
  learningObjectiveIds: string[]; // All LOs in this chapter (for progress calculation)

  // Metadata
  order: number; // Order within course
  totalLearningObjectives: number; // Total LOs in chapter (14 for Chapter 1)
  estimatedTotalTime: number; // Sum of all LO times
}

/**
 * Course - Top Level
 */
export interface Course {
  id: string; // "istqb-foundation-v4"
  slug: string; // "istqb-foundation-v4" (for URLs)
  displayVersion: string; // "v4" (shown to users)
  currentContentVersion: string; // "4.0.1" (internal tracking)

  title: string; // "ISTQB Certified Tester Foundation Level"
  description: string;

  // Content structure
  chapterIds: string[]; // ["chapter-1", "chapter-2", ...]
  totalLearningObjectives: number; // Total LOs across all chapters

  // Status
  status: 'active' | 'archived'; // v4 active, v3 archived
  lastContentUpdate: Date;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

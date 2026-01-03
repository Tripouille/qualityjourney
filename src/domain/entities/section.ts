/**
 * Section Entity
 * Atomic learning unit in the ISTQB pedagogical structure
 *
 * Structure: Chapter → Section → Sub-section → Learning Objective
 *
 * Example: Chapter 1 → Section 1.1 → Sub-section 1.1.1 → LO: FL-1.1.1 (K1)
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
 * Learning Objective
 * Smallest unit of learning aligned to ISTQB syllabus
 */
export interface LearningObjective {
  id: string; // e.g., 'FL-1.1.1'
  title: string; // e.g., 'Identify typical test objectives'
  kLevel: KLevel;
  keywords: string[]; // ISTQB keywords for this objective
}

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
 * Section Entity
 * Atomic unit: Study content + Validation quiz + Progress tracking
 */
export interface Section {
  id: string; // e.g., 'section-1.1'
  title: string; // e.g., 'What is Testing?'
  sectionNumber: string; // e.g., '1.1'
  chapterId: string; // e.g., 'chapter-1'
  order: number;

  // Content
  learningObjectives: LearningObjective[];
  contentBlocks: ContentBlock[];

  // Quiz
  quizId: string; // Reference to Quiz entity

  // Metadata
  estimatedDuration: number; // in minutes (reading + quiz)
  keywords: string[]; // Aggregated ISTQB keywords from all objectives

  // Progress tracking (user-specific, will be in separate Progress entity later)
  // For now, these are optional fields for mock data
  isContentCompleted?: boolean;
  isQuizPassed?: boolean; // Must be 100% to be true
}

/**
 * Chapter Entity
 * Container for sections
 */
export interface Chapter {
  id: string; // e.g., 'chapter-1'
  title: string; // e.g., 'Fundamentals of Testing'
  chapterNumber: string; // e.g., '1'
  courseId: string;
  order: number;
  sections: Section[];

  // Metadata
  description: string;
  totalDuration: number; // Sum of all section durations
  totalSections: number;
}

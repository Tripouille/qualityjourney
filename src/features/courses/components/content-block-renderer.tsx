/**
 * Content Block Renderer
 * Renders different types of content blocks for Learning Objectives
 *
 * Supports:
 * - Text blocks (Markdown)
 * - Definition blocks (ISTQB keywords)
 * - InfoBox blocks (tips, warnings, exam tips)
 * - Mermaid diagram blocks
 * - Scenario blocks (real-world examples)
 */

'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import type {
  ContentBlock,
  TextBlock,
  DefinitionBlock,
  InfoBoxBlock,
  MermaidBlock,
  ScenarioBlock,
} from '@/domain/entities/learning-objective';

interface ContentBlockRendererProps {
  block: ContentBlock;
}

export function ContentBlockRenderer({ block }: ContentBlockRendererProps): React.JSX.Element {
  switch (block.type) {
    case 'text':
      return <TextBlockRenderer block={block} />;
    case 'definition':
      return <DefinitionBlockRenderer block={block} />;
    case 'infobox':
      return <InfoBoxBlockRenderer block={block} />;
    case 'mermaid':
      return <MermaidBlockRenderer block={block} />;
    case 'scenario':
      return <ScenarioBlockRenderer block={block} />;
    default:
      return <div>Unknown block type</div>;
  }
}

/**
 * Text Block Renderer
 * Renders standard text content with Markdown support
 */
function TextBlockRenderer({ block }: { block: TextBlock }): React.JSX.Element {
  return (
    <div className="prose prose-slate max-w-none dark:prose-invert">
      <ReactMarkdown>{block.content}</ReactMarkdown>
    </div>
  );
}

/**
 * Definition Block Renderer
 * Renders ISTQB keyword definitions with highlighting
 */
function DefinitionBlockRenderer({ block }: { block: DefinitionBlock }): React.JSX.Element {
  return (
    <div className="rounded-lg border-l-4 border-primary bg-primary/5 p-4">
      <div className="mb-1 flex items-center gap-2">
        <h3 className="text-base font-bold text-primary md:text-lg">{block.term}</h3>
        {block.isISTQBKeyword && (
          <span className="rounded bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
            ISTQB
          </span>
        )}
      </div>
      <p className="text-sm leading-relaxed text-foreground md:text-base">{block.definition}</p>
    </div>
  );
}

/**
 * InfoBox Block Renderer
 * Renders callouts for tips, warnings, and exam notes
 */
function InfoBoxBlockRenderer({ block }: { block: InfoBoxBlock }): React.JSX.Element {
  const variantStyles = {
    info: {
      border: 'border-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-950/30',
      icon: '💡',
      title: 'text-blue-700 dark:text-blue-300',
    },
    tip: {
      border: 'border-green-500',
      bg: 'bg-green-50 dark:bg-green-950/30',
      icon: '✓',
      title: 'text-green-700 dark:text-green-300',
    },
    warning: {
      border: 'border-yellow-500',
      bg: 'bg-yellow-50 dark:bg-yellow-950/30',
      icon: '⚠️',
      title: 'text-yellow-700 dark:text-yellow-300',
    },
    'exam-tip': {
      border: 'border-purple-500',
      bg: 'bg-purple-50 dark:bg-purple-950/30',
      icon: '📝',
      title: 'text-purple-700 dark:text-purple-300',
    },
  };

  const style = variantStyles[block.variant];

  return (
    <div className={`rounded-lg border-l-4 ${style.border} ${style.bg} p-4`}>
      <div className="mb-2 flex items-center gap-2">
        <span className="text-base md:text-lg">{style.icon}</span>
        <h3 className={`text-sm font-semibold md:text-base ${style.title}`}>{block.title}</h3>
      </div>
      <div className="prose prose-sm max-w-none dark:prose-invert">
        <ReactMarkdown>{block.content}</ReactMarkdown>
      </div>
    </div>
  );
}

/**
 * Mermaid Block Renderer
 * Renders Mermaid.js diagrams
 */
function MermaidBlockRenderer({ block }: { block: MermaidBlock }): React.JSX.Element {
  // TODO: Implement Mermaid rendering
  // For now, show placeholder
  return (
    <div className="rounded-lg border bg-muted p-6">
      <div className="mb-2 text-sm font-medium text-muted-foreground">
        [Diagram: Mermaid rendering not yet implemented]
      </div>
      <pre className="overflow-x-auto text-xs">
        <code>{block.diagram}</code>
      </pre>
      {block.caption && <p className="mt-2 text-center text-sm italic">{block.caption}</p>}
    </div>
  );
}

/**
 * Scenario Block Renderer
 * Renders real-world examples and case studies
 */
function ScenarioBlockRenderer({ block }: { block: ScenarioBlock }): React.JSX.Element {
  return (
    <div className="rounded-lg border bg-card p-4 md:p-6">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-lg md:text-xl">📖</span>
        <h3 className="text-base font-bold md:text-lg">{block.title}</h3>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="mb-1 text-sm font-semibold text-primary">Context</h4>
          <p className="text-sm leading-relaxed">{block.context}</p>
        </div>

        <div>
          <h4 className="mb-1 text-sm font-semibold text-primary">Situation</h4>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown>{block.situation}</ReactMarkdown>
          </div>
        </div>

        <div>
          <h4 className="mb-1 text-sm font-semibold text-primary">Analysis</h4>
          <p className="text-sm leading-relaxed italic text-muted-foreground">{block.analysis}</p>
        </div>
      </div>
    </div>
  );
}

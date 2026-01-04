/**
 * TextBlock Component
 * Renders markdown text content with proper typography
 */

'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { TextBlock as TextBlockType } from '@/domain/entities/section';

interface TextBlockProps {
  block: TextBlockType;
}

export function TextBlock({ block }: TextBlockProps): React.JSX.Element {
  return (
    <div className="prose prose-lg max-w-none dark:prose-invert">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{block.content}</ReactMarkdown>
    </div>
  );
}

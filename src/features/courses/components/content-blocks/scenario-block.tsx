/**
 * ScenarioBlock Component
 * Renders real-world scenarios and case studies
 */

'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import type { ScenarioBlock as ScenarioBlockType } from '@/domain/entities/section';

interface ScenarioBlockProps {
  block: ScenarioBlockType;
}

export function ScenarioBlock({ block }: ScenarioBlockProps): React.JSX.Element {
  return (
    <Card className="border-l-4 border-l-indigo-500 dark:border-l-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900">
            <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
          </div>
          <CardTitle className="text-lg">{block.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h5 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Context
          </h5>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{block.context}</ReactMarkdown>
          </div>
        </div>

        <div>
          <h5 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Situation
          </h5>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{block.situation}</ReactMarkdown>
          </div>
        </div>

        <div className="pt-4 border-t">
          <h5 className="text-sm font-semibold text-indigo-700 dark:text-indigo-300 uppercase tracking-wide mb-2">
            Analysis
          </h5>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{block.analysis}</ReactMarkdown>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

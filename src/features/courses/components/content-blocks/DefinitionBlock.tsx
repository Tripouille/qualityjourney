/**
 * DefinitionBlock Component
 * Renders ISTQB keyword definitions with highlighted styling
 */

'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import type { DefinitionBlock as DefinitionBlockType } from '@/domain/entities/section';

interface DefinitionBlockProps {
  block: DefinitionBlockType;
}

export function DefinitionBlock({ block }: DefinitionBlockProps): React.JSX.Element {
  return (
    <Card className="border-l-4 border-l-blue-500 dark:border-l-blue-400">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
              <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-300" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h4 className="text-lg font-semibold">{block.term}</h4>
              {block.isISTQBKeyword && (
                <Badge variant="secondary" className="text-xs">
                  ISTQB Keyword
                </Badge>
              )}
            </div>
            <p className="text-base leading-relaxed text-muted-foreground">{block.definition}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

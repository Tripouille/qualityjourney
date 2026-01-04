/**
 * InfoBoxBlock Component
 * Renders callout boxes for important notes, tips, warnings, and exam tips
 */

'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, Lightbulb, AlertTriangle, Trophy } from 'lucide-react';
import type { InfoBoxBlock as InfoBoxBlockType } from '@/domain/entities/section';

interface InfoBoxBlockProps {
  block: InfoBoxBlockType;
}

export function InfoBoxBlock({ block }: InfoBoxBlockProps): React.JSX.Element {
  const variantConfig = {
    info: {
      icon: Info,
      className: 'border-blue-500 bg-blue-50 dark:bg-blue-950/30',
      iconClassName: 'text-blue-600 dark:text-blue-400',
    },
    tip: {
      icon: Lightbulb,
      className: 'border-green-500 bg-green-50 dark:bg-green-950/30',
      iconClassName: 'text-green-600 dark:text-green-400',
    },
    warning: {
      icon: AlertTriangle,
      className: 'border-orange-500 bg-orange-50 dark:bg-orange-950/30',
      iconClassName: 'text-orange-600 dark:text-orange-400',
    },
    'exam-tip': {
      icon: Trophy,
      className: 'border-purple-500 bg-purple-50 dark:bg-purple-950/30',
      iconClassName: 'text-purple-600 dark:text-purple-400',
    },
  };

  const config = variantConfig[block.variant];
  const Icon = config.icon;

  return (
    <Alert className={`${config.className} border-l-4`}>
      <Icon className={`h-5 w-5 ${config.iconClassName}`} />
      <AlertTitle className="text-base font-semibold">{block.title}</AlertTitle>
      <AlertDescription className="text-base prose prose-sm max-w-none dark:prose-invert mt-2">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{block.content}</ReactMarkdown>
      </AlertDescription>
    </Alert>
  );
}

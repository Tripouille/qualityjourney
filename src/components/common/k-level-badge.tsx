/**
 * K-Level Badge Component
 * Displays ISTQB Bloom's Taxonomy cognitive level badges with tooltips
 *
 * K1 (Remember): Recall definitions and keywords
 * K2 (Understand): Differentiate and explain concepts
 * K3 (Apply): Solve practical problems
 */

import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface KLevelBadgeProps {
  level: 'K1' | 'K2' | 'K3';
}

export function KLevelBadge({ level }: KLevelBadgeProps): React.JSX.Element {
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

/**
 * LessonView Component
 * Displays Section content with learning objectives, content blocks, and quiz navigation
 *
 * Typography: 18px+ base for readability (text-lg)
 * Mobile-first responsive design
 */

'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { KLevelBadge } from '@/components/common/k-level-badge';
import { TextBlock } from './content-blocks/text-block';
import { DefinitionBlock } from './content-blocks/definition-block';
import { InfoBoxBlock } from './content-blocks/info-box-block';
import { MermaidBlock } from './content-blocks/mermaid-block';
import { ScenarioBlock } from './content-blocks/scenario-block';
import { ArrowRight, Target } from 'lucide-react';
import type { Section, ContentBlock } from '@/domain/entities/section';

interface LessonViewProps {
  section: Section;
  quizUrl: string; // URL to navigate to when starting quiz
}

/**
 * Renders a single content block based on its type
 */
function renderContentBlock(block: ContentBlock): React.JSX.Element {
  switch (block.type) {
    case 'text':
      return <TextBlock key={block.id} block={block} />;
    case 'definition':
      return <DefinitionBlock key={block.id} block={block} />;
    case 'infobox':
      return <InfoBoxBlock key={block.id} block={block} />;
    case 'mermaid':
      return <MermaidBlock key={block.id} block={block} />;
    case 'scenario':
      return <ScenarioBlock key={block.id} block={block} />;
  }
}

export function LessonView({ section, quizUrl }: LessonViewProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      {/* Section Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            Section {section.sectionNumber}
          </Badge>
          <span className="text-sm text-muted-foreground">{section.estimatedDuration} min</span>
        </div>
        <h1 className="text-3xl font-bold md:text-4xl">{section.title}</h1>
      </div>

      {/* Learning Objectives */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-xl">Learning Objectives</CardTitle>
          </div>
          <CardDescription className="text-base">
            By the end of this section, you will be able to:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {section.learningObjectives.map((objective) => (
              <li key={objective.id} className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <KLevelBadge level={objective.kLevel} />
                </div>
                <div className="flex-1">
                  <p className="text-base leading-relaxed">
                    <span className="font-mono text-sm text-muted-foreground mr-2">{objective.id}</span>
                    {objective.title}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Content Blocks */}
      <div className="space-y-6">
        {section.contentBlocks.map((block) => (
          <div key={block.id}>{renderContentBlock(block)}</div>
        ))}
      </div>

      {/* ISTQB Keywords Summary */}
      {section.keywords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">ISTQB Keywords in this Section</CardTitle>
            <CardDescription className="text-base">
              These terms may appear in the exam. Make sure you understand their definitions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {section.keywords.map((keyword) => (
                <Badge key={keyword} variant="secondary" className="text-sm">
                  {keyword}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quiz Navigation */}
      <Card className="border-2 border-green-500/20 bg-green-50/50 dark:bg-green-950/20">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">Ready to Test Your Knowledge?</h3>
              <p className="text-base text-muted-foreground">
                Complete the quiz to validate your understanding and unlock the next section.
              </p>
            </div>
            <Link href={quizUrl}>
              <Button size="lg" className="h-12 min-w-[160px] gap-2">
                Start Quiz
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

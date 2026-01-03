/**
 * MermaidBlock Component
 * Renders Mermaid.js diagrams for visual learning
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { MermaidBlock as MermaidBlockType } from '@/domain/entities/section';

interface MermaidBlockProps {
  block: MermaidBlockType;
}

let mermaidInitialized = false;

export function MermaidBlock({ block }: MermaidBlockProps): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const renderDiagram = async () => {
      try {
        console.log('Starting mermaid render for:', block.id);
        setIsLoading(true);
        setError(null);

        // Dynamically import mermaid only on client side
        const mermaid = (await import('mermaid')).default;

        // Initialize mermaid only once
        if (!mermaidInitialized) {
          console.log('Initializing mermaid');
          mermaid.initialize({
            startOnLoad: false,
            theme: 'neutral',
            securityLevel: 'loose',
            fontFamily: 'var(--font-sans)',
          });
          mermaidInitialized = true;
        }

        // Generate unique ID for this diagram
        // Replace dots and other invalid CSS selector characters with hyphens
        const sanitizedId = block.id.replace(/[^a-zA-Z0-9-_]/g, '-');
        const id = `mermaid-${sanitizedId}-${Date.now()}`;

        console.log('Rendering diagram with ID:', id);

        // Render the diagram
        const { svg } = await mermaid.render(id, block.diagram);

        console.log('Diagram rendered successfully');

        // Update state only if component is still mounted
        if (mounted) {
          setSvgContent(svg);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Mermaid rendering error:', err);
        if (mounted) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to render diagram';
          setError(errorMessage);
          setIsLoading(false);
        }
      }
    };

    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      void renderDiagram();
    }, 100);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [block.diagram, block.id]);

  return (
    <Card>
      <CardContent className="pt-6">
        {error ? (
          <div className="text-destructive text-sm p-4 bg-destructive/10 rounded-md">
            <p className="font-semibold">Diagram Error</p>
            <p>{error}</p>
            <details className="mt-2">
              <summary className="cursor-pointer text-xs">Diagram Source</summary>
              <pre className="mt-2 text-xs overflow-x-auto p-2 bg-muted rounded">{block.diagram}</pre>
            </details>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Rendering diagram...</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div
              ref={containerRef}
              className="flex justify-center mermaid-diagram overflow-x-auto"
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
            {block.caption && (
              <p className="text-center text-sm text-muted-foreground italic">{block.caption}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

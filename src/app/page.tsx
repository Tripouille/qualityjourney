import Link from 'next/link';
import { ArrowRight, BookOpen, Trophy, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Landing Page
 *
 * High-conversion landing page with hero section and feature highlights.
 * Showcases the value proposition of QualityJourney.dev.
 */

const features = [
  {
    icon: BookOpen,
    title: 'Interactive Quizzes',
    description:
      'Test your knowledge with interactive quizzes designed to reinforce learning and prepare you for certifications.',
  },
  {
    icon: Zap,
    title: 'Real-world Scenarios',
    description:
      'Practice with hands-on exercises that simulate real QA engineering challenges you\'ll face in production.',
  },
  {
    icon: Trophy,
    title: 'Gamified Progress',
    description:
      'Track your learning journey with achievements, certificates, and a visual progress heatmap.',
  },
] as const;

export default function HomePage(): React.JSX.Element {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Master Modern{' '}
            <span className="text-primary">QA Engineering</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
            From ISTQB to Playwright. The only interactive platform designed
            for SDETs who want to level up their testing skills.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/courses">
                Start Learning Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/blog">Explore Resources</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t bg-muted/50 py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Why Choose QualityJourney?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              The most effective way to learn modern QA engineering
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="flex flex-col items-center rounded-lg border bg-card p-8 text-center transition-shadow hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl rounded-lg border bg-card p-12 text-center shadow-lg">
            <h2 className="text-3xl font-bold">Ready to get started?</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join thousands of QA engineers mastering modern testing practices
            </p>
            <Button size="lg" className="mt-8" asChild>
              <Link href="/courses">
                Browse Courses
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

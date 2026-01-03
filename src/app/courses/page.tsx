import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Courses - QualityJourney.dev',
  description: 'Browse our comprehensive catalog of QA engineering courses.',
};

export default function CoursesPage(): React.JSX.Element {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold md:text-4xl">Courses</h1>
        <p className="mt-2 text-base text-muted-foreground md:mt-4">
          Master software testing with comprehensive, industry-standard courses.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* ISTQB Foundation Course */}
        <Card>
          <CardHeader>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline">Beginner</Badge>
              <Badge variant="secondary">ISTQB</Badge>
              <Badge variant="secondary">Certification</Badge>
            </div>
            <CardTitle className="text-xl">ISTQB Foundation Level</CardTitle>
            <CardDescription className="text-base">
              Complete preparation for the ISTQB Foundation Level certification exam
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                <span>12 lessons</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>285 mins</span>
              </div>
            </div>

            <Link href="/courses/istqb-foundation/section-1.1">
              <Button className="h-12 w-full">Start Learning</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Courses - QualityJourney.dev',
  description: 'Browse our comprehensive catalog of QA engineering courses.',
};

export default function CoursesPage(): React.JSX.Element {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold">Courses</h1>
      <p className="mt-4 text-muted-foreground">
        Course catalog coming soon...
      </p>
    </div>
  );
}

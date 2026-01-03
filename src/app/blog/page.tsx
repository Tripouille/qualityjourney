import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - QualityJourney.dev',
  description: 'Learn about modern QA engineering practices and techniques.',
};

export default function BlogPage(): React.JSX.Element {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold">Blog</h1>
      <p className="mt-4 text-muted-foreground">
        Blog content coming soon...
      </p>
    </div>
  );
}

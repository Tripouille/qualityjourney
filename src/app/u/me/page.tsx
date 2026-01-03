import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Profile - QualityJourney.dev',
  description: 'View your learning progress and achievements.',
};

export default function ProfilePage(): React.JSX.Element {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold">My Profile</h1>
      <p className="mt-4 text-muted-foreground">
        Profile page coming soon...
      </p>
    </div>
  );
}

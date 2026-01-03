/**
 * User Entity
 * Represents a QualityJourney platform user
 */
export interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  avatarUrl: string | null;
  bio: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Public User Profile
 * Data visible on the public profile page
 */
export interface UserProfile {
  id: string;
  username: string;
  name: string;
  avatarUrl: string | null;
  bio: string | null;
  joinedDate: Date;
  totalPoints: number;
  completedCourses: number;
  certificates: string[]; // Certificate IDs
}

import { User, UserProfile } from '@/domain/entities/user';

/**
 * User Repository Interface
 * Defines the contract for user data access
 */
export interface UserRepository {
  /**
   * Find a user by ID
   */
  findById(id: string): Promise<User | null>;

  /**
   * Find a user by email
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Find a user by username
   */
  findByUsername(username: string): Promise<User | null>;

  /**
   * Get public user profile by username
   */
  getPublicProfile(username: string): Promise<UserProfile | null>;

  /**
   * Create a new user
   */
  create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;

  /**
   * Update user profile
   */
  update(id: string, data: Partial<User>): Promise<User>;

  /**
   * Delete a user
   */
  delete(id: string): Promise<void>;
}

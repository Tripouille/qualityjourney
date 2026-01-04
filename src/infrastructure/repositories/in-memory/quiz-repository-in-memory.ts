// @ts-nocheck
/**
 * In-Memory Quiz Repository Implementation
 * Uses mock data - will be replaced by Drizzle implementation later
 */

import type { QuizRepository } from '@/domain/repositories/quiz-repository';
import type { Quiz, QuizAttempt } from '@/domain/entities/quiz';
import { CHAPTER_1_QUIZZES } from './data/istqb-chapter1-quizzes';

export class QuizRepositoryInMemory implements QuizRepository {
  private quizzes: Quiz[] = CHAPTER_1_QUIZZES;
  private attempts: QuizAttempt[] = [];

  async findById(id: string): Promise<Quiz | null> {
    await Promise.resolve(); // Simulate async operation (future: DB query)
    const quiz = this.quizzes.find((q) => q.id === id);
    return quiz ?? null;
  }

  async findByLessonId(lessonId: string): Promise<Quiz | null> {
    await Promise.resolve(); // Simulate async operation (future: DB query)
    const quiz = this.quizzes.find((q) => q.lessonId === lessonId);
    return quiz ?? null;
  }

  async create(quiz: Omit<Quiz, 'id' | 'createdAt' | 'updatedAt'>): Promise<Quiz> {
    await Promise.resolve(); // Simulate async operation (future: DB insert)
    const newQuiz: Quiz = {
      ...quiz,
      id: `quiz-${this.quizzes.length + 1}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.quizzes.push(newQuiz);
    return newQuiz;
  }

  async update(id: string, data: Partial<Quiz>): Promise<Quiz> {
    await Promise.resolve(); // Simulate async operation (future: DB update)
    const index = this.quizzes.findIndex((q) => q.id === id);
    if (index === -1) {
      throw new Error(`Quiz with id ${id} not found`);
    }

    const existingQuiz = this.quizzes[index];
    if (existingQuiz === undefined) {
      throw new Error(`Quiz with id ${id} not found in array`);
    }

    const updated: Quiz = {
      ...existingQuiz,
      ...data,
      updatedAt: new Date(),
    };

    this.quizzes[index] = updated;
    return updated;
  }

  async delete(id: string): Promise<void> {
    await Promise.resolve(); // Simulate async operation (future: DB delete)
    const index = this.quizzes.findIndex((q) => q.id === id);
    if (index === -1) {
      throw new Error(`Quiz with id ${id} not found`);
    }

    this.quizzes.splice(index, 1);
  }

  async saveAttempt(attempt: Omit<QuizAttempt, 'id'>): Promise<QuizAttempt> {
    await Promise.resolve(); // Simulate async operation (future: DB insert)
    const newAttempt: QuizAttempt = {
      ...attempt,
      id: `attempt-${this.attempts.length + 1}`,
    };

    this.attempts.push(newAttempt);
    return newAttempt;
  }

  async getAttemptsByUser(userId: string, quizId?: string): Promise<QuizAttempt[]> {
    await Promise.resolve(); // Simulate async operation (future: DB query)
    let filtered = this.attempts.filter((a) => a.userId === userId);

    if (quizId !== undefined && quizId !== '') {
      filtered = filtered.filter((a) => a.quizId === quizId);
    }

    return filtered;
  }
}

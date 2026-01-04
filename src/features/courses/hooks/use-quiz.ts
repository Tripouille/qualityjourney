/**
 * Quiz Data Hook
 * Fetches quiz data from repository using TanStack Query
 */

'use client';

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { container } from '@/infrastructure/di/container';
import type { Quiz } from '@/domain/entities/quiz';

export function useQuiz(quizId: string): UseQueryResult<Quiz> {
  return useQuery({
    queryKey: ['quiz', quizId],
    queryFn: async () => {
      const quiz = await container.quizRepository.findById(quizId);
      if (quiz === null) {
        throw new Error(`Quiz with id ${quizId} not found`);
      }
      return quiz;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useQuizByLesson(lessonId: string): UseQueryResult<Quiz> {
  return useQuery({
    queryKey: ['quiz', 'lesson', lessonId],
    queryFn: async () => {
      const quiz = await container.quizRepository.findByLessonId(lessonId);
      if (quiz === null) {
        throw new Error(`Quiz for lesson ${lessonId} not found`);
      }
      return quiz;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

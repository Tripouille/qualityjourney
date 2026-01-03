/**
 * Quiz Data Hook
 * Fetches quiz data from repository using TanStack Query
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { container } from '@/infrastructure/di/container';

export function useQuiz(quizId: string) {
  return useQuery({
    queryKey: ['quiz', quizId],
    queryFn: async () => {
      const quiz = await container.quizRepository.findById(quizId);
      if (!quiz) {
        throw new Error(`Quiz with id ${quizId} not found`);
      }
      return quiz;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useQuizByLesson(lessonId: string) {
  return useQuery({
    queryKey: ['quiz', 'lesson', lessonId],
    queryFn: async () => {
      const quiz = await container.quizRepository.findByLessonId(lessonId);
      if (!quiz) {
        throw new Error(`Quiz for lesson ${lessonId} not found`);
      }
      return quiz;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

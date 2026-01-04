/**
 * Quiz Interface Component
 * Interactive quiz with one-question-at-a-time flow
 *
 * Features:
 * - Question shuffling (done on mount)
 * - Option shuffling (done on mount)
 * - Immediate feedback after answer
 * - Progress indicator
 * - Final results with 100% pass requirement
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import type { QuizQuestion, QuizOption } from '@/domain/entities/quiz';
import type { LearningObjective } from '@/domain/entities/learning-objective';

interface QuizInterfaceProps {
  learningObjective: LearningObjective;
  questions: QuizQuestion[];
  contentUrl: string;
}

interface ShuffledQuestion extends QuizQuestion {
  shuffledOptions: QuizOption[];
}

interface QuestionAnswer {
  questionId: string;
  selectedOptionId: string;
  correctOptionId: string;
  isCorrect: boolean;
}

export function QuizInterface({
  learningObjective,
  questions,
  contentUrl,
}: QuizInterfaceProps): React.JSX.Element {
  const [shuffledQuestions, setShuffledQuestions] = useState<ShuffledQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  // Shuffle questions and options on mount
  useEffect(() => {
    const shuffled = shuffleArray([...questions]).map((q) => ({
      ...q,
      shuffledOptions: shuffleArray([...q.options]),
    }));
    setShuffledQuestions(shuffled);
  }, [questions]);

  if (shuffledQuestions.length === 0) {
    return <div>Loading quiz...</div>;
  }

  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  if (!currentQuestion) {
    return <div>Error: Question not found</div>;
  }

  const progress = ((currentQuestionIndex + 1) / shuffledQuestions.length) * 100;

  const handleSelectOption = (optionId: string): void => {
    if (!showFeedback) {
      setSelectedOption(optionId);
    }
  };

  const handleSubmitAnswer = (): void => {
    if (!selectedOption) return;

    const isCorrect = selectedOption === currentQuestion.correctOptionId;

    setAnswers([
      ...answers,
      {
        questionId: currentQuestion.id,
        selectedOptionId: selectedOption,
        correctOptionId: currentQuestion.correctOptionId,
        isCorrect,
      },
    ]);

    setShowFeedback(true);
  };

  const handleNextQuestion = (): void => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      setIsComplete(true);
    }
  };

  const handleRetry = (): void => {
    // Reshuffle questions and options
    const shuffled = shuffleArray([...questions]).map((q) => ({
      ...q,
      shuffledOptions: shuffleArray([...q.options]),
    }));
    setShuffledQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setShowFeedback(false);
    setAnswers([]);
    setIsComplete(false);
  };

  if (isComplete) {
    const correctCount = answers.filter((a) => a.isCorrect).length;
    const score = Math.round((correctCount / answers.length) * 100);
    const passed = score === 100;

    return (
      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-2xl font-bold">Quiz Results</h2>

        <div className="mb-6 text-center">
          <div className="mb-2 text-5xl font-bold">{score}%</div>
          <div
            className={`text-lg font-medium ${passed ? 'text-green-600' : 'text-yellow-600'}`}
          >
            {passed ? '✓ Passed!' : '✗ Not passed yet'}
          </div>
          <div className="text-sm text-muted-foreground">
            {correctCount} / {answers.length} correct
          </div>
        </div>

        {!passed && (
          <div className="mb-6 rounded-lg bg-yellow-50 p-4 dark:bg-yellow-950/30">
            <p className="text-sm">
              You need 100% to pass this quiz. Review the content and try again!
            </p>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="font-semibold">Review your answers:</h3>
          {answers.map((answer, index) => {
            const question = shuffledQuestions.find((q) => q.id === answer.questionId);
            const selectedOpt = question?.shuffledOptions.find(
              (o) => o.id === answer.selectedOptionId
            );
            const correctOpt = question?.shuffledOptions.find(
              (o) => o.id === answer.correctOptionId
            );

            return (
              <div
                key={answer.questionId}
                className={`rounded-lg border p-4 ${answer.isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-950/30' : 'border-red-500 bg-red-50 dark:bg-red-950/30'}`}
              >
                <div className="mb-2 text-sm font-medium">
                  Question {index + 1}: {answer.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                </div>
                <div className="mb-2 text-sm">{question?.question}</div>
                <div className="space-y-1 text-sm">
                  <div>
                    Your answer: <span className="font-medium">{selectedOpt?.text}</span>
                  </div>
                  {!answer.isCorrect && (
                    <div>
                      Correct answer: <span className="font-medium">{correctOpt?.text}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col gap-3 md:flex-row">
          <Link
            href={contentUrl}
            className="flex-1 rounded-md border border-input bg-background px-6 py-3 text-center font-medium hover:bg-accent"
          >
            Review Content
          </Link>
          <button
            onClick={handleRetry}
            className="flex-1 rounded-md bg-primary px-6 py-3 font-medium text-primary-foreground hover:bg-primary/90"
          >
            Retry Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="mb-2 text-sm font-medium text-muted-foreground">
          {learningObjective.id}: {learningObjective.title}
        </div>
        <div className="mb-4 text-sm text-muted-foreground">
          Question {currentQuestionIndex + 1} of {shuffledQuestions.length}
        </div>
        {/* Progress Bar */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <h2 className="mb-4 text-lg font-semibold md:text-xl">{currentQuestion.question}</h2>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.shuffledOptions.map((option) => {
            const isSelected = selectedOption === option.id;
            const isCorrect = option.id === currentQuestion.correctOptionId;
            const showCorrectness = showFeedback;

            let optionClass =
              'w-full rounded-lg border p-4 text-left transition-colors cursor-pointer';

            if (showCorrectness) {
              if (isCorrect) {
                optionClass += ' border-green-500 bg-green-50 dark:bg-green-950/30';
              } else if (isSelected) {
                optionClass += ' border-red-500 bg-red-50 dark:bg-red-950/30';
              } else {
                optionClass += ' border-border bg-background opacity-60';
              }
            } else if (isSelected) {
              optionClass += ' border-primary bg-primary/10';
            } else {
              optionClass += ' border-border bg-background hover:border-primary/50';
            }

            return (
              <button key={option.id} onClick={() => handleSelectOption(option.id)} className={optionClass}>
                <div className="flex items-start gap-3">
                  <span className="font-semibold">{option.id})</span>
                  <span className="flex-1">{option.text}</span>
                  {showCorrectness && isCorrect && <span>✓</span>}
                  {showCorrectness && isSelected && !isCorrect && <span>✗</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback */}
      {showFeedback && (
        <div className="mb-6">
          {selectedOption === currentQuestion.correctOptionId ? (
            <div className="rounded-lg border-l-4 border-green-500 bg-green-50 p-4 dark:bg-green-950/30">
              <div className="mb-2 font-semibold text-green-700 dark:text-green-300">
                ✓ Correct!
              </div>
              <p className="text-sm">{currentQuestion.explanation}</p>
            </div>
          ) : (
            <div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-4 dark:bg-red-950/30">
              <div className="mb-2 font-semibold text-red-700 dark:text-red-300">
                ✗ Incorrect
              </div>
              <p className="mb-2 text-sm">
                <strong>Correct answer:</strong>{' '}
                {currentQuestion.shuffledOptions.find((o) => o.id === currentQuestion.correctOptionId)?.text}
              </p>
              <p className="mb-2 text-sm">{currentQuestion.explanation}</p>
              {selectedOption && currentQuestion.rationale[selectedOption] && (
                <p className="text-sm">
                  <strong>Why {selectedOption} is wrong:</strong>{' '}
                  {currentQuestion.rationale[selectedOption]}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end">
        {!showFeedback ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={!selectedOption}
            className="rounded-md bg-primary px-6 py-3 font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={handleNextQuestion}
            className="rounded-md bg-primary px-6 py-3 font-medium text-primary-foreground hover:bg-primary/90"
          >
            {currentQuestionIndex < shuffledQuestions.length - 1 ? 'Next Question' : 'View Results'}
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i];
    const swapTemp = shuffled[j];
    if (temp !== undefined && swapTemp !== undefined) {
      shuffled[i] = swapTemp;
      shuffled[j] = temp;
    }
  }
  return shuffled;
}

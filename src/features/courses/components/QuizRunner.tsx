/**
 * QuizRunner Component
 * Interactive quiz interface with exhaustive feedback and celebration
 *
 * Features:
 * - Mobile-first responsive design
 * - Touch-friendly controls (44px+ targets)
 * - Sticky progress bar
 * - Confetti celebration on pass
 * - Detailed explanations for every answer
 */

'use client';

import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { useQuiz } from '@/features/courses/hooks/use-quiz';
import { useQuizRunnerStore } from '@/lib/stores/quiz-runner-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, XCircle, Clock, Trophy, AlertTriangle } from 'lucide-react';
import { KLevelBadge } from '@/components/common/KLevelBadge';

interface QuizRunnerProps {
  quizId: string;
}

/**
 * Extract K-Level from learning objective string
 * Example: "FL-1.1.1 (K1) Identify typical test objectives" -> "K1"
 */
function extractKLevel(learningObjective: string): 'K1' | 'K2' | 'K3' | null {
  const match = learningObjective.match(/\(K([1-3])\)/);
  if (match?.[1]) {
    return `K${match[1]}` as 'K1' | 'K2' | 'K3';
  }
  return null;
}

export function QuizRunner({ quizId }: QuizRunnerProps) {
  const { data: quiz, isLoading, error } = useQuiz(quizId);
  const [showExplanation, setShowExplanation] = useState(false);

  const {
    currentQuestionIndex,
    selectedAnswers,
    timeSpent,
    isSubmitted,
    score,
    passed,
    startQuiz,
    selectAnswer,
    nextQuestion,
    previousQuestion,
    submitQuiz,
    resetQuiz,
    incrementTime,
  } = useQuizRunnerStore();

  // Initialize quiz on mount
  useEffect(() => {
    if (quiz) {
      startQuiz(quizId);
    }
  }, [quiz, quizId, startQuiz]);

  // Timer effect
  useEffect(() => {
    if (!isSubmitted && quiz) {
      const interval = setInterval(() => {
        incrementTime();
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }

    return undefined;
  }, [isSubmitted, quiz, incrementTime]);

  // Confetti celebration on pass
  useEffect(() => {
    if (isSubmitted && passed) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#3b82f6', '#8b5cf6'],
      });

      // Second burst for extra celebration
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 50,
          origin: { y: 0.7 },
          colors: ['#f59e0b', '#ef4444', '#ec4899'],
        });
      }, 250);
    }
  }, [isSubmitted, passed]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-base text-muted-foreground">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-5 w-5" />
        <AlertTitle className="text-base">Error</AlertTitle>
        <AlertDescription className="text-base">Failed to load quiz. Please try again.</AlertDescription>
      </Alert>
    );
  }

  if (!quiz) {
    return null;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;
  const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const currentAnswer = currentQuestion ? selectedAnswers[currentQuestion.id] : undefined;
  const hasAnswer = currentAnswer && currentAnswer.length > 0;

  const handleAnswerSelect = (optionId: string) => {
    if (currentQuestion && !isSubmitted) {
      const isMultipleChoice = currentQuestion.type === 'multiple-choice';
      selectAnswer(currentQuestion.id, optionId, isMultipleChoice);
      setShowExplanation(false);
    }
  };

  const handleNext = () => {
    setShowExplanation(false);
    nextQuestion();
  };

  const handlePrevious = () => {
    setShowExplanation(false);
    previousQuestion();
  };

  const handleSubmit = () => {
    // Calculate score
    let correctCount = 0;

    for (const question of quiz.questions) {
      const userAnswer = selectedAnswers[question.id];
      if (!userAnswer) continue;

      const correctOptionIds = question.options.filter((opt) => opt.isCorrect).map((opt) => opt.id);

      // Check if answer is correct
      const isCorrect =
        userAnswer.length === correctOptionIds.length &&
        userAnswer.every((id) => correctOptionIds.includes(id));

      if (isCorrect) {
        correctCount++;
      }
    }

    const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
    const didPass = scorePercentage >= quiz.passingScore;

    submitQuiz(scorePercentage, didPass);
  };

  const handleRetake = () => {
    resetQuiz();
    startQuiz(quizId);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Results screen
  if (isSubmitted && score !== null && passed !== null) {
    return (
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="text-center">
            {passed ? (
              <div className="flex flex-col items-center gap-4">
                <Trophy className="h-16 w-16 text-green-500" />
                <CardTitle className="text-2xl">Congratulations!</CardTitle>
                <CardDescription className="text-base">You passed the quiz with {score}%</CardDescription>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <XCircle className="h-16 w-16 text-red-500" />
                <CardTitle className="text-2xl">Not Quite There Yet</CardTitle>
                <CardDescription className="text-base">
                  You scored {score}%. You need {quiz.passingScore}% to pass.
                </CardDescription>
              </div>
            )}
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="text-center p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Score</p>
                <p className="text-2xl font-bold">{score}%</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Time Spent</p>
                <p className="text-2xl font-bold">{formatTime(timeSpent)}</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Questions</p>
                <p className="text-2xl font-bold">{totalQuestions}</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 md:flex-row">
              <Button onClick={handleRetake} className="h-12 flex-1" variant="outline">
                Retake Quiz
              </Button>
              <Button className="h-12 flex-1">Continue Learning</Button>
            </div>
          </CardContent>
        </Card>

        {passed && (
          <Alert>
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <AlertTitle className="text-base">What&apos;s Next?</AlertTitle>
            <AlertDescription className="text-base">
              Great job mastering this section! You can now move on to the next lesson or review your answers below.
            </AlertDescription>
          </Alert>
        )}
      </div>
    );
  }

  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Sticky Progress Bar */}
      <div className="sticky top-0 bg-background z-10 pb-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{formatTime(timeSpent)}</span>
          </div>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap gap-2 mb-4">
            {extractKLevel(currentQuestion.learningObjective) && (
              <KLevelBadge level={extractKLevel(currentQuestion.learningObjective)!} />
            )}
            <Badge variant="outline">{currentQuestion.difficulty}</Badge>
            <Badge variant="secondary">{currentQuestion.type}</Badge>
          </div>
          <CardTitle className="text-lg md:text-xl">{currentQuestion.question}</CardTitle>
          <CardDescription className="text-base">{currentQuestion.learningObjective}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {/* Answer Options */}
          <RadioGroup
            value={currentAnswer?.[0] ?? ''}
            onValueChange={handleAnswerSelect}
            className="flex flex-col gap-3"
          >
            {currentQuestion.options.map((option) => (
              <label
                key={option.id}
                className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-accent transition-colors min-h-11"
              >
                <RadioGroupItem value={option.id} id={option.id} className="mt-0.5" />
                <span className="text-base flex-1">{option.text}</span>
              </label>
            ))}
          </RadioGroup>

          {/* Show Explanation Button */}
          {hasAnswer && !showExplanation && (
            <Button variant="outline" onClick={() => setShowExplanation(true)} className="h-12">
              Show Explanation
            </Button>
          )}

          {/* Explanation */}
          {showExplanation && hasAnswer && (
            <Alert>
              <CheckCircle2 className="h-5 w-5" />
              <AlertTitle className="text-base">Explanation</AlertTitle>
              <AlertDescription className="text-base space-y-2">
                <p>
                  <strong>Correct Answer:</strong> {currentQuestion.explanation.correct}
                </p>
                {Object.entries(currentQuestion.explanation.incorrect).length > 0 && (
                  <div>
                    <strong>Why other options are incorrect:</strong>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      {Object.entries(currentQuestion.explanation.incorrect).map(([key, value]) => (
                        <li key={key}>
                          <strong>Option {key.toUpperCase()}:</strong> {value}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex flex-col gap-3 md:flex-row">
        <Button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          variant="outline"
          className="h-12 flex-1"
        >
          Previous
        </Button>

        {!isLastQuestion ? (
          <Button onClick={handleNext} disabled={!hasAnswer} className="h-12 flex-1">
            Next Question
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={!hasAnswer} className="h-12 flex-1">
            Submit Quiz
          </Button>
        )}
      </div>

      {/* Keywords Reference */}
      {currentQuestion.keywords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">ISTQB Keywords in this Question</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {currentQuestion.keywords.map((keyword) => (
                <Badge key={keyword} variant="secondary">
                  {keyword}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClockIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  QuestionMarkCircleIcon,
  FlagIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import DashboardLayout from '@/components/layout/DashboardLayout';

// JavaScript doesn't need interface definitions - using JSDoc for documentation

/**
 * @typedef {Object} Question
 * @property {string} id
 * @property {'MULTIPLE_CHOICE'|'TRUE_FALSE'|'SHORT_ANSWER'|'FILL_IN_BLANK'} type
 * @property {string} question
 * @property {string[]} [options]
 * @property {number} points
 * @property {number} order
 */

/**
 * @typedef {Object} Quiz
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {Question[]} questions
 * @property {number} [timeLimit]
 * @property {number} passingScore
 * @property {Object} settings
 * @property {boolean} settings.showCorrectAnswers
 * @property {boolean} settings.showExplanations
 * @property {boolean} settings.allowReview
 * @property {boolean} settings.randomizeQuestions
 */

/**
 * @typedef {Object} Answer
 * @property {string} questionId
 * @property {string|string[]} answer
 * @property {number} timeSpent
 */

export default function TakeQuizPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [quizStartTime, setQuizStartTime] = useState<Date | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());

  const quizId = params.id;

  useEffect(() => {
    if (quizId) {
      fetchQuiz();
    }
  }, [quizId]);

  useEffect(() => {
    if (quiz && quiz.timeLimit && !showReview) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev === null) return null;
          if (prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quiz, showReview]);

  const fetchQuiz = async () => {
    try {
      // Mock quiz data
      const mockQuiz = {
        id: quizId,
        title: 'Fractions Fundamentals',
        description: 'Test your understanding of basic fraction concepts and operations.',
        timeLimit: 15, // minutes
        passingScore: 70,
        settings: {
          showCorrectAnswers: true,
          showExplanations: true,
          allowReview: true,
          randomizeQuestions: false
        },
        questions: [
          {
            id: '1',
            type: 'MULTIPLE_CHOICE',
            question: 'What does the numerator in a fraction represent?',
            options: [
              'The total number of parts',
              'The number of parts we have',
              'The bottom number',
              'The decimal equivalent'
            ],
            points: 2,
            order: 0
          },
          {
            id: '2',
            type: 'TRUE_FALSE',
            question: 'The fraction 1/2 is equivalent to 0.5 in decimal form.',
            points: 1,
            order: 1
          },
          {
            id: '3',
            type: 'MULTIPLE_CHOICE',
            question: 'Which fraction is larger: 1/3 or 1/4?',
            options: ['1/3', '1/4', 'They are equal', 'Cannot determine'],
            points: 2,
            order: 2
          },
          {
            id: '4',
            type: 'SHORT_ANSWER',
            question: 'Convert the fraction 3/4 to a decimal.',
            points: 2,
            order: 3
          },
          {
            id: '5',
            type: 'FILL_IN_BLANK',
            question: 'In the fraction 5/8, the number 5 is called the _____ and the number 8 is called the _____.',
            points: 2,
            order: 4
          }
        ]
      };

      setQuiz(mockQuiz);
      if (mockQuiz.timeLimit) {
        setTimeRemaining(mockQuiz.timeLimit * 60); // Convert to seconds
      }
      setQuizStartTime(new Date());
    } catch (error) {
      console.error('Error fetching quiz:', error);
    }
  };

  const handleAnswerChange = useCallback((questionId: string, answer: string | string[]) => {
    const now = new Date();
    const timeSpent = Math.floor((now.getTime() - questionStartTime.getTime()) / 1000);
    
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        questionId,
        answer,
        timeSpent: (prev[questionId]?.timeSpent || 0) + timeSpent
      }
    }));
    
    setQuestionStartTime(now);
  }, [questionStartTime]);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setQuestionStartTime(new Date());
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setQuestionStartTime(new Date());
    }
  };

  const handleFlagQuestion = (questionId) => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleReviewQuiz = () => {
    setShowReview(true);
  };

  const handleSubmitQuiz = async () => {
    setIsSubmitting(true);
    try {
      // Here you would submit to your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to results page
      router.push(`/quizzes/${quizId}/results`);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Failed to submit quiz. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  const isQuestionAnswered = (questionId: string) => {
    return questionId in answers && answers[questionId].answer !== '';
  };

  if (!quiz) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  if (showReview) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto p-6">
          <Card>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Your Answers</h2>
              
              <div className="space-y-6">
                {quiz.questions.map((question, index) => (
                  <div key={question.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-medium text-gray-900">
                        Question {index + 1}
                      </h3>
                      <div className="flex items-center gap-2">
                        {flaggedQuestions.has(question.id) && (
                          <FlagIcon className="h-5 w-5 text-red-500" />
                        )}
                        {isQuestionAnswered(question.id) ? (
                          <CheckCircleIcon className="h-5 w-5 text-green-500" />
                        ) : (
                          <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
                        )}
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-3">{question.question}</p>
                    
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-600 mb-1">Your Answer:</p>
                      <p className="text-gray-900">
                        {isQuestionAnswered(question.id) 
                          ? Array.isArray(answers[question.id].answer)
                            ? (answers[question.id].answer as string[]).join(', ')
                            : answers[question.id].answer
                          : 'Not answered'
                        }
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setShowReview(false)}
                >
                  Continue Editing
                </Button>
                
                <Button
                  onClick={handleSubmitQuiz}
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-6">
        {/* Quiz Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
            {timeRemaining !== null && (
              <div className={`flex items-center px-3 py-2 rounded-lg ${
                timeRemaining < 300 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
              }`}>
                <ClockIcon className="h-5 w-5 mr-2" />
                <span className="font-mono font-medium">
                  {formatTime(timeRemaining)}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </span>
            <span>
              {getAnsweredCount()} of {quiz.questions.length} answered
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                        {currentQuestionIndex + 1}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        {currentQuestion.points} point{currentQuestion.points > 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    <h2 className="text-xl font-medium text-gray-900 mb-6">
                      {currentQuestion.question}
                    </h2>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleFlagQuestion(currentQuestion.id)}
                    className={flaggedQuestions.has(currentQuestion.id) ? 'text-red-600 border-red-300' : ''}
                  >
                    <FlagIcon className="h-4 w-4" />
                  </Button>
                </div>

                {/* Answer Options */}
                <div className="space-y-4">
                  {currentQuestion.type === 'MULTIPLE_CHOICE' && (
                    <div className="space-y-3">
                      {currentQuestion.options?.map((option, index) => (
                        <label
                          key={index}
                          className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name={`question-${currentQuestion.id}`}
                            value={option}
                            checked={answers[currentQuestion.id]?.answer === option}
                            onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-3 text-gray-900">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {currentQuestion.type === 'TRUE_FALSE' && (
                    <div className="space-y-3">
                      <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name={`question-${currentQuestion.id}`}
                          value="true"
                          checked={answers[currentQuestion.id]?.answer === 'true'}
                          onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-3 text-gray-900">True</span>
                      </label>
                      <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name={`question-${currentQuestion.id}`}
                          value="false"
                          checked={answers[currentQuestion.id]?.answer === 'false'}
                          onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-3 text-gray-900">False</span>
                      </label>
                    </div>
                  )}

                  {(currentQuestion.type === 'SHORT_ANSWER' || currentQuestion.type === 'FILL_IN_BLANK') && (
                    <textarea
                      value={answers[currentQuestion.id]?.answer || ''}
                      onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                      placeholder="Enter your answer..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="outline"
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            <ChevronLeftIcon className="mr-2 h-4 w-4" />
            Previous
          </Button>

          <div className="flex gap-3">
            {quiz.settings.allowReview && (
              <Button
                variant="outline"
                onClick={handleReviewQuiz}
              >
                Review Answers
              </Button>
            )}
            
            {currentQuestionIndex === quiz.questions.length - 1 ? (
              <Button
                onClick={handleSubmitQuiz}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
              </Button>
            ) : (
              <Button onClick={handleNextQuestion}>
                Next
                <ChevronRightIcon className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Question Navigation */}
        <Card className="mt-6">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Question Navigation</h3>
            <div className="grid grid-cols-10 gap-2">
              {quiz.questions.map((question, index) => (
                <button
                  key={question.id}
                  onClick={() => {
                    setCurrentQuestionIndex(index);
                    setQuestionStartTime(new Date());
                  }}
                  className={`w-8 h-8 rounded text-xs font-medium transition-colors ${
                    index === currentQuestionIndex
                      ? 'bg-blue-600 text-white'
                      : isQuestionAnswered(question.id)
                      ? 'bg-green-100 text-green-700'
                      : flaggedQuestions.has(question.id)
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-600 rounded"></div>
                <span>Current</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
                <span>Flagged</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

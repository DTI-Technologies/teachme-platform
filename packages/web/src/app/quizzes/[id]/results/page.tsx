'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  CheckCircleIcon as CheckCircleOutlineIcon,
  XCircleIcon as XCircleOutlineIcon,
  TrophyIcon,
  ClockIcon,
  StarIcon,
  ArrowLeftIcon,
  LightBulbIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';

// interface QuestionResult {
//   questionId: string;
//   question: string;
//   studentAnswer: string;
//   correctAnswer: string;
//   isCorrect: boolean;
//   pointsEarned: number;
//   maxPoints: number;
//   explanation?: string;
// }

// interface QuizResult {
//   attemptId: string;
//   quizId: string;
//   quizTitle: string;
//   score: number;
//   maxScore: number;
//   percentage: number;
//   passed: boolean;
//   timeSpent: number;
//   submittedAt: Date;
//   questionResults: QuestionResult[];
//   feedback: string;
//   recommendations: string[];
// }

export default function QuizResultsPage() {
  const params = useParams();
  const { user } = useAuth();
  const [results, setResults] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);

  const quizId = params.id;

  useEffect(() => {
    if (quizId) {
      fetchResults();
    }
  }, [quizId]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      
      // Mock results data
      const mockResults = {
        attemptId: '1',
        quizId: quizId,
        quizTitle: 'Fractions Fundamentals',
        score: 7,
        maxScore: 10,
        percentage: 70,
        passed: true,
        timeSpent: 480, // 8 minutes in seconds
        submittedAt: new Date(),
        questionResults: [
          {
            questionId: '1',
            question: 'What does the numerator in a fraction represent?',
            studentAnswer: 'The number of parts we have',
            correctAnswer: 'The number of parts we have',
            isCorrect: true,
            pointsEarned: 2,
            maxPoints: 2,
            explanation: 'The numerator is the top number in a fraction and represents how many parts we have.'
          },
          {
            questionId: '2',
            question: 'The fraction 1/2 is equivalent to 0.5 in decimal form.',
            studentAnswer: 'true',
            correctAnswer: 'true',
            isCorrect: true,
            pointsEarned: 1,
            maxPoints: 1,
            explanation: '1 divided by 2 equals 0.5, so 1/2 = 0.5.'
          },
          {
            questionId: '3',
            question: 'Which fraction is larger: 1/3 or 1/4?',
            studentAnswer: '1/4',
            correctAnswer: '1/3',
            isCorrect: false,
            pointsEarned: 0,
            maxPoints: 2,
            explanation: '1/3 is larger than 1/4. When fractions have the same numerator, the one with the smaller denominator is larger.'
          },
          {
            questionId: '4',
            question: 'Convert the fraction 3/4 to a decimal.',
            studentAnswer: '0.75',
            correctAnswer: '0.75',
            isCorrect: true,
            pointsEarned: 2,
            maxPoints: 2,
            explanation: '3 divided by 4 equals 0.75.'
          },
          {
            questionId: '5',
            question: 'In the fraction 5/8, the number 5 is called the _____ and the number 8 is called the _____.',
            studentAnswer: 'numerator, denominator',
            correctAnswer: 'numerator, denominator',
            isCorrect: true,
            pointsEarned: 2,
            maxPoints: 2,
            explanation: 'In any fraction, the top number is the numerator and the bottom number is the denominator.'
          }
        ],
        feedback: 'Good job! You passed the quiz with a solid understanding of fractions.',
        recommendations: [
          'Review comparing fractions with the same numerator',
          'Practice more fraction comparison problems',
          'Continue to the next lesson on adding fractions'
        ]
      };

      setResults(mockResults);
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (percentage) => {
    if (percentage >= 90) return 'bg-green-100';
    if (percentage >= 80) return 'bg-blue-100';
    if (percentage >= 70) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  if (loading) {
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

  if (!results) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto p-6">
          <Card className="text-center py-12">
            <TrophyIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Results not found</h3>
            <p className="text-gray-600">Unable to load quiz results.</p>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <Link href="/quizzes" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Quizzes
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Results</h1>
          <p className="text-gray-600">{results.quizTitle}</p>
        </div>

        {/* Score Overview */}
        <Card className="mb-8">
          <div className="p-8">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.6 }}
                className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${getScoreBgColor(results.percentage)} mb-4`}
              >
                {results.passed ? (
                  <TrophyIcon className={`h-12 w-12 ${getScoreColor(results.percentage)}`} />
                ) : (
                  <XCircleIcon className={`h-12 w-12 ${getScoreColor(results.percentage)}`} />
                )}
              </motion.div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {results.percentage}%
              </h2>
              
              <p className={`text-lg font-medium mb-4 ${results.passed ? 'text-green-600' : 'text-red-600'}`}>
                {results.passed ? 'Passed!' : 'Not Passed'}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{results.score}/{results.maxScore}</div>
                  <div className="text-sm text-gray-600">Points Earned</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {results.questionResults.filter(q => q.isCorrect).length}/{results.questionResults.length}
                  </div>
                  <div className="text-sm text-gray-600">Correct Answers</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{formatTime(results.timeSpent)}</div>
                  <div className="text-sm text-gray-600">Time Spent</div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Feedback */}
        <Card className="mb-8">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Feedback</h3>
            <p className="text-gray-700 mb-6">{results.feedback}</p>
            
            {results.recommendations.length > 0 && (
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                  <LightBulbIcon className="h-5 w-5 mr-2 text-yellow-500" />
                  Recommendations
                </h4>
                <ul className="space-y-2">
                  {results.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex-shrink-0 w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3"></span>
                      <span className="text-gray-700">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Card>

        {/* Question Breakdown */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Question Breakdown</h3>
            
            <div className="space-y-6">
              {results.questionResults.map((result, index) => (
                <motion.div
                  key={result.questionId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-gray-200 rounded-lg p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <div className="flex items-center gap-2">
                        {result.isCorrect ? (
                          <CheckCircleIconSolid className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircleIconSolid className="h-5 w-5 text-red-500" />
                        )}
                        <span className={`text-sm font-medium ${result.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                          {result.isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {result.pointsEarned}/{result.maxPoints} pts
                    </span>
                  </div>

                  <h4 className="font-medium text-gray-900 mb-4">{result.question}</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Your Answer:</p>
                      <p className={`text-sm p-2 rounded ${
                        result.isCorrect ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {result.studentAnswer}
                      </p>
                    </div>
                    
                    {!result.isCorrect && (
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Correct Answer:</p>
                        <p className="text-sm p-2 rounded bg-green-50 text-green-700">
                          {result.correctAnswer}
                        </p>
                      </div>
                    )}
                  </div>

                  {result.explanation && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-blue-800 mb-1">Explanation:</p>
                      <p className="text-sm text-blue-700">{result.explanation}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex justify-center gap-4 mt-8">
          <Link href="/quizzes">
            <Button variant="outline">
              <BookOpenIcon className="mr-2 h-4 w-4" />
              More Quizzes
            </Button>
          </Link>
          
          {!results.passed && (
            <Link href={`/quizzes/${quizId}/take`}>
              <Button>
                Try Again
              </Button>
            </Link>
          )}
          
          {results.passed && (
            <Link href="/lessons">
              <Button>
                Continue Learning
              </Button>
            </Link>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

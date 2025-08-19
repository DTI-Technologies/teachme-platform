'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  QuestionMarkCircleIcon,
  ClockIcon,
  AcademicCapIcon,
  StarIcon,
  PlayIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronRightIcon,
  TrophyIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { UserRole } from '@teachme/shared';
import Link from 'next/link';

interface Quiz {
  id: string;
  title: string;
  description: string;
  subject: string;
  gradeLevel: string;
  difficulty: string;
  questionCount: number;
  timeLimit?: number;
  passingScore: number;
  tags: string[];
  createdBy: string;
  createdAt: Date;
  isPublished: boolean;
  attempts?: number;
  bestScore?: number;
  completed?: boolean;
}

const subjects = [
  'All Subjects',
  'MATHEMATICS',
  'SCIENCE',
  'ENGLISH',
  'HISTORY',
  'GEOGRAPHY',
  'ART'
];

const gradeLevels = [
  'All Grades',
  'GRADE_1',
  'GRADE_2',
  'GRADE_3',
  'GRADE_4',
  'GRADE_5',
  'GRADE_6'
];

const difficulties = [
  'All Levels',
  'BEGINNER',
  'INTERMEDIATE',
  'ADVANCED'
];

export default function QuizzesPage() {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [selectedGrade, setSelectedGrade] = useState('All Grades');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All Levels');
  const [showFilters, setShowFilters] = useState(false);

  const isTeacher = user?.role === UserRole.TEACHER;

  useEffect(() => {
    fetchQuizzes();
  }, [selectedSubject, selectedGrade, selectedDifficulty, searchTerm]);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      
      // Mock quiz data
      const mockQuizzes: Quiz[] = [
        {
          id: '1',
          title: 'Fractions Fundamentals',
          description: 'Test your understanding of basic fraction concepts and operations.',
          subject: 'MATHEMATICS',
          gradeLevel: 'GRADE_4',
          difficulty: 'BEGINNER',
          questionCount: 10,
          timeLimit: 15,
          passingScore: 70,
          tags: ['fractions', 'math', 'basics'],
          createdBy: '1',
          createdAt: new Date('2024-01-15'),
          isPublished: true,
          attempts: 2,
          bestScore: 85,
          completed: true
        },
        {
          id: '2',
          title: 'Water Cycle Quiz',
          description: 'Assess your knowledge of the water cycle and its processes.',
          subject: 'SCIENCE',
          gradeLevel: 'GRADE_3',
          difficulty: 'BEGINNER',
          questionCount: 8,
          timeLimit: 12,
          passingScore: 75,
          tags: ['water cycle', 'science', 'environment'],
          createdBy: '1',
          createdAt: new Date('2024-01-10'),
          isPublished: true,
          attempts: 1,
          bestScore: 92,
          completed: true
        },
        {
          id: '3',
          title: 'Grammar Basics',
          description: 'Test your understanding of basic grammar rules and sentence structure.',
          subject: 'ENGLISH',
          gradeLevel: 'GRADE_5',
          difficulty: 'INTERMEDIATE',
          questionCount: 15,
          timeLimit: 20,
          passingScore: 80,
          tags: ['grammar', 'english', 'writing'],
          createdBy: '1',
          createdAt: new Date('2024-01-05'),
          isPublished: true,
          attempts: 0,
          completed: false
        },
        {
          id: '4',
          title: 'Multiplication Mastery',
          description: 'Challenge yourself with multiplication problems and word problems.',
          subject: 'MATHEMATICS',
          gradeLevel: 'GRADE_3',
          difficulty: 'INTERMEDIATE',
          questionCount: 12,
          timeLimit: 18,
          passingScore: 75,
          tags: ['multiplication', 'math', 'word problems'],
          createdBy: '1',
          createdAt: new Date('2024-01-08'),
          isPublished: true,
          attempts: 1,
          bestScore: 67,
          completed: false
        }
      ];

      // Apply filters
      let filteredQuizzes = mockQuizzes;
      
      if (selectedSubject !== 'All Subjects') {
        filteredQuizzes = filteredQuizzes.filter(quiz => quiz.subject === selectedSubject);
      }
      
      if (selectedGrade !== 'All Grades') {
        filteredQuizzes = filteredQuizzes.filter(quiz => quiz.gradeLevel === selectedGrade);
      }
      
      if (selectedDifficulty !== 'All Levels') {
        filteredQuizzes = filteredQuizzes.filter(quiz => quiz.difficulty === selectedDifficulty);
      }
      
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filteredQuizzes = filteredQuizzes.filter(quiz =>
          quiz.title.toLowerCase().includes(searchLower) ||
          quiz.description.toLowerCase().includes(searchLower) ||
          quiz.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }

      setQuizzes(filteredQuizzes);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'BEGINNER':
        return 'text-green-600 bg-green-100';
      case 'INTERMEDIATE':
        return 'text-yellow-600 bg-yellow-100';
      case 'ADVANCED':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case 'MATHEMATICS':
        return 'text-blue-600 bg-blue-100';
      case 'SCIENCE':
        return 'text-green-600 bg-green-100';
      case 'ENGLISH':
        return 'text-purple-600 bg-purple-100';
      case 'HISTORY':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getScoreColor = (score: number, passingScore: number) => {
    if (score >= passingScore) {
      return 'text-green-600';
    } else if (score >= passingScore * 0.8) {
      return 'text-yellow-600';
    } else {
      return 'text-red-600';
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isTeacher ? 'My Quizzes' : 'Quizzes'}
            </h1>
            <p className="text-gray-600">
              {isTeacher 
                ? 'Create and manage your assessments'
                : 'Test your knowledge with interactive quizzes'
              }
            </p>
          </div>
          {isTeacher && (
            <Link href="/quizzes/create">
              <Button className="mt-4 sm:mt-0">
                <PlusIcon className="mr-2 h-5 w-5" />
                Create Quiz
              </Button>
            </Link>
          )}
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search quizzes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filter Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <FunnelIcon className="mr-2 h-5 w-5" />
                Filters
              </Button>

              {/* Desktop Filters */}
              <div className="hidden lg:flex gap-4">
                <div className="relative">
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[140px]"
                  >
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                <div className="relative">
                  <select
                    value={selectedGrade}
                    onChange={(e) => setSelectedGrade(e.target.value)}
                    className="px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[120px]"
                  >
                    {gradeLevels.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                <div className="relative">
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[120px]"
                  >
                    {difficulties.map(difficulty => (
                      <option key={difficulty} value={difficulty}>{difficulty}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden mt-4 pt-4 border-t border-gray-200"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="relative">
                    <select
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                    >
                      {subjects.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  <div className="relative">
                    <select
                      value={selectedGrade}
                      onChange={(e) => setSelectedGrade(e.target.value)}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                    >
                      {gradeLevels.map(grade => (
                        <option key={grade} value={grade}>{grade}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  <div className="relative">
                    <select
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                    >
                      {difficulties.map(difficulty => (
                        <option key={difficulty} value={difficulty}>{difficulty}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </Card>

        {/* Quizzes Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="flex gap-2 mb-4">
                    <div className="h-6 w-16 bg-gray-200 rounded"></div>
                    <div className="h-6 w-20 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : quizzes.length === 0 ? (
          <Card className="text-center py-12">
            <QuestionMarkCircleIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No quizzes found</h3>
            <p className="text-gray-600 mb-6">
              {isTeacher 
                ? "You haven't created any quizzes yet. Start by creating your first quiz!"
                : "No quizzes match your current filters. Try adjusting your search criteria."
              }
            </p>
            {isTeacher && (
              <Link href="/quizzes/create">
                <Button>
                  <PlusIcon className="mr-2 h-5 w-5" />
                  Create Your First Quiz
                </Button>
              </Link>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <motion.div
                key={quiz.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-200">
                  {/* Quiz Header */}
                  <div className="h-48 bg-gradient-to-br from-purple-500 to-blue-600 rounded-t-lg relative overflow-hidden">
                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                    <div className="absolute top-4 left-4 right-4">
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSubjectColor(quiz.subject)}`}>
                          {quiz.subject}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                          {quiz.difficulty}
                        </span>
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center justify-between text-white">
                        <div className="flex items-center">
                          <QuestionMarkCircleIcon className="h-4 w-4 mr-1" />
                          <span className="text-sm">{quiz.questionCount} questions</span>
                        </div>
                        {quiz.timeLimit && (
                          <div className="flex items-center">
                            <ClockIcon className="h-4 w-4 mr-1" />
                            <span className="text-sm">{quiz.timeLimit} min</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quiz Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {quiz.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                      {quiz.description}
                    </p>

                    {/* Quiz Meta */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <AcademicCapIcon className="h-4 w-4 mr-1" />
                        {quiz.gradeLevel.replace('GRADE_', 'Grade ')}
                      </div>
                      <div className="flex items-center">
                        <TrophyIcon className="h-4 w-4 mr-1" />
                        {quiz.passingScore}% to pass
                      </div>
                    </div>

                    {/* Student Progress */}
                    {!isTeacher && (
                      <div className="mb-4">
                        {quiz.completed ? (
                          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center">
                              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                              <span className="text-sm font-medium text-green-700">Completed</span>
                            </div>
                            <span className={`text-sm font-bold ${getScoreColor(quiz.bestScore!, quiz.passingScore)}`}>
                              {quiz.bestScore}%
                            </span>
                          </div>
                        ) : quiz.attempts && quiz.attempts > 0 ? (
                          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                            <span className="text-sm font-medium text-yellow-700">
                              {quiz.attempts} attempt{quiz.attempts > 1 ? 's' : ''}
                            </span>
                            <span className={`text-sm font-bold ${getScoreColor(quiz.bestScore!, quiz.passingScore)}`}>
                              Best: {quiz.bestScore}%
                            </span>
                          </div>
                        ) : (
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <span className="text-sm font-medium text-blue-700">Not started</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {quiz.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {quiz.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{quiz.tags.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Action Button */}
                    <Link href={`/quizzes/${quiz.id}`}>
                      <Button fullWidth className="group">
                        <PlayIcon className="mr-2 h-4 w-4" />
                        {isTeacher ? 'Manage Quiz' : 'Take Quiz'}
                        <ChevronRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

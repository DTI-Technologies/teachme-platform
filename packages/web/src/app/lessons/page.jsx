'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpenIcon,
  ClockIcon,
  AcademicCapIcon,
  StarIcon,
  PlayIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { UserRole } from '@/types';
import Link from 'next/link';

interface Lesson {
  id: string;
  title: string;
  description: string;
  subject: string;
  gradeLevel: string;
  duration: number;
  difficulty: string;
  objectives: string[];
  tags: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  thumbnailUrl?: string;
}

const subjects = [
  'All Subjects',
  'Mathematics',
  'Science',
  'English',
  'History',
  'Geography',
  'Art'
];

const gradeLevels = [
  'All Grades',
  'KINDERGARTEN',
  'GRADE_1',
  'GRADE_2',
  'GRADE_3',
  'GRADE_4',
  'GRADE_5',
  'GRADE_6',
  'GRADE_7',
  'GRADE_8',
  'GRADE_9',
  'GRADE_10',
  'GRADE_11',
  'GRADE_12'
];

const difficulties = [
  'All Levels',
  'beginner',
  'intermediate',
  'advanced'
];

// Helper function to format grade levels for display
const formatGradeLevel = (gradeLevel: string) => {
  if (gradeLevel === 'KINDERGARTEN') return 'Kindergarten';
  if (gradeLevel.startsWith('GRADE_')) {
    return `Grade ${gradeLevel.replace('GRADE_', '')}`;
  }
  return gradeLevel;
};

// Helper function to get age-appropriate display options for grade dropdown
const getGradeLevelOptions = () => {
  return gradeLevels.map(grade => ({
    value: grade,
    label: grade === 'All Grades' ? 'All Grades' : formatGradeLevel(grade)
  }));
};

const getMockLessons = (): Lesson[] => [
  // Elementary (K-5)
  {
    id: '1',
    title: 'Counting to 10',
    description: 'Learn to count from 1 to 10 with fun animals and colorful pictures!',
    subject: 'Mathematics',
    gradeLevel: 'KINDERGARTEN',
    difficulty: 'beginner',
    duration: 15,
    thumbnail: '/images/counting-lesson.jpg',
    isCompleted: false,
    progress: 0,
    rating: 4.9,
    enrolledStudents: 245,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    tags: ['counting', 'numbers', 'kindergarten']
  },
  {
    id: '2',
    title: 'Introduction to Fractions',
    description: 'Learn the basics of fractions with visual examples and interactive exercises.',
    subject: 'Mathematics',
    gradeLevel: 'GRADE_3',
    difficulty: 'beginner',
    duration: 30,
    thumbnail: '/images/fractions-lesson.jpg',
    isCompleted: false,
    progress: 0,
    rating: 4.8,
    enrolledStudents: 156,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    tags: ['fractions', 'basic-math', 'visual-learning']
  },
  {
    id: '3',
    title: 'The Water Cycle',
    description: 'Explore how water moves through our environment in this engaging science lesson.',
    subject: 'Science',
    gradeLevel: 'GRADE_4',
    difficulty: 'intermediate',
    duration: 45,
    thumbnail: '/images/water-cycle-lesson.jpg',
    isCompleted: true,
    progress: 100,
    rating: 4.9,
    enrolledStudents: 203,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
    tags: ['water-cycle', 'environment', 'earth-science']
  },
  // Middle School (6-8)
  {
    id: '4',
    title: 'Algebraic Expressions',
    description: 'Master the fundamentals of algebraic expressions and equation solving.',
    subject: 'Mathematics',
    gradeLevel: 'GRADE_7',
    difficulty: 'intermediate',
    duration: 50,
    thumbnail: '/images/algebra-lesson.jpg',
    isCompleted: false,
    progress: 15,
    rating: 4.6,
    enrolledStudents: 178,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-19'),
    tags: ['algebra', 'equations', 'middle-school']
  },
  {
    id: '5',
    title: 'Cell Structure and Function',
    description: 'Dive deep into the microscopic world of cells and their amazing functions.',
    subject: 'Biology',
    gradeLevel: 'GRADE_8',
    difficulty: 'intermediate',
    duration: 55,
    thumbnail: '/images/cell-biology-lesson.jpg',
    isCompleted: false,
    progress: 0,
    rating: 4.7,
    enrolledStudents: 134,
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-21'),
    tags: ['biology', 'cells', 'microscopy']
  },
  // High School (9-12)
  {
    id: '6',
    title: 'Quadratic Functions',
    description: 'Advanced study of quadratic functions, graphing, and real-world applications.',
    subject: 'Algebra II',
    gradeLevel: 'GRADE_10',
    difficulty: 'advanced',
    duration: 60,
    thumbnail: '/images/quadratic-lesson.jpg',
    isCompleted: false,
    progress: 0,
    rating: 4.5,
    enrolledStudents: 92,
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-22'),
    tags: ['quadratic', 'functions', 'graphing', 'algebra']
  },
  {
    id: '7',
    title: 'Chemical Bonding',
    description: 'Explore ionic and covalent bonds, molecular structures, and chemical properties.',
    subject: 'Chemistry',
    gradeLevel: 'GRADE_11',
    difficulty: 'advanced',
    duration: 65,
    thumbnail: '/images/chemistry-lesson.jpg',
    isCompleted: false,
    progress: 0,
    rating: 4.8,
    enrolledStudents: 67,
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-23'),
    tags: ['chemistry', 'bonding', 'molecules', 'high-school']
  },
  {
    id: '8',
    title: 'AP Calculus: Derivatives',
    description: 'Master derivative calculations and applications for AP Calculus success.',
    subject: 'Calculus',
    gradeLevel: 'GRADE_12',
    difficulty: 'expert',
    duration: 70,
    thumbnail: '/images/calculus-lesson.jpg',
    isCompleted: false,
    progress: 0,
    rating: 4.9,
    enrolledStudents: 45,
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-24'),
    tags: ['calculus', 'derivatives', 'ap-prep', 'advanced-math']
  }
];

export default function LessonsPage() {
  const { user } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [selectedGrade, setSelectedGrade] = useState('All Grades');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All Levels');
  const [showFilters, setShowFilters] = useState(false);

  const isTeacher = user?.role === UserRole.TEACHER;

  useEffect(() => {
    fetchLessons();
  }, [selectedSubject, selectedGrade, selectedDifficulty, searchTerm]);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (selectedSubject !== 'All Subjects') {
        params.append('subject', selectedSubject);
      }
      if (selectedGrade !== 'All Grades') {
        params.append('gradeLevel', selectedGrade);
      }
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      if (isTeacher) {
        params.append('createdBy', user?.id || '');
      }

      const response = await fetch(`/api/lessons?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setLessons(data.data.lessons);
      } else {
        // Fallback to mock data
        setLessons(getMockLessons());
      }
    } catch (error) {
      console.error('Error fetching lessons:', error);
      // Fallback to mock data when API fails
      setLessons(getMockLessons());
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'text-green-600 bg-green-100';
      case 'intermediate':
        return 'text-yellow-600 bg-yellow-100';
      case 'advanced':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case 'Mathematics':
        return 'text-blue-600 bg-blue-100';
      case 'Science':
        return 'text-green-600 bg-green-100';
      case 'English':
        return 'text-purple-600 bg-purple-100';
      case 'History':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isTeacher ? 'My Lessons' : 'Lessons'}
            </h1>
            <p className="text-gray-600">
              {isTeacher 
                ? 'Create and manage your educational content'
                : 'Explore engaging lessons tailored to your learning journey'
              }
            </p>
          </div>
          {isTeacher && (
            <Link href="/lessons/create">
              <Button className="mt-4 sm:mt-0">
                <PlusIcon className="mr-2 h-5 w-5" />
                Create Lesson
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
                  placeholder="Search lessons..."
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
                    {getGradeLevelOptions().map(grade => (
                      <option key={grade.value} value={grade.value}>{grade.label}</option>
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
                      {getGradeLevelOptions().map(grade => (
                        <option key={grade.value} value={grade.value}>{grade.label}</option>
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

        {/* Lessons Grid */}
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
        ) : lessons.length === 0 ? (
          <Card className="text-center py-12">
            <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No lessons found</h3>
            <p className="text-gray-600 mb-6">
              {isTeacher 
                ? "You haven't created any lessons yet. Start by creating your first lesson!"
                : "No lessons match your current filters. Try adjusting your search criteria."
              }
            </p>
            {isTeacher && (
              <Link href="/lessons/create">
                <Button>
                  <PlusIcon className="mr-2 h-5 w-5" />
                  Create Your First Lesson
                </Button>
              </Link>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-200">
                  {/* Lesson Thumbnail */}
                  <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-lg relative overflow-hidden">
                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSubjectColor(lesson.subject)}`}>
                          {lesson.subject}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(lesson.difficulty)}`}>
                          {lesson.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Lesson Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {lesson.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                      {lesson.description}
                    </p>

                    {/* Lesson Meta */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {lesson.duration} min
                      </div>
                      <div className="flex items-center">
                        <AcademicCapIcon className="h-4 w-4 mr-1" />
                        {formatGradeLevel(lesson.gradeLevel)}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {lesson.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {lesson.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{lesson.tags.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Action Button */}
                    <Link href={`/lessons/${lesson.id}`}>
                      <Button fullWidth className="group">
                        <PlayIcon className="mr-2 h-4 w-4" />
                        {isTeacher ? 'Edit Lesson' : 'Start Lesson'}
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

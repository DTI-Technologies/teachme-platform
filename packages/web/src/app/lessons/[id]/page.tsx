'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  BookOpenIcon,
  ClockIcon,
  AcademicCapIcon,
  PlayIcon,
  CheckCircleIcon,
  LightBulbIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon,
  ArrowLeftIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { UserRole } from '@teachme/shared';
import Link from 'next/link';

interface LessonDetail {
  id: string;
  title: string;
  description: string;
  subject: string;
  gradeLevel: string;
  duration: number;
  difficulty: string;
  objectives: string[];
  content: {
    introduction: string;
    mainContent: ContentBlock[];
    conclusion: string;
    vocabulary: VocabularyTerm[];
  };
  activities: Activity[];
  assessments: Assessment[];
  resources: Resource[];
  tags: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
}

interface ContentBlock {
  id: string;
  type: string;
  content: string;
  order: number;
  metadata?: any;
}

interface VocabularyTerm {
  term: string;
  definition: string;
  examples: string[];
}

interface Activity {
  id: string;
  name: string;
  type: string;
  description: string;
  instructions: string;
  estimatedTime: number;
  materials: string[];
}

interface Assessment {
  id: string;
  title: string;
  type: string;
  questions: any[];
  timeLimit: number;
  attempts: number;
  passingScore: number;
}

interface Resource {
  id: string;
  name: string;
  type: string;
  url: string;
}

export default function LessonDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const isTeacher = user?.role === UserRole.TEACHER;
  const lessonId = params.id as string;

  useEffect(() => {
    if (lessonId) {
      fetchLesson();
    }
  }, [lessonId]);

  const fetchLesson = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/lessons/${lessonId}`);
      const data = await response.json();

      if (data.success) {
        setLesson(data.data);
      }
    } catch (error) {
      console.error('Error fetching lesson:', error);
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

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BookOpenIcon },
    { id: 'content', name: 'Content', icon: DocumentTextIcon },
    { id: 'activities', name: 'Activities', icon: LightBulbIcon },
    { id: 'assessments', name: 'Assessments', icon: QuestionMarkCircleIcon },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-8"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!lesson) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto p-6">
          <Card className="text-center py-12">
            <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Lesson not found</h3>
            <p className="text-gray-600 mb-6">The lesson you're looking for doesn't exist.</p>
            <Link href="/lessons">
              <Button>
                <ArrowLeftIcon className="mr-2 h-5 w-5" />
                Back to Lessons
              </Button>
            </Link>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <Link href="/lessons" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Lessons
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSubjectColor(lesson.subject)}`}>
                  {lesson.subject}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(lesson.difficulty)}`}>
                  {lesson.difficulty}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">{lesson.title}</h1>
              <p className="text-lg text-gray-600 mb-6">{lesson.description}</p>

              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <ClockIcon className="h-5 w-5 mr-2" />
                  {lesson.duration} minutes
                </div>
                <div className="flex items-center">
                  <AcademicCapIcon className="h-5 w-5 mr-2" />
                  {lesson.gradeLevel.replace('GRADE_', 'Grade ')}
                </div>
                <div className="flex items-center">
                  <StarIcon className="h-5 w-5 mr-2" />
                  4.8 rating
                </div>
              </div>
            </div>

            <div className="lg:w-80">
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Objectives</h3>
                  <ul className="space-y-2">
                    {lesson.objectives.map((objective, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{objective}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-6">
                    <Button fullWidth size="lg">
                      <PlayIcon className="mr-2 h-5 w-5" />
                      {isTeacher ? 'Preview Lesson' : 'Start Learning'}
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="mr-2 h-4 w-4" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Introduction</h3>
                  <p className="text-gray-700">{lesson.content.introduction}</p>
                </div>
              </Card>

              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Vocabulary</h3>
                  <div className="space-y-4">
                    {lesson.content.vocabulary.map((term, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-medium text-gray-900">{term.term}</h4>
                        <p className="text-sm text-gray-600 mt-1">{term.definition}</p>
                        {term.examples.length > 0 && (
                          <p className="text-xs text-gray-500 mt-1">
                            Examples: {term.examples.join(', ')}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="space-y-6">
              {lesson.content.mainContent.map((block, index) => (
                <motion.div
                  key={block.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                          {index + 1}
                        </div>
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full capitalize">
                          {block.type}
                        </span>
                      </div>
                      <div className="prose max-w-none">
                        <p>{block.content}</p>
                        {block.type === 'interactive' && (
                          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                            <p className="text-blue-800 text-sm">
                              🎮 Interactive element: {block.metadata?.interactiveType || 'Interactive content'}
                            </p>
                          </div>
                        )}
                        {block.type === 'quiz' && (
                          <div className="mt-4 p-4 bg-green-50 rounded-lg">
                            <p className="text-green-800 text-sm">
                              ❓ Quick Check: This is a knowledge check point
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'activities' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {lesson.activities.map((activity, index) => (
                <Card key={activity.id}>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{activity.name}</h3>
                      <span className="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full capitalize">
                        {activity.type.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{activity.description}</p>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Instructions:</h4>
                        <p className="text-sm text-gray-700">{activity.instructions}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Materials:</h4>
                        <ul className="text-sm text-gray-700 list-disc list-inside">
                          {activity.materials.map((material, idx) => (
                            <li key={idx}>{material}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {activity.estimatedTime} minutes
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'assessments' && (
            <div className="space-y-6">
              {lesson.assessments.map((assessment, index) => (
                <Card key={assessment.id}>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{assessment.title}</h3>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-600 text-xs rounded-full capitalize">
                        {assessment.type}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-900">Questions:</span>
                        <span className="ml-2 text-gray-600">{assessment.questions.length}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">Time Limit:</span>
                        <span className="ml-2 text-gray-600">{assessment.timeLimit} minutes</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">Passing Score:</span>
                        <span className="ml-2 text-gray-600">{assessment.passingScore}%</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button variant="outline">
                        {isTeacher ? 'Preview Assessment' : 'Take Assessment'}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

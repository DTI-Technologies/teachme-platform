'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  UsersIcon,
  BookOpenIcon,
  ClockIcon,
  TrophyIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { UserRole } from '@teachme/shared';
import Link from 'next/link';

interface TeacherAnalytics {
  overview: {
    totalStudents: number;
    totalLessons: number;
    averageCompletion: number;
    averageScore: number;
    totalTimeSpent: number;
    activeStudents: number;
  };
  lessonPerformance: Array<{
    lessonId: string;
    title: string;
    studentsEnrolled: number;
    studentsCompleted: number;
    averageScore: number;
    averageTime: number;
    completionRate: number;
  }>;
  studentProgress: Array<{
    studentId: string;
    studentName: string;
    lessonsCompleted: number;
    averageScore: number;
    timeSpent: number;
    lastActive: Date;
  }>;
  strugglingStudents: Array<{
    studentId: string;
    studentName: string;
    lessonId: string;
    lessonTitle: string;
    timeStuck: number;
    attempts: number;
    needsHelp: boolean;
  }>;
}

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<TeacherAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const isTeacher = user?.role === UserRole.TEACHER;

  useEffect(() => {
    if (user?.id && isTeacher) {
      fetchAnalytics();
    }
  }, [user?.id, isTeacher]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics/teacher/${user?.id}`);
      const data = await response.json();

      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: ChartBarIcon },
    { id: 'lessons', name: 'Lesson Performance', icon: BookOpenIcon },
    { id: 'students', name: 'Student Progress', icon: UsersIcon },
  ];

  if (!isTeacher) {
    return (
      <DashboardLayout>
        <div className="max-w-6xl mx-auto p-6">
          <Card className="text-center py-12">
            <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-yellow-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h3>
            <p className="text-gray-600">This page is only available for teachers.</p>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-6xl mx-auto p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!analytics) {
    return (
      <DashboardLayout>
        <div className="max-w-6xl mx-auto p-6">
          <Card className="text-center py-12">
            <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No analytics data found</h3>
            <p className="text-gray-600">Create lessons and enroll students to see analytics.</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Teaching Analytics</h1>
          <p className="text-gray-600">
            Monitor student progress and lesson performance
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <UsersIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.overview.totalStudents}
                  </p>
                  <p className="text-xs text-green-600">
                    {analytics.overview.activeStudents} active
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <BookOpenIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Lessons</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.overview.totalLessons}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrophyIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg. Score</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.overview.averageScore}%
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <CheckCircleIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.overview.averageCompletion}%
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <ClockIcon className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Time</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatTime(analytics.overview.totalTimeSpent)}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Need Help</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.strugglingStudents.length}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Struggling Students Alert */}
        {analytics.strugglingStudents.length > 0 && (
          <Card className="mb-8 border-l-4 border-red-500">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Students Need Help</h3>
              </div>
              <div className="space-y-3">
                {analytics.strugglingStudents.map((student) => (
                  <div key={student.studentId} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{student.studentName}</p>
                      <p className="text-sm text-gray-600">
                        Stuck on "{student.lessonTitle}" for {student.timeStuck} minutes
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      Help Student
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

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
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Class Performance</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Average Completion Rate</span>
                        <span>{analytics.overview.averageCompletion}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${analytics.overview.averageCompletion}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Average Score</span>
                        <span>{analytics.overview.averageScore}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${analytics.overview.averageScore}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Activity</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Active Students</span>
                      <span className="text-lg font-semibold text-green-600">
                        {analytics.overview.activeStudents}/{analytics.overview.totalStudents}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Learning Time</span>
                      <span className="text-lg font-semibold text-blue-600">
                        {formatTime(analytics.overview.totalTimeSpent)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Students Needing Help</span>
                      <span className="text-lg font-semibold text-red-600">
                        {analytics.strugglingStudents.length}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'lessons' && (
            <div className="space-y-6">
              {analytics.lessonPerformance.map((lesson, index) => (
                <motion.div
                  key={lesson.lessonId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{lesson.title}</h3>
                        <Link href={`/lessons/${lesson.lessonId}`}>
                          <Button variant="outline" size="sm">
                            <EyeIcon className="mr-2 h-4 w-4" />
                            View Lesson
                          </Button>
                        </Link>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-600">{lesson.studentsEnrolled}</p>
                          <p className="text-sm text-gray-600">Enrolled</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">{lesson.studentsCompleted}</p>
                          <p className="text-sm text-gray-600">Completed</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-purple-600">{lesson.averageScore}%</p>
                          <p className="text-sm text-gray-600">Avg Score</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-orange-600">{formatTime(lesson.averageTime)}</p>
                          <p className="text-sm text-gray-600">Avg Time</p>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Completion Rate</span>
                          <span>{lesson.completionRate}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${lesson.completionRate}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'students' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {analytics.studentProgress.map((student, index) => (
                <motion.div
                  key={student.studentId}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">{student.studentName}</h3>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Lessons Completed</span>
                          <span className="font-medium">{student.lessonsCompleted}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Average Score</span>
                          <span className="font-medium">{student.averageScore}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Time Spent</span>
                          <span className="font-medium">{formatTime(student.timeSpent)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Last Active</span>
                          <span className="font-medium text-xs">
                            {new Date(student.lastActive).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4">
                        <Button variant="outline" size="sm" fullWidth>
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

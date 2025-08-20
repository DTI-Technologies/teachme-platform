'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  UserGroupIcon,
  PlusIcon,
  BookOpenIcon,
  AcademicCapIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';

// JavaScript doesn't need interface definitions

// JavaScript doesn't need interface definitions

export default function ClassDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('students');

  useEffect(() => {
    if (params.id) {
      fetchClassDetails(params.id as string);
    }
  }, [params.id]);

  const fetchClassDetails = async (classId: string) => {
    try {
      setLoading(true);
      
      // Mock class details data
      const mockClassData: ClassDetails = {
        id: classId,
        name: 'Advanced Mathematics',
        description: 'Algebra, Geometry, and Calculus for Grade 10',
        subject: 'MATHEMATICS',
        gradeLevel: 'GRADE_10',
        schedule: {
          days: ['monday', 'wednesday', 'friday'],
          startTime: '09:00',
          endTime: '10:30'
        },
        stats: {
          totalStudents: 28,
          activeStudents: 25,
          averageProgress: 78,
          completionRate: 85
        },
        students: [
          {
            id: '1',
            name: 'Alice Johnson',
            email: 'alice@student.com',
            avatar: '👩‍🎓',
            progress: 92,
            lastActive: new Date('2024-01-22'),
            lessonsCompleted: 14,
            quizzesCompleted: 7,
            averageScore: 94,
            status: 'active'
          },
          {
            id: '2',
            name: 'Bob Smith',
            email: 'bob@student.com',
            avatar: '👨‍🎓',
            progress: 78,
            lastActive: new Date('2024-01-21'),
            lessonsCompleted: 12,
            quizzesCompleted: 6,
            averageScore: 82,
            status: 'active'
          },
          {
            id: '3',
            name: 'Carol Davis',
            email: 'carol@student.com',
            avatar: '👩‍💻',
            progress: 45,
            lastActive: new Date('2024-01-18'),
            lessonsCompleted: 7,
            quizzesCompleted: 3,
            averageScore: 65,
            status: 'struggling'
          },
          {
            id: '4',
            name: 'David Wilson',
            email: 'david@student.com',
            avatar: '👨‍💼',
            progress: 88,
            lastActive: new Date('2024-01-22'),
            lessonsCompleted: 13,
            quizzesCompleted: 8,
            averageScore: 89,
            status: 'active'
          }
        ],
        assignments: [
          {
            id: '1',
            title: 'Quadratic Equations',
            type: 'lesson',
            dueDate: new Date('2024-01-25'),
            completedBy: 22,
            totalStudents: 28
          },
          {
            id: '2',
            title: 'Algebra Quiz #3',
            type: 'quiz',
            dueDate: new Date('2024-01-23'),
            completedBy: 25,
            totalStudents: 28,
            averageScore: 84
          },
          {
            id: '3',
            title: 'Geometry Fundamentals',
            type: 'lesson',
            dueDate: new Date('2024-01-28'),
            completedBy: 8,
            totalStudents: 28
          }
        ]
      };

      setClassData(mockClassData);
    } catch (error) {
      console.error('Error fetching class details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'struggling':
        return 'text-red-600 bg-red-100';
      case 'inactive':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const tabs = [
    { id: 'students', name: 'Students', icon: UserGroupIcon },
    { id: 'assignments', name: 'Assignments', icon: BookOpenIcon },
    { id: 'analytics', name: 'Analytics', icon: ChartBarIcon },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!classData) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto p-6">
          <Card className="text-center py-12">
            <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Class not found</h3>
            <p className="text-gray-600 mb-4">The class you're looking for doesn't exist.</p>
            <Link href="/classes">
              <Button>Back to Classes</Button>
            </Link>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link href="/classes">
              <Button variant="outline" size="sm">
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Back to Classes
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{classData.name}</h1>
              <p className="text-gray-600">{classData.description}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <span>📚 {classData.subject}</span>
                <span>🎓 {classData.gradeLevel.replace('GRADE_', 'Grade ')}</span>
                <span>👥 {classData.stats.totalStudents} students</span>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">
                <PencilIcon className="mr-2 h-4 w-4" />
                Edit Class
              </Button>
              <Button>
                <PlusIcon className="mr-2 h-4 w-4" />
                Add Students
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <UserGroupIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">{classData.stats.totalStudents}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Students</p>
                  <p className="text-2xl font-bold text-gray-900">{classData.stats.activeStudents}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <ChartBarIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Progress</p>
                  <p className="text-2xl font-bold text-gray-900">{classData.stats.averageProgress}%</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <AcademicCapIcon className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{classData.stats.completionRate}%</p>
                </div>
              </div>
            </div>
          </Card>
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
        <div>
          {activeTab === 'students' && (
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Students</h3>
                  <Button size="sm">
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Add Student
                  </Button>
                </div>

                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Progress
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Performance
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Active
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {classData.students.map((student) => (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="text-2xl mr-3">{student.avatar}</div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                <div className="text-sm text-gray-500">{student.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${student.progress}%` }}
                                ></div>
                              </div>
                              <span className={`text-sm font-medium ${getProgressColor(student.progress)}`}>
                                {student.progress}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {student.lessonsCompleted} lessons, {student.quizzesCompleted} quizzes
                            </div>
                            <div className="text-sm text-gray-500">
                              Avg: {student.averageScore}%
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(student.lastActive)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(student.status)}`}>
                              {student.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <EyeIcon className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <PencilIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'assignments' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Assignments</h3>
                <Button>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Create Assignment
                </Button>
              </div>

              <div className="grid gap-4">
                {classData.assignments.map((assignment) => (
                  <Card key={assignment.id}>
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`p-2 rounded-lg ${
                            assignment.type === 'lesson' ? 'bg-blue-100' : 'bg-green-100'
                          }`}>
                            {assignment.type === 'lesson' ? (
                              <BookOpenIcon className={`h-6 w-6 ${
                                assignment.type === 'lesson' ? 'text-blue-600' : 'text-green-600'
                              }`} />
                            ) : (
                              <AcademicCapIcon className="h-6 w-6 text-green-600" />
                            )}
                          </div>
                          <div>
                            <h4 className="text-lg font-medium text-gray-900">{assignment.title}</h4>
                            <p className="text-sm text-gray-600">
                              Due: {formatDate(assignment.dueDate)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-lg font-semibold text-gray-900">
                            {assignment.completedBy}/{assignment.totalStudents}
                          </div>
                          <div className="text-sm text-gray-600">completed</div>
                          {assignment.averageScore && (
                            <div className="text-sm text-gray-600">
                              Avg: {assignment.averageScore}%
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(assignment.completedBy / assignment.totalStudents) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Class Performance</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Average Progress</span>
                      <span className="text-sm font-medium">{classData.stats.averageProgress}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Completion Rate</span>
                      <span className="text-sm font-medium">{classData.stats.completionRate}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Active Students</span>
                      <span className="text-sm font-medium">{classData.stats.activeStudents}/{classData.stats.totalStudents}</span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">5 students completed Algebra Quiz #3</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">New lesson assigned: Quadratic Equations</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">3 students need help with homework</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

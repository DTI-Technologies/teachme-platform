'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  UserGroupIcon,
  AcademicCapIcon,
  ChartBarIcon,
  ClockIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  UsersIcon,
  BookOpenIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import DashboardLayout from '@/components/layout/DashboardLayout';
import CreateClassModal from '@/components/classes/CreateClassModal';

// JavaScript doesn't need interface definitions

export default function ClassesPage() {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    if (user?.id) {
      fetchClasses();
    }
  }, [user?.id]);

  const fetchClasses = async () => {
    try {
      setLoading(true);

      if (!user?.id) {
        console.log('No user ID available');
        // Use mock data when no user
        setClasses(getMockClasses());
        return;
      }

      // Try to fetch real classes data
      try {
        const response = await fetch(`/api/classes?teacherId=${user.id}`);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setClasses(data.data);
        } else {
          console.error('API returned error:', data.error);
          setClasses(getMockClasses());
        }
      } catch (fetchError) {
        console.error('Database not available, using mock data:', fetchError);
        setClasses(getMockClasses());
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
      setClasses(getMockClasses());
    } finally {
      setLoading(false);
    }
  };

  const getMockClasses = (): Class[] => [
    {
      id: '1',
      name: 'Advanced Mathematics',
      description: 'Algebra, Geometry, and Calculus for Grade 10',
      subject: 'MATHEMATICS',
      gradeLevel: 'GRADE_10',
      studentCount: 28,
      lessonsAssigned: 15,
      quizzesAssigned: 8,
      averageProgress: 78,
      isActive: true,
      createdAt: new Date('2024-01-15'),
      recentActivity: '3 students completed Quiz 5'
    },
    {
      id: '2',
      name: 'Biology Fundamentals',
      description: 'Introduction to Life Sciences',
      subject: 'SCIENCE',
      gradeLevel: 'GRADE_9',
      studentCount: 24,
      lessonsAssigned: 12,
      quizzesAssigned: 6,
      averageProgress: 85,
      isActive: true,
      createdAt: new Date('2024-01-20'),
      recentActivity: 'New lesson assigned: Cell Structure'
    },
    {
      id: '3',
      name: 'English Literature',
      description: 'Classic and Modern Literature Analysis',
      subject: 'ENGLISH',
      gradeLevel: 'GRADE_11',
      studentCount: 22,
      lessonsAssigned: 18,
      quizzesAssigned: 10,
      averageProgress: 72,
      isActive: true,
      createdAt: new Date('2024-01-10'),
      recentActivity: '5 students need help with Essay Assignment'
    }
  ];

  const handleCreateClass = async (classData: any) => {
    try {
      console.log('Creating class:', classData);

      if (!user?.id) {
        alert('User not authenticated');
        return;
      }

      const response = await fetch('/api/classes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: classData.name,
          description: classData.description,
          subject: classData.subject,
          gradeLevel: classData.gradeLevel,
          teacherId: user.id,
          maxStudents: classData.maxStudents || 30
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Refresh the classes list
        await fetchClasses();
        setShowCreateModal(false);
        alert('Class created successfully!');
      } else {
        console.error('Failed to create class:', data.error);
        alert('Failed to create class. Please try again.');
      }
    } catch (error) {
      console.error('Error creating class:', error);
      alert('Failed to create class. Please try again.');
    }
  };

  const getSubjectIcon = (subject: string) => {
    switch (subject) {
      case 'MATHEMATICS':
        return '🧮';
      case 'SCIENCE':
        return '🔬';
      case 'ENGLISH':
        return '📚';
      case 'HISTORY':
        return '🏛️';
      default:
        return '📖';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600 bg-green-100';
    if (progress >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const formatGradeLevel = (gradeLevel: string) => {
    if (gradeLevel === 'KINDERGARTEN') return 'Kindergarten';
    return gradeLevel.replace('GRADE_', 'Grade ');
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Classes</h1>
              <p className="text-gray-600">Manage your classes and track student progress</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}
                >
                  <div className="grid grid-cols-2 gap-1 w-4 h-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="bg-gray-400 rounded-sm"></div>
                    ))}
                  </div>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
                >
                  <div className="space-y-1 w-4 h-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="bg-gray-400 h-1 rounded"></div>
                    ))}
                  </div>
                </button>
              </div>
              <Button onClick={() => setShowCreateModal(true)}>
                <PlusIcon className="mr-2 h-4 w-4" />
                Create Class
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <UserGroupIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Classes</p>
                  <p className="text-2xl font-bold text-gray-900">{classes.filter(c => c.isActive).length}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <UsersIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {classes.reduce((sum, c) => sum + c.studentCount, 0)}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <BookOpenIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Lessons Assigned</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {classes.reduce((sum, c) => sum + c.lessonsAssigned, 0)}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <ChartBarIcon className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Progress</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round(classes.reduce((sum, c) => sum + c.averageProgress, 0) / classes.length)}%
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Classes Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((classItem, index) => (
              <motion.div
                key={classItem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`hover:shadow-lg transition-shadow ${!classItem.isActive ? 'opacity-60' : ''}`}>
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{getSubjectIcon(classItem.subject)}</div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{classItem.name}</h3>
                          <p className="text-sm text-gray-600">{formatGradeLevel(classItem.gradeLevel)}</p>
                        </div>
                      </div>
                      <div className="relative">
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <EllipsisVerticalIcon className="h-5 w-5 text-gray-400" />
                        </button>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{classItem.description}</p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">{classItem.studentCount}</p>
                        <p className="text-xs text-gray-600">Students</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">{classItem.lessonsAssigned}</p>
                        <p className="text-xs text-gray-600">Lessons</p>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Average Progress</span>
                        <span className={`font-medium px-2 py-1 rounded-full text-xs ${getProgressColor(classItem.averageProgress)}`}>
                          {classItem.averageProgress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${classItem.averageProgress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-1">Recent Activity</p>
                      <p className="text-sm text-gray-700">{classItem.recentActivity}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <EyeIcon className="mr-1 h-4 w-4" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <UsersIcon className="mr-1 h-4 w-4" />
                        Students
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card>
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Class
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Students
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progress
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Activity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {classes.map((classItem) => (
                    <tr key={classItem.id} className={!classItem.isActive ? 'opacity-60' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-xl mr-3">{getSubjectIcon(classItem.subject)}</div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{classItem.name}</div>
                            <div className="text-sm text-gray-500">{formatGradeLevel(classItem.gradeLevel)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{classItem.studentCount}</div>
                        <div className="text-sm text-gray-500">{classItem.lessonsAssigned} lessons</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${classItem.averageProgress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-900">{classItem.averageProgress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">{classItem.recentActivity}</div>
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
          </Card>
        )}

        {/* Create Class Modal */}
        <CreateClassModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateClass}
        />
      </div>
    </DashboardLayout>
  );
}

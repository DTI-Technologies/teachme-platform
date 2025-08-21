'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  UserGroupIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  TrophyIcon,
  AcademicCapIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  FunnelIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import DashboardLayout from '@/components/layout/DashboardLayout';

// interface StudentProgress {
//   id: string;
//   name: string;
//   email: string;
//   avatar: string;
//   class: string;
//   classId: string;
//   overallProgress: number;
//   lessonsCompleted: number;
//   totalLessons: number;
//   quizzesCompleted: number;
//   totalQuizzes: number;
//   averageScore: number;
//   lastActive: Date;
//   status: 'excellent' | 'good' | 'struggling' | 'inactive';
//   recentActivity: string;
//   timeSpent: number; // in minutes
//   streak: number;
//   achievements: number;
// }

export default function StudentsPage() {
  const { user } = useAuth();
  const [students, setStudents] = useState<StudentProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [classFilter, setClassFilter] = useState('all');

  useEffect(() => {
    if (user?.id) {
      fetchStudentProgress();
    }
  }, [user?.id]);

  const fetchStudentProgress = async () => {
    try {
      setLoading(true);

      if (!user?.id) {
        console.log('No user ID available');
        setStudents(getMockStudents());
        return;
      }

      // Try to fetch real student data (when database is available)
      try {
        const response = await fetch(`/api/students/progress?teacherId=${user.id}`);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setStudents(data.data);
        } else {
          console.error('API returned error:', data.error);
          setStudents(getMockStudents());
        }
      } catch (fetchError) {
        console.error('Database not available, using mock data:', fetchError);
        setStudents(getMockStudents());
      }
    } catch (error) {
      console.error('Error fetching student progress:', error);
      setStudents(getMockStudents());
    } finally {
      setLoading(false);
    }
  };

  const getMockStudents = (): StudentProgress[] => [
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice@student.com',
      avatar: '👩‍🎓',
      class: 'Advanced Mathematics',
      classId: '1',
      overallProgress: 92,
      lessonsCompleted: 14,
      totalLessons: 15,
      quizzesCompleted: 7,
      totalQuizzes: 8,
      averageScore: 94,
      lastActive: new Date('2024-01-22T10:30:00'),
      status: 'excellent',
      recentActivity: 'Completed Quadratic Equations lesson',
      timeSpent: 480,
      streak: 12,
      achievements: 8
    },
    {
      id: '2',
      name: 'Bob Smith',
      email: 'bob@student.com',
      avatar: '👨‍🎓',
      class: 'Advanced Mathematics',
      classId: '1',
      overallProgress: 78,
      lessonsCompleted: 12,
      totalLessons: 15,
      quizzesCompleted: 6,
      totalQuizzes: 8,
      averageScore: 82,
      lastActive: new Date('2024-01-21T15:45:00'),
      status: 'good',
      recentActivity: 'Scored 85% on Algebra Quiz #3',
      timeSpent: 360,
      streak: 5,
      achievements: 4
    },
    {
      id: '3',
      name: 'Carol Davis',
      email: 'carol@student.com',
      avatar: '👩‍💻',
      class: 'Biology Fundamentals',
      classId: '2',
      overallProgress: 45,
      lessonsCompleted: 7,
      totalLessons: 12,
      quizzesCompleted: 3,
      totalQuizzes: 6,
      averageScore: 65,
      lastActive: new Date('2024-01-18T09:15:00'),
      status: 'struggling',
      recentActivity: 'Needs help with Cell Structure quiz',
      timeSpent: 180,
      streak: 0,
      achievements: 1
    },
    {
      id: '4',
      name: 'David Wilson',
      email: 'david@student.com',
      avatar: '👨‍💼',
      class: 'English Literature',
      classId: '3',
      overallProgress: 88,
      lessonsCompleted: 16,
      totalLessons: 18,
      quizzesCompleted: 8,
      totalQuizzes: 10,
      averageScore: 89,
      lastActive: new Date('2024-01-22T14:20:00'),
      status: 'excellent',
      recentActivity: 'Submitted excellent essay on Shakespeare',
      timeSpent: 520,
      streak: 8,
      achievements: 6
    },
    {
      id: '5',
      name: 'Emma Wilson',
      email: 'emma@student.com',
      avatar: '👩‍🔬',
      class: 'Biology Fundamentals',
      classId: '2',
      overallProgress: 15,
      lessonsCompleted: 2,
      totalLessons: 12,
      quizzesCompleted: 0,
      totalQuizzes: 6,
      averageScore: 0,
      lastActive: new Date('2024-01-10T11:00:00'),
      status: 'inactive',
      recentActivity: 'No recent activity',
      timeSpent: 45,
      streak: 0,
      achievements: 0
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent':
        return 'text-green-700 bg-green-100 border-green-200';
      case 'good':
        return 'text-blue-700 bg-blue-100 border-blue-200';
      case 'struggling':
        return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'inactive':
        return 'text-red-700 bg-red-100 border-red-200';
      default:
        return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'excellent':
        return <TrophyIcon className="h-4 w-4" />;
      case 'good':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'struggling':
        return <ExclamationTriangleIcon className="h-4 w-4" />;
      case 'inactive':
        return <ClockIcon className="h-4 w-4" />;
      default:
        return <UserGroupIcon className="h-4 w-4" />;
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatLastActive = (date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.class.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    const matchesClass = classFilter === 'all' || student.classId === classFilter;
    
    return matchesSearch && matchesStatus && matchesClass;
  });

  const statusCounts = {
    excellent: students.filter(s => s.status === 'excellent').length,
    good: students.filter(s => s.status === 'good').length,
    struggling: students.filter(s => s.status === 'struggling').length,
    inactive: students.filter(s => s.status === 'inactive').length
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded"></div>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Progress</h1>
          <p className="text-gray-600">Monitor and support your students' learning journey</p>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrophyIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Excellent</p>
                  <p className="text-2xl font-bold text-gray-900">{statusCounts.excellent}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CheckCircleIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Good Progress</p>
                  <p className="text-2xl font-bold text-gray-900">{statusCounts.good}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Struggling</p>
                  <p className="text-2xl font-bold text-gray-900">{statusCounts.struggling}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <ClockIcon className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Inactive</p>
                  <p className="text-2xl font-bold text-gray-900">{statusCounts.inactive}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search students..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Statuses</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good Progress</option>
                  <option value="struggling">Struggling</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                <select
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Classes</option>
                  <option value="1">Advanced Mathematics</option>
                  <option value="2">Biology Fundamentals</option>
                  <option value="3">English Literature</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* Student List */}
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Students ({filteredStudents.length})
              </h3>
            </div>

            <div className="space-y-4">
              {filteredStudents.map((student, index) => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">{student.avatar}</div>
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{student.name}</h4>
                        <p className="text-sm text-gray-600">{student.email}</p>
                        <p className="text-sm text-gray-500">{student.class}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      {/* Progress */}
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${getProgressColor(student.overallProgress)}`}>
                          {student.overallProgress}%
                        </div>
                        <div className="text-xs text-gray-500">Progress</div>
                      </div>

                      {/* Lessons */}
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900">
                          {student.lessonsCompleted}/{student.totalLessons}
                        </div>
                        <div className="text-xs text-gray-500">Lessons</div>
                      </div>

                      {/* Average Score */}
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900">
                          {student.averageScore}%
                        </div>
                        <div className="text-xs text-gray-500">Avg Score</div>
                      </div>

                      {/* Time Spent */}
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900">
                          {formatTime(student.timeSpent)}
                        </div>
                        <div className="text-xs text-gray-500">Time Spent</div>
                      </div>

                      {/* Status */}
                      <div className="text-center">
                        <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(student.status)}`}>
                          {getStatusIcon(student.status)}
                          <span className="ml-1 capitalize">{student.status}</span>
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <ChatBubbleLeftRightIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <EnvelopeIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Overall Progress</span>
                      <span>Last active: {formatLastActive(student.lastActive)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${student.overallProgress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="mt-3 text-sm text-gray-600">
                    <span className="font-medium">Recent: </span>
                    {student.recentActivity}
                  </div>
                </motion.div>
              ))}

              {filteredStudents.length === 0 && (
                <div className="text-center py-12">
                  <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
                  <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BookOpenIcon,
  ChartBarIcon,
  TrophyIcon,
  ClockIcon,
  SparklesIcon,
  UserGroupIcon,
  AcademicCapIcon,
  DocumentCheckIcon,
  UsersIcon,
  PresentationChartLineIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { UserRole } from '@teachme/shared';

const studentStats = [
  {
    name: 'Lessons Completed',
    value: '12',
    icon: BookOpenIcon,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    name: 'Current Streak',
    value: '5 days',
    icon: ClockIcon,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    name: 'XP Earned',
    value: '1,250',
    icon: SparklesIcon,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    name: 'Badges Earned',
    value: '8',
    icon: TrophyIcon,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
  },
];

const teacherStats = [
  {
    name: 'Students Taught',
    value: '127',
    icon: UsersIcon,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    name: 'Lessons Created',
    value: '34',
    icon: AcademicCapIcon,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    name: 'Assessments Graded',
    value: '89',
    icon: DocumentCheckIcon,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    name: 'Class Performance',
    value: '87%',
    icon: PresentationChartLineIcon,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
  },
];

const studentActivities = [
  {
    id: 1,
    type: 'lesson',
    title: 'Completed "Introduction to Fractions"',
    subject: 'Mathematics',
    time: '2 hours ago',
    score: 95,
  },
  {
    id: 2,
    type: 'badge',
    title: 'Earned "Math Explorer" badge',
    subject: 'Mathematics',
    time: '1 day ago',
    score: null,
  },
  {
    id: 3,
    type: 'lesson',
    title: 'Started "Solar System Basics"',
    subject: 'Science',
    time: '2 days ago',
    score: null,
  },
];

const teacherActivities = [
  {
    id: 1,
    type: 'lesson',
    title: 'Created new lesson: "Advanced Algebra"',
    subject: 'Mathematics',
    time: '3 hours ago',
    score: null,
  },
  {
    id: 2,
    type: 'grading',
    title: 'Graded 25 assignments for Math 101',
    subject: 'Mathematics',
    time: '1 day ago',
    score: 87,
  },
  {
    id: 3,
    type: 'improvement',
    title: 'Student Sarah improved by 15% this week',
    subject: 'Science',
    time: '2 days ago',
    score: 15,
  },
  {
    id: 4,
    type: 'meeting',
    title: 'Scheduled parent-teacher conference',
    subject: 'General',
    time: '3 days ago',
    score: null,
  },
];

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Get role-specific data
  const isTeacher = user.role === UserRole.TEACHER || user.role === 'TEACHER';

  const quickStats = isTeacher ? teacherStats : studentStats;
  const recentActivities = isTeacher ? teacherActivities : studentActivities;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user.name || user.firstName}! 👋
            </h1>
            <p className="text-blue-100 text-lg">
              {isTeacher
                ? "Ready to inspire and educate? Let's make learning amazing for your students!"
                : "Ready to continue your learning journey? Let's make today amazing!"
              }
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              {isTeacher ? (
                <>
                  <Link href="/lessons/create">
                    <Button
                      variant="outline"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <AcademicCapIcon className="mr-2 h-5 w-5" />
                      Create Lesson
                    </Button>
                  </Link>
                  <Link href="/classes">
                    <Button
                      variant="outline"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <UserGroupIcon className="mr-2 h-5 w-5" />
                      Manage Classes
                    </Button>
                  </Link>
                  <Link href="/students">
                    <Button
                      variant="outline"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <UsersIcon className="mr-2 h-5 w-5" />
                      View Students
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/tutor">
                    <Button
                      variant="outline"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <SparklesIcon className="mr-2 h-5 w-5" />
                      Start AI Tutoring
                    </Button>
                  </Link>
                  <Link href="/lessons">
                    <Button
                      variant="outline"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <BookOpenIcon className="mr-2 h-5 w-5" />
                      Browse Lessons
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {isTeacher ? 'Teaching Overview' : 'Your Progress'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickStats.map((stat, index) => (
              <motion.div
                key={stat.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
              >
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-center">
                    <div className={`${stat.bgColor} p-3 rounded-lg`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </div>
              <div className="space-y-4">
                {recentActivities.map((activity) => {
                  const getActivityIcon = () => {
                    switch (activity.type) {
                      case 'lesson':
                        return <BookOpenIcon className="h-5 w-5 text-blue-600" />;
                      case 'badge':
                        return <TrophyIcon className="h-5 w-5 text-yellow-600" />;
                      case 'grading':
                        return <DocumentCheckIcon className="h-5 w-5 text-purple-600" />;
                      case 'improvement':
                        return <PresentationChartLineIcon className="h-5 w-5 text-green-600" />;
                      case 'meeting':
                        return <UsersIcon className="h-5 w-5 text-indigo-600" />;
                      default:
                        return <BookOpenIcon className="h-5 w-5 text-blue-600" />;
                    }
                  };

                  const getActivityBgColor = () => {
                    switch (activity.type) {
                      case 'lesson':
                        return 'bg-blue-100';
                      case 'badge':
                        return 'bg-yellow-100';
                      case 'grading':
                        return 'bg-purple-100';
                      case 'improvement':
                        return 'bg-green-100';
                      case 'meeting':
                        return 'bg-indigo-100';
                      default:
                        return 'bg-blue-100';
                    }
                  };

                  return (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${getActivityBgColor()}`}>
                          {getActivityIcon()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{activity.title}</p>
                          <p className="text-sm text-gray-500">{activity.subject} • {activity.time}</p>
                        </div>
                      </div>
                      {activity.score && (
                        <div className="text-right">
                          <p className={`text-lg font-bold ${
                            activity.type === 'improvement' ? 'text-green-600' :
                            activity.type === 'grading' ? 'text-purple-600' : 'text-green-600'
                          }`}>
                            {activity.type === 'improvement' ? `+${activity.score}%` : `${activity.score}%`}
                          </p>
                          <p className="text-xs text-gray-500">
                            {activity.type === 'improvement' ? 'Improvement' :
                             activity.type === 'grading' ? 'Avg Score' : 'Score'}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
              <div className="space-y-4">
                {isTeacher ? (
                  <>
                    <Link href="/lessons/create">
                      <Button
                        fullWidth
                        variant="outline"
                        className="justify-start"
                      >
                        <AcademicCapIcon className="mr-3 h-5 w-5" />
                        Create New Lesson
                      </Button>
                    </Link>
                    <Link href="/quizzes/create">
                      <Button
                        fullWidth
                        variant="outline"
                        className="justify-start"
                      >
                        <DocumentCheckIcon className="mr-3 h-5 w-5" />
                        Create Quiz
                      </Button>
                    </Link>
                    <Link href="/classes">
                      <Button
                        fullWidth
                        variant="outline"
                        className="justify-start"
                      >
                        <UserGroupIcon className="mr-3 h-5 w-5" />
                        Manage Classes
                      </Button>
                    </Link>
                    <Link href="/analytics">
                      <Button
                        fullWidth
                        variant="outline"
                        className="justify-start"
                      >
                        <ChartBarIcon className="mr-3 h-5 w-5" />
                        View Analytics
                      </Button>
                    </Link>
                    <Link href="/students">
                      <Button
                        fullWidth
                        variant="outline"
                        className="justify-start"
                      >
                        <UsersIcon className="mr-3 h-5 w-5" />
                        Manage Students
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/tutor">
                      <Button
                        fullWidth
                        variant="outline"
                        className="justify-start"
                      >
                        <SparklesIcon className="mr-3 h-5 w-5" />
                        Ask AI Tutor
                      </Button>
                    </Link>
                    <Link href="/lessons">
                      <Button
                        fullWidth
                        variant="outline"
                        className="justify-start"
                      >
                        <BookOpenIcon className="mr-3 h-5 w-5" />
                        Continue Learning
                      </Button>
                    </Link>
                    <Link href="/progress">
                      <Button
                        fullWidth
                        variant="outline"
                        className="justify-start"
                      >
                        <ChartBarIcon className="mr-3 h-5 w-5" />
                        View Progress
                      </Button>
                    </Link>
                    <Link href="/leaderboard">
                      <Button
                        fullWidth
                        variant="outline"
                        className="justify-start"
                      >
                        <UserGroupIcon className="mr-3 h-5 w-5" />
                        Leaderboard
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </Card>

            {/* Level Progress / Teaching Stats */}
            <Card className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {isTeacher ? 'Teaching Impact' : 'Level Progress'}
              </h3>
              <div className="text-center">
                {isTeacher ? (
                  <>
                    <div className="text-3xl font-bold text-blue-600 mb-2">Master Educator</div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                      <div className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                    <p className="text-sm text-gray-600">
                      78% student improvement rate this semester
                    </p>
                  </>
                ) : (
                  <>
                    <div className="text-3xl font-bold text-purple-600 mb-2">Level 5</div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                    <p className="text-sm text-gray-600">
                      650 / 1000 XP to Level 6
                    </p>
                  </>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}

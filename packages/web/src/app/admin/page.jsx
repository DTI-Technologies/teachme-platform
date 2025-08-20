'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  UsersIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  CogIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  BellIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import DashboardLayout from '@/components/layout/DashboardLayout';
// Define UserRole locally to avoid build issues
const UserRole = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  PARENT: 'parent',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
};
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// JavaScript doesn't need interface definitions

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalTeachers: 0,
    totalStudents: 0,
    totalSchools: 0,
    activeUsers: 0,
    totalLessons: 0,
    totalQuizzes: 0,
    systemHealth: 'excellent'
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  // Check if user has admin access
  useEffect(() => {
    if (user && user.role !== 'ADMIN' && user.role !== UserRole.ADMIN) {
      router.push('/dashboard');
      return;
    }
  }, [user, router]);

  useEffect(() => {
    if (user?.role === 'ADMIN' || user?.role === UserRole.ADMIN) {
      fetchAdminData();
    }
  }, [user]);

  const fetchAdminData = async () => {
    try {
      // Fetch admin statistics
      const statsResponse = await fetch('/api/backend/admin/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.data);
      } else {
        // Use mock data if API not available
        setStats({
          totalUsers: 1247,
          totalTeachers: 89,
          totalStudents: 1158,
          totalSchools: 12,
          activeUsers: 892,
          totalLessons: 456,
          totalQuizzes: 234,
          systemHealth: 'excellent'
        });
      }

      // Fetch recent activity
      const activityResponse = await fetch('/api/backend/admin/activity', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      if (activityResponse.ok) {
        const activityData = await activityResponse.json();
        setRecentActivity(activityData.data);
      } else {
        // Use mock data
        setRecentActivity([
          {
            id: '1',
            type: 'user_registration',
            title: 'New Teacher Registration',
            description: 'Sarah Johnson registered as a teacher at Lincoln Elementary',
            timestamp: new Date('2024-01-22T10:30:00'),
            severity: 'info'
          },
          {
            id: '2',
            type: 'school_created',
            title: 'New School Added',
            description: 'Roosevelt Middle School was added to the platform',
            timestamp: new Date('2024-01-22T09:15:00'),
            severity: 'info'
          },
          {
            id: '3',
            type: 'system_alert',
            title: 'High Server Load',
            description: 'Server load exceeded 80% for 5 minutes',
            timestamp: new Date('2024-01-22T08:45:00'),
            severity: 'warning'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent':
        return 'text-green-600 bg-green-100';
      case 'good':
        return 'text-blue-600 bg-blue-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'critical':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'info':
        return 'text-blue-600';
      case 'warning':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Administrator Dashboard</h1>
          <p className="text-gray-600">Monitor and manage the entire TeachMe platform</p>
        </div>

        {/* System Health Alert */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className={`p-4 rounded-lg border ${getHealthColor(stats.systemHealth)}`}>
            <div className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 mr-2" />
              <span className="font-medium">
                System Status: {stats.systemHealth.charAt(0).toUpperCase() + stats.systemHealth.slice(1)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <UsersIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <AcademicCapIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Teachers</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalTeachers}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <UsersIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Students</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalStudents.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <BuildingOfficeIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Schools</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalSchools}</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link href="/admin/users">
                    <Button fullWidth variant="outline" className="justify-start">
                      <UsersIcon className="mr-3 h-5 w-5" />
                      Manage Users
                    </Button>
                  </Link>
                  <Link href="/admin/schools">
                    <Button fullWidth variant="outline" className="justify-start">
                      <BuildingOfficeIcon className="mr-3 h-5 w-5" />
                      Manage Schools
                    </Button>
                  </Link>
                  <Link href="/admin/analytics">
                    <Button fullWidth variant="outline" className="justify-start">
                      <ChartBarIcon className="mr-3 h-5 w-5" />
                      View Analytics
                    </Button>
                  </Link>
                  <Link href="/admin/settings">
                    <Button fullWidth variant="outline" className="justify-start">
                      <CogIcon className="mr-3 h-5 w-5" />
                      System Settings
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className={`p-1 rounded-full ${getSeverityColor(activity.severity)}`}>
                        <BellIcon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-sm text-gray-500">{activity.description}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {activity.timestamp.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}

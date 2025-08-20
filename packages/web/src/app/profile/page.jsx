'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  UserIcon,
  TrophyIcon,
  FireIcon,
  StarIcon,
  ChartBarIcon,
  CogIcon,
  PencilIcon,
  CheckCircleIcon,
  ClockIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid, TrophyIcon as TrophyIconSolid } from '@heroicons/react/24/solid';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface StudentProfile {
  id: string;
  displayName: string;
  level: number;
  totalXP: number;
  currentLevelXP: number;
  nextLevelXP: number;
  streak: number;
  longestStreak: number;
  badges: Badge[];
  achievements: Achievement[];
  stats: StudentStats;
  avatar: Avatar;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  rarity: string;
  earnedAt: Date;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  progress: {
    current: number;
    target: number;
    percentage: number;
  };
  earnedAt?: Date;
}

interface StudentStats {
  totalLessonsCompleted: number;
  totalQuizzesCompleted: number;
  totalTimeSpent: number;
  averageScore: number;
  perfectScores: number;
  subjectStats: SubjectStats[];
}

interface SubjectStats {
  subject: string;
  lessonsCompleted: number;
  averageScore: number;
  timeSpent: number;
  level: number;
  xp: number;
}

interface Avatar {
  type: string;
  skinTone: string;
  hairStyle: string;
  hairColor: string;
  outfit: string;
  accessories: string[];
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    }
  }, [user?.id]);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      if (!user?.id) {
        console.log('No user ID available');
        return;
      }

      // Try to fetch real profile data
      try {
        const response = await fetch(`/api/profile/${user.id}`);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setProfile(data.data);
        } else {
          console.error('API returned error:', data.error);
          setProfile(getDefaultProfile(user));
        }
      } catch (fetchError) {
        console.error('Database not available, using default profile:', fetchError);
        setProfile(getDefaultProfile(user));
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(getDefaultProfile(user));
    } finally {
      setLoading(false);
    }
  };

  const getDefaultProfile = (user: any): StudentProfile => ({
    id: user?.id || '1',
    displayName: user?.name || 'Student',
    level: 1,
    totalXP: 0,
    currentLevelXP: 0,
    nextLevelXP: 100,
    streak: 0,
    longestStreak: 0,
    badges: [],
    achievements: [],
    stats: {
      totalLessonsCompleted: 0,
      totalQuizzesCompleted: 0,
      totalTimeSpent: 0,
      averageScore: 0,
      perfectScores: 0,
      subjectStats: []
    },
    avatar: {
      type: 'HUMAN',
      skinTone: 'medium',
      hairStyle: 'short',
      hairColor: 'brown',
      outfit: 'casual',
      accessories: []
    }
  });

  const getXPProgress = () => {
    if (!profile) return 0;
    return (profile.currentLevelXP / profile.nextLevelXP) * 100;
  };

  const getBadgeColor = (color: string) => {
    switch (color) {
      case 'BRONZE':
        return 'text-orange-600 bg-orange-100 border-orange-300';
      case 'SILVER':
        return 'text-gray-600 bg-gray-100 border-gray-300';
      case 'GOLD':
        return 'text-yellow-600 bg-yellow-100 border-yellow-300';
      case 'PLATINUM':
        return 'text-purple-600 bg-purple-100 border-purple-300';
      case 'DIAMOND':
        return 'text-blue-600 bg-blue-100 border-blue-300';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'COMMON':
        return 'border-gray-300';
      case 'UNCOMMON':
        return 'border-green-300';
      case 'RARE':
        return 'border-blue-300';
      case 'EPIC':
        return 'border-purple-300';
      case 'LEGENDARY':
        return 'border-yellow-300';
      default:
        return 'border-gray-300';
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
    { id: 'overview', name: 'Overview', icon: UserIcon },
    { id: 'badges', name: 'Badges', icon: TrophyIcon },
    { id: 'achievements', name: 'Achievements', icon: StarIcon },
    { id: 'stats', name: 'Statistics', icon: ChartBarIcon },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-6xl mx-auto p-6">
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

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="max-w-6xl mx-auto p-6">
          <Card className="text-center py-12">
            <UserIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Profile not found</h3>
            <p className="text-gray-600">Unable to load your profile.</p>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
              <p className="text-gray-600">Track your learning journey and achievements</p>
            </div>
            <Button variant="outline">
              <PencilIcon className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Profile Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Level & XP */}
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Level {profile.level}</h3>
                  <p className="text-sm text-gray-600">{profile.totalXP} total XP</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">{profile.level}</span>
                </div>
              </div>
              
              <div className="mb-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Progress to Level {profile.level + 1}</span>
                  <span>{profile.currentLevelXP}/{profile.nextLevelXP} XP</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getXPProgress()}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </Card>

          {/* Streak */}
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Current Streak</h3>
                  <p className="text-sm text-gray-600">Longest: {profile.longestStreak} days</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                  <FireIcon className="h-8 w-8 text-white" />
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-1">{profile.streak}</div>
                <div className="text-sm text-gray-600">days</div>
              </div>
            </div>
          </Card>

          {/* Badges */}
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Badges Earned</h3>
                  <p className="text-sm text-gray-600">Recent achievements</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center">
                  <TrophyIconSolid className="h-8 w-8 text-white" />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-yellow-600">{profile.badges.length}</div>
                <div className="flex -space-x-2">
                  {profile.badges.slice(0, 3).map((badge) => (
                    <div
                      key={badge.id}
                      className={`w-8 h-8 rounded-full border-2 ${getBadgeColor(badge.color)} flex items-center justify-center text-xs`}
                      title={badge.name}
                    >
                      {badge.icon}
                    </div>
                  ))}
                  {profile.badges.length > 3 && (
                    <div className="w-8 h-8 rounded-full border-2 border-gray-300 bg-gray-100 flex items-center justify-center text-xs text-gray-600">
                      +{profile.badges.length - 3}
                    </div>
                  )}
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
        <div className="space-y-8">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Activity */}
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded-full">
                        <CheckCircleIcon className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Completed "Fractions Fundamentals"</p>
                        <p className="text-xs text-gray-500">2 hours ago • +50 XP</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-yellow-100 rounded-full">
                        <TrophyIcon className="h-4 w-4 text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Earned "Streak Warrior" badge</p>
                        <p className="text-xs text-gray-500">1 day ago • +25 XP</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <StarIcon className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Scored 100% on Water Cycle Quiz</p>
                        <p className="text-xs text-gray-500">2 days ago • +75 XP</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Subject Progress */}
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Subject Progress</h3>
                  <div className="space-y-4">
                    {profile.stats.subjectStats.map((subject) => (
                      <div key={subject.subject} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">{subject.subject}</span>
                          <span className="text-sm text-gray-600">Level {subject.level}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(subject.xp % 100)}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>{subject.lessonsCompleted} lessons</span>
                          <span>{subject.averageScore}% avg</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'badges' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profile.badges.map((badge, index) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`border-2 ${getRarityColor(badge.rarity)}`}>
                    <div className="p-6 text-center">
                      <div className={`w-16 h-16 mx-auto rounded-full ${getBadgeColor(badge.color)} flex items-center justify-center text-2xl mb-4`}>
                        {badge.icon}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{badge.name}</h3>
                      <p className="text-sm text-gray-600 mb-4">{badge.description}</p>
                      <div className="flex items-center justify-center text-xs text-gray-500">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {new Date(badge.earnedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="space-y-6">
              {profile.achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={achievement.earnedAt ? 'border-green-300 bg-green-50' : ''}>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-full ${achievement.earnedAt ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'} flex items-center justify-center text-xl`}>
                            {achievement.icon}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{achievement.name}</h3>
                            <p className="text-sm text-gray-600">{achievement.description}</p>
                          </div>
                        </div>
                        {achievement.earnedAt && (
                          <CheckCircleIcon className="h-6 w-6 text-green-500" />
                        )}
                      </div>

                      {!achievement.earnedAt && (
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Progress</span>
                            <span>{achievement.progress.current}/{achievement.progress.target}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${achievement.progress.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {achievement.earnedAt && (
                        <div className="text-sm text-green-600">
                          Completed on {new Date(achievement.earnedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <div className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AcademicCapIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{profile.stats.totalLessonsCompleted}</div>
                  <div className="text-sm text-gray-600">Lessons Completed</div>
                </div>
              </Card>

              <Card>
                <div className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrophyIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{profile.stats.totalQuizzesCompleted}</div>
                  <div className="text-sm text-gray-600">Quizzes Completed</div>
                </div>
              </Card>

              <Card>
                <div className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ClockIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{formatTime(profile.stats.totalTimeSpent)}</div>
                  <div className="text-sm text-gray-600">Time Spent</div>
                </div>
              </Card>

              <Card>
                <div className="p-6 text-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <StarIconSolid className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{profile.stats.averageScore}%</div>
                  <div className="text-sm text-gray-600">Average Score</div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

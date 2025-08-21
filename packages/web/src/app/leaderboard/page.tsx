'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrophyIcon as TrophyOutlineIcon,
  FireIcon,
  StarIcon as StarOutlineIcon,
  ChartBarIcon,
  UsersIcon,
  ClockIcon,
  AcademicCapIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  MinusIcon
} from '@heroicons/react/24/outline';
import { TrophyIcon, StarIcon } from '@heroicons/react/24/solid';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import DashboardLayout from '@/components/layout/DashboardLayout';

// interface LeaderboardEntry {
//   rank: number;
//   studentId: string;
//   displayName: string;
//   avatar: string;
//   score: number;
//   level: number;
//   badge?: string;
//   change: {
//     direction: 'up' | 'down' | 'same' | 'new';
//     positions: number;
//   };
// }

// interface Leaderboard {
//   type: string;
//   scope: string;
//   timeframe: string;
//   entries: LeaderboardEntry[];
//   lastUpdated: Date;
// }

const leaderboardTypes = [
  { id: 'XP', name: 'Experience Points', icon: StarIcon },
  { id: 'LEVEL', name: 'Level', icon: TrophyIcon },
  { id: 'STREAK', name: 'Streak', icon: FireIcon },
  { id: 'LESSONS_COMPLETED', name: 'Lessons', icon: AcademicCapIcon }
];

const timeframes = [
  { id: 'WEEKLY', name: 'This Week' },
  { id: 'MONTHLY', name: 'This Month' },
  { id: 'ALL_TIME', name: 'All Time' }
];

const scopes = [
  { id: 'CLASS', name: 'My Class' },
  { id: 'GRADE', name: 'My Grade' },
  { id: 'GLOBAL', name: 'Global' }
];

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<Leaderboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('XP');
  const [selectedTimeframe, setSelectedTimeframe] = useState('WEEKLY');
  const [selectedScope, setSelectedScope] = useState('CLASS');

  useEffect(() => {
    fetchLeaderboard();
  }, [selectedType, selectedTimeframe, selectedScope]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      
      // Mock leaderboard data
      const mockLeaderboard = {
        type: selectedType,
        scope: selectedScope,
        timeframe: selectedTimeframe,
        lastUpdated: new Date(),
        entries: [
          {
            rank: 1,
            studentId: '1',
            displayName: 'Alex Chen',
            avatar: '👨‍🎓',
            score: selectedType === 'XP' ? 2850 : selectedType === 'LEVEL' ? 15 : selectedType === 'STREAK' ? 12 : 45,
            level: 15,
            badge: '🏆',
            change: { direction: 'same', positions: 0 }
          },
          {
            rank: 2,
            studentId: '2',
            displayName: 'Sarah Johnson',
            avatar: '👩‍🎓',
            score: selectedType === 'XP' ? 2650 : selectedType === 'LEVEL' ? 14 : selectedType === 'STREAK' ? 10 : 42,
            level: 14,
            badge: '🥈',
            change: { direction: 'up', positions: 1 }
          },
          {
            rank: 3,
            studentId: '3',
            displayName: 'Mike Rodriguez',
            avatar: '👨‍💻',
            score: selectedType === 'XP' ? 2450 : selectedType === 'LEVEL' ? 12 : selectedType === 'STREAK' ? 9 : 38,
            level: 12,
            badge: '🥉',
            change: { direction: 'down', positions: 1 }
          },
          {
            rank: 4,
            studentId: user?.id || '4',
            displayName: user?.name || 'You',
            avatar: '🧑‍🎓',
            score: selectedType === 'XP' ? 2200 : selectedType === 'LEVEL' ? 11 : selectedType === 'STREAK' ? 7 : 32,
            level: 11,
            change: { direction: 'up', positions: 2 }
          },
          {
            rank: 5,
            studentId: '5',
            displayName: 'Emma Wilson',
            avatar: '👩‍🔬',
            score: selectedType === 'XP' ? 2100 : selectedType === 'LEVEL' ? 10 : selectedType === 'STREAK' ? 6 : 30,
            level: 10,
            change: { direction: 'down', positions: 1 }
          },
          {
            rank: 6,
            studentId: '6',
            displayName: 'David Kim',
            avatar: '👨‍🎨',
            score: selectedType === 'XP' ? 1950 : selectedType === 'LEVEL' ? 10 : selectedType === 'STREAK' ? 5 : 28,
            level: 10,
            change: { direction: 'new', positions: 0 }
          },
          {
            rank: 7,
            studentId: '7',
            displayName: 'Lisa Zhang',
            avatar: '👩‍🎤',
            score: selectedType === 'XP' ? 1800 : selectedType === 'LEVEL' ? 9 : selectedType === 'STREAK' ? 4 : 25,
            level: 9,
            change: { direction: 'same', positions: 0 }
          },
          {
            rank: 8,
            studentId: '8',
            displayName: 'James Brown',
            avatar: '👨‍🏫',
            score: selectedType === 'XP' ? 1650 : selectedType === 'LEVEL' ? 8 : selectedType === 'STREAK' ? 3 : 22,
            level: 8,
            change: { direction: 'down', positions: 2 }
          }
        ]
      };

      setLeaderboard(mockLeaderboard);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <TrophyIconSolid className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <TrophyIconSolid className="h-6 w-6 text-gray-400" />;
      case 3:
        return <TrophyIconSolid className="h-6 w-6 text-orange-600" />;
      default:
        return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getChangeIcon = (change) => {
    switch (change.direction) {
      case 'up':
        return <ChevronUpIcon className="h-4 w-4 text-green-500" />;
      case 'down':
        return <ChevronDownIcon className="h-4 w-4 text-red-500" />;
      case 'new':
        return <StarIconSolid className="h-4 w-4 text-blue-500" />;
      default:
        return <MinusIcon className="h-4 w-4 text-gray-400" />;
    }
  };

  const getScoreLabel = (type) => {
    switch (type) {
      case 'XP':
        return 'XP';
      case 'LEVEL':
        return 'Level';
      case 'STREAK':
        return 'Days';
      case 'LESSONS_COMPLETED':
        return 'Lessons';
      default:
        return 'Score';
    }
  };

  const getCurrentUserEntry = () => {
    return leaderboard?.entries.find(entry => entry.studentId === user?.id);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Leaderboard</h1>
          <p className="text-gray-600">See how you rank against your classmates</p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {leaderboardTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Timeframe</label>
                <select
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {timeframes.map(timeframe => (
                    <option key={timeframe.id} value={timeframe.id}>{timeframe.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Scope</label>
                <select
                  value={selectedScope}
                  onChange={(e) => setSelectedScope(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {scopes.map(scope => (
                    <option key={scope.id} value={scope.id}>{scope.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* Top 3 Podium */}
        {leaderboard && leaderboard.entries.length >= 3 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {/* 2nd Place */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="text-center p-6 border-2 border-gray-300">
                <div className="text-4xl mb-2">{leaderboard.entries[1].avatar}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{leaderboard.entries[1].displayName}</h3>
                <div className="text-2xl font-bold text-gray-600 mb-2">2nd</div>
                <div className="text-lg text-gray-700">{leaderboard.entries[1].score} {getScoreLabel(selectedType)}</div>
                <div className="text-sm text-gray-500">Level {leaderboard.entries[1].level}</div>
              </Card>
            </motion.div>

            {/* 1st Place */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0 }}
            >
              <Card className="text-center p-6 border-2 border-yellow-400 bg-gradient-to-b from-yellow-50 to-white transform scale-105">
                <div className="text-5xl mb-2">{leaderboard.entries[0].avatar}</div>
                <h3 className="font-bold text-gray-900 mb-1">{leaderboard.entries[0].displayName}</h3>
                <div className="text-3xl font-bold text-yellow-600 mb-2">🏆 1st</div>
                <div className="text-xl text-gray-700">{leaderboard.entries[0].score} {getScoreLabel(selectedType)}</div>
                <div className="text-sm text-gray-500">Level {leaderboard.entries[0].level}</div>
              </Card>
            </motion.div>

            {/* 3rd Place */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="text-center p-6 border-2 border-orange-300">
                <div className="text-4xl mb-2">{leaderboard.entries[2].avatar}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{leaderboard.entries[2].displayName}</h3>
                <div className="text-2xl font-bold text-orange-600 mb-2">3rd</div>
                <div className="text-lg text-gray-700">{leaderboard.entries[2].score} {getScoreLabel(selectedType)}</div>
                <div className="text-sm text-gray-500">Level {leaderboard.entries[2].level}</div>
              </Card>
            </motion.div>
          </div>
        )}

        {/* Your Rank */}
        {getCurrentUserEntry() && (
          <Card className="mb-6 border-2 border-blue-300 bg-blue-50">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getRankIcon(getCurrentUserEntry().rank)}
                    <span className="font-semibold text-gray-900">Your Rank</span>
                  </div>
                  <div className="text-2xl">{getCurrentUserEntry().avatar}</div>
                  <div>
                    <div className="font-medium text-gray-900">{getCurrentUserEntry().displayName}</div>
                    <div className="text-sm text-gray-600">Level {getCurrentUserEntry().level}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      {getCurrentUserEntry().score} {getScoreLabel(selectedType)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      {getChangeIcon(getCurrentUserEntry().change)}
                      <span className="ml-1">
                        {getCurrentUserEntry()!.change.direction === 'new' ? 'New' : 
                         getCurrentUserEntry()!.change.direction === 'same' ? 'No change' :
                         `${getCurrentUserEntry()!.change.positions} ${getCurrentUserEntry()!.change.direction === 'up' ? 'up' : 'down'}`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Full Leaderboard */}
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedScope} {selectedTimeframe} Rankings
              </h2>
              <div className="text-sm text-gray-500">
                Last updated: {leaderboard?.lastUpdated.toLocaleTimeString()}
              </div>
            </div>

            <div className="space-y-3">
              {leaderboard?.entries.map((entry, index) => (
                <motion.div
                  key={entry.studentId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    entry.studentId === user?.id 
                      ? 'border-blue-300 bg-blue-50' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-8 flex justify-center">
                      {getRankIcon(entry.rank)}
                    </div>
                    <div className="text-2xl">{entry.avatar}</div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {entry.displayName}
                        {entry.studentId === user?.id && (
                          <span className="ml-2 text-sm text-blue-600">(You)</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">Level {entry.level}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="font-bold text-gray-900">
                        {entry.score} {getScoreLabel(selectedType)}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        {getChangeIcon(entry.change)}
                        <span className="ml-1">
                          {entry.change.direction === 'new' ? 'New' : 
                           entry.change.direction === 'same' ? '—' :
                           entry.change.positions}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

import prisma from './prisma';
import bcrypt from 'bcryptjs';
import { User, UserRole, Subject, GradeLevel, Difficulty } from '@prisma/client';

// User Management
export async function createUser(data: {
  email: string;
  name: string;
  password: string;
  role: UserRole;
}) {
  const hashedPassword = await bcrypt.hash(data.password, 12);
  
  const user = await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });

  // Create student profile if user is a student
  if (data.role === UserRole.STUDENT) {
    await prisma.studentProfile.create({
      data: {
        userId: user.id,
        displayName: data.name,
        avatar: {
          type: 'HUMAN',
          skinTone: 'medium',
          hairStyle: 'short',
          hairColor: 'brown',
          outfit: 'casual',
          accessories: []
        },
        preferences: {
          showRealName: true,
          showStats: true,
          showBadges: true,
          allowFriendRequests: true,
          notificationSettings: {
            achievements: true,
            levelUp: true,
            streakReminders: true,
            friendActivity: false,
            weeklyReports: true
          },
          theme: 'DEFAULT'
        }
      },
    });

    // Initialize streaks
    const streakTypes = ['DAILY_LOGIN', 'DAILY_LESSON', 'DAILY_QUIZ', 'PERFECT_SCORES'];
    for (const type of streakTypes) {
      await prisma.streak.create({
        data: {
          studentId: user.id,
          type: type as any,
        },
      });
    }
  }

  return user;
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    include: {
      profile: true,
    },
  });
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword);
}

// XP and Leveling
export async function awardXP(studentId: string, amount: number, source: string, sourceId: string, description: string) {
  const transaction = await prisma.$transaction(async (tx) => {
    // Create XP transaction
    const xpTransaction = await tx.xPTransaction.create({
      data: {
        studentId,
        amount,
        source: source as any,
        sourceId,
        description,
      },
    });

    // Update student profile
    const profile = await tx.studentProfile.findUnique({
      where: { userId: studentId },
    });

    if (!profile) {
      throw new Error('Student profile not found');
    }

    const newTotalXP = profile.totalXP + amount;
    const newLevel = calculateLevel(newTotalXP);
    const leveledUp = newLevel > profile.level;
    
    const { currentLevelXP, nextLevelXP } = calculateLevelProgress(newTotalXP, newLevel);

    await tx.studentProfile.update({
      where: { userId: studentId },
      data: {
        totalXP: newTotalXP,
        level: newLevel,
        currentLevelXP,
        nextLevelXP,
      },
    });

    return {
      transaction: xpTransaction,
      leveledUp,
      newLevel,
      oldLevel: profile.level,
      totalXP: newTotalXP,
    };
  });

  return transaction;
}

export function calculateLevel(totalXP: number): number {
  // Level formula: Level = floor(sqrt(totalXP / 100)) + 1
  // This creates a curve where each level requires more XP
  return Math.floor(Math.sqrt(totalXP / 100)) + 1;
}

export function calculateLevelProgress(totalXP: number, level: number) {
  const currentLevelMinXP = Math.pow(level - 1, 2) * 100;
  const nextLevelMinXP = Math.pow(level, 2) * 100;
  
  return {
    currentLevelXP: totalXP - currentLevelMinXP,
    nextLevelXP: nextLevelMinXP - currentLevelMinXP,
  };
}

// Achievements and Badges
export async function checkAndAwardAchievements(studentId: string, action: string, data: any) {
  const achievements = await prisma.achievement.findMany();
  const newAchievements = [];

  for (const achievement of achievements) {
    const userAchievement = await prisma.userAchievement.findUnique({
      where: {
        userId_achievementId: {
          userId: studentId,
          achievementId: achievement.id,
        },
      },
    });

    // Skip if already earned
    if (userAchievement?.earnedAt) continue;

    const criteria = achievement.criteria as any;
    const shouldAward = await evaluateAchievementCriteria(studentId, criteria, action, data);

    if (shouldAward) {
      await prisma.userAchievement.upsert({
        where: {
          userId_achievementId: {
            userId: studentId,
            achievementId: achievement.id,
          },
        },
        update: {
          earnedAt: new Date(),
          progress: { current: criteria.target, target: criteria.target, percentage: 100 },
        },
        create: {
          userId: studentId,
          achievementId: achievement.id,
          earnedAt: new Date(),
          progress: { current: criteria.target, target: criteria.target, percentage: 100 },
        },
      });

      newAchievements.push(achievement);

      // Award XP for achievement
      const reward = achievement.reward as any;
      if (reward.xp) {
        await awardXP(studentId, reward.xp, 'ACHIEVEMENT_EARNED', achievement.id, `Earned achievement: ${achievement.name}`);
      }
    }
  }

  return newAchievements;
}

async function evaluateAchievementCriteria(studentId: string, criteria: any, action: string, data: any): Promise<boolean> {
  switch (criteria.type) {
    case 'LESSONS_COMPLETED':
      if (action === 'lesson_completed') {
        const count = await prisma.progress.count({
          where: {
            studentId,
            status: 'COMPLETED',
          },
        });
        return count >= criteria.target;
      }
      break;

    case 'PERFECT_SCORES':
      if (action === 'quiz_completed' && data.score === 100) {
        const count = await prisma.quizAttempt.count({
          where: {
            studentId,
            percentage: 100,
          },
        });
        return count >= criteria.target;
      }
      break;

    case 'STREAK_DAYS':
      if (action === 'streak_updated') {
        return data.streak >= criteria.target;
      }
      break;
  }

  return false;
}

// Streaks
export async function updateStreak(studentId: string, type: string) {
  const streak = await prisma.streak.findUnique({
    where: {
      studentId_type: {
        studentId,
        type: type as any,
      },
    },
  });

  if (!streak) return null;

  const now = new Date();
  const lastActivity = streak.lastActivity;
  const isConsecutive = lastActivity && isWithinDay(lastActivity, now);
  const isSameDayCheck = lastActivity && isSameDay(lastActivity, now);

  let newCurrent = streak.current;
  let newLongest = streak.longest;

  if (isSameDayCheck) {
    // Same day, no change
    return streak;
  } else if (isConsecutive) {
    // Consecutive day, increment
    newCurrent = streak.current + 1;
    newLongest = Math.max(newLongest, newCurrent);
  } else {
    // Streak broken, reset
    newCurrent = 1;
  }

  const updatedStreak = await prisma.streak.update({
    where: { id: streak.id },
    data: {
      current: newCurrent,
      longest: newLongest,
      lastActivity: now,
      isActive: true,
    },
  });

  // Update student profile streak (use daily login as main streak)
  if (type === 'DAILY_LOGIN') {
    await prisma.studentProfile.update({
      where: { userId: studentId },
      data: {
        streak: newCurrent,
        longestStreak: newLongest,
      },
    });
  }

  return updatedStreak;
}

function isWithinDay(date1: Date, date2: Date): boolean {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 1;
}

function isSameDay(date1: Date, date2: Date): boolean {
  return date1.toDateString() === date2.toDateString();
}

// Leaderboard
export async function getLeaderboard(type: string, scope: string, timeframe: string, limit: number = 10) {
  let orderBy: any = {};
  let where: any = {};

  switch (type) {
    case 'XP':
      orderBy = { totalXP: 'desc' };
      break;
    case 'LEVEL':
      orderBy = { level: 'desc' };
      break;
    case 'STREAK':
      orderBy = { streak: 'desc' };
      break;
  }

  // Add timeframe filtering if needed
  if (timeframe !== 'ALL_TIME') {
    const now = new Date();
    let startDate: Date;

    switch (timeframe) {
      case 'WEEKLY':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'MONTHLY':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(0);
    }

    where.updatedAt = { gte: startDate };
  }

  const profiles = await prisma.studentProfile.findMany({
    where,
    orderBy,
    take: limit,
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return profiles.map((profile, index) => ({
    rank: index + 1,
    studentId: profile.userId,
    displayName: profile.displayName,
    avatar: '🧑‍🎓', // Default avatar emoji
    score: type === 'XP' ? profile.totalXP : type === 'LEVEL' ? profile.level : profile.streak,
    level: profile.level,
    change: { direction: 'same', positions: 0 }, // TODO: Implement change tracking
  }));
}

// Database seeding utilities
export async function seedDatabase() {
  console.log('🌱 Seeding database...');

  // Create default achievements
  const achievements = [
    {
      name: 'First Steps',
      description: 'Complete your first lesson',
      icon: '🎯',
      category: 'LEARNING' as const,
      type: 'MILESTONE' as const,
      criteria: { type: 'LESSONS_COMPLETED', target: 1 },
      reward: { xp: 25 },
    },
    {
      name: 'Knowledge Seeker',
      description: 'Complete 10 lessons',
      icon: '📚',
      category: 'LEARNING' as const,
      type: 'PROGRESS' as const,
      criteria: { type: 'LESSONS_COMPLETED', target: 10 },
      reward: { xp: 100 },
    },
    {
      name: 'Perfectionist',
      description: 'Score 100% on a quiz',
      icon: '⭐',
      category: 'MASTERY' as const,
      type: 'PERFECT' as const,
      criteria: { type: 'PERFECT_SCORES', target: 1 },
      reward: { xp: 50 },
    },
    {
      name: 'Streak Warrior',
      description: 'Maintain a 7-day learning streak',
      icon: '🔥',
      category: 'CONSISTENCY' as const,
      type: 'STREAK' as const,
      criteria: { type: 'STREAK_DAYS', target: 7 },
      reward: { xp: 75 },
    },
  ];

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { name: achievement.name },
      update: {},
      create: achievement,
    });
  }

  // Create default badges
  const badges = [
    {
      name: 'Math Master',
      description: 'Excel in mathematics',
      icon: '🧮',
      color: 'GOLD' as const,
      category: 'ACADEMIC' as const,
      rarity: 'RARE' as const,
      criteria: { subject: 'MATHEMATICS', averageScore: 90 },
    },
    {
      name: 'Science Explorer',
      description: 'Discover the wonders of science',
      icon: '🔬',
      color: 'SILVER' as const,
      category: 'ACADEMIC' as const,
      rarity: 'UNCOMMON' as const,
      criteria: { subject: 'SCIENCE', lessonsCompleted: 5 },
    },
  ];

  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { name: badge.name },
      update: {},
      create: badge,
    });
  }

  console.log('✅ Database seeded successfully!');
}

export { prisma };

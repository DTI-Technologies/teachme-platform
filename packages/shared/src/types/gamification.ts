// Gamification and Achievement Types

export interface StudentProfile {
  id: string;
  userId: string;
  displayName: string;
  avatar: Avatar;
  level: number;
  totalXP: number;
  currentLevelXP: number;
  nextLevelXP: number;
  streak: number;
  longestStreak: number;
  badges: Badge[];
  achievements: Achievement[];
  stats: StudentStats;
  preferences: ProfilePreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface Avatar {
  id: string;
  type: AvatarType;
  skinTone: string;
  hairStyle: string;
  hairColor: string;
  eyeColor: string;
  outfit: string;
  accessories: string[];
  background: string;
  unlocked: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: BadgeColor;
  category: BadgeCategory;
  rarity: BadgeRarity;
  earnedAt: Date;
  progress?: BadgeProgress;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  type: AchievementType;
  criteria: AchievementCriteria;
  reward: AchievementReward;
  earnedAt?: Date;
  progress: AchievementProgress;
  isSecret: boolean;
}

export interface AchievementCriteria {
  type: CriteriaType;
  target: number;
  timeframe?: TimeFrame;
  subject?: string;
  difficulty?: string;
  conditions?: Record<string, any>;
}

export interface AchievementProgress {
  current: number;
  target: number;
  percentage: number;
  milestones: Milestone[];
}

export interface Milestone {
  value: number;
  reached: boolean;
  reachedAt?: Date;
  reward?: MilestoneReward;
}

export interface AchievementReward {
  xp: number;
  badges?: string[];
  avatarItems?: string[];
  title?: string;
  special?: SpecialReward;
}

export interface MilestoneReward {
  xp: number;
  message: string;
}

export interface SpecialReward {
  type: SpecialRewardType;
  value: string;
  description: string;
}

export interface StudentStats {
  totalLessonsCompleted: number;
  totalQuizzesCompleted: number;
  totalTimeSpent: number; // in minutes
  averageScore: number;
  perfectScores: number;
  subjectStats: SubjectStats[];
  weeklyActivity: WeeklyActivity[];
  monthlyProgress: MonthlyProgress[];
}

export interface SubjectStats {
  subject: string;
  lessonsCompleted: number;
  quizzesCompleted: number;
  averageScore: number;
  timeSpent: number;
  level: number;
  xp: number;
}

export interface WeeklyActivity {
  week: string; // ISO week string
  lessonsCompleted: number;
  quizzesCompleted: number;
  xpEarned: number;
  timeSpent: number;
}

export interface MonthlyProgress {
  month: string; // YYYY-MM format
  lessonsCompleted: number;
  quizzesCompleted: number;
  xpEarned: number;
  averageScore: number;
  streakDays: number;
}

export interface ProfilePreferences {
  showRealName: boolean;
  showStats: boolean;
  showBadges: boolean;
  allowFriendRequests: boolean;
  notificationSettings: NotificationSettings;
  theme: ProfileTheme;
}

export interface NotificationSettings {
  achievements: boolean;
  levelUp: boolean;
  streakReminders: boolean;
  friendActivity: boolean;
  weeklyReports: boolean;
}

export interface XPTransaction {
  id: string;
  studentId: string;
  amount: number;
  source: XPSource;
  sourceId: string;
  description: string;
  multiplier: number;
  bonusReason?: string;
  timestamp: Date;
}

export interface Leaderboard {
  id: string;
  type: LeaderboardType;
  scope: LeaderboardScope;
  timeframe: TimeFrame;
  entries: LeaderboardEntry[];
  lastUpdated: Date;
}

export interface LeaderboardEntry {
  rank: number;
  studentId: string;
  displayName: string;
  avatar: Avatar;
  score: number;
  level: number;
  badge?: string;
  change: RankChange;
}

export interface RankChange {
  direction: 'up' | 'down' | 'same' | 'new';
  positions: number;
}

export interface Streak {
  id: string;
  studentId: string;
  type: StreakType;
  current: number;
  longest: number;
  lastActivity: Date;
  isActive: boolean;
  milestones: StreakMilestone[];
}

export interface StreakMilestone {
  days: number;
  reached: boolean;
  reachedAt?: Date;
  reward: StreakReward;
}

export interface StreakReward {
  xp: number;
  badge?: string;
  title?: string;
  message: string;
}

// Enums
export enum AvatarType {
  HUMAN = 'HUMAN',
  ANIMAL = 'ANIMAL',
  ROBOT = 'ROBOT',
  FANTASY = 'FANTASY'
}

export enum BadgeColor {
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM',
  DIAMOND = 'DIAMOND'
}

export enum BadgeCategory {
  ACADEMIC = 'ACADEMIC',
  SOCIAL = 'SOCIAL',
  STREAK = 'STREAK',
  SPECIAL = 'SPECIAL',
  SEASONAL = 'SEASONAL'
}

export enum BadgeRarity {
  COMMON = 'COMMON',
  UNCOMMON = 'UNCOMMON',
  RARE = 'RARE',
  EPIC = 'EPIC',
  LEGENDARY = 'LEGENDARY'
}

export enum AchievementCategory {
  LEARNING = 'LEARNING',
  MASTERY = 'MASTERY',
  CONSISTENCY = 'CONSISTENCY',
  EXPLORATION = 'EXPLORATION',
  SOCIAL = 'SOCIAL',
  SPECIAL = 'SPECIAL'
}

export enum AchievementType {
  PROGRESS = 'PROGRESS',
  MILESTONE = 'MILESTONE',
  STREAK = 'STREAK',
  PERFECT = 'PERFECT',
  SPEED = 'SPEED',
  COLLECTION = 'COLLECTION'
}

export enum CriteriaType {
  LESSONS_COMPLETED = 'LESSONS_COMPLETED',
  QUIZZES_COMPLETED = 'QUIZZES_COMPLETED',
  PERFECT_SCORES = 'PERFECT_SCORES',
  STREAK_DAYS = 'STREAK_DAYS',
  TIME_SPENT = 'TIME_SPENT',
  XP_EARNED = 'XP_EARNED',
  LEVEL_REACHED = 'LEVEL_REACHED',
  SUBJECT_MASTERY = 'SUBJECT_MASTERY'
}

export enum TimeFrame {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  ALL_TIME = 'ALL_TIME'
}

export enum SpecialRewardType {
  TITLE = 'TITLE',
  AVATAR_ITEM = 'AVATAR_ITEM',
  THEME = 'THEME',
  EMOTE = 'EMOTE',
  BORDER = 'BORDER'
}

export enum XPSource {
  LESSON_COMPLETED = 'LESSON_COMPLETED',
  QUIZ_COMPLETED = 'QUIZ_COMPLETED',
  PERFECT_SCORE = 'PERFECT_SCORE',
  STREAK_BONUS = 'STREAK_BONUS',
  ACHIEVEMENT_EARNED = 'ACHIEVEMENT_EARNED',
  DAILY_LOGIN = 'DAILY_LOGIN',
  FIRST_TRY = 'FIRST_TRY',
  SPEED_BONUS = 'SPEED_BONUS'
}

export enum LeaderboardType {
  XP = 'XP',
  LEVEL = 'LEVEL',
  STREAK = 'STREAK',
  QUIZ_SCORE = 'QUIZ_SCORE',
  LESSONS_COMPLETED = 'LESSONS_COMPLETED'
}

export enum LeaderboardScope {
  GLOBAL = 'GLOBAL',
  CLASS = 'CLASS',
  GRADE = 'GRADE',
  SCHOOL = 'SCHOOL',
  FRIENDS = 'FRIENDS'
}

export enum StreakType {
  DAILY_LOGIN = 'DAILY_LOGIN',
  DAILY_LESSON = 'DAILY_LESSON',
  DAILY_QUIZ = 'DAILY_QUIZ',
  PERFECT_SCORES = 'PERFECT_SCORES'
}

export enum ProfileTheme {
  DEFAULT = 'DEFAULT',
  DARK = 'DARK',
  OCEAN = 'OCEAN',
  FOREST = 'FOREST',
  SPACE = 'SPACE',
  RAINBOW = 'RAINBOW'
}

export interface BadgeProgress {
  current: number;
  target: number;
  percentage: number;
}

// API Request/Response Types
export interface UpdateProfileRequest {
  displayName?: string;
  avatar?: Partial<Avatar>;
  preferences?: Partial<ProfilePreferences>;
}

export interface AwardXPRequest {
  studentId: string;
  amount: number;
  source: XPSource;
  sourceId: string;
  description: string;
  multiplier?: number;
  bonusReason?: string;
}

export interface CheckAchievementsRequest {
  studentId: string;
  action: string;
  data: Record<string, any>;
}

export interface LeaderboardRequest {
  type: LeaderboardType;
  scope: LeaderboardScope;
  timeframe: TimeFrame;
  limit?: number;
  classId?: string;
}

export interface StudentRankingResponse {
  rank: number;
  totalStudents: number;
  percentile: number;
  score: number;
  change: RankChange;
}

export interface GamificationSummary {
  level: number;
  xp: number;
  nextLevelXP: number;
  streak: number;
  recentBadges: Badge[];
  recentAchievements: Achievement[];
  rank: StudentRankingResponse;
  weeklyProgress: {
    xpEarned: number;
    lessonsCompleted: number;
    quizzesCompleted: number;
    streakDays: number;
  };
}

// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  preferences: UserPreferences;
}

export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
  PARENT = 'parent',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: NotificationSettings;
  accessibility: AccessibilitySettings;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  assignments: boolean;
  progress: boolean;
  achievements: boolean;
}

export interface AccessibilitySettings {
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  highContrast: boolean;
  dyslexiaFont: boolean;
  screenReader: boolean;
  voiceNavigation: boolean;
}

// Student Types
export interface Student extends User {
  role: UserRole.STUDENT;
  gradeLevel: GradeLevel;
  schoolId?: string;
  parentIds: string[];
  teacherIds: string[];
  learningStyle: LearningStyle;
  subjects: string[];
  xp: number;
  level: number;
  badges: Badge[];
  streakDays: number;
  lastActiveDate: Date;
}

export enum GradeLevel {
  KINDERGARTEN = 'K',
  GRADE_1 = '1',
  GRADE_2 = '2',
  GRADE_3 = '3',
  GRADE_4 = '4',
  GRADE_5 = '5',
  GRADE_6 = '6',
  GRADE_7 = '7',
  GRADE_8 = '8',
  GRADE_9 = '9',
  GRADE_10 = '10',
  GRADE_11 = '11',
  GRADE_12 = '12',
}

export enum LearningStyle {
  VISUAL = 'visual',
  AUDITORY = 'auditory',
  KINESTHETIC = 'kinesthetic',
  READING_WRITING = 'reading_writing',
}

// Teacher Types
export interface Teacher extends User {
  role: UserRole.TEACHER;
  schoolId: string;
  subjects: string[];
  gradeLevels: GradeLevel[];
  studentIds: string[];
  classrooms: Classroom[];
  certifications: string[];
}

// Parent Types
export interface Parent extends User {
  role: UserRole.PARENT;
  childrenIds: string[];
  emergencyContact: boolean;
}

// School Types
export interface School {
  id: string;
  name: string;
  district: string;
  address: Address;
  phone: string;
  email: string;
  website?: string;
  logo?: string;
  settings: SchoolSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface SchoolSettings {
  allowParentAccess: boolean;
  requireParentConsent: boolean;
  enableVoiceFeatures: boolean;
  enableARFeatures: boolean;
  contentModerationLevel: 'strict' | 'moderate' | 'relaxed';
  customBranding: boolean;
  theme: SchoolTheme;
}

export interface SchoolTheme {
  primaryColor: string;
  secondaryColor: string;
  logo?: string;
  favicon?: string;
}

// Classroom Types
export interface Classroom {
  id: string;
  name: string;
  teacherId: string;
  schoolId: string;
  subject: string;
  gradeLevel: GradeLevel;
  studentIds: string[];
  schedule: ClassSchedule[];
  settings: ClassroomSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClassSchedule {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  room?: string;
}

export interface ClassroomSettings {
  allowStudentChat: boolean;
  enableGameMode: boolean;
  autoAssignHomework: boolean;
  parentNotifications: boolean;
}

// Lesson Types
export interface Lesson {
  id: string;
  title: string;
  description: string;
  subject: string;
  gradeLevel: GradeLevel;
  duration: number; // in minutes
  objectives: string[];
  content: LessonContent;
  activities: Activity[];
  assessments: Assessment[];
  resources: Resource[];
  standards: CurriculumStandard[];
  difficulty: DifficultyLevel;
  tags: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
}

export enum DifficultyLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert',
}

export interface LessonContent {
  introduction: string;
  mainContent: ContentBlock[];
  conclusion: string;
  vocabulary: VocabularyTerm[];
}

export interface ContentBlock {
  id: string;
  type: ContentType;
  content: string;
  metadata?: Record<string, any>;
  order: number;
}

export enum ContentType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  INTERACTIVE = 'interactive',
  QUIZ = 'quiz',
  SIMULATION = 'simulation',
  AR_MODEL = 'ar_model',
}

export interface VocabularyTerm {
  term: string;
  definition: string;
  pronunciation?: string;
  examples: string[];
}

// Activity Types
export interface Activity {
  id: string;
  name: string;
  type: ActivityType;
  description: string;
  instructions: string;
  estimatedTime: number; // in minutes
  materials: string[];
  content: ActivityContent;
  grading: GradingCriteria;
}

export enum ActivityType {
  INDIVIDUAL = 'individual',
  GROUP = 'group',
  DISCUSSION = 'discussion',
  HANDS_ON = 'hands_on',
  DIGITAL = 'digital',
  GAME = 'game',
}

export interface ActivityContent {
  steps: ActivityStep[];
  resources: Resource[];
  examples: string[];
}

export interface ActivityStep {
  order: number;
  instruction: string;
  timeLimit?: number;
  resources?: Resource[];
}

// Assessment Types
export interface Assessment {
  id: string;
  title: string;
  type: AssessmentType;
  questions: Question[];
  timeLimit?: number; // in minutes
  attempts: number;
  passingScore: number;
  grading: GradingCriteria;
  feedback: FeedbackSettings;
}

export enum AssessmentType {
  QUIZ = 'quiz',
  TEST = 'test',
  ASSIGNMENT = 'assignment',
  PROJECT = 'project',
  PRESENTATION = 'presentation',
  PORTFOLIO = 'portfolio',
}

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
  difficulty: DifficultyLevel;
  tags: string[];
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  TRUE_FALSE = 'true_false',
  SHORT_ANSWER = 'short_answer',
  ESSAY = 'essay',
  FILL_BLANK = 'fill_blank',
  MATCHING = 'matching',
  DRAG_DROP = 'drag_drop',
  DRAWING = 'drawing',
}

export interface GradingCriteria {
  rubric?: Rubric;
  autoGrade: boolean;
  showCorrectAnswers: boolean;
  allowRetakes: boolean;
  weightedScoring: boolean;
}

export interface Rubric {
  criteria: RubricCriterion[];
  totalPoints: number;
}

export interface RubricCriterion {
  name: string;
  description: string;
  levels: RubricLevel[];
  weight: number;
}

export interface RubricLevel {
  name: string;
  description: string;
  points: number;
}

export interface FeedbackSettings {
  immediate: boolean;
  detailed: boolean;
  showScore: boolean;
  showCorrectAnswers: boolean;
  customMessage?: string;
}

// Resource Types
export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  url?: string;
  content?: string;
  metadata: ResourceMetadata;
  tags: string[];
}

export enum ResourceType {
  DOCUMENT = 'document',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  LINK = 'link',
  INTERACTIVE = 'interactive',
  SIMULATION = 'simulation',
  GAME = 'game',
}

export interface ResourceMetadata {
  size?: number;
  duration?: number;
  format?: string;
  resolution?: string;
  author?: string;
  license?: string;
  description?: string;
}

// Curriculum Standards
export interface CurriculumStandard {
  id: string;
  code: string;
  title: string;
  description: string;
  subject: string;
  gradeLevel: GradeLevel;
  framework: StandardFramework;
}

export enum StandardFramework {
  COMMON_CORE = 'common_core',
  NGSS = 'ngss',
  STATE_STANDARDS = 'state_standards',
  INTERNATIONAL = 'international',
}

// Gamification Types
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: BadgeCategory;
  criteria: BadgeCriteria;
  rarity: BadgeRarity;
  earnedAt?: Date;
}

export enum BadgeCategory {
  ACHIEVEMENT = 'achievement',
  PROGRESS = 'progress',
  BEHAVIOR = 'behavior',
  CREATIVITY = 'creativity',
  COLLABORATION = 'collaboration',
  SPECIAL = 'special',
}

export enum BadgeRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary',
}

export interface BadgeCriteria {
  type: CriteriaType;
  value: number;
  subject?: string;
  timeframe?: number; // in days
}

export enum CriteriaType {
  LESSONS_COMPLETED = 'lessons_completed',
  STREAK_DAYS = 'streak_days',
  XP_EARNED = 'xp_earned',
  PERFECT_SCORES = 'perfect_scores',
  HELP_OTHERS = 'help_others',
  CREATIVE_PROJECTS = 'creative_projects',
}

// AI Types
export interface AIResponse {
  content: string;
  confidence: number;
  sources?: string[];
  suggestions?: string[];
  metadata?: Record<string, any>;
}

export interface AIPersonality {
  name: string;
  voice: VoiceSettings;
  avatar: AvatarSettings;
  traits: PersonalityTraits;
  ageGroup: GradeLevel[];
}

export interface VoiceSettings {
  gender: 'male' | 'female' | 'neutral';
  accent: string;
  speed: number;
  pitch: number;
  emotion: EmotionLevel;
}

export interface AvatarSettings {
  style: 'cartoon' | 'realistic' | 'abstract';
  character: string;
  expressions: boolean;
  animations: boolean;
}

export interface PersonalityTraits {
  enthusiasm: number; // 1-10
  patience: number; // 1-10
  humor: number; // 1-10
  formality: number; // 1-10
  encouragement: number; // 1-10
}

export enum EmotionLevel {
  NEUTRAL = 'neutral',
  HAPPY = 'happy',
  EXCITED = 'excited',
  CALM = 'calm',
  ENCOURAGING = 'encouraging',
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
  timestamp: Date;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// Pagination Types
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Event Types
export interface Event {
  id: string;
  type: EventType;
  userId: string;
  data: Record<string, any>;
  timestamp: Date;
  sessionId?: string;
}

export enum EventType {
  USER_LOGIN = 'user_login',
  USER_LOGOUT = 'user_logout',
  LESSON_STARTED = 'lesson_started',
  LESSON_COMPLETED = 'lesson_completed',
  ASSESSMENT_SUBMITTED = 'assessment_submitted',
  BADGE_EARNED = 'badge_earned',
  XP_GAINED = 'xp_gained',
  HELP_REQUESTED = 'help_requested',
  ERROR_OCCURRED = 'error_occurred',
}

// Export assessment types
export * from './assessment';

// Export gamification types
export * from './gamification';

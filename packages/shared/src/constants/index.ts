// App Constants
export const APP_NAME = 'TeachMe';
export const APP_TAGLINE = 'Smart Learning. Real Fun. Every Grade.';
export const APP_VERSION = '1.0.0';

// API Constants
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
  },
  USERS: {
    PROFILE: '/users/profile',
    UPDATE: '/users/update',
    DELETE: '/users/delete',
    PREFERENCES: '/users/preferences',
  },
  STUDENTS: {
    LIST: '/students',
    DETAIL: '/students/:id',
    PROGRESS: '/students/:id/progress',
    BADGES: '/students/:id/badges',
    XP: '/students/:id/xp',
  },
  TEACHERS: {
    LIST: '/teachers',
    DETAIL: '/teachers/:id',
    CLASSROOMS: '/teachers/:id/classrooms',
    STUDENTS: '/teachers/:id/students',
  },
  LESSONS: {
    LIST: '/lessons',
    DETAIL: '/lessons/:id',
    CREATE: '/lessons',
    UPDATE: '/lessons/:id',
    DELETE: '/lessons/:id',
    SEARCH: '/lessons/search',
  },
  ASSESSMENTS: {
    LIST: '/assessments',
    DETAIL: '/assessments/:id',
    SUBMIT: '/assessments/:id/submit',
    RESULTS: '/assessments/:id/results',
  },
  AI: {
    CHAT: '/ai/chat',
    LESSON_PLAN: '/ai/lesson-plan',
    ASSESSMENT: '/ai/assessment',
    FEEDBACK: '/ai/feedback',
    TUTOR: '/ai/tutor',
  },
  SCHOOLS: {
    LIST: '/schools',
    DETAIL: '/schools/:id',
    SETTINGS: '/schools/:id/settings',
  },
} as const;

// Grade Level Constants
export const GRADE_LEVELS = {
  K: { label: 'Kindergarten', ageRange: '5-6', order: 0 },
  '1': { label: 'Grade 1', ageRange: '6-7', order: 1 },
  '2': { label: 'Grade 2', ageRange: '7-8', order: 2 },
  '3': { label: 'Grade 3', ageRange: '8-9', order: 3 },
  '4': { label: 'Grade 4', ageRange: '9-10', order: 4 },
  '5': { label: 'Grade 5', ageRange: '10-11', order: 5 },
  '6': { label: 'Grade 6', ageRange: '11-12', order: 6 },
  '7': { label: 'Grade 7', ageRange: '12-13', order: 7 },
  '8': { label: 'Grade 8', ageRange: '13-14', order: 8 },
  '9': { label: 'Grade 9', ageRange: '14-15', order: 9 },
  '10': { label: 'Grade 10', ageRange: '15-16', order: 10 },
  '11': { label: 'Grade 11', ageRange: '16-17', order: 11 },
  '12': { label: 'Grade 12', ageRange: '17-18', order: 12 },
} as const;

// Subject Constants
export const SUBJECTS = {
  MATH: {
    id: 'math',
    name: 'Mathematics',
    icon: '🔢',
    color: '#3B82F6',
    description: 'Numbers, algebra, geometry, and problem solving',
  },
  SCIENCE: {
    id: 'science',
    name: 'Science',
    icon: '🔬',
    color: '#10B981',
    description: 'Biology, chemistry, physics, and earth science',
  },
  ENGLISH: {
    id: 'english',
    name: 'English Language Arts',
    icon: '📚',
    color: '#8B5CF6',
    description: 'Reading, writing, grammar, and literature',
  },
  SOCIAL_STUDIES: {
    id: 'social_studies',
    name: 'Social Studies',
    icon: '🌍',
    color: '#F59E0B',
    description: 'History, geography, civics, and culture',
  },
  ART: {
    id: 'art',
    name: 'Art',
    icon: '🎨',
    color: '#EF4444',
    description: 'Visual arts, creativity, and expression',
  },
  MUSIC: {
    id: 'music',
    name: 'Music',
    icon: '🎵',
    color: '#EC4899',
    description: 'Musical theory, instruments, and performance',
  },
  PHYSICAL_EDUCATION: {
    id: 'physical_education',
    name: 'Physical Education',
    icon: '⚽',
    color: '#06B6D4',
    description: 'Sports, fitness, and healthy living',
  },
  COMPUTER_SCIENCE: {
    id: 'computer_science',
    name: 'Computer Science',
    icon: '💻',
    color: '#6366F1',
    description: 'Programming, technology, and digital literacy',
  },
} as const;

// XP and Leveling Constants
export const XP_CONSTANTS = {
  LESSON_COMPLETED: 100,
  ASSESSMENT_PERFECT: 200,
  ASSESSMENT_GOOD: 150,
  ASSESSMENT_FAIR: 100,
  DAILY_LOGIN: 25,
  STREAK_BONUS: 50,
  HELP_CLASSMATE: 75,
  CREATIVE_PROJECT: 300,
  BADGE_EARNED: 500,
} as const;

export const LEVEL_THRESHOLDS = [
  0, 100, 250, 500, 1000, 1750, 2750, 4000, 5500, 7250, 9250, 11500, 14000,
  16750, 19750, 23000, 26500, 30250, 34250, 38500, 43000, 47750, 52750, 58000,
  63500, 69250, 75250, 81500, 88000, 94750, 101750, 109000, 116500, 124250,
  132250, 140500, 149000, 157750, 166750, 176000, 185500, 195250, 205250,
  215500, 226000, 236750, 247750, 259000, 270500, 282250,
];

// Badge Constants
export const BADGE_CATEGORIES = {
  ACHIEVEMENT: {
    name: 'Achievement',
    icon: '🏆',
    color: '#F59E0B',
    description: 'Earned through completing specific goals',
  },
  PROGRESS: {
    name: 'Progress',
    icon: '📈',
    color: '#10B981',
    description: 'Earned through consistent learning progress',
  },
  BEHAVIOR: {
    name: 'Behavior',
    icon: '⭐',
    color: '#3B82F6',
    description: 'Earned through positive learning behaviors',
  },
  CREATIVITY: {
    name: 'Creativity',
    icon: '🎨',
    color: '#8B5CF6',
    description: 'Earned through creative projects and thinking',
  },
  COLLABORATION: {
    name: 'Collaboration',
    icon: '🤝',
    color: '#06B6D4',
    description: 'Earned through helping and working with others',
  },
  SPECIAL: {
    name: 'Special',
    icon: '🌟',
    color: '#EC4899',
    description: 'Rare badges for exceptional achievements',
  },
} as const;

// AI Constants
export const AI_PERSONALITIES = {
  FRIENDLY_TEACHER: {
    name: 'Ms. Spark',
    description: 'Enthusiastic and encouraging teacher',
    traits: { enthusiasm: 9, patience: 8, humor: 7, formality: 4, encouragement: 10 },
    ageGroups: ['K', '1', '2', '3', '4', '5'],
  },
  WISE_MENTOR: {
    name: 'Professor Oak',
    description: 'Knowledgeable and patient mentor',
    traits: { enthusiasm: 6, patience: 10, humor: 5, formality: 8, encouragement: 8 },
    ageGroups: ['6', '7', '8', '9', '10', '11', '12'],
  },
  COOL_TUTOR: {
    name: 'Alex',
    description: 'Relatable and modern tutor',
    traits: { enthusiasm: 8, patience: 7, humor: 9, formality: 3, encouragement: 8 },
    ageGroups: ['6', '7', '8', '9', '10', '11', '12'],
  },
} as const;

// Time Constants
export const TIME_CONSTANTS = {
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  REFRESH_TOKEN_EXPIRY: 30 * 24 * 60 * 60 * 1000, // 30 days
  PASSWORD_RESET_EXPIRY: 60 * 60 * 1000, // 1 hour
  EMAIL_VERIFICATION_EXPIRY: 24 * 60 * 60 * 1000, // 24 hours
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: 100,
} as const;

// File Upload Constants
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm', 'video/ogg'],
  ALLOWED_AUDIO_TYPES: ['audio/mp3', 'audio/wav', 'audio/ogg'],
  ALLOWED_DOCUMENT_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ],
} as const;

// Validation Constants
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 30,
  EMAIL_MAX_LENGTH: 254,
  NAME_MAX_LENGTH: 50,
  DESCRIPTION_MAX_LENGTH: 500,
  LESSON_TITLE_MAX_LENGTH: 100,
  ASSESSMENT_TITLE_MAX_LENGTH: 100,
} as const;

// Error Codes
export const ERROR_CODES = {
  // Authentication Errors
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_INVALID: 'TOKEN_INVALID',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
  ACCOUNT_DISABLED: 'ACCOUNT_DISABLED',
  
  // Authorization Errors
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  ACCESS_DENIED: 'ACCESS_DENIED',
  
  // Validation Errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  
  // Resource Errors
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  RESOURCE_ALREADY_EXISTS: 'RESOURCE_ALREADY_EXISTS',
  RESOURCE_CONFLICT: 'RESOURCE_CONFLICT',
  
  // System Errors
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  
  // AI Service Errors
  AI_SERVICE_ERROR: 'AI_SERVICE_ERROR',
  AI_QUOTA_EXCEEDED: 'AI_QUOTA_EXCEEDED',
  AI_CONTENT_FILTERED: 'AI_CONTENT_FILTERED',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  USER_CREATED: 'User account created successfully',
  USER_UPDATED: 'User profile updated successfully',
  PASSWORD_CHANGED: 'Password changed successfully',
  EMAIL_VERIFIED: 'Email verified successfully',
  LESSON_CREATED: 'Lesson created successfully',
  LESSON_UPDATED: 'Lesson updated successfully',
  ASSESSMENT_SUBMITTED: 'Assessment submitted successfully',
  PROGRESS_SAVED: 'Progress saved successfully',
} as const;

// Feature Flags
export const FEATURE_FLAGS = {
  VOICE_FEATURES: 'voice_features',
  AR_FEATURES: 'ar_features',
  OFFLINE_MODE: 'offline_mode',
  ANALYTICS: 'analytics',
  CONTENT_MODERATION: 'content_moderation',
  GAMIFICATION: 'gamification',
  PARENT_DASHBOARD: 'parent_dashboard',
  TEACHER_TOOLS: 'teacher_tools',
  AI_TUTORING: 'ai_tutoring',
  COLLABORATIVE_LEARNING: 'collaborative_learning',
} as const;

// Theme Constants
export const THEMES = {
  LIGHT: {
    name: 'Light',
    colors: {
      primary: '#3B82F6',
      secondary: '#8B5CF6',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      background: '#FFFFFF',
      surface: '#F9FAFB',
      text: '#111827',
    },
  },
  DARK: {
    name: 'Dark',
    colors: {
      primary: '#60A5FA',
      secondary: '#A78BFA',
      success: '#34D399',
      warning: '#FBBF24',
      error: '#F87171',
      background: '#111827',
      surface: '#1F2937',
      text: '#F9FAFB',
    },
  },
} as const;

// Age Group Configurations
export const AGE_GROUP_CONFIGS = {
  EARLY_ELEMENTARY: {
    grades: ['K', '1', '2'],
    features: {
      colorfulInterface: true,
      touchBased: true,
      aiMascot: true,
      voiceInteraction: true,
      simpleGamification: true,
      parentalControls: 'strict',
    },
  },
  LATE_ELEMENTARY: {
    grades: ['3', '4', '5'],
    features: {
      voiceQA: true,
      readingChallenges: true,
      basicAR: true,
      pointsSystem: true,
      leaderboards: true,
      parentalControls: 'moderate',
    },
  },
  MIDDLE_SCHOOL: {
    grades: ['6', '7', '8'],
    features: {
      projectBuilders: true,
      socraticQuestioning: true,
      codingLab: true,
      advancedGamification: true,
      socialFeatures: true,
      parentalControls: 'relaxed',
    },
  },
  HIGH_SCHOOL: {
    grades: ['9', '10', '11', '12'],
    features: {
      testPrep: true,
      researchTools: true,
      debateMode: true,
      careerExploration: true,
      advancedProjects: true,
      parentalControls: 'minimal',
    },
  },
} as const;

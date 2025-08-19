// Extended lesson types that build on the existing types in index.ts

export interface LessonModule {
  id: string;
  lessonId: string;
  title: string;
  description: string;
  order: number;
  content: ModuleContent[];
  estimatedTime: number; // in minutes
  isRequired: boolean;
}

export interface ModuleContent {
  id: string;
  type: ModuleContentType;
  title: string;
  content: string;
  order: number;
  metadata?: ContentMetadata;
  isInteractive: boolean;
  completionCriteria?: CompletionCriteria;
}

export interface CompletionCriteria {
  type: CompletionType;
  value?: number;
  timeRequired?: number; // in seconds
  interactionRequired?: boolean;
}

export enum CompletionType {
  TIME_BASED = 'TIME_BASED',
  INTERACTION_BASED = 'INTERACTION_BASED',
  QUIZ_BASED = 'QUIZ_BASED',
  MANUAL = 'MANUAL'
}

export enum ModuleContentType {
  INTRODUCTION = 'INTRODUCTION',
  LESSON_TEXT = 'LESSON_TEXT',
  VIDEO_LECTURE = 'VIDEO_LECTURE',
  INTERACTIVE_DEMO = 'INTERACTIVE_DEMO',
  PRACTICE_EXERCISE = 'PRACTICE_EXERCISE',
  KNOWLEDGE_CHECK = 'KNOWLEDGE_CHECK',
  SUMMARY = 'SUMMARY',
  ADDITIONAL_RESOURCES = 'ADDITIONAL_RESOURCES'
}

export interface StudentLessonProgress {
  id: string;
  lessonId: string;
  studentId: string;
  status: LessonProgressStatus;
  completedModules: string[]; // module IDs
  currentModuleId?: string;
  moduleProgress: ModuleProgress[];
  assessmentScores: StudentAssessmentScore[];
  totalTimeSpent: number; // in minutes
  startedAt: Date;
  completedAt?: Date;
  lastAccessedAt: Date;
  notes?: StudentNote[];
  bookmarks: Bookmark[];
}

export interface ModuleProgress {
  moduleId: string;
  status: ModuleProgressStatus;
  completedContent: string[]; // content IDs
  timeSpent: number; // in minutes
  startedAt: Date;
  completedAt?: Date;
  score?: number;
}

export interface StudentAssessmentScore {
  assessmentId: string;
  score: number;
  maxScore: number;
  attempts: number;
  completedAt: Date;
  answers: StudentAnswer[];
}

export interface StudentAnswer {
  questionId: string;
  answer: string | string[];
  isCorrect: boolean;
  timeSpent: number; // in seconds
}

export interface StudentNote {
  id: string;
  moduleId: string;
  contentId?: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Bookmark {
  id: string;
  moduleId: string;
  contentId: string;
  title: string;
  createdAt: Date;
}

export interface ContentMetadata {
  videoUrl?: string;
  videoDuration?: number;
  imageUrls?: string[];
  interactiveElements?: InteractiveElement[];
  codeExamples?: CodeExample[];
  downloadableFiles?: DownloadableFile[];
  externalLinks?: ExternalLink[];
}

export interface InteractiveElement {
  id: string;
  type: InteractiveElementType;
  data: any;
  instructions?: string;
}

export interface CodeExample {
  id: string;
  language: string;
  code: string;
  description?: string;
  isExecutable?: boolean;
}

export interface DownloadableFile {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
}

export interface ExternalLink {
  id: string;
  title: string;
  url: string;
  description?: string;
}

// Enums
export enum LessonProgressStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  PAUSED = 'PAUSED',
  FAILED = 'FAILED'
}

export enum ModuleProgressStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  SKIPPED = 'SKIPPED'
}

export enum InteractiveElementType {
  DRAG_DROP = 'DRAG_DROP',
  SIMULATION = 'SIMULATION',
  GAME = 'GAME',
  CALCULATOR = 'CALCULATOR',
  DIAGRAM = 'DIAGRAM',
  TIMELINE = 'TIMELINE',
  VIRTUAL_LAB = 'VIRTUAL_LAB',
  CODE_EDITOR = 'CODE_EDITOR',
  DRAWING_CANVAS = 'DRAWING_CANVAS'
}

// API Request/Response types
export interface CreateLessonModuleRequest {
  lessonId: string;
  title: string;
  description: string;
  order: number;
  content: Omit<ModuleContent, 'id'>[];
  estimatedTime: number;
  isRequired: boolean;
}

export interface UpdateLessonModuleRequest extends Partial<CreateLessonModuleRequest> {
  id: string;
}

export interface LessonProgressRequest {
  lessonId: string;
  studentId: string;
  moduleId?: string;
  contentId?: string;
  action: ProgressAction;
  data?: any;
}

export interface LessonAnalytics {
  lessonId: string;
  totalStudents: number;
  completedStudents: number;
  averageTimeSpent: number;
  averageScore: number;
  completionRate: number;
  moduleAnalytics: ModuleAnalytics[];
  commonStruggles: string[];
  popularContent: string[];
}

export interface ModuleAnalytics {
  moduleId: string;
  title: string;
  completionRate: number;
  averageTimeSpent: number;
  dropOffRate: number;
  contentAnalytics: ContentAnalytics[];
}

export interface ContentAnalytics {
  contentId: string;
  title: string;
  viewCount: number;
  averageTimeSpent: number;
  interactionRate: number;
  skipRate: number;
}

export interface TeacherLessonDashboard {
  totalLessons: number;
  publishedLessons: number;
  draftLessons: number;
  totalStudentEnrollments: number;
  averageCompletionRate: number;
  recentActivity: LessonActivity[];
  topPerformingLessons: LessonPerformance[];
  strugglingStudents: StudentStruggle[];
}

export interface LessonActivity {
  id: string;
  type: ActivityType;
  lessonId: string;
  lessonTitle: string;
  studentId?: string;
  studentName?: string;
  timestamp: Date;
  details: string;
}

export interface LessonPerformance {
  lessonId: string;
  title: string;
  completionRate: number;
  averageScore: number;
  studentCount: number;
}

export interface StudentStruggle {
  studentId: string;
  studentName: string;
  lessonId: string;
  lessonTitle: string;
  strugglingModule: string;
  timeStuck: number; // in minutes
  lastActivity: Date;
}

export enum ProgressAction {
  START_LESSON = 'START_LESSON',
  START_MODULE = 'START_MODULE',
  COMPLETE_CONTENT = 'COMPLETE_CONTENT',
  COMPLETE_MODULE = 'COMPLETE_MODULE',
  COMPLETE_LESSON = 'COMPLETE_LESSON',
  ADD_NOTE = 'ADD_NOTE',
  ADD_BOOKMARK = 'ADD_BOOKMARK',
  SUBMIT_ASSESSMENT = 'SUBMIT_ASSESSMENT',
  PAUSE_LESSON = 'PAUSE_LESSON',
  RESUME_LESSON = 'RESUME_LESSON'
}

export enum ActivityType {
  LESSON_STARTED = 'LESSON_STARTED',
  LESSON_COMPLETED = 'LESSON_COMPLETED',
  MODULE_COMPLETED = 'MODULE_COMPLETED',
  ASSESSMENT_SUBMITTED = 'ASSESSMENT_SUBMITTED',
  STUDENT_STRUGGLING = 'STUDENT_STRUGGLING',
  LESSON_PUBLISHED = 'LESSON_PUBLISHED',
  LESSON_UPDATED = 'LESSON_UPDATED'
}

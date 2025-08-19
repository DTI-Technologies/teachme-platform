// Assessment and Quiz Types

export interface Quiz {
  id: string;
  title: string;
  description: string;
  lessonId?: string;
  subject: Subject;
  gradeLevel: GradeLevel;
  difficulty: DifficultyLevel;
  questions: Question[];
  settings: QuizSettings;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isPublished: boolean;
  tags: string[];
}

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string | string[] | number;
  explanation?: string;
  points: number;
  timeLimit?: number; // in seconds
  difficulty: DifficultyLevel;
  hints?: string[];
  media?: QuestionMedia;
  order: number;
}

export interface QuestionMedia {
  type: MediaType;
  url: string;
  alt?: string;
  caption?: string;
}

export interface QuizSettings {
  timeLimit?: number; // in minutes
  maxAttempts: number;
  passingScore: number; // percentage
  showCorrectAnswers: boolean;
  showExplanations: boolean;
  allowReview: boolean;
  randomizeQuestions: boolean;
  randomizeOptions: boolean;
  requireAllQuestions: boolean;
  showProgressBar: boolean;
  allowPause: boolean;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  studentId: string;
  attemptNumber: number;
  answers: StudentAnswer[];
  startedAt: Date;
  submittedAt?: Date;
  timeSpent: number; // in seconds
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  status: AttemptStatus;
  feedback?: string;
}

export interface StudentAnswer {
  questionId: string;
  answer: string | string[] | number;
  isCorrect: boolean;
  pointsEarned: number;
  maxPoints: number;
  timeSpent: number; // in seconds
  hintsUsed: number;
  submittedAt: Date;
}

export interface QuizResult {
  attemptId: string;
  quizId: string;
  studentId: string;
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  timeSpent: number;
  questionsCorrect: number;
  totalQuestions: number;
  submittedAt: Date;
  breakdown: QuestionResult[];
  feedback: string;
  recommendations: string[];
}

export interface QuestionResult {
  questionId: string;
  question: string;
  studentAnswer: string | string[] | number;
  correctAnswer: string | string[] | number;
  isCorrect: boolean;
  pointsEarned: number;
  maxPoints: number;
  explanation?: string;
  feedback?: string;
}

export interface QuizAnalytics {
  quizId: string;
  title: string;
  totalAttempts: number;
  uniqueStudents: number;
  averageScore: number;
  passRate: number;
  averageTimeSpent: number;
  questionAnalytics: QuestionAnalytics[];
  difficultyDistribution: DifficultyStats[];
  completionRate: number;
  retakeRate: number;
}

export interface QuestionAnalytics {
  questionId: string;
  question: string;
  totalAnswers: number;
  correctAnswers: number;
  accuracy: number;
  averageTimeSpent: number;
  hintsUsed: number;
  commonWrongAnswers: AnswerFrequency[];
  difficulty: DifficultyLevel;
}

export interface AnswerFrequency {
  answer: string;
  count: number;
  percentage: number;
}

export interface DifficultyStats {
  difficulty: DifficultyLevel;
  count: number;
  averageScore: number;
}

// Enums
export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TRUE_FALSE = 'TRUE_FALSE',
  SHORT_ANSWER = 'SHORT_ANSWER',
  ESSAY = 'ESSAY',
  FILL_IN_BLANK = 'FILL_IN_BLANK',
  MATCHING = 'MATCHING',
  ORDERING = 'ORDERING',
  DRAG_DROP = 'DRAG_DROP',
  NUMERIC = 'NUMERIC',
  MULTIPLE_SELECT = 'MULTIPLE_SELECT'
}

export enum AttemptStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  SUBMITTED = 'SUBMITTED',
  GRADED = 'GRADED',
  ABANDONED = 'ABANDONED',
  EXPIRED = 'EXPIRED'
}

export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  DOCUMENT = 'DOCUMENT'
}

export enum Subject {
  MATHEMATICS = 'MATHEMATICS',
  SCIENCE = 'SCIENCE',
  ENGLISH = 'ENGLISH',
  HISTORY = 'HISTORY',
  GEOGRAPHY = 'GEOGRAPHY',
  ART = 'ART',
  MUSIC = 'MUSIC',
  PHYSICAL_EDUCATION = 'PHYSICAL_EDUCATION',
  COMPUTER_SCIENCE = 'COMPUTER_SCIENCE',
  FOREIGN_LANGUAGE = 'FOREIGN_LANGUAGE'
}

export enum GradeLevel {
  KINDERGARTEN = 'KINDERGARTEN',
  GRADE_1 = 'GRADE_1',
  GRADE_2 = 'GRADE_2',
  GRADE_3 = 'GRADE_3',
  GRADE_4 = 'GRADE_4',
  GRADE_5 = 'GRADE_5',
  GRADE_6 = 'GRADE_6',
  GRADE_7 = 'GRADE_7',
  GRADE_8 = 'GRADE_8',
  GRADE_9 = 'GRADE_9',
  GRADE_10 = 'GRADE_10',
  GRADE_11 = 'GRADE_11',
  GRADE_12 = 'GRADE_12'
}

export enum DifficultyLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT'
}

// API Request/Response Types
export interface CreateQuizRequest {
  title: string;
  description: string;
  lessonId?: string;
  subject: Subject;
  gradeLevel: GradeLevel;
  difficulty: DifficultyLevel;
  questions: Omit<Question, 'id'>[];
  settings: QuizSettings;
  tags: string[];
}

export interface UpdateQuizRequest extends Partial<CreateQuizRequest> {
  id: string;
}

export interface StartQuizRequest {
  quizId: string;
  studentId: string;
}

export interface SubmitAnswerRequest {
  attemptId: string;
  questionId: string;
  answer: string | string[] | number;
  timeSpent: number;
  hintsUsed?: number;
}

export interface SubmitQuizRequest {
  attemptId: string;
  answers: Omit<StudentAnswer, 'isCorrect' | 'pointsEarned' | 'maxPoints'>[];
}

export interface QuizListResponse {
  quizzes: Quiz[];
  total: number;
  page: number;
  limit: number;
}

export interface QuizFilters {
  subject?: Subject;
  gradeLevel?: GradeLevel;
  difficulty?: DifficultyLevel;
  lessonId?: string;
  tags?: string[];
  search?: string;
  createdBy?: string;
}

export interface GenerateQuizRequest {
  lessonId?: string;
  subject: Subject;
  gradeLevel: GradeLevel;
  difficulty: DifficultyLevel;
  questionCount: number;
  questionTypes: QuestionType[];
  topics: string[];
  learningObjectives?: string[];
}

export interface AIQuizGeneration {
  questions: Omit<Question, 'id'>[];
  suggestedSettings: Partial<QuizSettings>;
  metadata: {
    generatedAt: Date;
    model: string;
    prompt: string;
    confidence: number;
  };
}

// Grading and Feedback Types
export interface GradingResult {
  attemptId: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  questionResults: QuestionGradingResult[];
  overallFeedback: string;
  recommendations: string[];
  timeBonus?: number;
  penalties?: GradingPenalty[];
}

export interface QuestionGradingResult {
  questionId: string;
  pointsEarned: number;
  maxPoints: number;
  isCorrect: boolean;
  feedback: string;
  explanation?: string;
  partialCredit?: PartialCredit;
}

export interface PartialCredit {
  earned: number;
  possible: number;
  reason: string;
}

export interface GradingPenalty {
  type: PenaltyType;
  points: number;
  reason: string;
}

export enum PenaltyType {
  LATE_SUBMISSION = 'LATE_SUBMISSION',
  EXCESSIVE_HINTS = 'EXCESSIVE_HINTS',
  TIME_EXCEEDED = 'TIME_EXCEEDED',
  MULTIPLE_ATTEMPTS = 'MULTIPLE_ATTEMPTS'
}

// Student Performance Types
export interface StudentQuizPerformance {
  studentId: string;
  quizId: string;
  attempts: QuizAttempt[];
  bestScore: number;
  averageScore: number;
  totalTimeSpent: number;
  improvementTrend: number; // percentage improvement
  strugglingAreas: string[];
  strengths: string[];
  recommendations: string[];
}

export interface ClassQuizPerformance {
  quizId: string;
  classId: string;
  studentPerformances: StudentQuizPerformance[];
  classAverage: number;
  passRate: number;
  completionRate: number;
  averageTimeSpent: number;
  topPerformers: string[];
  strugglingStudents: string[];
  commonMistakes: CommonMistake[];
}

export interface CommonMistake {
  questionId: string;
  question: string;
  wrongAnswer: string;
  frequency: number;
  suggestedRemediation: string;
}

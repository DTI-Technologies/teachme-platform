// Age-appropriate content and gamification utilities for K-12 platform

export interface GradeLevel {
  value: string;
  label: string;
  ageRange: string;
  category: 'elementary' | 'middle' | 'high';
}

export const GRADE_LEVELS: GradeLevel[] = [
  { value: 'KINDERGARTEN', label: 'Kindergarten', ageRange: '5-6', category: 'elementary' },
  { value: 'GRADE_1', label: 'Grade 1', ageRange: '6-7', category: 'elementary' },
  { value: 'GRADE_2', label: 'Grade 2', ageRange: '7-8', category: 'elementary' },
  { value: 'GRADE_3', label: 'Grade 3', ageRange: '8-9', category: 'elementary' },
  { value: 'GRADE_4', label: 'Grade 4', ageRange: '9-10', category: 'elementary' },
  { value: 'GRADE_5', label: 'Grade 5', ageRange: '10-11', category: 'elementary' },
  { value: 'GRADE_6', label: 'Grade 6', ageRange: '11-12', category: 'middle' },
  { value: 'GRADE_7', label: 'Grade 7', ageRange: '12-13', category: 'middle' },
  { value: 'GRADE_8', label: 'Grade 8', ageRange: '13-14', category: 'middle' },
  { value: 'GRADE_9', label: 'Grade 9', ageRange: '14-15', category: 'high' },
  { value: 'GRADE_10', label: 'Grade 10', ageRange: '15-16', category: 'high' },
  { value: 'GRADE_11', label: 'Grade 11', ageRange: '16-17', category: 'high' },
  { value: 'GRADE_12', label: 'Grade 12', ageRange: '17-18', category: 'high' },
];

export const formatGradeLevel = (gradeLevel: string): string => {
  const grade = GRADE_LEVELS.find(g => g.value === gradeLevel);
  return grade ? grade.label : gradeLevel;
};

export const getGradeCategory = (gradeLevel: string): 'elementary' | 'middle' | 'high' => {
  const grade = GRADE_LEVELS.find(g => g.value === gradeLevel);
  return grade ? grade.category : 'elementary';
};

export const getAgeRange = (gradeLevel: string): string => {
  const grade = GRADE_LEVELS.find(g => g.value === gradeLevel);
  return grade ? grade.ageRange : '5-18';
};

// Age-appropriate gamification settings
export interface GamificationSettings {
  xpMultiplier: number;
  badgeStyle: 'cute' | 'cool' | 'professional';
  achievementTone: 'playful' | 'encouraging' | 'mature';
  competitiveFeatures: boolean;
  socialFeatures: boolean;
  parentalControls: boolean;
}

export const getGamificationSettings = (gradeLevel: string): GamificationSettings => {
  const category = getGradeCategory(gradeLevel);
  
  switch (category) {
    case 'elementary':
      return {
        xpMultiplier: 1.2, // More XP for younger students
        badgeStyle: 'cute',
        achievementTone: 'playful',
        competitiveFeatures: false, // Less competition for young kids
        socialFeatures: false, // Limited social features
        parentalControls: true
      };
    
    case 'middle':
      return {
        xpMultiplier: 1.0,
        badgeStyle: 'cool',
        achievementTone: 'encouraging',
        competitiveFeatures: true, // Healthy competition
        socialFeatures: true, // Supervised social features
        parentalControls: true
      };
    
    case 'high':
      return {
        xpMultiplier: 0.8, // Less XP inflation for older students
        badgeStyle: 'professional',
        achievementTone: 'mature',
        competitiveFeatures: true,
        socialFeatures: true,
        parentalControls: false // More independence
      };
    
    default:
      return {
        xpMultiplier: 1.0,
        badgeStyle: 'cool',
        achievementTone: 'encouraging',
        competitiveFeatures: true,
        socialFeatures: true,
        parentalControls: true
      };
  }
};

// Age-appropriate achievement messages
export const getAchievementMessage = (achievementName: string, gradeLevel: string): string => {
  const settings = getGamificationSettings(gradeLevel);
  
  const messages = {
    playful: {
      'First Steps': '🎉 Awesome! You completed your first lesson! You\'re a learning superstar!',
      'Streak Warrior': '🔥 Amazing! You\'ve been learning every day! Keep up the fantastic work!',
      'Perfect Score': '⭐ WOW! You got everything right! You\'re incredible!',
      'Knowledge Seeker': '📚 You love learning so much! You\'ve completed lots of lessons!'
    },
    encouraging: {
      'First Steps': '🎯 Great job completing your first lesson! You\'re off to an excellent start!',
      'Streak Warrior': '🔥 Impressive! You\'ve maintained a consistent learning streak!',
      'Perfect Score': '⭐ Outstanding! You achieved a perfect score! Your hard work is paying off!',
      'Knowledge Seeker': '📚 Excellent progress! You\'re showing real dedication to learning!'
    },
    mature: {
      'First Steps': '🎯 Congratulations on completing your first lesson. You\'ve taken the first step toward mastery.',
      'Streak Warrior': '🔥 Excellent consistency. Your dedication to daily learning is commendable.',
      'Perfect Score': '⭐ Perfect execution. Your attention to detail and preparation have paid off.',
      'Knowledge Seeker': '📚 Impressive commitment to learning. Your academic progress is noteworthy.'
    }
  };
  
  return messages[settings.achievementTone][achievementName] || 'Great achievement!';
};

// Age-appropriate badge designs
export const getBadgeDesign = (badgeName: string, gradeLevel: string) => {
  const settings = getGamificationSettings(gradeLevel);
  
  const designs = {
    cute: {
      'Math Master': { icon: '🧮', color: 'from-pink-400 to-purple-500', border: 'border-pink-300' },
      'Science Explorer': { icon: '🔬', color: 'from-green-400 to-blue-500', border: 'border-green-300' },
      'Reading Champion': { icon: '📖', color: 'from-yellow-400 to-orange-500', border: 'border-yellow-300' },
      'Art Creator': { icon: '🎨', color: 'from-purple-400 to-pink-500', border: 'border-purple-300' }
    },
    cool: {
      'Math Master': { icon: '🏆', color: 'from-blue-500 to-purple-600', border: 'border-blue-400' },
      'Science Explorer': { icon: '⚗️', color: 'from-green-500 to-teal-600', border: 'border-green-400' },
      'Reading Champion': { icon: '📚', color: 'from-orange-500 to-red-600', border: 'border-orange-400' },
      'Art Creator': { icon: '🎭', color: 'from-purple-500 to-indigo-600', border: 'border-purple-400' }
    },
    professional: {
      'Math Master': { icon: '📊', color: 'from-gray-600 to-blue-700', border: 'border-gray-500' },
      'Science Explorer': { icon: '🔬', color: 'from-green-600 to-emerald-700', border: 'border-green-500' },
      'Reading Champion': { icon: '📖', color: 'from-amber-600 to-orange-700', border: 'border-amber-500' },
      'Art Creator': { icon: '🎨', color: 'from-purple-600 to-violet-700', border: 'border-purple-500' }
    }
  };
  
  return designs[settings.badgeStyle][badgeName] || designs[settings.badgeStyle]['Math Master'];
};

// Age-appropriate XP calculations
export const calculateXP = (baseXP: number, gradeLevel: string): number => {
  const settings = getGamificationSettings(gradeLevel);
  return Math.round(baseXP * settings.xpMultiplier);
};

// Age-appropriate content complexity
export const getContentComplexity = (gradeLevel: string) => {
  const category = getGradeCategory(gradeLevel);
  
  return {
    elementary: {
      vocabularyLevel: 'simple',
      sentenceLength: 'short',
      conceptDepth: 'basic',
      visualAids: 'high',
      interactivity: 'high'
    },
    middle: {
      vocabularyLevel: 'intermediate',
      sentenceLength: 'medium',
      conceptDepth: 'moderate',
      visualAids: 'medium',
      interactivity: 'medium'
    },
    high: {
      vocabularyLevel: 'advanced',
      sentenceLength: 'complex',
      conceptDepth: 'deep',
      visualAids: 'low',
      interactivity: 'low'
    }
  }[category];
};

// Subject matter appropriate for each grade level
export const getSubjectsForGrade = (gradeLevel: string): string[] => {
  const category = getGradeCategory(gradeLevel);
  
  const subjects = {
    elementary: [
      'Mathematics',
      'Reading',
      'Writing',
      'Science',
      'Social Studies',
      'Art',
      'Music',
      'Physical Education'
    ],
    middle: [
      'Mathematics',
      'English Language Arts',
      'Science',
      'Social Studies',
      'World Languages',
      'Art',
      'Music',
      'Physical Education',
      'Technology'
    ],
    high: [
      'Algebra',
      'Geometry',
      'Calculus',
      'Biology',
      'Chemistry',
      'Physics',
      'English Literature',
      'World History',
      'Government',
      'Economics',
      'World Languages',
      'Computer Science',
      'Art',
      'Music',
      'Physical Education'
    ]
  };
  
  return subjects[category];
};

// Difficulty levels appropriate for each grade category
export const getDifficultyLevels = (gradeLevel: string): string[] => {
  const category = getGradeCategory(gradeLevel);
  
  return {
    elementary: ['beginner', 'easy', 'medium'],
    middle: ['easy', 'medium', 'challenging'],
    high: ['medium', 'challenging', 'advanced', 'expert']
  }[category];
};

export default {
  GRADE_LEVELS,
  formatGradeLevel,
  getGradeCategory,
  getAgeRange,
  getGamificationSettings,
  getAchievementMessage,
  getBadgeDesign,
  calculateXP,
  getContentComplexity,
  getSubjectsForGrade,
  getDifficultyLevels
};

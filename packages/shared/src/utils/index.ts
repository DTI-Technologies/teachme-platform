import { format, isValid, parseISO } from 'date-fns';
import { GradeLevel, UserRole } from '../types';
import { LEVEL_THRESHOLDS, XP_CONSTANTS } from '../constants';

// Date Utilities
export const formatDate = (date: Date | string, formatString = 'MMM dd, yyyy'): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isValid(dateObj) ? format(dateObj, formatString) : 'Invalid Date';
};

export const formatDateTime = (date: Date | string): string => {
  return formatDate(date, 'MMM dd, yyyy HH:mm');
};

export const formatTime = (date: Date | string): string => {
  return formatDate(date, 'HH:mm');
};

export const isDateInPast = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isValid(dateObj) && dateObj < new Date();
};

export const daysBetween = (date1: Date | string, date2: Date | string): number => {
  const d1 = typeof date1 === 'string' ? parseISO(date1) : date1;
  const d2 = typeof date2 === 'string' ? parseISO(date2) : date2;
  
  if (!isValid(d1) || !isValid(d2)) return 0;
  
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// String Utilities
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const capitalizeWords = (str: string): string => {
  return str.split(' ').map(capitalize).join(' ');
};

export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const truncate = (str: string, length: number, suffix = '...'): string => {
  if (str.length <= length) return str;
  return str.substring(0, length - suffix.length) + suffix;
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Validation Utilities
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

// Array Utilities
export const unique = <T>(array: T[]): T[] => {
  return [...new Set(array)];
};

export const groupBy = <T, K extends keyof any>(
  array: T[],
  key: (item: T) => K
): Record<K, T[]> => {
  return array.reduce((groups, item) => {
    const group = key(item);
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {} as Record<K, T[]>);
};

export const sortBy = <T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

export const chunk = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

// Object Utilities
export const pick = <T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
};

export const omit = <T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
  const result = { ...obj };
  keys.forEach(key => {
    delete result[key];
  });
  return result;
};

export const isEmpty = (obj: any): boolean => {
  if (obj == null) return true;
  if (Array.isArray(obj) || typeof obj === 'string') return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return false;
};

// Number Utilities
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

export const round = (value: number, decimals = 0): number => {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
};

export const percentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return round((value / total) * 100, 1);
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat().format(value);
};

// XP and Level Utilities
export const calculateLevel = (xp: number): number => {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      return i + 1;
    }
  }
  return 1;
};

export const getXpForLevel = (level: number): number => {
  const index = Math.max(0, Math.min(level - 1, LEVEL_THRESHOLDS.length - 1));
  return LEVEL_THRESHOLDS[index];
};

export const getXpToNextLevel = (currentXp: number): number => {
  const currentLevel = calculateLevel(currentXp);
  const nextLevelXp = getXpForLevel(currentLevel + 1);
  return Math.max(0, nextLevelXp - currentXp);
};

export const getLevelProgress = (currentXp: number): number => {
  const currentLevel = calculateLevel(currentXp);
  const currentLevelXp = getXpForLevel(currentLevel);
  const nextLevelXp = getXpForLevel(currentLevel + 1);
  
  if (nextLevelXp === currentLevelXp) return 100;
  
  const progress = ((currentXp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;
  return clamp(progress, 0, 100);
};

// Grade Level Utilities
export const getGradeOrder = (grade: GradeLevel): number => {
  const gradeMap: Record<GradeLevel, number> = {
    [GradeLevel.KINDERGARTEN]: 0,
    [GradeLevel.GRADE_1]: 1,
    [GradeLevel.GRADE_2]: 2,
    [GradeLevel.GRADE_3]: 3,
    [GradeLevel.GRADE_4]: 4,
    [GradeLevel.GRADE_5]: 5,
    [GradeLevel.GRADE_6]: 6,
    [GradeLevel.GRADE_7]: 7,
    [GradeLevel.GRADE_8]: 8,
    [GradeLevel.GRADE_9]: 9,
    [GradeLevel.GRADE_10]: 10,
    [GradeLevel.GRADE_11]: 11,
    [GradeLevel.GRADE_12]: 12,
  };
  return gradeMap[grade] || 0;
};

export const sortGradeLevels = (grades: GradeLevel[]): GradeLevel[] => {
  return [...grades].sort((a, b) => getGradeOrder(a) - getGradeOrder(b));
};

export const getAgeGroup = (grade: GradeLevel): 'early_elementary' | 'late_elementary' | 'middle_school' | 'high_school' => {
  const order = getGradeOrder(grade);
  if (order <= 2) return 'early_elementary';
  if (order <= 5) return 'late_elementary';
  if (order <= 8) return 'middle_school';
  return 'high_school';
};

// Permission Utilities
export const hasPermission = (userRole: UserRole, requiredRole: UserRole): boolean => {
  const roleHierarchy: Record<UserRole, number> = {
    [UserRole.STUDENT]: 1,
    [UserRole.PARENT]: 2,
    [UserRole.TEACHER]: 3,
    [UserRole.ADMIN]: 4,
    [UserRole.SUPER_ADMIN]: 5,
  };
  
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};

export const canAccessResource = (
  userRole: UserRole,
  resourceOwnerId: string,
  userId: string,
  requiredRole: UserRole = UserRole.STUDENT
): boolean => {
  // Super admin can access everything
  if (userRole === UserRole.SUPER_ADMIN) return true;
  
  // User can access their own resources
  if (resourceOwnerId === userId) return true;
  
  // Check role-based permissions
  return hasPermission(userRole, requiredRole);
};

// Color Utilities
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

export const rgbToHex = (r: number, g: number, b: number): string => {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

export const getContrastColor = (hex: string): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return '#000000';
  
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  return brightness > 128 ? '#000000' : '#ffffff';
};

// URL Utilities
export const buildUrl = (base: string, path: string, params?: Record<string, any>): string => {
  const url = new URL(path, base);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  
  return url.toString();
};

export const parseQueryParams = (search: string): Record<string, string> => {
  const params = new URLSearchParams(search);
  const result: Record<string, string> = {};
  
  params.forEach((value, key) => {
    result[key] = value;
  });
  
  return result;
};

// Local Storage Utilities
export const storage = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch {
      return defaultValue || null;
    }
  },
  
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Handle storage errors silently
    }
  },
  
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch {
      // Handle storage errors silently
    }
  },
  
  clear: (): void => {
    try {
      localStorage.clear();
    } catch {
      // Handle storage errors silently
    }
  },
};

// Debounce Utility
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle Utility
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Error Handling Utilities
export const safeJsonParse = <T>(json: string, defaultValue: T): T => {
  try {
    return JSON.parse(json);
  } catch {
    return defaultValue;
  }
};

export const asyncTryCatch = async <T>(
  asyncFn: () => Promise<T>
): Promise<[T | null, Error | null]> => {
  try {
    const result = await asyncFn();
    return [result, null];
  } catch (error) {
    return [null, error as Error];
  }
};

// Random Utilities
export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const randomChoice = <T>(array: T[]): T => {
  return array[randomInt(0, array.length - 1)];
};

export const shuffle = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

import { useState, useEffect, createContext, useContext } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMINISTRATOR';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Return mock auth for now
    return {
      user: {
        id: '1',
        email: 'admin@teachme.com',
        name: 'Admin User',
        role: 'ADMINISTRATOR' as const
      },
      login: async (email: string, password: string) => true,
      logout: () => {},
      isLoading: false
    };
  }
  return context;
}

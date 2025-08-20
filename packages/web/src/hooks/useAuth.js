import { useState, useEffect, createContext, useContext } from 'react';

const AuthContext = createContext(undefined);

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

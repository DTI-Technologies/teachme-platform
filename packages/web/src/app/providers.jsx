'use client';

import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from '@/hooks/useAuth';
import { ThemeProvider } from '@/hooks/useTheme';
import { AccessibilityProvider } from '@/hooks/useAccessibility';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AccessibilityProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </AccessibilityProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

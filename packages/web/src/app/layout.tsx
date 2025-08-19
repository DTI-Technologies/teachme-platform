import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TeachMe - Smart Learning. Real Fun. Every Grade.',
  description: 'AI-powered educational platform for K-12 learning with personalized tutoring, lesson planning, and interactive experiences.',
  keywords: ['education', 'AI', 'K-12', 'learning', 'tutoring', 'lessons', 'students', 'teachers'],
  authors: [{ name: 'DTI Technologies' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'TeachMe - Smart Learning Platform',
    description: 'AI-powered educational platform for K-12 learning',
    type: 'website',
    locale: 'en_US',
    siteName: 'TeachMe',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TeachMe - Smart Learning Platform',
    description: 'AI-powered educational platform for K-12 learning',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <div className="min-h-screen bg-gray-50">
            {children}
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}

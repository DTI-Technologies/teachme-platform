'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  AcademicCapIcon, 
  SparklesIcon, 
  UserGroupIcon,
  ChartBarIcon,
  PlayIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const features = [
  {
    icon: SparklesIcon,
    title: 'AI-Powered Learning',
    description: 'Personalized tutoring and lesson plans adapted to each student\'s learning style and pace.',
    color: 'text-purple-500',
  },
  {
    icon: AcademicCapIcon,
    title: 'Grade-Specific Content',
    description: 'Age-appropriate interfaces and content designed specifically for K-12 education.',
    color: 'text-blue-500',
  },
  {
    icon: UserGroupIcon,
    title: 'Collaborative Learning',
    description: 'Connect students, teachers, and parents in a unified learning ecosystem.',
    color: 'text-green-500',
  },
  {
    icon: ChartBarIcon,
    title: 'Progress Tracking',
    description: 'Real-time analytics and insights to monitor learning progress and achievements.',
    color: 'text-orange-500',
  },
];

const gradeGroups = [
  {
    title: 'Early Elementary',
    grades: 'K-2',
    description: 'Colorful, touch-based learning with AI mascots and interactive games.',
    color: 'bg-gradient-to-br from-orange-400 to-yellow-400',
    textColor: 'text-orange-800',
  },
  {
    title: 'Late Elementary',
    grades: '3-5',
    description: 'Voice interaction, reading challenges, and gamified learning experiences.',
    color: 'bg-gradient-to-br from-green-400 to-emerald-400',
    textColor: 'text-green-800',
  },
  {
    title: 'Middle School',
    grades: '6-8',
    description: 'Creative projects, coding labs, and collaborative learning tools.',
    color: 'bg-gradient-to-br from-blue-400 to-cyan-400',
    textColor: 'text-blue-800',
  },
  {
    title: 'High School',
    grades: '9-12',
    description: 'Advanced features, test prep, career exploration, and research tools.',
    color: 'bg-gradient-to-br from-purple-400 to-pink-400',
    textColor: 'text-purple-800',
  },
];

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      // Redirect authenticated users to their dashboard
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
                <span className="block">Smart Learning.</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Real Fun.
                </span>
                <span className="block">Every Grade.</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                TeachMe is an AI-powered educational platform that revolutionizes K-12 learning 
                with personalized tutoring, interactive lessons, and engaging experiences for 
                students, teachers, and parents.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => router.push('/auth/register')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Get Started Free
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => router.push('/demo')}
                >
                  <PlayIcon className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose TeachMe?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform combines cutting-edge AI technology with proven educational 
              methodologies to create the ultimate learning experience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="text-center h-full hover:shadow-lg transition-shadow duration-300">
                  <feature.icon className={`h-12 w-12 mx-auto mb-4 ${feature.color}`} />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Grade Groups Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Designed for Every Grade Level
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Age-appropriate interfaces and content that grow with your students, 
              from kindergarten through high school graduation.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {gradeGroups.map((group, index) => (
              <motion.div
                key={group.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`${group.color} rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300 cursor-pointer`}
                onClick={() => router.push(`/grades/${group.grades.toLowerCase()}`)}
              >
                <h3 className={`text-2xl font-bold ${group.textColor} mb-2`}>
                  {group.title}
                </h3>
                <p className={`text-lg font-semibold ${group.textColor} mb-3`}>
                  Grades {group.grades}
                </p>
                <p className={`${group.textColor} opacity-90`}>
                  {group.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Transform Learning?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of students, teachers, and parents who are already 
              experiencing the future of education with TeachMe.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="outline"
                className="bg-white text-blue-600 border-white hover:bg-blue-50"
                onClick={() => router.push('/auth/register')}
              >
                Start Your Free Trial
              </Button>
              <Button
                size="lg"
                className="bg-blue-800 hover:bg-blue-900 text-white"
                onClick={() => router.push('/contact')}
              >
                Contact Sales
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">TeachMe</h3>
              <p className="text-gray-400">
                Smart Learning. Real Fun. Every Grade.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/features" className="hover:text-white">Features</a></li>
                <li><a href="/pricing" className="hover:text-white">Pricing</a></li>
                <li><a href="/demo" className="hover:text-white">Demo</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/help" className="hover:text-white">Help Center</a></li>
                <li><a href="/contact" className="hover:text-white">Contact</a></li>
                <li><a href="/status" className="hover:text-white">Status</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/about" className="hover:text-white">About</a></li>
                <li><a href="/privacy" className="hover:text-white">Privacy</a></li>
                <li><a href="/terms" className="hover:text-white">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 DTI Technologies. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

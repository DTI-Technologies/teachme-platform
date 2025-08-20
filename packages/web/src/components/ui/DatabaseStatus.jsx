'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { Button } from './Button';
import { Card } from './Card';

export default function DatabaseStatus({ showBanner = true }: DatabaseStatusProps) {
  const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    checkDatabaseStatus();
  }, []);

  const checkDatabaseStatus = async () => {
    try {
      const response = await fetch('/api/backend/health');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // If health check passes, assume database is connected
          setDbStatus('connected');
        } else {
          setDbStatus('disconnected');
        }
      } else {
        setDbStatus('disconnected');
      }
    } catch (error) {
      console.error('Database status check failed:', error);
      setDbStatus('disconnected');
    }
  };

  if (!showBanner || dismissed || dbStatus === 'connected') {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed top-0 left-0 right-0 z-50 bg-yellow-50 border-b border-yellow-200 p-4"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
            <div>
              <p className="text-sm font-medium text-yellow-800">
                Database Not Connected
              </p>
              <p className="text-xs text-yellow-700">
                Using mock data. Set up PostgreSQL for full functionality.
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSetupGuide(true)}
              className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
            >
              <InformationCircleIcon className="mr-2 h-4 w-4" />
              Setup Guide
            </Button>
            <button
              onClick={() => setDismissed(true)}
              className="p-1 hover:bg-yellow-100 rounded"
            >
              <XMarkIcon className="h-5 w-5 text-yellow-600" />
            </button>
          </div>
        </div>

        {/* Setup Guide Modal */}
        {showSetupGuide && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
            <div className="flex items-center justify-center min-h-screen px-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Database Setup Guide</h2>
                    <button
                      onClick={() => setShowSetupGuide(false)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <XMarkIcon className="h-6 w-6 text-gray-400" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-semibold text-blue-900 mb-2">Current Status</h3>
                      <p className="text-blue-800 text-sm">
                        The platform is running with mock data. To enable full functionality including 
                        persistent data storage, user management, and real-time features, you need to set up PostgreSQL.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Setup (Recommended)</h3>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                          <div>
                            <p className="font-medium">Start PostgreSQL with Docker</p>
                            <code className="block bg-gray-800 text-green-400 p-2 rounded mt-1 text-sm">
                              docker-compose up -d postgres
                            </code>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                          <div>
                            <p className="font-medium">Install dependencies and setup database</p>
                            <code className="block bg-gray-800 text-green-400 p-2 rounded mt-1 text-sm">
                              cd packages/backend<br/>
                              npm install<br/>
                              npx prisma generate<br/>
                              npx prisma migrate dev --name init
                            </code>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                          <div>
                            <p className="font-medium">Seed with demo data</p>
                            <code className="block bg-gray-800 text-green-400 p-2 rounded mt-1 text-sm">
                              npm run db:seed
                            </code>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                          <div>
                            <p className="font-medium">Restart the backend server</p>
                            <code className="block bg-gray-800 text-green-400 p-2 rounded mt-1 text-sm">
                              npm run dev
                            </code>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Alternative: Local PostgreSQL</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-700 mb-3">
                          If you prefer to install PostgreSQL locally instead of using Docker:
                        </p>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                          <li>Install PostgreSQL on your system</li>
                          <li>Create a database named <code className="bg-gray-200 px-1 rounded">teachme_db</code></li>
                          <li>Update the <code className="bg-gray-200 px-1 rounded">DATABASE_URL</code> in <code className="bg-gray-200 px-1 rounded">packages/backend/.env</code></li>
                          <li>Follow steps 2-4 from the Docker setup above</li>
                        </ol>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">What You'll Get</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <h4 className="font-medium text-green-900 mb-2">✅ Persistent Data</h4>
                          <p className="text-sm text-green-800">All user data, classes, and progress will be saved permanently</p>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <h4 className="font-medium text-green-900 mb-2">✅ Real User Management</h4>
                          <p className="text-sm text-green-800">Create actual user accounts with authentication</p>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <h4 className="font-medium text-green-900 mb-2">✅ Class Enrollment</h4>
                          <p className="text-sm text-green-800">Teachers can create classes and enroll real students</p>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <h4 className="font-medium text-green-900 mb-2">✅ Progress Tracking</h4>
                          <p className="text-sm text-green-800">Real-time student progress and performance analytics</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="font-medium text-yellow-900 mb-2">💡 Current Mock Data Features</h4>
                      <p className="text-sm text-yellow-800">
                        Even without the database, you can explore all features with sample data. 
                        The interface and functionality are identical - only the data persistence is missing.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end mt-8">
                    <Button onClick={() => setShowSetupGuide(false)}>
                      Got it!
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

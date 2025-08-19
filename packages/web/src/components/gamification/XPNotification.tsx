'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  StarIcon,
  TrophyIcon,
  FireIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid, TrophyIcon as TrophyIconSolid } from '@heroicons/react/24/solid';

interface XPNotificationProps {
  show: boolean;
  amount: number;
  source: string;
  description: string;
  levelUp?: {
    newLevel: number;
    oldLevel: number;
  };
  achievements?: Array<{
    name: string;
    icon: string;
    description: string;
  }>;
  onClose: () => void;
}

export default function XPNotification({
  show,
  amount,
  source,
  description,
  levelUp,
  achievements = [],
  onClose
}: XPNotificationProps) {
  const [currentNotification, setCurrentNotification] = useState(0);
  const [autoClose, setAutoClose] = useState(true);

  const notifications = [
    {
      type: 'xp',
      title: `+${amount} XP`,
      subtitle: description,
      icon: <StarIconSolid className="h-8 w-8 text-yellow-500" />,
      color: 'from-yellow-400 to-orange-500'
    },
    ...(levelUp ? [{
      type: 'levelup',
      title: `Level Up!`,
      subtitle: `You reached Level ${levelUp.newLevel}!`,
      icon: <TrophyIconSolid className="h-8 w-8 text-purple-500" />,
      color: 'from-purple-400 to-pink-500'
    }] : []),
    ...achievements.map(achievement => ({
      type: 'achievement',
      title: 'Achievement Unlocked!',
      subtitle: achievement.name,
      icon: <span className="text-2xl">{achievement.icon}</span>,
      color: 'from-green-400 to-blue-500'
    }))
  ];

  useEffect(() => {
    if (show && notifications.length > 0) {
      const timer = setTimeout(() => {
        if (currentNotification < notifications.length - 1) {
          setCurrentNotification(prev => prev + 1);
        } else if (autoClose) {
          onClose();
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [show, currentNotification, notifications.length, autoClose, onClose]);

  useEffect(() => {
    if (show) {
      setCurrentNotification(0);
    }
  }, [show]);

  const handleClose = () => {
    setAutoClose(false);
    onClose();
  };

  const handleNext = () => {
    if (currentNotification < notifications.length - 1) {
      setCurrentNotification(prev => prev + 1);
    } else {
      onClose();
    }
  };

  if (!show || notifications.length === 0) return null;

  const notification = notifications[currentNotification];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentNotification}
          initial={{ scale: 0, opacity: 0, rotateY: -180 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          exit={{ scale: 0, opacity: 0, rotateY: 180 }}
          transition={{ 
            type: "spring", 
            duration: 0.6,
            bounce: 0.4
          }}
          className={`relative max-w-md w-full bg-gradient-to-br ${notification.color} rounded-2xl shadow-2xl overflow-hidden`}
          onClick={handleNext}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent"></div>
            <div className="absolute top-0 left-0 w-full h-full">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            className="absolute top-4 right-4 w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white hover:bg-opacity-30 transition-colors"
          >
            ×
          </button>

          {/* Content */}
          <div className="relative p-8 text-center text-white">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", bounce: 0.6 }}
              className="w-20 h-20 mx-auto mb-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center"
            >
              {notification.icon}
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold mb-2"
            >
              {notification.title}
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg opacity-90 mb-6"
            >
              {notification.subtitle}
            </motion.p>

            {/* Progress Indicator */}
            {notifications.length > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex justify-center space-x-2 mb-4"
              >
                {notifications.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentNotification ? 'bg-white' : 'bg-white bg-opacity-40'
                    }`}
                  />
                ))}
              </motion.div>
            )}

            {/* Action Text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-sm opacity-75"
            >
              {currentNotification < notifications.length - 1 
                ? 'Click to continue' 
                : 'Click to close'
              }
            </motion.p>
          </div>

          {/* Animated Border */}
          <motion.div
            className="absolute inset-0 border-4 border-white border-opacity-30 rounded-2xl"
            animate={{
              borderColor: ['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.6)', 'rgba(255,255,255,0.3)'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// Hook for managing XP notifications
export function useXPNotification() {
  const [notification, setNotification] = useState<{
    show: boolean;
    amount: number;
    source: string;
    description: string;
    levelUp?: { newLevel: number; oldLevel: number };
    achievements?: Array<{ name: string; icon: string; description: string }>;
  }>({
    show: false,
    amount: 0,
    source: '',
    description: '',
  });

  const showNotification = (data: Omit<typeof notification, 'show'>) => {
    setNotification({ ...data, show: true });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, show: false }));
  };

  const awardXP = async (amount: number, source: string, description: string, sourceId?: string) => {
    try {
      const response = await fetch('/api/gamification/award-xp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: 'current-user', // This would be the actual user ID
          amount,
          source,
          sourceId,
          description,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        showNotification({
          amount,
          source,
          description,
          levelUp: data.data.leveledUp ? {
            newLevel: data.data.newLevel,
            oldLevel: data.data.newLevel - 1
          } : undefined,
          achievements: data.data.newAchievements || []
        });
      }
    } catch (error) {
      console.error('Error awarding XP:', error);
    }
  };

  return {
    notification,
    showNotification,
    hideNotification,
    awardXP
  };
}

'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PaperAirplaneIcon,
  SparklesIcon,
  LightBulbIcon,
  BookOpenIcon,
  AcademicCapIcon,
  ChatBubbleLeftRightIcon,
  MicrophoneIcon,
  StopIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'hint' | 'explanation' | 'question';
}

interface Subject {
  id: string;
  name: string;
  icon: any;
  color: string;
  bgColor: string;
}

const subjects: Subject[] = [
  {
    id: 'math',
    name: 'Mathematics',
    icon: AcademicCapIcon,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    id: 'science',
    name: 'Science',
    icon: SparklesIcon,
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  {
    id: 'english',
    name: 'English',
    icon: BookOpenIcon,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  },
  {
    id: 'history',
    name: 'History',
    icon: ChatBubbleLeftRightIcon,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100'
  }
];

const quickPrompts = [
  "Help me understand fractions",
  "Explain photosynthesis",
  "What is the water cycle?",
  "How do I solve quadratic equations?",
  "Explain the American Revolution",
  "What are the parts of speech?"
];

export default function TutorPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Hello ${user?.firstName || 'there'}! 👋 I'm your AI tutor. I'm here to help you learn and understand any topic you're curious about. What would you like to explore today?`,
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Call the backend AI endpoint
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content.trim(),
          subject: selectedSubject,
          userId: user?.id
        }),
      });

      const data = await response.json();

      if (data.success) {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: data.data.response,
          sender: 'ai',
          timestamp: new Date(),
          type: 'text'
        };
        setMessages(prev => [...prev, aiResponse]);
      } else {
        throw new Error(data.error?.message || 'Failed to get AI response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };



  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputMessage);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    sendMessage(prompt);
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    // Voice input implementation would go here
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
              <SparklesIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Tutor</h1>
              <p className="text-gray-600">Your personal learning assistant</p>
            </div>
          </div>

          {/* Subject Selection */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={() => setSelectedSubject(null)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedSubject === null
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Subjects
            </button>
            {subjects.map((subject) => (
              <button
                key={subject.id}
                onClick={() => setSelectedSubject(subject.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedSubject === subject.id
                    ? `${subject.bgColor} ${subject.color}`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <subject.icon className="h-4 w-4" />
                <span>{subject.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-4 rounded-2xl ${
                          message.sender === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-2 ${
                          message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-gray-100 p-4 rounded-2xl">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t p-4">
                <div className="flex space-x-3">
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything..."
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isLoading}
                    />
                    <button
                      onClick={toggleVoiceInput}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg transition-colors ${
                        isListening ? 'text-red-600 bg-red-100' : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      {isListening ? (
                        <StopIcon className="h-5 w-5" />
                      ) : (
                        <MicrophoneIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <Button
                    onClick={() => sendMessage(inputMessage)}
                    disabled={!inputMessage.trim() || isLoading}
                    className="px-6"
                  >
                    <PaperAirplaneIcon className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button
                  fullWidth
                  variant="outline"
                  onClick={() => sendMessage("Can you give me a hint about this problem?")}
                  className="justify-start"
                >
                  <LightBulbIcon className="mr-2 h-4 w-4" />
                  Get a Hint
                </Button>
                <Button
                  fullWidth
                  variant="outline"
                  onClick={() => sendMessage("Can you explain this step by step?")}
                  className="justify-start"
                >
                  <BookOpenIcon className="mr-2 h-4 w-4" />
                  Step-by-Step
                </Button>
                <Button
                  fullWidth
                  variant="outline"
                  onClick={() => sendMessage("Can you give me a similar example?")}
                  className="justify-start"
                >
                  <SparklesIcon className="mr-2 h-4 w-4" />
                  Show Example
                </Button>
                <Button
                  fullWidth
                  variant="outline"
                  onClick={() => sendMessage("Can you quiz me on this topic?")}
                  className="justify-start"
                >
                  <AcademicCapIcon className="mr-2 h-4 w-4" />
                  Quiz Me
                </Button>
              </div>
            </Card>

            {/* Quick Prompts */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Start</h3>
              <div className="space-y-2">
                {quickPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickPrompt(prompt)}
                    className="w-full text-left p-3 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </Card>

            {/* Learning Tips */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <LightBulbIcon className="inline h-5 w-5 mr-2 text-yellow-500" />
                Learning Tips
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>💡 Ask specific questions for better answers</p>
                <p>🔄 Request examples to understand concepts</p>
                <p>📝 Ask me to break down complex topics</p>
                <p>🎯 Tell me your learning level for personalized help</p>
                <p>🤔 Don't hesitate to ask follow-up questions</p>
                <p>⚡ Use the quick action buttons for instant help</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  QuestionMarkCircleIcon,
  PlusIcon,
  TrashIcon,
  ArrowLeftIcon,
  SparklesIcon,
  ClockIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// interface Question {
//   id: string;
//   type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER' | 'FILL_IN_BLANK';
//   question: string;
//   options?: string[];
//   correctAnswer: string | string[];
//   explanation?: string;
//   points: number;
//   timeLimit?: number;
//   order: number;
// }

// interface QuizSettings {
//   timeLimit?: number;
//   maxAttempts: number;
//   passingScore: number;
//   showCorrectAnswers: boolean;
//   showExplanations: boolean;
//   allowReview: boolean;
//   randomizeQuestions: boolean;
// }

const subjects = [
  'MATHEMATICS',
  'SCIENCE',
  'ENGLISH',
  'HISTORY',
  'GEOGRAPHY',
  'ART'
];

const gradeLevels = [
  'GRADE_1',
  'GRADE_2',
  'GRADE_3',
  'GRADE_4',
  'GRADE_5',
  'GRADE_6'
];

const difficulties = [
  'BEGINNER',
  'INTERMEDIATE',
  'ADVANCED'
];

const questionTypes = [
  { value: 'MULTIPLE_CHOICE', label: 'Multiple Choice', icon: '🔘' },
  { value: 'TRUE_FALSE', label: 'True/False', icon: '✓✗' },
  { value: 'SHORT_ANSWER', label: 'Short Answer', icon: '📝' },
  { value: 'FILL_IN_BLANK', label: 'Fill in the Blank', icon: '___' }
];

export default function CreateQuizPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [quiz, setQuiz] = useState({
    title: '',
    description: '',
    subject: 'MATHEMATICS',
    gradeLevel: 'GRADE_4',
    difficulty: 'BEGINNER',
    tags: ''
  });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [settings, setSettings] = useState({
    maxAttempts: 3,
    passingScore: 70,
    showCorrectAnswers: true,
    showExplanations: true,
    allowReview: true,
    randomizeQuestions: false
  });

  const [isGeneratingWithAI, setIsGeneratingWithAI] = useState(false);
  const [saving, setSaving] = useState(false);

  const addQuestion = (type) => {
    const newQuestion = {
      id: Date.now().toString(),
      type: type,
      question: '',
      options: type === 'MULTIPLE_CHOICE' ? ['', '', '', ''] : undefined,
      correctAnswer: type === 'TRUE_FALSE' ? 'true' : '',
      explanation: '',
      points: 1,
      order: questions.length
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: string, field: string, value: any) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const updateQuestionOption = (questionId: string, optionIndex: number, value: string) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? {
        ...q,
        options: q.options?.map((opt, idx) => idx === optionIndex ? value : opt)
      } : q
    ));
  };

  const removeQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const generateWithAI = async () => {
    if (!quiz.title || !quiz.subject) {
      alert('Please enter a quiz title and select a subject first.');
      return;
    }

    setIsGeneratingWithAI(true);
    try {
      const response = await fetch('/api/ai/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: quiz.subject,
          gradeLevel: quiz.gradeLevel,
          difficulty: quiz.difficulty,
          questionCount: 5, // Generate 5 questions by default
          questionTypes: ['MULTIPLE_CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER'],
          topics: [quiz.title],
          lessonContent: quiz.description
        }),
      });

      const data = await response.json();

      if (data.success) {
        const aiQuestions: Question[] = data.data.questions.map((q: any, index: number) => ({
          id: `ai_${Date.now()}_${index}`,
          type: q.type,
          question: q.question,
          options: q.options || undefined,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          points: q.points || 1,
          order: questions.length + index
        }));

        setQuestions([...questions, ...aiQuestions]);

        // Update settings with AI suggestions
        if (data.data.suggestedSettings) {
          setSettings(prev => ({
            ...prev,
            ...data.data.suggestedSettings
          }));
        }

        alert(`Generated ${aiQuestions.length} questions! Review and edit.`);
      } else {
        throw new Error(data.error?.message || 'Failed to generate questions');
      }
    } catch (error) {
      console.error('Error generating AI questions:', error);
      alert('Failed to generate AI questions. Please try again.');
    } finally {
      setIsGeneratingWithAI(false);
    }
  };

  const saveQuiz = async () => {
    if (!quiz.title || !quiz.description || questions.length === 0) {
      alert('Please fill in the quiz title, description, and add at least one question.');
      return;
    }

    setSaving(true);
    try {
      // Here you would save to your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Quiz saved successfully!');
      router.push('/quizzes');
    } catch (error) {
      console.error('Error saving quiz:', error);
      alert('Failed to save quiz. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <Link href="/quizzes" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Quizzes
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Quiz</h1>
              <p className="text-gray-600">Build interactive assessments for your students</p>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={generateWithAI}
                disabled={isGeneratingWithAI}
                className="flex items-center"
              >
                <SparklesIcon className="mr-2 h-4 w-4" />
                {isGeneratingWithAI ? 'Generating...' : 'AI Assistant'}
              </Button>
              
              <Button
                onClick={saveQuiz}
                disabled={saving}
                className="flex items-center"
              >
                {saving ? 'Saving...' : 'Save Quiz'}
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Basic Information */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quiz Title *
                  </label>
                  <input
                    type="text"
                    value={quiz.title}
                    onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
                    placeholder="Enter quiz title..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={quiz.description}
                    onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
                    placeholder="Describe what this quiz covers..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <select
                    value={quiz.subject}
                    onChange={(e) => setQuiz({ ...quiz, subject: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grade Level
                  </label>
                  <select
                    value={quiz.gradeLevel}
                    onChange={(e) => setQuiz({ ...quiz, gradeLevel: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {gradeLevels.map(grade => (
                      <option key={grade} value={grade}>{grade.replace('GRADE_', 'Grade ')}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty
                  </label>
                  <select
                    value={quiz.difficulty}
                    onChange={(e) => setQuiz({ ...quiz, difficulty: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {difficulties.map(difficulty => (
                      <option key={difficulty} value={difficulty}>
                        {difficulty.charAt(0) + difficulty.slice(1).toLowerCase()}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={quiz.tags}
                    onChange={(e) => setQuiz({ ...quiz, tags: e.target.value })}
                    placeholder="fractions, math, assessment..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Quiz Settings */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quiz Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Limit (minutes)
                  </label>
                  <input
                    type="number"
                    value={settings.timeLimit || ''}
                    onChange={(e) => setSettings({ ...settings, timeLimit: e.target.value ? parseInt(e.target.value) : undefined })}
                    placeholder="No time limit"
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Attempts
                  </label>
                  <input
                    type="number"
                    value={settings.maxAttempts}
                    onChange={(e) => setSettings({ ...settings, maxAttempts: parseInt(e.target.value) || 1 })}
                    min="1"
                    max="10"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Passing Score (%)
                  </label>
                  <input
                    type="number"
                    value={settings.passingScore}
                    onChange={(e) => setSettings({ ...settings, passingScore: parseInt(e.target.value) || 70 })}
                    min="0"
                    max="100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Options
                  </label>
                  
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.showCorrectAnswers}
                        onChange={(e) => setSettings({ ...settings, showCorrectAnswers: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Show correct answers after submission</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.showExplanations}
                        onChange={(e) => setSettings({ ...settings, showExplanations: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Show explanations</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.allowReview}
                        onChange={(e) => setSettings({ ...settings, allowReview: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Allow review before submission</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.randomizeQuestions}
                        onChange={(e) => setSettings({ ...settings, randomizeQuestions: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Randomize question order</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Questions */}
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Questions ({questions.length})</h2>
                <div className="flex gap-2">
                  {questionTypes.map((type) => (
                    <Button
                      key={type.value}
                      variant="outline"
                      size="sm"
                      onClick={() => addQuestion(type.value)}
                      className="flex items-center"
                    >
                      <span className="mr-1">{type.icon}</span>
                      {type.label}
                    </Button>
                  ))}
                </div>
              </div>

              {questions.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <QuestionMarkCircleIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p>No questions added yet. Click the buttons above to add questions.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {questions.map((question, index) => (
                    <motion.div
                      key={question.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-gray-200 rounded-lg p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </span>
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            {questionTypes.find(t => t.value === question.type)?.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={question.points}
                            onChange={(e) => updateQuestion(question.id, 'points', parseInt(e.target.value) || 1)}
                            min="1"
                            className="w-16 px-2 py-1 text-sm border border-gray-300 rounded"
                            placeholder="pts"
                          />
                          <span className="text-sm text-gray-500">pts</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeQuestion(question.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Question *
                          </label>
                          <textarea
                            value={question.question}
                            onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                            placeholder="Enter your question..."
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        {question.type === 'MULTIPLE_CHOICE' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Answer Options
                            </label>
                            <div className="space-y-2">
                              {question.options?.map((option, optionIndex) => (
                                <div key={optionIndex} className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    name={`correct-${question.id}`}
                                    checked={question.correctAnswer === option}
                                    onChange={() => updateQuestion(question.id, 'correctAnswer', option)}
                                    className="text-green-600 focus:ring-green-500"
                                  />
                                  <input
                                    type="text"
                                    value={option}
                                    onChange={(e) => updateQuestionOption(question.id, optionIndex, e.target.value)}
                                    placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {question.type === 'TRUE_FALSE' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Correct Answer
                            </label>
                            <div className="flex gap-4">
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name={`tf-${question.id}`}
                                  value="true"
                                  checked={question.correctAnswer === 'true'}
                                  onChange={(e) => updateQuestion(question.id, 'correctAnswer', e.target.value)}
                                  className="text-green-600 focus:ring-green-500"
                                />
                                <span className="ml-2 text-sm">True</span>
                              </label>
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name={`tf-${question.id}`}
                                  value="false"
                                  checked={question.correctAnswer === 'false'}
                                  onChange={(e) => updateQuestion(question.id, 'correctAnswer', e.target.value)}
                                  className="text-green-600 focus:ring-green-500"
                                />
                                <span className="ml-2 text-sm">False</span>
                              </label>
                            </div>
                          </div>
                        )}

                        {(question.type === 'SHORT_ANSWER' || question.type === 'FILL_IN_BLANK') && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Correct Answer
                            </label>
                            <input
                              type="text"
                              value={question.correctAnswer}
                              onChange={(e) => updateQuestion(question.id, 'correctAnswer', e.target.value)}
                              placeholder="Enter the correct answer..."
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        )}

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Explanation (optional)
                          </label>
                          <textarea
                            value={question.explanation || ''}
                            onChange={(e) => updateQuestion(question.id, 'explanation', e.target.value)}
                            placeholder="Explain why this is the correct answer..."
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

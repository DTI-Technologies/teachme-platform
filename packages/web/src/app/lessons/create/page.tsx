'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpenIcon,
  PlusIcon,
  TrashIcon,
  ArrowLeftIcon,
  SparklesIcon,
  DocumentTextIcon,
  PlayIcon,
  PhotoIcon,
  VideoCameraIcon,
  QuestionMarkCircleIcon,
  ClockIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface LessonContent {
  id: string;
  type: 'text' | 'video' | 'image' | 'interactive' | 'quiz';
  title: string;
  content: string;
  order: number;
}

interface LessonObjective {
  id: string;
  text: string;
}

const subjects = [
  'Mathematics',
  'Science',
  'English',
  'History',
  'Geography',
  'Art'
];

const gradeLevels = [
  'KINDERGARTEN',
  'GRADE_1',
  'GRADE_2',
  'GRADE_3',
  'GRADE_4',
  'GRADE_5',
  'GRADE_6',
  'GRADE_7',
  'GRADE_8',
  'GRADE_9',
  'GRADE_10',
  'GRADE_11',
  'GRADE_12'
];

const difficulties = [
  'beginner',
  'intermediate',
  'advanced'
];

// Helper function to format grade levels for display
const formatGradeLevel = (gradeLevel: string) => {
  if (gradeLevel === 'KINDERGARTEN') return 'Kindergarten';
  if (gradeLevel.startsWith('GRADE_')) {
    return `Grade ${gradeLevel.replace('GRADE_', '')}`;
  }
  return gradeLevel;
};

const contentTypes = [
  { type: 'text', label: 'Text Content', icon: DocumentTextIcon },
  { type: 'video', label: 'Video', icon: VideoCameraIcon },
  { type: 'image', label: 'Image', icon: PhotoIcon },
  { type: 'interactive', label: 'Interactive', icon: PlayIcon },
  { type: 'quiz', label: 'Quiz', icon: QuestionMarkCircleIcon }
];

export default function CreateLessonPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [lesson, setLesson] = useState({
    title: '',
    description: '',
    subject: 'Mathematics',
    gradeLevel: 'GRADE_4',
    duration: 30,
    difficulty: 'beginner',
    tags: ''
  });

  const [objectives, setObjectives] = useState<LessonObjective[]>([
    { id: '1', text: '' }
  ]);

  const [content, setContent] = useState<LessonContent[]>([]);
  const [isGeneratingWithAI, setIsGeneratingWithAI] = useState(false);
  const [saving, setSaving] = useState(false);

  const addObjective = () => {
    const newObjective: LessonObjective = {
      id: Date.now().toString(),
      text: ''
    };
    setObjectives([...objectives, newObjective]);
  };

  const updateObjective = (id: string, text: string) => {
    setObjectives(objectives.map(obj => 
      obj.id === id ? { ...obj, text } : obj
    ));
  };

  const removeObjective = (id: string) => {
    if (objectives.length > 1) {
      setObjectives(objectives.filter(obj => obj.id !== id));
    }
  };

  const addContent = (type: string) => {
    const newContent: LessonContent = {
      id: Date.now().toString(),
      type: type as any,
      title: '',
      content: '',
      order: content.length
    };
    setContent([...content, newContent]);
  };

  const updateContent = (id: string, field: string, value: string) => {
    setContent(content.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const removeContent = (id: string) => {
    setContent(content.filter(item => item.id !== id));
  };

  const generateWithAI = async () => {
    if (!lesson.title || !lesson.subject) {
      alert('Please enter a lesson title and select a subject first.');
      return;
    }

    setIsGeneratingWithAI(true);
    try {
      const response = await fetch('/api/ai/generate-lesson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: lesson.title,
          subject: lesson.subject,
          gradeLevel: lesson.gradeLevel,
          duration: lesson.duration,
          objectives: objectives.filter(obj => obj.text.trim()).map(obj => obj.text)
        }),
      });

      const data = await response.json();
      if (data.success) {
        const structuredLesson = data.data.structuredLesson;

        // Update lesson description if not already set
        if (!lesson.description && structuredLesson.introduction) {
          setLesson(prev => ({
            ...prev,
            description: structuredLesson.introduction
          }));
        }

        // Add structured content blocks
        const newContent: LessonContent[] = [];

        // Add introduction
        if (structuredLesson.introduction) {
          newContent.push({
            id: `intro_${Date.now()}`,
            type: 'text',
            title: 'Introduction',
            content: structuredLesson.introduction,
            order: newContent.length
          });
        }

        // Add main content sections
        structuredLesson.content.forEach((contentItem, index) => {
          newContent.push({
            id: `content_${Date.now()}_${index}`,
            type: 'text',
            title: contentItem.title || `Content Section ${index + 1}`,
            content: contentItem.content,
            order: newContent.length
          });
        });

        // Add activities as interactive content
        structuredLesson.activities.forEach((activity, index) => {
          newContent.push({
            id: `activity_${Date.now()}_${index}`,
            type: 'interactive',
            title: activity.name || `Activity ${index + 1}`,
            content: `${activity.description}\n\nInstructions: ${activity.instructions}\n\nMaterials: ${activity.materials.join(', ')}`,
            order: newContent.length
          });
        });

        // Add conclusion
        if (structuredLesson.conclusion) {
          newContent.push({
            id: `conclusion_${Date.now()}`,
            type: 'text',
            title: 'Conclusion',
            content: structuredLesson.conclusion,
            order: newContent.length
          });
        }

        // Update content state
        setContent([...content, ...newContent]);

        // Show success message
        alert(`Generated ${newContent.length} content sections! Review and edit as needed.`);
      }
    } catch (error) {
      console.error('Error generating AI content:', error);
      alert('Failed to generate AI content. Please try again.');
    } finally {
      setIsGeneratingWithAI(false);
    }
  };

  const saveLesson = async () => {
    if (!lesson.title || !lesson.description) {
      alert('Please fill in the lesson title and description.');
      return;
    }

    setSaving(true);
    try {
      const lessonData = {
        title: lesson.title,
        description: lesson.description,
        subject: lesson.subject,
        gradeLevel: lesson.gradeLevel,
        duration: lesson.duration,
        difficulty: lesson.difficulty,
        objectives: objectives.filter(obj => obj.text.trim()).map(obj => obj.text),
        content: content.map(item => ({
          id: item.id,
          type: item.type,
          title: item.title,
          content: item.content,
          order: item.order
        })),
        tags: lesson.tags,
        createdBy: user?.id
      };

      const response = await fetch('/api/lessons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lessonData),
      });

      const data = await response.json();

      if (data.success) {
        alert('Lesson created successfully!');
        router.push('/lessons');
      } else {
        throw new Error(data.error?.message || 'Failed to create lesson');
      }
    } catch (error) {
      console.error('Error saving lesson:', error);
      alert('Failed to save lesson. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <Link href="/lessons" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Lessons
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Lesson</h1>
              <p className="text-gray-600">Build engaging educational content for your students</p>
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
                onClick={saveLesson}
                disabled={saving}
                className="flex items-center"
              >
                {saving ? 'Saving...' : 'Save Lesson'}
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
                    Lesson Title *
                  </label>
                  <input
                    type="text"
                    value={lesson.title}
                    onChange={(e) => setLesson({ ...lesson, title: e.target.value })}
                    placeholder="Enter lesson title..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={lesson.description}
                    onChange={(e) => setLesson({ ...lesson, description: e.target.value })}
                    placeholder="Describe what students will learn..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <select
                    value={lesson.subject}
                    onChange={(e) => setLesson({ ...lesson, subject: e.target.value })}
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
                    value={lesson.gradeLevel}
                    onChange={(e) => setLesson({ ...lesson, gradeLevel: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {gradeLevels.map(grade => (
                      <option key={grade} value={grade}>{formatGradeLevel(grade)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={lesson.duration}
                    onChange={(e) => setLesson({ ...lesson, duration: parseInt(e.target.value) || 0 })}
                    min="5"
                    max="180"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty
                  </label>
                  <select
                    value={lesson.difficulty}
                    onChange={(e) => setLesson({ ...lesson, difficulty: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {difficulties.map(difficulty => (
                      <option key={difficulty} value={difficulty}>
                        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={lesson.tags}
                    onChange={(e) => setLesson({ ...lesson, tags: e.target.value })}
                    placeholder="fractions, math, elementary..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Learning Objectives */}
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Learning Objectives</h2>
                <Button variant="outline" onClick={addObjective} size="sm">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Add Objective
                </Button>
              </div>

              <div className="space-y-4">
                {objectives.map((objective, index) => (
                  <div key={objective.id} className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <input
                      type="text"
                      value={objective.text}
                      onChange={(e) => updateObjective(objective.id, e.target.value)}
                      placeholder="Students will be able to..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {objectives.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeObjective(objective.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Lesson Content */}
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Lesson Content</h2>
                <div className="flex gap-2">
                  {contentTypes.map((type) => (
                    <Button
                      key={type.type}
                      variant="outline"
                      size="sm"
                      onClick={() => addContent(type.type)}
                      className="flex items-center"
                    >
                      <type.icon className="mr-1 h-4 w-4" />
                      {type.label}
                    </Button>
                  ))}
                </div>
              </div>

              {content.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p>No content added yet. Click the buttons above to add content blocks.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {content.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full capitalize">
                            {item.type}
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeContent(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-4">
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => updateContent(item.id, 'title', e.target.value)}
                          placeholder="Content title..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <textarea
                          value={item.content}
                          onChange={(e) => updateContent(item.id, 'content', e.target.value)}
                          placeholder={`Enter ${item.type} content...`}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
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

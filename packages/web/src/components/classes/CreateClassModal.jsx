'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  AcademicCapIcon,
  UserGroupIcon,
  BookOpenIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface CreateClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (classData: ClassFormData) => void;
}

interface ClassFormData {
  name: string;
  description: string;
  subject: string;
  gradeLevel: string;
  schedule: {
    days: string[];
    startTime: string;
    endTime: string;
  };
  maxStudents: number;
  isPublic: boolean;
}

const subjects = [
  { value: 'MATHEMATICS', label: 'Mathematics', icon: '🧮' },
  { value: 'SCIENCE', label: 'Science', icon: '🔬' },
  { value: 'ENGLISH', label: 'English', icon: '📚' },
  { value: 'HISTORY', label: 'History', icon: '🏛️' },
  { value: 'GEOGRAPHY', label: 'Geography', icon: '🌍' },
  { value: 'ART', label: 'Art', icon: '🎨' },
  { value: 'MUSIC', label: 'Music', icon: '🎵' },
  { value: 'PHYSICAL_EDUCATION', label: 'Physical Education', icon: '⚽' },
  { value: 'COMPUTER_SCIENCE', label: 'Computer Science', icon: '💻' },
];

const gradeLevels = [
  { value: 'KINDERGARTEN', label: 'Kindergarten' },
  { value: 'GRADE_1', label: 'Grade 1' },
  { value: 'GRADE_2', label: 'Grade 2' },
  { value: 'GRADE_3', label: 'Grade 3' },
  { value: 'GRADE_4', label: 'Grade 4' },
  { value: 'GRADE_5', label: 'Grade 5' },
  { value: 'GRADE_6', label: 'Grade 6' },
  { value: 'GRADE_7', label: 'Grade 7' },
  { value: 'GRADE_8', label: 'Grade 8' },
  { value: 'GRADE_9', label: 'Grade 9' },
  { value: 'GRADE_10', label: 'Grade 10' },
  { value: 'GRADE_11', label: 'Grade 11' },
  { value: 'GRADE_12', label: 'Grade 12' },
];

const weekDays = [
  { value: 'monday', label: 'Mon' },
  { value: 'tuesday', label: 'Tue' },
  { value: 'wednesday', label: 'Wed' },
  { value: 'thursday', label: 'Thu' },
  { value: 'friday', label: 'Fri' },
];

export default function CreateClassModal({ isOpen, onClose, onSubmit }: CreateClassModalProps) {
  const [formData, setFormData] = useState<ClassFormData>({
    name: '',
    description: '',
    subject: '',
    gradeLevel: '',
    schedule: {
      days: [],
      startTime: '',
      endTime: '',
    },
    maxStudents: 30,
    isPublic: false,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleScheduleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [field]: value
      }
    }));
  };

  const toggleDay = (day: string) => {
    const currentDays = formData.schedule.days;
    const newDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day];
    
    handleScheduleChange('days', newDays);
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Class name is required';
      if (!formData.subject) newErrors.subject = 'Subject is required';
      if (!formData.gradeLevel) newErrors.gradeLevel = 'Grade level is required';
    }

    if (step === 2) {
      if (!formData.description.trim()) newErrors.description = 'Description is required';
      if (formData.maxStudents < 1) newErrors.maxStudents = 'Must have at least 1 student';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      onSubmit(formData);
      onClose();
      // Reset form
      setFormData({
        name: '',
        description: '',
        subject: '',
        gradeLevel: '',
        schedule: { days: [], startTime: '', endTime: '' },
        maxStudents: 30,
        isPublic: false,
      });
      setCurrentStep(1);
      setErrors({});
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Create New Class</h3>
              <p className="text-gray-600">Step {currentStep} of 3</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <XMarkIcon className="h-6 w-6 text-gray-400" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step}
                  </div>
                  {step < 3 && (
                    <div className={`w-16 h-1 mx-2 ${
                      step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>Basic Info</span>
              <span>Details</span>
              <span>Schedule</span>
            </div>
          </div>

          {/* Step Content */}
          <div className="space-y-6">
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Class Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Advanced Mathematics"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {subjects.map((subject) => (
                      <button
                        key={subject.value}
                        type="button"
                        onClick={() => handleInputChange('subject', subject.value)}
                        className={`p-3 border rounded-lg text-center transition-colors ${
                          formData.subject === subject.value
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="text-2xl mb-1">{subject.icon}</div>
                        <div className="text-xs font-medium">{subject.label}</div>
                      </button>
                    ))}
                  </div>
                  {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grade Level *
                  </label>
                  <select
                    value={formData.gradeLevel}
                    onChange={(e) => handleInputChange('gradeLevel', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.gradeLevel ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select grade level</option>
                    {gradeLevels.map((grade) => (
                      <option key={grade.value} value={grade.value}>
                        {grade.label}
                      </option>
                    ))}
                  </select>
                  {errors.gradeLevel && <p className="mt-1 text-sm text-red-600">{errors.gradeLevel}</p>}
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.description ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Describe what students will learn in this class..."
                  />
                  {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Students
                  </label>
                  <input
                    type="number"
                    value={formData.maxStudents}
                    onChange={(e) => handleInputChange('maxStudents', parseInt(e.target.value))}
                    min="1"
                    max="100"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.maxStudents ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.maxStudents && <p className="mt-1 text-sm text-red-600">{errors.maxStudents}</p>}
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isPublic}
                      onChange={(e) => handleInputChange('isPublic', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Make this class publicly visible</span>
                  </label>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Class Days
                  </label>
                  <div className="flex space-x-2">
                    {weekDays.map((day) => (
                      <button
                        key={day.value}
                        type="button"
                        onClick={() => toggleDay(day.value)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          formData.schedule.days.includes(day.value)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={formData.schedule.startTime}
                      onChange={(e) => handleScheduleChange('startTime', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={formData.schedule.endTime}
                      onChange={(e) => handleScheduleChange('endTime', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <Card className="p-4 bg-blue-50 border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">Class Summary</h4>
                  <div className="space-y-1 text-sm text-blue-800">
                    <p><strong>Name:</strong> {formData.name}</p>
                    <p><strong>Subject:</strong> {subjects.find(s => s.value === formData.subject)?.label}</p>
                    <p><strong>Grade:</strong> {gradeLevels.find(g => g.value === formData.gradeLevel)?.label}</p>
                    <p><strong>Max Students:</strong> {formData.maxStudents}</p>
                    {formData.schedule.days.length > 0 && (
                      <p><strong>Schedule:</strong> {formData.schedule.days.join(', ')} 
                        {formData.schedule.startTime && formData.schedule.endTime && 
                          ` (${formData.schedule.startTime} - ${formData.schedule.endTime})`
                        }
                      </p>
                    )}
                  </div>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-between mt-8">
            <div>
              {currentStep > 1 && (
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
              )}
            </div>
            <div className="space-x-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              {currentStep < 3 ? (
                <Button onClick={handleNext}>
                  Next
                </Button>
              ) : (
                <Button onClick={handleSubmit}>
                  Create Class
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

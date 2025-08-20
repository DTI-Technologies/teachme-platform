'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  XMarkIcon,
  UserPlusIcon,
  UsersIcon,
  DocumentArrowUpIcon,
  MagnifyingGlassIcon,
  CheckIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface StudentEnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  classId: string;
  className: string;
  onEnrollmentComplete: () => void;
}

interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isEnrolled: boolean;
}

export default function StudentEnrollmentModal({
  isOpen,
  onClose,
  classId,
  className,
  onEnrollmentComplete
}: StudentEnrollmentModalProps) {
  const [enrollmentMethod, setEnrollmentMethod] = useState<'search' | 'invite' | 'bulk'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [inviteEmails, setInviteEmails] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock student data
  const [availableStudents] = useState<Student[]>([
    {
      id: '1',
      name: 'Emma Wilson',
      email: 'emma@student.com',
      avatar: '👩‍🎓',
      isEnrolled: false
    },
    {
      id: '2',
      name: 'James Brown',
      email: 'james@student.com',
      avatar: '👨‍🎓',
      isEnrolled: false
    },
    {
      id: '3',
      name: 'Sophia Davis',
      email: 'sophia@student.com',
      avatar: '👩‍💻',
      isEnrolled: true
    },
    {
      id: '4',
      name: 'Michael Johnson',
      email: 'michael@student.com',
      avatar: '👨‍💼',
      isEnrolled: false
    },
    {
      id: '5',
      name: 'Isabella Garcia',
      email: 'isabella@student.com',
      avatar: '👩‍🔬',
      isEnrolled: false
    }
  ]);

  const filteredStudents = availableStudents.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleEnrollSelected = async () => {
    if (selectedStudents.length === 0) {
      alert('Please select at least one student to enroll.');
      return;
    }

    setLoading(true);
    try {
      // Enroll each selected student
      for (const studentId of selectedStudents) {
        const response = await fetch(`/api/classes/${classId}/enroll`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ studentId }),
        });

        if (!response.ok) {
          const data = await response.json();
          console.error('Failed to enroll student:', data.error);
        }
      }

      alert(`Successfully enrolled ${selectedStudents.length} student(s)!`);
      onEnrollmentComplete();
      onClose();
      setSelectedStudents([]);
    } catch (error) {
      console.error('Error enrolling students:', error);
      alert('Failed to enroll students. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendInvites = async () => {
    if (!inviteEmails.trim()) {
      alert('Please enter at least one email address.');
      return;
    }

    setLoading(true);
    try {
      const emails = inviteEmails.split('\n').map(email => email.trim()).filter(email => email);
      
      // TODO: Implement invite API
      console.log('Sending invites to:', emails);
      
      // Mock success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert(`Invitations sent to ${emails.length} email address(es)!`);
      onClose();
      setInviteEmails('');
    } catch (error) {
      console.error('Error sending invites:', error);
      alert('Failed to send invites. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      // TODO: Implement CSV parsing and bulk enrollment
      console.log('Processing file:', file.name);
      
      // Mock processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Bulk enrollment completed successfully!');
      onEnrollmentComplete();
      onClose();
    } catch (error) {
      console.error('Error processing bulk upload:', error);
      alert('Failed to process bulk upload. Please try again.');
    } finally {
      setLoading(false);
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
          className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Add Students</h3>
              <p className="text-gray-600">Enroll students in {className}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <XMarkIcon className="h-6 w-6 text-gray-400" />
            </button>
          </div>

          {/* Method Selection */}
          <div className="mb-6">
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setEnrollmentMethod('search')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  enrollmentMethod === 'search'
                    ? 'bg-white text-gray-900 shadow'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <MagnifyingGlassIcon className="inline h-4 w-4 mr-2" />
                Search Students
              </button>
              <button
                onClick={() => setEnrollmentMethod('invite')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  enrollmentMethod === 'invite'
                    ? 'bg-white text-gray-900 shadow'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <UserPlusIcon className="inline h-4 w-4 mr-2" />
                Send Invites
              </button>
              <button
                onClick={() => setEnrollmentMethod('bulk')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  enrollmentMethod === 'bulk'
                    ? 'bg-white text-gray-900 shadow'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <DocumentArrowUpIcon className="inline h-4 w-4 mr-2" />
                Bulk Upload
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {enrollmentMethod === 'search' && (
              <div>
                {/* Search Bar */}
                <div className="mb-4">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search students by name or email..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Selected Count */}
                {selectedStudents.length > 0 && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      {selectedStudents.length} student(s) selected for enrollment
                    </p>
                  </div>
                )}

                {/* Student List */}
                <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
                  {filteredStudents.map((student) => (
                    <div
                      key={student.id}
                      className={`flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0 ${
                        student.isEnrolled ? 'bg-gray-50 opacity-60' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{student.avatar}</div>
                        <div>
                          <div className="font-medium text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-500">{student.email}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {student.isEnrolled ? (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                            <CheckIcon className="h-3 w-3 mr-1" />
                            Enrolled
                          </span>
                        ) : (
                          <button
                            onClick={() => toggleStudentSelection(student.id)}
                            className={`p-2 rounded-lg border transition-colors ${
                              selectedStudents.includes(student.id)
                                ? 'border-blue-500 bg-blue-50 text-blue-600'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            {selectedStudents.includes(student.id) ? (
                              <CheckIcon className="h-4 w-4" />
                            ) : (
                              <PlusIcon className="h-4 w-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {filteredStudents.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                      No students found matching your search.
                    </div>
                  )}
                </div>
              </div>
            )}

            {enrollmentMethod === 'invite' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Addresses
                </label>
                <textarea
                  value={inviteEmails}
                  onChange={(e) => setInviteEmails(e.target.value)}
                  rows={8}
                  placeholder="Enter email addresses, one per line:&#10;student1@example.com&#10;student2@example.com&#10;student3@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Students will receive an invitation email to join the class.
                </p>
              </div>
            )}

            {enrollmentMethod === 'bulk' && (
              <div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Upload CSV File</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Upload a CSV file with student information (name, email, grade)
                  </p>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleBulkUpload}
                    className="hidden"
                    id="csv-upload"
                  />
                  <label htmlFor="csv-upload">
                    <Button as="span" variant="outline">
                      Choose File
                    </Button>
                  </label>
                </div>
                
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h5 className="font-medium text-blue-900 mb-2">CSV Format Requirements:</h5>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• First row should contain headers: name, email, grade</li>
                    <li>• Each subsequent row should contain student data</li>
                    <li>• Email addresses must be valid and unique</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            
            <div className="space-x-3">
              {enrollmentMethod === 'search' && (
                <Button 
                  onClick={handleEnrollSelected}
                  disabled={selectedStudents.length === 0 || loading}
                >
                  {loading ? 'Enrolling...' : `Enroll ${selectedStudents.length} Student(s)`}
                </Button>
              )}
              
              {enrollmentMethod === 'invite' && (
                <Button 
                  onClick={handleSendInvites}
                  disabled={!inviteEmails.trim() || loading}
                >
                  {loading ? 'Sending...' : 'Send Invitations'}
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

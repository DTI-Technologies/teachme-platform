import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { createUser, findUserByEmail, verifyPassword, awardXP, checkAndAwardAchievements, updateStreak, getLeaderboard, prisma } from './lib/database';

// Load environment variables from root .env file
dotenv.config({ path: '../../.env' });

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware
app.use(cors());
app.use(express.json());

// Database connection check
prisma.$connect().then(() => {
  console.log('✅ Database connected successfully');
}).catch((error) => {
  console.error('❌ Database connection failed:', error);
});

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: { message: 'Email and password are required' }
      });
    }

    // Find user
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid credentials' }
      });
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid credentials' }
      });
    }

    // Update daily login streak for students
    if (user.role === 'STUDENT') {
      await updateStreak(user.id, 'DAILY_LOGIN');
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Login failed' }
    });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    // Validate input
    if (!email || !password || !name || !role) {
      return res.status(400).json({
        success: false,
        error: { message: 'All fields are required' }
      });
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: { message: 'User already exists' }
      });
    }

    // Create user
    const user = await createUser({ email, password, name, role });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to create user' }
    });
  }
});

// AI Tutor endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, subject, userId } = req.body;

    // Create educational system prompt based on subject
    const getSystemPrompt = (subject) => {
      const basePrompt = `You are an expert AI tutor designed to help students learn effectively. You should:
- Provide clear, educational explanations appropriate for the student's level
- Break down complex concepts into understandable steps
- Use examples and analogies to illustrate points
- Encourage critical thinking with follow-up questions
- Be patient, supportive, and encouraging
- Adapt your language to be age-appropriate and engaging`;

      const subjectPrompts = {
        math: `${basePrompt}
- Focus on mathematical concepts, problem-solving strategies, and step-by-step solutions
- Use visual descriptions when helpful (graphs, diagrams, etc.)
- Encourage practice and pattern recognition`,
        science: `${basePrompt}
- Explain scientific concepts with real-world applications
- Use the scientific method approach when appropriate
- Connect concepts to everyday experiences`,
        english: `${basePrompt}
- Help with grammar, vocabulary, reading comprehension, and writing
- Provide examples from literature and everyday communication
- Focus on clear expression and communication skills`,
        history: `${basePrompt}
- Connect historical events to their causes and effects
- Help students understand the relevance of history to today
- Encourage critical analysis of historical sources and perspectives`
      };

      return subjectPrompts[subject] || basePrompt;
    };

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: getSystemPrompt(subject)
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response. Please try again.";

    res.json({
      success: true,
      data: {
        response: aiResponse,
        timestamp: new Date().toISOString(),
        subject: subject || 'general',
        model: 'gpt-4'
      }
    });
  } catch (error) {
    console.error('AI Chat error:', error);

    // Provide helpful error messages
    let errorMessage = 'Failed to process AI request';
    if (error.code === 'insufficient_quota') {
      errorMessage = 'OpenAI API quota exceeded. Please check your billing.';
    } else if (error.code === 'invalid_api_key') {
      errorMessage = 'Invalid OpenAI API key. Please check configuration.';
    } else if (error.code === 'rate_limit_exceeded') {
      errorMessage = 'Too many requests. Please wait a moment and try again.';
    }

    res.status(500).json({
      success: false,
      error: { message: errorMessage }
    });
  }
});

// Lesson Management endpoints
app.get('/api/lessons', async (req, res) => {
  try {
    const { subject, gradeLevel, search, createdBy } = req.query;

    // Mock lesson data
    const mockLessons = [
      {
        id: '1',
        title: 'Introduction to Fractions',
        description: 'Learn the basics of fractions with interactive examples and practice problems.',
        subject: 'Mathematics',
        gradeLevel: 'GRADE_4',
        duration: 45,
        difficulty: 'beginner',
        objectives: [
          'Understand what fractions represent',
          'Identify numerator and denominator',
          'Compare simple fractions'
        ],
        tags: ['fractions', 'math', 'elementary'],
        createdBy: '1',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-20'),
        isPublic: true,
        thumbnailUrl: '/images/fractions-lesson.jpg'
      },
      {
        id: '2',
        title: 'The Water Cycle',
        description: 'Explore how water moves through the environment in this interactive science lesson.',
        subject: 'Science',
        gradeLevel: 'GRADE_3',
        duration: 30,
        difficulty: 'beginner',
        objectives: [
          'Identify the stages of the water cycle',
          'Understand evaporation and condensation',
          'Explain precipitation'
        ],
        tags: ['water cycle', 'science', 'environment'],
        createdBy: '1',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-15'),
        isPublic: true,
        thumbnailUrl: '/images/water-cycle-lesson.jpg'
      },
      {
        id: '3',
        title: 'Creative Writing: Story Beginnings',
        description: 'Learn how to write engaging story openings that capture readers\' attention.',
        subject: 'English',
        gradeLevel: 'GRADE_5',
        duration: 60,
        difficulty: 'intermediate',
        objectives: [
          'Understand different types of story openings',
          'Practice writing compelling first sentences',
          'Develop character introductions'
        ],
        tags: ['creative writing', 'english', 'storytelling'],
        createdBy: '1',
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-12'),
        isPublic: true,
        thumbnailUrl: '/images/creative-writing-lesson.jpg'
      },
      {
        id: '4',
        title: 'Multiplication Tables',
        description: 'Master multiplication tables from 1 to 12 with fun games and exercises.',
        subject: 'Mathematics',
        gradeLevel: 'GRADE_3',
        duration: 40,
        difficulty: 'beginner',
        objectives: [
          'Memorize multiplication tables 1-12',
          'Understand multiplication patterns',
          'Apply multiplication in word problems'
        ],
        tags: ['multiplication', 'math', 'tables'],
        createdBy: '1',
        createdAt: new Date('2024-01-08'),
        updatedAt: new Date('2024-01-18'),
        isPublic: true,
        thumbnailUrl: '/images/multiplication-lesson.jpg'
      },
      {
        id: '5',
        title: 'Solar System Exploration',
        description: 'Journey through our solar system and learn about planets, moons, and space.',
        subject: 'Science',
        gradeLevel: 'GRADE_4',
        duration: 50,
        difficulty: 'intermediate',
        objectives: [
          'Identify all planets in our solar system',
          'Compare planet sizes and characteristics',
          'Understand orbital patterns'
        ],
        tags: ['solar system', 'planets', 'space', 'astronomy'],
        createdBy: '1',
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-22'),
        isPublic: true,
        thumbnailUrl: '/images/solar-system-lesson.jpg'
      },
      {
        id: '6',
        title: 'Reading Comprehension Strategies',
        description: 'Develop strong reading skills with proven comprehension techniques.',
        subject: 'English',
        gradeLevel: 'GRADE_3',
        duration: 35,
        difficulty: 'beginner',
        objectives: [
          'Use context clues to understand new words',
          'Identify main ideas and supporting details',
          'Make predictions while reading'
        ],
        tags: ['reading', 'comprehension', 'strategies'],
        createdBy: '1',
        createdAt: new Date('2024-01-06'),
        updatedAt: new Date('2024-01-16'),
        isPublic: true,
        thumbnailUrl: '/images/reading-lesson.jpg'
      },
      {
        id: '7',
        title: 'Ancient Egypt Civilization',
        description: 'Discover the fascinating world of ancient Egypt, pyramids, and pharaohs.',
        subject: 'History',
        gradeLevel: 'GRADE_5',
        duration: 55,
        difficulty: 'intermediate',
        objectives: [
          'Learn about Egyptian pharaohs and dynasties',
          'Understand pyramid construction',
          'Explore daily life in ancient Egypt'
        ],
        tags: ['ancient egypt', 'history', 'civilization', 'pyramids'],
        createdBy: '1',
        createdAt: new Date('2024-01-09'),
        updatedAt: new Date('2024-01-19'),
        isPublic: true,
        thumbnailUrl: '/images/egypt-lesson.jpg'
      },
      {
        id: '8',
        title: 'Advanced Algebra Concepts',
        description: 'Explore complex algebraic equations and problem-solving techniques.',
        subject: 'Mathematics',
        gradeLevel: 'GRADE_6',
        duration: 70,
        difficulty: 'advanced',
        objectives: [
          'Solve multi-step algebraic equations',
          'Work with variables and coefficients',
          'Apply algebra to real-world problems'
        ],
        tags: ['algebra', 'equations', 'advanced', 'variables'],
        createdBy: '1',
        createdAt: new Date('2024-01-11'),
        updatedAt: new Date('2024-01-21'),
        isPublic: true,
        thumbnailUrl: '/images/algebra-lesson.jpg'
      }
    ];

    // Apply filters
    let filteredLessons = mockLessons;

    if (subject) {
      filteredLessons = filteredLessons.filter(lesson =>
        lesson.subject.toLowerCase().includes(subject.toString().toLowerCase())
      );
    }

    if (gradeLevel) {
      filteredLessons = filteredLessons.filter(lesson => lesson.gradeLevel === gradeLevel);
    }

    if (search) {
      const searchTerm = search.toString().toLowerCase();
      filteredLessons = filteredLessons.filter(lesson =>
        lesson.title.toLowerCase().includes(searchTerm) ||
        lesson.description.toLowerCase().includes(searchTerm) ||
        lesson.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    if (createdBy) {
      filteredLessons = filteredLessons.filter(lesson => lesson.createdBy === createdBy);
    }

    res.json({
      success: true,
      data: {
        lessons: filteredLessons,
        total: filteredLessons.length,
        page: 1,
        limit: 10
      }
    });
  } catch (error) {
    console.error('Get lessons error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch lessons' }
    });
  }
});

app.get('/api/lessons/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Mock detailed lesson data
    const mockLesson = {
      id: id,
      title: 'Introduction to Fractions',
      description: 'Learn the basics of fractions with interactive examples and practice problems.',
      subject: 'Mathematics',
      gradeLevel: 'GRADE_4',
      duration: 45,
      difficulty: 'beginner',
      objectives: [
        'Understand what fractions represent',
        'Identify numerator and denominator',
        'Compare simple fractions'
      ],
      content: {
        introduction: 'Welcome to our lesson on fractions! Fractions are everywhere in our daily lives.',
        mainContent: [
          {
            id: '1',
            type: 'text',
            content: 'A fraction represents a part of a whole. Think of a pizza cut into slices!',
            order: 1
          },
          {
            id: '2',
            type: 'interactive',
            content: 'Interactive fraction visualizer',
            order: 2,
            metadata: { interactiveType: 'fraction_visualizer' }
          },
          {
            id: '3',
            type: 'quiz',
            content: 'Quick check: What fraction represents half of a pizza?',
            order: 3
          }
        ],
        conclusion: 'Great job! You now understand the basics of fractions.',
        vocabulary: [
          {
            term: 'Fraction',
            definition: 'A number that represents a part of a whole',
            examples: ['1/2', '3/4', '2/3']
          },
          {
            term: 'Numerator',
            definition: 'The top number in a fraction',
            examples: ['In 3/4, the numerator is 3']
          }
        ]
      },
      activities: [
        {
          id: '1',
          name: 'Fraction Pizza Party',
          type: 'hands_on',
          description: 'Create paper pizzas and cut them into fractions',
          instructions: 'Cut circular paper into different fraction pieces',
          estimatedTime: 15,
          materials: ['Paper circles', 'Scissors', 'Markers']
        }
      ],
      assessments: [
        {
          id: '1',
          title: 'Fraction Basics Quiz',
          type: 'quiz',
          questions: [
            {
              id: '1',
              type: 'multiple_choice',
              question: 'What does the bottom number in a fraction represent?',
              options: ['Numerator', 'Denominator', 'Whole number', 'Decimal'],
              correctAnswer: 'Denominator',
              points: 1
            }
          ],
          timeLimit: 10,
          attempts: 3,
          passingScore: 80
        }
      ],
      resources: [
        {
          id: '1',
          name: 'Fraction Practice Worksheets',
          type: 'document',
          url: '/resources/fraction-worksheets.pdf'
        }
      ],
      tags: ['fractions', 'math', 'elementary'],
      createdBy: '1',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20'),
      isPublic: true
    };

    res.json({
      success: true,
      data: mockLesson
    });
  } catch (error) {
    console.error('Get lesson error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch lesson' }
    });
  }
});

// Create new lesson
app.post('/api/lessons', async (req, res) => {
  try {
    const {
      title,
      description,
      subject,
      gradeLevel,
      duration,
      difficulty,
      objectives,
      content,
      tags,
      createdBy
    } = req.body;

    // Validate required fields
    if (!title || !description || !subject || !gradeLevel) {
      return res.status(400).json({
        success: false,
        error: { message: 'Missing required fields: title, description, subject, gradeLevel' }
      });
    }

    // Generate new lesson ID
    const lessonId = Date.now().toString();

    // Create lesson object
    const newLesson = {
      id: lessonId,
      title,
      description,
      subject,
      gradeLevel,
      duration: duration || 30,
      difficulty: difficulty || 'beginner',
      objectives: objectives || [],
      content: {
        introduction: `Welcome to ${title}!`,
        mainContent: content || [],
        conclusion: 'Great job completing this lesson!',
        vocabulary: []
      },
      activities: [],
      assessments: [],
      resources: [],
      tags: typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : (tags || []),
      createdBy: createdBy || '1',
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublic: true
    };

    // In a real app, you would save this to a database
    // For now, we'll just return the created lesson
    console.log('Created lesson:', newLesson);

    res.json({
      success: true,
      data: newLesson
    });
  } catch (error) {
    console.error('Create lesson error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to create lesson' }
    });
  }
});

// Update existing lesson
app.put('/api/lessons/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // In a real app, you would update the lesson in the database
    // For now, we'll just return a success response
    console.log('Updated lesson:', id, updateData);

    res.json({
      success: true,
      data: { id, ...updateData, updatedAt: new Date() }
    });
  } catch (error) {
    console.error('Update lesson error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to update lesson' }
    });
  }
});

// Delete lesson
app.delete('/api/lessons/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // In a real app, you would delete the lesson from the database
    console.log('Deleted lesson:', id);

    res.json({
      success: true,
      message: 'Lesson deleted successfully'
    });
  } catch (error) {
    console.error('Delete lesson error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to delete lesson' }
    });
  }
});

// Student Progress Tracking
app.get('/api/progress/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const { lessonId } = req.query;

    // Mock progress data
    const mockProgress = {
      studentId,
      lessonId: lessonId || 'all',
      overallProgress: {
        totalLessons: 8,
        completedLessons: 3,
        inProgressLessons: 2,
        totalTimeSpent: 180, // minutes
        averageScore: 85,
        streak: 5,
        xpEarned: 450
      },
      lessonProgress: [
        {
          lessonId: '1',
          lessonTitle: 'Introduction to Fractions',
          status: 'completed',
          progress: 100,
          timeSpent: 45,
          score: 92,
          completedAt: new Date('2024-01-20'),
          modules: [
            { id: '1', title: 'What are Fractions?', completed: true, timeSpent: 15 },
            { id: '2', title: 'Numerator and Denominator', completed: true, timeSpent: 20 },
            { id: '3', title: 'Practice Problems', completed: true, timeSpent: 10 }
          ]
        },
        {
          lessonId: '2',
          lessonTitle: 'The Water Cycle',
          status: 'completed',
          progress: 100,
          timeSpent: 30,
          score: 88,
          completedAt: new Date('2024-01-18'),
          modules: [
            { id: '1', title: 'Introduction', completed: true, timeSpent: 10 },
            { id: '2', title: 'Evaporation', completed: true, timeSpent: 10 },
            { id: '3', title: 'Condensation', completed: true, timeSpent: 10 }
          ]
        },
        {
          lessonId: '4',
          lessonTitle: 'Multiplication Tables',
          status: 'in_progress',
          progress: 60,
          timeSpent: 25,
          score: null,
          startedAt: new Date('2024-01-22'),
          modules: [
            { id: '1', title: 'Tables 1-5', completed: true, timeSpent: 15 },
            { id: '2', title: 'Tables 6-10', completed: false, timeSpent: 10 },
            { id: '3', title: 'Practice Quiz', completed: false, timeSpent: 0 }
          ]
        }
      ],
      recentActivity: [
        {
          type: 'lesson_completed',
          lessonTitle: 'Introduction to Fractions',
          timestamp: new Date('2024-01-20'),
          score: 92
        },
        {
          type: 'lesson_started',
          lessonTitle: 'Multiplication Tables',
          timestamp: new Date('2024-01-22')
        }
      ],
      achievements: [
        {
          id: 'first_lesson',
          title: 'First Steps',
          description: 'Completed your first lesson',
          earnedAt: new Date('2024-01-18'),
          icon: '🎯'
        },
        {
          id: 'math_master',
          title: 'Math Master',
          description: 'Scored 90+ on a math lesson',
          earnedAt: new Date('2024-01-20'),
          icon: '🧮'
        }
      ]
    };

    res.json({
      success: true,
      data: mockProgress
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch progress' }
    });
  }
});

// Update lesson progress
app.post('/api/progress', async (req, res) => {
  try {
    const {
      studentId,
      lessonId,
      moduleId,
      action,
      timeSpent,
      score,
      data
    } = req.body;

    // Mock progress update
    const progressUpdate = {
      studentId,
      lessonId,
      moduleId,
      action,
      timeSpent: timeSpent || 0,
      score,
      timestamp: new Date(),
      data
    };

    console.log('Progress update:', progressUpdate);

    // Calculate XP based on action
    let xpEarned = 0;
    switch (action) {
      case 'complete_module':
        xpEarned = 10;
        break;
      case 'complete_lesson':
        xpEarned = 50;
        break;
      case 'perfect_score':
        xpEarned = 25;
        break;
      default:
        xpEarned = 5;
    }

    res.json({
      success: true,
      data: {
        ...progressUpdate,
        xpEarned,
        message: `Progress updated! +${xpEarned} XP`
      }
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to update progress' }
    });
  }
});

// Teacher Analytics
app.get('/api/analytics/teacher/:teacherId', async (req, res) => {
  try {
    const { teacherId } = req.params;

    // Mock teacher analytics
    const analytics = {
      teacherId,
      overview: {
        totalStudents: 24,
        totalLessons: 8,
        averageCompletion: 78,
        averageScore: 85,
        totalTimeSpent: 1440, // minutes
        activeStudents: 18
      },
      lessonPerformance: [
        {
          lessonId: '1',
          title: 'Introduction to Fractions',
          studentsEnrolled: 24,
          studentsCompleted: 22,
          averageScore: 87,
          averageTime: 42,
          completionRate: 92
        },
        {
          lessonId: '2',
          title: 'The Water Cycle',
          studentsEnrolled: 24,
          studentsCompleted: 20,
          averageScore: 83,
          averageTime: 35,
          completionRate: 83
        }
      ],
      studentProgress: [
        {
          studentId: '1',
          studentName: 'Alice Johnson',
          lessonsCompleted: 6,
          averageScore: 92,
          timeSpent: 180,
          lastActive: new Date('2024-01-22')
        },
        {
          studentId: '2',
          studentName: 'Bob Smith',
          lessonsCompleted: 4,
          averageScore: 78,
          timeSpent: 120,
          lastActive: new Date('2024-01-21')
        }
      ],
      strugglingStudents: [
        {
          studentId: '3',
          studentName: 'Charlie Brown',
          lessonId: '4',
          lessonTitle: 'Multiplication Tables',
          timeStuck: 45,
          attempts: 3,
          needsHelp: true
        }
      ]
    };

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Get teacher analytics error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch analytics' }
    });
  }
});

// AI Lesson Generation
app.post('/api/ai/generate-lesson', async (req, res) => {
  try {
    const { title, subject, gradeLevel, duration, objectives } = req.body;

    if (!title || !subject || !gradeLevel) {
      return res.status(400).json({
        success: false,
        error: { message: 'Missing required fields: title, subject, gradeLevel' }
      });
    }

    // Create comprehensive lesson generation prompt
    const prompt = `Create a detailed, engaging lesson plan for "${title}" in ${subject} for ${gradeLevel.replace('GRADE_', 'Grade ')} students.

Duration: ${duration || 30} minutes

${objectives && objectives.length > 0 ? `Learning Objectives:
${objectives.map(obj => `- ${obj}`).join('\n')}` : ''}

Please provide:
1. A compelling lesson introduction (2-3 sentences)
2. 4-6 main content sections with:
   - Clear section titles
   - Detailed explanations appropriate for the grade level
   - Interactive elements or activities
   - Real-world examples
3. 2-3 hands-on activities with materials and instructions
4. Assessment questions (mix of multiple choice and short answer)
5. Key vocabulary terms with definitions
6. A lesson conclusion that reinforces learning

Make it engaging, age-appropriate, and include opportunities for student interaction. Use clear, simple language that ${gradeLevel.replace('GRADE_', 'Grade ')} students can understand.`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert educational content creator specializing in K-12 curriculum development. Create engaging, age-appropriate lesson plans that promote active learning and student engagement."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0]?.message?.content || "Failed to generate lesson content.";

    // Parse the AI response to extract structured content
    const lessonData = parseAILessonResponse(aiResponse, title, subject, gradeLevel, duration);

    res.json({
      success: true,
      data: {
        rawResponse: aiResponse,
        structuredLesson: lessonData,
        timestamp: new Date().toISOString(),
        model: 'gpt-4'
      }
    });
  } catch (error) {
    console.error('AI Lesson Generation error:', error);

    let errorMessage = 'Failed to generate lesson content';
    if (error.code === 'insufficient_quota') {
      errorMessage = 'OpenAI API quota exceeded. Please check your billing.';
    } else if (error.code === 'invalid_api_key') {
      errorMessage = 'Invalid OpenAI API key. Please check configuration.';
    }

    res.status(500).json({
      success: false,
      error: { message: errorMessage }
    });
  }
});

// Helper function to parse AI lesson response
function parseAILessonResponse(aiResponse, title, subject, gradeLevel, duration) {
  // Extract sections from AI response
  const sections = aiResponse.split(/\n(?=\d+\.|\*\*|##)/);

  const lessonData = {
    title,
    subject,
    gradeLevel,
    duration: duration || 30,
    introduction: '',
    content: [],
    activities: [],
    assessments: [],
    vocabulary: [],
    conclusion: ''
  };

  // Try to extract structured content
  sections.forEach((section, index) => {
    const lowerSection = section.toLowerCase();

    if (lowerSection.includes('introduction') || index === 0) {
      lessonData.introduction = section.replace(/^\d+\.\s*|\*\*.*?\*\*\s*/g, '').trim();
    } else if (lowerSection.includes('content') || lowerSection.includes('main')) {
      lessonData.content.push({
        id: `content_${index}`,
        type: 'text',
        title: `Content Section ${index}`,
        content: section.replace(/^\d+\.\s*|\*\*.*?\*\*\s*/g, '').trim(),
        order: index
      });
    } else if (lowerSection.includes('activity') || lowerSection.includes('activities')) {
      lessonData.activities.push({
        id: `activity_${index}`,
        name: `Activity ${lessonData.activities.length + 1}`,
        type: 'hands_on',
        description: section.replace(/^\d+\.\s*|\*\*.*?\*\*\s*/g, '').trim(),
        instructions: section.replace(/^\d+\.\s*|\*\*.*?\*\*\s*/g, '').trim(),
        estimatedTime: 10,
        materials: ['Paper', 'Pencils', 'Worksheets']
      });
    } else if (lowerSection.includes('vocabulary')) {
      // Extract vocabulary terms
      const vocabMatches = section.match(/[-•*]\s*([^:]+):\s*(.+)/g);
      if (vocabMatches) {
        vocabMatches.forEach(match => {
          const [, term, definition] = match.match(/[-•*]\s*([^:]+):\s*(.+)/);
          lessonData.vocabulary.push({
            term: term.trim(),
            definition: definition.trim(),
            examples: []
          });
        });
      }
    } else if (lowerSection.includes('conclusion')) {
      lessonData.conclusion = section.replace(/^\d+\.\s*|\*\*.*?\*\*\s*/g, '').trim();
    }
  });

  return lessonData;
}

// Quiz Management Endpoints
app.get('/api/quizzes', async (req, res) => {
  try {
    const { subject, gradeLevel, difficulty, search, createdBy } = req.query;

    // Mock quiz data
    const mockQuizzes = [
      {
        id: '1',
        title: 'Fractions Fundamentals',
        description: 'Test your understanding of basic fraction concepts and operations.',
        subject: 'MATHEMATICS',
        gradeLevel: 'GRADE_4',
        difficulty: 'BEGINNER',
        questionCount: 10,
        timeLimit: 15,
        passingScore: 70,
        tags: ['fractions', 'math', 'basics'],
        createdBy: '1',
        createdAt: new Date('2024-01-15'),
        isPublished: true
      },
      {
        id: '2',
        title: 'Water Cycle Quiz',
        description: 'Assess your knowledge of the water cycle and its processes.',
        subject: 'SCIENCE',
        gradeLevel: 'GRADE_3',
        difficulty: 'BEGINNER',
        questionCount: 8,
        timeLimit: 12,
        passingScore: 75,
        tags: ['water cycle', 'science', 'environment'],
        createdBy: '1',
        createdAt: new Date('2024-01-10'),
        isPublished: true
      },
      {
        id: '3',
        title: 'Grammar Basics',
        description: 'Test your understanding of basic grammar rules and sentence structure.',
        subject: 'ENGLISH',
        gradeLevel: 'GRADE_5',
        difficulty: 'INTERMEDIATE',
        questionCount: 15,
        timeLimit: 20,
        passingScore: 80,
        tags: ['grammar', 'english', 'writing'],
        createdBy: '1',
        createdAt: new Date('2024-01-05'),
        isPublished: true
      }
    ];

    // Apply filters
    let filteredQuizzes = mockQuizzes;

    if (subject) {
      filteredQuizzes = filteredQuizzes.filter(quiz => quiz.subject === subject);
    }

    if (gradeLevel) {
      filteredQuizzes = filteredQuizzes.filter(quiz => quiz.gradeLevel === gradeLevel);
    }

    if (difficulty) {
      filteredQuizzes = filteredQuizzes.filter(quiz => quiz.difficulty === difficulty);
    }

    if (search) {
      const searchTerm = search.toString().toLowerCase();
      filteredQuizzes = filteredQuizzes.filter(quiz =>
        quiz.title.toLowerCase().includes(searchTerm) ||
        quiz.description.toLowerCase().includes(searchTerm) ||
        quiz.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    if (createdBy) {
      filteredQuizzes = filteredQuizzes.filter(quiz => quiz.createdBy === createdBy);
    }

    res.json({
      success: true,
      data: {
        quizzes: filteredQuizzes,
        total: filteredQuizzes.length,
        page: 1,
        limit: 10
      }
    });
  } catch (error) {
    console.error('Get quizzes error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch quizzes' }
    });
  }
});

app.get('/api/quizzes/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Mock detailed quiz data
    const mockQuiz = {
      id: id,
      title: 'Fractions Fundamentals',
      description: 'Test your understanding of basic fraction concepts and operations.',
      subject: 'MATHEMATICS',
      gradeLevel: 'GRADE_4',
      difficulty: 'BEGINNER',
      timeLimit: 15,
      passingScore: 70,
      settings: {
        maxAttempts: 3,
        showCorrectAnswers: true,
        showExplanations: true,
        allowReview: true,
        randomizeQuestions: false
      },
      questions: [
        {
          id: '1',
          type: 'MULTIPLE_CHOICE',
          question: 'What does the numerator in a fraction represent?',
          options: [
            'The total number of parts',
            'The number of parts we have',
            'The bottom number',
            'The decimal equivalent'
          ],
          correctAnswer: 'The number of parts we have',
          explanation: 'The numerator is the top number in a fraction and represents how many parts we have.',
          points: 2,
          order: 0
        },
        {
          id: '2',
          type: 'TRUE_FALSE',
          question: 'The fraction 1/2 is equivalent to 0.5 in decimal form.',
          correctAnswer: 'true',
          explanation: '1 divided by 2 equals 0.5, so 1/2 = 0.5.',
          points: 1,
          order: 1
        }
      ],
      tags: ['fractions', 'math', 'basics'],
      createdBy: '1',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20'),
      isPublished: true
    };

    res.json({
      success: true,
      data: mockQuiz
    });
  } catch (error) {
    console.error('Get quiz error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch quiz' }
    });
  }
});

// Create new quiz
app.post('/api/quizzes', async (req, res) => {
  try {
    const {
      title,
      description,
      subject,
      gradeLevel,
      difficulty,
      questions,
      settings,
      tags,
      createdBy
    } = req.body;

    // Validate required fields
    if (!title || !description || !subject || !gradeLevel || !questions || questions.length === 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'Missing required fields' }
      });
    }

    // Generate new quiz ID
    const quizId = Date.now().toString();

    // Create quiz object
    const newQuiz = {
      id: quizId,
      title,
      description,
      subject,
      gradeLevel,
      difficulty: difficulty || 'BEGINNER',
      questions: questions.map((q, index) => ({
        ...q,
        id: `${quizId}_q${index + 1}`,
        order: index
      })),
      settings: {
        maxAttempts: 3,
        passingScore: 70,
        showCorrectAnswers: true,
        showExplanations: true,
        allowReview: true,
        randomizeQuestions: false,
        ...settings
      },
      tags: typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : (tags || []),
      createdBy: createdBy || '1',
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublished: false
    };

    console.log('Created quiz:', newQuiz);

    res.json({
      success: true,
      data: newQuiz
    });
  } catch (error) {
    console.error('Create quiz error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to create quiz' }
    });
  }
});

// Submit quiz attempt
app.post('/api/quizzes/:id/submit', async (req, res) => {
  try {
    const { id } = req.params;
    const { studentId, answers, timeSpent } = req.body;

    // Mock grading logic
    const mockQuiz = {
      questions: [
        {
          id: '1',
          correctAnswer: 'The number of parts we have',
          points: 2,
          explanation: 'The numerator is the top number in a fraction and represents how many parts we have.'
        },
        {
          id: '2',
          correctAnswer: 'true',
          points: 1,
          explanation: '1 divided by 2 equals 0.5, so 1/2 = 0.5.'
        }
      ],
      passingScore: 70
    };

    let totalScore = 0;
    let maxScore = 0;
    const questionResults = [];

    for (const question of mockQuiz.questions) {
      maxScore += question.points;
      const studentAnswer = answers[question.id];
      const isCorrect = studentAnswer?.answer === question.correctAnswer;
      const pointsEarned = isCorrect ? question.points : 0;
      totalScore += pointsEarned;

      questionResults.push({
        questionId: question.id,
        isCorrect,
        pointsEarned,
        maxPoints: question.points,
        explanation: question.explanation,
        studentAnswer: studentAnswer?.answer || '',
        correctAnswer: question.correctAnswer
      });
    }

    const percentage = Math.round((totalScore / maxScore) * 100);
    const passed = percentage >= mockQuiz.passingScore;

    const result = {
      attemptId: Date.now().toString(),
      quizId: id,
      studentId,
      score: totalScore,
      maxScore,
      percentage,
      passed,
      timeSpent,
      submittedAt: new Date(),
      questionResults,
      feedback: passed
        ? 'Congratulations! You passed the quiz.'
        : `You scored ${percentage}%. You need ${mockQuiz.passingScore}% to pass. Keep studying and try again!`,
      recommendations: passed
        ? ['Great job! Continue to the next lesson.']
        : ['Review the lesson material', 'Practice more problems', 'Ask for help if needed']
    };

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to submit quiz' }
    });
  }
});

// AI Quiz Generation
app.post('/api/ai/generate-quiz', async (req, res) => {
  try {
    const {
      subject,
      gradeLevel,
      difficulty,
      questionCount,
      questionTypes,
      topics,
      lessonContent
    } = req.body;

    if (!subject || !gradeLevel || !questionCount) {
      return res.status(400).json({
        success: false,
        error: { message: 'Missing required fields: subject, gradeLevel, questionCount' }
      });
    }

    // Create comprehensive quiz generation prompt
    const prompt = `Create a ${questionCount}-question quiz for ${subject} at ${gradeLevel.replace('GRADE_', 'Grade ')} level.

Difficulty: ${difficulty || 'BEGINNER'}
Question Types: ${questionTypes?.join(', ') || 'MULTIPLE_CHOICE, TRUE_FALSE'}
${topics ? `Topics to cover: ${topics.join(', ')}` : ''}
${lessonContent ? `Base questions on this lesson content: ${lessonContent}` : ''}

For each question, provide:
1. Question text (clear and age-appropriate)
2. Question type (MULTIPLE_CHOICE, TRUE_FALSE, SHORT_ANSWER, or FILL_IN_BLANK)
3. If multiple choice: 4 options with one correct answer
4. If true/false: the statement and correct answer
5. If short answer/fill in blank: the expected answer
6. A clear explanation of why the answer is correct
7. Point value (1-3 points based on difficulty)

Format each question as:
QUESTION [number]:
Type: [question type]
Question: [question text]
Options: [if multiple choice: A) option1, B) option2, C) option3, D) option4]
Correct Answer: [correct answer]
Explanation: [explanation]
Points: [point value]

Make questions engaging, educational, and appropriate for ${gradeLevel.replace('GRADE_', 'Grade ')} students.`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert educational assessment creator specializing in K-12 curriculum. Create engaging, age-appropriate quiz questions that accurately assess student understanding."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0]?.message?.content || "Failed to generate quiz questions.";

    // Parse the AI response to extract structured questions
    const questions = parseAIQuizResponse(aiResponse);

    // Generate suggested settings
    const suggestedSettings = {
      timeLimit: Math.max(questionCount * 2, 10), // 2 minutes per question, minimum 10
      maxAttempts: 3,
      passingScore: difficulty === 'ADVANCED' ? 80 : difficulty === 'INTERMEDIATE' ? 75 : 70,
      showCorrectAnswers: true,
      showExplanations: true,
      allowReview: true,
      randomizeQuestions: questionCount > 5
    };

    res.json({
      success: true,
      data: {
        questions,
        suggestedSettings,
        rawResponse: aiResponse,
        metadata: {
          generatedAt: new Date().toISOString(),
          model: 'gpt-4',
          questionCount: questions.length,
          confidence: questions.length === questionCount ? 1.0 : 0.8
        }
      }
    });
  } catch (error) {
    console.error('AI Quiz Generation error:', error);

    let errorMessage = 'Failed to generate quiz questions';
    if (error.code === 'insufficient_quota') {
      errorMessage = 'OpenAI API quota exceeded. Please check your billing.';
    } else if (error.code === 'invalid_api_key') {
      errorMessage = 'Invalid OpenAI API key. Please check configuration.';
    }

    res.status(500).json({
      success: false,
      error: { message: errorMessage }
    });
  }
});

// Helper function to parse AI quiz response
function parseAIQuizResponse(aiResponse) {
  const questions = [];
  const questionBlocks = aiResponse.split(/QUESTION \d+:/);

  questionBlocks.forEach((block, index) => {
    if (index === 0) return; // Skip the first empty block

    const lines = block.trim().split('\n');
    const question = {
      type: 'MULTIPLE_CHOICE',
      question: '',
      options: [],
      correctAnswer: '',
      explanation: '',
      points: 1
    };

    lines.forEach(line => {
      const trimmedLine = line.trim();

      if (trimmedLine.startsWith('Type:')) {
        question.type = trimmedLine.replace('Type:', '').trim();
      } else if (trimmedLine.startsWith('Question:')) {
        question.question = trimmedLine.replace('Question:', '').trim();
      } else if (trimmedLine.startsWith('Options:')) {
        const optionsText = trimmedLine.replace('Options:', '').trim();
        question.options = optionsText.split(/[A-D]\)/).slice(1).map(opt => opt.trim());
      } else if (trimmedLine.startsWith('Correct Answer:')) {
        question.correctAnswer = trimmedLine.replace('Correct Answer:', '').trim();
      } else if (trimmedLine.startsWith('Explanation:')) {
        question.explanation = trimmedLine.replace('Explanation:', '').trim();
      } else if (trimmedLine.startsWith('Points:')) {
        const pointsText = trimmedLine.replace('Points:', '').trim();
        question.points = parseInt(pointsText) || 1;
      }
    });

    // Only add question if it has required fields
    if (question.question && question.correctAnswer) {
      questions.push(question);
    }
  });

  return questions;
}

// Gamification Endpoints

// Get student profile with gamification data
app.get('/api/profile/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;

    // Get student profile from database
    const profile = await prisma.studentProfile.findUnique({
      where: { userId: studentId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: { message: 'Profile not found' }
      });
    }

    // Get user badges
    const userBadges = await prisma.userBadge.findMany({
      where: { userId: studentId },
      include: {
        badge: true
      }
    });

    // Get user achievements
    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId: studentId },
      include: {
        achievement: true
      }
    });

    // Get progress stats
    const progressStats = await prisma.progress.findMany({
      where: { studentId },
      include: {
        lesson: {
          select: {
            subject: true
          }
        }
      }
    });

    // Get quiz stats
    const quizStats = await prisma.quizAttempt.findMany({
      where: { studentId },
      include: {
        quiz: {
          select: {
            subject: true
          }
        }
      }
    });

    // Calculate stats
    const totalLessonsCompleted = progressStats.filter(p => p.status === 'COMPLETED').length;
    const totalQuizzesCompleted = quizStats.length;
    const totalTimeSpent = progressStats.reduce((sum, p) => sum + p.timeSpent, 0);
    const averageScore = quizStats.length > 0
      ? Math.round(quizStats.reduce((sum, q) => sum + q.percentage, 0) / quizStats.length)
      : 0;
    const perfectScores = quizStats.filter(q => q.percentage === 100).length;

    // Calculate subject stats
    const subjectMap = new Map();

    progressStats.forEach(p => {
      const subject = p.lesson.subject;
      if (!subjectMap.has(subject)) {
        subjectMap.set(subject, {
          subject,
          lessonsCompleted: 0,
          averageScore: 0,
          timeSpent: 0,
          quizzes: []
        });
      }
      const subjectData = subjectMap.get(subject);
      if (p.status === 'COMPLETED') {
        subjectData.lessonsCompleted++;
      }
      subjectData.timeSpent += p.timeSpent;
    });

    quizStats.forEach(q => {
      const subject = q.quiz.subject;
      if (subjectMap.has(subject)) {
        subjectMap.get(subject).quizzes.push(q.percentage);
      }
    });

    const subjectStats = Array.from(subjectMap.values()).map(subject => ({
      subject: subject.subject,
      lessonsCompleted: subject.lessonsCompleted,
      averageScore: subject.quizzes.length > 0
        ? Math.round(subject.quizzes.reduce((sum, score) => sum + score, 0) / subject.quizzes.length)
        : 0,
      timeSpent: subject.timeSpent,
      level: Math.floor(subject.lessonsCompleted / 3) + 1, // Simple level calculation
      xp: subject.lessonsCompleted * 50 // Simple XP calculation
    }));

    const responseData = {
      id: profile.id,
      displayName: profile.displayName,
      level: profile.level,
      totalXP: profile.totalXP,
      currentLevelXP: profile.currentLevelXP,
      nextLevelXP: profile.nextLevelXP,
      streak: profile.streak,
      longestStreak: profile.longestStreak,
      badges: userBadges.map(ub => ({
        id: ub.badge.id,
        name: ub.badge.name,
        description: ub.badge.description,
        icon: ub.badge.icon,
        color: ub.badge.color,
        category: ub.badge.category,
        rarity: ub.badge.rarity,
        earnedAt: ub.earnedAt
      })),
      achievements: userAchievements.map(ua => ({
        id: ua.achievement.id,
        name: ua.achievement.name,
        description: ua.achievement.description,
        icon: ua.achievement.icon,
        category: ua.achievement.category,
        progress: ua.progress,
        earnedAt: ua.earnedAt
      })),
      stats: {
        totalLessonsCompleted,
        totalQuizzesCompleted,
        totalTimeSpent,
        averageScore,
        perfectScores,
        subjectStats
      },
      avatar: profile.avatar
    };

    res.json({
      success: true,
      data: responseData
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch profile' }
    });
  }
});

// Award XP to student
app.post('/api/gamification/award-xp', async (req, res) => {
  try {
    const { studentId, amount, source, sourceId, description, multiplier = 1 } = req.body;

    if (!studentId || !amount || !source) {
      return res.status(400).json({
        success: false,
        error: { message: 'Missing required fields: studentId, amount, source' }
      });
    }

    const finalAmount = amount * multiplier;

    // Award XP using database function
    const result = await awardXP(
      studentId,
      finalAmount,
      source,
      sourceId || '',
      description || `Earned ${finalAmount} XP from ${source}`
    );

    // Check for new achievements
    const newAchievements = await checkAndAwardAchievements(studentId, 'xp_earned', {
      amount: finalAmount,
      source,
      totalXP: result.totalXP
    });

    res.json({
      success: true,
      data: {
        transaction: result.transaction,
        leveledUp: result.leveledUp,
        newLevel: result.newLevel,
        oldLevel: result.oldLevel,
        newAchievements,
        totalXP: result.totalXP
      }
    });
  } catch (error) {
    console.error('Award XP error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to award XP' }
    });
  }
});

// Get leaderboard
app.get('/api/leaderboard', async (req, res) => {
  try {
    const { type = 'XP', scope = 'CLASS', timeframe = 'WEEKLY', limit = 10 } = req.query;

    const leaderboardData = await getLeaderboard(
      type as string,
      scope as string,
      timeframe as string,
      parseInt(limit as string)
    );

    const leaderboard = {
      type,
      scope,
      timeframe,
      entries: leaderboardData,
      lastUpdated: new Date()
    };

    res.json({
      success: true,
      data: leaderboard
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch leaderboard' }
    });
  }
});

// Check and award achievements
app.post('/api/gamification/check-achievements', async (req, res) => {
  try {
    const { studentId, action, data } = req.body;

    if (!studentId || !action) {
      return res.status(400).json({
        success: false,
        error: { message: 'Missing required fields: studentId, action' }
      });
    }

    const newAchievements = [];
    const newBadges = [];

    // Mock achievement checking logic
    switch (action) {
      case 'lesson_completed':
        if (data.score === 100) {
          newAchievements.push({
            id: 'perfectionist',
            name: 'Perfectionist',
            description: 'Score 100% on a lesson',
            icon: '⭐',
            xpReward: 25
          });
        }
        break;

      case 'quiz_completed':
        if (data.score >= 90) {
          newBadges.push({
            id: 'quiz_master',
            name: 'Quiz Master',
            description: 'Score 90% or higher on a quiz',
            icon: '🎯',
            color: 'GOLD'
          });
        }
        break;

      case 'streak_updated':
        if (data.streak >= 7) {
          newAchievements.push({
            id: 'streak_warrior',
            name: 'Streak Warrior',
            description: 'Maintain a 7-day learning streak',
            icon: '🔥',
            xpReward: 50
          });
        }
        break;
    }

    res.json({
      success: true,
      data: {
        newAchievements,
        newBadges,
        totalXPAwarded: newAchievements.reduce((sum, achievement) => sum + (achievement.xpReward || 0), 0)
      }
    });
  } catch (error) {
    console.error('Check achievements error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to check achievements' }
    });
  }
});

// Create demo user for testing
app.post('/api/demo/create-user', async (req, res) => {
  try {
    // Create a demo student user
    const demoUser = await createUser({
      email: 'demo@student.com',
      password: 'password123',
      name: 'Demo Student',
      role: 'STUDENT'
    });

    // Award some initial XP
    await awardXP(demoUser.id, 500, 'DAILY_LOGIN', 'demo', 'Welcome bonus');

    // Update streak
    await updateStreak(demoUser.id, 'DAILY_LOGIN');

    res.json({
      success: true,
      data: {
        user: demoUser,
        message: 'Demo user created successfully'
      }
    });
  } catch (error) {
    console.error('Demo user creation error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to create demo user' }
    });
  }
});

// Initialize database with seed data
app.post('/api/demo/seed-database', async (req, res) => {
  try {
    // Import and run the seed function
    const { seedDatabase } = await import('./lib/database');
    await seedDatabase();

    res.json({
      success: true,
      message: 'Database seeded successfully'
    });
  } catch (error) {
    console.error('Database seeding error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to seed database' }
    });
  }
});

// Class Management Endpoints

// Get all classes for a teacher
app.get('/api/classes', async (req, res) => {
  try {
    const { teacherId } = req.query;

    if (!teacherId) {
      return res.status(400).json({
        success: false,
        error: { message: 'Teacher ID is required' }
      });
    }

    const classes = await prisma.class.findMany({
      where: { teacherId: teacherId as string },
      include: {
        enrollments: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        _count: {
          select: {
            enrollments: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const classesWithStats = await Promise.all(classes.map(async (classItem) => {
      // Get lesson and quiz counts (mock for now)
      const lessonsAssigned = 15; // TODO: Get from actual lessons
      const quizzesAssigned = 8; // TODO: Get from actual quizzes

      // Calculate average progress (mock for now)
      const averageProgress = Math.floor(Math.random() * 40) + 60; // 60-100%

      return {
        id: classItem.id,
        name: classItem.name,
        description: classItem.description,
        subject: classItem.subject,
        gradeLevel: classItem.gradeLevel,
        studentCount: classItem._count.enrollments,
        lessonsAssigned,
        quizzesAssigned,
        averageProgress,
        isActive: classItem.isActive,
        createdAt: classItem.createdAt,
        recentActivity: 'Recent class activity' // TODO: Get actual activity
      };
    }));

    res.json({
      success: true,
      data: classesWithStats
    });
  } catch (error) {
    console.error('Get classes error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch classes' }
    });
  }
});

// Create a new class
app.post('/api/classes', async (req, res) => {
  try {
    const { name, description, subject, gradeLevel, teacherId, maxStudents } = req.body;

    if (!name || !subject || !gradeLevel || !teacherId) {
      return res.status(400).json({
        success: false,
        error: { message: 'Missing required fields: name, subject, gradeLevel, teacherId' }
      });
    }

    const newClass = await prisma.class.create({
      data: {
        name,
        description: description || '',
        subject,
        gradeLevel,
        teacherId,
        isActive: true
      }
    });

    res.status(201).json({
      success: true,
      data: newClass
    });
  } catch (error) {
    console.error('Create class error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to create class' }
    });
  }
});

// Get class details
app.get('/api/classes/:classId', async (req, res) => {
  try {
    const { classId } = req.params;

    const classData = await prisma.class.findUnique({
      where: { id: classId },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        enrollments: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true
              }
            }
          }
        }
      }
    });

    if (!classData) {
      return res.status(404).json({
        success: false,
        error: { message: 'Class not found' }
      });
    }

    // Get student progress data
    const studentsWithProgress = await Promise.all(classData.enrollments.map(async (enrollment) => {
      const student = enrollment.student;

      // Mock progress data for now
      const progress = Math.floor(Math.random() * 50) + 50; // 50-100%
      const lessonsCompleted = Math.floor(Math.random() * 10) + 5;
      const quizzesCompleted = Math.floor(Math.random() * 5) + 3;
      const averageScore = Math.floor(Math.random() * 30) + 70; // 70-100%

      return {
        id: student.id,
        name: student.name,
        email: student.email,
        avatar: '👨‍🎓', // Default avatar
        progress,
        lastActive: new Date(),
        lessonsCompleted,
        quizzesCompleted,
        averageScore,
        status: progress >= 80 ? 'active' : progress >= 60 ? 'active' : 'struggling'
      };
    }));

    const response = {
      id: classData.id,
      name: classData.name,
      description: classData.description,
      subject: classData.subject,
      gradeLevel: classData.gradeLevel,
      teacher: classData.teacher,
      students: studentsWithProgress,
      stats: {
        totalStudents: studentsWithProgress.length,
        activeStudents: studentsWithProgress.filter(s => s.status === 'active').length,
        averageProgress: Math.round(studentsWithProgress.reduce((sum, s) => sum + s.progress, 0) / studentsWithProgress.length),
        completionRate: 85 // Mock completion rate
      },
      assignments: [], // TODO: Get actual assignments
      schedule: {
        days: ['monday', 'wednesday', 'friday'],
        startTime: '09:00',
        endTime: '10:30'
      }
    };

    res.json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('Get class details error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch class details' }
    });
  }
});

// Enroll student in class
app.post('/api/classes/:classId/enroll', async (req, res) => {
  try {
    const { classId } = req.params;
    const { studentId } = req.body;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        error: { message: 'Student ID is required' }
      });
    }

    // Check if student is already enrolled
    const existingEnrollment = await prisma.classEnrollment.findUnique({
      where: {
        classId_studentId: {
          classId,
          studentId
        }
      }
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        error: { message: 'Student is already enrolled in this class' }
      });
    }

    const enrollment = await prisma.classEnrollment.create({
      data: {
        classId,
        studentId,
        isActive: true
      }
    });

    res.status(201).json({
      success: true,
      data: enrollment
    });
  } catch (error) {
    console.error('Enroll student error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to enroll student' }
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
});
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mock user data
const mockUsers = [
  {
    id: '1',
    email: 'teacher@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    firstName: 'John',
    lastName: 'Teacher',
    role: 'TEACHER',
    schoolId: 'school1'
  },
  {
    id: '2',
    email: 'student@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    firstName: 'Jane',
    lastName: 'Student',
    role: 'STUDENT',
    schoolId: 'school1'
  }
];

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid credentials' }
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid credentials' }
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        uid: user.id,
        email: user.email,
        role: user.role,
        schoolId: user.schoolId,
      },
      process.env.JWT_SECRET || 'default-secret'
    );

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: {
        token,
        user: userWithoutPassword
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' }
    });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, role, schoolId } = req.body;

    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: { message: 'User already exists' }
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: String(mockUsers.length + 1),
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: role || 'STUDENT',
      schoolId: schoolId || 'school1'
    };

    // Add to mock database
    mockUsers.push(newUser);

    // Generate JWT
    const token = jwt.sign(
      {
        uid: newUser.id,
        email: newUser.email,
        role: newUser.role,
        schoolId: newUser.schoolId,
      },
      process.env.JWT_SECRET || 'default-secret'
    );

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = newUser;

    res.json({
      success: true,
      data: {
        token,
        user: userWithoutPassword
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' }
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

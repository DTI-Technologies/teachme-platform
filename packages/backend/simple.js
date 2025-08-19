const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Simple health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'TeachMe Backend is running!',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// Simple test endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'TeachMe Platform Backend',
    status: 'running',
    version: '1.0.0'
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Simple backend running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

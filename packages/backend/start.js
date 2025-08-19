#!/usr/bin/env node

console.log('🚀 Starting TeachMe Backend...');
console.log('📍 Node version:', process.version);
console.log('🌍 Environment:', process.env.NODE_ENV || 'development');
console.log('🔧 Port:', process.env.PORT || 3001);
console.log('🗄️ Database URL:', process.env.DATABASE_URL ? 'Configured' : 'Missing');

try {
  // Register ts-node
  require('ts-node/register');
  
  // Start the application
  require('./src/index.ts');
} catch (error) {
  console.error('❌ Failed to start application:', error);
  process.exit(1);
}

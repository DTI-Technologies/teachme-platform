#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🚀 Setting up TeachMe environment...\n');

// Generate random secrets
const generateSecret = (length = 64) => {
  return crypto.randomBytes(length).toString('hex');
};

// Check if .env already exists
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  console.log('⚠️  .env file already exists. Skipping environment setup.');
  console.log('   If you want to regenerate, delete .env and run this script again.\n');
  process.exit(0);
}

// Read .env.example
const envExamplePath = path.join(__dirname, '..', '.env.example');
if (!fs.existsSync(envExamplePath)) {
  console.error('❌ .env.example file not found!');
  process.exit(1);
}

let envContent = fs.readFileSync(envExamplePath, 'utf8');

// Replace placeholder values with generated secrets
const replacements = {
  'your-jwt-secret-key': generateSecret(32),
  'your-refresh-token-secret': generateSecret(32),
};

Object.entries(replacements).forEach(([placeholder, value]) => {
  envContent = envContent.replace(placeholder, value);
});

// Write .env file
fs.writeFileSync(envPath, envContent);

console.log('✅ Environment file created successfully!');
console.log('📝 Please update the following values in your .env file:');
console.log('   - Firebase configuration');
console.log('   - OpenAI API key');
console.log('   - Database URLs');
console.log('   - Email configuration');
console.log('   - Cloud storage settings\n');

console.log('🔧 Next steps:');
console.log('   1. Update .env with your actual configuration values');
console.log('   2. Run: npm install');
console.log('   3. Run: npm run dev\n');

console.log('🎉 Setup complete!');

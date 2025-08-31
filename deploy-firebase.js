#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Deploying Firebase Rules...');
console.log('============================\n');

// Check if firebase.json exists
const firebaseJsonPath = path.join(__dirname, 'firebase.json');
if (!fs.existsSync(firebaseJsonPath)) {
  console.log('❌ firebase.json not found!');
  process.exit(1);
}

// Check if firestore.rules exists
const rulesPath = path.join(__dirname, 'firestore.rules');
if (!fs.existsSync(rulesPath)) {
  console.log('❌ firestore.rules not found!');
  process.exit(1);
}

try {
  console.log('📝 Deploying Firestore rules...');
  execSync('npx firebase deploy --only firestore:rules', { 
    stdio: 'inherit',
    cwd: __dirname 
  });
  
  console.log('\n✅ Firestore rules deployed successfully!');
  
  console.log('\n📝 Deploying Firestore indexes...');
  execSync('npx firebase deploy --only firestore:indexes', { 
    stdio: 'inherit',
    cwd: __dirname 
  });
  
  console.log('\n✅ Firestore indexes deployed successfully!');
  
  console.log('\n🎉 Firebase deployment complete!');
  console.log('\n📋 Next steps:');
  console.log('1. Make sure your .env.local file has the correct Firebase credentials');
  console.log('2. Restart your development server: npm run dev');
  console.log('3. Try completing your profile again');
  
} catch (error) {
  console.error('\n❌ Deployment failed:', error.message);
  console.log('\n💡 Make sure you:');
  console.log('1. Have created a Firebase project');
  console.log('2. Are logged in to Firebase: npx firebase login');
  console.log('3. Have selected the correct project: npx firebase use <project-id>');
}

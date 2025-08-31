#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 KonvoGrad Firebase Setup');
console.log('============================\n');

// Check if .env.local exists
const envPath = path.join(__dirname, '..', '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found!');
  console.log('Please create a .env.local file with the following variables:\n');
  
  const envTemplate = `# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your_vapid_key_here

# Firebase Admin Configuration
FIREBASE_PROJECT_ID=your_project_id_here
FIREBASE_CLIENT_EMAIL=your_service_account_email@your_project_id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nYour_Private_Key_Here\\n-----END PRIVATE KEY-----"

# Cloudinary Configuration
CLOUDINARY_URL=cloudinary://your_cloud_name:your_api_key:your_api_secret@your_cloud_name
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# LinkedIn OAuth Configuration
NEXT_PUBLIC_LINKEDIN_CLIENT_ID=your_linkedin_client_id_here
NEXT_PUBLIC_LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret_here
NEXT_PUBLIC_LINKEDIN_REDIRECT_URI=http://localhost:3000/api/linkedin/callback

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Clerk Configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key`;

  console.log(envTemplate);
  console.log('\n📝 Instructions:');
  console.log('1. Copy the template above');
  console.log('2. Create a .env.local file in the project root');
  console.log('3. Replace the placeholder values with your actual credentials');
  console.log('4. Run this script again\n');
  process.exit(1);
}

console.log('✅ .env.local file found');

// Check if firestore.rules exists
const rulesPath = path.join(__dirname, '..', 'firestore.rules');
if (!fs.existsSync(rulesPath)) {
  console.log('❌ firestore.rules file not found!');
  console.log('Please ensure the firestore.rules file exists in the project root\n');
  process.exit(1);
}

console.log('✅ firestore.rules file found');

// Check if firebase.json exists
const firebaseJsonPath = path.join(__dirname, '..', 'firebase.json');
if (!fs.existsSync(firebaseJsonPath)) {
  console.log('📝 Creating firebase.json...');
  
  const firebaseJson = {
    "firestore": {
      "rules": "firestore.rules",
      "indexes": "firestore.indexes.json"
    },
    "hosting": {
      "public": "out",
      "ignore": [
        "firebase.json",
        "**/.*",
        "**/node_modules/**"
      ],
      "rewrites": [
        {
          "source": "**",
          "destination": "/index.html"
        }
      ]
    }
  };
  
  fs.writeFileSync(firebaseJsonPath, JSON.stringify(firebaseJson, null, 2));
  console.log('✅ firebase.json created');
} else {
  console.log('✅ firebase.json found');
}

// Check if firestore.indexes.json exists
const indexesPath = path.join(__dirname, '..', 'firestore.indexes.json');
if (!fs.existsSync(indexesPath)) {
  console.log('📝 Creating firestore.indexes.json...');
  
  const indexes = {
    "indexes": [
      {
        "collectionGroup": "users",
        "queryScope": "COLLECTION",
        "fields": [
          {
            "fieldPath": "clerkId",
            "order": "ASCENDING"
          }
        ]
      },
      {
        "collectionGroup": "chatRooms",
        "queryScope": "COLLECTION",
        "fields": [
          {
            "fieldPath": "participants",
            "arrayConfig": "CONTAINS"
          },
          {
            "fieldPath": "updatedAt",
            "order": "DESCENDING"
          }
        ]
      },
      {
        "collectionGroup": "messages",
        "queryScope": "COLLECTION",
        "fields": [
          {
            "fieldPath": "chatRoomId",
            "order": "ASCENDING"
          },
          {
            "fieldPath": "timestamp",
            "order": "DESCENDING"
          }
        ]
      }
    ],
    "fieldOverrides": []
  };
  
  fs.writeFileSync(indexesPath, JSON.stringify(indexes, null, 2));
  console.log('✅ firestore.indexes.json created');
} else {
  console.log('✅ firestore.indexes.json found');
}

console.log('\n🎉 Setup complete!');
console.log('\n📋 Next steps:');
console.log('1. Install Firebase CLI: npm install -g firebase-tools');
console.log('2. Login to Firebase: firebase login');
console.log('3. Initialize Firebase project: firebase init');
console.log('4. Deploy security rules: firebase deploy --only firestore:rules');
console.log('5. Deploy indexes: firebase deploy --only firestore:indexes');
console.log('\n🔧 For Clerk configuration:');
console.log('1. Go to https://clerk.com/dashboard');
console.log('2. Create a new application or use existing one');
console.log('3. Copy the publishable key and secret key to .env.local');
console.log('4. Configure redirect URLs in Clerk dashboard');
console.log('\n🚀 Start development: npm run dev');

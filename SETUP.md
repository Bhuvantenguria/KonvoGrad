# KonvoGrad Setup Guide

This guide will help you set up KonvoGrad with all the necessary configurations to fix the Firebase permissions and Clerk integration issues.

## Prerequisites

- Node.js 18+ installed
- npm or pnpm package manager
- Firebase account
- Clerk account
- Cloudinary account (optional, for file uploads)
- LinkedIn Developer account (optional, for LinkedIn integration)

## Step 1: Environment Configuration

### 1.1 Create Environment File

Create a `.env.local` file in the project root with the following variables:

```bash
# Firebase Configuration
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
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Private_Key_Here\n-----END PRIVATE KEY-----"

# Cloudinary Configuration (Optional)
CLOUDINARY_URL=cloudinary://your_cloud_name:your_api_key:your_api_secret@your_cloud_name
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# LinkedIn OAuth Configuration (Optional)
NEXT_PUBLIC_LINKEDIN_CLIENT_ID=your_linkedin_client_id_here
NEXT_PUBLIC_LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret_here
NEXT_PUBLIC_LINKEDIN_REDIRECT_URI=http://localhost:3000/api/linkedin/callback

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Clerk Configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

### 1.2 Get Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Go to Project Settings > General
4. Scroll down to "Your apps" section
5. Click "Add app" > Web app
6. Copy the configuration values to your `.env.local`

### 1.3 Get Firebase Admin Credentials

1. In Firebase Console, go to Project Settings > Service accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Copy the values to your `.env.local`:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (keep the quotes and \n)

### 1.4 Get Clerk Credentials

1. Go to [Clerk Dashboard](https://clerk.com/dashboard)
2. Create a new application or select existing one
3. Go to API Keys
4. Copy the Publishable Key and Secret Key to your `.env.local`

## Step 2: Firebase Setup

### 2.1 Install Firebase CLI

```bash
npm install -g firebase-tools
```

### 2.2 Login to Firebase

```bash
firebase login
```

### 2.3 Initialize Firebase Project

```bash
firebase init
```

Select the following options:
- Firestore
- Hosting (optional)
- Use existing project
- Select your Firebase project

### 2.4 Deploy Security Rules

The project includes Firebase security rules that fix the permissions issue. Deploy them:

```bash
firebase deploy --only firestore:rules
```

### 2.5 Deploy Indexes

```bash
firebase deploy --only firestore:indexes
```

## Step 3: Clerk Configuration

### 3.1 Configure Redirect URLs

In your Clerk Dashboard:

1. Go to User & Authentication > Email, Phone, Username
2. Add these redirect URLs:
   - `http://localhost:3000/sign-in`
   - `http://localhost:3000/sign-up`
   - `http://localhost:3000/dashboard`

### 3.2 Update Sign-in/Sign-up Pages

The project has been updated to use the new Clerk redirect props. The deprecated `afterSignInUrl` warning should be resolved.

## Step 4: Install Dependencies

```bash
npm install
# or
pnpm install
```

## Step 5: Run the Application

```bash
npm run dev
# or
pnpm dev
```

## Troubleshooting

### Firebase Permissions Error

If you still see "Missing or insufficient permissions":

1. **Check Environment Variables**: Ensure all Firebase variables are set correctly
2. **Deploy Security Rules**: Make sure you've deployed the security rules
3. **Check Firebase Console**: Verify your project is active and billing is set up
4. **Clear Browser Cache**: Clear your browser cache and try again

### Clerk Development Keys Warning

This warning is expected in development mode. It will disappear when you:
1. Use production Clerk keys
2. Deploy to production

### Form Submission Issues

The form submission is working correctly. The "Form submitted!" message indicates success.

## File Structure Changes

The following files have been created/modified to fix the issues:

- `firestore.rules` - Firebase security rules
- `firebase-client-utils.ts` - Client-side Firebase utilities
- `firebase-utils.ts` - Server-side Firebase utilities (updated)
- `use-firebase-user.ts` - Updated to use client utilities
- `use-chat.ts` - Updated to use client utilities
- `setup-firebase.js` - Setup script for Firebase configuration

## Next Steps

1. **Test Authentication**: Try signing up and signing in
2. **Test Firebase Integration**: Check if user data is created in Firebase
3. **Test Chat Functionality**: Try creating chat rooms and sending messages
4. **Deploy to Production**: When ready, deploy with production keys

## Support

If you encounter any issues:

1. Check the browser console for detailed error messages
2. Verify all environment variables are set correctly
3. Ensure Firebase security rules are deployed
4. Check that Clerk is properly configured

The main issues have been resolved:
- ✅ Firebase permissions error fixed with proper security rules
- ✅ Clerk deprecated prop warning resolved
- ✅ Client-side Firebase utilities created for proper authentication
- ✅ Environment configuration guide provided

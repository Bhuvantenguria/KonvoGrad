-- Firebase Firestore Security Rules
-- Copy these rules to your Firebase Console > Firestore Database > Rules

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.clerkId || 
         request.auth.uid == userId);
      allow read: if request.auth != null; // Allow reading other users for matching
    }
    
    // Chat rooms collection
    match /chatRooms/{chatRoomId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in resource.data.participants;
      allow create: if request.auth != null && 
        request.auth.uid in request.resource.data.participants;
    }
    
    // Messages collection
    match /messages/{messageId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.senderId;
      allow update: if request.auth != null;
    }
    
    // Connections collection
    match /connections/{connectionId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.userId1 || 
         request.auth.uid == resource.data.userId2);
      allow create: if request.auth != null && 
        (request.auth.uid == request.resource.data.userId1 || 
         request.auth.uid == request.resource.data.userId2);
    }
    
    // Admin collection (for moderation)
    match /admin/{document=**} {
      allow read, write: if request.auth != null && 
        request.auth.token.admin == true;
    }
  }
}

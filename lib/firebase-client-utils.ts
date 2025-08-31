import {
  collection,
  doc,
  addDoc,
  updateDoc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  type Timestamp,
  type QueryDocumentSnapshot,
} from "firebase/firestore"
import { db } from "./firebase"
import { uploadImage, uploadFile } from "./cloudinary"

// Types
export interface User {
  id: string
  clerkId: string
  email: string
  firstName: string
  lastName: string
  imageUrl?: string
  role: "alumni" | "developer" | "student" | "professional"
  company?: string
  position?: string
  college?: string
  graduationYear?: string
  skills: string[]
  bio?: string
  linkedinUrl?: string
  isVerified: boolean
  isOnline: boolean
  lastSeen: Timestamp
  sessionId: string
  inviteCode: string
  createdAt: Timestamp
  updatedAt: Timestamp
  suspensionReason?: string
  suspendedBy?: string
  suspendedAt?: Timestamp
  unsuspendedBy?: string
  unsuspendedAt?: Timestamp
}

export interface ChatRoom {
  id: string
  type: "direct" | "group"
  participants: string[]
  participantDetails: Record<string, { name: string; imageUrl?: string; isOnline: boolean; role?: string }>
  lastMessage?: {
    text: string
    senderId: string
    timestamp: Timestamp
  }
  createdAt: Timestamp
  updatedAt: Timestamp
  isActive: boolean
  metadata?: {
    topic?: string
    description?: string
  }
}

export interface Message {
  id: string
  chatRoomId: string
  senderId: string
  senderName: string
  text: string
  type: "text" | "image" | "file" | "audio" | "video"
  mediaUrl?: string
  fileName?: string
  fileSize?: number
  timestamp: Timestamp
  isRead: boolean
  readBy: string[]
}

// Client-side user operations (for use in hooks and components)
export async function createUserClient(userData: Partial<User>): Promise<string> {
  try {
    // Clean the data by removing undefined values and providing defaults
    const cleanUserData = {
      clerkId: userData.clerkId || "",
      email: userData.email || "",
      firstName: userData.firstName || "",
      lastName: userData.lastName || "",
      imageUrl: userData.imageUrl || "",
      role: userData.role || "professional",
      company: userData.company || "",
      bio: userData.bio || "",
      linkedinUrl: userData.linkedinUrl || "",
      skills: userData.skills || [],
      isVerified: userData.isVerified || false,
      isOnline: userData.isOnline || true,
      lastSeen: userData.lastSeen || new Date().toISOString(),
      sessionId: userData.sessionId || generateSessionId(),
      inviteCode: userData.inviteCode || generateInviteCode(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    // Filter out any remaining undefined values
    const finalUserData = Object.fromEntries(
      Object.entries(cleanUserData).filter(([_, value]) => value !== undefined)
    );

    const docRef = await addDoc(collection(db, "users"), finalUserData);
    return docRef.id;
  } catch (error) {
    console.error("Error creating user:", error);
    // Provide more helpful error messages
    if (error instanceof Error) {
      if (error.message.includes("permission")) {
        throw new Error("Permission denied. Please check your Firebase security rules.");
      } else if (error.message.includes("network")) {
        throw new Error("Network error. Please check your internet connection.");
      }
    }
    throw error;
  }
}

export const getUserByClerkIdClient = async (clerkId: string): Promise<User | null> => {
  try {
    const q = query(collection(db, "users"), where("clerkId", "==", clerkId))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) return null

    const doc = querySnapshot.docs[0]
    return { id: doc.id, ...doc.data() } as User
  } catch (error) {
    console.error("Error getting user by clerk ID:", error)
    throw error
  }
}

export const getUserClient = async (userId: string): Promise<User | null> => {
  try {
    const docRef = doc(db, "users", userId)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as User
    }
    return null
  } catch (error) {
    console.error("Error getting user:", error)
    throw error
  }
}

export async function updateUserClient(userId: string, updates: Partial<User>): Promise<void> {
  try {
    const docRef = doc(db, "users", userId);
    
    // Clean the updates by removing undefined values and providing defaults
    const cleanUpdates = {
      ...updates,
      updatedAt: serverTimestamp()
    };

    // Filter out any remaining undefined values
    const finalUpdates = Object.fromEntries(
      Object.entries(cleanUpdates).filter(([_, value]) => value !== undefined)
    );

    await updateDoc(docRef, finalUpdates);
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

export const updateUserOnlineStatusClient = async (userId: string, isOnline: boolean): Promise<void> => {
  try {
    await updateUserClient(userId, {
      isOnline,
      lastSeen: serverTimestamp() as any,
    })
  } catch (error) {
    console.error("Error updating user online status:", error)
    throw error
  }
}

export const generateSessionId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export const generateInviteCode = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

// Chat room operations
export const createChatRoomClient = async (
  type: ChatRoom["type"],
  participants: string[],
  participantDetails: ChatRoom["participantDetails"]
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, "chatRooms"), {
      type,
      participants,
      participantDetails,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isActive: true,
    })
    return docRef.id
  } catch (error) {
    console.error("Error creating chat room:", error)
    throw error
  }
}

export const getChatRoomClient = async (chatRoomId: string): Promise<ChatRoom | null> => {
  try {
    const docRef = doc(db, "chatRooms", chatRoomId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as ChatRoom
    }
    return null
  } catch (error) {
    console.error("Error getting chat room:", error)
    throw error
  }
}

export const getUserChatRoomsClient = (userId: string, callback: (chatRooms: ChatRoom[]) => void) => {
  const q = query(
    collection(db, "chatRooms"),
    where("participants", "array-contains", userId),
    where("isActive", "==", true),
    orderBy("updatedAt", "desc")
  )

  return onSnapshot(q, (querySnapshot) => {
    const chatRooms: ChatRoom[] = []
    querySnapshot.forEach((doc) => {
      chatRooms.push({ id: doc.id, ...doc.data() } as ChatRoom)
    })
    callback(chatRooms)
  })
}

export const updateChatRoomClient = async (chatRoomId: string, updates: Partial<ChatRoom>): Promise<void> => {
  try {
    const docRef = doc(db, "chatRooms", chatRoomId)
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error updating chat room:", error)
    throw error
  }
}

// Message operations
export const sendMessageClient = async (
  chatRoomId: string,
  senderId: string,
  senderName: string,
  text: string,
  type: Message["type"] = "text",
  file?: File
): Promise<string> => {
  try {
    let mediaUrl: string | undefined
    let fileName: string | undefined
    let fileSize: number | undefined

    // Handle file uploads to Cloudinary
    if (file && type !== "text") {
      if (type === "image") {
        mediaUrl = await uploadImage(file, "chat-images")
      } else {
        mediaUrl = await uploadFile(file, "chat-files")
        fileName = file.name
        fileSize = file.size
      }
    }

    // Add message to messages collection
    const messageRef = await addDoc(collection(db, "messages"), {
      chatRoomId,
      senderId,
      senderName,
      text,
      type,
      mediaUrl,
      fileName,
      fileSize,
      timestamp: serverTimestamp(),
      isRead: false,
      readBy: [senderId],
    })

    // Update chat room with last message
    await updateDoc(doc(db, "chatRooms", chatRoomId), {
      lastMessage: {
        text,
        senderId,
        timestamp: serverTimestamp(),
      },
      updatedAt: serverTimestamp(),
    })

    return messageRef.id
  } catch (error) {
    console.error("Error sending message:", error)
    throw error
  }
}

export const getChatMessagesClient = (chatRoomId: string, callback: (messages: Message[]) => void, limitCount = 50) => {
  const q = query(
    collection(db, "messages"),
    where("chatRoomId", "==", chatRoomId),
    orderBy("timestamp", "desc"),
    limit(limitCount)
  )

  return onSnapshot(q, (querySnapshot) => {
    const messages: Message[] = []
    querySnapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() } as Message)
    })
    // Sort by timestamp ascending for display
    messages.sort((a, b) => a.timestamp.toMillis() - b.timestamp.toMillis())
    callback(messages)
  })
}

export const markMessagesAsReadClient = async (chatRoomId: string, userId: string): Promise<void> => {
  try {
    const q = query(
      collection(db, "messages"),
      where("chatRoomId", "==", chatRoomId),
      where("senderId", "!=", userId),
      where("isRead", "==", false)
    )

    const querySnapshot = await getDocs(q)
    const updatePromises = querySnapshot.docs.map((doc) => {
      const messageData = doc.data()
      const readBy = messageData.readBy || []
      if (!readBy.includes(userId)) {
        readBy.push(userId)
        return updateDoc(doc.ref, {
          isRead: true,
          readBy,
        })
      }
      return Promise.resolve()
    })

    await Promise.all(updatePromises)
  } catch (error) {
    console.error("Error marking messages as read:", error)
    throw error
  }
}

// Utility functions
export const formatTimestamp = (timestamp: Timestamp): string => {
  if (!timestamp) return ""
  const date = timestamp.toDate()
  const now = new Date()
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  
  if (diffInHours < 1) return "Just now"
  if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`
  if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
  return date.toLocaleDateString()
}

// Matching functions
export interface MatchingQueue {
  userId: string
  userDetails: {
    name: string
    imageUrl?: string
    role?: string
  }
  preferences: {
    roles: string[]
    skipPreviousMatches: boolean
  }
  status: "searching" | "matched" | "cancelled"
  chatRoomId?: string
  joinedAt: Timestamp
  updatedAt: Timestamp
}

export const joinMatchingQueueClient = async (userId: string, userDetails: any, preferences: any): Promise<void> => {
  try {
    const docRef = doc(db, "matchingQueue", userId)
    await setDoc(docRef, {
      userId,
      userDetails,
      preferences,
      status: "searching",
      joinedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }, { merge: true })
  } catch (error) {
    console.error("Error joining matching queue:", error)
    throw error
  }
}

export const leaveMatchingQueueClient = async (userId: string): Promise<void> => {
  try {
    const docRef = doc(db, "matchingQueue", userId)
    await setDoc(docRef, {
      status: "cancelled",
      updatedAt: serverTimestamp(),
    }, { merge: true })
  } catch (error) {
    console.error("Error leaving matching queue:", error)
    throw error
  }
}

export const findRandomMatchClient = async (userId: string, preferences: any): Promise<any | null> => {
  try {
    // Simplified query to avoid composite index requirement
    const q = query(
      collection(db, "matchingQueue"),
      where("status", "==", "searching")
    )
    const querySnapshot = await getDocs(q)
    
    if (querySnapshot.empty) return null
    
    // Filter out the current user after fetching
    const availableUsers = querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(user => user.userId !== userId)
    
    if (availableUsers.length === 0) return null
    
    const randomIndex = Math.floor(Math.random() * availableUsers.length)
    return availableUsers[randomIndex]
  } catch (error) {
    console.error("Error finding random match:", error)
    throw error
  }
}

export const createMatchAndChatRoomClient = async (
  userId1: string,
  userId2: string,
  user1Details: any,
  user2Details: any
): Promise<string> => {
  try {
    // Create chat room
    const participantDetails = {
      [userId1]: {
        name: user1Details.name,
        imageUrl: user1Details.imageUrl,
        isOnline: true,
        role: user1Details.role,
      },
      [userId2]: {
        name: user2Details.name,
        imageUrl: user2Details.imageUrl,
        isOnline: true,
        role: user2Details.role,
      },
    }
    
    const chatRoomId = await createChatRoomClient("direct", [userId1, userId2], participantDetails)
    
    // Remove both users from matching queue
    await leaveMatchingQueueClient(userId1)
    await leaveMatchingQueueClient(userId2)
    
    return chatRoomId
  } catch (error) {
    console.error("Error creating match and chat room:", error)
    throw error
  }
}

export const getMatchingQueueStatusClient = (userId: string, callback: (status: MatchingQueue | null) => void) => {
  const docRef = doc(db, "matchingQueue", userId)
  
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback({ id: docSnap.id, ...docSnap.data() } as MatchingQueue)
    } else {
      callback(null)
    }
  })
}

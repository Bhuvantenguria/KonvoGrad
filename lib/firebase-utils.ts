import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteField,
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
  type QuerySnapshot,
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
  role: "alumni" | "developer" | "student" | "professional" | "admin"
  company?: string
  position?: string
  college?: string
  graduationYear?: string
  skills: string[]
  bio?: string
  linkedinUrl?: string
  isVerified: boolean
  isOnline: boolean
  lastSeen: Timestamp | Date | any
  sessionId: string
  inviteCode: string
  createdAt: Timestamp | Date | any
  updatedAt: Timestamp | Date | any
  suspensionReason?: string
  suspendedBy?: string
  suspendedAt?: Timestamp | Date | any
  unsuspendedBy?: string
  unsuspendedAt?: Timestamp | Date | any
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

export interface Connection {
  id: string
  userId1: string
  userId2: string
  status: "pending" | "accepted" | "rejected"
  createdAt: Timestamp
  updatedAt: Timestamp
  message?: string
}

export interface Match {
  id: string
  userId1: string
  userId2: string
  score: number
  status: "pending" | "accepted" | "rejected"
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface AdminStats {
  totalUsers: number
  activeUsers: number
  totalChatRooms: number
  activeChatRooms: number
  totalMessages: number
  totalMatches: number
}

export interface UserReport {
  id: string
  reportedUserId: string
  reportedBy: string
  reason: string
  description: string
  status: "pending" | "resolved" | "dismissed"
  createdAt: any
  updatedAt: any
  resolvedBy?: string
  resolvedAt?: any
}

// User operations
export const createUser = async (userData: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

export const getUserByClerkId = async (clerkId: string): Promise<User | null> => {
  try {
    const q = query(collection(db, "users"), where("clerkId", "==", clerkId))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) return null

    const userDoc = querySnapshot.docs[0]
    return { id: userDoc.id, ...userDoc.data() } as User
  } catch (error) {
    console.error("Error getting user by clerk ID:", error)
    throw error
  }
}

export const getUser = async (userId: string): Promise<User | null> => {
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

export const updateUser = async (userId: string, updates: Partial<User>): Promise<void> => {
  try {
    const docRef = doc(db, "users", userId)
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error updating user:", error)
    throw error
  }
}

export const updateUserOnlineStatus = async (userId: string, isOnline: boolean): Promise<void> => {
  try {
    await updateUser(userId, {
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

// Admin functions
export const getAllUsers = async (limitCount = 200): Promise<User[]> => {
  try {
    const q = query(collection(db, "users"), limit(limitCount))
    const snapshot = await getDocs(q)
    const users: User[] = []
    snapshot.forEach((d: QueryDocumentSnapshot) => {
      users.push({ id: d.id, ...(d.data() as Omit<User, "id">) })
    })
    return users
  } catch (error) {
    console.error("Error getting all users:", error)
    return []
  }
}

export const getAdminStats = async (): Promise<AdminStats> => {
  try {
    const [usersSnap, chatRoomsSnap, messagesSnap, matchesSnap] = await Promise.all([
      getDocs(collection(db, "users")),
      getDocs(collection(db, "chatRooms")),
      getDocs(collection(db, "messages")),
      getDocs(collection(db, "matches")).catch(() => ({ size: 0 })),
    ])

    let activeUsers = 0
    usersSnap.forEach((d: QueryDocumentSnapshot) => {
      const data = d.data() as User
      if (data.isOnline) activeUsers++
    })

    let activeChatRooms = 0
    chatRoomsSnap.forEach((d: QueryDocumentSnapshot) => {
      const data = d.data() as ChatRoom
      if (data.isActive) activeChatRooms++
    })

    return {
      totalUsers: usersSnap.size,
      activeUsers,
      totalChatRooms: chatRoomsSnap.size,
      activeChatRooms,
      totalMessages: messagesSnap.size,
      totalMatches: (matchesSnap as any)?.size || 0,
    }
  } catch (error) {
    console.error("Error getting admin stats:", error)
    return {
      totalUsers: 0,
      activeUsers: 0,
      totalChatRooms: 0,
      activeChatRooms: 0,
      totalMessages: 0,
      totalMatches: 0,
    }
  }
}

export const getAllReports = async (): Promise<UserReport[]> => {
  try {
    const snapshot = await getDocs(collection(db, "reports"))
    const reports: UserReport[] = []
    snapshot.forEach((d: QueryDocumentSnapshot) => {
      reports.push({ id: d.id, ...(d.data() as Omit<UserReport, "id">) })
    })
    return reports
  } catch (error) {
    console.error("Error getting all reports:", error)
    return []
  }
}

export const suspendUser = async (userId: string, reason: string, suspendedBy: string): Promise<void> => {
  try {
    await updateUser(userId, {
      suspensionReason: reason,
      suspendedBy,
      suspendedAt: serverTimestamp() as any,
      isVerified: false,
    })
  } catch (error) {
    console.error("Error suspending user:", error)
    throw error
  }
}

export const unsuspendUser = async (userId: string, unsuspendedBy: string): Promise<void> => {
  try {
    const docRef = doc(db, "users", userId)
    await updateDoc(docRef, {
      suspensionReason: deleteField(),
      suspendedBy: deleteField(),
      suspendedAt: deleteField(),
      unsuspendedBy,
      unsuspendedAt: serverTimestamp() as any,
      isVerified: true,
    })
  } catch (error) {
    console.error("Error unsuspending user:", error)
    throw error
  }
}

export const updateReportStatus = async (reportId: string, status: string, updatedBy?: string): Promise<void> => {
  try {
    const docRef = doc(db, "reports", reportId)
    await updateDoc(docRef, {
      status,
      updatedBy: updatedBy || null,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error updating report status:", error)
    throw error
  }
}

// Matching functions
export const joinMatchingQueue = async (userId: string, userPreferences: any): Promise<void> => {
  try {
    const docRef = doc(db, "matchingQueue", userId)
    await updateDoc(docRef, {
      userId,
      preferences: userPreferences,
      joinedAt: serverTimestamp(),
      isActive: true,
    })
  } catch (error) {
    console.error("Error joining matching queue:", error)
    throw error
  }
}

export const leaveMatchingQueue = async (userId: string): Promise<void> => {
  try {
    const docRef = doc(db, "matchingQueue", userId)
    await updateDoc(docRef, {
      isActive: false,
      leftAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error leaving matching queue:", error)
    throw error
  }
}

export const findRandomMatch = async (userId: string, preferences: any): Promise<string | null> => {
  try {
    const q = query(
      collection(db, "matchingQueue"),
      where("isActive", "==", true),
      where("userId", "!=", userId)
    )
    const querySnapshot = await getDocs(q)
    
    if (querySnapshot.empty) return null
    
    const availableUsers = querySnapshot.docs
      .map((d: QueryDocumentSnapshot) => ({ id: d.id, ...d.data() }))
      .filter((user: any) => user.isActive && user.userId !== userId)
    
    if (availableUsers.length === 0) return null
    
    const randomIndex = Math.floor(Math.random() * availableUsers.length)
    return availableUsers[randomIndex].userId
  } catch (error) {
    console.error("Error finding random match:", error)
    throw error
  }
}

export const createMatchAndChatRoom = async (
  userId1: string,
  userId2: string,
  user1Details: any,
  user2Details: any
): Promise<string> => {
  try {
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
    
    const chatRoomId = await createChatRoom("direct", [userId1, userId2], participantDetails)
    
    await leaveMatchingQueue(userId1)
    await leaveMatchingQueue(userId2)
    
    return chatRoomId
  } catch (error) {
    console.error("Error creating match and chat room:", error)
    throw error
  }
}

// Chat room operations
export const createChatRoom = async (
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

export const getChatRoom = async (chatRoomId: string): Promise<ChatRoom | null> => {
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

export const getUserChatRooms = (userId: string, callback: (chatRooms: ChatRoom[]) => void) => {
  const q = query(
    collection(db, "chatRooms"),
    where("participants", "array-contains", userId),
    where("isActive", "==", true),
    orderBy("updatedAt", "desc")
  )

  return onSnapshot(q, (querySnapshot: QuerySnapshot) => {
    const chatRooms: ChatRoom[] = []
    querySnapshot.forEach((d: QueryDocumentSnapshot) => {
      chatRooms.push({ id: d.id, ...d.data() } as ChatRoom)
    })
    callback(chatRooms)
  })
}

export const updateChatRoom = async (chatRoomId: string, updates: Partial<ChatRoom>): Promise<void> => {
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
export const sendMessage = async (
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

    if (file && type !== "text") {
      if (type === "image") {
        mediaUrl = await uploadImage(file, "chat-images")
      } else {
        mediaUrl = await uploadFile(file, "chat-files")
        fileName = file.name
        fileSize = file.size
      }
    }

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

    await updateDoc(doc(db, "chatRooms", chatRoomId), {
      lastMessage: {
        text,
        senderId,
        timestamp: serverTimestamp(),
      },
      updatedAt: serverTimestamp(),
    })

    const chatRoom = await getChatRoom(chatRoomId)
    if (chatRoom) {
      const otherParticipants = chatRoom.participants.filter((id) => id !== senderId)
      const { notifyNewMessage } = await import("./notifications")
      for (const participantId of otherParticipants) {
        await notifyNewMessage(participantId, senderName, chatRoomId)
      }
    }

    return messageRef.id
  } catch (error) {
    console.error("Error sending message:", error)
    throw error
  }
}

export const getChatMessages = (chatRoomId: string, callback: (messages: Message[]) => void, limitCount = 50) => {
  const q = query(
    collection(db, "messages"),
    where("chatRoomId", "==", chatRoomId),
    orderBy("timestamp", "desc"),
    limit(limitCount)
  )

  return onSnapshot(q, (querySnapshot: QuerySnapshot) => {
    const messages: Message[] = []
    querySnapshot.forEach((d: QueryDocumentSnapshot) => {
      messages.push({ id: d.id, ...d.data() } as Message)
    })
    messages.sort((a, b) => a.timestamp?.toMillis?.() - b.timestamp?.toMillis?.())
    callback(messages)
  })
}

export const markMessagesAsRead = async (chatRoomId: string, userId: string): Promise<void> => {
  try {
    const q = query(
      collection(db, "messages"),
      where("chatRoomId", "==", chatRoomId),
      where("isRead", "==", false)
    )

    const querySnapshot = await getDocs(q)
    const updatePromises = querySnapshot.docs.map((d: QueryDocumentSnapshot) => {
      const messageData = d.data() as Message
      if (messageData.senderId !== userId) {
        const readBy = messageData.readBy || []
        if (!readBy.includes(userId)) {
          readBy.push(userId)
          return updateDoc(d.ref, {
            isRead: true,
            readBy,
          })
        }
      }
      return Promise.resolve()
    })

    await Promise.all(updatePromises)
  } catch (error) {
    console.error("Error marking messages as read:", error)
    throw error
  }
}

// Connection operations
export const createConnection = async (
  userId1: string,
  userId2: string,
  message?: string
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, "connections"), {
      userId1,
      userId2,
      status: "pending",
      message,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error creating connection:", error)
    throw error
  }
}

export const updateConnectionStatus = async (
  connectionId: string,
  status: Connection["status"]
): Promise<void> => {
  try {
    await updateDoc(doc(db, "connections", connectionId), {
      status,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error updating connection status:", error)
    throw error
  }
}

export const getUserConnections = async (userId: string): Promise<Connection[]> => {
  try {
    const q1 = query(
      collection(db, "connections"),
      where("userId1", "==", userId),
      where("status", "==", "accepted")
    )
    const q2 = query(
      collection(db, "connections"),
      where("userId2", "==", userId),
      where("status", "==", "accepted")
    )
    const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)])

    const connections: Connection[] = []
    const seen = new Set<string>()

    snap1.forEach((d: QueryDocumentSnapshot) => {
      seen.add(d.id)
      connections.push({ id: d.id, ...d.data() } as Connection)
    })

    snap2.forEach((d: QueryDocumentSnapshot) => {
      if (!seen.has(d.id)) {
        seen.add(d.id)
        connections.push({ id: d.id, ...d.data() } as Connection)
      }
    })

    return connections
  } catch (error) {
    console.error("Error getting user connections:", error)
    throw error
  }
}

// Match operations
export const createMatch = async (
  userId1: string,
  userId2: string,
  score: number
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, "matches"), {
      userId1,
      userId2,
      score,
      status: "pending",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error creating match:", error)
    throw error
  }
}

export const updateMatchStatus = async (
  matchId: string,
  status: Match["status"]
): Promise<void> => {
  try {
    await updateDoc(doc(db, "matches", matchId), {
      status,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error updating match status:", error)
    throw error
  }
}

// Search and discovery
export const searchUsers = async (
  searchTerm: string,
  currentUserId: string,
  limitCount = 20
): Promise<User[]> => {
  try {
    const q = query(
      collection(db, "users"),
      limit(limitCount)
    )

    const querySnapshot = await getDocs(q)
    const users: User[] = []
    
    querySnapshot.forEach((d: QueryDocumentSnapshot) => {
      const userData = d.data() as User
      if (d.id !== currentUserId) {
        const searchableText = `${userData.firstName || ""} ${userData.lastName || ""} ${(userData.skills || []).join(" ")} ${userData.company || ""}`.toLowerCase()
        if (searchableText.includes(searchTerm.toLowerCase())) {
          users.push({ ...userData, id: d.id })
        }
      }
    })

    return users
  } catch (error) {
    console.error("Error searching users:", error)
    throw error
  }
}

// Utility functions
export const formatTimestamp = (timestamp: Timestamp): string => {
  if (!timestamp) return ""
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  const now = new Date()
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  
  if (diffInHours < 1) return "Just now"
  if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`
  if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
  return date.toLocaleDateString()
}

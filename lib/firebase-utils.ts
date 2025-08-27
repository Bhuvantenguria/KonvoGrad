import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore"
import { db } from "./firebase"

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
  type: "random" | "friend" | "video"
  participants: string[]
  participantDetails: {
    [userId: string]: {
      name: string
      imageUrl?: string
      role: string
    }
  }
  isActive: boolean
  lastMessage?: {
    text: string
    senderId: string
    timestamp: Timestamp
  }
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface Message {
  id: string
  chatRoomId: string
  senderId: string
  senderName: string
  text: string
  type: "text" | "image" | "file" | "system"
  timestamp: Timestamp
  isRead: boolean
  reactions?: {
    [userId: string]: string
  }
}

export interface Connection {
  id: string
  userId1: string
  userId2: string
  status: "pending" | "accepted" | "blocked"
  initiatedBy: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

// Matching system types
export interface MatchingQueue {
  id: string
  userId: string
  userDetails: {
    name: string
    role: string
    imageUrl?: string
    skills: string[]
    company?: string
  }
  preferences: {
    roles: string[]
    skipPreviousMatches: boolean
  }
  status: "waiting" | "matched" | "cancelled"
  createdAt: Timestamp
  matchedWith?: string
  chatRoomId?: string
}

export interface MatchHistory {
  id: string
  userId1: string
  userId2: string
  chatRoomId: string
  duration: number // in seconds
  rating?: number
  createdAt: Timestamp
  endedAt?: Timestamp
}

// Admin-specific types
export interface AdminStats {
  totalUsers: number
  activeUsers: number
  totalChatRooms: number
  activeChatRooms: number
  totalMessages: number
  totalMatches: number
  reportedUsers: number
  blockedUsers: number
}

export interface UserReport {
  id: string
  reportedUserId: string
  reportedBy: string
  reason: string
  description: string
  status: "pending" | "reviewed" | "resolved" | "dismissed"
  chatRoomId?: string
  messageId?: string
  createdAt: Timestamp
  reviewedAt?: Timestamp
  reviewedBy?: string
}

// User operations
export const createUser = async (userData: Omit<User, "id" | "createdAt" | "updatedAt">) => {
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

    if (querySnapshot.empty) {
      return null
    }

    const doc = querySnapshot.docs[0]
    return { id: doc.id, ...doc.data() } as User
  } catch (error) {
    console.error("Error getting user by Clerk ID:", error)
    throw error
  }
}

export const updateUser = async (userId: string, updates: Partial<User>) => {
  try {
    await updateDoc(doc(db, "users", userId), {
      ...updates,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error updating user:", error)
    throw error
  }
}

export const updateUserOnlineStatus = async (userId: string, isOnline: boolean) => {
  try {
    await updateDoc(doc(db, "users", userId), {
      isOnline,
      lastSeen: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error updating user online status:", error)
    throw error
  }
}

// Chat room operations
export const createChatRoom = async (
  type: ChatRoom["type"],
  participants: string[],
  participantDetails: ChatRoom["participantDetails"],
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, "chatRooms"), {
      type,
      participants,
      participantDetails,
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
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
    orderBy("updatedAt", "desc"),
  )

  return onSnapshot(q, (querySnapshot) => {
    const chatRooms: ChatRoom[] = []
    querySnapshot.forEach((doc) => {
      chatRooms.push({ id: doc.id, ...doc.data() } as ChatRoom)
    })
    callback(chatRooms)
  })
}

export const updateChatRoom = async (chatRoomId: string, updates: Partial<ChatRoom>) => {
  try {
    await updateDoc(doc(db, "chatRooms", chatRoomId), {
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
): Promise<string> => {
  try {
    // Add message to messages collection
    const messageRef = await addDoc(collection(db, "messages"), {
      chatRoomId,
      senderId,
      senderName,
      text,
      type,
      timestamp: serverTimestamp(),
      isRead: false,
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

    const chatRoom = await getChatRoom(chatRoomId)
    if (chatRoom) {
      const otherParticipants = chatRoom.participants.filter((id) => id !== senderId)

      // Import notification function dynamically to avoid circular imports
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
    limit(limitCount),
  )

  return onSnapshot(q, (querySnapshot) => {
    const messages: Message[] = []
    querySnapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() } as Message)
    })
    // Reverse to show oldest first
    callback(messages.reverse())
  })
}

export const markMessagesAsRead = async (chatRoomId: string, userId: string) => {
  try {
    const q = query(
      collection(db, "messages"),
      where("chatRoomId", "==", chatRoomId),
      where("senderId", "!=", userId),
      where("isRead", "==", false),
    )

    const querySnapshot = await getDocs(q)
    const batch = querySnapshot.docs.map((doc) => updateDoc(doc.ref, { isRead: true }))

    await Promise.all(batch)
  } catch (error) {
    console.error("Error marking messages as read:", error)
    throw error
  }
}

// Connection operations
export const createConnection = async (userId1: string, userId2: string, initiatedBy: string): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, "connections"), {
      userId1,
      userId2,
      status: "pending",
      initiatedBy,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error creating connection:", error)
    throw error
  }
}

export const updateConnectionStatus = async (connectionId: string, status: Connection["status"]) => {
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
    const q1 = query(collection(db, "connections"), where("userId1", "==", userId), where("status", "==", "accepted"))
    const q2 = query(collection(db, "connections"), where("userId2", "==", userId), where("status", "==", "accepted"))

    const [snapshot1, snapshot2] = await Promise.all([getDocs(q1), getDocs(q2)])

    const connections: Connection[] = []
    snapshot1.forEach((doc) => {
      connections.push({ id: doc.id, ...doc.data() } as Connection)
    })
    snapshot2.forEach((doc) => {
      connections.push({ id: doc.id, ...doc.data() } as Connection)
    })

    return connections
  } catch (error) {
    console.error("Error getting user connections:", error)
    throw error
  }
}

// Matching queue operations
export const joinMatchingQueue = async (
  userId: string,
  userDetails: MatchingQueue["userDetails"],
  preferences: MatchingQueue["preferences"] = {
    roles: [],
    skipPreviousMatches: true,
  },
): Promise<string> => {
  try {
    // Remove user from queue if already exists
    await leaveMatchingQueue(userId)

    const docRef = await addDoc(collection(db, "matchingQueue"), {
      userId,
      userDetails,
      preferences,
      status: "waiting",
      createdAt: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error joining matching queue:", error)
    throw error
  }
}

export const leaveMatchingQueue = async (userId: string) => {
  try {
    const q = query(collection(db, "matchingQueue"), where("userId", "==", userId), where("status", "==", "waiting"))
    const querySnapshot = await getDocs(q)

    const batch = querySnapshot.docs.map((doc) => updateDoc(doc.ref, { status: "cancelled" }))

    await Promise.all(batch)
  } catch (error) {
    console.error("Error leaving matching queue:", error)
    throw error
  }
}

export const findRandomMatch = async (
  currentUserId: string,
  preferences: MatchingQueue["preferences"],
): Promise<MatchingQueue | null> => {
  try {
    // Get previous matches to potentially skip
    const previousMatches = preferences.skipPreviousMatches ? await getPreviousMatches(currentUserId) : []

    // Build query for available matches
    const q = query(
      collection(db, "matchingQueue"),
      where("status", "==", "waiting"),
      where("userId", "!=", currentUserId),
      orderBy("createdAt", "asc"),
      limit(20),
    )

    const querySnapshot = await getDocs(q)
    const availableMatches: MatchingQueue[] = []

    querySnapshot.forEach((doc) => {
      const match = { id: doc.id, ...doc.data() } as MatchingQueue

      // Filter by role preferences if specified
      if (preferences.roles.length > 0 && !preferences.roles.includes(match.userDetails.role)) {
        return
      }

      // Skip previous matches if preference is set
      if (preferences.skipPreviousMatches && previousMatches.includes(match.userId)) {
        return
      }

      availableMatches.push(match)
    })

    if (availableMatches.length === 0) {
      return null
    }

    // Return the first available match (oldest in queue)
    return availableMatches[0]
  } catch (error) {
    console.error("Error finding random match:", error)
    throw error
  }
}

export const createMatchAndChatRoom = async (
  user1Id: string,
  user2Id: string,
  user1Details: MatchingQueue["userDetails"],
  user2Details: MatchingQueue["userDetails"],
): Promise<string> => {
  try {
    // Create chat room
    const chatRoomId = await createChatRoom("random", [user1Id, user2Id], {
      [user1Id]: user1Details,
      [user2Id]: user2Details,
    })

    // Update matching queue entries
    const q1 = query(collection(db, "matchingQueue"), where("userId", "==", user1Id), where("status", "==", "waiting"))
    const q2 = query(collection(db, "matchingQueue"), where("userId", "==", user2Id), where("status", "==", "waiting"))

    const [snapshot1, snapshot2] = await Promise.all([getDocs(q1), getDocs(q2)])

    const updates = []
    snapshot1.forEach((doc) => {
      updates.push(
        updateDoc(doc.ref, {
          status: "matched",
          matchedWith: user2Id,
          chatRoomId,
        }),
      )
    })
    snapshot2.forEach((doc) => {
      updates.push(
        updateDoc(doc.ref, {
          status: "matched",
          matchedWith: user1Id,
          chatRoomId,
        }),
      )
    })

    await Promise.all(updates)

    // Add system message to chat room
    await sendMessage(
      chatRoomId,
      "system",
      "System",
      "You've been matched! Start the conversation and get to know each other.",
      "system",
    )

    // Record match history
    await addDoc(collection(db, "matchHistory"), {
      userId1: user1Id,
      userId2: user2Id,
      chatRoomId,
      duration: 0,
      createdAt: serverTimestamp(),
    })

    const { notifyNewMatch } = await import("./notifications")
    await Promise.all([
      notifyNewMatch(user1Id, user2Details.name, chatRoomId),
      notifyNewMatch(user2Id, user1Details.name, chatRoomId),
    ])

    return chatRoomId
  } catch (error) {
    console.error("Error creating match and chat room:", error)
    throw error
  }
}

export const getPreviousMatches = async (userId: string): Promise<string[]> => {
  try {
    const q1 = query(collection(db, "matchHistory"), where("userId1", "==", userId))
    const q2 = query(collection(db, "matchHistory"), where("userId2", "==", userId))

    const [snapshot1, snapshot2] = await Promise.all([getDocs(q1), getDocs(q2)])

    const previousMatches: string[] = []
    snapshot1.forEach((doc) => {
      const data = doc.data()
      previousMatches.push(data.userId2)
    })
    snapshot2.forEach((doc) => {
      const data = doc.data()
      previousMatches.push(data.userId1)
    })

    return previousMatches
  } catch (error) {
    console.error("Error getting previous matches:", error)
    return []
  }
}

export const getMatchingQueueStatus = (userId: string, callback: (status: MatchingQueue | null) => void) => {
  const q = query(
    collection(db, "matchingQueue"),
    where("userId", "==", userId),
    where("status", "in", ["waiting", "matched"]),
    orderBy("createdAt", "desc"),
    limit(1),
  )

  return onSnapshot(q, (querySnapshot) => {
    if (querySnapshot.empty) {
      callback(null)
      return
    }

    const doc = querySnapshot.docs[0]
    callback({ id: doc.id, ...doc.data() } as MatchingQueue)
  })
}

// Admin functions for user management and moderation
export const getAllUsers = async (limitCount = 100): Promise<User[]> => {
  try {
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"), limit(limitCount))
    const querySnapshot = await getDocs(q)

    const users: User[] = []
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() } as User)
    })

    return users
  } catch (error) {
    console.error("Error getting all users:", error)
    throw error
  }
}

export const getAdminStats = async (): Promise<AdminStats> => {
  try {
    const [usersSnapshot, chatRoomsSnapshot, messagesSnapshot, matchHistorySnapshot] = await Promise.all([
      getDocs(collection(db, "users")),
      getDocs(collection(db, "chatRooms")),
      getDocs(collection(db, "messages")),
      getDocs(collection(db, "matchHistory")),
    ])

    const users = usersSnapshot.docs.map((doc) => doc.data() as User)
    const chatRooms = chatRoomsSnapshot.docs.map((doc) => doc.data() as ChatRoom)

    const activeUsers = users.filter((user) => user.isOnline).length
    const activeChatRooms = chatRooms.filter((room) => room.isActive).length

    return {
      totalUsers: users.length,
      activeUsers,
      totalChatRooms: chatRooms.length,
      activeChatRooms,
      totalMessages: messagesSnapshot.size,
      totalMatches: matchHistorySnapshot.size,
      reportedUsers: 0, // Will be implemented with reports
      blockedUsers: users.filter((user) => user.isVerified === false).length,
    }
  } catch (error) {
    console.error("Error getting admin stats:", error)
    throw error
  }
}

export const suspendUser = async (userId: string, reason: string, adminId: string) => {
  try {
    await updateDoc(doc(db, "users", userId), {
      isVerified: false,
      suspensionReason: reason,
      suspendedBy: adminId,
      suspendedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error suspending user:", error)
    throw error
  }
}

export const unsuspendUser = async (userId: string, adminId: string) => {
  try {
    await updateDoc(doc(db, "users", userId), {
      isVerified: true,
      suspensionReason: null,
      suspendedBy: null,
      suspendedAt: null,
      unsuspendedBy: adminId,
      unsuspendedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error unsuspending user:", error)
    throw error
  }
}

export const createUserReport = async (
  reportedUserId: string,
  reportedBy: string,
  reason: string,
  description: string,
  chatRoomId?: string,
  messageId?: string,
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, "userReports"), {
      reportedUserId,
      reportedBy,
      reason,
      description,
      status: "pending",
      chatRoomId,
      messageId,
      createdAt: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error creating user report:", error)
    throw error
  }
}

export const getAllReports = async (): Promise<UserReport[]> => {
  try {
    const q = query(collection(db, "userReports"), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    const reports: UserReport[] = []
    querySnapshot.forEach((doc) => {
      reports.push({ id: doc.id, ...doc.data() } as UserReport)
    })

    return reports
  } catch (error) {
    console.error("Error getting all reports:", error)
    throw error
  }
}

export const updateReportStatus = async (reportId: string, status: UserReport["status"], adminId: string) => {
  try {
    await updateDoc(doc(db, "userReports", reportId), {
      status,
      reviewedBy: adminId,
      reviewedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error updating report status:", error)
    throw error
  }
}

// Utility functions
export const generateSessionId = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export const generateInviteCode = (): string => {
  return Math.random().toString(36).substring(2, 10).toUpperCase()
}

export const getUserByInviteCode = async (inviteCode: string): Promise<User | null> => {
  try {
    const q = query(collection(db, "users"), where("inviteCode", "==", inviteCode))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      return null
    }

    const doc = querySnapshot.docs[0]
    return { id: doc.id, ...doc.data() } as User
  } catch (error) {
    console.error("Error getting user by invite code:", error)
    throw error
  }
}

import { getFCMToken, onForegroundMessage } from "./firebase-messaging"
import { addDoc, collection, updateDoc, doc, query, where, getDocs } from "firebase/firestore"
import { db } from "./firebase"

// Types
export interface NotificationData {
  id: string
  userId: string
  title: string
  body: string
  type: "message" | "match" | "connection" | "system"
  data?: {
    chatRoomId?: string
    senderId?: string
    matchId?: string
  }
  isRead: boolean
  createdAt: any
}

export interface NotificationSettings {
  userId: string
  enablePush: boolean
  enableEmail: boolean
  enableInApp: boolean
  quietHours: {
    enabled: boolean
    start: string // "22:00"
    end: string // "08:00"
  }
}

// Request notification permission and get FCM token
export async function requestNotificationPermission(userId: string): Promise<string | null> {
  try {
    // Check if notifications are supported
    if (!("Notification" in window)) {
      return null;
    }

    // Request permission
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      return null;
    }

    // Get FCM token
    const token = await getFCMToken();
    if (token) {
      // Save token to user's document
      await saveNotificationToken(userId, token);
      return token;
    }
    return null;
  } catch (error) {
    console.error("Error getting notification permission:", error);
    return null;
  }
}

// Save FCM token to user document
export const saveNotificationToken = async (userId: string, token: string): Promise<void> => {
  try {
    // Check if user already has a token document
    const tokenQuery = query(
      collection(db, "notificationTokens"),
      where("userId", "==", userId)
    )
    const tokenDocs = await getDocs(tokenQuery)

    if (tokenDocs.empty) {
      // Create new token document
      await addDoc(collection(db, "notificationTokens"), {
        userId,
        token,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    } else {
      // Update existing token document
      const tokenDoc = tokenDocs.docs[0]
      await updateDoc(doc(db, "notificationTokens", tokenDoc.id), {
        token,
        updatedAt: new Date(),
      })
    }
  } catch (error) {
    console.error("Error saving notification token:", error)
    throw error
  }
}

// Get notification settings
export const getNotificationSettings = async (userId: string): Promise<NotificationSettings | null> => {
  try {
    const settingsQuery = query(
      collection(db, "notificationSettings"),
      where("userId", "==", userId)
    )
    const settingsDocs = await getDocs(settingsQuery)

    if (settingsDocs.empty) {
      // Create default settings
      const defaultSettings: NotificationSettings = {
        userId,
        enablePush: true,
        enableEmail: false,
        enableInApp: true,
        quietHours: {
          enabled: false,
          start: "22:00",
          end: "08:00",
        },
      }

      const docRef = await addDoc(collection(db, "notificationSettings"), defaultSettings)
      return { ...defaultSettings, id: docRef.id }
    }

    const settingsDoc = settingsDocs.docs[0]
    return { id: settingsDoc.id, ...settingsDoc.data() } as NotificationSettings
  } catch (error) {
    console.error("Error getting notification settings:", error)
    return null
  }
}

// Update notification settings
export const updateNotificationSettings = async (
  userId: string,
  updates: Partial<Omit<NotificationSettings, "userId">>
): Promise<void> => {
  try {
    const settingsQuery = query(
      collection(db, "notificationSettings"),
      where("userId", "==", userId)
    )
    const settingsDocs = await getDocs(settingsQuery)

    if (settingsDocs.empty) {
      throw new Error("Notification settings not found")
    }

    const settingsDoc = settingsDocs.docs[0]
    await updateDoc(doc(db, "notificationSettings", settingsDoc.id), {
      ...updates,
      updatedAt: new Date(),
    })
  } catch (error) {
    console.error("Error updating notification settings:", error)
    throw error
  }
}

// Mark notification as read
export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  try {
    await updateDoc(doc(db, "notifications", notificationId), {
      isRead: true,
      readAt: new Date(),
    })
  } catch (error) {
    console.error("Error marking notification as read:", error)
    throw error
  }
}

// Create notification
export const createNotification = async (
  userId: string,
  title: string,
  body: string,
  type: NotificationData["type"],
  data?: NotificationData["data"]
): Promise<string> => {
  try {
    const notificationData: Omit<NotificationData, "id"> = {
      userId,
      title,
      body,
      type,
      data,
      isRead: false,
      createdAt: new Date(),
    }

    const docRef = await addDoc(collection(db, "notifications"), notificationData)
    return docRef.id
  } catch (error) {
    console.error("Error creating notification:", error)
    throw error
  }
}

// Notify new message
export const notifyNewMessage = async (
  userId: string,
  senderName: string,
  chatRoomId: string
): Promise<void> => {
  try {
    await createNotification(
      userId,
      "New Message",
      `${senderName} sent you a message`,
      "message",
      { chatRoomId, senderId: userId }
    )
  } catch (error) {
    console.error("Error notifying new message:", error)
  }
}

// Notify new match
export const notifyNewMatch = async (
  userId: string,
  matchedUserName: string,
  matchId: string
): Promise<void> => {
  try {
    await createNotification(
      userId,
      "New Match!",
      `You matched with ${matchedUserName}!`,
      "match",
      { matchId }
    )
  } catch (error) {
    console.error("Error notifying new match:", error)
  }
}

// Notify new connection
export const notifyNewConnection = async (
  userId: string,
  connectionUserName: string
): Promise<void> => {
  try {
    await createNotification(
      userId,
      "New Connection",
      `${connectionUserName} wants to connect with you`,
      "connection"
    )
  } catch (error) {
    console.error("Error notifying new connection:", error)
  }
}

// Get foreground message handler
export const getForegroundMessageHandler = () => {
  return onForegroundMessage
}

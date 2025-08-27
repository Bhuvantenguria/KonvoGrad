import { getToken, onMessage, type MessagePayload } from "firebase/messaging"
import { messaging } from "./firebase"
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
  enableMessages: boolean
  enableMatches: boolean
  enableConnections: boolean
  enableSystem: boolean
  quietHours: {
    enabled: boolean
    start: string // "22:00"
    end: string // "08:00"
  }
}

// Request notification permission and get FCM token
export const requestNotificationPermission = async (userId: string): Promise<string | null> => {
  try {
    if (!messaging) {
      console.log("Messaging not supported")
      return null
    }

    // Request permission
    const permission = await Notification.requestPermission()
    if (permission !== "granted") {
      console.log("Notification permission denied")
      return null
    }

    // Get FCM token
    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    })

    if (token) {
      // Save token to user document
      await saveNotificationToken(userId, token)
      console.log("FCM token obtained:", token)
      return token
    }

    return null
  } catch (error) {
    console.error("Error getting notification permission:", error)
    return null
  }
}

// Save FCM token to user document
export const saveNotificationToken = async (userId: string, token: string) => {
  try {
    await updateDoc(doc(db, "users", userId), {
      fcmToken: token,
      updatedAt: new Date(),
    })
  } catch (error) {
    console.error("Error saving FCM token:", error)
  }
}

// Listen for foreground messages
export const onForegroundMessage = (callback: (payload: MessagePayload) => void) => {
  if (!messaging) return () => {}

  return onMessage(messaging, (payload) => {
    console.log("Foreground message received:", payload)
    callback(payload)
  })
}

// Create notification in database
export const createNotification = async (
  userId: string,
  title: string,
  body: string,
  type: NotificationData["type"],
  data?: NotificationData["data"],
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, "notifications"), {
      userId,
      title,
      body,
      type,
      data: data || {},
      isRead: false,
      createdAt: new Date(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error creating notification:", error)
    throw error
  }
}

// Send push notification (server-side function would be needed for actual sending)
export const sendPushNotification = async (
  userId: string,
  title: string,
  body: string,
  type: NotificationData["type"],
  data?: NotificationData["data"],
) => {
  try {
    // Create notification in database
    await createNotification(userId, title, body, type, data)

    // In a real implementation, you would call your server endpoint here
    // to send the actual push notification using Firebase Admin SDK
    console.log("Push notification queued for user:", userId)
  } catch (error) {
    console.error("Error sending push notification:", error)
  }
}

// Get user notification settings
export const getNotificationSettings = async (userId: string): Promise<NotificationSettings | null> => {
  try {
    const q = query(collection(db, "notificationSettings"), where("userId", "==", userId))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      // Create default settings
      const defaultSettings: Omit<NotificationSettings, "id"> = {
        userId,
        enablePush: true,
        enableMessages: true,
        enableMatches: true,
        enableConnections: true,
        enableSystem: true,
        quietHours: {
          enabled: false,
          start: "22:00",
          end: "08:00",
        },
      }

      const docRef = await addDoc(collection(db, "notificationSettings"), defaultSettings)
      return { id: docRef.id, ...defaultSettings } as NotificationSettings
    }

    const doc = querySnapshot.docs[0]
    return { id: doc.id, ...doc.data() } as NotificationSettings
  } catch (error) {
    console.error("Error getting notification settings:", error)
    return null
  }
}

// Update notification settings
export const updateNotificationSettings = async (
  userId: string,
  settings: Partial<Omit<NotificationSettings, "userId">>,
) => {
  try {
    const q = query(collection(db, "notificationSettings"), where("userId", "==", userId))
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      const docRef = querySnapshot.docs[0].ref
      await updateDoc(docRef, settings)
    }
  } catch (error) {
    console.error("Error updating notification settings:", error)
  }
}

// Mark notification as read
export const markNotificationAsRead = async (notificationId: string) => {
  try {
    await updateDoc(doc(db, "notifications", notificationId), {
      isRead: true,
    })
  } catch (error) {
    console.error("Error marking notification as read:", error)
  }
}

// Notification helpers for different events
export const notifyNewMessage = async (recipientId: string, senderName: string, chatRoomId: string) => {
  await sendPushNotification(recipientId, "New Message", `${senderName} sent you a message`, "message", { chatRoomId })
}

export const notifyNewMatch = async (userId: string, matchName: string, chatRoomId: string) => {
  await sendPushNotification(userId, "New Match!", `You've been matched with ${matchName}`, "match", { chatRoomId })
}

export const notifyConnectionRequest = async (userId: string, requesterName: string) => {
  await sendPushNotification(userId, "Connection Request", `${requesterName} wants to connect with you`, "connection")
}

export const notifySystemMessage = async (userId: string, title: string, body: string) => {
  await sendPushNotification(userId, title, body, "system")
}

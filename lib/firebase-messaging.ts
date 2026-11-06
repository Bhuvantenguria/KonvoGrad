import { getMessaging, isSupported, getToken, onMessage, Messaging } from "firebase/messaging"
import { initializeApp, getApps } from "firebase/app"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase for messaging only
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

let messagingInstance: Messaging | null = null

// Helper to get or initialize messaging asynchronously
export async function getFirebaseMessaging(): Promise<Messaging | null> {
  if (typeof window === "undefined") return null
  if (messagingInstance) return messagingInstance
  try {
    const supported = await isSupported()
    if (supported) {
      messagingInstance = getMessaging(app)
      return messagingInstance
    }
  } catch (error) {
    console.warn("Firebase messaging not supported in this environment:", error)
  }
  return null
}

// Retain export for backward compatibility
export const messaging: Messaging | null = null

// Get FCM token
export async function getFCMToken(messagingArg?: Messaging | null): Promise<string | null> {
  try {
    const targetMessaging = messagingArg || (await getFirebaseMessaging())
    if (!targetMessaging) {
      return null
    }

    const token = await getToken(targetMessaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    })
    return token
  } catch (error) {
    console.error("Error getting FCM token:", error)
    return null
  }
}

// Listen for foreground messages
export const onForegroundMessage = async (callback: (payload: any) => void) => {
  const targetMessaging = await getFirebaseMessaging()
  if (!targetMessaging) return () => {}

  return onMessage(targetMessaging, callback)
}

export default messaging

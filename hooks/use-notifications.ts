"use client"

import { useState, useEffect } from "react"
import { collection, query, where, orderBy, onSnapshot, limit } from "firebase/firestore"
import { db } from "@/lib/firebase"
import {
  requestNotificationPermission,
  onForegroundMessage,
  markNotificationAsRead,
  getNotificationSettings,
  updateNotificationSettings,
  type NotificationData,
  type NotificationSettings,
} from "@/lib/notifications"
import { useToast } from "@/hooks/use-toast"

export const useNotifications = (userId: string) => {
  const [notifications, setNotifications] = useState<NotificationData[]>([])
  const [settings, setSettings] = useState<NotificationSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [permissionGranted, setPermissionGranted] = useState(false)
  const { toast } = useToast()

  // Initialize notifications
  useEffect(() => {
    if (!userId) return

    const initializeNotifications = async () => {
      try {
        // Get notification settings
        const userSettings = await getNotificationSettings(userId)
        setSettings(userSettings)

        // Request permission if enabled
        if (userSettings?.enablePush) {
          const token = await requestNotificationPermission(userId)
          setPermissionGranted(!!token)
        }

        setLoading(false)
      } catch (error) {
        console.error("Error initializing notifications:", error)
        setLoading(false)
      }
    }

    initializeNotifications()
  }, [userId])

  // Listen for notifications
  useEffect(() => {
    if (!userId) return

    const q = query(
      collection(db, "notifications"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
      limit(50),
    )

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notificationList: NotificationData[] = []
      querySnapshot.forEach((doc) => {
        notificationList.push({ id: doc.id, ...doc.data() } as NotificationData)
      })
      setNotifications(notificationList)
    })

    return unsubscribe
  }, [userId])

  // Listen for foreground messages
  useEffect(() => {
    const unsubscribe = onForegroundMessage((payload) => {
      // Show toast notification for foreground messages
      toast({
        title: payload.notification?.title || "New Notification",
        description: payload.notification?.body || "You have a new notification",
      })
    })

    return unsubscribe
  }, [toast])

  const markAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId)
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const updateSettings = async (newSettings: Partial<Omit<NotificationSettings, "userId">>) => {
    try {
      await updateNotificationSettings(userId, newSettings)
      if (settings) {
        setSettings({ ...settings, ...newSettings })
      }

      // If push notifications were enabled, request permission
      if (newSettings.enablePush && !permissionGranted) {
        const token = await requestNotificationPermission(userId)
        setPermissionGranted(!!token)
      }
    } catch (error) {
      console.error("Error updating notification settings:", error)
    }
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return {
    notifications,
    settings,
    loading,
    permissionGranted,
    unreadCount,
    markAsRead,
    updateSettings,
  }
}

// Firebase Cloud Messaging Service Worker
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js")
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js")

// Declare the firebase variable
const firebase = self.firebase

// Initialize Firebase in service worker
firebase.initializeApp({
  apiKey: "your-api-key", // This will be replaced with actual values
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id",
})

const messaging = firebase.messaging()

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log("Background message received:", payload)

  const notificationTitle = payload.notification?.title || "AlumniConnect"
  const notificationOptions = {
    body: payload.notification?.body || "You have a new notification",
    icon: "/icon-192x192.png",
    badge: "/badge-72x72.png",
    tag: payload.data?.type || "general",
    data: payload.data,
    actions: [
      {
        action: "open",
        title: "Open",
      },
      {
        action: "dismiss",
        title: "Dismiss",
      },
    ],
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked:", event)

  event.notification.close()

  if (event.action === "dismiss") {
    return
  }

  // Handle different notification types
  const data = event.notification.data
  let url = "/"

  if (data?.chatRoomId) {
    url = `/chat?room=${data.chatRoomId}`
  } else if (data?.type === "match") {
    url = "/match"
  } else if (data?.type === "connection") {
    url = "/dashboard"
  }

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // Check if there's already a window/tab open with the target URL
      for (const client of clientList) {
        if (client.url.includes(url) && "focus" in client) {
          return client.focus()
        }
      }

      // If no existing window/tab, open a new one
      if (clients.openWindow) {
        return clients.openWindow(url)
      }
    }),
  )
})

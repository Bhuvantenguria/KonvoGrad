// Firebase Cloud Messaging Service Worker
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js")
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js")

const firebase = self.firebase

// Parse configuration from registration URL query parameters or fallback
const params = new URL(location).searchParams
const config = {
  apiKey: params.get("apiKey") || "",
  authDomain: params.get("authDomain") || "",
  projectId: params.get("projectId") || "",
  storageBucket: params.get("storageBucket") || "",
  messagingSenderId: params.get("messagingSenderId") || "",
  appId: params.get("appId") || "",
}

try {
  if (config.apiKey) {
    firebase.initializeApp(config)
    const messaging = firebase.messaging()
    messaging.onBackgroundMessage((payload) => {
      const notificationTitle = payload.notification?.title || "KonvoGrad"
      const notificationOptions = {
        body: payload.notification?.body || "You have a new notification",
        icon: "/placeholder.svg",
        data: payload.data,
      }
      self.registration.showNotification(notificationTitle, notificationOptions)
    })
  }
} catch (e) {
  console.warn("FCM Service Worker initialization skipped:", e)
}

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  const chatRoomId = event.notification.data?.chatRoomId
  const urlToOpen = chatRoomId ? `/chat` : `/dashboard`

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(urlToOpen) && "focus" in client) {
          return client.focus()
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen)
      }
    })
  )
})

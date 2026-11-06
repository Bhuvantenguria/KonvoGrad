"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { WebRTCManager } from "@/lib/webrtc-utils"
import { getChatMessagesClient, sendMessageClient } from "@/lib/firebase-client-utils"

interface Message {
  id: string
  text: string
  senderId: string
  timestamp: Date
}

export function useVideoCall(chatRoomId: string, userId: string, remoteUserId: string) {
  const [isCallActive, setIsCallActive] = useState(false)
  const [isIncomingCall, setIsIncomingCall] = useState(false)
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [callStatus, setCallStatus] = useState<"idle" | "calling" | "ringing" | "connected" | "ended">("idle")
  
  // Chat-related state
  const [messages, setMessages] = useState<Message[]>([])
  const [messageText, setMessageText] = useState("")
  const [showChat, setShowChat] = useState(false)

  const webrtcManagerRef = useRef<WebRTCManager | null>(null)

  useEffect(() => {
    if (chatRoomId && userId && remoteUserId) {
      webrtcManagerRef.current = new WebRTCManager(chatRoomId, userId, remoteUserId)
      webrtcManagerRef.current.initialize()

      webrtcManagerRef.current.onRemoteStream((stream) => {
        setRemoteStream(stream)
        setCallStatus("connected")
      })

      webrtcManagerRef.current.onCallRequest(() => {
        setIsIncomingCall(true)
        setCallStatus("ringing")
      })

      webrtcManagerRef.current.onCallAccept(() => {
        setCallStatus("connected")
      })

      webrtcManagerRef.current.onCallReject(() => {
        setIsCallActive(false)
        setIsIncomingCall(false)
        setCallStatus("ended")
        setTimeout(() => setCallStatus("idle"), 2000)
      })

      webrtcManagerRef.current.onCallEnd(() => {
        endCall()
      })
    }

    return () => {
      if (webrtcManagerRef.current) {
        webrtcManagerRef.current.cleanup()
      }
    }
  }, [chatRoomId, userId, remoteUserId])

  // Sync in-call messages via Firestore
  useEffect(() => {
    if (!chatRoomId) return
    const unsubscribe = getChatMessagesClient(chatRoomId, (msgs) => {
      setMessages(
        msgs.map((m) => ({
          id: m.id,
          text: m.text,
          senderId: m.senderId,
          timestamp: m.timestamp?.toDate ? m.timestamp.toDate() : new Date(),
        }))
      )
    })
    return unsubscribe
  }, [chatRoomId])

  const startCall = useCallback(async () => {
    if (!webrtcManagerRef.current) return

    try {
      setError(null)
      setCallStatus("calling")

      // Check device availability first
      const deviceStatus = await webrtcManagerRef.current.checkDeviceAvailability()
      if (!deviceStatus.hasVideo && !deviceStatus.hasAudio) {
        throw new Error("No camera or microphone found. Please check your device.")
      }

      const stream = await webrtcManagerRef.current.startLocalStream(true, true)
      setLocalStream(stream)

      await webrtcManagerRef.current.sendCallRequest()
      await webrtcManagerRef.current.createOffer()

      setIsCallActive(true)
    } catch (err) {
      console.error("Error starting call:", err)
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Failed to start call. Please check your camera and microphone permissions.")
      }
      setCallStatus("idle")
    }
  }, [])

  const acceptCall = useCallback(async () => {
    if (!webrtcManagerRef.current) return

    try {
      setError(null)
      setCallStatus("connected")

      // Check device availability first
      const deviceStatus = await webrtcManagerRef.current.checkDeviceAvailability()
      if (!deviceStatus.hasVideo && !deviceStatus.hasAudio) {
        throw new Error("No camera or microphone found. Please check your device.")
      }

      const stream = await webrtcManagerRef.current.startLocalStream(true, true)
      setLocalStream(stream)

      await webrtcManagerRef.current.acceptCall()

      setIsCallActive(true)
      setIsIncomingCall(false)
    } catch (err) {
      console.error("Error accepting call:", err)
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Failed to accept call. Please check your camera and microphone permissions.")
      }
      setCallStatus("idle")
    }
  }, [])

  const rejectCall = useCallback(async () => {
    if (!webrtcManagerRef.current) return

    await webrtcManagerRef.current.rejectCall()
    setIsIncomingCall(false)
    setCallStatus("idle")
  }, [])

  const endCall = useCallback(async () => {
    if (webrtcManagerRef.current) {
      await webrtcManagerRef.current.endCall()
    }

    setIsCallActive(false)
    setIsIncomingCall(false)
    setLocalStream(null)
    setRemoteStream(null)
    setCallStatus("ended")

    // Reset to idle after a short delay
    setTimeout(() => setCallStatus("idle"), 2000)
  }, [])

  const toggleAudio = useCallback(() => {
    if (webrtcManagerRef.current) {
      const enabled = webrtcManagerRef.current.toggleAudio()
      setIsAudioEnabled(enabled)
      return enabled
    }
    return false
  }, [])

  const toggleVideo = useCallback(() => {
    if (webrtcManagerRef.current) {
      const enabled = webrtcManagerRef.current.toggleVideo()
      setIsVideoEnabled(enabled)
      return enabled
    }
    return false
  }, [])

  // Chat-related functions
  const sendMessage = useCallback(async () => {
    if (!messageText.trim() || !chatRoomId || !userId) return

    const text = messageText.trim()
    setMessageText("")

    try {
      await sendMessageClient(chatRoomId, userId, "User", text, "text")
    } catch (err) {
      console.error("Error sending in-call message:", err)
      // Fallback local append if offline
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text,
          senderId: userId,
          timestamp: new Date(),
        },
      ])
    }
  }, [messageText, chatRoomId, userId])

  const toggleChat = useCallback(() => {
    setShowChat((prev) => !prev)
  }, [])

  return {
    isCallActive,
    isIncomingCall,
    localStream,
    remoteStream,
    isAudioEnabled,
    isVideoEnabled,
    error,
    callStatus,
    startCall,
    acceptCall,
    rejectCall,
    endCall,
    toggleAudio,
    toggleVideo,
    // Chat-related properties
    messages,
    sendMessage,
    messageText,
    setMessageText,
    showChat,
    toggleChat,
  }
}

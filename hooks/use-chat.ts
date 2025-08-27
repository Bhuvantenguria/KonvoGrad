"use client"

import { useEffect, useState, useCallback } from "react"
import {
  createChatRoom,
  getChatMessages,
  sendMessage,
  markMessagesAsRead,
  getUserChatRooms,
  type ChatRoom,
  type Message,
} from "@/lib/firebase-utils"

export function useChat(userId: string) {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([])
  const [currentChatRoom, setCurrentChatRoom] = useState<ChatRoom | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  // Subscribe to user's chat rooms
  useEffect(() => {
    if (!userId) return

    const unsubscribe = getUserChatRooms(userId, (rooms) => {
      setChatRooms(rooms)
      setLoading(false)
    })

    return unsubscribe
  }, [userId])

  // Subscribe to messages for current chat room
  useEffect(() => {
    if (!currentChatRoom) {
      setMessages([])
      return
    }

    const unsubscribe = getChatMessages(currentChatRoom.id, (msgs) => {
      setMessages(msgs)
      // Mark messages as read
      markMessagesAsRead(currentChatRoom.id, userId)
    })

    return unsubscribe
  }, [currentChatRoom, userId])

  const createNewChatRoom = useCallback(
    async (type: ChatRoom["type"], participants: string[], participantDetails: ChatRoom["participantDetails"]) => {
      try {
        const chatRoomId = await createChatRoom(type, participants, participantDetails)
        return chatRoomId
      } catch (error) {
        console.error("Error creating chat room:", error)
        throw error
      }
    },
    [],
  )

  const sendChatMessage = useCallback(
    async (chatRoomId: string, senderId: string, senderName: string, text: string, type: Message["type"] = "text") => {
      try {
        await sendMessage(chatRoomId, senderId, senderName, text, type)
      } catch (error) {
        console.error("Error sending message:", error)
        throw error
      }
    },
    [],
  )

  const selectChatRoom = useCallback((chatRoom: ChatRoom) => {
    setCurrentChatRoom(chatRoom)
  }, [])

  return {
    chatRooms,
    currentChatRoom,
    messages,
    loading,
    createNewChatRoom,
    sendChatMessage,
    selectChatRoom,
  }
}

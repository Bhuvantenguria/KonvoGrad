"use client"

import { useEffect, useState, useCallback } from "react"
import {
  getUserChatRoomsClient,
  getChatMessagesClient,
  sendMessageClient,
  markMessagesAsReadClient,
  createChatRoomClient,
  type ChatRoom,
  type Message,
} from "@/lib/firebase-client-utils"

export function useChat(userId: string) {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([])
  const [currentChatRoom, setCurrentChatRoom] = useState<ChatRoom | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  // Subscribe to user's chat rooms
  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const unsubscribe = getUserChatRoomsClient(userId, (rooms) => {
      setChatRooms(rooms)
      setLoading(false)
    })

    return unsubscribe
  }, [userId])

  // Subscribe to messages in current chat room
  useEffect(() => {
    if (!currentChatRoom) {
      setMessages([])
      return
    }

    const unsubscribe = getChatMessagesClient(currentChatRoom.id, (msgs) => {
      setMessages(msgs)
      // Mark messages as read
      markMessagesAsReadClient(currentChatRoom.id, userId)
    })

    return unsubscribe
  }, [currentChatRoom, userId])

  const createNewChatRoom = useCallback(
    async (type: ChatRoom["type"], participants: string[], participantDetails: ChatRoom["participantDetails"]) => {
      try {
        const chatRoomId = await createChatRoomClient(type, participants, participantDetails)
        return chatRoomId
      } catch (error) {
        console.error("Error creating chat room:", error)
        throw error
      }
    },
    [],
  )

  const sendChatMessage = useCallback(
    async (
      chatRoomId: string,
      senderId: string,
      senderName: string,
      text: string,
      type: Message["type"] = "text",
      mediaFile?: File
    ) => {
      try {
        await sendMessageClient(chatRoomId, senderId, senderName, text, type, mediaFile)
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

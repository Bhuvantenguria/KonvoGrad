"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useFirebaseUser } from "@/hooks/use-firebase-user"
import { VideoCallInterface } from "@/components/video-chat/video-call-interface"
import { getChatRoomClient, getUserClient } from "@/lib/firebase-client-utils"
import { Loader2 } from "lucide-react"

export default function VideoChatPage() {
  const params = useParams()
  const router = useRouter()
  const { firebaseUser, loading: userLoading } = useFirebaseUser()
  const [chatRoom, setChatRoom] = useState<any>(null)
  const [remoteUser, setRemoteUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const chatRoomId = params.chatRoomId as string

  useEffect(() => {
    const loadChatRoom = async () => {
      if (!chatRoomId || !firebaseUser) return

      try {
        setLoading(true)
        setError(null)

        // Get chat room details
        const room = await getChatRoomClient(chatRoomId)
        if (!room) {
          setError("Chat room not found")
          return
        }

        setChatRoom(room)

        // Find the remote user (not the current user)
        const remoteUserId = room.participants.find((id: string) => id !== firebaseUser.id)
        if (!remoteUserId) {
          setError("No remote user found")
          return
        }

        // Get remote user details
        const remoteUserData = await getUserClient(remoteUserId)
        if (remoteUserData) {
          setRemoteUser(remoteUserData)
        }

      } catch (err) {
        console.error("Error loading chat room:", err)
        setError("Failed to load chat room")
      } finally {
        setLoading(false)
      }
    }

    if (!userLoading && firebaseUser) {
      loadChatRoom()
    }
  }, [chatRoomId, firebaseUser, userLoading])

  const handleCallEnd = () => {
    router.push("/chat")
  }

  const handleNextMatch = () => {
    router.push("/match")
  }

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="text-muted-foreground">Loading video chat...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
            <Loader2 className="w-8 h-8 text-destructive" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Error</h3>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
          <button 
            onClick={() => router.push("/chat")}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Back to Chat
          </button>
        </div>
      </div>
    )
  }

  if (!firebaseUser || !chatRoom || !remoteUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
            <Loader2 className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Not Found</h3>
            <p className="text-sm text-muted-foreground">Chat room or user not found</p>
          </div>
          <button 
            onClick={() => router.push("/chat")}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Back to Chat
          </button>
        </div>
      </div>
    )
  }

  return (
    <VideoCallInterface
      chatRoomId={chatRoomId}
      userId={firebaseUser.id}
      remoteUserId={remoteUser.id}
      remoteUserName={`Session ${remoteUser.sessionId?.slice(-6) || remoteUser.id?.slice(-6) || "Unknown"}`}
      remoteUserAvatar={remoteUser.imageUrl}
      onCallEnd={handleCallEnd}
      onNextMatch={handleNextMatch}
    />
  )
}

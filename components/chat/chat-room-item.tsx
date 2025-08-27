"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

interface ChatRoomItemProps {
  room: {
    id: string
    type: "random" | "friend" | "video"
    participantDetails: {
      [userId: string]: {
        name: string
        imageUrl?: string
        role: string
      }
    }
    isActive: boolean
    lastMessage?: {
      text: string
      senderId: string
      timestamp: any
    }
  }
  currentUserId: string
  currentUserName: string
  isSelected: boolean
  onClick: () => void
}

export function ChatRoomItem({ room, currentUserId, currentUserName, isSelected, onClick }: ChatRoomItemProps) {
  const otherParticipant = Object.values(room.participantDetails).find((p) => p.name !== currentUserName)

  const formatTime = (timestamp: any) => {
    if (!timestamp) return ""
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return formatDistanceToNow(date, { addSuffix: true })
  }

  const getChatTypeIcon = () => {
    switch (room.type) {
      case "video":
        return "📹"
      case "friend":
        return "👥"
      case "random":
        return "🎲"
      default:
        return "💬"
    }
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200",
        isSelected ? "bg-primary/10 border border-primary/20 shadow-sm" : "hover:bg-muted/50 hover:shadow-sm",
      )}
    >
      <div className="relative">
        <Avatar className="w-12 h-12">
          <AvatarImage src={otherParticipant?.imageUrl || "/placeholder.svg"} />
          <AvatarFallback>{otherParticipant?.name?.[0] || "U"}</AvatarFallback>
        </Avatar>
        {room.isActive && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full"></div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-2">
            <p className="font-medium text-sm truncate">{otherParticipant?.name || "Unknown User"}</p>
            <span className="text-xs">{getChatTypeIcon()}</span>
          </div>
          {room.lastMessage && (
            <span className="text-xs text-muted-foreground">{formatTime(room.lastMessage.timestamp)}</span>
          )}
        </div>

        <p className="text-xs text-muted-foreground mb-1">{otherParticipant?.role || "Professional"}</p>

        {room.lastMessage ? (
          <p className="text-xs text-muted-foreground truncate">
            {room.lastMessage.senderId === currentUserId ? "You: " : ""}
            {room.lastMessage.text}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground italic">No messages yet</p>
        )}
      </div>

      {room.type === "video" && (
        <Badge variant="secondary" className="text-xs">
          Video
        </Badge>
      )}
    </div>
  )
}

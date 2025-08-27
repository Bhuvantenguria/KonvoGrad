import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"
import { Check, CheckCheck } from "lucide-react"

interface MessageBubbleProps {
  message: {
    id: string
    text: string
    senderId: string
    senderName: string
    timestamp: any
    isRead: boolean
    type: "text" | "image" | "file" | "system"
  }
  isOwnMessage: boolean
  senderAvatar?: string
  showAvatar?: boolean
  showTimestamp?: boolean
}

export function MessageBubble({
  message,
  isOwnMessage,
  senderAvatar,
  showAvatar = true,
  showTimestamp = true,
}: MessageBubbleProps) {
  const formatTime = (timestamp: any) => {
    if (!timestamp) return ""
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return formatDistanceToNow(date, { addSuffix: true })
  }

  if (message.type === "system") {
    return (
      <div className="flex justify-center my-4">
        <Badge variant="secondary" className="text-xs">
          {message.text}
        </Badge>
      </div>
    )
  }

  return (
    <div className={cn("flex items-end space-x-2 mb-4", isOwnMessage ? "justify-end" : "justify-start")}>
      {!isOwnMessage && showAvatar && (
        <Avatar className="w-8 h-8">
          <AvatarImage src={senderAvatar || "/placeholder.svg"} />
          <AvatarFallback className="text-xs">{message.senderName?.[0] || "U"}</AvatarFallback>
        </Avatar>
      )}

      <div className="flex flex-col max-w-xs lg:max-w-md">
        {!isOwnMessage && <span className="text-xs text-muted-foreground mb-1 px-1">{message.senderName}</span>}

        <div
          className={cn(
            "px-4 py-2 rounded-lg relative",
            isOwnMessage ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-muted rounded-bl-sm",
          )}
        >
          <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>

          <div
            className={cn(
              "flex items-center justify-end space-x-1 mt-1",
              isOwnMessage ? "text-primary-foreground/70" : "text-muted-foreground",
            )}
          >
            {showTimestamp && <span className="text-xs">{formatTime(message.timestamp)}</span>}
            {isOwnMessage && (
              <div className="flex items-center">
                {message.isRead ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />}
              </div>
            )}
          </div>
        </div>
      </div>

      {isOwnMessage && showAvatar && (
        <Avatar className="w-8 h-8">
          <AvatarImage src={senderAvatar || "/placeholder.svg"} />
          <AvatarFallback className="text-xs">{message.senderName?.[0] || "U"}</AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}

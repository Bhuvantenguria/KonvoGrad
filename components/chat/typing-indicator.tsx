import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface TypingIndicatorProps {
  userName: string
  userAvatar?: string
}

export function TypingIndicator({ userName, userAvatar }: TypingIndicatorProps) {
  return (
    <div className="flex items-end space-x-2 mb-4">
      <Avatar className="w-8 h-8">
        <AvatarImage src={userAvatar || "/placeholder.svg"} />
        <AvatarFallback className="text-xs">{userName?.[0] || "U"}</AvatarFallback>
      </Avatar>

      <div className="bg-muted px-4 py-2 rounded-lg rounded-bl-sm">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"></div>
          <div
            className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>
      </div>
    </div>
  )
}

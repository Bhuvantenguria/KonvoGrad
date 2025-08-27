"use client"

import type React from "react"

import { useState } from "react"
import { useFirebaseUser } from "@/hooks/use-firebase-user"
import { useChat } from "@/hooks/use-chat"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  MessageCircle,
  Users,
  Video,
  Phone,
  MoreVertical,
  Send,
  Smile,
  Paperclip,
  Search,
  Settings,
  Bell,
  ArrowLeft,
  Loader2,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

export default function ChatPage() {
  const router = useRouter()
  const { firebaseUser, loading: userLoading } = useFirebaseUser()
  const {
    chatRooms,
    currentChatRoom,
    messages,
    loading: chatLoading,
    sendChatMessage,
    selectChatRoom,
  } = useChat(firebaseUser?.id || "")
  const [messageText, setMessageText] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isMobileView, setIsMobileView] = useState(false)

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageText.trim() || !currentChatRoom || !firebaseUser) return

    try {
      await sendChatMessage(
        currentChatRoom.id,
        firebaseUser.id,
        `${firebaseUser.firstName} ${firebaseUser.lastName}`,
        messageText.trim(),
      )
      setMessageText("")
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const handleVideoCall = () => {
    if (currentChatRoom) {
      router.push(`/video-chat/${currentChatRoom.id}`)
    }
  }

  const filteredChatRooms = chatRooms.filter((room) => {
    if (!searchQuery) return true
    const participantNames = Object.values(room.participantDetails).map((p) => p.name.toLowerCase())
    return participantNames.some((name) => name.includes(searchQuery.toLowerCase()))
  })

  const formatMessageTime = (timestamp: any) => {
    if (!timestamp) return ""
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return formatDistanceToNow(date, { addSuffix: true })
  }

  if (userLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="text-muted-foreground">Loading chat...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-serif font-bold text-xl text-foreground">KonvoGrad</span>
              </Link>
              {currentChatRoom && (
                <div className="hidden md:flex items-center space-x-2 ml-8">
                  <Badge variant="secondary">Chat Active</Badge>
                  <span className="text-sm text-muted-foreground">
                    {Object.values(currentChatRoom.participantDetails)
                      .filter((p) => p.name !== `${firebaseUser?.firstName} ${firebaseUser?.lastName}`)
                      .map((p) => p.name)
                      .join(", ")}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
              <Avatar className="w-8 h-8">
                <AvatarImage src={firebaseUser?.imageUrl || "/placeholder.svg"} />
                <AvatarFallback>
                  {firebaseUser?.firstName?.[0]}
                  {firebaseUser?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Chat Rooms Sidebar */}
        <div
          className={cn(
            "w-80 border-r border-border bg-card/30 flex flex-col",
            isMobileView && currentChatRoom ? "hidden" : "flex",
          )}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif font-semibold text-lg">Messages</h2>
              <Button size="sm" variant="outline">
                <MessageCircle className="w-4 h-4 mr-2" />
                New Chat
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Chat Rooms List */}
          <ScrollArea className="flex-1">
            <div className="p-2">
              {chatLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : filteredChatRooms.length > 0 ? (
                <div className="space-y-1">
                  {filteredChatRooms.map((room) => {
                    const otherParticipant = Object.values(room.participantDetails).find(
                      (p) => p.name !== `${firebaseUser?.firstName} ${firebaseUser?.lastName}`,
                    )
                    const isSelected = currentChatRoom?.id === room.id

                    return (
                      <div
                        key={room.id}
                        onClick={() => {
                          selectChatRoom(room)
                          setIsMobileView(true)
                        }}
                        className={cn(
                          "flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors",
                          isSelected ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/50",
                        )}
                      >
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={otherParticipant?.imageUrl || "/placeholder.svg"} />
                          <AvatarFallback>{otherParticipant?.name?.[0] || "U"}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm truncate">{otherParticipant?.name || "Unknown User"}</p>
                            {room.lastMessage && (
                              <span className="text-xs text-muted-foreground">
                                {formatMessageTime(room.lastMessage.timestamp)}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{otherParticipant?.role || "Professional"}</p>
                          {room.lastMessage && (
                            <p className="text-xs text-muted-foreground truncate mt-1">{room.lastMessage.text}</p>
                          )}
                        </div>
                        {room.isActive && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground text-sm">No conversations yet</p>
                  <Button variant="ghost" size="sm" className="mt-2">
                    Start a new chat
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className={cn("flex-1 flex flex-col", !currentChatRoom && !isMobileView ? "hidden md:flex" : "flex")}>
          {currentChatRoom ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-border bg-card/30 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileView(false)}>
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>
                      {Object.values(currentChatRoom.participantDetails).find(
                        (p) => p.name !== `${firebaseUser?.firstName} ${firebaseUser?.lastName}`,
                      )?.name?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {Object.values(currentChatRoom.participantDetails)
                        .filter((p) => p.name !== `${firebaseUser?.firstName} ${firebaseUser?.lastName}`)
                        .map((p) => p.name)
                        .join(", ")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {Object.values(currentChatRoom.participantDetails)
                        .filter((p) => p.name !== `${firebaseUser?.firstName} ${firebaseUser?.lastName}`)
                        .map((p) => p.role)
                        .join(", ")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon">
                    <Phone className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleVideoCall}>
                    <Video className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Messages Area */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.length > 0 ? (
                    messages.map((message) => {
                      const isOwnMessage = message.senderId === firebaseUser?.id

                      return (
                        <div
                          key={message.id}
                          className={cn("flex items-end space-x-2", isOwnMessage ? "justify-end" : "justify-start")}
                        >
                          {!isOwnMessage && (
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="text-xs">{message.senderName?.[0] || "U"}</AvatarFallback>
                            </Avatar>
                          )}
                          <div
                            className={cn(
                              "max-w-xs lg:max-w-md px-4 py-2 rounded-lg",
                              isOwnMessage ? "bg-primary text-primary-foreground" : "bg-muted",
                            )}
                          >
                            {!isOwnMessage && <p className="text-xs font-medium mb-1">{message.senderName}</p>}
                            <p className="text-sm">{message.text}</p>
                            <p
                              className={cn(
                                "text-xs mt-1",
                                isOwnMessage ? "text-primary-foreground/70" : "text-muted-foreground",
                              )}
                            >
                              {formatMessageTime(message.timestamp)}
                            </p>
                          </div>
                          {isOwnMessage && (
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={firebaseUser?.imageUrl || "/placeholder.svg"} />
                              <AvatarFallback className="text-xs">
                                {firebaseUser?.firstName?.[0]}
                                {firebaseUser?.lastName?.[0]}
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-center py-8">
                      <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Start the conversation!</p>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t border-border bg-card/30">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                  <Button type="button" variant="ghost" size="icon">
                    <Paperclip className="w-5 h-5" />
                  </Button>
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Type a message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      className="pr-12"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2"
                    >
                      <Smile className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button type="submit" disabled={!messageText.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            /* No Chat Selected */
            <div className="flex-1 flex items-center justify-center bg-muted/20">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <MessageCircle className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-lg mb-2">Select a conversation</h3>
                  <p className="text-muted-foreground text-sm">Choose a chat from the sidebar to start messaging</p>
                </div>
                <Button variant="outline">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Start New Chat
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

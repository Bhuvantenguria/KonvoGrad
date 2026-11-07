"use client"

import type React from "react"
import { useState, useRef } from "react"
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
  Shield,
  Crown,
  Heart,
  Star
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { SharedNavigation } from "@/components/ui/shared-navigation"
import { useTheme } from "@/components/theme-provider"

export default function ChatPage() {
  const { firebaseUser, loading: userLoading } = useFirebaseUser()
  const { chatRooms, currentChatRoom, messages, loading: chatLoading, sendChatMessage, selectChatRoom } = useChat(firebaseUser?.id || "")
  const router = useRouter()
  const { currentTheme, isDarkMode } = useTheme()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [searchQuery, setSearchQuery] = useState("")
  const [messageText, setMessageText] = useState("")
  const [isMobileView, setIsMobileView] = useState(false)

  const filteredChatRooms = chatRooms.filter((room) =>
    Object.values(room.participantDetails || {}).some((participant: any) =>
      participant?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageText.trim() || !currentChatRoom || !firebaseUser) return

    try {
      const text = messageText.trim()
      setMessageText("")
      await sendChatMessage(
        currentChatRoom.id,
        firebaseUser.id,
        `${firebaseUser.firstName || "User"} ${firebaseUser.lastName || ""}`.trim(),
        text,
      )
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const handleVideoCall = () => {
    if (currentChatRoom) {
      router.push(`/video-chat/${currentChatRoom.id}`)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !currentChatRoom || !firebaseUser) return

    try {
      const type = file.type.startsWith("image/") ? "image" : "file"
      await sendChatMessage(
        currentChatRoom.id,
        firebaseUser.id,
        `${firebaseUser.firstName || "User"} ${firebaseUser.lastName || ""}`.trim(),
        file.name,
        type,
        file
      )
    } catch (error) {
      console.error("Error uploading file in chat:", error)
    }
  }

  if (userLoading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? currentTheme.darkBackground : currentTheme.background} flex items-center justify-center`}>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-foreground font-medium">Loading chat...</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? currentTheme.darkBackground : currentTheme.background} transition-all duration-500`}>
      <SharedNavigation currentPage="chat" />

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Chat Rooms Sidebar */}
        <div
          className={cn(
            "w-80 border-r-2 border-border/20 bg-card/30 flex flex-col",
            isMobileView && currentChatRoom ? "hidden" : "flex",
          )}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b-2 border-border/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 bg-gradient-to-r ${currentTheme.primary} rounded-lg flex items-center justify-center`}>
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                <h2 className="font-bold text-lg text-foreground">Messages</h2>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => router.push("/match")}
                className={`border-2 border-border/20 ${isDarkMode ? 'bg-slate-700/10 hover:bg-slate-700/20' : 'bg-white/10 hover:bg-white/20'} text-foreground btn-animate`}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                New Chat
              </Button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted/50 border-border/20 text-foreground placeholder-muted-foreground"
              />
            </div>
          </div>

          {/* Chat Room List */}
          <ScrollArea className="flex-1">
            {chatLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : filteredChatRooms.length > 0 ? (
              <div className="space-y-2 p-2">
                {filteredChatRooms.map((room) => {
                  const otherUserId = room.participants.find((id) => id !== firebaseUser?.id)
                  const otherParticipant = otherUserId ? room.participantDetails?.[otherUserId] : null

                  const isSelected = currentChatRoom?.id === room.id

                  return (
                    <div
                      key={room.id}
                      onClick={() => {
                        selectChatRoom(room)
                        setIsMobileView(true)
                      }}
                      className={cn(
                        "flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all duration-200",
                        isSelected 
                          ? `bg-gradient-to-r ${currentTheme.primary} text-white shadow-lg` 
                          : `${isDarkMode ? 'bg-slate-800/50 hover:bg-slate-800/70' : 'bg-white/50 hover:bg-white/70'} backdrop-blur-sm`
                      )}
                    >
                      <Avatar className="w-12 h-12 border-2 border-border/20">
                        <AvatarImage src={otherParticipant?.imageUrl || "/placeholder.svg"} />
                        <AvatarFallback className="bg-gradient-to-r from-white to-gray-200 font-bold">
                          {otherParticipant?.name?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{otherParticipant?.name || "Professional"}</p>
                        <p className="text-sm opacity-80 truncate">
                          {room.lastMessage?.text || "No messages yet"}
                        </p>
                      </div>
                      {room.isActive && (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className={`w-16 h-16 bg-gradient-to-r ${currentTheme.primary} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <p className="text-muted-foreground text-sm mb-4">No conversations yet</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/match")}
                  className={`${isDarkMode ? 'bg-slate-700/10 hover:bg-slate-700/20' : 'bg-white/10 hover:bg-white/20'} text-foreground btn-animate`}
                >
                  Start a new chat
                </Button>
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className={cn("flex-1 flex flex-col", !currentChatRoom && !isMobileView ? "hidden md:flex" : "flex")}>
          {currentChatRoom ? (
            <>
              {/* Chat Header */}
              {(() => {
                const otherUserId = currentChatRoom.participants.find((id) => id !== firebaseUser?.id)
                const otherParticipant = otherUserId ? currentChatRoom.participantDetails?.[otherUserId] : null
                const displayName = otherParticipant?.name || "Professional"

                return (
                  <div className={`p-4 border-b-2 border-border/20 ${isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'} backdrop-blur-sm flex items-center justify-between`}>
                    <div className="flex items-center space-x-3">
                      <Button variant="ghost" size="icon" className="md:hidden hover:scale-110 transition-transform duration-200" onClick={() => setIsMobileView(false)}>
                        <ArrowLeft className="w-5 h-5" />
                      </Button>
                      <Avatar className="w-10 h-10 border-2 border-border/20">
                        <AvatarImage src={otherParticipant?.imageUrl || "/placeholder.svg"} />
                        <AvatarFallback className="bg-gradient-to-r from-white to-gray-200 font-bold">
                          {displayName[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">{displayName}</p>
                        <p className="text-sm text-muted-foreground">
                          {currentChatRoom.isActive ? "Online" : "Offline"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleVideoCall}
                        className={`${isDarkMode ? 'hover:bg-slate-700/20' : 'hover:bg-white/20'} text-foreground hover:scale-110 transition-transform duration-200`}
                      >
                        <Phone className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleVideoCall}
                        className={`${isDarkMode ? 'hover:bg-slate-700/20' : 'hover:bg-white/20'} text-foreground hover:scale-110 transition-transform duration-200`}
                      >
                        <Video className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push("/match")}
                        className={`${isDarkMode ? 'hover:bg-slate-700/20' : 'hover:bg-white/20'} text-foreground hover:scale-110 transition-transform duration-200`}
                      >
                        <MoreVertical className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                )
              })()}

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.length > 0 ? (
                    messages.map((message) => {
                      const isOwnMessage = message.senderId === firebaseUser?.id
                      const timeStr = typeof (message.timestamp as any)?.toDate === "function"
                        ? formatDistanceToNow((message.timestamp as any).toDate(), { addSuffix: true })
                        : message.timestamp instanceof Date
                        ? formatDistanceToNow(message.timestamp, { addSuffix: true })
                        : "Just now"

                      return (
                        <div
                          key={message.id}
                          className={cn(
                            "flex items-end space-x-2",
                            isOwnMessage ? "justify-end" : "justify-start"
                          )}
                        >
                          {!isOwnMessage && (
                            <Avatar className="w-8 h-8 border-2 border-border/20">
                              <AvatarFallback className="text-xs bg-gradient-to-r from-white to-gray-200 font-bold">
                                {message.senderName?.[0] || "U"}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div
                            className={cn(
                              "max-w-xs lg:max-w-md px-4 py-2 rounded-xl shadow-lg",
                              isOwnMessage 
                                ? `bg-gradient-to-r ${currentTheme.primary} text-white` 
                                : `${isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'} backdrop-blur-sm text-foreground border-2 border-border/20`
                            )}
                          >
                            <p className="text-sm">{message.text}</p>
                            <p
                              className={cn(
                                "text-xs mt-1",
                                isOwnMessage ? "text-white/70" : "text-muted-foreground",
                              )}
                            >
                              {timeStr}
                            </p>
                          </div>
                          {isOwnMessage && (
                            <Avatar className="w-8 h-8 border-2 border-border/20">
                              <AvatarImage src={firebaseUser?.imageUrl || "/placeholder.svg"} />
                              <AvatarFallback className="text-xs bg-gradient-to-r from-white to-gray-200 font-bold">
                                {firebaseUser?.firstName?.[0] || "U"}
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-center py-8">
                      <div className={`w-16 h-16 bg-gradient-to-r ${currentTheme.primary} rounded-full flex items-center justify-center mx-auto shadow-lg mb-3`}>
                        <MessageCircle className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-muted-foreground">Start the conversation!</p>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className={`p-4 border-t-2 border-border/20 ${isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'} backdrop-blur-sm`}>
                <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => fileInputRef.current?.click()}
                    className={`${isDarkMode ? 'hover:bg-slate-700/20' : 'hover:bg-white/20'} text-foreground hover:scale-110 transition-transform duration-200`}
                  >
                    <Paperclip className="w-5 h-5" />
                  </Button>
                  <div className="relative flex-1">
                    <Input
                      placeholder="Type a message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      className="pr-12 bg-muted/50 border-border/20 text-foreground placeholder-muted-foreground"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setMessageText((prev) => prev + " 😊")}
                      className={`absolute right-1 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'hover:bg-slate-700/20' : 'hover:bg-white/20'} text-foreground hover:scale-110 transition-transform duration-200`}
                    >
                      <Smile className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button type="submit" disabled={!messageText.trim()} className={`bg-gradient-to-r ${currentTheme.primary} hover:opacity-90 text-white hover:scale-110 transition-transform duration-200`}>
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className={`w-16 h-16 bg-gradient-to-r ${currentTheme.primary} rounded-full flex items-center justify-center mx-auto shadow-lg`}>
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2 text-foreground">Select a conversation</h3>
                  <p className="text-muted-foreground text-sm">Choose a chat from the sidebar to start messaging</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => router.push("/match")}
                  className={`border-2 border-border/20 ${isDarkMode ? 'bg-slate-700/10 hover:bg-slate-700/20' : 'bg-white/10 hover:bg-white/20'} text-foreground btn-animate`}
                >
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

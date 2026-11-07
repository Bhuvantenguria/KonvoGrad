"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useVideoCall } from "@/hooks/use-video-call"
import { useTheme } from "@/components/theme-provider"
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  Send, 
  MessageCircle, 
  Shuffle, 
  Settings,
  Users,
  Sparkles,
  Zap,
  Heart,
  Star,
  Crown,
  Shield,
  Camera,
  Headphones,
  Wifi,
  WifiOff,
  Moon,
  Sun,
  Palette
} from "lucide-react"
import { cn } from "@/lib/utils"

interface VideoCallInterfaceProps {
  chatRoomId: string
  userId: string
  remoteUserId: string
  remoteUserName: string
  remoteUserAvatar?: string
  onCallEnd?: () => void
  onNextMatch?: () => void
}

export function VideoCallInterface({
  chatRoomId,
  userId,
  remoteUserId,
  remoteUserName,
  remoteUserAvatar,
  onCallEnd,
  onNextMatch
}: VideoCallInterfaceProps) {
  const { currentTheme, isDarkMode } = useTheme()
  const {
    localStream,
    remoteStream,
    callStatus,
    isVideoEnabled,
    isAudioEnabled,
    startCall,
    endCall,
    toggleVideo,
    toggleAudio,
    messages,
    sendMessage,
    messageText,
    setMessageText,
    showChat,
    toggleChat
  } = useVideoCall(chatRoomId, userId, remoteUserId)

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const formatMessageTime = (ts: any) => {
    if (!ts) return ""
    if (typeof ts?.toDate === "function") return ts.toDate().toLocaleTimeString()
    if (ts instanceof Date) return ts.toLocaleTimeString()
    try {
      return new Date(ts).toLocaleTimeString()
    } catch {
      return ""
    }
  }

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream
    }
  }, [localStream])

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream
    }
  }, [remoteStream])

  const getStatusIcon = () => {
    switch (callStatus) {
      case "idle":
        return <Phone className="w-5 h-5" />
      case "calling":
        return <Phone className="w-5 h-5 animate-pulse" />
      case "ringing":
        return <Phone className="w-5 h-5 animate-bounce" />
      case "connected":
        return <Video className="w-5 h-5" />
      case "ended":
        return <PhoneOff className="w-5 h-5" />
      default:
        return <Phone className="w-5 h-5" />
    }
  }

  const getStatusText = () => {
    switch (callStatus) {
      case "idle":
        return "Ready to Connect"
      case "calling":
        return "Calling..."
      case "ringing":
        return "Incoming Call"
      case "connected":
        return "Connected"
      case "ended":
        return "Call Ended"
      default:
        return "Connecting..."
    }
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? currentTheme.darkBackground : currentTheme.background} transition-all duration-500`}>
      <div className="relative h-screen overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)]"></div>
        </div>

        {/* Header */}
        <div className={`absolute top-0 left-0 right-0 z-10 p-4 ${isDarkMode ? currentTheme.darkCard : currentTheme.card} border-b-2 border-border/20`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 bg-gradient-to-r ${currentTheme.primary} rounded-xl flex items-center justify-center shadow-lg`}>
                <Video className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-foreground">Video Chat</h1>
                <p className="text-sm text-muted-foreground">Session: {chatRoomId.slice(-8)}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge className={`bg-gradient-to-r ${currentTheme.primary} text-white`}>
                <Shield className="w-3 h-3 mr-1" />
                {remoteUserName}
              </Badge>
              <Badge variant="outline" className="border-2 border-border/20">
                <Star className="w-3 h-3 mr-1" />
                {callStatus}
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Video Area */}
        <div className="pt-20 h-full flex">
          {/* Remote Video */}
          <div className="flex-1 relative">
            {remoteStream ? (
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
                onDoubleClick={() => setIsFullscreen(!isFullscreen)}
              />
            ) : (
              <div className={`w-full h-full flex items-center justify-center ${isDarkMode ? currentTheme.darkCard : currentTheme.card} border-2 border-border/20`}>
                <div className="text-center space-y-4">
                  <div className={`w-24 h-24 bg-gradient-to-r ${currentTheme.primary} rounded-full flex items-center justify-center mx-auto shadow-lg`}>
                    <Users className="w-12 h-12 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{remoteUserName}</h3>
                    <p className="text-muted-foreground">{getStatusText()}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Local Video (Picture-in-Picture) */}
            {localStream && (
              <div className="absolute bottom-4 right-4 w-48 h-36 rounded-xl overflow-hidden shadow-2xl border-2 border-white/20">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2">
                  <Badge variant="secondary" className="text-xs">
                    You
                  </Badge>
                </div>
              </div>
            )}
          </div>

          {/* Chat Sidebar */}
          {showChat && (
            <div className={`w-80 ${isDarkMode ? currentTheme.darkChat : currentTheme.chat} border-l-2 border-border/20`}>
              <div className="h-full flex flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b-2 border-border/20">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">Chat</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleChat}
                      className="hover:scale-110 transition-transform duration-200"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${message.senderId === userId ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs px-3 py-2 rounded-lg ${
                            message.senderId === userId
                              ? `bg-gradient-to-r ${currentTheme.primary} text-white`
                              : `${isDarkMode ? 'bg-slate-700/50' : 'bg-white/50'} text-foreground border-2 border-border/20`
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {formatMessageTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t-2 border-border/20">
                  <div className="flex space-x-2">
                    <Input
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 border-2 border-border/20 bg-muted/50"
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!messageText.trim()}
                      className={`bg-gradient-to-r ${currentTheme.primary} text-white hover:scale-105 transition-transform duration-200`}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Control Bar */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 ${isDarkMode ? currentTheme.darkCard : currentTheme.card} border-t-2 border-border/20`}>
          <div className="flex items-center justify-center space-x-4">
            {/* Video Toggle */}
            <Button
              onClick={toggleVideo}
              variant="outline"
              size="icon"
              className={`w-12 h-12 rounded-full border-2 border-border/20 hover:scale-110 transition-transform duration-200 ${
                isVideoEnabled 
                  ? `bg-gradient-to-r ${currentTheme.primary} text-white` 
                  : 'bg-red-500 text-white'
              }`}
            >
              {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </Button>

            {/* Audio Toggle */}
            <Button
              onClick={toggleAudio}
              variant="outline"
              size="icon"
              className={`w-12 h-12 rounded-full border-2 border-border/20 hover:scale-110 transition-transform duration-200 ${
                isAudioEnabled 
                  ? `bg-gradient-to-r ${currentTheme.secondary} text-white` 
                  : 'bg-red-500 text-white'
              }`}
            >
              {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </Button>

            {/* Call Controls */}
            {callStatus === "idle" ? (
              <Button
                onClick={startCall}
                className={`w-16 h-16 rounded-full bg-gradient-to-r ${currentTheme.primary} text-white shadow-lg hover:scale-110 transition-transform duration-200`}
              >
                <Phone className="w-6 h-6" />
              </Button>
            ) : callStatus === "connected" ? (
              <Button
                onClick={endCall}
                className="w-16 h-16 rounded-full bg-red-500 text-white shadow-lg hover:scale-110 transition-transform duration-200"
              >
                <PhoneOff className="w-6 h-6" />
              </Button>
            ) : (
              <Button
                onClick={endCall}
                className="w-16 h-16 rounded-full bg-red-500 text-white shadow-lg hover:scale-110 transition-transform duration-200"
              >
                <PhoneOff className="w-6 h-6" />
              </Button>
            )}

            {/* Next Match */}
            {callStatus === "ended" && onNextMatch && (
              <Button
                onClick={onNextMatch}
                className={`w-12 h-12 rounded-full bg-gradient-to-r ${currentTheme.accent} text-white hover:scale-110 transition-transform duration-200`}
              >
                <Shuffle className="w-5 h-5" />
              </Button>
            )}

            {/* Chat Toggle */}
            <Button
              onClick={toggleChat}
              variant="outline"
              size="icon"
              className={`w-12 h-12 rounded-full border-2 border-border/20 hover:scale-110 transition-transform duration-200 ${
                showChat ? `bg-gradient-to-r ${currentTheme.accent} text-white` : ''
              }`}
            >
              <MessageCircle className="w-5 h-5" />
            </Button>

            {/* Settings */}
            <Button
              variant="outline"
              size="icon"
              className="w-12 h-12 rounded-full border-2 border-border/20 hover:scale-110 transition-transform duration-200"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>

          {/* Status Bar */}
          <div className="flex items-center justify-center mt-4 space-x-4">
            <div className="flex items-center space-x-2">
              {getStatusIcon()}
              <span className="text-sm text-foreground">{getStatusText()}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${callStatus === "connected" ? "bg-green-500" : "bg-yellow-500"} animate-pulse`}></div>
              <span className="text-xs text-muted-foreground">
                {callStatus === "connected" ? "Live" : "Connecting"}
              </span>
            </div>
          </div>
        </div>

        {/* Floating Action Button for Chat */}
        {!showChat && (
          <Button
            onClick={toggleChat}
            className={`absolute bottom-20 right-4 w-12 h-12 rounded-full bg-gradient-to-r ${currentTheme.accent} text-white shadow-lg hover:scale-110 transition-transform duration-200`}
          >
            <MessageCircle className="w-5 h-5" />
          </Button>
        )}
      </div>
    </div>
  )
}

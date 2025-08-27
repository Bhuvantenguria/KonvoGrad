"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useVideoCall } from "@/hooks/use-video-call"
import { Video, VideoOff, Mic, MicOff, Phone, PhoneOff, Monitor } from "lucide-react"
import { cn } from "@/lib/utils"

interface VideoCallInterfaceProps {
  chatRoomId: string
  userId: string
  remoteUserId: string
  remoteUserName: string
  remoteUserAvatar?: string
  onCallEnd?: () => void
}

export function VideoCallInterface({
  chatRoomId,
  userId,
  remoteUserId,
  remoteUserName,
  remoteUserAvatar,
  onCallEnd,
}: VideoCallInterfaceProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)

  const {
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
  } = useVideoCall(chatRoomId, userId, remoteUserId)

  // Set up video streams
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

  const handleEndCall = async () => {
    await endCall()
    if (onCallEnd) {
      onCallEnd()
    }
  }

  if (error) {
    return (
      <Card className="p-6 text-center">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
            <VideoOff className="w-8 h-8 text-destructive" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Call Failed</h3>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </Card>
    )
  }

  if (isIncomingCall) {
    return (
      <Card className="p-6 text-center">
        <div className="space-y-4">
          <Avatar className="w-20 h-20 mx-auto">
            <AvatarImage src={remoteUserAvatar || "/placeholder.svg"} />
            <AvatarFallback className="text-lg">{remoteUserName?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-lg">{remoteUserName}</h3>
            <p className="text-sm text-muted-foreground">Incoming video call...</p>
          </div>
          <div className="flex space-x-4 justify-center">
            <Button onClick={acceptCall} className="bg-green-600 hover:bg-green-700">
              <Phone className="w-4 h-4 mr-2" />
              Accept
            </Button>
            <Button variant="destructive" onClick={rejectCall}>
              <PhoneOff className="w-4 h-4 mr-2" />
              Decline
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  if (!isCallActive && callStatus === "idle") {
    return (
      <Card className="p-6 text-center">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Video className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Start Video Call</h3>
            <p className="text-sm text-muted-foreground">Connect face-to-face with {remoteUserName}</p>
          </div>
          <Button onClick={startCall} size="lg">
            <Video className="w-4 h-4 mr-2" />
            Start Video Call
          </Button>
        </div>
      </Card>
    )
  }

  if (callStatus === "calling") {
    return (
      <Card className="p-6 text-center">
        <div className="space-y-4">
          <Avatar className="w-20 h-20 mx-auto">
            <AvatarImage src={remoteUserAvatar || "/placeholder.svg"} />
            <AvatarFallback className="text-lg">{remoteUserName?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-lg">Calling {remoteUserName}...</h3>
            <p className="text-sm text-muted-foreground">Waiting for them to answer</p>
          </div>
          <div className="flex space-x-1 justify-center">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          </div>
          <Button variant="destructive" onClick={handleEndCall}>
            <PhoneOff className="w-4 h-4 mr-2" />
            Cancel Call
          </Button>
        </div>
      </Card>
    )
  }

  if (callStatus === "ended") {
    return (
      <Card className="p-6 text-center">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
            <PhoneOff className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Call Ended</h3>
            <p className="text-sm text-muted-foreground">The video call has ended</p>
          </div>
        </div>
      </Card>
    )
  }

  // Active call interface
  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
      {/* Remote video (main) */}
      <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />

      {/* Local video (picture-in-picture) */}
      <div className="absolute top-4 right-4 w-48 h-36 bg-gray-900 rounded-lg overflow-hidden border-2 border-white/20">
        <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        {!isVideoEnabled && (
          <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
            <Avatar className="w-16 h-16">
              <AvatarFallback>You</AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>

      {/* Call status */}
      <div className="absolute top-4 left-4">
        <Badge variant="secondary" className="bg-black/50 text-white">
          {callStatus === "connected" ? "Connected" : "Connecting..."}
        </Badge>
      </div>

      {/* Remote user info */}
      {!remoteStream && (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
          <div className="text-center text-white">
            <Avatar className="w-24 h-24 mx-auto mb-4">
              <AvatarImage src={remoteUserAvatar || "/placeholder.svg"} />
              <AvatarFallback className="text-xl">{remoteUserName?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <h3 className="font-semibold text-lg">{remoteUserName}</h3>
            <p className="text-sm text-gray-400">Connecting...</p>
          </div>
        </div>
      )}

      {/* Call controls */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center space-x-4 bg-black/50 backdrop-blur-sm rounded-full px-6 py-3">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "rounded-full w-12 h-12",
              isAudioEnabled ? "bg-white/20 hover:bg-white/30 text-white" : "bg-red-600 hover:bg-red-700 text-white",
            )}
            onClick={toggleAudio}
          >
            {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "rounded-full w-12 h-12",
              isVideoEnabled ? "bg-white/20 hover:bg-white/30 text-white" : "bg-red-600 hover:bg-red-700 text-white",
            )}
            onClick={toggleVideo}
          >
            {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full w-12 h-12 bg-white/20 hover:bg-white/30 text-white"
          >
            <Monitor className="w-5 h-5" />
          </Button>

          <Button variant="destructive" size="icon" className="rounded-full w-12 h-12" onClick={handleEndCall}>
            <PhoneOff className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

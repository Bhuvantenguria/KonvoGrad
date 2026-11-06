"use client"

import { useUser } from "@clerk/nextjs"
import { useFirebaseUser } from "@/hooks/use-firebase-user"
import { useChat } from "@/hooks/use-chat"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, Users, Video, Settings, Zap, UserPlus, Copy, RefreshCw, Loader2, Sparkles, TrendingUp, Award, Heart, Star, Crown, Shield, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { NotificationCenter } from "@/components/notifications/notification-center"
import { SharedNavigation } from "@/components/ui/shared-navigation"
import { useTheme } from "@/components/theme-provider"
import Link from "next/link"
import { useState } from "react"

export default function DashboardPage() {
  const { user } = useUser()
  const { firebaseUser, loading: firebaseLoading, updateFirebaseUser } = useFirebaseUser()
  const { chatRooms, loading: chatLoading } = useChat(firebaseUser?.id || "")
  const { toast } = useToast()
  const { currentTheme, isDarkMode } = useTheme()

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
    })
  }

  const refreshSessionId = async () => {
    if (!firebaseUser) return

    const newSessionId = Math.random().toString(36).substring(2, 8).toUpperCase()
    await updateFirebaseUser({ sessionId: newSessionId })
    toast({
      title: "Session ID Refreshed",
      description: "Your session ID has been updated",
    })
  }

  if (firebaseLoading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? currentTheme.darkBackground : currentTheme.background} flex items-center justify-center`}>
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin`}></div>
          <span className="text-foreground font-medium">Loading your profile...</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? currentTheme.darkBackground : currentTheme.background}`}>
      <SharedNavigation currentPage="dashboard" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome Section */}
            <div className="space-y-4 fade-in">
              <div className="flex items-center space-x-4">
                <div className={`w-16 h-16 bg-gradient-to-r ${currentTheme.primary} rounded-2xl flex items-center justify-center shadow-2xl float-animation`}>
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h1 className="font-bold text-3xl text-foreground">Welcome back, {user?.firstName}!</h1>
                    {firebaseUser?.isVerified && (
                      <Badge className="bg-blue-500/20 text-blue-600 border border-blue-500/30 text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground">Ready to connect with professionals and expand your network?</p>
                </div>
              </div>
              {firebaseUser?.isOnline && (
                <Badge className="bg-green-500/20 text-green-600 border border-green-500/30">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  Online
                </Badge>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className={`${isDarkMode ? currentTheme.darkCard : currentTheme.card} border-2 hover:border-primary/20 transition-all duration-300 cursor-pointer card-hover group slide-in-left`}>
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-14 h-14 bg-gradient-to-r ${currentTheme.primary} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <Zap className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-foreground">Start Random Chat</CardTitle>
                      <CardDescription className="text-muted-foreground">Connect with a random professional</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button className={`w-full ${currentTheme.button} text-white font-semibold btn-animate`} asChild>
                    <Link href="/match">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Find Match
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className={`${isDarkMode ? currentTheme.darkCard : currentTheme.card} border-2 hover:border-primary/20 transition-all duration-300 cursor-pointer card-hover group slide-in-right`}>
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-14 h-14 bg-gradient-to-r ${currentTheme.secondary} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <Video className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-foreground">Video Chat</CardTitle>
                      <CardDescription className="text-muted-foreground">Start a video conversation</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    className={`w-full border-2 border-border/20 ${isDarkMode ? 'bg-slate-700/10 hover:bg-slate-700/20' : 'bg-white/10 hover:bg-white/20'} text-foreground font-semibold btn-animate`}
                    asChild
                  >
                    <Link href="/match">
                      <Video className="w-4 h-4 mr-2" />
                      Start Video
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Active Connections */}
            <Card className={`${isDarkMode ? currentTheme.darkCard : currentTheme.card} border-2 bounce-in`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 bg-gradient-to-r ${currentTheme.accent} rounded-xl flex items-center justify-center`}>
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-foreground">Active Connections</CardTitle>
                      <CardDescription className="text-muted-foreground">Your recent and ongoing conversations</CardDescription>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className={`border-2 border-border/20 ${isDarkMode ? 'bg-slate-700/10 hover:bg-slate-700/20' : 'bg-white/10 hover:bg-white/20'} text-foreground btn-animate`} asChild>
                    <Link href="/chat">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      View All
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {chatLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : chatRooms.length > 0 ? (
                  <div className="space-y-4">
                    {chatRooms.slice(0, 3).map((room, index) => {
                      const otherUserId = room.participants.find((id) => id !== firebaseUser?.id)
                      const otherParticipant = otherUserId ? room.participantDetails?.[otherUserId] : Object.values(room.participantDetails)[0]
                      const displayName = otherParticipant?.name || "Professional"

                      return (
                        <div
                          key={room.id}
                          className={`flex items-center justify-between p-4 border-2 border-border/20 rounded-xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'} backdrop-blur-sm hover:scale-105 transition-all duration-300`}
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-12 h-12 border-2 border-border/20 hover:scale-110 transition-transform duration-300">
                              <AvatarImage src={otherParticipant?.imageUrl || "/placeholder.svg"} />
                              <AvatarFallback className="bg-gradient-to-r from-white to-gray-200 font-bold">
                                {displayName[0] || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-foreground">{displayName}</p>
                              <p className="text-sm text-muted-foreground">
                                {otherParticipant?.role || "Professional"}
                              </p>
                              {room.lastMessage && (
                                <p className="text-xs text-muted-foreground truncate max-w-48">{room.lastMessage.text}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={room.isActive ? "bg-green-500/20 text-green-600 border border-green-500/30" : "bg-muted/50 text-muted-foreground"}>
                              {room.isActive ? "Active" : "Inactive"}
                            </Badge>
                            <Button size="sm" variant="outline" className={`border-2 border-border/20 ${isDarkMode ? 'bg-slate-700/10 hover:bg-slate-700/20' : 'bg-white/10 hover:bg-white/20'} text-foreground btn-animate`} asChild>
                              <Link href="/chat">
                                <MessageCircle className="w-4 h-4 mr-1" />
                                Chat
                              </Link>
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className={`w-16 h-16 bg-gradient-to-r ${currentTheme.primary} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg float-animation`}>
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-muted-foreground text-sm mb-4">No active connections yet</p>
                    <Button variant="ghost" size="sm" className={`${isDarkMode ? 'bg-slate-700/10 hover:bg-slate-700/20' : 'bg-white/10 hover:bg-white/20'} text-foreground btn-animate`} asChild>
                      <Link href="/match">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Find New Connections
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Summary */}
            <Card className={`${isDarkMode ? currentTheme.darkCard : currentTheme.card} border-2 slide-in-right`}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-gradient-to-r ${currentTheme.primary} rounded-xl flex items-center justify-center`}>
                    <Crown className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-xl text-foreground">Profile Summary</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12 border-2 border-border/20 hover:scale-110 transition-transform duration-300">
                    <AvatarImage src={user?.imageUrl || "/placeholder.svg"} />
                    <AvatarFallback className="bg-gradient-to-r from-white to-gray-200 font-bold">
                      {user?.firstName?.[0]}
                      {user?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <p className="font-medium text-foreground">{user?.fullName}</p>
                      {firebaseUser?.isVerified && (
                        <CheckCircle className="w-4 h-4 text-blue-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{firebaseUser?.role || "Professional"}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Session ID</span>
                    <div className="flex items-center space-x-1">
                      <code className="text-xs bg-muted/50 px-2 py-1 rounded border border-border/20">
                        {firebaseUser?.sessionId || "Loading..."}
                      </code>
                      <Button size="icon" variant="ghost" className="w-6 h-6 hover:scale-110 transition-transform duration-300" onClick={refreshSessionId}>
                        <RefreshCw className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Invite Code</span>
                    <div className="flex items-center space-x-1">
                      <code className="text-xs bg-muted/50 px-2 py-1 rounded border border-border/20">
                        {firebaseUser?.inviteCode || "Loading..."}
                      </code>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="w-6 h-6 hover:scale-110 transition-transform duration-300"
                        onClick={() => copyToClipboard(firebaseUser?.inviteCode || "", "Invite code")}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className={`w-full border-2 border-border/20 ${isDarkMode ? 'bg-slate-700/10 hover:bg-slate-700/20' : 'bg-white/10 hover:bg-white/20'} text-foreground btn-animate`}
                  size="sm"
                  asChild
                >
                  <Link href="/onboarding">
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className={`${isDarkMode ? currentTheme.darkCard : currentTheme.card} border-2 slide-in-right`} style={{ animationDelay: "200ms" }}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-gradient-to-r ${currentTheme.secondary} rounded-xl flex items-center justify-center`}>
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-xl text-foreground">Your Stats</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Connections Made</span>
                  <span className="font-medium text-foreground">{chatRooms.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Video Calls</span>
                  <span className="font-medium text-foreground">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Messages Sent</span>
                  <span className="font-medium text-foreground">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Profile Views</span>
                  <span className="font-medium text-foreground">0</span>
                </div>
              </CardContent>
            </Card>

            {/* Friend Invite */}
            <Card className={`${isDarkMode ? currentTheme.darkCard : currentTheme.card} border-2 slide-in-right`} style={{ animationDelay: "400ms" }}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-gradient-to-r ${currentTheme.accent} rounded-xl flex items-center justify-center`}>
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-foreground">Invite Friends</CardTitle>
                    <CardDescription className="text-muted-foreground">Share your invite code to connect directly</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button
                  className={`w-full border-2 border-border/20 ${isDarkMode ? 'bg-slate-700/10 hover:bg-slate-700/20' : 'bg-white/10 hover:bg-white/20'} text-foreground btn-animate`}
                  variant="outline"
                  onClick={() =>
                    copyToClipboard(`Join me on KonvoGrad: ${firebaseUser?.inviteCode || ""}`, "Invite link")
                  }
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Share Invite Code
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

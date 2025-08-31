"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useFirebaseUser } from "@/hooks/use-firebase-user"
import { useMatching } from "@/hooks/use-matching"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { MatchingInterface } from "@/components/matching/matching-interface"
import { SharedNavigation } from "@/components/ui/shared-navigation"
import { useTheme } from "@/components/theme-provider"
import { 
  Users, 
  Video, 
  MessageCircle, 
  Sparkles, 
  Zap, 
  Heart, 
  Star, 
  Crown, 
  Shield,
  Settings,
  Play,
  Pause,
  RotateCcw
} from "lucide-react"

export default function MatchPage() {
  const { user } = useUser()
  const { firebaseUser } = useFirebaseUser()
  const { isMatching, startMatching, stopMatching, currentMatch } = useMatching()
  const { toast } = useToast()
  const { currentTheme, isDarkMode } = useTheme()
  const [textOnlyMode, setTextOnlyMode] = useState(false)

  if (!firebaseUser) {
    return (
      <div className={`min-h-screen ${isDarkMode ? currentTheme.darkBackground : currentTheme.background} flex items-center justify-center`}>
        <div className="text-center">
          <div className={`w-16 h-16 bg-gradient-to-r ${currentTheme.primary} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}>
            <Users className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Loading Profile</h2>
          <p className="text-muted-foreground">Please wait while we load your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? currentTheme.darkBackground : currentTheme.background} transition-all duration-500`}>
      <SharedNavigation currentPage="match" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-8 fade-in">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className={`w-16 h-16 bg-gradient-to-r ${currentTheme.primary} rounded-2xl flex items-center justify-center shadow-2xl float-animation`}>
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Find Your Match</h1>
              <p className="text-muted-foreground">Connect with professionals instantly</p>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-4">
            <Badge className={`bg-gradient-to-r ${currentTheme.primary} text-white`}>
              <Shield className="w-3 h-3 mr-1" />
              Session {firebaseUser.sessionId?.slice(-6) || "Unknown"}
            </Badge>
            <Badge variant="outline" className="border-2 border-border/20">
              <Star className="w-3 h-3 mr-1" />
              {firebaseUser.role || "Professional"}
            </Badge>
          </div>
        </div>

        {/* Mode Selection */}
        <Card className={`${isDarkMode ? currentTheme.darkCard : currentTheme.card} border-2 mb-6 slide-in-left`}>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 bg-gradient-to-r ${currentTheme.secondary} rounded-xl flex items-center justify-center`}>
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-foreground">Chat Mode</CardTitle>
                <CardDescription className="text-muted-foreground">Choose your preferred communication style</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => setTextOnlyMode(false)}
                className={`h-20 flex flex-col items-center justify-center space-y-2 transition-all duration-300 ${
                  !textOnlyMode 
                    ? `bg-gradient-to-r ${currentTheme.primary} text-white shadow-lg` 
                    : `border-2 border-border/20 ${isDarkMode ? 'bg-slate-700/10 hover:bg-slate-700/20' : 'bg-white/10 hover:bg-white/20'} text-foreground`
                }`}
              >
                <Video className="w-6 h-6" />
                <span className="font-medium">Video + Chat</span>
              </Button>
              
              <Button
                onClick={() => setTextOnlyMode(true)}
                className={`h-20 flex flex-col items-center justify-center space-y-2 transition-all duration-300 ${
                  textOnlyMode 
                    ? `bg-gradient-to-r ${currentTheme.secondary} text-white shadow-lg` 
                    : `border-2 border-border/20 ${isDarkMode ? 'bg-slate-700/10 hover:bg-slate-700/20' : 'bg-white/10 hover:bg-white/20'} text-foreground`
                }`}
              >
                <MessageCircle className="w-6 h-6" />
                <span className="font-medium">Text Only</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Matching Interface */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Matching Controls */}
          <div className="space-y-6">
            <Card className={`${isDarkMode ? currentTheme.darkCard : currentTheme.card} border-2 slide-in-left`}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-gradient-to-r ${currentTheme.accent} rounded-xl flex items-center justify-center`}>
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-foreground">Quick Start</CardTitle>
                    <CardDescription className="text-muted-foreground">Begin matching with professionals</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <MatchingInterface 
                  isMatching={isMatching}
                  onStartMatching={startMatching}
                  onStopMatching={stopMatching}
                  textOnlyMode={textOnlyMode}
                />
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className={`${isDarkMode ? currentTheme.darkCard : currentTheme.card} border-2 slide-in-left`} style={{ animationDelay: "200ms" }}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-gradient-to-r ${currentTheme.primary} rounded-xl flex items-center justify-center`}>
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-foreground">Your Stats</CardTitle>
                    <CardDescription className="text-muted-foreground">Matching statistics</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-lg border-2 border-border/20">
                    <div className={`w-8 h-8 bg-gradient-to-r ${currentTheme.primary} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">0</p>
                    <p className="text-sm text-muted-foreground">Connections</p>
                  </div>
                  <div className="text-center p-4 rounded-lg border-2 border-border/20">
                    <div className={`w-8 h-8 bg-gradient-to-r ${currentTheme.secondary} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                      <Video className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">0</p>
                    <p className="text-sm text-muted-foreground">Video Calls</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Current Match */}
          <div className="space-y-6">
            <Card className={`${isDarkMode ? currentTheme.darkCard : currentTheme.card} border-2 slide-in-right`}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-gradient-to-r ${currentTheme.secondary} rounded-xl flex items-center justify-center`}>
                    <Crown className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-foreground">Current Match</CardTitle>
                    <CardDescription className="text-muted-foreground">Your active connection</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {currentMatch ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-16 h-16 border-2 border-border/20">
                        <AvatarImage src={currentMatch.avatar} />
                        <AvatarFallback className="bg-gradient-to-r from-white to-gray-200 font-bold text-lg">
                          {currentMatch.name?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-bold text-foreground">{currentMatch.name}</h3>
                        <p className="text-muted-foreground">{currentMatch.role}</p>
                        <Badge className={`mt-1 bg-gradient-to-r ${currentTheme.primary} text-white`}>
                          <Shield className="w-3 h-3 mr-1" />
                          Session {currentMatch.sessionId?.slice(-6) || "Unknown"}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button 
                        className={`flex-1 bg-gradient-to-r ${currentTheme.primary} text-white hover:scale-105 transition-transform duration-200`}
                        onClick={() => {
                          if (textOnlyMode) {
                            // Navigate to chat
                            window.location.href = `/chat`
                          } else {
                            // Navigate to video chat
                            window.location.href = `/video-chat/${currentMatch.chatRoomId}`
                          }
                        }}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        {textOnlyMode ? "Start Chat" : "Start Video"}
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className={`border-2 border-border/20 ${isDarkMode ? 'bg-slate-700/10 hover:bg-slate-700/20' : 'bg-white/10 hover:bg-white/20'} text-foreground hover:scale-105 transition-transform duration-200`}
                        onClick={stopMatching}
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Next
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className={`w-16 h-16 bg-gradient-to-r ${currentTheme.accent} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg float-animation`}>
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">No Active Match</h3>
                    <p className="text-muted-foreground mb-4">Start matching to find your next connection</p>
                    <Button 
                      className={`bg-gradient-to-r ${currentTheme.primary} text-white hover:scale-105 transition-transform duration-200`}
                      onClick={startMatching}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Matching
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className={`${isDarkMode ? currentTheme.darkCard : currentTheme.card} border-2 slide-in-right`} style={{ animationDelay: "200ms" }}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-gradient-to-r ${currentTheme.accent} rounded-xl flex items-center justify-center`}>
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-foreground">Pro Tips</CardTitle>
                    <CardDescription className="text-muted-foreground">Make the most of your connections</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className={`w-6 h-6 bg-gradient-to-r ${currentTheme.primary} rounded-full flex items-center justify-center mt-0.5`}>
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                  <p className="text-sm text-foreground">Be professional and respectful in your conversations</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className={`w-6 h-6 bg-gradient-to-r ${currentTheme.secondary} rounded-full flex items-center justify-center mt-0.5`}>
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                  <p className="text-sm text-foreground">Share your expertise and learn from others</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className={`w-6 h-6 bg-gradient-to-r ${currentTheme.accent} rounded-full flex items-center justify-center mt-0.5`}>
                    <span className="text-white text-xs font-bold">3</span>
                  </div>
                  <p className="text-sm text-foreground">Use the chat feature to exchange contact information</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

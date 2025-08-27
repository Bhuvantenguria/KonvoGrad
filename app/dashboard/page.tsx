"use client"

import { useUser } from "@clerk/nextjs"
import { useFirebaseUser } from "@/hooks/use-firebase-user"
import { useChat } from "@/hooks/use-chat"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, Users, Video, Settings, Zap, UserPlus, Copy, RefreshCw, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { NotificationCenter } from "@/components/notifications/notification-center"
import Link from "next/link"

export default function DashboardPage() {
  const { user } = useUser()
  const { firebaseUser, loading: firebaseLoading, updateFirebaseUser } = useFirebaseUser()
  const { chatRooms, loading: chatLoading } = useChat(firebaseUser?.id || "")
  const { toast } = useToast()

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="text-muted-foreground">Loading your profile...</span>
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
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-serif font-bold text-xl text-foreground">AlumniConnect</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="font-medium" asChild>
                <Link href="/chat">Messages</Link>
              </Button>
              <Button variant="ghost" className="font-medium" asChild>
                <Link href="/match">Match</Link>
              </Button>
              {firebaseUser && <NotificationCenter userId={firebaseUser.id} />}
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
              <Avatar className="w-8 h-8">
                <AvatarImage src={user?.imageUrl || "/placeholder.svg"} />
                <AvatarFallback>
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome Section */}
            <div className="space-y-2">
              <h1 className="font-serif font-bold text-3xl text-foreground">Welcome back, {user?.firstName}!</h1>
              <p className="text-muted-foreground">Ready to connect with professionals and expand your network?</p>
              {firebaseUser?.isOnline && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Online
                </Badge>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="border-border/50 hover:border-primary/20 transition-colors cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Zap className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="font-serif text-lg">Start Random Chat</CardTitle>
                      <CardDescription>Connect with a random professional</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" asChild>
                    <Link href="/match">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Find Match
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-border/50 hover:border-primary/20 transition-colors cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Video className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="font-serif text-lg">Video Chat</CardTitle>
                      <CardDescription>Start a video conversation</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Video className="w-4 h-4 mr-2" />
                    Start Video
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Active Connections */}
            <Card className="border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="font-serif">Active Connections</CardTitle>
                    <CardDescription>Your recent and ongoing conversations</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
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
                    {chatRooms.slice(0, 3).map((room) => (
                      <div
                        key={room.id}
                        className="flex items-center justify-between p-4 border border-border rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback>
                              {Object.values(room.participantDetails)[0]?.name?.[0] || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {Object.values(room.participantDetails)[0]?.name || "Unknown User"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {Object.values(room.participantDetails)[0]?.role || "Professional"}
                            </p>
                            {room.lastMessage && (
                              <p className="text-xs text-muted-foreground truncate max-w-48">{room.lastMessage.text}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={room.isActive ? "secondary" : "outline"}>
                            {room.isActive ? "Active" : "Inactive"}
                          </Badge>
                          <Button size="sm" variant="outline" asChild>
                            <Link href="/chat">
                              <MessageCircle className="w-4 h-4 mr-1" />
                              Chat
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground text-sm">No active connections yet</p>
                    <Button variant="ghost" size="sm" className="mt-2" asChild>
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
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="font-serif">Profile Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={user?.imageUrl || "/placeholder.svg"} />
                    <AvatarFallback>
                      {user?.firstName?.[0]}
                      {user?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user?.fullName}</p>
                    <p className="text-sm text-muted-foreground">{firebaseUser?.role || "Professional"}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Session ID</span>
                    <div className="flex items-center space-x-1">
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {firebaseUser?.sessionId || "Loading..."}
                      </code>
                      <Button size="icon" variant="ghost" className="w-6 h-6" onClick={refreshSessionId}>
                        <RefreshCw className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Invite Code</span>
                    <div className="flex items-center space-x-1">
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {firebaseUser?.inviteCode || "Loading..."}
                      </code>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="w-6 h-6"
                        onClick={() => copyToClipboard(firebaseUser?.inviteCode || "", "Invite code")}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full bg-transparent" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="font-serif">Your Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Connections Made</span>
                  <span className="font-medium">{chatRooms.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Video Calls</span>
                  <span className="font-medium">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Messages Sent</span>
                  <span className="font-medium">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Profile Views</span>
                  <span className="font-medium">0</span>
                </div>
              </CardContent>
            </Card>

            {/* Friend Invite */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="font-serif">Invite Friends</CardTitle>
                <CardDescription>Share your invite code to connect directly</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full bg-transparent"
                  variant="outline"
                  onClick={() =>
                    copyToClipboard(`Join me on AlumniConnect: ${firebaseUser?.inviteCode || ""}`, "Invite link")
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

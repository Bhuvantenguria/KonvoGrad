"use client"

import { MatchingInterface } from "@/components/matching/matching-interface"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, ArrowLeft, Zap, Shield, MessageCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function MatchPage() {
  const router = useRouter()

  const handleMatchFound = (chatRoomId: string) => {
    router.push("/chat")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="flex items-center space-x-2">
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm font-medium">Back to Dashboard</span>
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-serif font-bold text-xl text-foreground">KonvoGrad</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Matching Interface */}
          <div className="lg:col-span-2 space-y-6">
            <div className="text-center space-y-2">
              <h1 className="font-serif font-bold text-3xl text-foreground">Random Professional Matching</h1>
              <p className="text-muted-foreground">
                Connect instantly with verified alumni and developers from around the world
              </p>
            </div>

            <MatchingInterface onMatchFound={handleMatchFound} />

            {/* How it Works */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="font-serif">How Random Matching Works</CardTitle>
                <CardDescription>
                  Our intelligent matching system connects you with the right professionals
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                      <Zap className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-medium">1. Set Preferences</h3>
                    <p className="text-sm text-muted-foreground">
                      Choose the types of professionals you'd like to connect with
                    </p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                      <Shield className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-medium">2. Get Matched</h3>
                    <p className="text-sm text-muted-foreground">
                      Our system finds verified professionals who match your criteria
                    </p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                      <MessageCircle className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-medium">3. Start Chatting</h3>
                    <p className="text-sm text-muted-foreground">
                      Begin meaningful conversations and build professional relationships
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tips */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="font-serif">Matching Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Be Professional</h4>
                  <p className="text-xs text-muted-foreground">
                    Remember you're networking with verified professionals
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Ask Good Questions</h4>
                  <p className="text-xs text-muted-foreground">
                    Start with their background, current role, or industry insights
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Share Your Story</h4>
                  <p className="text-xs text-muted-foreground">
                    Be open about your goals and what you're looking to learn
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Exchange Contacts</h4>
                  <p className="text-xs text-muted-foreground">
                    If the conversation goes well, consider connecting on LinkedIn
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Safety */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="font-serif">Safety & Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="text-sm">All users are verified professionals</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Conversations are monitored for safety</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Report inappropriate behavior instantly</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Skip or end conversations anytime</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="font-serif">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                  <Link href="/chat">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    View Active Chats
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                  <Link href="/dashboard">
                    <Users className="w-4 h-4 mr-2" />
                    Back to Dashboard
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

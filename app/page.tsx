import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Users, Video, Shield, Zap, Globe } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
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
              <span className="font-serif font-bold text-xl text-foreground">KonvoGrad</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="font-medium">
                Features
              </Button>
              <Button variant="ghost" className="font-medium">
                About
              </Button>
              <Button variant="outline" className="font-medium bg-transparent" asChild>
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button className="font-medium" asChild>
                <Link href="/sign-up">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 font-medium">
            Professional Networking Platform
          </Badge>
          <h1 className="font-serif font-bold text-4xl sm:text-5xl lg:text-6xl text-foreground mb-6 leading-tight">
            Connect with Alumni & Developers
            <span className="text-primary block mt-2">Instantly</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Experience random matching with verified professionals, build meaningful connections, and grow your network
            through secure video and text conversations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="font-medium text-lg px-8 py-3" asChild>
              <Link href="/sign-up">
                <MessageCircle className="w-5 h-5 mr-2" />
                Start Chatting
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="font-medium text-lg px-8 py-3 bg-transparent">
              <Video className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-foreground mb-4">
              Professional Networking Made Simple
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Connect with verified alumni and developers through our secure platform designed for meaningful
              professional relationships.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border/50 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="font-serif text-xl">Random Matching</CardTitle>
                <CardDescription>
                  Connect instantly with verified professionals through our Omegle-style matching system.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="font-serif text-xl">Professional Verification</CardTitle>
                <CardDescription>
                  LinkedIn integration ensures you're connecting with real, verified professionals.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Video className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="font-serif text-xl">Video & Text Chat</CardTitle>
                <CardDescription>
                  Seamless video calling and text messaging with real-time notifications.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="font-serif text-xl">Friend Connections</CardTitle>
                <CardDescription>
                  Build lasting connections with invite codes and reconnect with past conversations.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="font-serif text-xl">Real-time Updates</CardTitle>
                <CardDescription>
                  Push notifications and live updates keep you connected to your network.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="font-serif text-xl">Secure & Moderated</CardTitle>
                <CardDescription>
                  Advanced moderation tools and admin oversight ensure a safe networking environment.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-foreground mb-6">
            Ready to Expand Your Professional Network?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of alumni and developers who are building meaningful professional relationships through
            KonvoGrad.
          </p>
          <Button size="lg" className="font-medium text-lg px-8 py-3" asChild>
            <Link href="/sign-up">
              <Users className="w-5 h-5 mr-2" />
              Join KonvoGrad
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-serif font-bold text-xl text-foreground">KonvoGrad</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Support
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © 2024 KonvoGrad. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

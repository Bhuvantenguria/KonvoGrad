import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Users, Video, Shield, Zap, Globe, Sparkles, ArrowRight, Star, Heart, Crown } from "lucide-react"
import Link from "next/link"
import { SharedNavigation } from "@/components/ui/shared-navigation"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <SharedNavigation showAuthButtons={true} showUserMenu={false} showNotifications={false} />

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 font-medium float-animation">
            <Sparkles className="w-4 h-4 mr-2" />
            Professional Networking Platform
          </Badge>
          
          <h1 className="font-bold text-4xl sm:text-5xl lg:text-6xl text-foreground mb-6 leading-tight">
            Connect with Alumni & Developers
            <span className="gradient-text block mt-2">Instantly</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Experience random matching with verified professionals, build meaningful connections, and grow your network
            through secure video and text conversations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="font-medium text-lg px-8 py-3 btn-animate hover-lift" asChild>
              <Link href="/sign-up">
                <MessageCircle className="w-5 h-5 mr-2" />
                Start Chatting
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="font-medium text-lg px-8 py-3 bg-transparent hover-lift btn-animate">
              <Video className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>
          
          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">10K+</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">50K+</div>
              <div className="text-sm text-muted-foreground">Connections Made</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">99%</div>
              <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-bold text-3xl sm:text-4xl text-foreground mb-4">
              Professional Networking Made Simple
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Connect with verified alumni and developers through our secure platform designed for meaningful
              professional relationships.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border/50 hover:border-primary/20 transition-colors card-hover group">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Random Matching</CardTitle>
                <CardDescription>
                  Connect instantly with verified professionals through our Omegle-style matching system.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:border-primary/20 transition-colors card-hover group">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Professional Verification</CardTitle>
                <CardDescription>
                  Optional LinkedIn integration allows members to showcase a verified checkmark badge to build trust.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:border-primary/20 transition-colors card-hover group">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Video className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Video & Text Chat</CardTitle>
                <CardDescription>
                  Seamless video calling and text messaging with real-time notifications.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:border-primary/20 transition-colors card-hover group">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Friend Connections</CardTitle>
                <CardDescription>
                  Build lasting connections with invite codes and reconnect with past conversations.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:border-primary/20 transition-colors card-hover group">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Real-time Updates</CardTitle>
                <CardDescription>
                  Push notifications and live updates keep you connected to your network.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:border-primary/20 transition-colors card-hover group">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Secure & Moderated</CardTitle>
                <CardDescription>
                  Advanced moderation tools and admin oversight ensure a safe networking environment.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 mb-4">
            <Star className="w-6 h-6 text-primary" />
            <Badge variant="secondary" className="font-medium">
              Join the Community
            </Badge>
            <Star className="w-6 h-6 text-primary" />
          </div>
          
          <h2 className="font-bold text-3xl sm:text-4xl text-foreground mb-6">
            Ready to Expand Your Professional Network?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of alumni and developers who are building meaningful professional relationships through
            KonvoGrad.
          </p>
          <Button size="lg" className="font-medium text-lg px-8 py-3 btn-animate hover-lift" asChild>
            <Link href="/sign-up">
              <Users className="w-5 h-5 mr-2" />
              Join KonvoGrad
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
          
          {/* Social proof */}
          <div className="mt-12 flex items-center justify-center space-x-8 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 bg-primary/20 rounded-full border-2 border-background"></div>
                <div className="w-8 h-8 bg-primary/30 rounded-full border-2 border-background"></div>
                <div className="w-8 h-8 bg-primary/40 rounded-full border-2 border-background"></div>
                <div className="w-8 h-8 bg-primary/50 rounded-full border-2 border-background"></div>
              </div>
              <span>Join 10,000+ professionals</span>
            </div>
          </div>
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
              <span className="font-bold text-xl text-foreground">KonvoGrad</span>
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

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useMatching } from "@/hooks/use-matching"
import { useFirebaseUser } from "@/hooks/use-firebase-user"
import { 
  Zap, 
  Users, 
  Loader2, 
  X, 
  MessageCircle, 
  RefreshCw, 
  Sparkles, 
  Crown, 
  Heart,
  Star,
  Shield
} from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

// Modern theme configurations (same as other components)
const themes = {
  modern: {
    primary: "from-indigo-500 to-purple-500",
    secondary: "from-pink-500 to-rose-500",
    accent: "from-cyan-500 to-blue-500",
    background: "bg-gradient-to-br from-slate-50 via-white to-slate-100",
    darkBackground: "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900",
    card: "bg-white/80 backdrop-blur-md border-white/20 shadow-lg",
    darkCard: "bg-slate-800/80 backdrop-blur-md border-slate-700/20 shadow-lg",
    button: "bg-white/10 hover:bg-white/20 text-slate-700",
    darkButton: "bg-slate-700/10 hover:bg-slate-700/20 text-slate-200",
  },
  elegant: {
    primary: "from-emerald-500 to-teal-500",
    secondary: "from-amber-500 to-orange-500",
    accent: "from-violet-500 to-purple-500",
    background: "bg-gradient-to-br from-emerald-50 via-white to-teal-50",
    darkBackground: "bg-gradient-to-br from-slate-900 via-emerald-900/20 to-slate-900",
    card: "bg-white/80 backdrop-blur-md border-emerald-200/20 shadow-lg",
    darkCard: "bg-slate-800/80 backdrop-blur-md border-emerald-700/20 shadow-lg",
    button: "bg-white/10 hover:bg-white/20 text-slate-700",
    darkButton: "bg-slate-700/10 hover:bg-slate-700/20 text-slate-200",
  },
  vibrant: {
    primary: "from-rose-500 to-pink-500",
    secondary: "from-orange-500 to-red-500",
    accent: "from-yellow-500 to-amber-500",
    background: "bg-gradient-to-br from-rose-50 via-white to-pink-50",
    darkBackground: "bg-gradient-to-br from-slate-900 via-rose-900/20 to-slate-900",
    card: "bg-white/80 backdrop-blur-md border-rose-200/20 shadow-lg",
    darkCard: "bg-slate-800/80 backdrop-blur-md border-rose-700/20 shadow-lg",
    button: "bg-white/10 hover:bg-white/20 text-slate-700",
    darkButton: "bg-slate-700/10 hover:bg-slate-700/20 text-slate-200",
  },
  minimal: {
    primary: "from-slate-500 to-gray-500",
    secondary: "from-zinc-500 to-neutral-500",
    accent: "from-stone-500 to-slate-500",
    background: "bg-gradient-to-br from-slate-50 via-white to-gray-50",
    darkBackground: "bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900",
    card: "bg-white/80 backdrop-blur-md border-slate-200/20 shadow-lg",
    darkCard: "bg-slate-800/80 backdrop-blur-md border-slate-700/20 shadow-lg",
    button: "bg-white/10 hover:bg-white/20 text-slate-700",
    darkButton: "bg-slate-700/10 hover:bg-slate-700/20 text-slate-200",
  }
}

interface MatchingInterfaceProps {
  onMatchFound?: (chatRoomId: string) => void
}

export function MatchingInterface({ onMatchFound }: MatchingInterfaceProps) {
  const { firebaseUser } = useFirebaseUser()
  const router = useRouter()
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [skipPrevious, setSkipPrevious] = useState(true)
  const [currentTheme, setCurrentTheme] = useState<keyof typeof themes>("modern")
  const [isDarkMode, setIsDarkMode] = useState(false)

  const theme = themes[currentTheme]

  const userDetails = firebaseUser
    ? {
        name: `Session ${firebaseUser.sessionId?.slice(-6) || firebaseUser.id?.slice(-6) || "Unknown"}`,
        role: firebaseUser.role,
        imageUrl: firebaseUser.imageUrl,
        skills: firebaseUser.skills,
        company: firebaseUser.company,
        sessionId: firebaseUser.sessionId,
      }
    : null

  const { isSearching, matchFound, error, startMatching, stopMatching, resetMatch } = useMatching(
    firebaseUser?.id || "",
    userDetails || ({} as any),
  )

  const roleOptions = [
    { value: "alumni", label: "Alumni", icon: Crown, color: "from-indigo-500 to-purple-500" },
    { value: "developer", label: "Developer", icon: Star, color: "from-emerald-500 to-teal-500" },
    { value: "student", label: "Student", icon: Sparkles, color: "from-rose-500 to-pink-500" },
    { value: "professional", label: "Professional", icon: Shield, color: "from-amber-500 to-orange-500" },
  ]

  const handleStartMatching = () => {
    startMatching({
      roles: selectedRoles,
      skipPreviousMatches: skipPrevious,
    })
  }

  const handleMatchFound = (chatRoomId: string) => {
    resetMatch()
    if (onMatchFound) {
      onMatchFound(chatRoomId)
    } else {
      router.push("/chat")
    }
  }

  if (matchFound) {
    return (
      <Card className={`${isDarkMode ? theme.darkCard : theme.card} border-2`}>
        <CardHeader className="text-center">
          <div className={`w-20 h-20 bg-gradient-to-r ${theme.primary} rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl`}>
            <Heart className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="font-bold text-2xl text-foreground mb-2">Match Found!</CardTitle>
          <CardDescription className="text-muted-foreground">You've been connected with a professional. Start the conversation!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex space-x-3">
            <Button 
              className={`flex-1 bg-gradient-to-r ${theme.primary} hover:opacity-90 text-white font-semibold`} 
              onClick={() => handleMatchFound(matchFound)}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Start Chatting
            </Button>
            <Button 
              variant="outline" 
              onClick={resetMatch}
              className="border-border/20 text-foreground hover:bg-muted/50"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isSearching) {
    return (
      <Card className={`${isDarkMode ? theme.darkCard : theme.card} border-2`}>
        <CardHeader className="text-center">
          <div className={`w-20 h-20 bg-gradient-to-r ${theme.primary} rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-pulse`}>
            <Loader2 className="w-10 h-10 text-white animate-spin" />
          </div>
          <CardTitle className="font-bold text-2xl text-foreground mb-2">Finding Your Match...</CardTitle>
          <CardDescription className="text-muted-foreground">We're connecting you with a professional who matches your preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-center space-x-3">
            <div className="flex space-x-2">
              <div className={`w-3 h-3 bg-gradient-to-r ${theme.primary} rounded-full animate-bounce`}></div>
              <div className={`w-3 h-3 bg-gradient-to-r ${theme.primary} rounded-full animate-bounce`} style={{ animationDelay: "0.1s" }}></div>
              <div className={`w-3 h-3 bg-gradient-to-r ${theme.primary} rounded-full animate-bounce`} style={{ animationDelay: "0.2s" }}></div>
            </div>
            <span className="text-sm text-muted-foreground">Searching for professionals...</span>
          </div>

          <Button 
            variant="outline" 
            onClick={stopMatching} 
            className="w-full border-border/20 text-foreground hover:bg-muted/50"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel Search
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`${isDarkMode ? theme.darkCard : theme.card} border-2`}>
      <CardHeader>
        <div className="flex items-center space-x-4">
          <div className={`w-14 h-14 bg-gradient-to-r ${theme.primary} rounded-xl flex items-center justify-center shadow-lg`}>
            <Zap className="w-7 h-7 text-white" />
          </div>
          <div>
            <CardTitle className="font-bold text-2xl text-foreground">Random Matching</CardTitle>
            <CardDescription className="text-muted-foreground">Connect instantly with verified professionals</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Role Preferences */}
        <div className="space-y-4">
          <Label className="text-sm font-medium text-foreground">Preferred Roles (Optional)</Label>
          <div className="grid grid-cols-2 gap-3">
            {roleOptions.map((role) => {
              const IconComponent = role.icon
              return (
                <div key={role.value} className="flex items-center space-x-3">
                  <Checkbox
                    id={role.value}
                    checked={selectedRoles.includes(role.value)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedRoles([...selectedRoles, role.value])
                      } else {
                        setSelectedRoles(selectedRoles.filter((r) => r !== role.value))
                      }
                    }}
                    className="border-border/20 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-indigo-500 data-[state=checked]:to-purple-500"
                  />
                  <Label htmlFor={role.value} className="text-sm cursor-pointer text-foreground">
                    <Badge className={`bg-gradient-to-r ${role.color} text-white text-xs px-3 py-1 font-medium`}>
                      <IconComponent className="w-3 h-3 mr-1" />
                      {role.label}
                    </Badge>
                  </Label>
                </div>
              )
            })}
          </div>
          {selectedRoles.length === 0 && (
            <p className="text-xs text-muted-foreground">Leave empty to match with any role</p>
          )}
        </div>

        <Separator className="bg-border/20" />

        {/* Additional Preferences */}
        <div className="space-y-4">
          <Label className="text-sm font-medium text-foreground">Matching Preferences</Label>
          <div className="flex items-center space-x-3">
            <Checkbox
              id="skipPrevious"
              checked={skipPrevious}
              onCheckedChange={(checked) => setSkipPrevious(checked as boolean)}
              className="border-border/20 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-indigo-500 data-[state=checked]:to-purple-500"
            />
            <Label htmlFor="skipPrevious" className="text-sm cursor-pointer text-foreground">
              Skip previous matches
            </Label>
          </div>
          <p className="text-xs text-muted-foreground">Avoid matching with people you've already talked to</p>
        </div>

        <Button 
          onClick={handleStartMatching} 
          disabled={!firebaseUser} 
          className={`w-full bg-gradient-to-r ${theme.primary} hover:opacity-90 text-white font-semibold py-3 text-lg`} 
          size="lg"
        >
          <Zap className="w-5 h-5 mr-2" />
          Find Random Match
        </Button>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            You'll be matched with verified professionals based on your preferences
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

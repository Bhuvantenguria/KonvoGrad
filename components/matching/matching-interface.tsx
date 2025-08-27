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
import { Zap, Users, Loader2, X, MessageCircle, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface MatchingInterfaceProps {
  onMatchFound?: (chatRoomId: string) => void
}

export function MatchingInterface({ onMatchFound }: MatchingInterfaceProps) {
  const { firebaseUser } = useFirebaseUser()
  const router = useRouter()
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [skipPrevious, setSkipPrevious] = useState(true)

  const userDetails = firebaseUser
    ? {
        name: `${firebaseUser.firstName} ${firebaseUser.lastName}`,
        role: firebaseUser.role,
        imageUrl: firebaseUser.imageUrl,
        skills: firebaseUser.skills,
        company: firebaseUser.company,
      }
    : null

  const { isSearching, matchFound, error, startMatching, stopMatching, resetMatch } = useMatching(
    firebaseUser?.id || "",
    userDetails || ({} as any),
  )

  const roleOptions = [
    { value: "alumni", label: "Alumni", color: "bg-blue-100 text-blue-800" },
    { value: "developer", label: "Developer", color: "bg-green-100 text-green-800" },
    { value: "student", label: "Student", color: "bg-purple-100 text-purple-800" },
    { value: "professional", label: "Professional", color: "bg-orange-100 text-orange-800" },
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
      <Card className="border-border/50">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="font-serif text-xl text-green-700">Match Found!</CardTitle>
          <CardDescription>You've been connected with a professional. Start the conversation!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Button className="flex-1" onClick={() => handleMatchFound(matchFound)}>
              <MessageCircle className="w-4 h-4 mr-2" />
              Start Chatting
            </Button>
            <Button variant="outline" onClick={resetMatch}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isSearching) {
    return (
      <Card className="border-border/50">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
          <CardTitle className="font-serif text-xl">Finding Your Match...</CardTitle>
          <CardDescription>We're connecting you with a professional who matches your preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            </div>
            <span className="text-sm text-muted-foreground">Searching for professionals...</span>
          </div>

          <Button variant="outline" onClick={stopMatching} className="w-full bg-transparent">
            <X className="w-4 h-4 mr-2" />
            Cancel Search
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Zap className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle className="font-serif text-xl">Random Matching</CardTitle>
            <CardDescription>Connect instantly with verified professionals</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Role Preferences */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Preferred Roles (Optional)</Label>
          <div className="grid grid-cols-2 gap-2">
            {roleOptions.map((role) => (
              <div key={role.value} className="flex items-center space-x-2">
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
                />
                <Label htmlFor={role.value} className="text-sm cursor-pointer">
                  <Badge variant="secondary" className={cn("text-xs", role.color)}>
                    {role.label}
                  </Badge>
                </Label>
              </div>
            ))}
          </div>
          {selectedRoles.length === 0 && (
            <p className="text-xs text-muted-foreground">Leave empty to match with any role</p>
          )}
        </div>

        <Separator />

        {/* Additional Preferences */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Matching Preferences</Label>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="skipPrevious"
              checked={skipPrevious}
              onCheckedChange={(checked) => setSkipPrevious(checked as boolean)}
            />
            <Label htmlFor="skipPrevious" className="text-sm cursor-pointer">
              Skip previous matches
            </Label>
          </div>
          <p className="text-xs text-muted-foreground">Avoid matching with people you've already talked to</p>
        </div>

        <Button onClick={handleStartMatching} disabled={!firebaseUser} className="w-full" size="lg">
          <Zap className="w-4 h-4 mr-2" />
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

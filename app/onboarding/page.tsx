"use client"

import { useState } from "react"
import { useUser, useClerk } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Users, Linkedin, ArrowRight, Plus, X } from "lucide-react"
import Link from "next/link"

export default function OnboardingPage() {
  const { user } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    role: "",
    company: "",
    position: "",
    college: "",
    graduationYear: "",
    skills: [] as string[],
    bio: "",
    linkedinUrl: "",
  })
  const [newSkill, setNewSkill] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }))
      setNewSkill("")
    }
  }

  const removeSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }))
  }

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)
    try {
      // Update user metadata with onboarding data
      await user?.update({
        publicMetadata: {
          ...formData,
          onboardingCompleted: true,
        },
      })
      router.push("/dashboard")
    } catch (error) {
      console.error("Error completing onboarding:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const connectLinkedIn = () => {
    // This would integrate with LinkedIn API in a real implementation
    alert("LinkedIn integration would be implemented here")
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-serif font-bold text-xl text-foreground">KonvoGrad</span>
          </Link>
          <h1 className="font-serif font-bold text-2xl text-foreground">Complete Your Profile</h1>
          <p className="text-muted-foreground">Help us connect you with the right professionals</p>

          {/* Progress indicator */}
          <div className="flex justify-center space-x-2 mt-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`w-3 h-3 rounded-full ${i <= step ? "bg-primary" : "bg-muted"}`} />
            ))}
          </div>
        </div>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="font-serif">
              {step === 1 && "Professional Information"}
              {step === 2 && "Skills & Experience"}
              {step === 3 && "LinkedIn Verification"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Tell us about your professional background"}
              {step === 2 && "Add your skills and write a brief bio"}
              {step === 3 && "Connect your LinkedIn for verification"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alumni">Alumni</SelectItem>
                      <SelectItem value="developer">Developer</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      placeholder="Your current company"
                      value={formData.company}
                      onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      placeholder="Your job title"
                      value={formData.position}
                      onChange={(e) => setFormData((prev) => ({ ...prev, position: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="college">College/University</Label>
                    <Input
                      id="college"
                      placeholder="Your alma mater"
                      value={formData.college}
                      onChange={(e) => setFormData((prev) => ({ ...prev, college: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="graduationYear">Graduation Year</Label>
                    <Input
                      id="graduationYear"
                      placeholder="2020"
                      value={formData.graduationYear}
                      onChange={(e) => setFormData((prev) => ({ ...prev, graduationYear: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Skills</Label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add a skill"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addSkill()}
                    />
                    <Button type="button" variant="outline" size="icon" onClick={addSkill}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="flex items-center space-x-1">
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself and your professional interests..."
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Linkedin className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-serif font-semibold text-lg">Connect LinkedIn</h3>
                    <p className="text-muted-foreground text-sm">
                      We'll verify your professional profile to ensure authentic connections
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedinUrl">LinkedIn Profile URL (Optional)</Label>
                  <Input
                    id="linkedinUrl"
                    placeholder="https://linkedin.com/in/yourprofile"
                    value={formData.linkedinUrl}
                    onChange={(e) => setFormData((prev) => ({ ...prev, linkedinUrl: e.target.value }))}
                  />
                </div>

                <Button type="button" variant="outline" className="w-full bg-transparent" onClick={connectLinkedIn}>
                  <Linkedin className="w-4 h-4 mr-2" />
                  Connect LinkedIn Account
                </Button>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <div className="flex space-x-2">
                {step > 1 && (
                  <Button variant="outline" onClick={() => setStep(step - 1)}>
                    Back
                  </Button>
                )}
                <Button variant="ghost" onClick={() => signOut()} className="text-muted-foreground">
                  Sign Out
                </Button>
              </div>

              {step < 3 ? (
                <Button onClick={handleNext} disabled={!formData.role}>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleComplete} disabled={isLoading}>
                  {isLoading ? "Completing..." : "Complete Setup"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

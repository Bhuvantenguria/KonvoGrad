"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useFirebaseUser } from "@/hooks/use-firebase-user"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { 
  User, 
  Building2, 
  FileText, 
  Linkedin, 
  Code, 
  Sparkles,
  CheckCircle,
  ArrowRight,
  Crown,
  Shield,
  Star
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useTheme } from "@/components/theme-provider"

export default function OnboardingPage() {
  const { user } = useUser()
  const { firebaseUser, updateFirebaseUser } = useFirebaseUser()
  const { toast } = useToast()
  const router = useRouter()
  const { currentTheme, isDarkMode } = useTheme()
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.emailAddresses[0]?.emailAddress || "",
    role: firebaseUser?.role || "professional",
    company: firebaseUser?.company || "",
    bio: firebaseUser?.bio || "",
    linkedinUrl: firebaseUser?.linkedinUrl || "",
    skills: firebaseUser?.skills || [],
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Ensure all fields have default values
      const cleanFormData = {
        firstName: formData.firstName || "",
        lastName: formData.lastName || "",
        email: formData.email || "",
        role: formData.role || "professional",
        company: formData.company || "",
        bio: formData.bio || "",
        linkedinUrl: formData.linkedinUrl || "",
        skills: formData.skills || [],
      }

      await updateFirebaseUser(cleanFormData)
      
      toast({
        title: "Profile Updated!",
        description: "Your profile has been successfully updated.",
      })
      
      router.push("/dashboard")
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addSkill = (skill: string) => {
    if (skill.trim() && !formData.skills.includes(skill.trim())) {
      handleInputChange("skills", [...formData.skills, skill.trim()])
    }
  }

  const removeSkill = (skillToRemove: string) => {
    handleInputChange("skills", formData.skills.filter(skill => skill !== skillToRemove))
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? currentTheme.darkBackground : currentTheme.background} flex items-center justify-center p-4`}>
      <div className="w-full max-w-2xl">
        <Card className={`${isDarkMode ? currentTheme.darkCard : currentTheme.card} border-2 shadow-lg bounce-in`}>
          <CardHeader className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <div className={`w-12 h-12 bg-gradient-to-r ${currentTheme.primary} rounded-xl flex items-center justify-center shadow-lg`}>
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl text-foreground">Complete Your Profile</CardTitle>
                <CardDescription className="text-muted-foreground">Let's get you set up for professional networking</CardDescription>
          </div>
        </div>
            
            <div className="flex items-center justify-center space-x-2">
              <Badge className={`bg-gradient-to-r ${currentTheme.primary} text-white`}>
                <Shield className="w-3 h-3 mr-1" />
                Session {firebaseUser?.sessionId?.slice(-6) || "Loading..."}
              </Badge>
              <Badge variant="outline" className="border-2 border-border/20">
                <Star className="w-3 h-3 mr-1" />
                Professional
              </Badge>
                 </div>
               </CardHeader>

               <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-lg text-foreground">Basic Information</h3>
                   </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-foreground">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className="border-2 border-border/20 bg-muted/50"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-foreground">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className="border-2 border-border/20 bg-muted/50"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="border-2 border-border/20 bg-muted/50"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-lg text-foreground">Professional Information</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-foreground">Role</Label>
                    <select
                         id="role"
                         value={formData.role}
                      onChange={(e) => handleInputChange("role", e.target.value)}
                      className="w-full p-3 border-2 border-border/20 bg-muted/50 rounded-md text-foreground"
                    >
                      <option value="professional">Professional</option>
                      <option value="student">Student</option>
                      <option value="entrepreneur">Entrepreneur</option>
                      <option value="freelancer">Freelancer</option>
                      <option value="consultant">Consultant</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-foreground">Company</Label>
                      <Input
                        id="company"
                        value={formData.company}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                      className="border-2 border-border/20 bg-muted/50"
                      placeholder="Enter your company"
                    />
                      </div>
                    </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-foreground">Bio</Label>
                  <textarea
                        id="bio"
                        value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    className="w-full p-3 border-2 border-border/20 bg-muted/50 rounded-md text-foreground resize-none"
                    rows={3}
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Code className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-lg text-foreground">Skills</h3>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="skillInput" className="text-foreground">Add Skills</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="skillInput"
                      className="border-2 border-border/20 bg-muted/50"
                      placeholder="Enter a skill"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addSkill(e.currentTarget.value)
                          e.currentTarget.value = ''
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById('skillInput') as HTMLInputElement
                        if (input) {
                          addSkill(input.value)
                          input.value = ''
                        }
                      }}
                      className={`bg-gradient-to-r ${currentTheme.primary} text-white btn-animate`}
                    >
                      Add
                        </Button>
                      </div>
                </div>

                {formData.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                          {formData.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="border-2 border-border/20 hover:scale-105 transition-transform duration-200 cursor-pointer"
                                  onClick={() => removeSkill(skill)}
                                >
                        {skill} ×
                              </Badge>
                          ))}
                      </div>
              )}
            </div>

              {/* LinkedIn */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Linkedin className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-lg text-foreground">LinkedIn Profile</h3>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="linkedinUrl" className="text-foreground">LinkedIn URL</Label>
                  <Input
                    id="linkedinUrl"
                    type="url"
                    value={formData.linkedinUrl}
                    onChange={(e) => handleInputChange("linkedinUrl", e.target.value)}
                    className="border-2 border-border/20 bg-muted/50"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
              </div>

              {/* Submit Button */}
                                 <Button 
                   type="submit"
                   disabled={isSubmitting}
                className={`w-full ${currentTheme.button} text-white font-semibold btn-animate`}
                 >
                  {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Updating Profile...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>Complete Profile</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                  )}
                </Button>
        </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

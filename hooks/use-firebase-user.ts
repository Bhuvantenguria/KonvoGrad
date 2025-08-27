"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import {
  createUser,
  getUserByClerkId,
  updateUser,
  updateUserOnlineStatus,
  generateSessionId,
  generateInviteCode,
  type User,
} from "@/lib/firebase-utils"

export function useFirebaseUser() {
  const { user: clerkUser, isLoaded } = useUser()
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoaded || !clerkUser) {
      setLoading(false)
      return
    }

    const initializeFirebaseUser = async () => {
      try {
        setLoading(true)
        setError(null)

        // Check if user exists in Firebase
        let user = await getUserByClerkId(clerkUser.id)

        if (!user) {
          // Create new user in Firebase
          const userData = {
            clerkId: clerkUser.id,
            email: clerkUser.emailAddresses[0]?.emailAddress || "",
            firstName: clerkUser.firstName || "",
            lastName: clerkUser.lastName || "",
            imageUrl: clerkUser.imageUrl,
            role: (clerkUser.publicMetadata?.role as User["role"]) || "professional",
            company: clerkUser.publicMetadata?.company as string,
            position: clerkUser.publicMetadata?.position as string,
            college: clerkUser.publicMetadata?.college as string,
            graduationYear: clerkUser.publicMetadata?.graduationYear as string,
            skills: (clerkUser.publicMetadata?.skills as string[]) || [],
            bio: clerkUser.publicMetadata?.bio as string,
            linkedinUrl: clerkUser.publicMetadata?.linkedinUrl as string,
            isVerified: false,
            isOnline: true,
            lastSeen: new Date() as any,
            sessionId: generateSessionId(),
            inviteCode: generateInviteCode(),
          }

          const userId = await createUser(userData)
          user = { id: userId, ...userData } as User
        } else {
          // Update existing user's online status and sync with Clerk data
          await updateUser(user.id, {
            firstName: clerkUser.firstName || user.firstName,
            lastName: clerkUser.lastName || user.lastName,
            imageUrl: clerkUser.imageUrl || user.imageUrl,
            isOnline: true,
          })

          // Update local user object
          user = {
            ...user,
            firstName: clerkUser.firstName || user.firstName,
            lastName: clerkUser.lastName || user.lastName,
            imageUrl: clerkUser.imageUrl || user.imageUrl,
            isOnline: true,
          }
        }

        setFirebaseUser(user)
      } catch (err) {
        console.error("Error initializing Firebase user:", err)
        setError("Failed to initialize user data")
      } finally {
        setLoading(false)
      }
    }

    initializeFirebaseUser()

    // Set up cleanup for when user goes offline
    const handleBeforeUnload = () => {
      if (firebaseUser) {
        updateUserOnlineStatus(firebaseUser.id, false)
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
      if (firebaseUser) {
        updateUserOnlineStatus(firebaseUser.id, false)
      }
    }
  }, [clerkUser, isLoaded])

  const updateFirebaseUser = async (updates: Partial<User>) => {
    if (!firebaseUser) return

    try {
      await updateUser(firebaseUser.id, updates)
      setFirebaseUser((prev) => (prev ? { ...prev, ...updates } : null))
    } catch (err) {
      console.error("Error updating Firebase user:", err)
      setError("Failed to update user data")
    }
  }

  return {
    firebaseUser,
    loading,
    error,
    updateFirebaseUser,
  }
}

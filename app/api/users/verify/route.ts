import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { updateUser, getUserByClerkId } from "@/lib/firebase-utils"

export async function POST(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { linkedinProfile } = await request.json()
    if (!linkedinProfile) {
      return NextResponse.json({ error: "LinkedIn profile data required" }, { status: 400 })
    }

    // Look up user by clerkId
    const existingUser = await getUserByClerkId(clerkId)
    if (!existingUser) {
      return NextResponse.json({ error: "User record not found" }, { status: 404 })
    }

    // Update user with LinkedIn verification data
    await updateUser(existingUser.id, {
      isVerified: true,
      linkedinUrl: linkedinProfile.id ? `https://linkedin.com/in/${linkedinProfile.id}` : existingUser.linkedinUrl,
      firstName: linkedinProfile.firstName || existingUser.firstName,
      lastName: linkedinProfile.lastName || existingUser.lastName,
    })

    return NextResponse.json({ 
      success: true, 
      message: "User verified successfully" 
    })
  } catch (error) {
    console.error("User verification error:", error)
    return NextResponse.json({ error: "Failed to verify user" }, { status: 500 })
  }
}

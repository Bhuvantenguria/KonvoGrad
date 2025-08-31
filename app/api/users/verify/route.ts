import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { updateUser } from "@/lib/firebase-utils"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { linkedinProfile } = await request.json()
    if (!linkedinProfile) {
      return NextResponse.json({ error: "LinkedIn profile data required" }, { status: 400 })
    }

    // Update user with LinkedIn verification data
    await updateUser(userId, {
      isVerified: true,
      linkedinUrl: `https://linkedin.com/in/${linkedinProfile.id}`,
      firstName: linkedinProfile.firstName,
      lastName: linkedinProfile.lastName,
      // You can add more fields here as needed
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

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")
    const state = searchParams.get("state")
    const error = searchParams.get("error")

    if (error) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/onboarding?error=linkedin_auth_failed`)
    }

    if (!code || !state) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/onboarding?error=missing_params`)
    }

    // Verify the state parameter matches the user ID
    const { userId } = await auth()
    if (!userId || userId !== state) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/onboarding?error=invalid_state`)
    }

    // Redirect to onboarding with the authorization code
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/onboarding?linkedin_code=${code}`)
  } catch (error) {
    console.error("LinkedIn callback error:", error)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/onboarding?error=callback_failed`)
  }
}

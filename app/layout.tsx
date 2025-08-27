import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk, DM_Sans } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import "./globals.css"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
  weight: ["400", "600", "700"],
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
  weight: ["400", "500"],
})

export const metadata: Metadata = {
  title: "AlumniConnect - Professional Networking Platform",
  description: "Connect with alumni and developers through random matching and professional networking",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: "oklch(0.45 0.15 142)",
          colorBackground: "oklch(0.98 0.01 142)",
          colorInputBackground: "oklch(1 0 0)",
          colorInputText: "oklch(0.25 0.01 142)",
          colorText: "oklch(0.25 0.01 142)",
          colorTextSecondary: "oklch(0.45 0.01 142)",
          colorSuccess: "oklch(0.45 0.15 142)",
          colorDanger: "oklch(0.577 0.245 27.325)",
          colorWarning: "oklch(0.65 0.18 142)",
          fontFamily: "var(--font-dm-sans)",
          fontFamilyButtons: "var(--font-space-grotesk)",
          fontSize: "16px",
          borderRadius: "0.5rem",
        },
      }}
    >
      <html lang="en" className={`${spaceGrotesk.variable} ${dmSans.variable} antialiased`}>
        <body className="font-sans">{children}</body>
      </html>
    </ClerkProvider>
  )
}

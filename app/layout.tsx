import type { Metadata } from "next"
import { ClerkProvider } from "@clerk/nextjs"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

export const metadata: Metadata = {
  title: "KonvoGrad - Professional Networking Platform",
  description: "Connect with alumni and developers through secure video and text conversations",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  keywords: ["networking", "professional", "alumni", "developers", "video chat", "matching"],
  authors: [{ name: "KonvoGrad Team" }],
  creator: "KonvoGrad",
  publisher: "KonvoGrad",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://konvo-grad.vercel.app/"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "KonvoGrad - Professional Networking Platform",
    description: "Connect with alumni and developers through secure video and text conversations",
    url: "https://konvograd.com",
    siteName: "KonvoGrad",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "KonvoGrad - Professional Networking Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KonvoGrad - Professional Networking Platform",
    description: "Connect with alumni and developers through secure video and text conversations",
    images: ["/og-image.jpg"],
    creator: "@konvograd",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Space+Grotesk:wght@300..700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#6366f1" />
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className="antialiased">
        <ClerkProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}

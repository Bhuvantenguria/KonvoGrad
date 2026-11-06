"use client"

import { useUser, SignOutButton } from "@clerk/nextjs"
import { useFirebaseUser } from "@/hooks/use-firebase-user"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { NotificationCenter } from "@/components/notifications/notification-center"
import { 
  Users, 
  MessageCircle, 
  Video, 
  Settings, 
  LogOut, 
  Bell,
  Shield,
  Palette,
  Moon,
  Sun,
  Sparkles,
  Zap,
  Heart,
  Star,
  Crown
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useTheme, themes } from "@/components/theme-provider"

interface SharedNavigationProps {
  currentPage?: string
  showAuthButtons?: boolean
  showUserMenu?: boolean
  showNotifications?: boolean
  showThemeToggle?: boolean
}

export function SharedNavigation({
  currentPage = "home",
  showAuthButtons = false,
  showUserMenu = true,
  showNotifications = true,
  showThemeToggle = true
}: SharedNavigationProps) {
  const { user } = useUser()
  const { firebaseUser } = useFirebaseUser()
  const { theme, setTheme, isDarkMode, setIsDarkMode, currentTheme } = useTheme()
  const [showThemeMenu, setShowThemeMenu] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)

  const isAdmin = (user?.publicMetadata as any)?.role === "admin" || 
    (user?.emailAddresses[0]?.emailAddress && user.emailAddresses[0].emailAddress.includes("admin")) || 
    firebaseUser?.role === "admin"

  const navigationItems = [
    { href: "/dashboard", label: "Dashboard", icon: Users, active: currentPage === "dashboard" },
    { href: "/chat", label: "Messages", icon: MessageCircle, active: currentPage === "chat" },
    { href: "/match", label: "Match", icon: Video, active: currentPage === "match" },
  ]

  return (
    <nav className={`border-b-2 border-border/20 ${isDarkMode ? currentTheme.darkCard : currentTheme.nav} sticky top-0 z-50 backdrop-blur-md`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="flex items-center space-x-3 group">
              <div className={`w-10 h-10 bg-gradient-to-r ${currentTheme.primary} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300 group-hover:rotate-12`}>
                <Users className="w-6 h-6 text-white group-hover:animate-pulse" />
              </div>
              <span className="font-bold text-xl text-foreground group-hover:text-primary transition-colors duration-300">
                KonvoGrad
              </span>
            </Link>

            {/* Navigation Links */}
            {showUserMenu && (
              <div className="hidden md:flex items-center space-x-1">
                {navigationItems.map((item) => {
                  const IconComponent = item.icon
                  return (
                    <Button
                      key={item.href}
                      variant="ghost"
                      className={cn(
                        "font-medium transition-all duration-300 relative overflow-hidden group",
                        item.active 
                          ? `bg-gradient-to-r ${currentTheme.primary} text-white shadow-lg hover:scale-105` 
                          : "hover:bg-muted/50 text-foreground hover:scale-105"
                      )}
                      asChild
                    >
                      <Link href={item.href}>
                        <IconComponent className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                        {item.label}
                        {item.active && (
                          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white rounded-full animate-pulse"></div>
                        )}
                      </Link>
                    </Button>
                  )
                })}

                {isAdmin && (
                  <Button
                    variant="ghost"
                    className={cn(
                      "font-medium transition-all duration-300 hover:scale-105",
                      currentPage === "admin"
                        ? `bg-gradient-to-r ${currentTheme.secondary} text-white shadow-lg`
                        : "hover:bg-muted/50 text-foreground"
                    )}
                    asChild
                  >
                    <Link href="/admin">
                      <Shield className="w-4 h-4 mr-2" />
                      Admin
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Session ID Badge */}
            {firebaseUser && (
              <Badge className={`bg-gradient-to-r ${currentTheme.primary} text-white font-mono font-bold px-3 py-1 hover:scale-105 transition-transform duration-300 cursor-pointer`}>
                <Shield className="w-3 h-3 mr-1 animate-pulse" />
                Session {firebaseUser.sessionId?.slice(-6) || firebaseUser.id?.slice(-6) || "Unknown"}
              </Badge>
            )}

            {/* Notifications */}
            {showNotifications && firebaseUser?.id && (
              <NotificationCenter userId={firebaseUser.id} />
            )}

            {/* Theme Toggle */}
            {showThemeToggle && (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowThemeMenu(!showThemeMenu)}
                  className="relative hover:scale-110 transition-transform duration-300"
                >
                  <Palette className="w-5 h-5" />
                </Button>

                {/* Theme Menu */}
                {showThemeMenu && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-lg p-3 z-50 animate-in slide-in-from-top-2 duration-200">
                    <div className="space-y-3">
                      {/* Dark Mode Toggle */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setIsDarkMode(!isDarkMode)
                          setShowThemeMenu(false)
                        }}
                        className="w-full justify-start hover:bg-muted/50 transition-colors duration-200"
                      >
                        {isDarkMode ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
                        {isDarkMode ? "Light Mode" : "Dark Mode"}
                      </Button>

                      <div className="border-t border-border/20 my-2"></div>

                      {/* Theme Selection */}
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground px-2 font-medium">Choose Theme</p>
                        {Object.entries(themes).map(([key, themeConfig]) => (
                          <Button
                            key={key}
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setTheme(key as keyof typeof themes)
                              setShowThemeMenu(false)
                            }}
                            className={cn(
                              "w-full justify-start hover:bg-muted/50 transition-all duration-200",
                              theme === key && "bg-muted/50 border-l-2 border-primary"
                            )}
                          >
                            <div className={`w-4 h-4 rounded bg-gradient-to-r ${themeConfig.primary} mr-2`}></div>
                            {themeConfig.name}
                            {theme === key && <Star className="w-3 h-3 ml-auto text-primary" />}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Settings Link */}
            <Button variant="ghost" size="icon" className="hover:scale-110 transition-transform duration-300" asChild>
              <Link href="/onboarding">
                <Settings className="w-5 h-5" />
              </Link>
            </Button>

            {/* User Menu */}
            {showUserMenu && user ? (
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar 
                    className="w-8 h-8 border-2 border-border/20 hover:scale-110 transition-transform cursor-pointer hover:border-primary/50" 
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                  >
                    <AvatarImage src={user.imageUrl || "/placeholder.svg"} />
                    <AvatarFallback className="bg-gradient-to-r from-white to-gray-200 font-bold">
                      {user.firstName?.[0]}
                      {user.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>

                  {/* User Dropdown */}
                  {showUserDropdown && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-lg p-2 z-50 animate-in slide-in-from-top-2 duration-200">
                      <div className="space-y-2">
                        <div className="px-3 py-2 border-b border-border/20">
                          <p className="font-medium text-foreground">{user.fullName}</p>
                          <p className="text-sm text-muted-foreground">{user.emailAddresses[0]?.emailAddress}</p>
                        </div>
                        
                        <SignOutButton>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                          </Button>
                        </SignOutButton>
                      </div>
                    </div>
                  )}
                </div>

                {/* Direct Logout Button */}
                <SignOutButton>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 hover:scale-110 transition-all duration-300"
                  >
                    <LogOut className="w-5 h-5" />
                  </Button>
                </SignOutButton>
              </div>
            ) : showAuthButtons ? (
              <div className="flex items-center space-x-3">
                <Button 
                  variant="outline" 
                  className="font-medium bg-transparent hover:scale-105 transition-transform duration-300" 
                  asChild
                >
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button 
                  className={`font-medium bg-gradient-to-r ${currentTheme.primary} text-white hover:scale-105 transition-transform duration-300`} 
                  asChild
                >
                  <Link href="/sign-up">Get Started</Link>
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showThemeMenu || showUserDropdown) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowThemeMenu(false)
            setShowUserDropdown(false)
          }}
        />
      )}
    </nav>
  )
}

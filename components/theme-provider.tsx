"use client"

import { createContext, useContext, useEffect, useState } from "react"

// Advanced theme configurations
export const themes = {
  modern: {
    name: "Modern",
    primary: "from-indigo-500 to-purple-500",
    secondary: "from-pink-500 to-rose-500",
    accent: "from-cyan-500 to-blue-500",
    background: "bg-gradient-to-br from-slate-50 via-white to-slate-100",
    darkBackground: "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900",
    card: "bg-white/80 backdrop-blur-md border-white/20 shadow-lg",
    darkCard: "bg-slate-800/80 backdrop-blur-md border-slate-700/20 shadow-lg",
    nav: "bg-white/80 backdrop-blur-md border-white/20",
    chat: "bg-white/90 backdrop-blur-md border-white/30",
    darkChat: "bg-slate-800/90 backdrop-blur-md border-slate-700/30",
    button: "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600",
    darkButton: "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
  },
  elegant: {
    name: "Elegant",
    primary: "from-emerald-500 to-teal-500",
    secondary: "from-amber-500 to-orange-500",
    accent: "from-violet-500 to-purple-500",
    background: "bg-gradient-to-br from-emerald-50 via-white to-teal-50",
    darkBackground: "bg-gradient-to-br from-slate-900 via-emerald-900/20 to-slate-900",
    card: "bg-white/80 backdrop-blur-md border-emerald-200/20 shadow-lg",
    darkCard: "bg-slate-800/80 backdrop-blur-md border-emerald-700/20 shadow-lg",
    nav: "bg-white/80 backdrop-blur-md border-emerald-200/20",
    chat: "bg-white/90 backdrop-blur-md border-emerald-200/30",
    darkChat: "bg-slate-800/90 backdrop-blur-md border-emerald-700/30",
    button: "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600",
    darkButton: "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
  },
  vibrant: {
    name: "Vibrant",
    primary: "from-rose-500 to-pink-500",
    secondary: "from-orange-500 to-red-500",
    accent: "from-yellow-500 to-amber-500",
    background: "bg-gradient-to-br from-rose-50 via-white to-pink-50",
    darkBackground: "bg-gradient-to-br from-slate-900 via-rose-900/20 to-slate-900",
    card: "bg-white/80 backdrop-blur-md border-rose-200/20 shadow-lg",
    darkCard: "bg-slate-800/80 backdrop-blur-md border-rose-700/20 shadow-lg",
    nav: "bg-white/80 backdrop-blur-md border-rose-200/20",
    chat: "bg-white/90 backdrop-blur-md border-rose-200/30",
    darkChat: "bg-slate-800/90 backdrop-blur-md border-rose-700/30",
    button: "bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600",
    darkButton: "bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700"
  },
  minimal: {
    name: "Minimal",
    primary: "from-slate-500 to-gray-500",
    secondary: "from-zinc-500 to-neutral-500",
    accent: "from-stone-500 to-slate-500",
    background: "bg-gradient-to-br from-slate-50 via-white to-gray-50",
    darkBackground: "bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900",
    card: "bg-white/80 backdrop-blur-md border-slate-200/20 shadow-lg",
    darkCard: "bg-slate-800/80 backdrop-blur-md border-slate-700/20 shadow-lg",
    nav: "bg-white/80 backdrop-blur-md border-slate-200/20",
    chat: "bg-white/90 backdrop-blur-md border-slate-200/30",
    darkChat: "bg-slate-800/90 backdrop-blur-md border-slate-700/30",
    button: "bg-gradient-to-r from-slate-500 to-gray-500 hover:from-slate-600 hover:to-gray-600",
    darkButton: "bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700"
  },
  cosmic: {
    name: "Cosmic",
    primary: "from-purple-500 to-indigo-500",
    secondary: "from-blue-500 to-cyan-500",
    accent: "from-pink-500 to-rose-500",
    background: "bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50",
    darkBackground: "bg-gradient-to-br from-slate-900 via-purple-900/20 to-indigo-900/20",
    card: "bg-white/80 backdrop-blur-md border-purple-200/20 shadow-lg",
    darkCard: "bg-slate-800/80 backdrop-blur-md border-purple-700/20 shadow-lg",
    nav: "bg-white/80 backdrop-blur-md border-purple-200/20",
    chat: "bg-white/90 backdrop-blur-md border-purple-200/30",
    darkChat: "bg-slate-800/90 backdrop-blur-md border-purple-700/30",
    button: "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600",
    darkButton: "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
  },
  sunset: {
    name: "Sunset",
    primary: "from-orange-500 to-red-500",
    secondary: "from-pink-500 to-rose-500",
    accent: "from-yellow-500 to-orange-500",
    background: "bg-gradient-to-br from-orange-50 via-red-50 to-pink-50",
    darkBackground: "bg-gradient-to-br from-slate-900 via-orange-900/20 to-red-900/20",
    card: "bg-white/80 backdrop-blur-md border-orange-200/20 shadow-lg",
    darkCard: "bg-slate-800/80 backdrop-blur-md border-orange-700/20 shadow-lg",
    nav: "bg-white/80 backdrop-blur-md border-orange-200/20",
    chat: "bg-white/90 backdrop-blur-md border-orange-200/30",
    darkChat: "bg-slate-800/90 backdrop-blur-md border-orange-700/30",
    button: "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600",
    darkButton: "bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
  }
}

type Theme = keyof typeof themes

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  isDarkMode: boolean
  setIsDarkMode: (dark: boolean) => void
  currentTheme: typeof themes[Theme]
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("modern")
  const [isDarkMode, setIsDarkMode] = useState(false)

  const currentTheme = themes[theme]

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("konvograd-theme") as Theme
    const savedDarkMode = localStorage.getItem("konvograd-dark-mode")
    
    if (savedTheme && themes[savedTheme]) {
      setTheme(savedTheme)
    }
    
    if (savedDarkMode) {
      setIsDarkMode(savedDarkMode === "true")
    }
  }, [])

  // Save theme to localStorage
  useEffect(() => {
    localStorage.setItem("konvograd-theme", theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem("konvograd-dark-mode", isDarkMode.toString())
    
    // Apply dark mode to document
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty("--current-theme", theme)
    
    // Add theme class for CSS targeting
    root.className = root.className.replace(/theme-\w+/g, "")
    root.classList.add(`theme-${theme}`)
  }, [theme])

  const value = {
    theme,
    setTheme,
    isDarkMode,
    setIsDarkMode,
    currentTheme
  }

  return (
    <ThemeContext.Provider value={value}>
      <div className={`theme-transition ${isDarkMode ? currentTheme.darkBackground : currentTheme.background}`}>
      {children}
      </div>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

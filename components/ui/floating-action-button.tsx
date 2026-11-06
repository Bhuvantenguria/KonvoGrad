"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"
import { motion } from "framer-motion"

interface FloatingActionButtonProps {
  icon: LucideIcon
  onClick: () => void
  label?: string
  className?: string
  variant?: "primary" | "secondary" | "accent"
  size?: "sm" | "md" | "lg"
}

export function FloatingActionButton({
  icon: Icon,
  onClick,
  label,
  className,
  variant = "primary",
  size = "md",
}: FloatingActionButtonProps) {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-14 h-14",
    lg: "w-16 h-16",
  }

  const iconSizes = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-7 h-7",
  }

  const variantClasses = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-lg hover:shadow-xl",
    accent: "bg-accent text-accent-foreground hover:bg-accent/80 shadow-lg hover:shadow-xl",
  }

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.3, type: "spring" }}
    >
      <Button
        onClick={onClick}
        className={cn(
          "rounded-full p-0 transition-all duration-300 hover:scale-110 active:scale-95",
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
      >
        <Icon className={iconSizes[size]} />
        {label && (
          <motion.span
            className="absolute right-full mr-3 whitespace-nowrap bg-foreground text-background px-3 py-1 rounded-lg text-sm font-medium"
            initial={{ opacity: 0, x: 10 }}
            whileHover={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.span>
        )}
      </Button>
    </motion.div>
  )
}

export function FloatingActionMenu({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      className={cn("fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-3", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}

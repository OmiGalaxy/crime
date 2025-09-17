"use client"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex w-full rounded-lg bg-muted p-1">
        <Button variant="ghost" size="sm" className="flex-1 h-8">
          <Sun className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="flex-1 h-8">
          <Moon className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="flex-1 h-8">
          <Monitor className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="flex w-full rounded-lg bg-muted p-1">
      <Button
        variant={theme === "light" ? "default" : "ghost"}
        size="sm"
        onClick={() => setTheme("light")}
        className="flex-1 h-8"
      >
        <Sun className="h-4 w-4" />
      </Button>
      <Button
        variant={theme === "dark" ? "default" : "ghost"}
        size="sm"
        onClick={() => setTheme("dark")}
        className="flex-1 h-8"
      >
        <Moon className="h-4 w-4" />
      </Button>
      <Button
        variant={theme === "system" ? "default" : "ghost"}
        size="sm"
        onClick={() => setTheme("system")}
        className="flex-1 h-8"
      >
        <Monitor className="h-4 w-4" />
      </Button>
    </div>
  )
}

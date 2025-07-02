"use client"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="p-2">
          <Sun className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" className="p-2">
          <Moon className="w-4 h-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setTheme("light")}
        className={`p-2 transition-colors ${resolvedTheme === "light" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}
      >
        <Sun className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setTheme("dark")}
        className={`p-2 transition-colors ${resolvedTheme === "dark" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}
      >
        <Moon className="w-4 h-4" />
      </Button>
    </div>
  )
}

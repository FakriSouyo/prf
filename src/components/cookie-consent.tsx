"use client"
import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent")
    if (!consent) {
      setIsVisible(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted")
    setIsVisible(false)
  }

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined")
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <Card className="fixed z-50 p-4 bg-white dark:bg-zinc-950 border-zinc-300/80 dark:border-zinc-600/80 border-2 border-dashed md:max-w-sm md:bottom-4 md:right-4 md:left-auto md:rounded-2xl bottom-0 left-0 right-0 w-full rounded-none">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-medium text-sm">Privacy Policy</h3>
          <Button variant="ghost" size="sm" className="p-1 h-auto" onClick={handleDecline}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
          This site uses Google Analytics to improve your experience. Only anonymized data is collected with your
          consent.
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleDecline} className="text-xs bg-transparent">
            Decline
          </Button>
          <Button size="sm" onClick={handleAccept} className="text-xs">
            Accept
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"
import { Button } from '@/components/ui/button'
import { Share2 } from 'lucide-react'
import { toast } from 'sonner'

interface ShareButtonProps {
  title: string
  description: string
}

export function ShareButton({ title, description }: ShareButtonProps) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: window.location.href,
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href)
        toast.success('Link copied to clipboard!')
      } catch (error) {
        console.error('Error copying to clipboard:', error)
        toast.error('Failed to copy link')
      }
    }
  }

  return (
    <Button variant="outline" onClick={handleShare}>
      <Share2 className="w-4 h-4 mr-2" />
      Share
    </Button>
  )
}

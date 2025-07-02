"use client"
import { useState, useEffect, useRef } from "react"
import { motion, useMotionValue, useTransform, type PanInfo } from "framer-motion"
import { X, Calendar, Bookmark, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShareModal } from "@/components/share-modal"
import type { BlogPost } from "@/data/blog"

interface BlogSheetProps {
  post: BlogPost | null
  onClose: () => void
}

export function BlogSheet({ post, onClose }: BlogSheetProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const y = useMotionValue(0)
  const constraintsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (post) {
      setIsVisible(true)
      setIsFullScreen(false) // Reset ke half screen setiap kali dibuka
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [post])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      setIsFullScreen(false) // Reset state saat tutup
      onClose()
    }, 300)
  }

  const handleDragEnd = (event: any, info: PanInfo) => {
    const shouldClose = info.velocity.y > 500 || info.offset.y > 200
    const shouldFullScreen = info.velocity.y < -500 || info.offset.y < -150

    if (shouldClose) {
      handleClose()
    } else if (shouldFullScreen && !isFullScreen) {
      setIsFullScreen(true)
    } else if (!shouldClose && !shouldFullScreen) {
      // Snap back to current position
      y.set(0)
    }
  }

  const handleBookmark = () => {
    if (!post) return

    // Add bookmark to browser
    const url = `${window.location.origin}/blog/${post.id}`
    const title = post.title

    // Type assertion for browser-specific properties
    const win = window as any;
    
    // Try to add bookmark (works in some browsers)
    if (win.sidebar?.addPanel) {
      // Firefox
      win.sidebar.addPanel(title, url, "")
    } else if (win.external?.AddFavorite) {
      // Internet Explorer
      win.external.AddFavorite(url, title)
    } else {
      // For other browsers, we can't directly add bookmarks due to security restrictions
      // So we'll copy the URL and show a message
      navigator.clipboard
        .writeText(url)
        .then(() => {
          alert(`Bookmark saved! Press Ctrl+D (Cmd+D on Mac) to bookmark this page.\nURL copied to clipboard: ${url}`)
        })
        .catch(() => {
          alert(`Press Ctrl+D (Cmd+D on Mac) to bookmark this page: ${title}`)
        })
    }
  }

  const handleShare = () => {
    setShowShareModal(true)
  }

  if (!post) return null

  const currentUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/blog/${post.id}`

  return (
    <>
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ${
          isVisible ? "bg-black/50 backdrop-blur-sm" : "bg-black/0 backdrop-blur-none"
        }`}
        onClick={(e) => e.target === e.currentTarget && handleClose()}
      >
        <motion.div
          ref={constraintsRef}
          className="absolute inset-0"
          initial={{ y: "100%" }}
          animate={{
            y: isVisible ? (isFullScreen ? 0 : "30%") : "100%",
          }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
        >
          <motion.div
            className="relative h-full bg-background rounded-t-3xl shadow-2xl overflow-hidden flex flex-col"
            drag="y"
            dragConstraints={constraintsRef}
            dragElastic={0.1}
            onDragEnd={handleDragEnd}
            style={{ y }}
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-4 pb-2">
              <div className="w-12 h-1 bg-muted-foreground/30 rounded-full cursor-grab active:cursor-grabbing" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-900 to-blue-700 rounded-lg" />
                <div>
                  <h2 className="font-semibold text-lg">{post.title}</h2>
                  <p className="text-sm text-muted-foreground">{post.subtitle}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                {/* Meta Information */}
                <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Featured Image */}
                <div className="aspect-video bg-gradient-to-br from-blue-900 to-blue-700 rounded-lg mb-6" />

                {/* Article Content */}
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  <p className="text-muted-foreground mb-4">{post.description}</p>

                  <h3>Introduction</h3>
                  <p>
                    This is a sample blog post content. In a real implementation, you would fetch the full content from
                    your CMS or markdown files. The content would be much longer and include various sections, code
                    examples, images, and more detailed explanations.
                  </p>

                  <h3>Key Points</h3>
                  <ul>
                    <li>First important point about the topic</li>
                    <li>Second key insight or finding</li>
                    <li>Third crucial element to understand</li>
                    <li>Fourth consideration for implementation</li>
                  </ul>

                  <h3>Technical Details</h3>
                  <p>
                    Here you would include more technical information, code snippets, diagrams, and detailed
                    explanations of the concepts discussed in the blog post. This section would be comprehensive and
                    provide real value to readers.
                  </p>

                  <h3>Conclusion</h3>
                  <p>
                    A summary of the key takeaways and next steps for readers who want to implement or learn more about
                    the topic discussed in this blog post.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mt-8 pt-6 border-t border-border">
                  <Button variant="outline" onClick={handleShare}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" onClick={handleBookmark}>
                    <Bookmark className="w-4 h-4 mr-2" />
                    Bookmark
                  </Button>
                </div>
              </div>
            </div>

            {/* Pull Indicator - Only show when not full screen */}
            {!isFullScreen && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="flex flex-col items-center text-muted-foreground">
                  <div className="text-xs mb-1">Pull up for full screen</div>
                  <div className="w-6 h-6 border-2 border-muted-foreground/30 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-muted-foreground/30 rounded-full" />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title={post?.title || ""}
        url={currentUrl}
      />
    </>
  )
}
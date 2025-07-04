"use client"

import { X, ExternalLink, Github } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { motion, useMotionValue, useTransform, type PanInfo } from "framer-motion"
import { Button } from "./ui/button"

interface ProjectDetailProps {
  project: {
    title: string
    subtitle: string
    image: string
    link: string
    description: string
    technologies: string[]
    github?: string
  }
  onClose: () => void
}

export function ProjectDetail({ project, onClose }: ProjectDetailProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const y = useMotionValue(0)
  const opacity = useTransform(y, [-100, 0, 100], [0.6, 1, 0.6])
  const constraintsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsVisible(true)
    setIsFullScreen(false)
    document.body.style.overflow = "hidden"
    
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      setIsFullScreen(false)
      onClose()
    }, 300)
  }

  const handleDragStart = () => {
    setIsDragging(true)
  }

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false)
    
    if (Math.abs(info.offset.y) < 10) {
      y.set(0)
      return
    }

    const threshold = 200
    const velocityThreshold = 1500
    
    const shouldClose = info.velocity.y > velocityThreshold || info.offset.y > threshold
    const shouldFullScreen = info.velocity.y < -velocityThreshold || info.offset.y < -threshold

    if (shouldClose && !isFullScreen) {
      handleClose()
    } else if (shouldFullScreen && !isFullScreen) {
      setIsFullScreen(true)
    } else if (shouldClose && isFullScreen) {
      setIsFullScreen(false)
    } else {
      y.set(0)
    }
  }

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ${
        isVisible ? "bg-black/50 backdrop-blur-sm" : "bg-black/0 backdrop-blur-none"
      }`}
      onClick={(e) => !isDragging && e.target === e.currentTarget && handleClose()}
    >
      <motion.div
        ref={constraintsRef}
        className="absolute inset-0"
        initial={{ y: "100%" }}
        animate={{
          y: isVisible ? (isFullScreen ? 0 : "30%") : "100%",
        }}
        transition={{ 
          type: "spring", 
          damping: 30, 
          stiffness: 250,
          mass: 1
        }}
      >
        <motion.div
          className="relative h-full bg-white dark:bg-neutral-900 rounded-t-3xl shadow-2xl overflow-hidden flex flex-col"
          drag={isFullScreen ? false : "y"}
          dragDirectionLock
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.4}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          dragMomentum={false}
          dragTransition={{ 
            bounceStiffness: 400,
            bounceDamping: 40
          }}
          style={{ y }}
          onClick={e => e.stopPropagation()}
        >
          {/* Drag Handle */}
          <div 
            className="flex justify-center pt-4 pb-2 cursor-grab active:cursor-grabbing"
            onPointerDown={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
          >
            <div className="w-12 h-1 bg-muted-foreground/30 rounded-full" />
          </div>

          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
              <h2 className="text-lg font-semibold">{project.title}</h2>
            </div>
            <div className="flex space-x-2">
              {project.github && (
                <Button
                  variant="outline"
                  className="h-9 px-0 sm:px-4"
                  asChild
                >
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    aria-label="Code"
                    className="flex items-center"
                  >
                    <Github className="h-4 w-4" />
                    <span className="hidden sm:inline ml-2">Code</span>
                  </a>
                </Button>
              )}
              <Button
                className="h-9 px-0 sm:px-4"
                asChild
                variant="outline"
              >
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  aria-label="Open in New Tab"
                  className="flex items-center"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span className="hidden sm:inline ml-2">Open in New Tab</span>
                </a>
              </Button>
            </div>
          </div>

          {/* Website Preview */}
          <motion.div 
            className="flex-1 relative"
            style={{ opacity }}
          >
            <iframe
              src={project.link}
              className="w-full h-full border-0"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              allowFullScreen
              loading="lazy"
            />
          </motion.div>

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
  )
}
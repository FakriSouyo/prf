"use client"

import { X, ExternalLink, Github } from "lucide-react"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
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

  useEffect(() => {
    // Trigger animation after mount
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 10)
    
    document.body.style.overflow = "hidden"
    return () => {
      clearTimeout(timer)
      document.body.style.overflow = "unset"
    }
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      onClose()
    }, 300)
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={handleClose}
      >
        <motion.div
          className="fixed left-0 right-0 top-0 bottom-0 md:top-[10%] md:bottom-[10%] bg-white dark:bg-neutral-900 rounded-t-3xl md:rounded-b-3xl overflow-hidden flex flex-col shadow-2xl"
          initial={{ y: '100%' }}
          animate={{ y: isVisible ? '0%' : '100%' }}
          exit={{ y: '100%' }}
          transition={{
            type: 'spring',
            damping: 30,
            stiffness: 300
          }}
          onClick={(e) => e.stopPropagation()}
        >
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
                <Button variant="outline" size="sm" asChild>
                  <a 
                    href={project.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Github className="h-4 w-4 mr-2" />
                    Code
                  </a>
                </Button>
              )}
              <Button size="sm" asChild>
                <a 
                  href={project.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in New Tab
                </a>
              </Button>
            </div>
          </div>

          {/* Website Preview */}
          <div className="flex-1 relative">
            <iframe
              src={project.link}
              className="w-full h-full border-0"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

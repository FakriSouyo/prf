"use client"
import { X, ExternalLink, Github } from "lucide-react"
import type React from "react"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { ProjectDetail } from "@/components/project-detail"
import { motion } from "framer-motion"

interface ProjectModalProps {
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

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [showDetail, setShowDetail] = useState(false)

  useEffect(() => {
    // Trigger animation after component mounts
    setIsVisible(true)

    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [])

  const handleClose = () => {
    if (showDetail) {
      setShowDetail(false)
      return
    }
    
    setIsVisible(false)
    // Delay actual close to allow animation to complete
    setTimeout(() => {
      onClose()
    }, 300)
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ease-out ${
        isVisible ? "bg-black/50 backdrop-blur-sm" : "bg-black/0 backdrop-blur-none"
      }`}
      onClick={handleBackdropClick}
    >
      <Card
        className={`w-full max-w-[500px] h-fit max-h-[85vh] sm:max-h-[90vh] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden transition-all duration-300 ease-out transform ${
          isVisible ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4"
        }`}
      >
        <CardContent className="p-0">
          <div className="relative">
            <Image
              src={project.image || "/placeholder.svg"}
              alt={project.title}
              width={800}
              height={400}
              className="w-full h-48 sm:h-64 object-cover"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white transition-all duration-200 hover:scale-110"
              onClick={handleClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="p-4 sm:p-6">
            <motion.div
              className="flex justify-between items-start mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div>
                <motion.h2
                  className="text-xl sm:text-2xl font-semibold mb-1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {project.title}
                </motion.h2>
                <motion.p
                  className="text-sm sm:text-base text-muted-foreground"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {project.subtitle}
                </motion.p>
              </div>
              <motion.div
                className="flex gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {/* Desktop Buttons */}
                {project.github && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="hidden sm:flex hover:scale-105 transition-transform duration-200"
                    onClick={() => window.open(project.github, '_blank')}
                  >
                    <Github className="w-4 h-4" />
                  </Button>
                )}
                <Button 
                  className="hidden sm:flex hover:scale-105 transition-transform duration-200"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowDetail(true)
                  }}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visit
                </Button>

                {/* Mobile Buttons */}
                <div className="flex gap-2 sm:hidden">
                  {project.github && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:scale-105 transition-transform duration-200"
                      onClick={() => window.open(project.github, '_blank')}
                    >
                      <Github className="w-4 h-4" />
                    </Button>
                  )}
                  <Button 
                    className="hover:scale-105 transition-transform duration-200"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowDetail(true)
                    }}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            </motion.div>

            <motion.p
              className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 line-clamp-3 sm:line-clamp-none leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {project.description}
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-1.5 sm:gap-2"
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.08,
                    delayChildren: 0.6
                  }
                }
              }}
            >
              {project.technologies.map((tech, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4 }}
                >
                  <Badge
                    variant="secondary"
                    className="text-xs sm:text-sm hover:scale-105 transition-transform duration-200"
                  >
                    {tech}
                  </Badge>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </CardContent>
      </Card>

      {showDetail && (
        <ProjectDetail
          project={project}
          onClose={() => setShowDetail(false)}
        />
      )}
    </div>
  )
}

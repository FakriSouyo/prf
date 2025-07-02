"use client"
import { X, ExternalLink } from "lucide-react"
import type React from "react"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"

interface ProjectModalProps {
  project: {
    title: string
    subtitle: string
    image: string
    link: string
    description: string
    technologies: string[]
  }
  onClose: () => void
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [isVisible, setIsVisible] = useState(false)

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
        className={`w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden transition-all duration-300 ease-out transform ${
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
              className="w-full h-64 object-cover rounded-t-lg"
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

          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-semibold mb-1">{project.title}</h2>
                <p className="text-muted-foreground">{project.subtitle}</p>
              </div>
              <Button className="ml-4 hover:scale-105 transition-transform duration-200">
                <ExternalLink className="w-4 h-4 mr-2" />
                Visit
              </Button>
            </div>

            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{project.description}</p>

            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="hover:scale-105 transition-transform duration-200"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

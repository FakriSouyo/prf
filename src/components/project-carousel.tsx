"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EnhancedProjectCard } from "@/components/enhanced-project-card"

interface Project {
  id: string
  title: string
  subtitle: string
  image: string
  link: string
  github?: string
  description: string
  technologies: string[]
}

interface ProjectCarouselProps {
  projects: Project[]
  onProjectClick: (project: Project) => void
}

export function ProjectCarousel({ projects, onProjectClick }: ProjectCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  
  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // md breakpoint
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const itemsPerPage = isMobile ? 1 : 2
  const totalPages = Math.ceil(projects.length / itemsPerPage)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages)
  }

  return (
    <div className="relative">
      {/* Projects Grid */}
      <div className="overflow-hidden">
        <motion.div
          className="flex"
          animate={{ x: -currentIndex * 100 + "%" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {Array.from({ length: totalPages }).map((_, pageIndex) => (
            <div key={pageIndex} className="w-full flex-shrink-0">
              <div className={`grid ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2'} gap-8`}>
                {projects.slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage).map((project, index) => (
                  <EnhancedProjectCard
                    key={`${pageIndex}-${index}`}
                    project={project}
                    onClick={() => onProjectClick(project)}
                    index={index}
                  />
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Navigation - Only show if more than itemsPerPage projects */}
      {projects.length > itemsPerPage && (
        <div className="flex items-center justify-center mt-8 gap-4">
          {/* Previous Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={prevSlide}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          {/* Page Indicators */}
          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-foreground scale-125"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/60"
                }`}
              />
            ))}
          </div>

          {/* Next Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={nextSlide}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            disabled={currentIndex === totalPages - 1}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Project Counter */}
      {projects.length > itemsPerPage && (
        <div className="text-center mt-4">
          <span className="text-xs text-muted-foreground">
            {currentIndex * itemsPerPage + 1}-{Math.min((currentIndex + 1) * itemsPerPage, projects.length)} of{" "}
            {projects.length} projects
          </span>
        </div>
      )}
    </div>
  )
}

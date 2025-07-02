"use client"
import { motion } from "framer-motion"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Github } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProjectCardProps {
  project: {
    title: string
    subtitle: string
    image: string
    link: string
    github?: string
    description: string
    technologies: string[]
  }
  onClick: () => void
  index: number
}

export function EnhancedProjectCard({ project, onClick, index }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Card className="p-4 flex flex-col hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer group transition-all duration-300 overflow-hidden">
        <div className="relative overflow-hidden aspect-square rounded-lg mb-4" onClick={onClick}>
          <Image
            src={project.image || "/placeholder.svg"}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            quality={85}
            priority={index < 2} // Prioritize loading first 2 images
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Hover overlay with buttons */}
          <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              size="sm"
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation()
                onClick()
              }}
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              View
            </Button>
            {project.github && (
              <Button 
                size="sm" 
                variant="secondary" 
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(project.github, '_blank', 'noopener,noreferrer')
                }}
              >
                <Github className="w-4 h-4 mr-1" />
                Code
              </Button>
            )}
          </div>
        </div>

        <div className="flex-1">
          <h3 className="font-medium mb-1 group-hover:text-primary transition-colors">{project.title}</h3>
          <p className="text-sm text-muted-foreground mb-3">{project.subtitle}</p>

          {/* Technology badges */}
          <div className="flex flex-wrap gap-1 mb-3">
            {project.technologies.slice(0, 3).map((tech, techIndex) => (
              <Badge key={techIndex} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}
            {project.technologies.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{project.technologies.length - 3}
              </Badge>
            )}
          </div>

          <p className="text-xs text-muted-foreground line-clamp-2">{project.description}</p>
        </div>
      </Card>
    </motion.div>
  )
}

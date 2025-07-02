"use client"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

interface SkillsProps {
  skills: string[]
}

export function EnhancedSkills({ skills }: SkillsProps) {
  const [isPaused, setIsPaused] = useState(false)

  return (
    <div className="relative overflow-hidden py-4">
      {/* Gradient overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />

      <motion.div
        className="flex gap-4 w-max"
        animate={{
          x: isPaused ? 0 : [0, -33.33 * 16], // Assuming each skill is ~16rem wide
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {[...skills, ...skills, ...skills].map((skill, index) => (
          <motion.div key={index} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Badge
              variant="secondary"
              className="px-4 py-2 whitespace-nowrap cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {skill}
            </Badge>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

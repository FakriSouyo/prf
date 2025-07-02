"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CookieConsent } from "@/components/cookie-consent"
import { ThemeToggle } from "@/components/theme-toggle"
import { MovingBorderCard } from "@/components/moving-border"
import { ScrollProgress } from "@/components/scroll-progress"
import { FloatingNav } from "@/components/floating-nav"
import { SectionReveal } from "@/components/section-reveal"
import { EnhancedSkills } from "@/components/enhanced-skills"
import { BlogSheet } from "@/components/blog-sheet"
import { DecodingText } from "@/components/decoding-text"
import { useState } from "react"
import { ProjectModal } from "@/components/project-modal"
import { motion } from "framer-motion"
import { Mail, MapPin } from "lucide-react"
import { ProjectCarousel } from "@/components/project-carousel"

// Import data directly from individual files
import { personalInfo } from "@/data/personal"
import { projects } from "@/data/projects"
import { skillNames } from "@/data/skills"
import { experiences } from "@/data/experience"
import { education } from "@/data/education"
import { blogPosts } from "@/data/blog"
import { socialLinks } from "@/data/social"
import type { BlogPost } from "@/data/blog"

export default function Portfolio() {
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null)

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <ScrollProgress />
      <FloatingNav />

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <SectionReveal>
          <header className="flex justify-between items-start mb-12">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="text-2xl font-semibold mb-1">{personalInfo.name}</h1>
              <p className="text-muted-foreground mb-2">{personalInfo.title}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{personalInfo.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  <span>{personalInfo.status}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground max-w-md leading-relaxed">{personalInfo.description}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Button variant="ghost" className="hover:bg-transparent">
                <DecodingText text="DOWNLOAD RESUME" className="font-medium" />
              </Button>
            </motion.div>
          </header>
        </SectionReveal>

        {/* Projects */}
        <SectionReveal delay={0.1}>
          <section className="mb-16">
            <h2 className="text-lg font-medium mb-8">Projects</h2>
            <ProjectCarousel projects={projects} onProjectClick={setSelectedProject} />
          </section>
        </SectionReveal>

        {/* Skills */}
        <SectionReveal delay={0.2}>
          <section className="mb-16">
            <EnhancedSkills skills={skillNames} />
          </section>
        </SectionReveal>

        {/* Experience */}
        <SectionReveal delay={0.3}>
          <section className="mb-16">
            <h2 className="text-lg font-medium mb-8">Experience</h2>
            <div className="space-y-4">
              {experiences.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <MovingBorderCard borderRadius="15px" className="p-6" duration={4000}>
                    <div className="flex justify-between items-start w-full">
                      <div className="flex-1">
                        <h3 className="font-medium">{exp.role}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{exp.company}</p>
                        <p className="text-xs text-muted-foreground">{exp.description}</p>
                      </div>
                      <p className="text-sm text-muted-foreground ml-4">{exp.period}</p>
                    </div>
                  </MovingBorderCard>
                </motion.div>
              ))}
            </div>
          </section>
        </SectionReveal>

        {/* Education */}
        <SectionReveal delay={0.4}>
          <section className="mb-16">
            <h2 className="text-lg font-medium mb-8">Education</h2>
            {education.map((edu) => (
              <MovingBorderCard key={edu.id} borderRadius="15px" className="p-6" duration={4000}>
                <div className="flex justify-between items-start w-full">
                  <div>
                    <h3 className="font-medium">{edu.degree}</h3>
                    <p className="text-sm text-muted-foreground">{edu.institution}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{edu.period}</p>
                </div>
              </MovingBorderCard>
            ))}
          </section>
        </SectionReveal>

        {/* Blog */}
        <SectionReveal delay={0.5}>
          <section className="mb-16">
            <h2 className="text-lg font-medium mb-8">Blog</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {blogPosts
                .filter((post) => post.featured)
                .map((post) => (
                  <motion.div
                    key={post.id}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    onClick={() => setSelectedBlogPost(post)}
                  >
                    <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden group">
                      <CardContent className="p-0 relative">
                        <div className="aspect-square bg-gradient-to-br from-blue-900 to-blue-700" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-end">
                          <div className="p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <h3 className="font-semibold mb-1">{post.title}</h3>
                            <p className="text-sm text-white/80 mb-2">{post.subtitle}</p>
                            <p className="text-xs text-white/70">{post.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
            </div>
          </section>
        </SectionReveal>

        {/* Connect */}
        <SectionReveal delay={0.6}>
          <section className="mb-16">
            <h2 className="text-lg font-medium mb-6">Connect</h2>
            <p className="text-sm text-muted-foreground mb-4">You can always connect with me at {personalInfo.email}</p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <motion.div key={social.name} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="ghost" size="sm" className="px-4 py-2">
                    {social.name} ↗
                  </Button>
                </motion.div>
              ))}
            </div>
          </section>
        </SectionReveal>

        {/* Footer */}
        <footer className="pt-8 border-t border-border">
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <p>© 2025 {personalInfo.name}</p>
            <ThemeToggle />
          </div>
        </footer>
      </div>

      {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
      <BlogSheet post={selectedBlogPost} onClose={() => setSelectedBlogPost(null)} />
      <CookieConsent />
    </div>
  )
}
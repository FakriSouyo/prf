"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CookieConsent } from "@/components/cookie-consent"
import { ThemeToggle } from "@/components/theme-toggle"
import { ScrollProgress } from "@/components/scroll-progress"
import { FloatingNav } from "@/components/floating-nav"
import { SectionReveal } from "@/components/section-reveal"
import { EnhancedSkills } from "@/components/enhanced-skills"
import { BlogSheet } from "@/components/blog-sheet"
import { DecodingText } from "@/components/decoding-text"
import { useState, useEffect, useCallback } from "react"
import { ProjectModal } from "@/components/project-modal"
import { motion } from "framer-motion"
import { MapPin, Calendar, ChevronLeft, ChevronRight, Download } from "lucide-react"
import { ProjectCarousel } from "@/components/project-carousel"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import Image from "next/image"
import useEmblaCarousel from 'embla-carousel-react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Import data directly from individual files
import { personalInfo } from "@/data/personal"
import { projects } from "@/data/projects"
import { skillNames } from "@/data/skills"
import { experiences } from "@/data/experience"
import { education } from "@/data/education"
import { socialLinks } from "@/data/social"
import type { BlogPost } from "@/data/blog"
import type { Project } from "@/data/projects"

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
    },
  },
})

export default function Portfolio() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null)
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Initialize Embla Carousel
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: false,
    breakpoints: {
      '(max-width: 768px)': {
        align: 'start',
        containScroll: 'keepSnaps',
        dragFree: true
      }
    }
  })

  // Scroll controls
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  // Memoize the project handler to avoid type issues
  const handleProjectClick = useCallback((project: Project) => {
    setSelectedProject(project)
  }, [])

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/blog')
        if (!response.ok) throw new Error('Failed to fetch blog posts')
        const data = await response.json()
        setBlogPosts(data)
      } catch (error) {
        console.error('Error fetching blog posts:', error)
        setBlogPosts([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlogPosts()
  }, [])

  const handleDownloadResume = async (e: React.MouseEvent) => {
    e.preventDefault()
    
    // Show toast first
    toast.success("Thanks for your interest!", {
      description: "",
      duration: 10000,
    })

    try {
      // Create a temporary link element
      const link = document.createElement('a')
      link.href = personalInfo.resumeUrl
      link.setAttribute('download', '') // Force download
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Download failed:', error)
      toast.error("Download failed", {
        description: "Please try again later.",
        duration: 3000,
      })
    }
  }

  const handleSocialClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <ScrollProgress />
        <FloatingNav />

        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Header */}
          <SectionReveal>
            <header className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 mb-12">
              <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                <h1 className="text-2xl font-semibold mb-1">{personalInfo.name}</h1>
                <p className="text-muted-foreground mb-2">{personalInfo.title}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6 flex-wrap sm:flex-nowrap">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{personalInfo.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="relative flex h-3 w-3 mr-1">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span>{personalInfo.status}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground max-w-md leading-relaxed">{personalInfo.description}</p>
                <div className="block md:hidden -ml-4 mt-6">
                  <Button 
                    variant="ghost" 
                    className="hover:!bg-transparent !bg-transparent"
                    onClick={handleDownloadResume}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    <DecodingText text="DOWNLOAD RESUME" className="font-medium" />
                  </Button>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="hidden md:block"
              >
                <Button 
                  variant="ghost" 
                  className="hover:!bg-transparent !bg-transparent"
                  onClick={handleDownloadResume}
                >
                  <Download className="w-4 h-4 mr-2" />
                  <DecodingText text="DOWNLOAD RESUME" className="font-medium" />
                </Button>
              </motion.div>
            </header>
          </SectionReveal>

          {/* Projects */}
          <SectionReveal delay={0.1}>
            <section className="mb-16">
              <h2 className="text-lg font-medium mb-8">Projects</h2>
              <ProjectCarousel projects={projects} onProjectClick={handleProjectClick} />
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
                    <div className="p-6 rounded-2xl border border-black/10 dark:border-white/20 bg-white/50 dark:bg-black/60 backdrop-blur-lg shadow-lg">
                      <div className="flex justify-between items-start w-full">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 dark:text-white">{exp.role}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{exp.company}</p>
                          <p className="text-sm text-muted-foreground">{exp.description}</p>
                        </div>
                        <p className="text-sm text-muted-foreground ml-4 whitespace-nowrap">{exp.period}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </SectionReveal>

          {/* Education */}
          <SectionReveal delay={0.4}>
            <section className="mb-16">
              <h2 className="text-lg font-medium mb-8">Education</h2>
              {education.map((edu, index) => (
                <motion.div
                  key={edu.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="p-6 rounded-2xl border border-black/10 dark:border-white/20 bg-white/50 dark:bg-black/60 backdrop-blur-lg shadow-lg">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{edu.degree}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{edu.institution}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{edu.period}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </section>
          </SectionReveal>

          {/* Blog */}
          <SectionReveal delay={0.5}>
            <section className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-medium">Blog</h2>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="embla__prev"
                    onClick={scrollPrev}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="embla__next"
                    onClick={scrollNext}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-2 gap-8">
                  {[1, 2].map((i) => (
                    <Card key={i} className="rounded-2xl overflow-hidden">
                      <CardContent className="p-0">
                        <div className="aspect-square bg-muted animate-pulse" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : blogPosts.length > 0 ? (
                <div className="overflow-hidden">
                  <div className="embla">
                    <div className="embla__viewport" ref={emblaRef}>
                      <div className="embla__container flex gap-4 md:gap-8">
                        {blogPosts
                          .sort((a, b) => 
                            new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
                          )
                          .map((post) => (
                            <div 
                              key={post.slug} 
                              className="embla__slide flex-[0_0_100%] md:flex-[0_0_calc(50%-16px)] min-w-0"
                              onMouseEnter={() => {
                                queryClient.prefetchQuery({
                                  queryKey: ['blog', post.slug],
                                  queryFn: () => fetch(`/api/blog/${post.slug}`).then(res => res.json()),
                                })
                              }}
                            >
                              <div onClick={() => setSelectedBlogPost(post)}>
                                <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-300 rounded-2xl overflow-hidden group">
                                  <CardContent className="p-0 relative">
                                    <div className="aspect-square">
                                      <Image
                                        src={post.image || '/placeholder.svg'}
                                        alt={post.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                      />
                                    </div>
                                    <div className="absolute inset-0 flex items-end">
                                      {/* Gradient overlay for text area */}
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                      
                                      {/* Content area with backdrop blur */}
                                      <div className="relative w-full p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-gradient-to-t from-black/80 via-black/60 to-transparent">
                                        <div className="flex items-center gap-2 mb-3 text-gray-200">
                                          <Calendar className="w-4 h-4" />
                                          <span className="text-xs">
                                            {new Date(post.publishedAt).toLocaleDateString()}
                                          </span>
                                        </div>
                                        <h3 className="font-semibold text-lg text-white mb-2">{post.title}</h3>
                                        <p className="text-sm text-gray-200 mb-3">{post.subtitle}</p>
                                        <p className="text-xs text-gray-300 mb-4 line-clamp-2">{post.description}</p>
                                        <div className="flex flex-wrap gap-2">
                                          {post.tags.map((tag, index) => (
                                            <Badge key={index} variant="secondary" className="text-xs bg-white/20 text-white">
                                              {tag}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  will add soon!
                </div>
              )}
            </section>
          </SectionReveal>

          {/* Connect */}
          <SectionReveal delay={0.6}>
            <section className="mb-16">
              <h2 className="text-lg font-medium mb-6">Connect</h2>
              <p className="text-sm text-muted-foreground mb-4">Feel free to reach out and connect with me!</p>
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <motion.div key={social.name} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="px-4 py-2"
                      onClick={() => handleSocialClick(social.url)}
                    >
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
    </QueryClientProvider>
  )
}
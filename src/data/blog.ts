export interface BlogPost {
  id: string
  title: string
  subtitle: string
  description: string
  image: string
  link: string
  publishedAt: string
  tags: string[]
  featured?: boolean
}

export const blogPosts: BlogPost[] = [
  {
    id: "ml-insights",
    title: "Machine Learning Insights",
    subtitle: "Deep Learning & AI",
    description: "Exploring the latest trends in artificial intelligence and machine learning applications.",
    image: "/placeholder.svg?height=300&width=300",
    link: "#",
    publishedAt: "2024-12-01",
    tags: ["Machine Learning", "AI", "Deep Learning"],
    featured: true,
  },
  {
    id: "backend-optimization",
    title: "Backend Performance Optimization",
    subtitle: "System Architecture",
    description: "Best practices for optimizing backend performance and scalability in modern web applications.",
    image: "/placeholder.svg?height=300&width=300",
    link: "#",
    publishedAt: "2024-11-15",
    tags: ["Backend", "Performance", "Architecture"],
  },
]
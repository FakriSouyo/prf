export interface Project {
  id: string
  title: string
  subtitle: string
  image: string
  link: string
  github?: string
  description: string
  technologies: string[]
  featured?: boolean
}

export const projects: Project[] = [
  {
    id: "inventory-management",
    title: "Inventory Management",
    subtitle: "Logistic Management",
    image: "/placeholder.svg?height=300&width=300",
    link: "#",
    github: "https://github.com",
    description:
      "A comprehensive inventory management system built for logistics companies. Features real-time tracking, automated reordering, and detailed analytics dashboard. Built with React, Node.js, and PostgreSQL.",
    technologies: ["React", "Node.js", "PostgreSQL", "Redis", "Docker"],
    featured: true,
  },
  {
    id: "badminton-booking",
    title: "Badminton Booking app",
    subtitle: "B2B Engineering",
    image: "/placeholder.svg?height=300&width=300",
    link: "#",
    github: "https://github.com",
    description:
      "A B2B platform for badminton court bookings with advanced scheduling, payment integration, and court management features. Designed for sports facility owners and booking management.",
    technologies: ["Next.js", "Stripe", "MongoDB", "TypeScript", "Tailwind"],
    featured: true,
  },
  {
    id: "ecommerce-platform",
    title: "E-commerce Platform",
    subtitle: "Full Stack Development",
    image: "/placeholder.svg?height=300&width=300",
    link: "#",
    github: "https://github.com",
    description:
      "Modern e-commerce platform with advanced features like real-time inventory, payment processing, and admin dashboard. Built with microservices architecture.",
    technologies: ["Vue.js", "Express", "MySQL", "Docker", "AWS"],
  },
  {
    id: "ai-chat-assistant",
    title: "AI Chat Assistant",
    subtitle: "Machine Learning",
    image: "/placeholder.svg?height=300&width=300",
    link: "#",
    github: "https://github.com",
    description:
      "Intelligent chat assistant powered by natural language processing. Features context awareness, multi-language support, and integration with various APIs.",
    technologies: ["Python", "TensorFlow", "FastAPI", "Redis", "Docker"],
  },
]

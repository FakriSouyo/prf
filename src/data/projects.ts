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
    image: "/inventory.png",
    link: "https://qiozhr.vercel.app/",
    github: "https://github.com/FakriSouyo/qiozhr",
    description:
      "A comprehensive inventory management system built for logistics companies. Features real-time tracking, automated reordering, and detailed analytics dashboard. Built with React, Node.js, and PostgreSQL.",
    technologies: ["Next.js", "Supabase", "PostgreSQL", "PDF.js", "Tailwind"],
    featured: true,
  },
  {
    id: "badminton-booking",
    title: "Badminton Booking app",
    subtitle: "Web Development",
    image: "/badminton.png",
    link: "https://www.gornandy.online/",
    github: "https://github.com/FakriSouyo/badmintonn",
    description:
      "A platform for badminton court bookings with advanced scheduling, payment integration, and court management features. Designed for sports facility owners and booking management.",
    technologies: ["React", "Supabase", "Vite", "Javascript", "Tailwind"],
    featured: true,
  },
  {
    id: "tpq-online-registration",
    title: "TPQ Online registration",
    subtitle: "Full Stack Development",
    image: "/tpq.png",
    link: "https://tpq-two.vercel.app/",
    github: "https://github.com/FakriSouyo/tpq",
    description:
      "Online registration system for TPQ (Tahfiz Quran) with advanced features like real-time data form, and admin dashboard.",
    technologies: ["React", "Vite", "PostgreSQL", "Tailwind"],
  },
  {
    id: "ai-hijaiyah-letter",
    title: "Hijaiyah detection",
    subtitle: "Machine Learning",
    image: "/hijaiyah.png",
    link: "https://belajar-hijaiyah.vercel.app/",
    github: "https://github.com/FakriSouyo/belajar-hijaiyah",
    description:
      "AI-based hijaiyah letter detection system using natural language processing. Features real-time analysis, automated classification, and detailed analytics dashboard.",
    technologies: ["Python", "TensorFlow", "Vite", "Javascript", "Tailwind"],
  },
  {
    id: "angkringan-online",
    title: "Angkringan Online",
    subtitle: "Full Stack Development",
    image: "/angkringan.png",
    link: "https://belajar-hijaiyah.vercel.app/",
    github: "https://github.com/FakriSouyo/belajar-hijaiyah",
    description:
      "A platform for angkringan food order with advanced features like real-time data form, and admin dashboard.",
    technologies: ["React", "Supabase", "Vite", "Javascript", "Tailwind"],
  },
]

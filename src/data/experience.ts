export interface Experience {
  id: string
  role: string
  company: string
  period: string
  description: string
  location?: string
  type: "full-time" | "part-time" | "contract" | "freelance" | "internship"
  current?: boolean
}

export const experiences: Experience[] = [
  {
    id: "freelancer-2024",
    role: "Software Engineer Freelancer",
    company: "Internet Worldwide",
    period: "Sep 2024 - Now",
    description: "Developing scalable web applications and APIs for various clients worldwide.",
    type: "freelance",
    current: true,
  },
  {
    id: "medco-2025",
    role: "System Admin",
    company: "Medco E&O",
    period: "Jan 2025 - Jun 2025",
    description: "Managing cloud infrastructure and implementing DevOps practices.",
    type: "contract",
  },
  {
    id: "umy-lecturer",
    role: "Assistant Lecture",
    company: "Universitas Muhammadiyah Yogyakarta",
    period: "Feb 2024 - Jul 2024",
    description: "Teaching programming fundamentals and web development to undergraduate students.",
    type: "part-time",
  },
  {
    id: "smpn-intern",
    role: "Web Developer Intern",
    company: "SMPN 1 Riung",
    period: "Sep 2022 - Dec 2023",
    description: "Built responsive websites and learned modern web development practices.",
    type: "internship",
  },
]

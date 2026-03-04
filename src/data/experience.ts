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
    id: "livingtech-creative-2025",
    role: "Software Engineer Freelancer",
    company: "LivingTech Creative",
    period: "Sep 2025 - Now",
    description: "Developing scalable web applications and APIs for various clients worldwide.",
    type: "freelance",
    current: true,
  },
  {
    id: "gama-studio-2024",
    role: "Backend Enginner",
    company: "Gama Studio",
    period: "Jan 2024 - Jun 2024",
    description: "Managing cloud infrastructure and implementing DevOps practices.",
    type: "contract",
  },
  {
    id: "umy-lecturer=2023",
    role: "Assistant Lecture",
    company: "Universitas Muhammadiyah Yogyakarta",
    period: "Feb 2023 - Jul 2024",
    description: "Teaching programming fundamentals and web development to undergraduate students.",
    type: "part-time",
  },
  {
    id: "smpn-intern-2022",
    role: "Web Developer Intern",
    company: "SMPN 1 Riung",
    period: "Sep 2022 - Dec 2023",
    description: "Built responsive websites and learned modern web development practices.",
    type: "internship",
  },
]

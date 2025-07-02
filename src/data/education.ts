export interface Education {
  id: string
  degree: string
  institution: string
  period: string
  description?: string
  gpa?: string
  achievements?: string[]
}

export const education: Education[] = [
  {
    id: "umy-bachelor",
    degree: "Technology Information",
    institution: "Universitas Muhammadiyah Yogyakarta",
    period: "Sept 2019 - Jul 2024",
    description: "Bachelor's degree in Information Technology with focus on software engineering and web development.",
    achievements: ["Graduated with honors", "Active in programming competitions", "Led student developer community"],
  },
]

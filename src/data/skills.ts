export interface Skill {
  name: string
  category: "frontend" | "backend" | "database" | "devops" | "ml" | "other"
  level?: "beginner" | "intermediate" | "advanced" | "expert"
}

export const skills: Skill[] = [
  { name: "NLP", category: "ml", level: "beginner" },
  { name: "react", category: "frontend", level: "intermediate" },
  { name: "nextjs", category: "frontend", level: "intermediate" },
  { name: "supabase", category: "backend", level: "beginner" },
  { name: "nodejs", category: "backend", level: "intermediate" },
  { name: "golang", category: "backend", level: "intermediate" },
  { name: "GCP", category: "devops", level: "intermediate" },
  { name: "postgres", category: "database", level: "intermediate" },
]

// For display purposes, we can extract just the names
export const skillNames = skills.map((skill) => skill.name)

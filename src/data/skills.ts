export interface Skill {
  name: string
  category: "frontend" | "backend" | "database" | "devops" | "ml" | "other"
  level?: "beginner" | "intermediate" | "advanced" | "expert"
}

export const skills: Skill[] = [
  { name: "NLTK", category: "ml", level: "advanced" },
  { name: "GraphQL", category: "backend", level: "intermediate" },
  { name: "Kubernetes", category: "devops", level: "intermediate" },
  { name: "Rust", category: "backend", level: "beginner" },
  { name: "RabbitMQ", category: "backend", level: "intermediate" },
  { name: "Python", category: "backend", level: "expert" },
  { name: "Docker", category: "devops", level: "advanced" },
  { name: "AWS", category: "devops", level: "intermediate" },
]

// For display purposes, we can extract just the names
export const skillNames = skills.map((skill) => skill.name)

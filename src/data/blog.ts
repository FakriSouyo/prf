export interface BlogPost {
  slug: string
  title: string
  subtitle: string
  description: string
  publishedAt: string
  tags: string[]
  featured?: boolean
  image: string
  status: 'draft' | 'published'
}

// This will be replaced by MDX content
export const blogPosts: BlogPost[] = []
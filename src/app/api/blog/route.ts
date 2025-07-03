import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'

const POSTS_PATH = path.join(process.cwd(), 'src/content/blog')

export async function GET() {
  try {
    const files = await fs.readdir(POSTS_PATH)
    const posts = await Promise.all(
      files
        .filter(filename => filename.endsWith('.mdx'))
        .map(async filename => {
          const filePath = path.join(POSTS_PATH, filename)
          const fileContent = await fs.readFile(filePath, 'utf8')
          const { data } = matter(fileContent)
          
          return {
            slug: filename.replace('.mdx', ''),
            title: data.title,
            subtitle: data.subtitle,
            description: data.description,
            publishedAt: data.publishedAt,
            tags: data.tags,
            featured: data.featured,
            image: data.image,
            status: data.status || 'published'
          }
        })
    )

    // Filter out draft posts and sort by date
    const publishedPosts = posts
      .filter(post => post.status === 'published')
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    
    return NextResponse.json(publishedPosts)
  } catch (error) {
    console.error('Error reading blog posts:', error)
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 })
  }
} 
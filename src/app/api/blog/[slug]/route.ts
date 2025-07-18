import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { serialize } from 'next-mdx-remote/serialize'
import rehypeExpressiveCode from 'rehype-expressive-code'
import remarkGfm from 'remark-gfm'
import rehypePrettyCode from 'rehype-pretty-code'

const POSTS_PATH = path.join(process.cwd(), 'src/content/blog')

// Type for line node
interface LineNode {
  children: Array<{ type: string; value: string }>
  properties: { className: string[] }
}

const prettyCodeOptions = {
  theme: {
    dark: 'github-dark',
    light: 'github-light'
  },
  keepBackground: false,
  defaultLang: 'plaintext',
  onVisitLine(node: LineNode) {
    if (node.children.length === 0) {
      node.children = [{
        type: 'text',
        value: ' '
      }]
    }
  },
  onVisitHighlightedLine(node: LineNode) {
    node.properties.className.push('highlighted')
  },
  onVisitHighlightedWord(node: LineNode) {
    node.properties.className = ['word']
  },
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Await params before using its properties
    const { slug } = await params
    
    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
    }

    const filePath = path.join(POSTS_PATH, `${slug}.mdx`)
    
    // Check if file exists
    try {
      await fs.access(filePath)
    } catch {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 })
    }
    
    const fileContent = await fs.readFile(filePath, 'utf8')
    const { data, content } = matter(fileContent)
    
    const mdxContent = await serialize(content, {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          [rehypeExpressiveCode, {
            frames: true,
            themes: ['github-dark', 'github-light'],
            lineNumbers: true,
            tabSize: 2,
          }],
          [rehypePrettyCode, prettyCodeOptions]
        ],
      },
      scope: data,
    })

    return NextResponse.json({
      content: mdxContent,
      frontmatter: data,
    })
  } catch (error) {
    console.error('Failed to fetch blog post:', error)
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 })
  }
}
import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'

const POSTS_PATH = path.join(process.cwd(), 'src/content/blog')

export interface BlogPostMeta {
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

export interface BlogPostWithContent {
    frontmatter: BlogPostMeta
    /** Raw MDX source string — pass directly to <MDXRemote source={} /> */
    source: string
}

/** Returns all published posts sorted newest-first */
export async function getAllPosts(): Promise<BlogPostMeta[]> {
    let files: string[]
    try {
        files = await fs.readdir(POSTS_PATH)
    } catch {
        return []
    }

    const posts = await Promise.all(
        files
            .filter(f => f.endsWith('.mdx'))
            .map(async filename => {
                const filePath = path.join(POSTS_PATH, filename)
                const raw = await fs.readFile(filePath, 'utf8')
                const { data } = matter(raw)
                return {
                    slug: (data.slug as string) || filename.replace('.mdx', ''),
                    title: data.title as string,
                    subtitle: data.subtitle as string,
                    description: data.description as string,
                    publishedAt: data.publishedAt as string,
                    tags: (data.tags as string[]) ?? [],
                    featured: data.featured as boolean | undefined,
                    image: data.image as string,
                    status: (data.status as 'draft' | 'published') || 'published',
                } satisfies BlogPostMeta
            })
    )

    return posts
        .filter(p => p.status === 'published')
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}

/** Returns single post with raw MDX source, or null if not found */
export async function getPostBySlug(slug: string): Promise<BlogPostWithContent | null> {
    let files: string[]
    try {
        files = await fs.readdir(POSTS_PATH)
    } catch {
        return null
    }

    for (const filename of files) {
        if (!filename.endsWith('.mdx')) continue
        const filePath = path.join(POSTS_PATH, filename)
        const raw = await fs.readFile(filePath, 'utf8')
        const { data, content } = matter(raw)

        const fileSlug = (data.slug as string) || filename.replace('.mdx', '')
        if (fileSlug !== slug) continue

        return {
            source: content,
            frontmatter: {
                slug: fileSlug,
                title: data.title as string,
                subtitle: data.subtitle as string,
                description: data.description as string,
                publishedAt: data.publishedAt as string,
                tags: (data.tags as string[]) ?? [],
                featured: data.featured as boolean | undefined,
                image: data.image as string,
                status: (data.status as 'draft' | 'published') || 'published',
            },
        }
    }

    return null
}

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, ArrowLeft, Clock } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { ShareButton } from '@/components/share-button'
import { getAllPosts, getPostBySlug } from '@/lib/blog'
import remarkGfm from 'remark-gfm'
import rehypePrettyCode from 'rehype-pretty-code'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map(post => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return { title: 'Blog Post Not Found' }
  }

  return {
    title: `${post.frontmatter.title} - Blog`,
    description: post.frontmatter.description,
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      images: [post.frontmatter.image],
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const wordCount = post.source.split(/\s+/).length
  const readingTime = Math.ceil(wordCount / 200)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link href="/blog">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </Link>

        {/* Hero Section */}
        <div className="mb-8">
          <div className="relative aspect-video overflow-hidden rounded-lg mb-6">
            <Image
              src={post.frontmatter.image}
              alt={post.frontmatter.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(post.frontmatter.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {readingTime} min read
              </div>
            </div>

            <h1 className="text-4xl font-bold">{post.frontmatter.title}</h1>
            <p className="text-xl text-muted-foreground">{post.frontmatter.subtitle}</p>

            <div className="flex flex-wrap gap-2">
              {post.frontmatter.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="prose prose-lg max-w-none">
              <MDXRemote
                source={post.source}
                options={{
                  mdxOptions: {
                    remarkPlugins: [remarkGfm],
                    rehypePlugins: [[rehypePrettyCode, { theme: 'github-dark' }]],
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Share Section */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-2">Share this article</h3>
                <p className="text-sm text-muted-foreground">
                  If you found this article helpful, consider sharing it with others.
                </p>
              </div>
              <ShareButton
                title={post.frontmatter.title}
                description={post.frontmatter.description}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

"use client"
import { useState, useEffect, useRef, useMemo } from "react"
import { motion, useMotionValue, type PanInfo, animate } from "framer-motion"
import { X, Calendar, AlertTriangle, Info, Lightbulb, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { BlogPost } from "@/data/blog"
import Image from "next/image"
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { EnhancedCodeBlock } from './enhanced-codeblock'
import { MDXRemote } from 'next-mdx-remote'
import type { MDXRemoteSerializeResult } from 'next-mdx-remote'
import React from "react"

interface BlogSheetProps {
  post: BlogPost | null
  onClose: () => void
}

interface BlogContent {
  content: MDXRemoteSerializeResult
  frontmatter?: Record<string, unknown>
}

interface CodeProps {
  children: React.ReactNode
  className?: string
  title?: string
  meta?: string
  filename?: string
  [key: string]: unknown
}

interface PreProps {
  children: React.ReactNode
  [key: string]: unknown
}

// Helper function to extract text content from React nodes
const getTextContent = (node: React.ReactNode): string => {
  if (typeof node === 'string') {
    return node
  }
  if (typeof node === 'number') {
    return node.toString()
  }
  if (React.isValidElement(node)) {
    // Safely access children from React element
    const element = node as React.ReactElement<{ children?: React.ReactNode }>
    const children = element.props?.children
    return children ? getTextContent(children) : ''
  }
  if (Array.isArray(node)) {
    return node.map(getTextContent).join('')
  }
  return ''
}

// Custom Admonition Component
const Admonition = ({ type, children }: { type: string; children: React.ReactNode }) => {
  const getAdmonitionStyle = (type: string) => {
    switch (type) {
      case 'note':
        return {
          icon: <Info className="w-5 h-5" />,
          className: 'border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/20 text-blue-900 dark:text-blue-100'
        }
      case 'tip':
        return {
          icon: <Lightbulb className="w-5 h-5" />,
          className: 'border-l-4 border-green-500 bg-green-50 dark:bg-green-950/20 text-green-900 dark:text-green-100'
        }
      case 'important':
        return {
          icon: <AlertCircle className="w-5 h-5" />,
          className: 'border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-950/20 text-purple-900 dark:text-purple-100'
        }
      case 'warning':
        return {
          icon: <AlertTriangle className="w-5 h-5" />,
          className: 'border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20 text-yellow-900 dark:text-yellow-100'
        }
      case 'caution':
        return {
          icon: <AlertTriangle className="w-5 h-5" />,
          className: 'border-l-4 border-red-500 bg-red-50 dark:bg-red-950/20 text-red-900 dark:text-red-100'
        }
      default:
        return {
          icon: <Info className="w-5 h-5" />,
          className: 'border-l-4 border-gray-500 bg-gray-50 dark:bg-gray-950/20 text-gray-900 dark:text-gray-100'
        }
    }
  }

  const { icon, className } = getAdmonitionStyle(type)

  return (
    <div className={`p-4 rounded-r-lg my-4 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {icon}
        </div>
        <div className="flex-1">
          <div className="font-semibold capitalize mb-2">{type}</div>
          <div className="prose prose-sm max-w-none [&>*:last-child]:mb-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

// Custom Table Component
const Table = ({ children }: { children: React.ReactNode }) => (
  <div className="my-6 overflow-x-auto">
    <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
      {children}
    </table>
  </div>
)

const TableHead = ({ children }: { children: React.ReactNode }) => (
  <thead className="bg-gray-100 dark:bg-gray-800">
    {children}
  </thead>
)

const TableRow = ({ children }: { children: React.ReactNode }) => (
  <tr className="border-b border-gray-300 dark:border-gray-700">
    {children}
  </tr>
)

const TableCell = ({ children, isHeader }: { children: React.ReactNode; isHeader?: boolean }) => (
  <td className={`px-4 py-2 border-r border-gray-300 dark:border-gray-700 ${isHeader ? 'font-semibold' : ''}`}>
    {children}
  </td>
)

// MDX Components
import type { MDXComponents } from 'mdx/types';

const mdxComponents: MDXComponents = {
  // Headings
  h1: ({ children }: { children: React.ReactNode }) => (
    <h1 className="text-4xl font-bold mb-6 mt-8 text-gray-900 dark:text-gray-100 leading-tight">
      {children}
    </h1>
  ),
  h2: ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-3xl font-semibold mb-5 mt-8 text-gray-900 dark:text-gray-100 leading-tight border-b border-gray-200 dark:border-gray-700 pb-2">
      {children}
    </h2>
  ),
  h3: ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-2xl font-semibold mb-4 mt-6 text-gray-900 dark:text-gray-100 leading-tight">
      {children}
    </h3>
  ),
  h4: ({ children }: { children: React.ReactNode }) => (
    <h4 className="text-xl font-semibold mb-3 mt-5 text-gray-900 dark:text-gray-100 leading-tight">
      {children}
    </h4>
  ),
  h5: ({ children }: { children: React.ReactNode }) => (
    <h5 className="text-lg font-semibold mb-2 mt-4 text-gray-900 dark:text-gray-100 leading-tight">
      {children}
    </h5>
  ),
  h6: ({ children }: { children: React.ReactNode }) => (
    <h6 className="text-base font-semibold mb-2 mt-4 text-gray-900 dark:text-gray-100 leading-tight">
      {children}
    </h6>
  ),
  
  // Paragraphs
  p: ({ children }: { children: React.ReactNode }) => (
    <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
      {children}
    </p>
  ),
  
  // Lists
  ul: ({ children }: { children: React.ReactNode }) => (
    <ul className="mb-4 pl-6 space-y-2 text-gray-700 dark:text-gray-300 list-disc">
      {children}
    </ul>
  ),
  ol: ({ children }: { children: React.ReactNode }) => (
    <ol className="mb-4 pl-6 space-y-2 text-gray-700 dark:text-gray-300 list-decimal">
      {children}
    </ol>
  ),
  li: ({ children }: { children: React.ReactNode }) => (
    <li className="leading-relaxed">
      {children}
    </li>
  ),
  
  // Emphasis
  strong: ({ children }: { children: React.ReactNode }) => (
    <strong className="font-semibold text-gray-900 dark:text-gray-100">
      {children}
    </strong>
  ),
  em: ({ children }: { children: React.ReactNode }) => (
    <em className="italic text-gray-800 dark:text-gray-200">
      {children}
    </em>
  ),
  
  // Code - Handle inline code only
  code: ({ children, className, ...props }: CodeProps) => {
    // Inline code (no language class)
    if (!className) {
      return (
        <code className="px-1.5 py-0.5 text-sm bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded font-mono border border-gray-200 dark:border-gray-700">
          {children}
        </code>
      )
    }
    
    // For code blocks, we'll handle them in the pre component
    return (
      <code className={className} {...props}>
        {children}
      </code>
    )
  },
  
  // Handle code blocks
  pre: (preProps: PreProps) => {
    const { children, ...restProps } = preProps
    
    // If children is a code element, extract its props
    if (React.isValidElement(children) && children.type === 'code') {
      const codeElementProps = children.props as {
        className?: string;
        children?: React.ReactNode;
        [key: string]: unknown;
      };
      const { className, children: codeChildren, ...codeProps } = codeElementProps;
      
      const isTerminal = className?.includes('language-terminal') || 
                        className?.includes('language-bash') || 
                        className?.includes('language-shell')
      
      // Process the code content
      const codeContent = getTextContent(codeChildren).trim()
      
      // Create a filtered props object with only the allowed props for EnhancedCodeBlock
      const filteredProps: Record<string, unknown> = {};
      const allowedProps = ['title', 'meta', 'filename', 'showLineNumbers'];
      
      Object.entries(codeProps).forEach(([key, value]) => {
        if (allowedProps.includes(key)) {
          filteredProps[key] = value;
        }
      });
      
      return (
        <EnhancedCodeBlock
          className={className || ''}
          title={isTerminal ? 'Terminal' : undefined}
          showLineNumbers={!isTerminal}
          {...filteredProps}
        >
          {codeContent}
        </EnhancedCodeBlock>
      )
    }
    
    // Fallback for other cases
    return <pre {...restProps}>{children}</pre>
  },
  
  // Blockquotes
  blockquote: ({ children }: { children: React.ReactNode }) => (
    <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 my-6 italic text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 py-4 rounded-r-lg">
      {children}
    </blockquote>
  ),
  
  // Horizontal Rule
  hr: () => (
    <hr className="my-8 border-t-2 border-gray-200 dark:border-gray-700" />
  ),
  
  // Links
  a: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a 
      href={href} 
      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline hover:no-underline transition-colors"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  
  // Tables
  table: Table,
  thead: TableHead,
  tr: TableRow,
  td: ({ children }: { children: React.ReactNode }) => <TableCell>{children}</TableCell>,
  th: ({ children }: { children: React.ReactNode }) => <TableCell isHeader>{children}</TableCell>,
  
  // Images
  img: ({ src, alt }: { src: string; alt: string }) => (
    <div className="my-6">
      <Image
        src={src}
        alt={alt}
        width={800}
        height={400}
        className="rounded-lg shadow-md w-full h-auto"
      />
      {alt && (
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2 italic">
          {alt}
        </p>
      )}
    </div>
  ),
  
  // Keyboard shortcuts
  kbd: ({ children }: { children: React.ReactNode }) => (
    <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded border border-gray-300 dark:border-gray-600 text-sm font-mono shadow-sm">
      {children}
    </kbd>
  ),
  
  // Custom Admonitions
  Admonition,
}

// Fetch function for blog content
const fetchBlogContent = async (slug: string): Promise<BlogContent> => {
  try {
    const response = await fetch(`/api/blog/${slug}`, {
      headers: {
        'Cache-Control': 'max-age=3600',
      }
    })
    
    if (!response.ok) throw new Error('Failed to fetch blog content')
    const data = await response.json()
    
    return data as BlogContent
  } catch (error) {
    console.error('Error fetching blog content:', error)
    throw error
  }
}

export function BlogSheet({ post, onClose }: BlogSheetProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [isContentMounted, setIsContentMounted] = useState(false)
  const y = useMotionValue(0)
  const constraintsRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()

  // Query for blog content with optimized options
  const { data: mdxContent, isLoading } = useQuery<BlogContent, Error>({
    queryKey: ['blog', post?.slug],
    queryFn: () => (post ? fetchBlogContent(post.slug) : Promise.reject('No post')),
    enabled: !!post,
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  // Prefetch next and previous posts
  useEffect(() => {
    if (post) {
      // Get all blog posts from cache or fetch them
      const blogPosts = queryClient.getQueryData(['blogPosts']) as BlogPost[] || []
      const currentIndex = blogPosts.findIndex(p => p.slug === post.slug)
      
      // Prefetch next post
      if (currentIndex < blogPosts.length - 1) {
        const nextPost = blogPosts[currentIndex + 1]
        queryClient.prefetchQuery({
          queryKey: ['blog', nextPost.slug],
          queryFn: () => fetchBlogContent(nextPost.slug),
          staleTime: Infinity,
        })
      }
      
      // Prefetch previous post
      if (currentIndex > 0) {
        const prevPost = blogPosts[currentIndex - 1]
        queryClient.prefetchQuery({
          queryKey: ['blog', prevPost.slug],
          queryFn: () => fetchBlogContent(prevPost.slug),
          staleTime: Infinity,
        })
      }
    }
  }, [post, queryClient])

  useEffect(() => {
    if (post) {
      y.set(typeof window !== 'undefined' ? window.innerHeight : 1000)
      setIsFullScreen(false)
      setIsContentMounted(false)
      
      requestAnimationFrame(() => {
        setIsVisible(true)
        animate(y, 0, {
          type: "spring",
          damping: 30,
          stiffness: 300,
          onComplete: () => {
            setIsContentMounted(true)
          }
        })
      })
      
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
      setIsContentMounted(false)
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [post, y])

  const handleClose = () => {
    setIsVisible(false)
    setIsContentMounted(false)
    animate(y, typeof window !== 'undefined' ? window.innerHeight : 1000, {
      type: "spring",
      damping: 30,
      stiffness: 300,
      onComplete: () => {
        setIsFullScreen(false)
        onClose()
      }
    })
  }

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 200
    const velocityThreshold = 1500
    
    const shouldClose = info.velocity.y > velocityThreshold || info.offset.y > threshold
    const shouldFullScreen = info.velocity.y < -velocityThreshold || info.offset.y < -threshold

    if (shouldClose) {
      setIsContentMounted(false)
      handleClose()
    } else if (shouldFullScreen && !isFullScreen) {
      setIsFullScreen(true)
      animate(y, 0, {
        type: "spring",
        damping: 30,
        stiffness: 300
      })
    } else {
      animate(y, 0, {
        type: "spring",
        damping: 30,
        stiffness: 300
      })
    }
  }

  // Memoize MDX content to prevent unnecessary re-renders
  const MemoizedMDXContent = useMemo(() => {
    if (!isContentMounted || !mdxContent?.content) return null;
    
    try {
      return (
        <div className="prose prose-invert max-w-none">
          <MDXRemote 
            {...mdxContent.content}
            components={mdxComponents}
          />
        </div>
      );
    } catch (error) {
      console.error('Error rendering MDX content:', error);
      return (
        <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-md">
          <p className="text-red-300">Error rendering content. Please try refreshing the page.</p>
          <pre className="mt-2 text-xs text-red-400 overflow-auto">
            {error instanceof Error ? error.message : String(error)}
          </pre>
        </div>
      );
    }
  }, [mdxContent, isContentMounted])

  if (!post) return null

  return (
    <>
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ${
          isVisible ? "bg-black/50 backdrop-blur-sm" : "bg-black/0 backdrop-blur-none pointer-events-none"
        }`}
        onClick={(e) => e.target === e.currentTarget && handleClose()}
      >
        <motion.div
          ref={constraintsRef}
          className="absolute inset-0"
          initial={false}
          animate={{
            y: isVisible ? (isFullScreen ? 0 : "30%") : "100%",
          }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
        >
          <motion.div
            className="relative h-full bg-background rounded-t-3xl shadow-2xl overflow-hidden flex flex-col"
            drag="y"
            dragConstraints={constraintsRef}
            dragElastic={0.1}
            onDragEnd={handleDragEnd}
            style={{ y }}
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-4 pb-2">
              <div className="w-12 h-1 bg-muted-foreground/30 rounded-full cursor-grab active:cursor-grabbing" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-900 to-blue-700 rounded-lg" />
                <div>
                  <h2 className="font-semibold text-lg">{post.title}</h2>
                  <p className="text-sm text-muted-foreground">{post.subtitle}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="px-6 py-6">
                {/* Meta Information */}
                <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Featured Image */}
                <div className="relative aspect-video w-full mb-8 rounded-lg overflow-hidden">
                  <Image
                    src={post.image || '/placeholder.svg'}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>

                {/* MDX Content with Loading State */}
                <article className="max-w-none prose-custom">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <div className="min-h-[50vh]">
                      {MemoizedMDXContent}
                    </div>
                  )}
                </article>
              </div>
            </div>

            {/* Pull Indicator */}
            {!isFullScreen && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="flex flex-col items-center text-muted-foreground">
                  <div className="text-xs mb-1">Pull up for full screen</div>
                  <div className="w-6 h-6 border-2 border-muted-foreground/30 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-muted-foreground/30 rounded-full" />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
        
        {/* Show loading indicator */}
        {isLoading && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-background/80 backdrop-blur-sm rounded-lg p-4">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          </div>
        )}
      </div>
    </>
  )
}

// Export prefetch function with proper typing
export const prefetchBlogContent = async (slug: string): Promise<BlogContent | undefined> => {
  try {
    const response = await fetch(`/api/blog/${slug}`, {
      headers: {
        'Cache-Control': 'max-age=3600',
      }
    })
    
    if (!response.ok) throw new Error('Failed to prefetch blog content')
    const data = await response.json()
    
    return data as BlogContent
  } catch (error) {
    console.error('Error prefetching blog content:', error)
    return undefined
  }
}
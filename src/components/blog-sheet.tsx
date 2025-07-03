"use client"
import { useState, useEffect, useRef } from "react"
import { motion, useMotionValue, useTransform, type PanInfo } from "framer-motion"
import { X, Calendar, Bookmark, Share2, AlertTriangle, Info, Lightbulb, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShareModal } from "@/components/share-modal"
import type { BlogPost } from "@/data/blog"
import { MDXRemote } from 'next-mdx-remote'
import Image from "next/image"

interface BlogSheetProps {
  post: BlogPost | null
  onClose: () => void
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

// Custom Code Block Component
const CodeBlock = ({ children, className, title, meta }: { children: string; className?: string; title?: string; meta?: string }) => {
  const language = className?.replace('language-', '') || 'text'
  
  return (
    <div className="my-6 overflow-hidden font-mono">
      <div className="bg-[#24292e] dark:bg-[#0d1117] rounded-lg overflow-hidden">
        {/* Editor Frame */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#1f2428] dark:bg-[#161b22] border-b border-[#30363d]">
          {/* File name or title */}
          <div className="flex items-center">
            {title && (
              <span className="text-sm text-gray-300">
                {title}
              </span>
            )}
            {!title && language && (
              <span className="text-sm text-gray-400">
                {language}
              </span>
            )}
          </div>
          {/* Meta info or language badge */}
          {meta && (
            <span className="text-xs text-gray-400 bg-[#30363d] px-2 py-1 rounded">
              {meta}
            </span>
          )}
        </div>
        
        {/* Code Content */}
        <div className="relative group">
          <pre className="overflow-x-auto p-4 text-sm leading-6">
            <code className={`language-${language} text-gray-300`}>
              {children}
            </code>
          </pre>
          
          {/* Copy button */}
          <button
            onClick={() => navigator.clipboard.writeText(children)}
            className="absolute top-3 right-3 p-2 rounded-lg bg-[#30363d] opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-white"
            title="Copy code"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
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
const mdxComponents = {
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
    <h5 className="text-lg font-semibold mb-3 mt-4 text-gray-900 dark:text-gray-100 leading-tight">
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
  
  // Code
  code: ({ children, className, title, meta }: { children: string; className?: string; title?: string; meta?: string }) => {
    // Inline code
    if (!className) {
      return (
        <code className="px-1.5 py-0.5 text-[0.9em] bg-[#f6f8fa] dark:bg-[#21262d] text-[#24292e] dark:text-[#c9d1d9] rounded font-mono border border-[#d0d7de] dark:border-[#30363d]">
          {children}
        </code>
      )
    }
    // Block code
    return <CodeBlock className={className} title={title} meta={meta}>{children}</CodeBlock>
  },
  
  pre: ({ children }: { children: React.ReactNode }) => (
    <div className="my-6">
      {children}
    </div>
  ),
  
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

export function BlogSheet({ post, onClose }: BlogSheetProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [mdxContent, setMdxContent] = useState<any>(null)
  const y = useMotionValue(0)
  const constraintsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (post) {
      setIsVisible(true)
      setIsFullScreen(false)
      document.body.style.overflow = "hidden"
      
      // Fetch MDX content when post changes
      const fetchContent = async () => {
        try {
          const response = await fetch(`/api/blog/${post.slug}`)
          const data = await response.json()
          setMdxContent(data.content)
        } catch (error) {
          console.error('Failed to fetch blog content:', error)
        }
      }
      fetchContent()
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [post])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      setIsFullScreen(false)
      onClose()
    }, 300)
  }

  const handleDragEnd = (event: any, info: PanInfo) => {
    const shouldClose = info.velocity.y > 500 || info.offset.y > 200
    const shouldFullScreen = info.velocity.y < -500 || info.offset.y < -150

    if (shouldClose) {
      handleClose()
    } else if (shouldFullScreen && !isFullScreen) {
      setIsFullScreen(true)
    } else if (!shouldClose && !shouldFullScreen) {
      y.set(0)
    }
  }

  const handleBookmark = () => {
    if (!post) return

    const url = `${window.location.origin}/blog/${post.slug}`
    const title = post.title

    // Type assertion for browser-specific properties
    const win = window as any;
    
    if (win.sidebar?.addPanel) {
      win.sidebar.addPanel(title, url, "")
    } else if (win.external?.AddFavorite) {
      win.external.AddFavorite(url, title)
    } else {
      navigator.clipboard
        .writeText(url)
        .then(() => {
          alert(`Bookmark saved! Press Ctrl+D (Cmd+D on Mac) to bookmark this page.\nURL copied to clipboard: ${url}`)
        })
        .catch(() => {
          alert(`Press Ctrl+D (Cmd+D on Mac) to bookmark this page: ${title}`)
        })
    }
  }

  const handleShare = () => {
    setShowShareModal(true)
  }

  if (!post) return null

  const currentUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/blog/${post.slug}`

  return (
    <>
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ${
          isVisible ? "bg-black/50 backdrop-blur-sm" : "bg-black/0 backdrop-blur-none"
        }`}
        onClick={(e) => e.target === e.currentTarget && handleClose()}
      >
        <motion.div
          ref={constraintsRef}
          className="absolute inset-0"
          initial={{ y: "100%" }}
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

                {/* MDX Content with Custom Styling */}
                <article className="max-w-none prose-custom">
                  {mdxContent && (
                    <MDXRemote 
                      {...mdxContent} 
                      components={mdxComponents}
                    />
                  )}
                </article>

                {/* Action Buttons */}
                <div className="flex gap-4 mt-12 pt-6 border-t border-border">
                  <Button variant="outline" onClick={handleShare}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" onClick={handleBookmark}>
                    <Bookmark className="w-4 h-4 mr-2" />
                    Bookmark
                  </Button>
                </div>
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
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title={post?.title || ""}
        url={currentUrl}
      />
    </>
  )
}
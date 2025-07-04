import React, { useState, useMemo } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { Copy, Check, Maximize2, Terminal, Code as CodeIcon, FileText as FileTextIcon } from 'lucide-react'

const getFileIcon = (language: string) => {
  switch (language) {
    case 'js':
    case 'javascript':
      return <CodeIcon className="w-4 h-4 text-yellow-400" />
    case 'ts':
    case 'typescript':
      return <CodeIcon className="w-4 h-4 text-blue-400" />
    case 'jsx':
    case 'tsx':
      return <CodeIcon className="w-4 h-4 text-blue-400" />
    case 'json':
      return <FileTextIcon className="w-4 h-4 text-yellow-400" />
    case 'html':
      return <FileTextIcon className="w-4 h-4 text-orange-500" />
    case 'css':
      return <FileTextIcon className="w-4 h-4 text-blue-500" />
    case 'bash':
    case 'sh':
    case 'shell':
    case 'zsh':
      return <Terminal className="w-4 h-4 text-green-400" />
    default:
      return <CodeIcon className="w-4 h-4 text-gray-400" />
  }
}

const getLanguageDisplayName = (language: string) => {
  const displayNames: { [key: string]: string } = {
    'js': 'JavaScript',
    'javascript': 'JavaScript',
    'ts': 'TypeScript',
    'typescript': 'TypeScript',
    'jsx': 'React JSX',
    'tsx': 'React TSX',
    'py': 'Python',
    'python': 'Python',
    'html': 'HTML',
    'css': 'CSS',
    'scss': 'SCSS',
    'sass': 'Sass',
    'json': 'JSON',
    'bash': 'Bash',
    'shell': 'Shell',
    'sql': 'SQL',
    'yaml': 'YAML',
    'yml': 'YAML',
    'md': 'Markdown',
    'markdown': 'Markdown',
    'php': 'PHP',
    'java': 'Java',
    'c': 'C',
    'cpp': 'C++',
    'csharp': 'C#',
    'go': 'Go',
    'rust': 'Rust',
    'swift': 'Swift',
    'kotlin': 'Kotlin',
    'dart': 'Dart',
    'ruby': 'Ruby',
    'vue': 'Vue',
    'svelte': 'Svelte'
  }
  return displayNames[language] || language.toUpperCase()
}

const getDefaultFilename = (language: string, title?: string) => {
  if (title) return title
  
  const extensions: { [key: string]: string } = {
    'js': 'example.js',
    'javascript': 'example.js',
    'ts': 'example.ts',
    'typescript': 'example.ts',
    'jsx': 'Component.jsx',
    'tsx': 'Component.tsx',
    'py': 'example.py',
    'python': 'example.py',
    'html': 'index.html',
    'css': 'styles.css',
    'scss': 'styles.scss',
    'sass': 'styles.sass',
    'json': 'data.json',
    'bash': 'script.sh',
    'shell': 'script.sh',
    'sql': 'query.sql',
    'yaml': 'config.yaml',
    'yml': 'config.yml',
    'md': 'README.md',
    'markdown': 'README.md',
    'php': 'index.php',
    'java': 'Main.java',
    'c': 'main.c',
    'cpp': 'main.cpp',
    'csharp': 'Program.cs',
    'go': 'main.go',
    'rust': 'main.rs',
    'swift': 'main.swift',
    'kotlin': 'Main.kt',
    'dart': 'main.dart',
    'ruby': 'main.rb',
    'vue': 'App.vue',
    'svelte': 'App.svelte'
  }
  
  return extensions[language] || 'example.txt'
}

interface CodeBlockProps {
  children: string
  className?: string
  title?: string
  meta?: string
  filename?: string
  showLineNumbers?: boolean
  maxHeight?: string
}

// Process terminal commands to handle prompts and output
const processTerminalContent = (content: string) => {
  if (!content) return content;
  
  // Split into lines and process each line
  return content.split('\n').map(line => {
    // Handle command lines (starting with $, #, or >)
    if (/^\s*[\$#>]/.test(line)) {
      const promptMatch = line.match(/^(\s*)([\$#>]\s*)(.*)/);
      if (promptMatch) {
        const [, indent, prompt, command] = promptMatch;
        return `${indent}<span class="text-green-400">${prompt}</span>${command}`;
      }
    }
    // Handle output lines
    return line;
  }).join('\n');
};

export const EnhancedCodeBlock: React.FC<CodeBlockProps> = ({ 
  children, 
  className = '', 
  title = '', 
  filename = '',
  showLineNumbers = true,
  maxHeight = '400px'
}) => {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const language = className?.replace('language-', '') || 'text';
  const isTerminal = ['terminal', 'bash', 'shell', 'sh', 'zsh'].includes(language);
  const displayFilename = filename || getDefaultFilename(language, title);
  
  // Process content based on language
  const processedContent = useMemo(() => {
    const content = typeof children === 'string' ? children : '';
    return isTerminal ? processTerminalContent(content) : content;
  }, [children, isTerminal]);
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  // Custom theme based on VS Code Dark+
  const customTheme = useMemo(() => {
    const baseTheme = {
      ...oneDark,
      'pre[class*="language-"]': {
        ...oneDark['pre[class*="language-"]'],
        background: isTerminal ? '#1a1a1a' : '#1e1e1e',
        margin: 0,
        padding: '1.5rem',
        fontSize: '0.925rem',
        lineHeight: '1.7',
        overflow: 'auto',
        maxHeight: isExpanded ? 'none' : `${maxHeight}px`,
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      },
      'code[class*="language-"]': {
        ...oneDark['code[class*="language-"]'],
        background: 'transparent',
        fontSize: '0.925rem',
        lineHeight: '1.7',
        fontFamily: '"Fira Code", "JetBrains Mono", "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
        color: isTerminal ? '#e0e0e0' : undefined,
        textShadow: isTerminal ? 'none' : undefined
      }
    };

    if (isTerminal) {
      return {
        ...baseTheme,
        '.token.operator, .token.punctuation': {
          color: '#e0e0e0',
          background: 'transparent'
        },
        '.token.comment': {
          color: '#6a9955',
          fontStyle: 'italic'
        },
        '.token.string': {
          color: '#ce9178'
        }
      };
    }
    
    return baseTheme;
  }, [isTerminal, isExpanded, maxHeight]);

  // Render the component
  return (
    <div className={`relative my-6 rounded-lg overflow-hidden w-full border ${isTerminal ? 'border-gray-800 bg-gray-900' : 'border-gray-200 dark:border-gray-700'} shadow-sm`}>
      {/* Header with filename and actions */}
      <div className={`flex items-center justify-between ${isTerminal ? 'bg-gray-900 border-gray-800' : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700'} px-4 py-2 border-b rounded-t-lg`}>
        <div className="flex items-center space-x-2">
          {isTerminal ? (
            <Terminal className="w-4 h-4 text-green-400" />
          ) : getFileIcon(language)}
          <span className={`text-xs font-mono ${isTerminal ? 'text-gray-400' : 'text-gray-700 dark:text-gray-300'} font-medium`}>
            {displayFilename}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {!isTerminal && (
            <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
              {getLanguageDisplayName(language)}
            </span>
          )}
          <div className="flex items-center space-x-1">
            <button
              onClick={toggleExpanded}
              className={`p-1.5 rounded-md transition-colors ${isTerminal ? 'text-gray-500 hover:bg-gray-800 hover:text-gray-300' : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              aria-label={isExpanded ? 'Collapse code' : 'Expand code'}
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleCopy}
              className={`p-1.5 rounded-md transition-colors ${isTerminal ? 'text-gray-500 hover:bg-gray-800 hover:text-gray-300' : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              aria-label={copied ? 'Copied!' : 'Copy code'}
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-green-500" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Code content */}
      <div className={`relative ${isTerminal ? 'bg-gray-900' : 'bg-[#1e1e1e]'} rounded-b-lg`}>
        {isTerminal ? (
          <pre style={{
            margin: 0,
            padding: '1.25rem 1.5rem',
            background: '#1a1a1a',
            color: '#e0e0e0',
            fontSize: '0.9375rem',
            lineHeight: '1.7',
            fontFamily: '"Fira Code", "JetBrains Mono", "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            overflow: 'auto',
            maxHeight: isExpanded ? 'none' : maxHeight,
            scrollbarWidth: 'thin',
            scrollbarColor: '#333 #1a1a1a'
          }}>
            <code 
              className="language-bash"
              dangerouslySetInnerHTML={{ __html: processedContent }} 
            />
          </pre>
        ) : (
          <SyntaxHighlighter
            language={language}
            style={customTheme}
            showLineNumbers={showLineNumbers}
            wrapLines={true}
            wrapLongLines={false}
            customStyle={{
              margin: 0,
              padding: '1.5rem',
              background: '#1e1e1e',
              fontSize: '0.925rem',
              lineHeight: '1.7',
              fontFamily: '"Fira Code", "JetBrains Mono", "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
              borderRadius: '0 0 0.5rem 0.5rem',
              overflow: 'auto',
              minHeight: '3rem',
              maxHeight: isExpanded ? 'none' : maxHeight,
              scrollbarWidth: 'thin',
              scrollbarColor: '#4b5563 #1f2937'
            }}
            lineNumberStyle={{
              color: '#6b7280',
              paddingRight: '1.5rem',
              userSelect: 'none',
              minWidth: '2.5em',
              position: 'relative',
              opacity: 0.7
            }}
            codeTagProps={{
              style: {
                display: 'block',
                minHeight: '1rem',
                lineHeight: '1.7',
                whiteSpace: 'pre',
                wordSpacing: 'normal',
                wordBreak: 'normal',
                wordWrap: 'normal',
                tabSize: 2,
                hyphens: 'none',
                fontFamily: '"Fira Code", "JetBrains Mono", "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace'
              }
            }}
          >
            {typeof children === 'string' ? children.trim() : ''}
          </SyntaxHighlighter>
        )}

        {/* Fade overlay when collapsed */}
        {!isExpanded && children && typeof children === 'string' && children.split('\n').length > 20 && (
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#1e1e1e] to-transparent pointer-events-none" />
        )}
      </div>
    </div>
  )
}

// Define proper types for MDX component props
interface MDXCodeProps {
  children: string
  className?: string
  title?: string
  meta?: string
  filename?: string
  [key: string]: unknown
}

interface MDXPreProps {
  children: React.ReactNode
}

// MDX components configuration
export const mdxComponents = {
  code: ({ children, className, title, meta, filename, ...props }: MDXCodeProps) => {
    // Inline code
    if (!className) {
      return (
        <code className="px-1.5 py-0.5 text-sm bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded font-mono border border-gray-200 dark:border-gray-700">
          {children}
        </code>
      )
    }
    
    // Block code
    return (
      <EnhancedCodeBlock
        className={className}
        title={title}
        meta={meta}
        filename={filename}
        {...props}
      >
        {children}
      </EnhancedCodeBlock>
    )
  },
  
  pre: ({ children }: MDXPreProps) => {
    // Extract code element from pre
    if (typeof children === 'object' && children && 'props' in children) {
      const codeElement = children as React.ReactElement
      return codeElement
    }
    
    return (
      <EnhancedCodeBlock>
        {typeof children === 'string' ? children : ''}
      </EnhancedCodeBlock>
    )
  }
}
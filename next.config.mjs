import createMDX from '@next/mdx'
import rehypeExpressiveCode from 'rehype-expressive-code'

/** @type {import('rehype-expressive-code').RehypeExpressiveCodeOptions} */
const rehypeExpressiveCodeOptions = {
  frames: true,
  themes: ['github-dark', 'github-light'],
  lineNumbers: true,
  tabSize: 2,
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
}

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [
      [rehypeExpressiveCode, rehypeExpressiveCodeOptions],
    ],
  },
})

export default withMDX(nextConfig) 
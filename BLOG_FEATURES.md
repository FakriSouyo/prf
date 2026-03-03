# Blog Features Documentation

## Overview
Blog system telah berhasil ditambahkan ke portfolio dengan fitur-fitur berikut:

## Fitur yang Ditambahkan

### 1. Slug System
- Setiap blog post memiliki slug unik yang didefinisikan dalam frontmatter
- URL format: `/blog/[slug]`
- Contoh: `/blog/machine-learning-insights`

### 2. Blog Posts
Semua blog posts telah diperbarui dengan slug:
- `machine-learning-insights` - Machine Learning Insights
- `nextjs-14-features` - Next.js 14 Features Deep Dive
- `react-best-practices` - React Best Practices 2024
- `web-performance-optimization` - Complete Web Performance Optimization Guide

### 3. Halaman Blog
- **Halaman Utama Blog**: `/blog` - Menampilkan daftar semua blog posts
- **Halaman Individual**: `/blog/[slug]` - Menampilkan konten blog berdasarkan slug
- **Halaman Not Found**: Menangani blog post yang tidak ditemukan

### 4. API Endpoints
- `GET /api/blog` - Mengambil semua blog posts
- `GET /api/blog/[slug]` - Mengambil blog post berdasarkan slug

### 5. Fitur UI/UX
- **Responsive Design**: Tampilan yang responsif untuk desktop dan mobile
- **Reading Time**: Estimasi waktu baca otomatis
- **Share Functionality**: Tombol share dengan fallback copy to clipboard
- **SEO Optimization**: Metadata dinamis untuk setiap blog post
- **Static Generation**: Pre-rendering untuk performa optimal

### 6. Styling
- **Prose Styling**: Styling khusus untuk konten blog (heading, paragraph, code blocks, dll)
- **Line Clamp**: Text truncation untuk card blog
- **Hover Effects**: Animasi hover pada card blog
- **Dark Mode Support**: Mendukung tema gelap dan terang

### 7. Navigation
- **Link dari Homepage**: Tombol "View All Posts" di section blog
- **Breadcrumb Navigation**: Tombol back untuk navigasi yang mudah
- **Direct URL Access**: Akses langsung ke blog post via URL

## Struktur File

```
src/
├── app/
│   ├── blog/
│   │   ├── page.tsx                    # Halaman utama blog
│   │   ├── not-found.tsx              # Not found untuk blog utama
│   │   └── [slug]/
│   │       ├── page.tsx               # Halaman blog individual
│   │       └── not-found.tsx          # Not found untuk blog post
│   └── api/
│       └── blog/
│           ├── route.ts               # API untuk semua blog posts
│           └── [slug]/route.ts        # API untuk blog post individual
├── components/
│   └── share-button.tsx               # Komponen share button
└── content/
    └── blog/
        ├── machine-learning-insights.mdx
        ├── nextjs-14-features.mdx
        ├── react-best-practices.mdx
        └── web-performance-optimization.mdx
```

## Cara Penggunaan

### 1. Menambahkan Blog Post Baru
1. Buat file `.mdx` baru di `src/content/blog/`
2. Tambahkan frontmatter dengan slug unik:
```yaml
---
slug: "judul-blog-post"
title: "Judul Blog Post"
subtitle: "Subtitle Blog Post"
description: "Deskripsi singkat blog post"
publishedAt: "2024-01-01"
tags: ["Tag1", "Tag2"]
featured: true
image: "/blog/image.jpg"
status: "published"
---
```

### 2. Mengakses Blog
- **Semua Posts**: Kunjungi `/blog`
- **Individual Post**: Kunjungi `/blog/[slug]`
- **Dari Homepage**: Klik "View All Posts" di section blog

### 3. Customization
- **Styling**: Edit `src/app/globals.css` untuk prose styling
- **Components**: Modifikasi komponen di `src/components/`
- **API**: Sesuaikan logic di `src/app/api/blog/`

## Technical Details

### Dependencies
- `next-mdx-remote` - Untuk rendering MDX
- `gray-matter` - Untuk parsing frontmatter
- `rehype-expressive-code` - Untuk syntax highlighting
- `remark-gfm` - Untuk GitHub Flavored Markdown

### Performance
- **Static Generation**: Blog posts di-generate secara statis
- **Image Optimization**: Menggunakan Next.js Image optimization
- **Caching**: API responses di-cache untuk performa optimal

### SEO
- **Dynamic Metadata**: Setiap blog post memiliki metadata unik
- **Open Graph**: Support untuk social media sharing
- **Structured Data**: Siap untuk schema markup

## Testing

Untuk test fitur blog:
1. Jalankan development server: `npm run dev`
2. Kunjungi `http://localhost:3000/blog`
3. Test navigasi ke blog post individual
4. Test fitur share dan responsive design

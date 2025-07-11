This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Portfolio Data Structure

This folder contains all the customizable data for the portfolio website. You can easily modify any content by editing the respective files.

## Files Overview

### `personal.ts`
Contains personal information like name, title, location, and description.

### `projects.ts`
All project data including titles, descriptions, technologies, and links.

### `skills.ts`
Technical skills with categories and proficiency levels.

### `experience.ts`
Work experience with roles, companies, and descriptions.

### `education.ts`
Educational background and achievements.

### `blog.ts`
Blog posts and articles.

### `social.ts`
Social media links and profiles.

### `index.ts`
Central export file for easy imports.

## How to Customize

1. **Personal Info**: Edit `personal.ts` to update your name, title, and description
2. **Projects**: Add/remove projects in `projects.ts`
3. **Skills**: Update your technical skills in `skills.ts`
4. **Experience**: Modify work history in `experience.ts`
5. **Education**: Update educational background in `education.ts`
6. **Blog**: Add blog posts in `blog.ts`
7. **Social**: Update social media links in `social.ts`

## Adding New Data

To add new fields:
1. Update the interface in the respective file
2. Add the new data to the array/object
3. Update the component to display the new field

## TypeScript Benefits

- Type safety for all data
- Auto-completion in your editor
- Compile-time error checking
- Better refactoring support

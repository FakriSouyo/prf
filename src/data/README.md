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

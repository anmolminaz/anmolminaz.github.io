# Academic Personal Website

A clean, minimal academic personal website for an epidemiologist built with Next.js 14, TypeScript, and Tailwind CSS. Uses Notion as a CMS for content management.

## Features

- **Minimalist Design**: Clean, academic-focused layout with serif typography
- **Notion CMS**: All content sourced from Notion databases
- **Static Generation**: ISR for optimal performance
- **Responsive**: Mobile-friendly design
- **SEO Optimized**: Proper meta tags and structure

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- @tailwindcss/typography
- Notion API

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```

   Fill in your Notion credentials:
   - `NOTION_TOKEN`: Your Notion integration token
   - Database IDs for research, analysis, blog, and publications

4. Run the development server:
   ```bash
   npm run dev
   ```

## Notion Database Setup

Create the following databases in Notion with these properties:

### Research Database
- Title (title)
- Slug (rich_text)
- Summary (rich_text)
- Tags (multi_select)
- Role (rich_text) - optional

### Analysis Database
- Title (title)
- Slug (rich_text)
- Summary (rich_text)
- Tags (multi_select)

### Blog Database
- Title (title)
- Slug (rich_text)
- Summary (rich_text)
- Date (date)
- Tags (multi_select)

### Publications Database
- Title (title)
- Authors (rich_text)
- Journal (rich_text)
- Year (number)
- DOI (url)

## Deployment

Deploy to Vercel for optimal performance with ISR.

```bash
npm run build
npm run start
```

## Project Structure

```
├── app/
│   ├── analysis/
│   ├── blog/
│   ├── publications/
│   ├── research/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── Navigation.tsx
│   ├── Footer.tsx
│   └── NotionRenderer.tsx
├── lib/
│   └── notion.ts
├── types/
│   └── index.ts
└── README.md
```

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

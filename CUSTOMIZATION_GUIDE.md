# SecureHub Customization Guide

## 🎨 Theme Overview

Your cybersecurity blog now features a **Matrix/Terminal-inspired theme** with:

- **Primary Color:** Neon green (#00FF41) - evokes terminal/hacker aesthetic
- **Background:** Deep dark with blue tint for tech feel
- **Fonts:** 
  - Inter for body text (clean, modern)
  - JetBrains Mono for code/monospace (developer-focused)
- **Default Mode:** Dark theme (can be toggled by users)

## 📝 Content Customization

### 1. Site Metadata (`data/siteMetadata.js`)

Update these fields with your information:

```javascript
title: 'SecureHub - Cybersecurity Insights',
author: 'Your Name',  // ← Change this
headerTitle: 'SecureHub',
description: 'Expert cybersecurity insights...',
siteUrl: 'https://your-domain.com',  // ← Your actual domain
siteRepo: 'https://github.com/yourusername/securehub',  // ← Your repo
email: 'address@yoursite.com',  // ← Your email
github: 'https://github.com/yourusername',  // ← Your GitHub
x: 'https://twitter.com/yourhandle',  // ← Your X/Twitter
linkedin: 'https://www.linkedin.com/in/yourprofile',  // ← Your LinkedIn
```

### 2. Newsletter Setup

The template supports multiple newsletter providers. Current setting: **Buttondown**

**To configure Buttondown:**
1. Sign up at [buttondown.email](https://buttondown.email)
2. Get your API key from settings
3. Create `.env.local` file:
   ```bash
   BUTTONDOWN_API_KEY=your_api_key_here
   ```

**Alternative providers** (update in `siteMetadata.js`):
- Mailchimp
- ConvertKit
- Klaviyo
- EmailOctopus
- Beehiiv

See `.env.example` for required environment variables for each provider.

### 3. Blog Posts

**Location:** `data/blog/`

**Create new posts:**
```bash
# Create a new MDX file
touch data/blog/your-post-title.mdx
```

**Frontmatter template:**
```markdown
---
title: 'Understanding Zero-Day Vulnerabilities'
date: '2024-01-20'
tags: ['security', 'vulnerabilities', 'threat-intelligence']
draft: false
summary: 'A deep dive into zero-day exploits and how to protect against them.'
authors: ['default']
---

Your content here...
```

**Supported features:**
- Markdown and MDX
- Code syntax highlighting
- Math equations (KaTeX)
- Images and diagrams
- Citations and footnotes
- GitHub-style alerts

### 4. Podcast Episodes

**Location:** `data/podcastData.ts`

**Add new episodes:**
```typescript
{
  title: 'Episode 3: Your Episode Title',
  description: 'Episode description...',
  date: '2024-02-01',
  duration: '48:20',
  imgSrc: '/static/images/podcast-cover.jpg',
  spotifyUrl: 'https://spotify.com/your-episode',
  appleUrl: 'https://podcasts.apple.com/your-episode',
}
```

**Update podcast platform links:**
Edit `app/podcast/page.tsx` to update the main Spotify and Apple Podcasts links.

### 5. Author Profiles

**Location:** `data/authors/`

Create author profiles in MDX format:
```markdown
---
name: 'Your Name'
avatar: '/static/images/avatar.png'
occupation: 'Security Researcher'
company: 'Your Company'
email: 'you@example.com'
twitter: 'https://twitter.com/yourhandle'
linkedin: 'https://linkedin.com/in/yourprofile'
github: 'https://github.com/yourusername'
---

Your bio here...
```

## 🎨 Advanced Theming

### Color Customization

Edit `css/tailwind.css` to modify colors:

```css
/* Primary color (currently neon green) */
--color-primary-500: oklch(0.70 0.24 145);

/* Change to cyan: */
--color-primary-500: oklch(0.70 0.15 195);

/* Change to purple: */
--color-primary-500: oklch(0.65 0.22 290);
```

### Alternative Color Schemes

**Professional Blue/Cyan:**
```css
--color-primary-500: oklch(0.60 0.18 220); /* Deep blue */
```

**Warning Orange (for alerts):**
```css
--color-accent-orange: oklch(0.68 0.18 35);
```

### Font Changes

Edit `app/layout.tsx` to change fonts:

```typescript
// Current: Inter + JetBrains Mono
// Alternative: Roboto Mono for full monospace feel
import { Roboto_Mono } from 'next/font/google'

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
})
```

## 🖼️ Images and Assets

### Logo
- Replace: `public/static/images/logo.png`
- Recommended size: 512x512px
- Use transparent background

### Favicon
- Replace files in: `public/static/favicons/`
- Generate favicons at [realfavicongenerator.net](https://realfavicongenerator.net)

### Social Card
- Replace: `public/static/images/twitter-card.png`
- Recommended size: 1200x630px
- Used for social media previews

### Podcast Cover
- Add: `public/static/images/podcast-cover.jpg`
- Recommended size: 3000x3000px (square)

## 🚀 Development

**Install dependencies:**
```bash
yarn install
```

**Run development server:**
```bash
yarn dev
```

**Build for production:**
```bash
yarn build
```

**Preview production build:**
```bash
yarn serve
```

## 📦 Deployment

### Netlify (Recommended)
Already configured with `netlify.toml`. Just:
1. Push to GitHub
2. Connect repository to Netlify
3. Deploy automatically

### Vercel
```bash
vercel deploy
```

### Static Export
```bash
EXPORT=1 UNOPTIMIZED=1 yarn build
# Deploy the 'out' folder
```

## 🔒 Security Features

Your blog includes:
- Content Security Policy headers
- XSS protection
- HTTPS enforcement
- Secure cookie settings
- Input sanitization

**Review security headers in:** `next.config.js`

## 📧 Comments System

Current: **Giscus** (GitHub Discussions)

**Setup:**
1. Visit [giscus.app](https://giscus.app)
2. Follow configuration steps
3. Add to `.env.local`:
   ```bash
   NEXT_PUBLIC_GISCUS_REPO=username/repo
   NEXT_PUBLIC_GISCUS_REPOSITORY_ID=your_repo_id
   NEXT_PUBLIC_GISCUS_CATEGORY=Announcements
   NEXT_PUBLIC_GISCUS_CATEGORY_ID=your_category_id
   ```

## 🎯 SEO Optimization

- Update `robots.txt` in `public/`
- Configure sitemap in `app/sitemap.ts`
- Add structured data (already configured)
- Update meta descriptions in posts

## 📊 Analytics

Supports multiple providers. Configure in `siteMetadata.js`:

**Umami (privacy-focused):**
```javascript
umamiAnalytics: {
  umamiWebsiteId: process.env.NEXT_UMAMI_ID,
}
```

**Google Analytics:**
```javascript
googleAnalytics: {
  googleAnalyticsId: 'G-XXXXXXX',
}
```

## 🎨 UI Components

Customize components in `components/`:
- `Header.tsx` - Navigation bar
- `Footer.tsx` - Footer content
- `Card.tsx` - Blog post cards
- `Tag.tsx` - Tag styling

## 📱 Responsive Design

The theme is fully responsive. Test on:
- Mobile (320px+)
- Tablet (768px+)
- Desktop (1024px+)

## 🔧 Troubleshooting

**Build errors:**
```bash
# Clear cache and rebuild
rm -rf .next .contentlayer
yarn build
```

**Font not loading:**
- Check font import in `app/layout.tsx`
- Verify font variable in `css/tailwind.css`

**Colors not applying:**
- Ensure dark mode is enabled
- Check browser dev tools for CSS conflicts

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [Contentlayer](https://contentlayer.dev)
- [MDX](https://mdxjs.com)

## 🎉 Next Steps

1. ✅ Update site metadata with your info
2. ✅ Replace logo and images
3. ✅ Configure newsletter provider
4. ✅ Set up podcast RSS feed
5. ✅ Write your first blog post
6. ✅ Configure analytics
7. ✅ Deploy to production

---

**Need help?** Check the original template docs or create an issue in your repository.

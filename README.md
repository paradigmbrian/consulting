# Consulting Website

A modern, responsive React website for the MVP Tech Blueprint consulting service.

## Tech Stack

- **React 19** with TypeScript
- **Next.js** (static export) for development and building
- **CSS** (no framework dependencies)
- **Netlify** for hosting

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The site will be available at `http://localhost:3000`

### Building

Build for production:

```bash
npm run build
```

The production build (a static export) will be in the `out` directory.

### Preview Production Build

Preview the production build locally, the way Netlify serves it:

```bash
npm run preview
```

This serves `out/` at `http://localhost:4173`.

## Deployment to Netlify

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Connect your repository to Netlify
3. Netlify will automatically detect the build settings from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `out`
4. Deploy!

The `netlify.toml` file is already configured with:
- Build settings
- 301 redirects for the legacy `/demos/*` URLs

There is no SPA catch-all — the static export emits a real file for every route, and
unknown URLs get `out/404.html`.

## Project Structure

```
├── src/
│   ├── app/              # Routes — thin files that import components
│   ├── components/       # React components (paired .tsx + .css)
│   ├── data/              # Site content and the workflow/service source of truth
│   ├── lib/               # Routes list, SEO metadata and JSON-LD builders
│   ├── demos/             # Interactive per-automation demos
│   ├── showcases/         # Static product-shot snippets
│   └── index.css          # Global styles
├── scripts/verify-seo/    # Post-build SEO gate
├── e2e/                   # Playwright tests
├── netlify.toml           # Netlify configuration
└── package.json           # Dependencies
```

See `CLAUDE.md` for the full source layout.

## Customization

### Updating Content

- Edit component files in `src/components/` to update text and content
- The Calendly link is `CALENDLY_URL` in `src/data/site.ts`

### Styling

- Global styles and CSS variables are in `src/index.css`
- Component-specific styles are in each component's `.css` file
- Color scheme can be adjusted via CSS variables in `index.css`

## Features

- ✅ Fully responsive design
- ✅ Modern, clean UI
- ✅ TypeScript for type safety
- ✅ Static HTML for every route (Next.js static export)
- ✅ Optimized for Netlify deployment
- ✅ SEO-friendly meta tags


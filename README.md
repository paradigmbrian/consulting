# Consulting Website

A modern, responsive React website for the MVP Tech Blueprint consulting service.

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
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

The site will be available at `http://localhost:5173`

### Building

Build for production:

```bash
npm run build
```

The production build will be in the `dist` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## Deployment to Netlify

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Connect your repository to Netlify
3. Netlify will automatically detect the build settings from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Deploy!

The `netlify.toml` file is already configured with:
- Build settings
- SPA redirect rules (all routes redirect to `index.html`)

## Project Structure

```
├── src/
│   ├── components/      # React components
│   │   ├── Hero.tsx     # Hero section
│   │   ├── Problem.tsx  # Problem section
│   │   ├── Solution.tsx # Solution section
│   │   ├── Offer.tsx    # What's included
│   │   ├── CTA.tsx      # Call to action
│   │   └── Footer.tsx   # Footer
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── netlify.toml         # Netlify configuration
└── package.json         # Dependencies
```

## Customization

### Updating Content

- Edit component files in `src/components/` to update text and content
- The Calendly link is in `Hero.tsx` and `CTA.tsx`

### Styling

- Global styles and CSS variables are in `src/index.css`
- Component-specific styles are in each component's `.css` file
- Color scheme can be adjusted via CSS variables in `index.css`

## Features

- ✅ Fully responsive design
- ✅ Modern, clean UI
- ✅ TypeScript for type safety
- ✅ Fast build times with Vite
- ✅ Optimized for Netlify deployment
- ✅ SEO-friendly meta tags


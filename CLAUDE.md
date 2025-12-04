# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Astro-based portfolio website integrated with Storyblok CMS. The site uses Tailwind CSS 4 with daisyUI 5 for styling and follows an atomic design component structure.

## Detailed Documentation

For comprehensive guides on specific areas:
- **[docs/astro.md](docs/astro.md)** - Astro architecture, routing patterns, component patterns, utilities, and build process
- **[docs/styling.md](docs/styling.md)** - Tailwind CSS 4, daisyUI 5, custom theme, typography, and responsive design patterns
- **[docs/storyblok.md](docs/storyblok.md)** - Storyblok integration, API usage, component patterns, rich text, and visual editor
- **[docs/components.md](docs/components.md)** - Component architecture, atomic design structure, daisyUI implementation patterns

These docs contain detailed examples, patterns, and best practices for each area.

## Development Commands

### Essential Commands
- `npm run dev` - Start local dev server at `localhost:4321`
- `npm run build` - Build production site to `./dist/`
- `npm run preview` - Preview production build locally
- `npm run types` - Pull Storyblok components and generate TypeScript types (requires space ID)

### Type Generation
The `types` command connects to Storyblok space `285719928053161` to:
1. Pull component schemas from Storyblok
2. Generate TypeScript definitions

## Environment Setup

Required environment variables (copy from `.env.sample`):
```
STORYBLOK_TOKEN=<your-token>
STORYBLOK_SPACE_ID=<your-space-id>
```

The Storyblok API is configured for the EU region.

## Architecture

### Content Management
- **Storyblok Integration**: Headless CMS powering all content
- **Component Mapping**: Storyblok components are mapped to Astro components in `astro.config.mjs`
- **Global Content**: Header, footer, and SEO data are fetched globally from `cdn/stories/global/*` endpoints
- **Version Control**: Development uses `draft` content, production uses `published`
- **Bridge Mode**: Enabled for live preview in Storyblok editor

### Component Structure
Follows atomic design principles with daisyUI 5 implementation:

```
src/components/
├── atoms/              # Basic building blocks
│   ├── Link.astro     # Button-styled links (daisyUI btn)
│   └── NavLink.astro  # Navigation links (daisyUI link)
├── molecules/          # Combinations of atoms
│   └── BlogPostCard.astro  # Blog card (daisyUI card)
├── organisms/          # Complex UI sections
│   ├── Header.astro        # Navigation (daisyUI navbar)
│   ├── Footer.astro        # Footer (daisyUI footer)
│   ├── BlogPost.astro      # Full post display
│   ├── BlogPostList.astro  # Curated post list
│   ├── BlogPostGrid.astro  # Post grid for listing
│   ├── Intro.astro         # Intro section
│   └── TextBackground.astro # Hero section (daisyUI hero)
└── Page.astro         # Layout helper (root level)
```

**All components updated to use**:
- daisyUI 5 components (navbar, card, footer, hero, etc.)
- Semantic colors (`bg-base-*`, `text-base-content`)
- Responsive design patterns
- Proper TypeScript types

### Styling System

**Tailwind CSS 4 + daisyUI 5**:
- Main stylesheet: `src/styles.css`
- Uses `@import "tailwindcss"` syntax (Tailwind v4 pattern)
- daisyUI plugin loaded via `@plugin "daisyui"`
- Custom theme: `nearanimal` (dark theme with custom color scheme)
- Typography plugin enabled via `@tailwindcss/typography`

**Important daisyUI 5 Rules** (from `.cursor/rules/daisyui.mdc`):
- No `tailwind.config.js` file - Tailwind v4 uses CSS-only config
- Use daisyUI semantic colors (`primary`, `base-100`, etc.) instead of Tailwind color names for theme compatibility
- Avoid `dark:` modifiers - daisyUI colors adapt to themes automatically
- Components can be customized with Tailwind utilities; use `!` suffix for specificity overrides (sparingly)
- Responsive layouts: Use variants like `sm:footer-horizontal`, `lg:drawer-open`

**Custom Theme Variables**:
- Fonts: `--font-primary` (Hind), `--font-secondary` (Cardo)
- Custom fonts with subset versions for performance (prioritized via CSS cascade)

### Routing
- Static site generation
- File-based routing in `src/pages/`
- Blog routes: `/blog/[...slug].astro` for dynamic blog posts
- Path aliases: `@/*` maps to project root

### SEO & Meta
Layout component (`src/layouts/Layout.astro`) handles:
- Dynamic meta tags and Open Graph data
- Canonical URLs
- Sitemap integration
- Font preloading for performance
- Fetches global SEO data from Storyblok

## Key Technical Details

### Storyblok Component Pattern
Components receive a `blok` prop containing Storyblok data:
```astro
const { blok } = Astro.props;
```

The `Page` component dynamically renders child blocks:
```astro
blok.body?.map((blok: any) => <StoryblokComponent blok={blok} />)
```

### HTTPS Development
- Uses `vite-plugin-mkcert` for local HTTPS (required for Storyblok Bridge)

### TypeScript Configuration
- Extends Astro's strict TypeScript config
- Path alias `@/*` configured for absolute imports from project root

## Working with Storyblok

1. **Adding New Components**:
   - Create Astro component in `src/components/`
   - Register mapping in `astro.config.mjs` integrations
   - Run `npm run types` to regenerate types after creating components in Storyblok

2. **Content Fetching**:
   - Use `useStoryblokApi()` to get API client
   - Version toggling: `import.meta.env.DEV ? "draft" : "published"`

3. **Live Preview**:
   - Bridge mode enabled in config
   - Requires HTTPS in development (handled by mkcert plugin)

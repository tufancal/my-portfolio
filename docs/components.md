# Component Architecture - Atomic Design

This document describes the component structure, organization, and daisyUI implementation patterns.

## Atomic Design Structure

Components are organized following atomic design principles:

```
src/components/
├── atoms/           # Basic building blocks
│   ├── Link.astro
│   └── NavLink.astro
├── molecules/       # Combinations of atoms
│   └── BlogPostCard.astro
├── organisms/       # Complex components
│   ├── Header.astro
│   ├── Footer.astro
│   ├── BlogPost.astro
│   ├── BlogPostList.astro
│   ├── BlogPostGrid.astro
│   ├── Intro.astro
│   └── TextBackground.astro
└── Page.astro       # Layout helper (root level)
```

### Classification Guide

**Atoms**: Smallest, indivisible UI elements
- Single purpose
- Highly reusable
- No dependencies on other components
- Examples: buttons, links, icons, inputs

**Molecules**: Simple combinations of atoms
- Serves a single, well-defined purpose
- Composed of 2-3 atoms
- Reusable in different contexts
- Examples: search form, card component, navigation item

**Organisms**: Complex UI sections
- Contains multiple molecules and/or atoms
- Represents a distinct section of the interface
- May contain business logic
- Examples: header with navigation, blog post list, footer

## Atoms

### Link (`atoms/Link.astro`)

Button-styled link component using daisyUI button classes.

**Props**:
```typescript
interface Props {
  blok: Link;
  variant?: "primary" | "secondary" | "accent" | "ghost" | "link";
  size?: "xs" | "sm" | "md" | "lg";
}
```

**daisyUI Components Used**:
- `btn` - Base button component
- `btn-{variant}` - Color variants
- `btn-{size}` - Size modifiers

**Usage**:
```astro
<StoryblokComponent blok={link} variant="primary" size="md" />
```

**Features**:
- Handles email links (`mailto:`)
- External link security (rel="noopener noreferrer")
- Storyblok visual editor integration
- Responsive sizing

### NavLink (`atoms/NavLink.astro`)

Text link component for navigation with hover effects.

**Props**:
```typescript
interface Props {
  blok: NavLink;
  variant?: "primary" | "secondary";
}
```

**daisyUI Components Used**:
- `link` - Base link component
- `link-hover` - Hover underline effect

**Usage**:
```astro
<StoryblokComponent blok={navLink} variant="secondary" />
```

**Features**:
- Responsive text sizing based on `isSmall` field
- Clean hover transitions
- Semantic link handling (email, external, internal)

## Molecules

### BlogPostCard (`molecules/BlogPostCard.astro`)

Card component for displaying blog post previews.

**Props**:
```typescript
interface Props {
  headline: string;
  date: string;
  introText: string;
  slug: string;
  image: {
    src: string;
    srcset: string;
    sizes: string;
  };
  alt: string;
  linkText?: string;
}
```

**daisyUI Components Used**:
- `card` - Container with shadow
- `card-body` - Content area
- `card-title` - Heading
- `card-actions` - Action button area
- `btn`, `btn-ghost`, `btn-sm` - Action button

**Features**:
- Responsive image with hover zoom effect
- Semantic HTML (article, figure, time)
- Line-clamped intro text (3 lines max)
- Smooth transitions on hover
- Read more CTA with animated arrow

**Usage**:
```astro
<BlogPostCard
  headline="Post Title"
  date="2025-01-01"
  introText="<p>Intro text...</p>"
  slug="blog/my-post"
  image={imageData}
  alt="Post image"
  linkText="Read more"
/>
```

## Organisms

### Header (`organisms/Header.astro`)

Main site navigation with responsive menu.

**daisyUI Components Used**:
- `navbar` - Navigation container
- `navbar-start`, `navbar-center`, `navbar-end` - Layout sections
- `dropdown` - Mobile menu
- `menu`, `menu-sm`, `menu-horizontal` - Menu lists
- `btn`, `btn-ghost`, `btn-primary` - Buttons

**Features**:
- Mobile hamburger menu (hidden on lg+)
- Desktop horizontal menu (visible on lg+)
- Responsive logo/brand
- CTA button in navbar-end
- Proper z-index for dropdown
- Shadow for depth

**Responsive Behavior**:
- **Mobile** (< 1024px): Hamburger menu with dropdown
- **Desktop** (≥ 1024px): Horizontal navigation bar

### Footer (`organisms/Footer.astro`)

Site footer with copyright, legal links, and social media.

**daisyUI Components Used**:
- `footer` - Footer container
- `footer-center`, `footer-horizontal` - Layout modifiers
- `link`, `link-hover` - Footer links

**Features**:
- Responsive layout (centered mobile, horizontal desktop)
- Three sections: copyright, legal links, social media
- Fetches global social media data from Storyblok
- Semantic link handling
- daisyUI semantic colors

**Responsive Behavior**:
- **Mobile**: Stacked vertical layout, centered
- **Desktop**: Horizontal layout with space-between

### BlogPost (`organisms/BlogPost.astro`)

Full blog post display with metadata, hero image, and content.

**daisyUI Components Used**:
- `badge`, `badge-outline`, `badge-ghost` - Metadata badges
- `card`, `card-body`, `card-title` - Table of contents
- `menu`, `menu-sm` - ToC navigation

**Features**:
- Article metadata badges (date, author)
- Hero image with responsive optimization
- Bold intro text section
- Automatic table of contents from heading anchors
- Prose typography styling
- Image optimization in rich text
- Semantic HTML (article, figure, time)

**Typography**:
- Uses `@tailwindcss/typography` plugin
- Custom prose color classes for theme compatibility
- Responsive text sizing (base → lg on large screens)

### BlogPostList (`organisms/BlogPostList.astro`)

Curated list of blog post cards (typically 2 posts).

**daisyUI Components Used**:
- `divider`, `divider-start` - Section heading with line

**Features**:
- Fetches blog posts from Storyblok
- Uses BlogPostCard molecule
- Responsive 2-column grid
- Section heading with decorative divider
- Configurable link text from Storyblok

**Usage**: Mapped to Storyblok `blogPostList` component

### BlogPostGrid (`organisms/BlogPostGrid.astro`)

Full grid of blog posts for listing page (6 posts).

**Features**:
- Fetches all blog posts from Storyblok
- Uses BlogPostCard molecule
- Responsive grid: 1 col (mobile) → 2 cols (tablet) → 3 cols (desktop)
- Page heading and description
- Semantic spacing and typography

**Usage**: Imported directly in `/blog` page

### Intro (`organisms/Intro.astro`)

Introduction section with heading, rich text, and action blocks.

**daisyUI Components Used**:
- `divider`, `divider-start` - Section heading

**Features**:
- Decorative divider for heading
- Rich text content with prose styling
- Flexible action blocks (CTAs, links)
- Responsive flexbox layout for actions
- Max-width container for readability

**Usage**: Mapped to Storyblok `intro` component

### TextBackground (`organisms/TextBackground.astro`)

Hero section with background overlay and optional action blocks.

**daisyUI Components Used**:
- `hero` - Hero container
- `hero-overlay` - Background overlay
- `hero-content` - Content positioning

**Features**:
- Responsive text sizing based on `isTitle` flag
- Background overlay for contrast
- Centered content presentation
- Optional action blocks grid
- Rounded corners (`rounded-box`)

**Text Sizing**:
- **Title**: 4xl → 5xl → 6xl (mobile → tablet → desktop)
- **Normal**: 2xl → 3xl → 4xl (mobile → tablet → desktop)

**Usage**: Mapped to Storyblok `textBackground` component

## Layout Helper

### Page (`Page.astro`)

Dynamic page container that renders body blocks from Storyblok.

**Pattern**:
```astro
{
  blok.body?.map((blok: any) => {
    return <StoryblokComponent blok={blok} />;
  })
}
```

**Usage**: Mapped to Storyblok `page` component for flexible page building.

## daisyUI Implementation Patterns

### Color System

All components use daisyUI semantic colors for theme compatibility:

**Backgrounds**:
- `bg-base-100` - Main backgrounds (cards, navbar)
- `bg-base-200` - Elevated surfaces (footer, ToC card)
- `bg-base-300` - Hero overlays

**Text**:
- `text-base-content` - Primary text
- `text-base-content/70` - Secondary text (70% opacity)
- `text-base-content/80` - Muted text (80% opacity)

**Brand Colors**:
- `btn-primary`, `text-primary` - Primary actions
- `btn-secondary` - Secondary actions
- `btn-ghost` - Subtle actions
- `btn-accent` - Accent actions

### Responsive Patterns

Components use Tailwind's mobile-first approach:

```astro
<!-- Responsive grid -->
<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

<!-- Responsive visibility -->
<span class="hidden sm:inline">Desktop text</span>

<!-- Responsive menu -->
<ul class="menu menu-vertical lg:menu-horizontal">
```

**Breakpoints**:
- `sm`: 640px (tablets)
- `md`: 768px (small laptops)
- `lg`: 1024px (desktops)
- `xl`: 1280px (large screens)

### Component Composition

Components use `StoryblokComponent` for dynamic rendering:

```astro
{blok.links?.map((link) => (
  <li>
    <StoryblokComponent blok={link} variant="secondary" />
  </li>
))}
```

**Benefits**:
- Dynamic component resolution
- Pass additional props (variant, size)
- Maintains Storyblok integration

### Transitions and Animations

Smooth transitions using Tailwind utilities:

```astro
<!-- Hover scale on images -->
class="transition-transform duration-300 group-hover:scale-105"

<!-- Shadow transition on cards -->
class="hover:shadow-md transition-shadow"

<!-- Translate on icons -->
class="transition-transform group-hover/link:translate-x-1"
```

**Pattern**: Use `group` and `group-hover:` for hover effects on child elements.

### Semantic HTML

All components use proper semantic elements:

- `<article>` for blog posts
- `<figure>` for images
- `<time datetime="...">` for dates
- `<nav>` for navigation
- `<footer>` for footer
- `<section>` for content sections

## Best Practices

1. **Use daisyUI Components**: Prefer daisyUI components over custom Tailwind styling
2. **Semantic Colors**: Always use `bg-base-*`, `text-base-content` for theme compatibility
3. **Responsive First**: Start mobile, add breakpoint modifiers
4. **Group Hover**: Use `group` and `group-hover:` for interactive cards
5. **Proper Semantic HTML**: Use correct HTML5 elements
6. **Accessibility**: Include aria-labels, alt text, proper button roles
7. **Type Safety**: Import and use Storyblok TypeScript types
8. **Visual Editor**: Spread `{...storyblokEditable(blok)}` on root elements
9. **Consistent Spacing**: Use daisyUI spacing classes and Tailwind utilities
10. **Loading States**: Use `loading="lazy"` for images below fold

## Adding New Components

### Creating an Atom

1. Create file in `src/components/atoms/`
2. Use daisyUI base components (btn, link, badge, etc.)
3. Accept `blok` prop with Storyblok type
4. Add `{...storyblokEditable(blok)}` to root element
5. Use semantic colors
6. Map in `astro.config.mjs`

### Creating a Molecule

1. Create file in `src/components/molecules/`
2. Compose 2-3 atoms or daisyUI components
3. Accept specific props (not blok unless Storyblok component)
4. Focus on reusability
5. Use daisyUI layout components (card, menu, etc.)

### Creating an Organism

1. Create file in `src/components/organisms/`
2. Compose molecules and atoms
3. May include data fetching logic
4. Map to Storyblok component if content-driven
5. Use daisyUI complex components (navbar, footer, hero, etc.)

## Migration from Old Components

All components have been updated with:

✅ **daisyUI Components**: Using daisyUI classes instead of raw Tailwind
✅ **Atomic Structure**: Organized by complexity
✅ **Semantic Colors**: Using `bg-base-*`, `text-base-content`
✅ **Responsive Design**: Mobile-first with breakpoint modifiers
✅ **Proper Typography**: Using prose classes for rich text
✅ **Accessibility**: Semantic HTML, ARIA labels, proper link handling
✅ **Type Safety**: All components use TypeScript interfaces
✅ **Visual Editor**: All Storyblok components use `storyblokEditable`

## Component Reference Matrix

| Component | Type | daisyUI Components | Storyblok Mapped |
|-----------|------|-------------------|------------------|
| Link | Atom | btn, btn-* | ✅ |
| NavLink | Atom | link, link-hover | ✅ |
| BlogPostCard | Molecule | card, card-body, card-title | ❌ |
| Header | Organism | navbar, dropdown, menu | ✅ |
| Footer | Organism | footer, link | ✅ |
| BlogPost | Organism | badge, card, menu | ✅ |
| BlogPostList | Organism | divider | ✅ |
| BlogPostGrid | Organism | (uses BlogPostCard) | ❌ |
| Intro | Organism | divider | ✅ |
| TextBackground | Organism | hero, hero-overlay | ✅ |
| Page | Helper | (renders bloks) | ✅ |

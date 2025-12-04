# Styling Architecture - Tailwind CSS 4 & daisyUI 5

This document covers the styling system, theme configuration, and component styling patterns used in this portfolio.

## Tech Stack

- **Tailwind CSS 4** - Utility-first CSS framework (latest v4 with CSS-first config)
- **daisyUI 5** - Component library for Tailwind CSS 4
- **@tailwindcss/typography** - Beautiful typographic defaults for rich text

## Configuration

### Tailwind v4 Setup (Important!)

**CRITICAL**: Tailwind CSS v4 does NOT use `tailwind.config.js`. Configuration is done entirely in CSS.

**Integration via Vite** (`astro.config.mjs`):
```javascript
vite: {
  plugins: [tailwindcss()], // Uses @tailwindcss/vite
}
```

### Main Stylesheet (`src/styles.css`)

All configuration happens in this file:

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";
@plugin "daisyui";

@plugin "daisyui/theme" {
  /* Custom theme configuration */
}

@theme {
  /* Custom theme variables */
}

/* Font face declarations */
```

**Structure**:
1. Import Tailwind CSS base
2. Import plugins (typography, daisyUI)
3. Configure custom daisyUI theme
4. Define custom theme variables
5. Declare font faces

## daisyUI 5 Configuration

### Custom Theme: "nearanimal"

Full custom theme configuration:

```css
@plugin "daisyui/theme" {
  name: "nearanimal";
  default: true;
  prefersdark: false;
  color-scheme: "dark";

  /* Semantic Colors */
  --color-base-100: oklch(14% 0 0);
  --color-base-200: oklch(20% 0 0);
  --color-base-300: oklch(26% 0 0);
  --color-base-content: oklch(97% 0 0);
  --color-primary: oklch(80% 0.114 19.571);
  --color-primary-content: oklch(25% 0.092 26.042);
  --color-secondary: oklch(82% 0.12 346.018);
  --color-secondary-content: oklch(28% 0.109 3.907);
  --color-accent: oklch(87% 0.169 91.605);
  --color-accent-content: oklch(27% 0.077 45.635);
  --color-neutral: oklch(26% 0 0);
  --color-neutral-content: oklch(98% 0 0);
  --color-info: oklch(70% 0.165 254.624);
  --color-info-content: oklch(28% 0.091 267.935);
  --color-success: oklch(76% 0.177 163.223);
  --color-success-content: oklch(26% 0.051 172.552);
  --color-warning: oklch(85% 0.199 91.936);
  --color-warning-content: oklch(28% 0.066 53.813);
  --color-error: oklch(70% 0.191 22.216);
  --color-error-content: oklch(25% 0.092 26.042);

  /* Component Styling */
  --radius-selector: 0rem;    /* checkbox, toggle, badge */
  --radius-field: 0.25rem;    /* button, input, select, tab */
  --radius-box: 0.25rem;      /* card, modal, alert */
  --size-selector: 0.25rem;
  --size-field: 0.25rem;
  --border: 1px;
  --depth: 0;                 /* Shadow/3D effect (0 or 1) */
  --noise: 1;                 /* Grain effect (0 or 1) */
}
```

**Theme Properties**:
- `name`: Theme identifier (used with `data-theme` attribute)
- `default: true`: Makes this the default theme
- `prefersdark: false`: Not used as dark mode preference
- `color-scheme: "dark"`: Sets browser UI to dark (affects scrollbars, etc.)

**Color System**: Uses OKLCH color space (perceptually uniform, better than HSL)

### Applying the Theme

Theme is set on the `<html>` element in `Layout.astro`:

```astro
<html data-theme="nearanimal" lang="en">
```

## Custom Theme Variables

Additional custom variables in `@theme` block:

```css
@theme {
  --font-primary: "Hind", sans-serif;
  --font-secondary: "Cardo", serif;
}
```

**Usage**:
```css
.element {
  font-family: var(--font-primary);
}
```

**Note**: These are custom variables, not used by Tailwind utilities. For Tailwind, you'd extend utilities or use arbitrary values.

## Font Configuration

### Font Loading Strategy

Dual font loading approach for performance + fallback:

1. **Subset Fonts** (Optimized, prioritized):
   - `subset-Hind-SemiBold.woff2`
   - `subset-Hind-Regular.woff2`
   - `subset-Hind-Bold.woff2`
   - `subset-Cardo-Bold.woff2`
   - `subset-Cardo-Italic.woff2`

2. **Full Fonts** (Fallback):
   - `Hind-SemiBold.woff2`
   - `Hind-Regular.woff2`
   - `Hind-Bold.woff2`
   - `Cardo-Bold.woff2`
   - `Cardo-Italic.woff2`

**CSS Pattern** (subset fonts declared last to take precedence):

```css
/* Fallback fonts */
@font-face {
  font-family: "Hind";
  src: url("/fonts/Hind-SemiBold.woff2") format("woff2");
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

/* Subset fonts (declared last = higher priority) */
@font-face {
  font-family: "Hind";
  src: url("/fonts/subset-Hind-SemiBold.woff2") format("woff2");
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}
```

### Font Preloading

Critical fonts are preloaded in `Layout.astro`:

```astro
<link
  rel="preload"
  href="/fonts/subset-Hind-SemiBold.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>
```

**Best Practice**: Preload only the most critical font weights used above-the-fold.

## daisyUI 5 Component Patterns

### Key daisyUI Rules (from `.cursor/rules/daisyui.mdc`)

1. **No tailwind.config.js**: Tailwind v4 uses CSS-only config
2. **Use Semantic Colors**: Prefer `bg-primary`, `text-base-content` over `bg-red-500`
3. **No dark: prefix**: daisyUI colors adapt to themes automatically
4. **Customization with Tailwind**: Add utilities like `btn px-10`
5. **Override with !**: Use `bg-red-500!` as last resort for specificity issues
6. **Responsive Prefixes**: Use `sm:footer-horizontal`, `lg:menu-horizontal`

### Component Usage Examples

#### Navbar Component

```astro
<nav class="navbar bg-base-100 container mx-auto shadow-sm">
  <div class="navbar-start">
    <div class="dropdown">
      <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
        <!-- Hamburger icon -->
      </div>
      <ul class="menu menu-sm dropdown-content bg-base-100 rounded-box z-20 mt-3 w-52 p-2 shadow">
        <!-- Menu items -->
      </ul>
    </div>
    <a class="btn btn-ghost text-xl">Tufan Calisir</a>
  </div>
  <div class="navbar-center hidden lg:flex">
    <ul class="menu menu-horizontal px-1">
      <!-- Menu items -->
    </ul>
  </div>
  <div class="navbar-end">
    <a class="btn">Projekt <span class="hidden sm:inline">starten</span></a>
  </div>
</nav>
```

**Pattern**:
- `navbar-start`, `navbar-center`, `navbar-end` for layout
- Mobile dropdown hidden on large screens (`lg:hidden`)
- Desktop menu shown on large screens (`hidden lg:flex`)
- Responsive text: `<span class="hidden sm:inline">` for optional text

#### Button Variants

```astro
<a class="btn">Default Button</a>
<button class="btn btn-primary">Primary</button>
<button class="btn btn-ghost">Ghost</button>
<button class="btn btn-circle">O</button>
<button class="btn btn-square">□</button>
```

**Available Modifiers**:
- Color: `btn-primary`, `btn-secondary`, `btn-accent`, `btn-neutral`
- Style: `btn-outline`, `btn-ghost`, `btn-link`
- Size: `btn-xs`, `btn-sm`, `btn-md`, `btn-lg`, `btn-xl`
- Shape: `btn-circle`, `btn-square`, `btn-wide`, `btn-block`

#### Card Component

```astro
<div class="card">
  <figure><img src="..." alt="..." /></figure>
  <div class="card-body">
    <h2 class="card-title">Card Title</h2>
    <p>Card content</p>
    <div class="card-actions">
      <button class="btn btn-primary">Action</button>
    </div>
  </div>
</div>
```

**Modifiers**:
- Style: `card-border`, `card-dash`
- Layout: `card-side`, `image-full`
- Size: `card-xs`, `card-sm`, `card-md`, `card-lg`, `card-xl`

#### Menu Component

```astro
<ul class="menu menu-horizontal px-1">
  <li><button>Item 1</button></li>
  <li><button>Item 2</button></li>
</ul>
```

**Direction**:
- `menu-vertical` (default)
- `menu-horizontal`

**Responsive**: `lg:menu-horizontal` for mobile vertical, desktop horizontal

#### Dropdown Component

```astro
<details class="dropdown">
  <summary>Click me</summary>
  <ul class="dropdown-content menu bg-base-100 rounded-box z-20 w-52 p-2 shadow">
    <li><a>Item 1</a></li>
    <li><a>Item 2</a></li>
  </ul>
</details>
```

**Placement**: `dropdown-top`, `dropdown-bottom`, `dropdown-left`, `dropdown-right`, `dropdown-start`, `dropdown-center`, `dropdown-end`

## Color System

### Semantic Color Usage

**Base Colors** (backgrounds):
- `bg-base-100` - Main background
- `bg-base-200` - Elevated surfaces
- `bg-base-300` - More elevation
- `text-base-content` - Foreground text on base colors

**Brand Colors**:
- `bg-primary` / `text-primary-content`
- `bg-secondary` / `text-secondary-content`
- `bg-accent` / `text-accent-content`
- `bg-neutral` / `text-neutral-content`

**State Colors**:
- `bg-info` / `text-info-content`
- `bg-success` / `text-success-content`
- `bg-warning` / `text-warning-content`
- `bg-error` / `text-error-content`

**Important**: Always pair color with its `-content` color for proper contrast:
```astro
<div class="bg-primary text-primary-content">
  Text is readable on primary background
</div>
```

### Legacy Colors in Project

Some components still use custom color names (should be migrated to daisyUI colors):

```astro
<h2 class="text-mine-shaft font-secondary">
  <!-- Should use text-base-content or semantic color -->
</h2>
```

**Legacy Colors** (commented out in CSS):
- `--color-mine-shaft: #262626`
- `--color-black: #000000`
- `--color-alabaster: #fafafa`
- `--color-alto: #d9d9d9`
- `--color-gallery: #f0f0f0`

**Note**: These are not defined but used via Tailwind utilities (`text-mine-shaft`, `bg-gallery`). They may be relying on fallback behavior or need migration to daisyUI semantic colors.

## Typography

### Prose Styling

Rich text content uses the Typography plugin:

```astro
<div class="prose xl:prose-lg [&:has(h2)_a]:no-underline">
  <Fragment set:html={renderRichText(blok.copy)} />
</div>
```

**Modifiers**:
- `prose` - Base typography styles
- `xl:prose-lg` - Larger text on XL screens
- Custom: `[&:has(h2)_a]:no-underline` - Removes underline from links inside h2s

**Available Sizes**:
- `prose-sm`, `prose-base`, `prose-lg`, `prose-xl`, `prose-2xl`

### Font Classes

Current pattern uses inline font family:

```astro
<h1 class="font-secondary text-mine-shaft mb-8 text-center text-xl font-bold">
```

**Font Families** (via custom CSS variables):
- `font-primary` - Hind (sans-serif)
- `font-secondary` - Cardo (serif)

## Layout Patterns

### Container Pattern

```astro
<section class="container mx-auto max-w-3xl px-4">
  <!-- Content -->
</section>
```

**Pattern**:
- `container` - Centers and sets max-width
- `mx-auto` - Horizontal centering
- `max-w-3xl` - Custom max width
- `px-4` - Horizontal padding

### Responsive Grid

```astro
<ul class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
  <li>Item</li>
</ul>
```

**Pattern**: Mobile-first responsive grid with breakpoint modifiers.

### Flexbox Centering

```astro
<div class="flex items-center justify-center">
  <!-- Centered content -->
</div>
```

### Absolute Positioning with Centering

```astro
<div class="relative">
  <div class="absolute inset-0 flex items-center justify-center">
    <!-- Centered overlay -->
  </div>
</div>
```

## Custom Styling Patterns

### Pseudo-Element Patterns

**Decorative Background**:
```astro
<div class="after:bg-alabaster relative mb-4 w-full overflow-hidden after:absolute after:inset-0 after:rounded-3xl after:content-['']">
  <div class="relative z-10">
    <!-- Content above background -->
  </div>
</div>
```

**Pattern**: Use `after:` or `before:` with `content-['']` for decorative elements.

**Horizontal Line Decoration**:
```astro
<h2 class="before:bg-mine-shaft relative before:absolute before:top-1/2 before:left-0 before:h-0.5 before:w-3 before:-translate-y-1/2 before:content-['']">
  Heading
</h2>
```

### Arbitrary Values

Tailwind v4 supports arbitrary values:

```astro
<div class="grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
  <!-- Custom grid -->
</div>
```

## Responsive Design

### Breakpoints (Tailwind defaults)

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Common Responsive Patterns

**Show/Hide Elements**:
```astro
<div class="hidden lg:block">Desktop only</div>
<div class="lg:hidden">Mobile only</div>
```

**Responsive Spacing**:
```astro
<section class="mb-4 md:mb-8">
  <!-- 1rem margin on mobile, 2rem on tablet+ -->
</section>
```

**Responsive Layout Direction**:
```astro
<div class="flex flex-col md:flex-row">
  <!-- Vertical on mobile, horizontal on tablet+ -->
</div>
```

**Responsive Menu**:
```astro
<ul class="menu menu-vertical lg:menu-horizontal">
  <!-- Vertical on mobile, horizontal on desktop -->
</ul>
```

## Best Practices

1. **Use Semantic Colors**: Always prefer daisyUI semantic colors (`bg-primary`) over Tailwind colors (`bg-blue-500`) for theme compatibility
2. **Pair Content Colors**: Use `text-*-content` with corresponding background colors for accessibility
3. **Mobile-First**: Start with mobile styles, add breakpoint modifiers for larger screens
4. **Avoid Arbitrary Colors**: Use theme colors; if needed, extend theme in `@theme` block
5. **Component Modifiers**: Learn daisyUI component class names; they're more maintainable than custom utilities
6. **Responsive Components**: Use responsive variants (`lg:menu-horizontal`) instead of showing/hiding separate components
7. **Font Loading**: Preload critical fonts, use `font-display: swap`
8. **Typography Plugin**: Use `prose` class for rich text content
9. **Avoid !important**: Only use `!` suffix when absolutely necessary for specificity
10. **Theme Switching**: To add theme switcher, use `theme-controller` component with radio/checkbox

## Debugging Tips

### Inspect Theme Colors

Check computed values in browser DevTools:
```css
--color-primary: oklch(80% 0.114 19.571);
```

### Check Applied Theme

```javascript
document.documentElement.getAttribute('data-theme'); // "nearanimal"
```

### Override for Testing

Temporarily override theme in browser:
```javascript
document.documentElement.setAttribute('data-theme', 'light');
```

## Migration Guide (Legacy to daisyUI Colors)

If migrating custom colors to daisyUI:

**Before**:
```astro
<h2 class="text-mine-shaft">Heading</h2>
<div class="bg-gallery">Content</div>
```

**After**:
```astro
<h2 class="text-base-content">Heading</h2>
<div class="bg-base-200">Content</div>
```

**Check**: Search codebase for legacy color names and map to semantic equivalents.

# Portfolio Documentation

This directory contains comprehensive technical documentation for the portfolio project.

## Documentation Structure

### [astro.md](astro.md)
**Astro Framework & Architecture**

Learn about:
- Project structure and configuration
- Routing patterns (static and dynamic)
- Layout and component patterns
- TypeScript configuration
- Utility functions (date formatting, image optimization)
- Development workflow and build process
- Performance optimizations
- Best practices and debugging tips

**When to read**: Working with Astro components, routing, or build configuration.

### [styling.md](styling.md)
**Styling with Tailwind CSS 4 & daisyUI 5**

Learn about:
- Tailwind CSS 4 setup (CSS-first configuration)
- daisyUI 5 component library usage
- Custom theme configuration ("nearanimal" theme)
- Font loading and optimization strategy
- Color system and semantic colors
- Typography with prose plugin
- Layout and responsive design patterns
- Component styling examples
- Best practices and migration guide

**When to read**: Styling components, customizing theme, or working with daisyUI components.

### [storyblok.md](storyblok.md)
**Storyblok CMS Integration**

Learn about:
- Storyblok configuration and setup
- Content architecture and structure
- API usage patterns
- Component patterns and TypeScript integration
- Rich text rendering and optimization
- Visual editor integration (Bridge mode)
- Image and asset handling
- Static site generation with Storyblok
- Advanced patterns and best practices

**When to read**: Working with Storyblok content, creating components, or fetching data from CMS.

### [components.md](components.md)
**Component Architecture & Atomic Design**

Learn about:
- Atomic design structure (atoms, molecules, organisms)
- Component classification and organization
- daisyUI component implementation patterns
- Detailed component documentation
- Responsive design patterns
- Component composition strategies
- Best practices for creating new components
- Migration guide from old components

**When to read**: Creating or modifying components, understanding component architecture, or implementing daisyUI patterns.

## Quick Reference

### Common Tasks

**Starting development**:
```bash
npm run dev
```

**Building for production**:
```bash
npm run build
```

**Generating Storyblok types**:
```bash
npm run types
```

**Previewing production build**:
```bash
npm run preview
```

### Key Files

- `astro.config.mjs` - Astro and Storyblok configuration
- `src/styles.css` - Tailwind and daisyUI configuration
- `src/layouts/Layout.astro` - Main layout with global data
- `.env` - Environment variables (copy from `.env.sample`)
- `tsconfig.json` - TypeScript configuration

### Key Directories

- `src/components/` - Astro components (atomic design structure)
- `src/pages/` - File-based routing
- `src/layouts/` - Layout components
- `src/utils/` - Utility functions
- `public/fonts/` - Custom fonts
- `.storyblok/types/` - Generated TypeScript types

## Getting Help

1. **Component not rendering?** → Check [storyblok.md](storyblok.md) for component mapping
2. **Styling issues?** → Check [styling.md](styling.md) for daisyUI patterns
3. **Build errors?** → Check [astro.md](astro.md) for build configuration
4. **Type errors?** → Run `npm run types` and check [storyblok.md](storyblok.md)

## Contributing to Docs

When adding new patterns or features:
1. Update the relevant documentation file
2. Add code examples with explanations
3. Include "when to use" guidance
4. Update this README if adding new sections

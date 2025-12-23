// Enhanced utility functions
interface ImageOptions {
  width?: number;
  height?: number;
  focus?: string; // Focal point from Storyblok (e.g., "1234x5678:1235x5679")
}

interface ResponsiveImageOptions {
  breakpoints?: number[];
  aspectRatio?: number;
  sizes?: string;
  focus?: string; // Focal point from Storyblok
}

/**
 * Resizes Storyblok image URLs using the Image Service with focal point support
 */
export function optimizeStoryblokImage(
  filename: string,
  options: ImageOptions = {},
): string {
  if (!filename) return "";

  const baseUrl = filename.split("/m/")[0];
  const { width, height, focus } = options;

  if (width || height) {
    const w = width || 0;
    const h = height || 0;

    // Build filters array
    const filters = ["format(webp)"];

    // Add focal point if provided
    // Storyblok focal point format: "1234x5678:1235x5679"
    if (focus) {
      filters.push(`focal(${focus})`);
    }

    const filtersString = filters.join(":");
    return `${baseUrl}/m/${w}x${h}/filters:${filtersString}/`;
  }

  return baseUrl;
}

/**
 * Generates srcset and sizes for responsive images with focal point support
 */
export function generateResponsiveImageData(
  filename: string,
  options: ResponsiveImageOptions = {},
) {
  if (!filename) return { src: "", srcset: "", sizes: "" };

  const {
    breakpoints = [480, 768, 1024, 1280, 1536, 1920, 2560],
    aspectRatio = 16 / 9, // Default aspect ratio
    sizes = "(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 70vw",
    focus, // Focal point from Storyblok
  } = options;

  // Generate srcset
  const srcsetEntries = breakpoints.map((width) => {
    const height = Math.round(width / aspectRatio);
    const url = optimizeStoryblokImage(filename, { width, height, focus });
    return `${url} ${width}w`;
  });

  // Use the largest breakpoint as the main src
  const largestWidth = Math.max(...breakpoints);
  const largestHeight = Math.round(largestWidth / aspectRatio);
  const src = optimizeStoryblokImage(filename, {
    width: largestWidth,
    height: largestHeight,
    focus,
  });

  return {
    src,
    srcset: srcsetEntries.join(", "),
    sizes,
  };
}

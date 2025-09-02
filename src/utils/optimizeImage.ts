// Enhanced utility functions
interface ImageOptions {
  width?: number;
  height?: number;
}

interface ResponsiveImageOptions {
  breakpoints?: number[];
  aspectRatio?: number;
  sizes?: string;
}

/**
 * Resizes Storyblok image URLs using the Image Service
 */
export function optimizeStoryblokImage(
  filename: string,
  options: ImageOptions = {},
): string {
  if (!filename) return "";

  const baseUrl = filename.split("/m/")[0];
  const { width, height } = options;

  if (width || height) {
    const w = width || 0;
    const h = height || 0;
    return `${baseUrl}/m/${w}x${h}/filters:format(webp)/`;
  }

  return baseUrl;
}

/**
 * Generates srcset and sizes for responsive images
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
  } = options;

  // Generate srcset
  const srcsetEntries = breakpoints.map((width) => {
    const height = Math.round(width / aspectRatio);
    const url = optimizeStoryblokImage(filename, { width, height });
    return `${url} ${width}w`;
  });

  // Use the largest breakpoint as the main src
  const largestWidth = Math.max(...breakpoints);
  const largestHeight = Math.round(largestWidth / aspectRatio);
  const src = optimizeStoryblokImage(filename, {
    width: largestWidth,
    height: largestHeight,
  });

  return {
    src,
    srcset: srcsetEntries.join(", "),
    sizes,
  };
}

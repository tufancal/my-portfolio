import { useStoryblokApi } from "@storyblok/astro";

interface CategoryData {
  value: string;
  name: string;
  color: string | null;
  icon: string | null;
}

interface DatasourceEntry {
  id: number;
  name: string;
  value: string;
  dimension_value: string | null;
}

// Cache for category data to avoid refetching
let cachedCategories: Map<string, CategoryData> | null = null;

/**
 * Fetches blog categories with their color and icon dimensions from Storyblok.
 * Results are cached to avoid redundant API calls.
 */
export async function getBlogCategories(
  version: "draft" | "published" = "published",
): Promise<Map<string, CategoryData>> {
  // Return cached data if available
  if (cachedCategories) {
    return cachedCategories;
  }

  const storyblokApi = useStoryblokApi();

  try {
    // Fetch color and icon dimensions in parallel
    const [colorResponse, iconResponse] = await Promise.allSettled([
      storyblokApi.get("cdn/datasource_entries", {
        datasource: "blog-categories",
        dimension: "color",
        version,
      }),
      storyblokApi.get("cdn/datasource_entries", {
        datasource: "blog-categories",
        dimension: "icon",
        version,
      }),
    ]);

    // Build a map of categories with combined dimension data
    const categories = new Map<string, CategoryData>();

    // Extract color entries or use empty array if failed
    const colorEntries =
      colorResponse.status === "fulfilled"
        ? (colorResponse.value.data.datasource_entries as DatasourceEntry[])
        : [];

    // Extract icon entries or use empty array if failed
    const iconEntries =
      iconResponse.status === "fulfilled"
        ? (iconResponse.value.data.datasource_entries as DatasourceEntry[])
        : [];

    // Combine entries by value
    colorEntries.forEach((colorEntry) => {
      const iconEntry = iconEntries.find(
        (entry) => entry.value === colorEntry.value,
      );

      categories.set(colorEntry.value, {
        value: colorEntry.value,
        name: colorEntry.name,
        color: colorEntry.dimension_value,
        icon: iconEntry?.dimension_value || null,
      });
    });

    // Cache the results
    cachedCategories = categories;

    return categories;
  } catch (error) {
    console.error("Error fetching blog categories:", error);
    // Return empty map on error to allow build to continue
    return new Map<string, CategoryData>();
  }
}

/**
 * Gets a single blog category by its value.
 */
export async function getBlogCategory(
  categoryValue: string,
  version: "draft" | "published" = "published",
): Promise<CategoryData | undefined> {
  const categories = await getBlogCategories(version);
  return categories.get(categoryValue);
}

/**
 * Resolves a Storyblok URL to a full URL.
 */
export function resolveStoryblokUrl(url: any): string {
  if (url.linktype === "email") {
    return `mailto:${url.url}`;
  }
  if (url.linktype === "story") {
    return url.cached_url === "home" ? "/" : `/${url.cached_url}`;
  }
  return url.url;
}

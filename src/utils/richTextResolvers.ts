import { MarkTypes, type StoryblokRichTextNode } from "@storyblok/richtext";

/**
 * Custom resolvers for Storyblok rich text rendering.
 * These override the default rendering behavior for specific mark types.
 *
 * Note: Code block syntax highlighting is handled separately via
 * processRichTextWithCodeHighlighting() because resolvers don't support async.
 */

export const richTextResolvers = {
  // Link resolver with proper target attribute support
  [MarkTypes.LINK]: (node: StoryblokRichTextNode<any>) => {
    const href = node.attrs?.href || "";
    const target = node.attrs?.target || "_self";
    const rel = target === "_blank" ? ' rel="noopener noreferrer"' : "";
    const text = node.text || "";

    return `<a href="${href}" target="${target}"${rel}>${text}</a>`;
  },

  // HTML node resolver for pre-processed syntax highlighted code
  html: (node: StoryblokRichTextNode<any>) => {
    return node.text || "";
  },
};

// Export linkResolver for backward compatibility
export const linkResolver = richTextResolvers;

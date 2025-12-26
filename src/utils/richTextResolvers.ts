import { MarkTypes, type StoryblokRichTextNode } from "@storyblok/richtext";

/**
 * Custom resolvers for Storyblok rich text rendering.
 * These override the default rendering behavior for specific mark types.
 */
export const linkResolver = {
  [MarkTypes.LINK]: (node: StoryblokRichTextNode<any>) => {
    const href = node.attrs?.href || "";
    const target = node.attrs?.target || "_self";
    const rel = target === "_blank" ? ' rel="noopener noreferrer"' : "";

    // node.text contains the link text content
    const text = node.text || "";

    return `<a href="${href}" target="${target}"${rel}>${text}</a>`;
  },
};

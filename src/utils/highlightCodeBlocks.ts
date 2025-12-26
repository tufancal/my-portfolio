import { codeToHtml } from "shiki";
import type { StoryblokRichTextNode } from "@storyblok/richtext";

// Cache for highlighted code to avoid re-processing
const highlightCache = new Map<string, string>();

/**
 * Recursively process rich text nodes and highlight code blocks
 */
export async function processRichTextWithCodeHighlighting(
  node: StoryblokRichTextNode<any>,
): Promise<StoryblokRichTextNode<any>> {
  if (!node) return node;

  // If this is a code block, replace it with a raw HTML node
  if (node.type === "code_block") {
    const language = node.attrs?.class?.replace("language-", "") || "text";
    const code =
      node.content?.map((child: any) => child.text || "").join("\n") || "";

    const html = await highlightCode(code, language);

    // Return a custom node that will be rendered as raw HTML
    return {
      type: "html",
      text: html,
    } as any;
  }

  // Recursively process children
  if (node.content && Array.isArray(node.content)) {
    const processedContent = await Promise.all(
      node.content.map((child) => processRichTextWithCodeHighlighting(child)),
    );
    return {
      ...node,
      content: processedContent,
    };
  }

  return node;
}

/**
 * Highlight code using Shiki (server-side syntax highlighting)
 */
async function highlightCode(code: string, lang: string): Promise<string> {
  const cacheKey = `${lang}:${code}`;

  if (highlightCache.has(cacheKey)) {
    return highlightCache.get(cacheKey)!;
  }

  try {
    const html = await codeToHtml(code, {
      lang: lang || "text",
      theme: "github-dark",
    });
    highlightCache.set(cacheKey, html);
    return html;
  } catch (error) {
    // If language not supported, return plain code
    const escaped = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return `<pre class="shiki"><code>${escaped}</code></pre>`;
  }
}

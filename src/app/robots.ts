import type { MetadataRoute } from "next";
import { absoluteUrl, siteConfig } from "@/lib/site";

/**
 * Crawlers that answer questions rather than link to pages — the assistants
 * people increasingly ask "wie viel Mietminderung bei Schimmel?" before they
 * ever open a search engine.
 *
 * They are already covered by the `*` group below, so this block changes no
 * behaviour today. It exists to record the decision: being quoted in an
 * assistant's answer is how this site gets found in that channel, and a later
 * blanket block on "AI bots" would cut it off. Anyone who wants to remove
 * these has to remove them deliberately.
 *
 * Google-Extended and Applebot-Extended are not crawlers at all; they are the
 * opt-out switches for Gemini and Apple Intelligence training. Listing them
 * with `allow` is the same statement.
 */
const ANSWER_ENGINES = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  "PerplexityBot",
  "Perplexity-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "Google-Extended",
  "Applebot-Extended",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      {
        userAgent: ANSWER_ENGINES,
        allow: "/",
        disallow: ["/api/"],
      },
      // Common SEO crawlers that add load without sending traffic.
      {
        userAgent: ["AhrefsBot", "SemrushBot", "MJ12bot", "DotBot"],
        disallow: "/",
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteConfig.url,
  };
}

import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: site.url, changeFrequency: "weekly", priority: 1.0, lastModified },
    { url: `${site.url}/faq`, changeFrequency: "monthly", priority: 0.8, lastModified },
    { url: `${site.url}/impressum`, changeFrequency: "yearly", priority: 0.3, lastModified },
    { url: `${site.url}/datenschutz`, changeFrequency: "yearly", priority: 0.3, lastModified },
    {
      url: `${site.url}/nutzungsbedingungen`,
      changeFrequency: "yearly",
      priority: 0.3,
      lastModified,
    },
    { url: `${site.url}/widerruf`, changeFrequency: "yearly", priority: 0.3, lastModified },
  ];
}

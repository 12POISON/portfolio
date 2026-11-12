import type { MetadataRoute } from "next";
import { PROJECTS } from "@/lib/content";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://whitejack5.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, changeFrequency: "weekly", priority: 1 },
    ...PROJECTS.map((p) => ({
      url: `${BASE}/work/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}

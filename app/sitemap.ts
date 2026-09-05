import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { getAllPosts } from "@/lib/blog";

const BASE = "https://ebfantasy.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];
  for (const lang of locales) {
    for (const p of ["/", "/work", "/blog", "/about"]) {
      entries.push({ url: `${BASE}/${lang}${p}`, lastModified: now });
    }
    for (const post of posts.filter((x) => x.lang === lang)) {
      entries.push({ url: `${BASE}/${lang}/blog/${post.slug}`, lastModified: new Date(post.date) });
    }
  }
  return entries;
}

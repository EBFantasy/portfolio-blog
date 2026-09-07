import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { getAllPosts } from "@/lib/blog";
import { getAllProjects } from "@/lib/work";
import { templates } from "@/lib/showcase";
import { SITE_URL } from "@/lib/site";

/**
 * 收录范围：主导航页 + 作品详情页 + 模板页 + 博客文章。
 * playground（交互 demo）不单独收录 —— 文本量低、易被判低质量，
 * 且都能从作品详情页链接到，交给爬虫自然发现即可。
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const projects = getAllProjects();
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const lang of locales) {
    for (const p of ["/", "/work", "/blog", "/about", "/showcase", "/services"]) {
      entries.push({ url: `${SITE_URL}/${lang}${p}`, lastModified: now });
    }
    for (const project of projects) {
      entries.push({ url: `${SITE_URL}/${lang}/work/${project.slug}`, lastModified: now });
    }
    for (const tpl of templates) {
      entries.push({ url: `${SITE_URL}/${lang}/showcase/${tpl.slug}`, lastModified: now });
    }
    for (const post of posts.filter((x) => x.lang === lang)) {
      entries.push({
        url: `${SITE_URL}/${lang}/blog/${post.slug}`,
        lastModified: new Date(post.date),
      });
    }
  }

  return entries;
}

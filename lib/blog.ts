import "server-only";

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import { locales, type Locale } from "./i18n";

export type PostMeta = {
  slug: string;
  lang: Locale;
  title: string;
  date: string;
  summary: string;
  tags: string[];
};

export type Post = PostMeta & { contentHtml: string };

const contentRoot = path.join(process.cwd(), "content", "blog");

function parsePostFile(dir: string, fileName: string, slug: string): PostMeta | null {
  const fullPath = path.join(dir, fileName);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data } = matter(raw);
  if (!data.title || !data.date) return null;
  return {
    slug,
    lang: (isValidLang(data.lang) ? data.lang : "zh") as Locale,
    title: String(data.title),
    date: String(data.date),
    summary: String(data.summary ?? ""),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
  };
}

function isValidLang(v: unknown): boolean {
  return typeof v === "string" && (locales as readonly string[]).includes(v);
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(contentRoot)) return [];
  const posts: PostMeta[] = [];
  const entries = fs.readdirSync(contentRoot, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const dir = path.join(contentRoot, entry.name);
      for (const f of fs.readdirSync(dir)) {
        if (f.endsWith(".mdx")) {
          const meta = parsePostFile(dir, f, entry.name);
          if (meta) posts.push(meta);
        }
      }
    } else if (entry.name.endsWith(".mdx")) {
      const meta = parsePostFile(
        contentRoot,
        entry.name,
        path.basename(entry.name, ".mdx")
      );
      if (meta) posts.push(meta);
    }
  }
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostsByLang(lang: Locale): PostMeta[] {
  return getAllPosts().filter((p) => p.lang === lang);
}

export async function getPost(slug: string, lang: Locale): Promise<Post | null> {
  const candidates = [
    path.join(contentRoot, slug, `${lang}.mdx`),
    path.join(contentRoot, `${slug}.${lang}.mdx`),
    path.join(contentRoot, `${slug}.mdx`),
  ];
  const fullPath = candidates.find((p) => fs.existsSync(p));
  if (!fullPath) return null;
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeStringify)
    .process(content);
  return {
    slug,
    lang,
    title: String(data.title ?? slug),
    date: String(data.date ?? ""),
    summary: String(data.summary ?? ""),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    contentHtml: file.toString(),
  };
}

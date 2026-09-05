import Link from "next/link";
import { notFound } from "next/navigation";
import { getDict, isValidLocale, locales, type Locale } from "@/lib/i18n";
import { getPost } from "@/lib/blog";
import { CalendarIcon, TagIcon } from "@/components/Icons";

export async function generateStaticParams() {
  const { getAllPosts } = await import("@/lib/blog");
  return getAllPosts().map((p) => ({ lang: p.lang, slug: p.slug }));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang: rawLang, slug } = await params;
  const lang = (isValidLocale(rawLang) ? rawLang : "zh") as Locale;
  const dict = getDict(lang);
  const post = await getPost(slug, lang);
  if (!post) notFound();

  return (
    <article className="py-14">
      <Link
        href={`/${lang}/blog`}
        className="text-sm text-zinc-400 transition hover:text-emerald-600 dark:hover:text-emerald-400"
      >
        ← {dict.blog.backToList}
      </Link>

      <h1 className="mt-6 text-3xl font-semibold leading-tight tracking-tight text-zinc-900 dark:text-zinc-50">
        {post.title}
      </h1>
      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-zinc-400">
        <span className="inline-flex items-center gap-1.5">
          <CalendarIcon />
          {dict.blog.publishedAt} {post.date}
        </span>
        {post.tags.map((t) => (
          <span key={t} className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-0.5 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
            <TagIcon />
            {t}
          </span>
        ))}
      </div>

      <div
        className="prose prose-zinc mt-10 max-w-none dark:prose-invert prose-headings:font-semibold prose-a:text-emerald-600 dark:prose-a:text-emerald-400"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
    </article>
  );
}

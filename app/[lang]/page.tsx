import Link from "next/link";
import { ArrowRightIcon } from "@/components/Icons";
import WorkCard from "@/components/WorkCard";
import { getDict, isValidLocale, type Locale } from "@/lib/i18n";
import { getPostsByLang } from "@/lib/blog";
import { getFeaturedProjects } from "@/lib/work";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: raw } = await params;
  const lang = (isValidLocale(raw) ? raw : "zh") as Locale;
  const dict = getDict(lang);
  const latest = getPostsByLang(lang).slice(0, 3);
  const featured = getFeaturedProjects().slice(0, 2);

  return (
    <div className="flex flex-col">
      <section className="py-16 sm:py-24">
        <p className="mb-4 inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300">
          {dict.home.heroBadge}
        </p>
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
          {dict.home.heroTitle}
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-500 dark:text-zinc-400">
          {dict.home.heroDesc}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`/${lang}/work`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-500"
          >
            {dict.home.viewWork}
            <ArrowRightIcon />
          </Link>
          <Link
            href={`/${lang}/blog`}
            className="inline-flex items-center rounded-xl border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 transition hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-zinc-500"
          >
            {dict.home.readBlog}
          </Link>
          <Link
            href={`/${lang}/services`}
            className="inline-flex items-center rounded-xl px-5 py-2.5 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
          >
            {dict.home.getQuote} →
          </Link>
        </div>
      </section>

      <section className="pb-16">
        <h2 className="mb-6 text-lg font-medium text-zinc-900 dark:text-zinc-50">
          {dict.home.sectionsTitle}
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {dict.home.sections.map((s, i) => (
            <div
              key={i}
              className="group rounded-2xl border border-zinc-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-emerald-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-800"
            >
              <span className="inline-block rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                {s.tag}
              </span>
              <h3 className="mt-3 font-medium text-zinc-900 dark:text-zinc-50">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-16">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
            {dict.work.featuredWork}
          </h2>
          <Link
            href={`/${lang}/work`}
            className="inline-flex items-center gap-1 text-sm text-emerald-600 transition hover:text-emerald-500 dark:text-emerald-400"
          >
            {dict.work.viewAllWork} <ArrowRightIcon />
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {featured.map((p) => (
            <WorkCard key={p.slug} project={p} lang={lang} />
          ))}
        </div>
      </section>

      <section className="pb-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">{dict.home.latestPosts}</h2>
          <Link
            href={`/${lang}/blog`}
            className="text-sm text-emerald-600 transition hover:text-emerald-500 dark:text-emerald-400"
          >
            {dict.blog.all} →
          </Link>
          <h2 className="hidden" aria-hidden>{dict.home.featured}</h2>
        </div>
        <div className="flex flex-col gap-3">
          {latest.map((p) => (
            <Link
              key={p.slug}
              href={`/${lang}/blog/${p.slug}`}
              className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-5 py-4 transition hover:border-emerald-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-800"
            >
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-50">{p.title}</p>
                <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">{p.summary}</p>
              </div>
              <span className="ml-4 shrink-0 text-xs text-zinc-400">{p.date}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

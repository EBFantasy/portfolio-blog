import { Reveal } from "@/components/showcase/reveal";
import { getDict, isValidLocale, type Locale } from "@/lib/i18n";
import { getPostsByLang } from "@/lib/blog";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: raw } = await params;
  const lang = (isValidLocale(raw) ? raw : "zh") as Locale;
  const dict = getDict(lang);
  const posts = getPostsByLang(lang);

  return (
    <div className="py-14">
      <Reveal>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {dict.blog.title}
        </h1>
        <p className="mt-3 max-w-xl text-zinc-500 dark:text-zinc-400">{dict.blog.desc}</p>
      </Reveal>

      <Reveal delay={150}>
        <div className="mt-10 flex flex-col gap-3">
          {posts.map((p) => (
            <a
              key={p.slug}
              href={`/${lang}/blog/${p.slug}`}
              className="group rounded-2xl border border-zinc-200 bg-white p-5 transition hover:border-emerald-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-800"
            >
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-medium text-zinc-900 transition group-hover:text-emerald-600 dark:text-zinc-50 dark:group-hover:text-emerald-400">
                  {p.title}
                </h2>
                <span className="shrink-0 text-xs text-zinc-400">{p.date}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{p.summary}</p>
              {p.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </a>
          ))}
        </div>
      </Reveal>
    </div>
  );
}

import Link from "next/link";
import { ArrowRightIcon } from "@/components/Icons";
import WorkCard from "@/components/WorkCard";
import { Reveal } from "@/components/showcase/reveal";
import HeroSlashCta from "@/components/home/HeroSlashCta";
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
      <section className="relative py-14 sm:py-20">
        {/* 背景：琥珀金柔光 + 细网格，避免首屏大片留白 */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 -z-10 h-full w-[160%] -translate-x-1/2"
          style={{
            background:
              "radial-gradient(46% 42% at 72% 34%, rgba(240,176,60,0.22), transparent 70%), radial-gradient(40% 38% at 14% 12%, rgba(240,176,60,0.10), transparent 68%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 -z-10 h-full w-[160%] -translate-x-1/2 opacity-60 dark:opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(120,113,108,0.10) 1px, transparent 1px), linear-gradient(to bottom, rgba(120,113,108,0.10) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage: "radial-gradient(52% 60% at 50% 34%, #000, transparent 76%)",
            WebkitMaskImage: "radial-gradient(52% 60% at 50% 34%, #000, transparent 76%)",
          }}
        />

        <div className="max-w-3xl">
          <Reveal>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              {dict.home.heroBadge}
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl dark:text-zinc-50">
              {dict.home.heroTitle}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-500 sm:text-lg dark:text-zinc-400">
              {dict.home.heroDesc}
            </p>
          </Reveal>
          <Reveal delay={200}>
            <div className="mt-8 flex flex-wrap gap-3">
              <HeroSlashCta href={`/${lang}/work`}>{dict.home.viewWork}</HeroSlashCta>
              <Link
                href={`/${lang}/blog`}
                className="inline-flex items-center rounded-xl border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-zinc-500 dark:hover:bg-zinc-800/50"
              >
                {dict.home.readBlog}
              </Link>
              <Link
                href={`/${lang}/services`}
                className="inline-flex items-center rounded-xl px-5 py-2.5 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
              >
                {dict.home.getQuote} &rarr;
              </Link>
            </div>
          </Reveal>
          <Reveal delay={320}>
            <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-4 text-sm border-t border-zinc-200/80 pt-8 dark:border-zinc-800/80">
              <Stat value="6" label={dict.home.statProjects} />
              <Stat value="3" label={dict.home.statAutomation} />
              <Stat value="6" label={dict.home.statTemplates} />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="pb-16">
        <Reveal>
          <h2 className="mb-6 text-lg font-medium text-zinc-900 dark:text-zinc-50">
            {dict.home.sectionsTitle}
          </h2>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-3">
          {dict.home.sections.map((s, i) => (
            <Reveal key={i} delay={i * 130}>
              <div className="group h-full rounded-2xl border border-zinc-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-emerald-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-800">
                <span className="inline-block rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                  {s.tag}
                </span>
                <h3 className="mt-3 font-medium text-zinc-900 dark:text-zinc-50">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="pb-16">
        <Reveal>
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
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2">
          {featured.map((p, i) => (
            <Reveal key={p.slug} delay={i * 130}>
              <WorkCard project={p} lang={lang} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="pb-8">
        <Reveal>
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
        </Reveal>
        <Reveal delay={140}>
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
        </Reveal>
      </section>
    </div>
  );
}

/** hero 数据条：单个数字 + 说明，hover 时琥珀金下划线 */
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="group/stat relative">
      <span className="block text-2xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
        {value}
        <span className="text-emerald-500">+</span>
      </span>
      <span className="mt-0.5 block text-xs text-zinc-500 dark:text-zinc-400">{label}</span>
      <span className="mt-1 block h-px w-8 bg-emerald-500/60 transition-all duration-300 group-hover/stat:w-14" />
    </div>
  );
}

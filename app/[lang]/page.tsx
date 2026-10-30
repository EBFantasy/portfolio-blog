import Link from "next/link";
import { ArrowRightIcon } from "@/components/Icons";
import WorkCard from "@/components/WorkCard";
import { Reveal } from "@/components/showcase/reveal";
import HeroSlashCta from "@/components/home/HeroSlashCta";
import { getDict, isValidLocale, type Locale } from "@/lib/i18n";
import { getPostsByLang } from "@/lib/blog";
import { getFeaturedProjects } from "@/lib/work";
import { categoryMeta } from "@/lib/work-shared";

const STACK = [
  "TypeScript", "Next.js 15", "React 19", "Tailwind v4", "Node.js",
  "Playwright", "Spine 2D", "Python", "psd-tools", "Vercel", "Git",
];

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params;
  const lang = (isValidLocale(raw) ? raw : "zh") as Locale;
  const t = lang === "en" ? "en" : "zh";
  const dict = getDict(lang);
  const latest = getPostsByLang(lang).slice(0, 3);
  const featured = getFeaturedProjects().slice(0, 3);
  const sectionLinks = [`/${lang}/work`, `/${lang}/showcase`, `/${lang}/blog`];

  return (
    <div className="overflow-x-clip">
      <section className="relative py-12 sm:py-16 lg:py-20">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-20 overflow-hidden">
          <div className="absolute -right-24 -top-24 h-[30rem] w-[30rem] rounded-full bg-emerald-200/30 blur-[110px] dark:bg-emerald-800/15" />
          <div className="absolute -left-40 top-40 h-80 w-80 rounded-full bg-emerald-100/40 blur-[100px] dark:bg-emerald-950/20" />
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-50 [background-image:linear-gradient(to_right,rgba(120,113,108,.09)_1px,transparent_1px),linear-gradient(to_bottom,rgba(120,113,108,.09)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(70%_70%_at_60%_35%,#000,transparent)] dark:opacity-20"
        />

        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.06fr)_minmax(360px,.82fr)] lg:gap-14">
          <div>
            <Reveal>
              <div className="mb-6 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-800 dark:text-emerald-300">
                <span className="h-px w-8 bg-emerald-500" />
                {dict.home.heroBadge}
              </div>
              <h1 className="max-w-[13ch] text-4xl font-semibold leading-[1.08] tracking-tighter text-zinc-950 sm:text-5xl lg:text-6xl dark:text-zinc-50">
                {dict.home.heroTitle}
                <span className="mt-1 block text-emerald-700 dark:text-emerald-300">{dict.home.heroTitleAccent}</span>
              </h1>
              <p className="mt-6 max-w-[62ch] text-base leading-8 text-zinc-600 sm:text-lg dark:text-zinc-400">
                {dict.home.heroDesc}
              </p>
            </Reveal>

            <Reveal delay={140}>
              <div className="mt-8 flex flex-wrap gap-3">
                <HeroSlashCta href={`/${lang}/work`}>{dict.home.viewWork}</HeroSlashCta>
                <Link href={`/${lang}/blog`} className="inline-flex items-center rounded-xl border border-zinc-300 bg-white/70 px-5 py-2.5 text-sm font-medium text-zinc-700 transition hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-emerald-50 active:scale-[0.98] dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-200 dark:hover:bg-emerald-950/40">
                  {dict.home.readBlog}
                </Link>
                <Link href={`/${lang}/services`} className="inline-flex items-center rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-600 underline decoration-zinc-300 underline-offset-4 transition hover:text-emerald-700 dark:text-zinc-400 dark:hover:text-emerald-300">
                  {dict.home.getQuote} <span className="ml-1" aria-hidden>↗</span>
                </Link>
              </div>
            </Reveal>

            <Reveal delay={240}>
              <dl className="mt-11 grid grid-cols-3 gap-4 border-t border-zinc-300/70 pt-6 dark:border-zinc-800">
                <Stat value="6" label={dict.home.statProjects} bars={[3, 5, 8]} />
                <Stat value="3" label={dict.home.statAutomation} bars={[4, 6, 9]} />
                <Stat value="6" label={dict.home.statTemplates} bars={[2, 6, 7]} />
              </dl>
            </Reveal>
          </div>

          <Reveal dir="right" delay={160}>
            <div className="relative mx-auto w-full max-w-[460px] lg:mr-0">
              <div aria-hidden className="absolute -inset-4 -z-10 rotate-2 rounded-[2rem] border border-emerald-200/70 bg-emerald-100/30 dark:border-emerald-900 dark:bg-emerald-950/20" />
              <div className="deco-corner relative overflow-hidden rounded-[1.75rem] border border-zinc-300/80 bg-[#171715] shadow-[0_28px_80px_-32px_rgba(41,37,36,.55)] dark:border-zinc-700">
                <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                  <span className="font-mono text-[10px] tracking-[0.2em] text-emerald-300/80">{dict.home.workbenchKicker}</span>
                  <span className="flex gap-1.5" aria-hidden>
                    <i className="h-2 w-2 rounded-full bg-white/20" /><i className="h-2 w-2 rounded-full bg-white/20" /><i className="h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                </div>
                <div className="p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold tracking-tight text-white">{dict.home.workbenchTitle}</h2>
                      <p className="mt-2 max-w-[34ch] text-xs leading-5 text-zinc-400">{dict.home.workbenchDesc}</p>
                    </div>
                    <span className="mt-1 flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] text-emerald-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      LIVE
                    </span>
                  </div>

                  <div className="mt-6 space-y-2.5">
                    {featured.map((project, index) => (
                      <Link
                        key={project.slug}
                        href={`/${lang}/work/${project.slug}`}
                        className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.045] p-3.5 transition duration-300 hover:translate-x-1 hover:border-emerald-400/40 hover:bg-emerald-400/[0.08]"
                      >
                        <span className="font-mono text-[10px] text-zinc-500">0{index + 1}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-zinc-100">{project.title[t]}</span>
                          <span className="mt-0.5 block text-[10px] uppercase tracking-wider text-zinc-500">{categoryMeta[project.category][t]}</span>
                        </span>
                        <span className="text-emerald-400 transition-transform group-hover:translate-x-0.5" aria-hidden>→</span>
                      </Link>
                    ))}
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4 text-[10px] text-zinc-500">
                    <span>{dict.home.workbenchLocal}</span>
                    <span className="font-mono text-zinc-400">v2026.10</span>
                  </div>
                </div>
              </div>
              <p className="mt-5 text-center font-mono text-[10px] tracking-wide text-zinc-400">{dict.home.workbenchStack}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 技术栈跑马灯：工坊气息的连续节奏带 */}
      <div className="relative border-y border-zinc-200/80 bg-white/60 py-3.5 dark:border-zinc-800/80 dark:bg-zinc-950/40">
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#fafafa] to-transparent dark:from-[#09090b]" />
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#fafafa] to-transparent dark:from-[#09090b]" />
        <div className="animate-ticker flex w-max items-center gap-8 whitespace-nowrap">
          {[...STACK, ...STACK].map((item, i) => (
            <span key={`${item}-${i}`} className="flex items-center gap-8 text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
              {item}
              <span className="h-1 w-1 rounded-full bg-emerald-400/70" aria-hidden />
            </span>
          ))}
        </div>
      </div>

      <section className="relative py-16">
        <Reveal>
          <div className="mb-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">INDEX / 03</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">{dict.home.sectionsTitle}</h2>
          </div>
        </Reveal>
        <div className="grid gap-px overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-200 md:grid-cols-3 dark:border-zinc-800 dark:bg-zinc-800">
          {dict.home.sections.map((s, i) => (
            <Link key={s.tag} href={sectionLinks[i]} className="group relative overflow-hidden bg-white p-6 transition duration-300 hover:bg-emerald-50/70 sm:p-7 dark:bg-zinc-950 dark:hover:bg-emerald-950/20">
              <span aria-hidden className="pointer-events-none absolute -right-2 -top-5 select-none font-mono text-[82px] font-bold leading-none text-zinc-100 transition duration-500 group-hover:text-emerald-100 dark:text-zinc-900 dark:group-hover:text-emerald-950/60">
                {`0${i + 1}`}
              </span>
              <span className="relative font-mono text-[10px] tracking-[0.16em] text-emerald-700 dark:text-emerald-400">{s.tag}</span>
              <h3 className="relative mt-5 text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">{s.title}</h3>
              <p className="relative mt-3 text-sm leading-6 text-zinc-500 dark:text-zinc-400">{s.desc}</p>
              <span className="relative mt-6 inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 transition group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                {lang === "en" ? "Explore" : "查看板块"} <ArrowRightIcon />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <Reveal>
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">SELECTED / WORK</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">{dict.work.featuredWork}</h2>
            </div>
            <Link href={`/${lang}/work`} className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-emerald-700 hover:text-emerald-600 dark:text-emerald-400">
              {dict.work.viewAllWork} <ArrowRightIcon />
            </Link>
          </div>
        </Reveal>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((p, i) => (
            <Reveal key={p.slug} delay={i * 90}>
              <WorkCard project={p} lang={lang} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="grid gap-10 border-t border-zinc-200/80 py-16 lg:grid-cols-[240px_1fr] dark:border-zinc-800/80">
        <Reveal>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">BUILD / NOTES</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">{dict.home.latestPosts}</h2>
            <Link href={`/${lang}/blog`} className="mt-4 inline-flex items-center gap-1 text-sm text-emerald-700 dark:text-emerald-400">
              {dict.blog.all} <ArrowRightIcon />
            </Link>
          </div>
        </Reveal>
        <div className="border-t border-zinc-200 dark:border-zinc-800">
          {latest.map((p, index) => (
            <Link key={p.slug} href={`/${lang}/blog/${p.slug}`} className="group grid gap-2 border-b border-zinc-200 py-5 sm:grid-cols-[36px_1fr_auto] sm:items-start sm:gap-4 dark:border-zinc-800">
              <span className="font-mono text-[10px] text-zinc-400">0{index + 1}</span>
              <span>
                <span className="block font-medium text-zinc-900 transition group-hover:text-emerald-700 dark:text-zinc-100 dark:group-hover:text-emerald-300">{p.title}</span>
                <span className="mt-1.5 block max-w-[62ch] text-sm leading-6 text-zinc-500 dark:text-zinc-400">{p.summary}</span>
              </span>
              <time className="text-xs tabular-nums text-zinc-400">{p.date}</time>
            </Link>
          ))}
        </div>
      </section>

      <Reveal>
        <section className="deco-dots relative mb-8 flex flex-col items-start justify-between gap-6 overflow-hidden rounded-[1.75rem] border border-emerald-200 bg-emerald-50/70 p-7 sm:p-9 md:flex-row md:items-center dark:border-emerald-900 dark:bg-emerald-950/20">
          <div>
            <p className="font-mono text-[10px] tracking-[0.18em] text-emerald-700 dark:text-emerald-400">NEXT / YOUR IDEA</p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">{dict.services.ctaTitle}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">{dict.services.ctaNote}</p>
          </div>
          <Link href={`/${lang}/services`} className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-emerald-700 active:scale-[0.98] dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-emerald-300">
            {dict.home.getQuote} <ArrowRightIcon />
          </Link>
        </section>
      </Reveal>
    </div>
  );
}

function Stat({ value, label, bars }: { value: string; label: string; bars: number[] }) {
  return (
    <div>
      <dd className="text-3xl font-semibold tabular-nums tracking-tight text-zinc-950 dark:text-zinc-50">{value}</dd>
      <dt className="order-2 mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">{label}</dt>
      <div aria-hidden className="mt-2 flex h-2.5 items-end gap-1">
        {bars.map((h, i) => (
          <i key={i} className="w-1.5 rounded-sm bg-emerald-400/70" style={{ height: `${h * 2.5}px` }} />
        ))}
      </div>
    </div>
  );
}

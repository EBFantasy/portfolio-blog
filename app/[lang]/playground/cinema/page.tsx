import type { Metadata } from "next";
import CinemaPlayground from "@/components/CinemaPlayground";
import BackToCase from "@/components/BackToCase";
import { Reveal } from "@/components/showcase/reveal";
import { getDict, isValidLocale, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  return [{ lang: "zh" }, { lang: "en" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: raw } = await params;
  const lang = (isValidLocale(raw) ? raw : "zh") as Locale;
  const c = getDict(lang).playground.cinema;
  return {
    title: `${c.movieTitle} · ${c.badge} · EBFantasy`,
    description: c.intro,
  };
}

export default async function CinemaPlaygroundPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: raw } = await params;
  const lang = (isValidLocale(raw) ? raw : "zh") as Locale;
  const dict = getDict(lang);
  const c = dict.playground.cinema;

  return (
    <div className="py-14">
      <BackToCase href={`/${lang}/work/cinema-booking`} label={c.backToCase} />

      <Reveal>
        <div className="mt-6">
          <span className="rounded-full bg-rose-500/10 px-2.5 py-1 text-xs text-rose-600 dark:text-rose-400">
            {c.badge}
          </span>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {c.movieTitle}
          </h1>
          <p className="mt-1 text-sm text-zinc-400">{c.movieMeta}</p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            {c.intro}
          </p>
        </div>
      </Reveal>

      <Reveal delay={150}>
        <CinemaPlayground dict={c} lang={lang} />
      </Reveal>
    </div>
  );
}

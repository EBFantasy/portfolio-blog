import type { Metadata } from "next";
import Link from "next/link";
import TeatimePlayground from "@/components/TeatimePlayground";
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
  const t = getDict(lang).playground.teatime;
  return {
    title: `${t.shopName} · ${t.badge} · EBFantasy`,
    description: t.intro,
  };
}

export default async function TeatimePlaygroundPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: raw } = await params;
  const lang = (isValidLocale(raw) ? raw : "zh") as Locale;
  const dict = getDict(lang);
  const t = dict.playground.teatime;

  return (
    <div className="py-14">
      <Link
        href={`/${lang}/work/teatime-ordering`}
        className="text-sm text-zinc-500 transition hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        ← {t.backToCase}
      </Link>

      <div className="mt-6">
        <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-xs text-amber-600 dark:text-amber-400">
          {t.badge}
        </span>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {t.shopName}
        </h1>
        <p className="mt-1 text-sm text-zinc-400">{t.shopMeta}</p>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
          {t.intro}
        </p>
      </div>

      <TeatimePlayground dict={t} lang={lang} />
    </div>
  );
}

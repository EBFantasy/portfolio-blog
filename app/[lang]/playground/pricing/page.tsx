import type { Metadata } from "next";
import Link from "next/link";
import PricingPlayground from "@/components/PricingPlayground";
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
  const p = getDict(lang).playground.pricing;
  return {
    title: `${p.productName} · ${p.badge} · EBFantasy`,
    description: p.intro,
  };
}

export default async function PricingPlaygroundPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: raw } = await params;
  const lang = (isValidLocale(raw) ? raw : "zh") as Locale;
  const dict = getDict(lang);
  const p = dict.playground.pricing;

  return (
    <div className="py-14">
      <Link
        href={`/${lang}/work/saas-pricing`}
        className="text-sm text-zinc-500 transition hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        ← {p.backToCase}
      </Link>

      <div className="mt-6">
        <span className="rounded-full bg-sky-500/10 px-2.5 py-1 text-xs text-sky-600 dark:text-sky-400">
          {p.badge}
        </span>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {p.productName}
        </h1>
        <p className="mt-1 text-sm text-zinc-400">{p.productMeta}</p>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
          {p.intro}
        </p>
      </div>

      <PricingPlayground dict={p} />
    </div>
  );
}

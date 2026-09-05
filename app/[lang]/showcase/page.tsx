import type { Metadata } from "next";
import ShowcaseIndex from "@/components/ShowcaseIndex";
import { isValidLocale, type Locale } from "@/lib/i18n";
import { showcaseUI, templates } from "@/lib/showcase";

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
  const t = lang === "en" ? "en" : "zh";
  return {
    title: `${showcaseUI.title[t]} · EBFantasy`,
    description: showcaseUI.desc[t],
  };
}

export default async function ShowcaseGalleryPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: raw } = await params;
  const lang = (isValidLocale(raw) ? raw : "zh") as Locale;
  return <ShowcaseIndex lang={lang} ui={showcaseUI} templates={templates} />;
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ShowcaseTemplatePage from "@/components/ShowcaseTemplatePage";
import { isValidLocale, type Locale } from "@/lib/i18n";
import { getTemplate, showcaseUI, templates } from "@/lib/showcase";

export function generateStaticParams() {
  return templates.flatMap((t) => ["zh", "en"].map((lang) => ({ lang, slug: t.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang: raw, slug } = await params;
  const lang = (isValidLocale(raw) ? raw : "zh") as Locale;
  const template = getTemplate(slug);
  if (!template) return {};
  const t = lang === "en" ? "en" : "zh";
  return {
    title: `${template.name[t]} · ${showcaseUI.title[t]} · EBFantasy`,
    description: template.sub[t],
  };
}

export default async function ShowcaseTemplateDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang: raw, slug } = await params;
  const lang = (isValidLocale(raw) ? raw : "zh") as Locale;
  const template = getTemplate(slug);
  if (!template) notFound();

  return (
    <ShowcaseTemplatePage
      template={template}
      lang={lang}
      backHref={`/${lang}/showcase`}
      backLabel={showcaseUI.back[lang === "en" ? "en" : "zh"]}
    />
  );
}

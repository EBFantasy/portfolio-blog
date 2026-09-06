import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ShowcaseTemplatePage from "@/components/ShowcaseTemplatePage";
import ApexConsulting from "@/components/showcase/ApexConsulting";
import MaisonVerte from "@/components/showcase/MaisonVerte";
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

  const backHref = `/${lang}/showcase`;
  const backLabel = showcaseUI.back[lang === "en" ? "en" : "zh"];

  /* 深度定制版：apex-consulting 与 maison-verte 拥有专属组件（图片 + 动画 + 交互） */
  if (slug === "apex-consulting") {
    return <ApexConsulting lang={lang} backHref={backHref} backLabel={backLabel} />;
  }
  if (slug === "maison-verte") {
    return <MaisonVerte lang={lang} backHref={backHref} backLabel={backLabel} />;
  }

  return <ShowcaseTemplatePage template={template} lang={lang} backHref={backHref} backLabel={backLabel} />;
}

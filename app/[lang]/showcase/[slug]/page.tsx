import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ShowcaseTemplatePage from "@/components/ShowcaseTemplatePage";
import ApexConsulting from "@/components/showcase/ApexConsulting";
import MaisonVerte from "@/components/showcase/MaisonVerte";
import NexusAI from "@/components/showcase/NexusAI";
import PulseAnalytics from "@/components/showcase/PulseAnalytics";
import StarfallSaga from "@/components/showcase/StarfallSaga";
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

  /* 深度定制版：这些 slug 拥有专属组件（专属动效/交互/配图），其余走通用渲染器 */
  if (slug === "apex-consulting") {
    return <ApexConsulting lang={lang} backHref={backHref} backLabel={backLabel} />;
  }
  if (slug === "maison-verte") {
    return <MaisonVerte lang={lang} backHref={backHref} backLabel={backLabel} />;
  }
  if (slug === "nexus-ai") {
    return <NexusAI lang={lang} backHref={backHref} backLabel={backLabel} />;
  }
  if (slug === "pulse-analytics") {
    return <PulseAnalytics lang={lang} backHref={backHref} backLabel={backLabel} />;
  }
  if (slug === "starfall-saga") {
    return <StarfallSaga lang={lang} backHref={backHref} backLabel={backLabel} />;
  }

  return <ShowcaseTemplatePage template={template} lang={lang} backHref={backHref} backLabel={backLabel} />;
}

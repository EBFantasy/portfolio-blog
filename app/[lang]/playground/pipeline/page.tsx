import type { Metadata } from "next";
import ReportPipeline from "@/components/ReportPipeline";
import { isValidLocale, type Locale } from "@/lib/i18n";

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
  return {
    title: lang === "en" ? "Multi-Sheet Report Pipeline · EBFantasy" : "多表报表自动化流水线 · EBFantasy",
    description:
      lang === "en"
        ? "Three regional sheets validated, cleaned, deduped, merged and summarized on screen — producing a real, downloadable CSV."
        : "三张区域表自动校验、清洗、去重、合并并汇总成报表，产出真实可下载的 CSV。",
  };
}

export default async function PipelinePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: raw } = await params;
  const lang = (isValidLocale(raw) ? raw : "zh") as Locale;
  return (
    <ReportPipeline
      lang={lang}
      backHref={`/${lang}/work/report-pipeline`}
      backLabel={lang === "en" ? "Back to works" : "返回作品列表"}
    />
  );
}

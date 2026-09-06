import type { Metadata } from "next";
import PriceMonitor from "@/components/PriceMonitor";
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
    title: lang === "en" ? "E-commerce Price Monitor · EBFantasy" : "电商价格监控仪表盘 · EBFantasy",
    description:
      lang === "en"
        ? "Scheduled price streams charted in realtime with threshold alerts."
        : "定时采集价格流并实时绘图，跌破阈值即刻告警。",
  };
}

export default async function MonitorPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: raw } = await params;
  const lang = (isValidLocale(raw) ? raw : "zh") as Locale;
  return (
    <PriceMonitor
      lang={lang}
      backHref={`/${lang}/work/price-monitor`}
      backLabel={lang === "en" ? "Back to works" : "返回作品列表"}
    />
  );
}

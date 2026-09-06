import type { Metadata } from "next";
import CrawlerVisualizer from "@/components/CrawlerVisualizer";
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
    title: lang === "en" ? "Crawler Scheduler Visualizer · EBFantasy" : "爬虫调度可视化系统 · EBFantasy",
    description:
      lang === "en"
        ? "A visual walkthrough of BFS crawling: concurrency, rate limiting, dedup and robots.txt compliance."
        : "广度优先抓取全流程可视化：并发控制、速率限制、链接去重与 robots 协议遵守。",
  };
}

export default async function CrawlerPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: raw } = await params;
  const lang = (isValidLocale(raw) ? raw : "zh") as Locale;
  return (
    <CrawlerVisualizer
      lang={lang}
      backHref={`/${lang}/work/crawler-scheduler`}
      backLabel={lang === "en" ? "Back to works" : "返回作品列表"}
    />
  );
}

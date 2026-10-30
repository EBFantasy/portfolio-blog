import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, isValidLocale, getDict } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingMascot from "@/components/FloatingMascot";

type LangParams = Promise<{ lang: string }>;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: LangParams;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isValidLocale(lang)) notFound();

  const content = {
    zh: {
      title: "软件工程师作品集与技术博客",
      description: "网页开发 Demo、微信小程序预览、功能演示与技术博客。",
    },
    en: {
      title: "Software Engineer Portfolio & Blog",
      description:
        "Web development demos, WeChat mini program previews, interactive features, and technical articles.",
    },
  }[lang];

  return {
    title: content.title,
    description: content.description,
    alternates: {
      canonical: `${SITE_URL}/${lang}`,
      languages: {
        zh: `${SITE_URL}/zh`,
        en: `${SITE_URL}/en`,
      },
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: LangParams;
}) {
  const { lang } = await params;
  if (!isValidLocale(lang)) notFound();
  const dict = getDict(lang);
  const skipLabel = lang === "zh" ? "跳转到主要内容" : "Skip to content";

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-lg bg-zinc-950 px-4 py-2 text-sm font-medium text-white shadow-lg transition-transform focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:bg-white dark:text-zinc-950 dark:ring-offset-zinc-950"
      >
        {skipLabel}
      </a>
      <Header lang={lang} dict={dict} />
      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto w-full max-w-6xl flex-1 px-5 sm:px-8"
      >
        {children}
      </main>
      <FloatingMascot
        quotes={dict.mascot.quotes}
        toggleShow={dict.mascot.toggleShow}
        toggleHide={dict.mascot.toggleHide}
      />
      <Footer lang={lang} dict={dict} />
    </div>
  );
}

import { notFound } from "next/navigation";
import { locales, isValidLocale, getDict } from "@/lib/i18n";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isValidLocale(lang)) notFound();
  const dict = getDict(lang);
  return (
    <div className="flex min-h-screen flex-col">
      <Header lang={lang} dict={dict} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-5 sm:px-8">
        {children}
      </main>
      <Footer lang={lang} dict={dict} />
    </div>
  );
}


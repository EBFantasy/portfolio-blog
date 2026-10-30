import type { Metadata } from "next";
import ContactActions from "@/components/ContactActions";
import ServiceTiers from "@/components/ServiceTiers";
import { Reveal } from "@/components/showcase/reveal";
import { getDict, isValidLocale, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: raw } = await params;
  const lang = (isValidLocale(raw) ? raw : "zh") as Locale;
  const s = getDict(lang).services;
  return {
    title: s.title,
    description: s.desc,
    alternates: { canonical: `/${lang}/services`, languages: { zh: "/zh/services", en: "/en/services" } },
  };
}

export default async function ServicesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params;
  const lang = (isValidLocale(raw) ? raw : "zh") as Locale;
  const s = getDict(lang).services;

  return (
    <div className="py-12 sm:py-16">
      <Reveal>
        <header className="max-w-3xl border-l-2 border-emerald-500 pl-5 sm:pl-7">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">SCOPE / BEFORE QUOTE</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tighter text-zinc-950 sm:text-5xl dark:text-zinc-50">{s.title}</h1>
          <p className="mt-5 max-w-[68ch] text-base leading-8 text-zinc-600 dark:text-zinc-400">{s.desc}</p>
        </header>
      </Reveal>

      <Reveal delay={100}>
        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-200 sm:grid-cols-2 lg:grid-cols-4 dark:border-zinc-800 dark:bg-zinc-800">
          {s.trust.map((item, index) => (
            <div key={item.label} className="bg-white p-5 dark:bg-zinc-950">
              <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400">0{index + 1}</span>
              <p className="mt-3 text-sm font-semibold text-zinc-900 dark:text-zinc-50">{item.label}</p>
              <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <section className="mt-16">
        <Reveal>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">CAPABILITIES / 03</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">{s.tiersTitle}</h2>
          <ServiceTiers tiers={s.tiers} popularLabel={s.popular} groupLabel={s.tiersTitle} ctaLabel={s.tierCta} lang={lang} />
          <p className="mt-4 text-xs text-zinc-400 dark:text-zinc-500">{s.ctaNote}</p>
        </Reveal>
      </section>

      <section className="mt-16 grid gap-8 lg:grid-cols-[220px_1fr]">
        <Reveal>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">PROCESS / 06</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">{s.processTitle}</h2>
          </div>
        </Reveal>
        <ol className="border-t border-zinc-200 dark:border-zinc-800">
          {s.process.map((step, i) => (
            <li key={step.name} className="grid gap-2 border-b border-zinc-200 py-5 sm:grid-cols-[44px_150px_1fr] sm:items-baseline dark:border-zinc-800">
              <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{step.name}</h3>
              <p className="text-sm leading-6 text-zinc-500 dark:text-zinc-400">{step.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16 grid gap-8 lg:grid-cols-[220px_1fr]">
        <Reveal>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">FAQ / 06</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">{s.faqTitle}</h2>
          </div>
        </Reveal>
        <div className="space-y-3">
          {s.faqs.map((f) => (
            <details key={f.q} className="group rounded-xl border border-zinc-200 bg-white px-5 py-4 transition open:border-emerald-300 dark:border-zinc-800 dark:bg-zinc-900 dark:open:border-emerald-800">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-zinc-900 outline-none focus-visible:outline-2 focus-visible:outline-emerald-500 dark:text-zinc-50 [&::-webkit-details-marker]:hidden">
                {f.q}
                <svg className="h-4 w-4 shrink-0 text-zinc-400 transition group-open:rotate-45" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </summary>
              <p className="mt-3 max-w-[70ch] text-sm leading-7 text-zinc-500 dark:text-zinc-400">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <Reveal>
        <section id="contact" className="mt-16 grid scroll-mt-24 gap-8 rounded-[2rem] border border-emerald-200 bg-emerald-50/70 p-6 sm:p-9 lg:grid-cols-[1fr_400px] dark:border-emerald-900 dark:bg-emerald-950/20">
          <div className="flex flex-col justify-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">CONTACT / START HERE</p>
            <h2 className="mt-3 max-w-[18ch] text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl dark:text-zinc-50">{s.ctaTitle}</h2>
            <p className="mt-4 max-w-[58ch] text-sm leading-7 text-zinc-600 dark:text-zinc-400">{s.ctaDesc}</p>
            <p className="mt-5 text-xs text-zinc-500 dark:text-zinc-500">{s.ctaNote}</p>
          </div>
          <ContactActions lang={lang} />
        </section>
      </Reveal>
    </div>
  );
}

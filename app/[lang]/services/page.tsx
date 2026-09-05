import ServiceTiers from "@/components/ServiceTiers";
import { getDict, isValidLocale, type Locale } from "@/lib/i18n";

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: raw } = await params;
  const lang = (isValidLocale(raw) ? raw : "zh") as Locale;
  const s = getDict(lang).services;

  return (
    <div className="py-14">
      {/* Hero */}
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {s.title}
      </h1>
      <p className="mt-3 max-w-2xl text-zinc-500 dark:text-zinc-400">{s.desc}</p>

      {/* 信任条 */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {s.trust.map((t) => (
          <div
            key={t.label}
            className="rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{t.label}</p>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{t.desc}</p>
          </div>
        ))}
      </div>

      {/* 服务档位（client 组件：点击选中 + 品牌绿 focus 外框） */}
      <h2 className="mt-14 text-lg font-medium text-zinc-900 dark:text-zinc-50">{s.tiersTitle}</h2>
      <ServiceTiers tiers={s.tiers} popularLabel={s.popular} groupLabel={s.tiersTitle} />
      <p className="mt-3 text-xs text-zinc-400 dark:text-zinc-500">{s.ctaNote}</p>

      {/* 交付流程 */}
      <h2 className="mt-14 text-lg font-medium text-zinc-900 dark:text-zinc-50">{s.processTitle}</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {s.process.map((step, i) => (
          <div
            key={step.name}
            className="flex gap-4 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              {i + 1}
            </span>
            <div>
              <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{step.name}</h3>
              <p className="mt-1 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <h2 className="mt-14 text-lg font-medium text-zinc-900 dark:text-zinc-50">{s.faqTitle}</h2>
      <div className="mt-5 max-w-3xl space-y-2.5">
        {s.faqs.map((f) => (
          <details
            key={f.q}
            className="group rounded-xl border border-zinc-200 bg-white px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-zinc-900 dark:text-zinc-50 [&::-webkit-details-marker]:hidden">
              {f.q}
              <svg
                className="h-4 w-4 shrink-0 text-zinc-400 transition group-open:rotate-45"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{f.a}</p>
          </details>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-14 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 px-6 py-10 text-center sm:px-12">
        <h2 className="text-xl font-semibold text-white sm:text-2xl">{s.ctaTitle}</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-emerald-50/90">
          {s.ctaDesc}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <div className="rounded-xl bg-white/15 px-5 py-3 text-sm text-white backdrop-blur">
            <span className="text-emerald-100/80">{s.ctaWechat}</span>
            <span className="ml-2 font-semibold">EBFantasy</span>
          </div>
          <div className="rounded-xl bg-white/15 px-5 py-3 text-sm text-white backdrop-blur">
            <span className="text-emerald-100/80">{s.ctaEmail}</span>
            <span className="ml-2 font-semibold">your@email.com</span>
          </div>
        </div>
      </div>
    </div>
  );
}

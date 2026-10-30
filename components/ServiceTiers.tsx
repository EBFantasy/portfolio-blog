import { projectInquiryMail } from "@/lib/contact";

interface Tier {
  name: string;
  price: string;
  duration: string;
  popular: boolean;
  desc: string;
  items: string[];
}

/** 服务方向卡片：选择行为直接进入真实的邮件询价，不做无后续用途的假选中。 */
export default function ServiceTiers({
  tiers,
  popularLabel,
  groupLabel,
  ctaLabel,
  lang,
}: {
  tiers: Tier[];
  popularLabel: string;
  groupLabel: string;
  ctaLabel: string;
  lang: "zh" | "en";
}) {
  return (
    <div aria-label={groupLabel} className="mt-6 grid gap-4 lg:grid-cols-3">
      {tiers.map((tier, index) => (
        <article
          key={tier.name}
          className={`relative flex flex-col rounded-[1.5rem] border bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-zinc-900 ${
            tier.popular
              ? "border-emerald-400/70 ring-1 ring-emerald-400/20 dark:border-emerald-600"
              : "border-zinc-200 dark:border-zinc-800"
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <span className="font-mono text-xs tracking-[0.18em] text-zinc-400">0{index + 1}</span>
            {tier.popular && (
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200">
                {popularLabel}
              </span>
            )}
          </div>
          <h3 className="mt-5 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">{tier.name}</h3>
          <p className="mt-2 min-h-10 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{tier.desc}</p>
          <div className="mt-5 border-y border-zinc-100 py-4 dark:border-zinc-800">
            <span className="block text-base font-semibold text-emerald-700 dark:text-emerald-300">{tier.price}</span>
            <span className="mt-1 block text-xs text-zinc-400">{tier.duration}</span>
          </div>
          <ul className="mt-5 flex-1 space-y-2.5">
            {tier.items.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="m5 13 4 4L19 7" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
          <a
            href={projectInquiryMail(lang, tier.name)}
            className="mt-6 inline-flex items-center justify-center rounded-xl border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-800 active:scale-[0.98] dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-200"
          >
            {ctaLabel} <span className="ml-1.5" aria-hidden>→</span>
          </a>
        </article>
      ))}
    </div>
  );
}

"use client";

import { useState } from "react";

interface Tier {
  name: string;
  price: string;
  duration: string;
  popular: boolean;
  desc: string;
  items: string[];
}

/** 服务页三档卡片：整卡可点，点击出现品牌绿 focus 外框 + 右上角选中角标，默认选中推荐档 */
export default function ServiceTiers({
  tiers,
  popularLabel,
  groupLabel,
}: {
  tiers: Tier[];
  popularLabel: string;
  groupLabel: string;
}) {
  const initial = tiers.find((t) => t.popular)?.name ?? tiers[0]?.name ?? null;
  const [selected, setSelected] = useState<string | null>(initial);

  return (
    <div role="radiogroup" aria-label={groupLabel} className="mt-5 grid gap-4 lg:grid-cols-3">
      {tiers.map((tier) => {
        const isSelected = selected === tier.name;
        return (
          <div
            key={tier.name}
            role="radio"
            aria-checked={isSelected}
            tabIndex={0}
            onClick={() => setSelected(tier.name)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setSelected(tier.name);
              }
            }}
            className={`relative flex cursor-pointer flex-col rounded-2xl border bg-white p-6 outline-offset-2 transition hover:border-zinc-300 focus-visible:outline-2 focus-visible:outline-emerald-500 hover:shadow-md dark:bg-zinc-900 dark:hover:border-zinc-600 ${
              tier.popular
                ? "border-emerald-500 shadow-lg shadow-emerald-500/5 dark:border-emerald-600"
                : "border-zinc-200 dark:border-zinc-800"
            } ${isSelected ? "outline-2 outline-emerald-500" : ""}`}
          >
            {tier.popular && (
              <span className="absolute -top-3 left-5 rounded-full bg-emerald-600 px-3 py-0.5 text-xs font-medium text-white">
                {popularLabel}
              </span>
            )}
            {isSelected && (
              <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md ring-2 ring-white dark:ring-zinc-950">
                <svg
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={3.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </span>
            )}
            <h3 className="font-medium text-zinc-900 dark:text-zinc-50">{tier.name}</h3>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{tier.desc}</p>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{tier.price}</span>
              <span className="text-xs text-zinc-400">{tier.duration}</span>
            </div>
            <ul className="mt-5 flex-1 space-y-2.5 border-t border-zinc-100 pt-5 dark:border-zinc-800">
              {tier.items.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm text-zinc-600 dark:text-zinc-300"
                >
                  <svg
                    className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="m5 13 4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

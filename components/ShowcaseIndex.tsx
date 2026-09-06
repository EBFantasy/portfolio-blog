"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRightIcon } from "@/components/Icons";
import {
  categoryLabels,
  showcaseCategories,
  showcaseUI,
  type Bi,
  type ShowcaseCategory,
  type ShowcaseTemplate,
} from "@/lib/showcase";

type UI = typeof showcaseUI;

/** 模板画廊索引：类别筛选 + 浏览器窗口式预览卡片 */
export default function ShowcaseIndex({
  lang,
  ui,
  templates,
}: {
  lang: "zh" | "en";
  ui: UI;
  templates: ShowcaseTemplate[];
}) {
  const T = lang === "en" ? "en" : "zh";
  const [cat, setCat] = useState<ShowcaseCategory | "all">("all");
  const shown = cat === "all" ? templates : templates.filter((t) => t.category === cat);

  const chips: { key: ShowcaseCategory | "all"; label: string; count: number }[] = [
    { key: "all", label: ui.all[T], count: templates.length },
    ...showcaseCategories.map((c) => ({
      key: c,
      label: categoryLabels[c][T],
      count: templates.filter((t) => t.category === c).length,
    })),
  ];

  return (
    <div className="py-14">
      <style>{`
        @keyframes si-in { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
      `}</style>

      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {ui.title[T]}
      </h1>
      <p className="mt-3 max-w-2xl text-zinc-500 dark:text-zinc-400">{ui.desc[T]}</p>

      {/* 类别筛选 */}
      <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label={ui.title[T]}>
        {chips.map((c) => {
          const active = cat === c.key;
          return (
            <button
              key={c.key}
              role="tab"
              aria-selected={active}
              onClick={() => setCat(c.key)}
              className={`rounded-full border px-4 py-1.5 text-sm transition active:scale-[0.97] ${
                active
                  ? "border-emerald-500 bg-emerald-500/10 font-medium text-emerald-600 dark:text-emerald-400"
                  : "border-zinc-200 text-zinc-500 hover:border-zinc-300 hover:text-zinc-700 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-200"
              }`}
            >
              {c.label}
              <span className="ml-1.5 text-xs opacity-60">{c.count}</span>
            </button>
          );
        })}
      </div>

      {/* 卡片网格：切换分类时交错入场 */}
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {shown.map((t, i) => (
          <div key={`${cat}-${t.slug}`} style={{ animation: `si-in .5s ease ${i * 70}ms both` }}>
            <TemplateCard t={t} lang={lang} viewLabel={ui.view[T]} />
          </div>
        ))}
      </div>

      <p className="mt-8 text-xs text-zinc-400 dark:text-zinc-500">{ui.note[T]}</p>
    </div>
  );
}

function TemplateCard({ t, lang, viewLabel }: { t: ShowcaseTemplate; lang: "zh" | "en"; viewLabel: string }) {
  const T = lang === "en" ? "en" : "zh";
  const L = (b: Bi) => b[T];
  return (
    <Link
      href={`/${lang}/showcase/${t.slug}`}
      className="group block overflow-hidden rounded-2xl border border-zinc-200 bg-white transition hover:-translate-y-1 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
    >
      {/* 浏览器顶栏 */}
      <div className="flex items-center gap-1.5 border-b border-zinc-100 bg-zinc-50 px-3.5 py-2.5 dark:border-zinc-800 dark:bg-zinc-800/60">
        <span className="h-2.5 w-2.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
        <span className="h-2.5 w-2.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
        <span className="h-2.5 w-2.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
        <span className="ml-2 truncate rounded-md bg-white px-2.5 py-0.5 text-[10px] text-zinc-400 ring-1 ring-zinc-100 dark:bg-zinc-900 dark:text-zinc-500 dark:ring-zinc-800">
          {t.slug}.demo
        </span>
      </div>

      {/* 模板 mini hero（使用模板自身主题色） */}
      <div className="relative h-40 overflow-hidden px-5 py-5" style={{ background: t.theme.heroGrad }}>
        <span className="inline-block rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-medium text-white backdrop-blur">
          {L(t.tag)} · {categoryLabels[t.category][T]}
        </span>
        <div className="mt-3 max-w-[85%] text-base font-semibold leading-snug text-white sm:text-lg">
          {L(t.headline)}
        </div>
        <div className="mt-3 flex gap-1.5">
          <span
            className="rounded-md px-2 py-1 text-[10px] font-semibold text-white"
            style={{ background: t.theme.acc }}
          >
            {L(t.ctaPrimary)}
          </span>
          <span className="rounded-md border border-white/30 px-2 py-1 text-[10px] text-white/90">
            {L(t.ctaSecondary)}
          </span>
        </div>
        {/* 角落装饰点 */}
        <span
          className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-30 blur-xl"
          style={{ background: t.theme.acc2 }}
        />
      </div>

      {/* 卡片信息栏 */}
      <div className="flex items-center justify-between px-4 py-3.5">
        <div className="min-w-0">
          <div className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">{L(t.name)}</div>
          <div className="mt-0.5 text-xs text-zinc-400">
            {t.features.length} {lang === "zh" ? "个功能模块" : "feature blocks"} · {t.stats.length}{" "}
            {lang === "zh" ? "项数据亮点" : "key stats"}
          </div>
        </div>
        <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-zinc-400 transition group-hover:text-emerald-500">
          {viewLabel}
          <ArrowRightIcon />
        </span>
      </div>
    </Link>
  );
}

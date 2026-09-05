"use client";

import { useState } from "react";
import WorkCard from "@/components/WorkCard";
import {
  categoryMeta,
  projectCategories,
  type Project,
  type ProjectCategory,
} from "@/lib/work-shared";

type Filter = "all" | ProjectCategory;

export default function WorkGrid({
  projects,
  lang,
  catAllLabel,
}: {
  projects: Project[];
  lang: string;
  catAllLabel: string;
}) {
  const [active, setActive] = useState<Filter>("all");
  const filtered = active === "all" ? projects : projects.filter((p) => p.category === active);

  const tabs: { key: Filter; label: string; count: number }[] = [
    { key: "all", label: catAllLabel, count: projects.length },
    ...projectCategories.map((c) => ({
      key: c as Filter,
      label: categoryMeta[c][lang === "en" ? "en" : "zh"],
      count: projects.filter((p) => p.category === c).length,
    })),
  ];

  return (
    <div>
      {/* 分类筛选 tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={`rounded-full border px-4 py-1.5 text-sm transition ${
              active === t.key
                ? "border-emerald-600 bg-emerald-600 text-white"
                : "border-zinc-300 text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500"
            }`}
          >
            {t.label}
            <span className={`ml-1.5 text-xs ${active === t.key ? "text-white/70" : "text-zinc-400"}`}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* 项目网格 */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {filtered.map((p) => (
          <WorkCard key={p.slug} project={p} lang={lang} />
        ))}
      </div>
    </div>
  );
}

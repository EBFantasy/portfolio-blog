"use client";

import Link from "next/link";
import { ArrowRightIcon } from "@/components/Icons";
import { categoryMeta, type Accent, type Project } from "@/lib/work-shared";

const accentStyles: Record<Accent, { grad: string; chip: string; soft: string }> = {
  violet: {
    grad: "from-violet-500 to-indigo-600",
    chip: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
    soft: "bg-violet-500/10",
  },
  amber: {
    grad: "from-amber-500 to-orange-600",
    chip: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
    soft: "bg-amber-500/10",
  },
  rose: {
    grad: "from-rose-500 to-pink-600",
    chip: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
    soft: "bg-rose-500/10",
  },
  sky: {
    grad: "from-sky-500 to-blue-600",
    chip: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
    soft: "bg-sky-500/10",
  },
};

export default function WorkCard({ project, lang }: { project: Project; lang: string }) {
  const a = accentStyles[project.accent];
  const cat = categoryMeta[project.category][lang === "en" ? "en" : "zh"];
  const title = project.title[lang === "en" ? "en" : "zh"];
  const summary = project.summary[lang === "en" ? "en" : "zh"];
  const tryLabel = lang === "en" ? "Try it live" : "在线试玩";

  return (
    <Link
      href={`/${lang}/work/${project.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-600"
    >
      {/* 抽象预览头图：accent 渐变 + 简单几何 */}
      <div className={`relative h-36 bg-gradient-to-br ${a.grad} ${a.soft}`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${a.grad} opacity-80`} />
        {/* 抽象 UI 元素 */}
        <div className="absolute inset-0 p-4">
          {project.preview === "phone" ? (
            <div className="mx-auto h-full w-24 rounded-t-xl border-2 border-white/60 bg-white/10 backdrop-blur-[1px]">
              <div className="mx-auto mt-1.5 h-1 w-8 rounded-full bg-white/60" />
              <div className="mt-2 space-y-1.5 px-2">
                <div className="h-6 rounded-md bg-white/30" />
                <div className="h-1.5 w-4/5 rounded-full bg-white/50" />
                <div className="h-1.5 w-3/5 rounded-full bg-white/40" />
              </div>
            </div>
          ) : (
            <div className="h-full rounded-lg border-2 border-white/60 bg-white/10 p-2 backdrop-blur-[1px]">
              <div className="flex gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
              </div>
              <div className="mt-2 space-y-1.5">
                <div className="h-2.5 w-3/4 rounded-full bg-white/60" />
                <div className="h-2.5 w-1/2 rounded-full bg-white/40" />
                <div className="mt-2 flex gap-1.5">
                  <div className="h-8 flex-1 rounded-md bg-white/30" />
                  <div className="h-8 flex-1 rounded-md bg-white/20" />
                </div>
              </div>
            </div>
          )}
        </div>
        {/* 分类角标 */}
        <span className="absolute left-3 top-3 rounded-full bg-black/30 px-2.5 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
          {cat}
        </span>
        {/* 试玩角标：有可交互 demo 的作品直接可见 */}
        {project.links?.demo && (
          <span
            role="button"
            tabIndex={0}
            aria-label={tryLabel}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.open(project.links!.demo, "_blank", "noopener");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.stopPropagation();
                window.open(project.links!.demo, "_blank", "noopener");
              }
            }}
            className="absolute right-3 top-3 inline-flex cursor-pointer items-center gap-1 rounded-full bg-black/35 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm transition hover:bg-emerald-600"
          >
            ▶ {tryLabel}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-zinc-900 dark:text-zinc-50">{title}</h3>
          <span className="text-xs text-zinc-400">{project.year}</span>
        </div>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
          {summary}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          {project.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 text-sm font-medium text-zinc-700 transition group-hover:text-zinc-900 dark:text-zinc-300 dark:group-hover:text-zinc-100">
            {lang === "en" ? "View case" : "查看案例"}
            <ArrowRightIcon />
          </span>
          {project.links?.demo && (
            <span
              role="button"
              tabIndex={0}
              aria-label={tryLabel}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(project.links!.demo, "_blank", "noopener");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(project.links!.demo, "_blank", "noopener");
                }
              }}
              className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-500 active:scale-95"
            >
              ▶ {tryLabel}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

import Link from "next/link";
import { ArrowRightIcon } from "@/components/Icons";
import ProjectScreenshot from "@/components/ProjectScreenshot";
import { categoryMeta, type Project } from "@/lib/work-shared";

export default function WorkCard({ project, lang }: { project: Project; lang: string }) {
  const locale = lang === "en" ? "en" : "zh";
  const cat = categoryMeta[project.category][locale];
  const title = project.title[locale];
  const summary = project.summary[locale];

  return (
    <Link
      href={`/${lang}/work/${project.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-800"
    >
      <div className="relative aspect-[16/10] overflow-hidden border-b border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800">
        <ProjectScreenshot slug={project.slug} title={title} className="transition duration-500 group-hover:scale-[1.025]" />
        <span className="absolute left-3 top-3 rounded-full border border-white/40 bg-zinc-950/75 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-md">
          {cat}
        </span>
        <span className="absolute bottom-3 right-3 rounded-md bg-white/90 px-2 py-1 font-mono text-[9px] text-zinc-600 shadow-sm backdrop-blur dark:bg-zinc-950/85 dark:text-zinc-300">
          ACTUAL UI
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">{title}</h3>
          <span className="mt-0.5 font-mono text-[10px] text-zinc-400">{project.year}</span>
        </div>
        <p className="mt-2.5 flex-1 text-sm leading-6 text-zinc-500 dark:text-zinc-400">{summary}</p>
        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          {project.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-md bg-zinc-100 px-2 py-1 text-[10px] text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">{tag}</span>
          ))}
        </div>
        <span className="mt-5 inline-flex items-center gap-1.5 border-t border-zinc-100 pt-4 text-sm font-medium text-zinc-700 transition group-hover:text-emerald-700 dark:border-zinc-800 dark:text-zinc-300 dark:group-hover:text-emerald-300">
          {lang === "en" ? "View implementation" : "查看实现与边界"}
          <ArrowRightIcon />
        </span>
      </div>
    </Link>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRightIcon } from "@/components/Icons";
import PreviewFrame from "@/components/PreviewFrame";
import WorkCard from "@/components/WorkCard";
import { getDict, isValidLocale, type Locale } from "@/lib/i18n";
import { getAllProjects, getProject } from "@/lib/work";
import { categoryMeta } from "@/lib/work-shared";

export function generateStaticParams() {
  return getAllProjects().flatMap((p) =>
    ["zh", "en"].map((lang) => ({ lang, slug: p.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang: raw, slug } = await params;
  const lang = (isValidLocale(raw) ? raw : "zh") as Locale;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: `${project.title[lang === "en" ? "en" : "zh"]} · EBFantasy`,
    description: project.summary[lang === "en" ? "en" : "zh"],
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang: raw, slug } = await params;
  const lang = (isValidLocale(raw) ? raw : "zh") as Locale;
  const t = lang === "en" ? "en" : "zh";
  const dict = getDict(lang);
  const project = getProject(slug);
  if (!project) notFound();

  const all = getAllProjects();
  const next = all[(all.findIndex((p) => p.slug === project.slug) + 1) % all.length];

  return (
    <div className="py-14">
      <Link
        href={`/${lang}/work`}
        className="text-sm text-zinc-500 transition hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        ← {dict.work.detail.backToWork}
      </Link>

      {/* 标题区 */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {project.title[t]}
        </h1>
        <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
          {categoryMeta[project.category][t]}
        </span>
        <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
          {project.year}
        </span>
      </div>
      <p className="mt-3 max-w-2xl text-zinc-500 dark:text-zinc-400">{project.summary[t]}</p>

      {/* 预览 mockup */}
      <div className={`mt-10 rounded-3xl bg-zinc-100 p-4 sm:p-10 dark:bg-zinc-800/50 ${project.preview === "phone" ? "py-10" : ""}`}>
        <PreviewFrame project={project} />
        <p className="mt-6 text-center text-xs text-zinc-400 dark:text-zinc-500">
          {dict.work.detail.demoNote}
        </p>
      </div>

      {/* 正文区 */}
      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_320px]">
        <div>
          <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
            {dict.work.detail.features}
          </h2>
          <ul className="mt-4 space-y-2.5">
            {project.features.map((f, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-600 dark:text-zinc-300">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                {f[t]}
              </li>
            ))}
          </ul>

          <div className="mt-8 space-y-4">
            {project.description.map((para, i) => (
              <p key={i} className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                {para[t]}
              </p>
            ))}
          </div>
        </div>

        {/* 侧栏：技术栈 */}
        <aside className="h-fit rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
            {dict.work.detail.techStack}
          </h2>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-zinc-100 px-2.5 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
              >
                {tag}
              </span>
            ))}
          </div>
          <dl className="mt-5 space-y-2.5 border-t border-zinc-100 pt-4 text-sm dark:border-zinc-800">
            <div className="flex justify-between">
              <dt className="text-zinc-400">{dict.work.detail.category}</dt>
              <dd className="text-zinc-700 dark:text-zinc-300">{categoryMeta[project.category][t]}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-400">{dict.work.detail.year}</dt>
              <dd className="text-zinc-700 dark:text-zinc-300">{project.year}</dd>
            </div>
          </dl>
        </aside>
      </div>

      {/* 下一个作品 */}
      <div className="mt-14 border-t border-zinc-200 pt-8 dark:border-zinc-800">
        <div className="mb-4 flex items-center gap-1.5 text-sm font-medium text-zinc-900 dark:text-zinc-50">
          {dict.work.detail.nextProject}
          <ArrowRightIcon />
        </div>
        <div className="max-w-md">
          <WorkCard project={next} lang={lang} />
        </div>
      </div>
    </div>
  );
}

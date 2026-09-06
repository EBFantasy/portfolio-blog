import WorkGrid from "@/components/WorkGrid";
import { Reveal } from "@/components/showcase/reveal";
import { getDict, isValidLocale, type Locale } from "@/lib/i18n";
import { getAllProjects } from "@/lib/work";

export default async function WorkPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: raw } = await params;
  const lang = (isValidLocale(raw) ? raw : "zh") as Locale;
  const dict = getDict(lang);

  return (
    <div className="py-14">
      <Reveal>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {dict.work.title}
        </h1>
        <p className="mt-3 max-w-xl text-zinc-500 dark:text-zinc-400">{dict.work.desc}</p>
      </Reveal>

      <Reveal delay={150}>
        <div className="mt-10">
          <WorkGrid
            projects={getAllProjects()}
            lang={lang}
            catAllLabel={dict.work.catAll}
          />
        </div>
      </Reveal>
    </div>
  );
}

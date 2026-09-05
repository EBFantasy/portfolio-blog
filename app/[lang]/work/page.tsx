import { getDict, isValidLocale, type Locale } from "@/lib/i18n";

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
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {dict.work.title}
      </h1>
      <p className="mt-3 max-w-xl text-zinc-500 dark:text-zinc-400">{dict.work.desc}</p>

      <div className="mt-12 flex flex-col items-center rounded-2xl border border-dashed border-zinc-300 py-20 dark:border-zinc-700">
        <div className="flex gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-sky-400" />
        </div>
        <p className="mt-5 text-sm text-zinc-400 dark:text-zinc-500">{dict.work.empty}</p>
      </div>
    </div>
  );
}

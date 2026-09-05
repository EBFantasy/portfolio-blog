import Link from "next/link";
import type { Dict, Locale } from "@/lib/i18n";

export default function Footer({ lang, dict }: { lang: Locale; dict: Dict }) {
  return (
    <footer className="mt-20 border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-5 py-8 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-8 dark:text-zinc-400">
        <p>
          © {new Date().getFullYear()} {dict.siteName}. {dict.footer.rights}
        </p>
        <div className="flex items-center gap-4">
          <Link href={`/${lang}/about`} className="transition hover:text-emerald-600 dark:hover:text-emerald-400">
            {dict.nav.contact}
          </Link>
          <span className="text-zinc-300 dark:text-zinc-700">|</span>
          <span>{dict.footer.builtWith}</span>
        </div>
      </div>
    </footer>
  );
}

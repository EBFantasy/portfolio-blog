import Link from "next/link";
import type { Dict, Locale } from "@/lib/i18n";

export default function Footer({ lang, dict }: { lang: Locale; dict: Dict }) {
  return (
    <footer className="mt-20 border-t border-zinc-200/80 bg-white/40 dark:border-zinc-800/80 dark:bg-zinc-950/40">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 py-8 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-8 dark:text-zinc-400">
        <p>
          © {new Date().getFullYear()} {dict.siteName}. {dict.footer.rights}
        </p>
        <div className="flex items-center gap-5">
          <Link
            href={`/${lang}/about#contact`}
            className="rounded-md transition-colors hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70 focus-visible:ring-offset-2 dark:hover:text-emerald-300 dark:ring-offset-zinc-950"
          >
            {dict.nav.contact}
          </Link>
          <a
            href="https://github.com/EBFantasy"
            target="_blank"
            rel="external noopener noreferrer"
            className="rounded-md transition-colors hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70 focus-visible:ring-offset-2 dark:hover:text-emerald-300 dark:ring-offset-zinc-950"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}

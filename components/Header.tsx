"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Dict, Locale } from "@/lib/i18n";
import ThemeToggle from "./ThemeToggle";
import LangSwitch from "./LangSwitch";

export default function Header({ lang, dict }: { lang: Locale; dict: Dict }) {
  const pathname = usePathname() || "";
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const links = [
    { href: `/${lang}`, label: dict.nav.home },
    { href: `/${lang}/work`, label: dict.nav.work },
    { href: `/${lang}/showcase`, label: dict.nav.showcase },
    { href: `/${lang}/services`, label: dict.nav.services },
    { href: `/${lang}/blog`, label: dict.nav.blog },
    { href: `/${lang}/about`, label: dict.nav.about },
  ];

  const isActive = (href: string) =>
    href === `/${lang}`
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`);
  const navigationLabel = lang === "zh" ? "主导航" : "Main navigation";
  const mobileNavigationLabel = lang === "zh" ? "移动导航" : "Mobile navigation";
  const menuLabel = open
    ? lang === "zh"
      ? "关闭菜单"
      : "Close menu"
    : lang === "zh"
      ? "打开菜单"
      : "Open menu";

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/85 shadow-[0_1px_12px_rgba(24,24,27,0.04)] backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-950/85 dark:shadow-[0_1px_16px_rgba(0,0,0,0.2)]">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link
          href={`/${lang}`}
          className="flex shrink-0 items-center gap-2.5 rounded-lg text-[15px] font-semibold tracking-tight text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70 focus-visible:ring-offset-2 dark:text-zinc-50 dark:ring-offset-zinc-950"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-300 via-emerald-500 to-emerald-700 text-[11px] font-bold text-white shadow-sm shadow-emerald-900/20 ring-1 ring-emerald-700/20 dark:ring-emerald-300/20">
            EB
          </span>
          <span>{dict.siteName}</span>
        </Link>

        <nav
          aria-label={navigationLabel}
          className="hidden items-center gap-0.5 lg:flex"
        >
          {links.map((l) => {
            const active = isActive(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-xl px-3 py-2 text-[13px] font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70 focus-visible:ring-offset-2 dark:ring-offset-zinc-950 ${
                  active
                    ? "bg-emerald-50 text-emerald-800 ring-1 ring-inset ring-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-200 dark:ring-emerald-800/70"
                    : "text-zinc-500 hover:bg-zinc-100/80 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800/70 dark:hover:text-zinc-100"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <LangSwitch lang={lang} label={dict.langToggle.label} />
          <ThemeToggle dict={dict.themeToggle} />
          <button
            type="button"
            aria-label={menuLabel}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen((value) => !value)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200/90 bg-white/70 text-zinc-600 shadow-sm transition-colors hover:border-emerald-300 hover:bg-emerald-50/70 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70 focus-visible:ring-offset-2 lg:hidden dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-300 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-300 dark:ring-offset-zinc-950"
          >
            <svg
              aria-hidden="true"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              {open ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-navigation"
          aria-label={mobileNavigationLabel}
          className="border-t border-zinc-200/80 bg-white/95 lg:hidden dark:border-zinc-800/80 dark:bg-zinc-950/95"
        >
          <div className="mx-auto grid w-full max-w-6xl gap-1 px-5 py-3 sm:px-8">
            {links.map((l) => {
              const active = isActive(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={`rounded-xl px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70 ${
                    active
                      ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-800/80 dark:hover:text-white"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}

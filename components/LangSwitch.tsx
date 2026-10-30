"use client";

import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";

export default function LangSwitch({ lang, label }: { lang: Locale; label: string }) {
  const pathname = usePathname() || `/${lang}`;

  function switchLang() {
    const target = lang === "zh" ? "en" : "zh";
    // 持久化语言选择：中间件按该 cookie 决定无前缀路径的去向
    document.cookie = `NEXT_LOCALE=${target}; path=/; max-age=31536000; samesite=lax`;
    const segments = pathname.split("/");
    segments[1] = target;
    window.location.href = segments.join("/") || `/${target}`;
  }

  return (
    <button
      type="button"
      onClick={switchLang}
      aria-label={label}
      title={label}
      className="flex h-9 items-center rounded-xl border border-zinc-200/90 bg-white/70 px-3 text-xs font-semibold text-zinc-600 shadow-sm transition-colors hover:border-emerald-300 hover:bg-emerald-50/70 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70 focus-visible:ring-offset-2 dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-300 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-300 dark:ring-offset-zinc-950"
    >
      {label}
    </button>
  );
}

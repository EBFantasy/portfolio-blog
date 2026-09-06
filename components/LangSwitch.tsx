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
      title={label}
      className="flex h-9 items-center rounded-lg border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-600 transition hover:border-emerald-300 hover:text-emerald-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-emerald-700 dark:hover:text-emerald-400"
    >
      {label}
    </button>
  );
}

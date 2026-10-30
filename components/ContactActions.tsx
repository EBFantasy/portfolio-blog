"use client";

import { useEffect, useRef, useState } from "react";
import { CONTACT } from "@/lib/contact";

type Channel = "wechat" | "qq" | "gmail";

async function copyText(value: string) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(value);
    return;
  }
  const input = document.createElement("textarea");
  input.value = value;
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.appendChild(input);
  input.select();
  document.execCommand("copy");
  input.remove();
}

export default function ContactActions({ lang }: { lang: "zh" | "en" }) {
  const en = lang === "en";
  const [copied, setCopied] = useState<Channel | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const handleCopy = async (channel: Channel, value: string) => {
    try {
      await copyText(value);
      setCopied(channel);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(null), 1800);
    } catch {
      setCopied(null);
    }
  };

  const rows: { key: Channel; label: string; value: string; href?: string }[] = [
    { key: "wechat", label: en ? "WeChat" : "微信", value: CONTACT.wechat },
    { key: "qq", label: en ? "Email · China" : "邮箱 · 国内", value: CONTACT.qqEmail, href: `mailto:${CONTACT.qqEmail}` },
    { key: "gmail", label: en ? "Email · International" : "邮箱 · 海外", value: CONTACT.gmailEmail, href: `mailto:${CONTACT.gmailEmail}` },
  ];

  return (
    <div className="w-full">
      <div className="grid gap-2.5">
        {rows.map((row) => (
          <div
            key={row.key}
            className="flex min-w-0 items-center gap-2 rounded-xl border border-zinc-200/90 bg-white px-3 py-2.5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900"
          >
            <div className="min-w-0 flex-1 text-left">
              <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
                {row.label}
              </span>
              {row.href ? (
                <a href={row.href} className="mt-0.5 block truncate text-sm font-medium text-zinc-800 underline-offset-4 hover:underline dark:text-zinc-100">
                  {row.value}
                </a>
              ) : (
                <span className="mt-0.5 block truncate text-sm font-medium text-zinc-800 dark:text-zinc-100">{row.value}</span>
              )}
            </div>
            <button
              type="button"
              onClick={() => handleCopy(row.key, row.value)}
              className="shrink-0 rounded-lg border border-zinc-200 px-2.5 py-1.5 text-xs font-medium text-zinc-600 transition hover:border-emerald-400 hover:text-emerald-700 active:scale-[0.97] dark:border-zinc-700 dark:text-zinc-300 dark:hover:text-emerald-300"
              aria-label={`${en ? "Copy" : "复制"}${row.label}`}
            >
              {copied === row.key ? (en ? "Copied" : "已复制") : (en ? "Copy" : "复制")}
            </button>
          </div>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {copied ? (en ? "Contact copied to clipboard." : "联系方式已复制到剪贴板。") : ""}
      </p>
    </div>
  );
}

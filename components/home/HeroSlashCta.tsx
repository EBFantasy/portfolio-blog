"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRightIcon } from "@/components/Icons";

/**
 * 首页主 CTA。悬停或聚焦时派发 hero:slash 事件，触发首页剑士挥刀，
 * 让"按钮"与"角色"产生真实互动，而不是各自动着。
 */
export default function HeroSlashCta({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  const fire = () => {
    window.dispatchEvent(new Event("hero:slash"));
  };
  return (
    <Link
      href={href}
      onPointerEnter={fire}
      onFocus={fire}
      className="group/cta relative inline-flex items-center gap-1.5 overflow-hidden rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-500"
    >
      {/* 悬停时自左向右扫过的高光，暗示"挥刀"方向 */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-full w-1/2 skew-x-[-18deg] bg-white/25 transition-none duration-500 ease-out group-hover/cta:left-[110%]"
      />
      <span className="relative">{children}</span>
      <span className="relative transition-transform duration-300 group-hover/cta:translate-x-1">
        <ArrowRightIcon />
      </span>
    </Link>
  );
}

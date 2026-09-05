import Link from "next/link";

/** Playground 页顶部的「返回案例详情」胶囊按钮：hover 箭头左移 + 品牌绿高亮 + 按压反馈 */
export default function BackToCase({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 hover:shadow-md active:translate-y-0 active:scale-95 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-emerald-500/60 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400"
    >
      <span
        className="inline-block transition-transform duration-200 group-hover:-translate-x-1"
        aria-hidden
      >
        ←
      </span>
      {label}
    </Link>
  );
}

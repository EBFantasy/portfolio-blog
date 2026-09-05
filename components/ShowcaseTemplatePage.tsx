import type { CSSProperties } from "react";
import BackToCase from "@/components/BackToCase";
import { showcaseUI, type Bi, type ShowcaseTemplate } from "@/lib/showcase";

type Lang = "zh" | "en";

/** 模板详情页：以模板自身主题色渲染的完整主页宣传页（装在圆角画框内）。
 *  纯静态展示，无客户端状态。三种类别各有一套 hero 版式。 */
export default function ShowcaseTemplatePage({
  template: t,
  lang,
  backHref,
  backLabel,
}: {
  template: ShowcaseTemplate;
  lang: Lang;
  backHref: string;
  backLabel: string;
}) {
  const T = lang === "en" ? "en" : "zh";
  const L = (b: Bi) => b[T];
  const vars = {
    "--sk-bg": t.theme.bg,
    "--sk-panel": t.theme.panel,
    "--sk-line": t.theme.line,
    "--sk-fg": t.theme.fg,
    "--sk-muted": t.theme.muted,
    "--sk-acc": t.theme.acc,
    "--sk-acc2": t.theme.acc2,
  } as CSSProperties;

  const navWords = lang === "zh" ? { stats: "数据", contact: "联系" } : { stats: "Metrics", contact: "Contact" };

  return (
    <div className="py-14">
      <BackToCase href={backHref} label={backLabel} />

      <div
        className="mt-6 overflow-hidden rounded-3xl border border-zinc-200 shadow-xl dark:border-zinc-800"
        style={vars}
      >
        {/* 模板自有导航栏 */}
        <header
          className="flex items-center justify-between border-b px-6 py-4 sm:px-10"
          style={{ borderColor: "var(--sk-line)", background: "var(--sk-bg)" }}
        >
          <div className="flex items-center gap-2.5">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-white"
              style={{ background: "var(--sk-acc)" }}
            >
              {L(t.name).slice(0, 1)}
            </span>
            <span className="text-sm font-semibold" style={{ color: "var(--sk-fg)" }}>
              {L(t.name)}
            </span>
          </div>
          <nav className="hidden items-center gap-6 text-xs sm:flex" style={{ color: "var(--sk-muted)" }}>
            <a href="#features" className="transition hover:opacity-70">{L(t.featuresTitle)}</a>
            <a href="#stats" className="transition hover:opacity-70">{navWords.stats}</a>
            <a href="#contact" className="transition hover:opacity-70">{navWords.contact}</a>
          </nav>
          <span
            className="hidden rounded-lg px-3.5 py-1.5 text-xs font-semibold text-white sm:inline-block"
            style={{ background: "var(--sk-acc)" }}
          >
            {L(t.ctaPrimary)}
          </span>
        </header>

        {/* hero：按类别切换版式 */}
        {t.category === "business" && <BusinessHero t={t} lang={lang} />}
        {t.category === "tech" && <TechHero t={t} lang={lang} />}
        {t.category === "game" && <GameHero t={t} lang={lang} />}

        {/* 数据带 */}
        <section
          id="stats"
          className="border-t px-6 py-10 sm:px-10"
          style={{ borderColor: "var(--sk-line)", background: "var(--sk-panel)" }}
        >
          <div className="grid grid-cols-3 gap-6 text-center">
            {t.stats.map((s) => (
              <div key={s.value}>
                <div className="text-2xl font-bold sm:text-3xl" style={{ color: "var(--sk-acc)" }}>
                  {s.value}
                </div>
                <div className="mt-1.5 text-xs sm:text-[13px]" style={{ color: "var(--sk-muted)" }}>
                  {L(s.label)}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 功能模块 */}
        <section id="features" className="px-6 py-12 sm:px-10" style={{ background: "var(--sk-bg)" }}>
          <h2 className="text-xl font-semibold sm:text-2xl" style={{ color: "var(--sk-fg)" }}>
            {L(t.featuresTitle)}
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {t.features.map((f) => (
              <div
                key={L(f.title)}
                className="rounded-2xl border p-5 transition hover:-translate-y-0.5"
                style={{ background: "var(--sk-panel)", borderColor: "var(--sk-line)" }}
              >
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-lg"
                  style={{ background: "color-mix(in srgb, var(--sk-acc) 16%, transparent)" }}
                >
                  {f.icon}
                </span>
                <div className="mt-3 text-sm font-semibold" style={{ color: "var(--sk-fg)" }}>
                  {L(f.title)}
                </div>
                <div className="mt-1.5 text-xs leading-relaxed" style={{ color: "var(--sk-muted)" }}>
                  {L(f.desc)}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 用户评价 */}
        <section
          className="px-6 py-12 text-center sm:px-10"
          style={{ background: "var(--sk-panel)", borderTop: "1px solid var(--sk-line)" }}
        >
          <div className="mx-auto max-w-2xl">
            <div className="text-4xl leading-none" style={{ color: "var(--sk-acc)" }} aria-hidden>
              &ldquo;
            </div>
            <p className="mt-2 text-base leading-relaxed sm:text-lg" style={{ color: "var(--sk-fg)" }}>
              {L(t.quote.text)}
            </p>
            <div className="mt-4 text-xs" style={{ color: "var(--sk-muted)" }}>
              —— {L(t.quote.author)}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section
          id="contact"
          className="relative overflow-hidden px-6 py-14 text-center sm:px-10"
          style={{ background: t.theme.heroGrad }}
        >
          <h2 className="text-2xl font-bold text-white sm:text-3xl">{L(t.ctaTitle)}</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/75">{L(t.ctaDesc)}</p>
          <button
            type="button"
            className="mt-7 rounded-xl bg-white px-7 py-3 text-sm font-semibold text-zinc-900 shadow-lg transition hover:scale-[1.03] active:scale-[0.98]"
          >
            {L(t.ctaPrimary)}
          </button>
        </section>

        {/* 模板自有页脚 */}
        <footer
          className="flex flex-col items-center justify-between gap-2 border-t px-6 py-6 text-xs sm:flex-row sm:px-10"
          style={{ borderColor: "var(--sk-line)", background: "var(--sk-bg)", color: "var(--sk-muted)" }}
        >
          <span>© 2026 {L(t.name)} · Template demo</span>
          <span>{L(showcaseUI.note)}</span>
        </footer>
      </div>
    </div>
  );
}

/* ---------------- 商务：分栏 hero + 咨询报告卡 ---------------- */
function BusinessHero({ t, lang }: { t: ShowcaseTemplate; lang: Lang }) {
  const T = lang === "en" ? "en" : "zh";
  const L = (b: Bi) => b[T];
  const bars: [string, number][] = [
    [lang === "zh" ? "市场" : "Market", 82],
    [lang === "zh" ? "运营" : "Ops", 64],
    [lang === "zh" ? "财务" : "Finance", 91],
    [lang === "zh" ? "组织" : "Talent", 73],
  ];
  return (
    <div className="grid gap-10 px-6 py-12 sm:px-10 lg:grid-cols-[1.05fr_1fr] lg:py-16" style={{ background: "var(--sk-bg)" }}>
      <div>
        <span
          className="inline-block rounded-full border px-3 py-1 text-[11px] font-medium"
          style={{ borderColor: "var(--sk-line)", color: "var(--sk-acc)", background: "var(--sk-panel)" }}
        >
          {L(t.badge)}
        </span>
        <h1
          className="mt-5 text-3xl font-semibold leading-tight sm:text-4xl"
          style={{ color: "var(--sk-fg)", fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          {L(t.headline)}
        </h1>
        <p className="mt-4 max-w-lg text-sm leading-relaxed sm:text-[15px]" style={{ color: "var(--sk-muted)" }}>
          {L(t.sub)}
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <span
            className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-md"
            style={{ background: "var(--sk-acc)" }}
          >
            {L(t.ctaPrimary)}
          </span>
          <span
            className="rounded-xl border px-5 py-2.5 text-sm font-medium"
            style={{ borderColor: "var(--sk-line)", color: "var(--sk-fg)", background: "var(--sk-panel)" }}
          >
            {L(t.ctaSecondary)}
          </span>
        </div>
      </div>

      {/* 报告卡 */}
      <div className="relative hidden lg:block">
        <div
          className="absolute inset-0 rounded-2xl border p-5 shadow-2xl"
          style={{ background: "var(--sk-panel)", borderColor: "var(--sk-line)" }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold tracking-widest" style={{ color: "var(--sk-muted)" }}>
              Q3 STRATEGY REPORT
            </span>
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
              style={{ background: "var(--sk-acc)" }}
            >
              +24%
            </span>
          </div>
          <div className="mt-5 space-y-4">
            {bars.map(([label, pct]) => (
              <div key={label}>
                <div className="flex items-center justify-between text-[11px]" style={{ color: "var(--sk-muted)" }}>
                  <span>{label}</span>
                  <span className="font-semibold" style={{ color: "var(--sk-fg)" }}>{pct}%</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full" style={{ background: "var(--sk-line)" }}>
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "var(--sk-acc)" }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {[
              [lang === "zh" ? "交付周期" : "Delivery", "-38%"],
              [lang === "zh" ? "决策效率" : "Decisions", "2.4×"],
            ].map(([label, v]) => (
              <div
                key={label}
                className="rounded-xl px-3.5 py-3"
                style={{ background: "var(--sk-bg)", border: "1px solid var(--sk-line)" }}
              >
                <div className="text-lg font-bold" style={{ color: "var(--sk-acc2)" }}>{v}</div>
                <div className="text-[11px]" style={{ color: "var(--sk-muted)" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- 科技：居中 hero + 终端窗口 ---------------- */
function TechHero({ t, lang }: { t: ShowcaseTemplate; lang: Lang }) {
  const T = lang === "en" ? "en" : "zh";
  const L = (b: Bi) => b[T];
  const lines: { prompt?: boolean; ok?: boolean; arrow?: boolean; text: string }[] = [
    { prompt: true, text: "nexus connect --all --sync realtime" },
    { ok: true, text: "✓ 42 sources linked · latency 240ms" },
    { ok: true, text: "✓ funnel_2026Q3 · conversion +11% wk/wk" },
    { prompt: true, text: 'ask "why did retention dip this week?"' },
    { arrow: true, text: "→ top hypothesis: new-channel traffic quality (87%)" },
  ];
  return (
    <div className="px-6 py-14 text-center sm:px-10" style={{ background: "var(--sk-bg)" }}>
      <span
        className="inline-block rounded-full border px-3 py-1 text-[11px] font-medium"
        style={{ borderColor: "var(--sk-line)", color: "var(--sk-acc)", background: "var(--sk-panel)" }}
      >
        {L(t.badge)}
      </span>
      <h1 className="mx-auto mt-5 max-w-2xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl" style={{ color: "var(--sk-fg)" }}>
        {L(t.headline)}
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed sm:text-[15px]" style={{ color: "var(--sk-muted)" }}>
        {L(t.sub)}
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <span
          className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-md"
          style={{ background: "var(--sk-acc)" }}
        >
          {L(t.ctaPrimary)}
        </span>
        <span
          className="rounded-xl border px-5 py-2.5 text-sm font-medium"
          style={{ borderColor: "var(--sk-line)", color: "var(--sk-fg)", background: "var(--sk-panel)" }}
        >
          {L(t.ctaSecondary)}
        </span>
      </div>

      {/* 终端窗口 */}
      <div
        className="mx-auto mt-10 max-w-2xl overflow-hidden rounded-2xl border text-left shadow-2xl"
        style={{ background: "var(--sk-panel)", borderColor: "var(--sk-line)" }}
      >
        <div
          className="flex items-center gap-1.5 border-b px-4 py-2.5"
          style={{ borderColor: "var(--sk-line)" }}
        >
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--sk-line)" }} />
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--sk-line)" }} />
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--sk-acc)" }} />
          <span className="ml-2 font-mono text-[10px]" style={{ color: "var(--sk-muted)" }}>
            nexus — zsh
          </span>
        </div>
        <div className="px-5 py-4 font-mono text-[11px] leading-6 sm:text-xs">
          {lines.map((l, i) => (
            <div key={i} className="flex gap-2">
              {l.prompt && <span style={{ color: "var(--sk-acc)" }}>$</span>}
              {l.ok && <span style={{ color: "var(--sk-acc2)" }}>✓</span>}
              {l.arrow && <span style={{ color: "var(--sk-acc2)" }}>→</span>}
              <span style={{ color: l.prompt ? "var(--sk-fg)" : "var(--sk-muted)" }}>{l.text}</span>
            </div>
          ))}
          <div className="flex gap-2">
            <span style={{ color: "var(--sk-acc)" }}>$</span>
            <span className="inline-block h-3.5 w-1.5 animate-pulse" style={{ background: "var(--sk-acc)" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- 游戏：全幅渐变 hero + 键艺面板 ---------------- */
function GameHero({ t, lang }: { t: ShowcaseTemplate; lang: Lang }) {
  const T = lang === "en" ? "en" : "zh";
  const L = (b: Bi) => b[T];
  const platforms = ["PC", "PS5", "XBOX", "NS", "iOS", "Android"];
  return (
    <div className="relative overflow-hidden px-6 py-16 text-center sm:px-10" style={{ background: t.theme.heroGrad }}>
      {/* 平台徽章 */}
      <div className="flex flex-wrap justify-center gap-2">
        {platforms.map((p) => (
          <span
            key={p}
            className="rounded-md border border-white/25 bg-white/10 px-2.5 py-1 text-[10px] font-semibold text-white/90 backdrop-blur"
          >
            {p}
          </span>
        ))}
      </div>

      <span className="mt-6 inline-block rounded-full bg-white/15 px-3 py-1 text-[11px] font-medium text-white backdrop-blur">
        {L(t.badge)}
      </span>
      <h1 className="mx-auto mt-5 max-w-2xl text-3xl font-black leading-tight tracking-tight text-white drop-shadow-lg sm:text-5xl">
        {L(t.headline)}
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/80 sm:text-[15px]">{L(t.sub)}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <span className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-zinc-900 shadow-xl transition hover:scale-[1.03]">
          {L(t.ctaPrimary)}
        </span>
        <span className="rounded-xl border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
          {L(t.ctaSecondary)}
        </span>
      </div>

      {/* 发光标志 */}
      <div className="relative mx-auto mt-12 h-36 w-36">
        <span
          className="absolute inset-0 rounded-full opacity-60 blur-2xl"
          style={{ background: "var(--sk-acc)" }}
        />
        <span
          className="absolute inset-2 flex items-center justify-center rounded-full border-2 bg-white/5 text-5xl backdrop-blur"
          style={{ borderColor: "var(--sk-acc2)" }}
        >
          {t.features[0].icon}
        </span>
      </div>
    </div>
  );
}

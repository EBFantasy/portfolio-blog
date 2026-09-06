"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import BackToCase from "@/components/BackToCase";
import { CountUp, Reveal, useInView } from "@/components/showcase/reveal";

type Lang = "zh" | "en";
type Bi = { zh: string; en: string };
const L = (b: Bi, lang: Lang) => b[lang === "en" ? "en" : "zh"];

const vars = {
  "--pl-bg": "#060B14",
  "--pl-panel": "#0D1524",
  "--pl-line": "#1B2942",
  "--pl-fg": "#E2EDF8",
  "--pl-muted": "#7E8CA5",
  "--pl-acc": "#38BDF8",
  "--pl-acc2": "#34D399",
  "--pl-warn": "#FB7185",
} as CSSProperties;

const MONO = { fontFamily: "ui-monospace, 'Cascadia Code', 'JetBrains Mono', Consolas, monospace" };

export default function PulseAnalytics({ lang, backHref, backLabel }: { lang: Lang; backHref: string; backLabel: string }) {
  return (
    <div className="py-14">
      <BackToCase href={backHref} label={backLabel} />
      <style>{`
        @keyframes pl-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes pl-blink { 0%, 55% { opacity: 1; } 56%, 100% { opacity: 0; } }
        @keyframes pl-fadeup { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
        @keyframes pl-cell { from { opacity: 0; transform: scale(.92); } to { opacity: 1; transform: none; } }
        @keyframes pl-flow { from { stroke-dashoffset: 28; } to { stroke-dashoffset: 0; } }
      `}</style>
      <div
        className="mt-6 overflow-hidden rounded-3xl border border-zinc-200 shadow-xl dark:border-zinc-800"
        style={vars}
      >
        <SiteNav lang={lang} />
        <Hero lang={lang} />
        <Metrics lang={lang} />
        <Dashboard lang={lang} />
        <CodeSection lang={lang} />
        <ReplayDemo lang={lang} />
        <Features lang={lang} />
        <Compliance lang={lang} />
        <Quote lang={lang} />
        <Cta lang={lang} />
        <Footer lang={lang} />
      </div>
    </div>
  );
}

/* ================= 交互背景：声呐脉冲（点击触发涟漪） ================= */
function Sonar() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = ref.current;
    const parent = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !parent || !ctx) return;
    const DPR = Math.min(2, window.devicePixelRatio || 1);
    let w = 0, h = 0, raf = 0;
    type P = { x: number; y: number; vx: number; vy: number; t: number };
    type Ring = { x: number; y: number; r: number; a: number; c: string };
    let pts: P[] = [];
    let rings: Ring[] = [];
    const seed = () => {
      const n = Math.max(24, Math.min(56, Math.floor(w / 22)));
      pts = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        t: Math.random() * 300,
      }));
    };
    const resize = () => {
      const r = parent.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * DPR; canvas.height = h * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      seed();
    };
    resize();
    window.addEventListener("resize", resize);
    const click = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      rings.push({ x: e.clientX - r.left, y: e.clientY - r.top, r: 4, a: 0.75, c: "56,189,248" });
    };
    parent.addEventListener("click", click);
    const step = () => {
      ctx.clearRect(0, 0, w, h);
      // 网格
      ctx.strokeStyle = "rgba(27,41,66,0.55)";
      ctx.lineWidth = 1;
      const g = 56;
      for (let x = (w % g) / 2; x < w; x += g) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
      for (let y = (h % g) / 2; y < h; y += g) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
      // 粒子
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        p.t += 1;
        ctx.fillStyle = "rgba(56,189,248,0.7)";
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2); ctx.fill();
        if (p.t % 240 === 0 && rings.length < 14) {
          rings.push({ x: p.x, y: p.y, r: 3, a: 0.5, c: p.t % 480 === 0 ? "52,211,153" : "56,189,248" });
        }
      }
      // 涟漪
      rings = rings.filter((r) => r.a > 0.01);
      for (const r of rings) {
        r.r += 1.1; r.a *= 0.985;
        ctx.strokeStyle = `rgba(${r.c},${r.a})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2); ctx.stroke();
      }
      raf = requestAnimationFrame(step);
    };
    step();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      parent.removeEventListener("click", click);
    };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden />;
}

/* ================= 导航 ================= */
function SiteNav({ lang }: { lang: Lang }) {
  const items: [Bi, string][] = [
    [{ zh: "产品演示", en: "Product" }, "#pl-dash"],
    [{ zh: "快速接入", en: "Install" }, "#pl-code"],
    [{ zh: "会话回放", en: "Replay" }, "#pl-replay"],
    [{ zh: "功能", en: "Features" }, "#pl-features"],
    [{ zh: "安全合规", en: "Security" }, "#pl-sec"],
  ];
  return (
    <header
      className="relative z-20 flex items-center justify-between border-b px-6 py-4 backdrop-blur sm:px-10"
      style={{ borderColor: "var(--pl-line)", background: "rgba(6,11,20,0.7)" }}
    >
      <div className="flex items-center gap-2.5">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white"
          style={{ background: "linear-gradient(135deg,var(--pl-acc),#0369A1)" }}
        >
          P
        </span>
        <span className="text-sm font-semibold tracking-wide" style={{ color: "var(--pl-fg)" }}>
          Pulse Analytics
        </span>
      </div>
      <nav className="hidden items-center gap-6 text-xs lg:flex" style={{ color: "var(--pl-muted)" }}>
        {items.map(([label, href]) => (
          <a key={href} href={href} className="transition hover:opacity-60">{L(label, lang)}</a>
        ))}
      </nav>
      <a
        href="#pl-cta"
        className="rounded-lg px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90"
        style={{ background: "var(--pl-acc)" }}
      >
        {L({ zh: "立即接入", en: "Get started" }, lang)}
      </a>
    </header>
  );
}

/* ================= Hero ================= */
function Hero({ lang }: { lang: Lang }) {
  return (
    <section className="relative overflow-hidden" style={{ background: "radial-gradient(130% 130% at 78% 0%, rgba(14,165,233,0.4) 0%, rgba(12,74,110,0.22) 40%, var(--pl-bg) 78%)" }}>
      <Sonar />
      <div className="relative z-10 px-6 py-16 text-center sm:px-10 lg:py-20">
        <Reveal>
          <span
            className="inline-block rounded-full border px-3.5 py-1.5 text-[11px] font-medium tracking-wide"
            style={{ borderColor: "rgba(56,189,248,0.5)", color: "var(--pl-acc)", background: "rgba(56,189,248,0.08)" }}
          >
            {L({ zh: "精品科技模板 · 用户行为分析", en: "Tech Template · Product Analytics" }, lang)}
          </span>
        </Reveal>
        <Reveal delay={120}>
          <h1 className="mx-auto mt-6 max-w-2xl text-3xl font-semibold leading-[1.25] sm:text-4xl lg:text-[2.7rem]" style={{ color: "var(--pl-fg)" }}>
            {L({ zh: "看清用户每一步，增长有迹可循", en: "See every step of your funnel" }, lang)}
          </h1>
        </Reveal>
        <Reveal delay={240}>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed sm:text-[15px]" style={{ color: "var(--pl-muted)" }}>
            {L(
              {
                zh: "5 分钟完成接入，漏斗、留存、路径与实验一站搞定。点击下方背景任意位置，感受 Pulse 的脉搏。",
                en: "Integrate in 5 minutes. Funnels, retention, paths and experiments in one place. Click anywhere below to feel the pulse.",
              },
              lang
            )}
          </p>
        </Reveal>
        <Reveal delay={360}>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="#pl-dash"
              className="rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.03] active:scale-[0.98]"
              style={{ background: "linear-gradient(135deg,var(--pl-acc),#0284C7)" }}
            >
              {L({ zh: "看产品演示", en: "See it in action" }, lang)}
            </a>
            <a
              href="#pl-code"
              className="rounded-xl border px-6 py-3 text-sm font-medium transition hover:bg-white/5"
              style={{ borderColor: "var(--pl-line)", color: "var(--pl-fg)", background: "rgba(13,21,36,0.6)" }}
            >
              {L({ zh: "5 分钟接入", en: "Integrate in 5 min" }, lang)}
            </a>
          </div>
        </Reveal>
        <Reveal delay={440}>
          <p className="mt-6 text-[11px]" style={{ color: "var(--pl-muted)" }}>
            {L({ zh: "免费版支持每月 100 万事件 · 小型团队永久可用", en: "Free tier: 1M events/month, free forever for small teams" }, lang)}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ================= 指标带 ================= */
function Metrics({ lang }: { lang: Lang }) {
  const stats = [
    { to: 5, suffix: " min", label: { zh: "平均接入耗时", en: "Time to integrate" } },
    { to: 40, suffix: "+", label: { zh: "内置分析模型", en: "Analysis models" } },
    { to: 1, decimals: 1, suffix: "B+", label: { zh: "日事件处理量", en: "Daily events" } },
    { to: 300, prefix: "", suffix: "ms", label: { zh: "查询中位延迟", en: "Median query latency" } },
  ];
  return (
    <section className="border-t px-6 py-12 sm:px-10" style={{ borderColor: "var(--pl-line)", background: "var(--pl-panel)" }}>
      <div className="grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label.en} delay={i * 110}>
            <div className="text-3xl font-bold sm:text-4xl" style={{ color: "var(--pl-acc)" }}>
              <CountUp to={s.to} decimals={s.decimals ?? 0} prefix={s.prefix} suffix={s.suffix} />
            </div>
            <div className="mt-2 text-xs sm:text-[13px]" style={{ color: "var(--pl-muted)" }}>{L(s.label, lang)}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ================= 仪表盘 mockup：四标签页 ================= */
function Dashboard({ lang }: { lang: Lang }) {
  const tabs: { id: string; label: Bi }[] = [
    { id: "funnel", label: { zh: "漏斗", en: "Funnel" } },
    { id: "retain", label: { zh: "留存", en: "Retention" } },
    { id: "paths", label: { zh: "路径", en: "Paths" } },
    { id: "ab", label: { zh: "实验", en: "Experiments" } },
  ];
  const [tab, setTab] = useState(0);
  return (
    <section id="pl-dash" className="border-t px-6 py-16 sm:px-10" style={{ borderColor: "var(--pl-line)", background: "var(--pl-bg)" }}>
      <Reveal>
        <SectionHead
          lang={lang}
          eyebrow={{ zh: "产品演示 · THE PRODUCT", en: "THE PRODUCT" }}
          title={{ zh: "四个视图，回答产品的一切为什么", en: "Four views that answer every why" }}
          desc={{ zh: "下面是一个可交互的产品演示：切换标签、点击漏斗的任意一步，看看 Pulse 如何解释流失。", en: "This demo is interactive: switch tabs, click any funnel step to see how Pulse explains drop-offs." }}
        />
      </Reveal>
      <Reveal delay={160}>
        <div className="mt-9 overflow-hidden rounded-2xl border shadow-2xl" style={{ borderColor: "var(--pl-line)", background: "var(--pl-panel)" }}>
          {/* 窗口栏 + 侧边 */}
          <div className="flex items-center gap-1.5 border-b px-4 py-2.5" style={{ borderColor: "var(--pl-line)" }}>
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#22314F" }} />
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#22314F" }} />
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--pl-acc)" }} />
            <span className="ml-2 text-[10px]" style={{ color: "var(--pl-muted)", ...MONO }}>pulse — growth workspace</span>
          </div>
          <div className="flex">
            <div className="hidden w-12 flex-col items-center gap-4 border-r py-4 sm:flex" style={{ borderColor: "var(--pl-line)" }}>
              {["◈", "▤", "◉", "⇄", "⚙"].map((ic, i) => (
                <span key={i} className="text-sm" style={{ color: i === 1 ? "var(--pl-acc)" : "var(--pl-muted)" }}>{ic}</span>
              ))}
            </div>
            <div className="min-w-0 flex-1">
              {/* 标签页 */}
              <div className="flex gap-1 border-b px-3 pt-2.5" style={{ borderColor: "var(--pl-line)" }}>
                {tabs.map((t, i) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTab(i)}
                    className="rounded-t-lg px-4 py-2 text-xs font-medium transition"
                    style={
                      i === tab
                        ? { color: "var(--pl-acc)", background: "rgba(56,189,248,0.1)", borderTop: "2px solid var(--pl-acc)" }
                        : { color: "var(--pl-muted)", borderTop: "2px solid transparent" }
                    }
                  >
                    {L(t.label, lang)}
                  </button>
                ))}
              </div>
              <div className="p-5 sm:p-6">
                {tab === 0 && <FunnelPanel lang={lang} />}
                {tab === 1 && <RetainPanel lang={lang} />}
                {tab === 2 && <PathsPanel lang={lang} />}
                {tab === 3 && <AbPanel lang={lang} />}
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ---- 漏斗：点击步进解释流失 ---- */
function FunnelPanel({ lang }: { lang: Lang }) {
  const steps: { name: Bi; pct: number; note: Bi }[] = [
    { name: { zh: "访问首页", en: "Visit home" }, pct: 100, note: { zh: "基线步骤，来源以自然流量为主。", en: "Baseline step, mostly organic traffic." } },
    { name: { zh: "查看定价", en: "View pricing" }, pct: 46, note: { zh: "流失 54%：多数在首屏直接跳出，建议加价值锚点。", en: "54% leave: most bounce above the fold — add a value anchor." } },
    { name: { zh: "注册试用", en: "Sign up" }, pct: 28, note: { zh: "流失 39%：注册表单第三步（公司规模）放弃率最高。", en: "39% leave: the 'company size' field has the highest abandonment." } },
    { name: { zh: "完成激活", en: "Activate" }, pct: 17, note: { zh: "流失 39%：卡在创建第一个项目，回放 #8412 可复现。", en: "39% stuck creating their first project — see replay #8412." } },
    { name: { zh: "转付费", en: "Convert" }, pct: 9, note: { zh: "激活用户转化率健康（53%），瓶颈在前面两步。", en: "Activated users convert well (53%) — the leak is earlier." } },
  ];
  const [sel, setSel] = useState(2);
  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <div className="space-y-3">
        {steps.map((s, i) => (
          <button
            key={s.name.en}
            type="button"
            onClick={() => setSel(i)}
            className="block w-full text-left"
          >
            <div className="flex items-center justify-between text-[11px]" style={{ color: "var(--pl-muted)" }}>
              <span style={{ color: i === sel ? "var(--pl-acc)" : undefined, fontWeight: i === sel ? 600 : 400 }}>{L(s.name, lang)}</span>
              <span>{s.pct}%</span>
            </div>
            <div className="mt-1 h-6 overflow-hidden rounded-md" style={{ background: "rgba(27,41,66,0.6)" }}>
              <div
                className="h-full rounded-md transition-all duration-700"
                style={{
                  width: `${s.pct}%`,
                  transitionDelay: `${i * 100}ms`,
                  background: i === sel
                    ? "linear-gradient(90deg,var(--pl-acc),rgba(56,189,248,0.45))"
                    : "linear-gradient(90deg,rgba(56,189,248,0.55),rgba(56,189,248,0.18))",
                  boxShadow: i === sel ? "0 0 14px rgba(56,189,248,0.35)" : "none",
                }}
              />
            </div>
          </button>
        ))}
      </div>
      <div
        key={sel}
        className="h-fit rounded-xl border p-4"
        style={{ borderColor: "var(--pl-line)", background: "rgba(6,11,20,0.6)", animation: "pl-fadeup .4s ease both" }}
      >
        <div className="text-[10px] font-bold tracking-widest" style={{ color: "var(--pl-acc)" }}>
          {L({ zh: `第 ${sel + 1} 步 · ${steps[sel].pct}%`, en: `STEP ${sel + 1} · ${steps[sel].pct}%` }, lang)}
        </div>
        <div className="mt-2 text-[13px] font-semibold" style={{ color: "var(--pl-fg)" }}>{L(steps[sel].name, lang)}</div>
        <p className="mt-2 text-xs leading-relaxed" style={{ color: "var(--pl-muted)" }}>{L(steps[sel].note, lang)}</p>
        <div className="mt-3 inline-block rounded-md px-2.5 py-1 text-[10px] font-semibold" style={{ background: "rgba(52,211,153,0.12)", color: "var(--pl-acc2)" }}>
          {L({ zh: "AI 归因 · 已生成修复建议", en: "AI attribution · fix suggested" }, lang)}
        </div>
      </div>
    </div>
  );
}

/* ---- 留存：群组热力格 ---- */
function RetainPanel({ lang }: { lang: Lang }) {
  const cols = ["D0", "D1", "D3", "D7", "D14", "D30"];
  const rows: number[][] = [
    [100, 64, 52, 41, 33, 28],
    [100, 61, 48, 38, 29],
    [100, 66, 55, 44, 36],
    [100, 63, 50, 40],
    [100, 70, 58],
    [100, 67],
    [100],
  ];
  const rowNames = lang === "zh"
    ? ["第1周", "第2周", "第3周", "第4周", "第5周", "第6周", "第7周"]
    : ["W1", "W2", "W3", "W4", "W5", "W6", "W7"];
  return (
    <div>
      <div className="grid gap-1" style={{ gridTemplateColumns: `64px repeat(${cols.length}, 1fr)` }}>
        <div />
        {cols.map((c) => (
          <div key={c} className="text-center text-[10px]" style={{ color: "var(--pl-muted)" }}>{c}</div>
        ))}
        {rows.map((r, ri) => (
          <div key={ri} className="contents">
            <div className="flex items-center text-[10px]" style={{ color: "var(--pl-muted)" }}>{rowNames[ri]}</div>
            {cols.map((_, ci) => {
              if (ci >= r.length) return <div key={ci} />;
              const v = r[ci];
              return (
                <div
                  key={ci}
                  className="flex aspect-square items-center justify-center rounded text-[10px] font-semibold"
                  style={{
                    background: `rgba(56,189,248,${0.07 + (v / 100) * 0.62})`,
                    color: v > 55 ? "#04121F" : "var(--pl-fg)",
                    animation: `pl-cell .5s ease ${(ri * cols.length + ci) * 22}ms both`,
                  }}
                >
                  {v}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <p className="mt-4 text-[11px]" style={{ color: "var(--pl-muted)" }}>
        {L(
          { zh: "第 5 周群组留存最好（D3 = 58%）——当周上线的新手引导流程生效了。", en: "Week-5 cohort retains best (D3 = 58%) — the new onboarding shipped that week is working." },
          lang
        )}
      </p>
    </div>
  );
}

/* ---- 路径：流动虚线桑基 ---- */
function PathsPanel({ lang }: { lang: Lang }) {
  const node = (x: number, y: number, name: Bi, count: string, hot: boolean) => (
    <g key={`${x}-${y}`}>
      <rect x={x} y={y} width="132" height="40" rx="9" fill={hot ? "rgba(56,189,248,0.14)" : "rgba(27,41,66,0.7)"} stroke={hot ? "rgba(56,189,248,0.6)" : "#1B2942"} />
      <text x={x + 12} y={y + 17} fontSize="10.5" fill="#E2EDF8">{L(name, lang)}</text>
      <text x={x + 12} y={y + 31} fontSize="9" fill="#7E8CA5" fontFamily="ui-monospace, monospace">{count}</text>
    </g>
  );
  const edge = (d: string, c: string, width: number) => (
    <path d={d} fill="none" stroke={c} strokeWidth={width} strokeLinecap="round" strokeDasharray="8 6" opacity="0.65" style={{ animation: "pl-flow 1.1s linear infinite" }} />
  );
  return (
    <div>
      <svg viewBox="0 0 720 260" className="block w-full">
        {edge("M172 130 C 215 130, 220 70, 258 70", "56,189,248", 9)}
        {edge("M172 130 C 215 130, 220 190, 258 190", "56,189,248", 4)}
        {edge("M390 70 C 430 70, 436 50, 472 50", "56,189,248", 7)}
        {edge("M390 70 C 430 70, 436 130, 472 130", "56,189,248", 3)}
        {edge("M390 190 C 430 190, 436 210, 472 210", "251,113,133", 8)}
        {edge("M604 50 C 640 50, 644 50, 668 50", "52,211,153", 6)}
        {edge("M604 210 C 640 210, 644 210, 668 210", "251,113,133", 6)}
        {node(30, 110, { zh: "开始访问", en: "Session start" }, "248k", true)}
        {node(258, 50, { zh: "商品详情", en: "Product page" }, "142k", true)}
        {node(258, 170, { zh: "分类浏览", en: "Browse categories" }, "71k", false)}
        {node(472, 30, { zh: "加入购物车", en: "Add to cart" }, "63k", true)}
        {node(472, 110, { zh: "收藏", en: "Wishlist" }, "32k", false)}
        {node(472, 190, { zh: "直接离开", en: "Exit" }, "118k", false)}
        {node(668, 30, { zh: "完成支付", en: "Checkout" }, "29k", true)}
        <text x="668" y="225" fontSize="9" fill="#FB7185">{L({ zh: "支付页流失 54%", en: "54% drop at checkout" }, lang)}</text>
      </svg>
      <p className="mt-3 text-[11px]" style={{ color: "var(--pl-muted)" }}>
        {L(
          { zh: "线的粗细 = 流量大小，虚线流动方向 = 用户走向。最大的单点流失在「直接离开」。", en: "Line weight = volume; flowing dashes = direction. The biggest leak is the direct-exit node." },
          lang
        )}
      </p>
    </div>
  );
}

/* ---- 实验：A/B 对比 ---- */
function AbPanel({ lang }: { lang: Lang }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.4);
  return (
    <div ref={ref}>
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { name: { zh: "方案 A · 对照组", en: "Variant A · control" }, v: 12.4, win: false, c: "56,189,248" },
          { name: { zh: "方案 B · 新引导流", en: "Variant B · new onboarding" }, v: 14.1, win: true, c: "52,211,153" },
        ].map((x, i) => (
          <div key={i} className="rounded-xl border p-4" style={{ borderColor: x.win ? "rgba(52,211,153,0.5)" : "var(--pl-line)", background: "rgba(6,11,20,0.6)" }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold" style={{ color: "var(--pl-fg)" }}>{L(x.name, lang)}</span>
              {x.win && (
                <span className="rounded-full px-2.5 py-0.5 text-[10px] font-bold text-white" style={{ background: "var(--pl-acc2)" }}>
                  {L({ zh: "胜出", en: "WINNER" }, lang)}
                </span>
              )}
            </div>
            <div className="mt-3 text-2xl font-bold" style={{ color: x.win ? "var(--pl-acc2)" : "var(--pl-acc)" }}>
              <CountUp to={x.v} decimals={1} suffix="%" duration={1300} />
            </div>
            <div className="mt-2 h-2.5 overflow-hidden rounded-full" style={{ background: "rgba(27,41,66,0.7)" }}>
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{ width: inView ? `${x.v * 5.5}%` : "4%", background: `rgba(${x.c},0.9)`, transitionDelay: `${i * 150}ms` }}
              />
            </div>
            <div className="mt-2 text-[10px]" style={{ color: "var(--pl-muted)" }}>n = {i === 0 ? "24,102" : "24,098"}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border px-4 py-3" style={{ borderColor: "var(--pl-line)", background: "rgba(6,11,20,0.6)" }}>
        <span className="text-xs" style={{ color: "var(--pl-muted)" }}>
          {L({ zh: "相对提升", en: "Relative uplift" }, lang)}{" "}
          <b style={{ color: "var(--pl-acc2)" }}><CountUp to={13.7} decimals={1} prefix="+" suffix="%" duration={1500} /></b>
        </span>
        <span className="text-xs" style={{ color: "var(--pl-muted)" }}>
          {L({ zh: "统计置信度", en: "Confidence" }, lang)}{" "}
          <b style={{ color: "var(--pl-fg)" }}><CountUp to={97.2} decimals={1} suffix="%" duration={1500} /></b>
        </span>
        <span className="ml-auto text-[11px] font-semibold" style={{ color: "var(--pl-acc2)" }}>
          {L({ zh: "建议：全量发布方案 B →", en: "Recommendation: ship variant B →" }, lang)}
        </span>
      </div>
    </div>
  );
}

/* ================= 快速接入：逐字代码 ================= */
const CODE_LINES = [
  "$ npm i @pulse/sdk",
  'import { pulse } from "@pulse/sdk";',
  'pulse.init({ key: "pk_live_demo" });',
  'pulse.track("checkout_completed", { plan: "pro", sku: "88412" });',
];

function CodeSection({ lang }: { lang: Lang }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.4);
  const [n, setN] = useState(0);
  const total = CODE_LINES.reduce((a, l) => a + l.length + 6, 0);
  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => {
      setN((v) => {
        if (v >= total) { clearInterval(id); return v; }
        return v + 1;
      });
    }, 24);
    return () => clearInterval(id);
  }, [inView, total]);
  let remain = n;
  return (
    <section id="pl-code" className="border-t px-6 py-16 sm:px-10" style={{ borderColor: "var(--pl-line)", background: "var(--pl-panel)" }}>
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
        <Reveal>
          <SectionHead
            align="left"
            lang={lang}
            eyebrow={{ zh: "快速接入 · 5 MINUTES", en: "INSTALL IN 5 MINUTES" }}
            title={{ zh: "两行代码，从此所有行为有迹可循", en: "Two lines of code, every action tracked" }}
            desc={{ zh: "自动采集页面浏览与点击流，关键业务事件一行手动埋点；不需要等发版，改完即生效。", en: "Pageviews and clicks are auto-captured; ship one line for key events. No release required — changes apply instantly." }}
          />
          <ul className="mt-6 space-y-2.5">
            {[
              { zh: "Web / iOS / Android / 小程序 SDK 全覆盖", en: "Web, iOS, Android and mini-app SDKs" },
              { zh: "自动采集 + 自定义事件双通道", en: "Auto-capture plus custom events" },
              { zh: "字段变更实时生效，无需重新发版", en: "Schema changes apply instantly, no release" },
            ].map((x, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[13px]" style={{ color: "var(--pl-fg)" }}>
                <span style={{ color: "var(--pl-acc2)" }}>✓</span>
                {L(x, lang)}
              </li>
            ))}
          </ul>
        </Reveal>
        <div ref={ref}>
          <Reveal delay={150}>
            <div className="overflow-hidden rounded-2xl border shadow-2xl" style={{ borderColor: "var(--pl-line)", background: "rgba(6,11,20,0.85)" }}>
              <div className="flex items-center gap-1.5 border-b px-4 py-2.5" style={{ borderColor: "var(--pl-line)" }}>
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#22314F" }} />
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#22314F" }} />
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--pl-acc)" }} />
                <span className="ml-2 text-[10px]" style={{ color: "var(--pl-muted)", ...MONO }}>quickstart.ts</span>
                <button
                  type="button"
                  onClick={() => setN(0)}
                  className="ml-auto rounded-md border px-2 py-0.5 text-[10px] transition hover:bg-white/5"
                  style={{ borderColor: "var(--pl-line)", color: "var(--pl-muted)" }}
                >
                  {L({ zh: "重放", en: "Replay" }, lang)}
                </button>
              </div>
              <div className="min-h-[132px] px-5 py-4 text-[11px] leading-6 sm:text-xs" style={{ ...MONO }}>
                {CODE_LINES.map((line, i) => {
                  const cost = line.length + 6;
                  let shown = "";
                  if (remain > 0) {
                    shown = line.slice(0, remain);
                    remain -= cost;
                  }
                  const isCmd = i === 0;
                  const isLast = i === CODE_LINES.length - 1 && shown.length === line.length;
                  return (
                    <div key={i} className="flex gap-2 whitespace-pre-wrap">
                      {isCmd && <span className="shrink-0" style={{ color: "var(--pl-acc2)" }}>$</span>}
                      <span style={{ color: isCmd ? "var(--pl-muted)" : isLast ? "var(--pl-acc2)" : "var(--pl-fg)" }}>
                        {shown}
                        {shown.length < line.length && shown.length > 0 && (
                          <span className="inline-block h-3 w-1 align-middle" style={{ background: "var(--pl-acc)", animation: "pl-blink 1s steps(1) infinite" }} />
                        )}
                      </span>
                    </div>
                  );
                })}
                {n >= total && (
                  <div style={{ color: "var(--pl-acc2)", animation: "pl-fadeup .4s ease both" }}>
                    // ✓ {L({ zh: "事件已入库 · 延迟 380ms", en: "event ingested · latency 380ms" }, lang)}
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ================= 会话回放演示 ================= */
function ReplayDemo({ lang }: { lang: Lang }) {
  const waypoints = [
    { x: 22, y: 34 },
    { x: 62, y: 30 },
    { x: 62, y: 62 },
    { x: 62, y: 84 },
    { x: 62, y: 84 },
  ];
  const logs: { t: string; hot?: boolean }[] = [
    { t: "00:04  page_view  /home" },
    { t: "00:11  product_view  /sku-88412" },
    { t: "00:19  add_to_cart  { qty: 1 }" },
    { t: "00:26  checkout_started" },
    { t: "00:27  rage_click ×3  #pay-btn", hot: true },
  ];
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % (logs.length + 2)), 1150);
    return () => clearInterval(id);
  }, [logs.length]);
  const wp = waypoints[Math.min(step, waypoints.length - 1)];
  return (
    <section id="pl-replay" className="border-t px-6 py-16 sm:px-10" style={{ borderColor: "var(--pl-line)", background: "var(--pl-bg)" }}>
      <Reveal>
        <SectionHead
          lang={lang}
          eyebrow={{ zh: "会话回放 · SESSION REPLAY", en: "SESSION REPLAY" }}
          title={{ zh: "看得见的用户挫败感", en: "See frustration, not just numbers" }}
          desc={{ zh: "异常行为自动打标：怒点、死点击、往返抖动，回放里直接高亮——隐私字段全程自动脱敏。", en: "Pulse auto-flags rage clicks, dead clicks and thrashing, then highlights them in the replay — PII masked end to end." }}
        />
      </Reveal>
      <Reveal delay={160}>
        <div className="mx-auto mt-9 grid max-w-4xl gap-5 lg:grid-cols-[1.2fr_1fr]">
          {/* 模拟页面 + 光标 */}
          <div className="relative overflow-hidden rounded-2xl border" style={{ borderColor: "var(--pl-line)", background: "var(--pl-panel)" }}>
            <div className="flex items-center justify-between border-b px-4 py-2" style={{ borderColor: "var(--pl-line)" }}>
              <span className="text-[10px]" style={{ color: "var(--pl-muted)", ...MONO }}>Replay #8412 · 00:27 / 00:32</span>
              <span className="rounded-full px-2 py-0.5 text-[9px] font-bold text-white" style={{ background: "var(--pl-warn)" }}>
                {L({ zh: "怒点检测", en: "RAGE CLICK" }, lang)}
              </span>
            </div>
            <div className="relative h-64 p-4">
              <div className="mx-auto h-4 w-40 rounded-full" style={{ background: "rgba(27,41,66,0.8)" }} />
              <div className="mt-3 grid grid-cols-3 gap-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-14 rounded-lg" style={{ background: "linear-gradient(135deg,rgba(56,189,248,0.16),rgba(27,41,66,0.6))" }} />
                ))}
              </div>
              <div className="mx-auto mt-3 h-9 w-48 rounded-lg" style={{ background: "rgba(27,41,66,0.7)" }} />
              <button
                type="button"
                className="mx-auto mt-3 block h-11 w-48 rounded-xl text-xs font-bold text-white"
                style={{ background: "linear-gradient(135deg,var(--pl-acc),#0369A1)" }}
              >
                {L({ zh: "立即支付 ¥248", en: "Pay ¥248 now" }, lang)}
              </button>
              {/* 光标 */}
              <span
                className="absolute z-10 h-4 w-4 rounded-full border-2 transition-all duration-1000 ease-in-out"
                style={{
                  left: `${wp.x}%`,
                  top: `${wp.y}%`,
                  borderColor: step >= 4 ? "var(--pl-warn)" : "var(--pl-acc)",
                  boxShadow: step >= 4 ? "0 0 12px rgba(251,113,133,0.7)" : "none",
                }}
                aria-hidden
              />
            </div>
          </div>
          {/* 事件日志 */}
          <div className="rounded-2xl border p-4" style={{ borderColor: "var(--pl-line)", background: "var(--pl-panel)" }}>
            <div className="text-[10px] font-bold tracking-widest" style={{ color: "var(--pl-muted)" }}>EVENT STREAM</div>
            <div className="mt-3 space-y-2" style={{ ...MONO }}>
              {logs.map((l, i) => (
                <div
                  key={i}
                  className="rounded-md px-2.5 py-1.5 text-[11px] transition-all duration-500"
                  style={{
                    color: l.hot ? "var(--pl-warn)" : "var(--pl-fg)",
                    background: l.hot && step >= i ? "rgba(251,113,133,0.1)" : "rgba(6,11,20,0.6)",
                    opacity: step >= i ? 1 : 0.25,
                    transform: step >= i ? "none" : "translateY(4px)",
                  }}
                >
                  {l.t}
                </div>
              ))}
            </div>
            {step >= 4 && (
              <p className="mt-3 rounded-lg border p-3 text-[11px] leading-relaxed" style={{ borderColor: "rgba(251,113,133,0.4)", color: "var(--pl-muted)", animation: "pl-fadeup .4s ease both" }}>
                {L(
                  { zh: "Pulse 判定：支付按钮响应异常（连续 3 次点击无反馈）。已关联同类会话 214 个。", en: "Pulse verdict: pay button unresponsive (3 clicks, no feedback). 214 similar sessions linked." },
                  lang
                )}
              </p>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ================= 功能 / 合规 / 引言 / CTA / 页脚 ================= */
function Features({ lang }: { lang: Lang }) {
  const items = [
    { icon: "🎯", title: { zh: "全埋点采集", en: "Auto-Capture" }, desc: { zh: "SDK 自动采集关键行为，无需等发版。", en: "SDKs capture key events without releases." } },
    { icon: "🪣", title: { zh: "漏斗与路径", en: "Funnels & Paths" }, desc: { zh: "多维下钻定位流失步骤，路径图一键生成。", en: "Drill into drop-offs; path maps in one click." } },
    { icon: "🔁", title: { zh: "留存矩阵", en: "Retention Grid" }, desc: { zh: "按群组观察留存曲线，行为分层一目了然。", en: "Cohorted retention curves, behaviorally segmented." } },
    { icon: "🧪", title: { zh: "A/B 实验", en: "A/B Testing" }, desc: { zh: "分流、置信度计算与效果判定全自动化。", en: "Split traffic, compute significance, decide." } },
    { icon: "▶️", title: { zh: "会话回放", en: "Session Replay" }, desc: { zh: "高保真回放异常会话，隐私字段自动脱敏。", en: "Replay sessions with auto-masked PII." } },
    { icon: "🛡️", title: { zh: "合规就绪", en: "Compliance Ready" }, desc: { zh: "GDPR 与个保法适配，数据存储区域可选。", en: "GDPR-ready with region-pinned storage." } },
  ];
  return (
    <section id="pl-features" className="border-t px-6 py-16 sm:px-10" style={{ borderColor: "var(--pl-line)", background: "var(--pl-panel)" }}>
      <Reveal>
        <SectionHead
          lang={lang}
          eyebrow={{ zh: "产品功能", en: "FEATURES" }}
          title={{ zh: "为增长团队准备的完整工具箱", en: "The complete toolkit for growth teams" }}
        />
      </Reveal>
      <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((f, i) => (
          <Reveal key={f.title.en} delay={(i % 3) * 120}>
            <div
              className="h-full rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1"
              style={{ background: "rgba(6,11,20,0.6)", borderColor: "var(--pl-line)" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(56,189,248,0.55)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--pl-line)")}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl text-lg" style={{ background: "rgba(56,189,248,0.12)" }}>{f.icon}</span>
              <div className="mt-3 text-sm font-semibold" style={{ color: "var(--pl-fg)" }}>{L(f.title, lang)}</div>
              <div className="mt-1.5 text-xs leading-relaxed" style={{ color: "var(--pl-muted)" }}>{L(f.desc, lang)}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Compliance({ lang }: { lang: Lang }) {
  const badges = ["GDPR", lang === "zh" ? "个人信息保护法" : "PIPL", "SOC 2 Type II", "ISO 27001", lang === "zh" ? "数据驻留可选" : "Region-pinned storage"];
  const row = [...badges, ...badges];
  return (
    <section id="pl-sec" className="border-t py-6" style={{ borderColor: "var(--pl-line)", background: "var(--pl-bg)" }}>
      <div className="flex items-center gap-6 overflow-hidden">
        <span className="shrink-0 pl-6 text-[11px] font-semibold tracking-widest sm:pl-10" style={{ color: "var(--pl-muted)" }}>
          {L({ zh: "安全合规", en: "SECURITY" }, lang)}
        </span>
        <div className="relative flex-1 overflow-hidden">
          <div className="flex w-max items-center gap-9" style={{ animation: "pl-marquee 30s linear infinite" }}>
            {row.map((b, i) => (
              <span key={i} className="flex items-center gap-2 whitespace-nowrap text-xs font-medium" style={{ color: "var(--pl-muted)" }}>
                <span style={{ color: "var(--pl-acc2)" }}>🛡</span> {b}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Quote({ lang }: { lang: Lang }) {
  return (
    <section className="border-t px-6 py-16 text-center sm:px-10" style={{ borderColor: "var(--pl-line)", background: "var(--pl-panel)" }}>
      <Reveal>
        <div className="mx-auto max-w-3xl">
          <p className="text-lg leading-relaxed sm:text-2xl" style={{ color: "var(--pl-fg)" }}>
            {L(
              { zh: "上线第一周我们就找到了注册漏斗里最大的漏洞，当周修复，转化率提升 11%。", en: "Within week one we found our biggest signup leak; fixing it lifted conversion 11%." },
              lang
            )}
          </p>
          <div className="mt-5 text-xs" style={{ color: "var(--pl-muted)" }}>
            —— {L({ zh: "SaaS 增长团队负责人", en: "Growth Lead, SaaS company" }, lang)}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function Cta({ lang }: { lang: Lang }) {
  return (
    <section id="pl-cta" className="relative overflow-hidden px-6 py-16 text-center sm:px-10" style={{ background: "radial-gradient(120% 130% at 50% 0%, rgba(14,165,233,0.5) 0%, rgba(12,74,110,0.35) 40%, var(--pl-bg) 85%)" }}>
      <Reveal>
        <h2 className="text-2xl font-bold text-white sm:text-3xl">
          {L({ zh: "别再凭感觉做增长了", en: "Stop guessing your growth" }, lang)}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/75">
          {L({ zh: "免费版每月 100 万事件，小型团队永久可用，无需绑卡。", en: "Free tier: 1M events/month, forever, no card required." }, lang)}
        </p>
        <button
          type="button"
          className="mt-8 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-zinc-900 shadow-lg transition hover:scale-[1.03] active:scale-[0.98]"
        >
          {L({ zh: "立即接入", en: "Get started" }, lang)}
        </button>
      </Reveal>
    </section>
  );
}

function Footer({ lang }: { lang: Lang }) {
  return (
    <footer
      className="flex flex-col items-center justify-between gap-2 border-t px-6 py-6 text-xs sm:flex-row sm:px-10"
      style={{ borderColor: "var(--pl-line)", background: "var(--pl-panel)", color: "var(--pl-muted)" }}
    >
      <span>© 2026 Pulse Analytics · Template demo</span>
      <span>{L({ zh: "演示内容为虚构品牌，仅用于展示模板能力。", en: "Fictional brand for template demo purposes." }, lang)}</span>
    </footer>
  );
}

function SectionHead({ lang, eyebrow, title, desc, align }: { lang: Lang; eyebrow: Bi; title: Bi; desc?: Bi; align?: "left" }) {
  return (
    <div className={align === "left" ? "" : "mx-auto max-w-3xl text-center"}>
      <div className="text-[11px] font-bold tracking-[0.22em]" style={{ color: "var(--pl-acc)" }}>{L(eyebrow, lang)}</div>
      <h2 className="mt-3 text-2xl font-semibold leading-snug sm:text-[1.7rem]" style={{ color: "var(--pl-fg)" }}>{L(title, lang)}</h2>
      {desc && <p className={`mt-3 max-w-2xl text-[13px] leading-relaxed ${align === "left" ? "" : "mx-auto"}`} style={{ color: "var(--pl-muted)" }}>{L(desc, lang)}</p>}
    </div>
  );
}

"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import BackToCase from "@/components/BackToCase";
import { CountUp, Reveal, useInView } from "@/components/showcase/reveal";

type Lang = "zh" | "en";
type Bi = { zh: string; en: string };
const L = (b: Bi, lang: Lang) => b[lang === "en" ? "en" : "zh"];

const vars = {
  "--nx-bg": "#0A0E1A",
  "--nx-panel": "#111827",
  "--nx-line": "#1F2A44",
  "--nx-fg": "#E5E9F5",
  "--nx-muted": "#8B93AD",
  "--nx-acc": "#8B5CF6",
  "--nx-acc2": "#22D3EE",
} as CSSProperties;

const MONO = { fontFamily: "ui-monospace, 'Cascadia Code', 'JetBrains Mono', Consolas, monospace" };

export default function NexusAI({ lang, backHref, backLabel }: { lang: Lang; backHref: string; backLabel: string }) {
  return (
    <div className="py-14">
      <BackToCase href={backHref} label={backLabel} />
      <style>{`
        @keyframes nx-chip { from { opacity: 0; transform: translateY(10px) scale(.96); } to { opacity: 1; transform: none; } }
        @keyframes nx-sync { 0%, 72% { opacity: .35; } 82% { opacity: 1; box-shadow: 0 0 8px rgba(34,211,238,.9); } 92%, 100% { opacity: .35; } }
        .nx-ghost { transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease, background .2s ease; }
        .nx-ghost:hover { border-color: rgba(139,92,246,.6) !important; background: rgba(139,92,246,.1) !important; transform: translateY(-1px); box-shadow: 0 6px 18px rgba(139,92,246,.18); }
        @keyframes nx-blink { 0%, 55% { opacity: 1; } 56%, 100% { opacity: 0; } }
        @keyframes nx-fadeup { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
        @keyframes nx-dots { 0%, 20% { opacity: .2; } 50% { opacity: 1; } 80%, 100% { opacity: .2; } }
      `}</style>
      <div
        className="mt-6 overflow-hidden rounded-3xl border border-zinc-200 shadow-xl dark:border-zinc-800"
        style={vars}
      >
        <SiteNav lang={lang} />
        <Hero lang={lang} />
        <AskDemo lang={lang} />
        <Pipeline lang={lang} />
        <Anomaly lang={lang} />
        <Metrics lang={lang} />
        <Features lang={lang} />
        <Ecosystem lang={lang} />
        <Quote lang={lang} />
        <Cta lang={lang} />
        <Footer lang={lang} />
      </div>
    </div>
  );
}

/* ================= 交互背景：粒子星座（鼠标推开 + 连线） ================= */
function Constellation() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = ref.current;
    const parent = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !parent || !ctx) return;
    const DPR = Math.min(2, window.devicePixelRatio || 1);
    let w = 0, h = 0, raf = 0;
    const mouse = { x: -9999, y: -9999 };
    type P = { x: number; y: number; vx: number; vy: number };
    let pts: P[] = [];
    const seed = () => {
      const n = Math.max(36, Math.min(100, Math.floor(w / 13)));
      pts = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
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
    const move = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    };
    const leave = () => { mouse.x = -9999; mouse.y = -9999; };
    parent.addEventListener("mousemove", move);
    parent.addEventListener("mouseleave", leave);
    const step = () => {
      ctx.clearRect(0, 0, w, h);
      const R = 130;
      for (const p of pts) {
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
        if (d2 < R * R) {
          const d = Math.sqrt(d2) || 1;
          const f = ((R - d) / R) * 0.06;
          p.vx += (dx / d) * f; p.vy += (dy / d) * f;
        }
        p.vx *= 0.985; p.vy *= 0.985;
        const sp = Math.hypot(p.vx, p.vy);
        if (sp > 1.4) { p.vx *= 1.4 / sp; p.vy *= 1.4 / sp; }
        p.x += p.vx; p.y += p.vy;
        if (p.x < -20) p.x = w + 20; if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20; if (p.y > h + 20) p.y = -20;
      }
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i], b = pts[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 110) {
            ctx.strokeStyle = `rgba(139,92,246,${(1 - d / 110) * 0.32})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      for (const p of pts) {
        ctx.fillStyle = "rgba(167,139,250,0.85)";
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2); ctx.fill();
      }
      for (const p of pts) {
        const d = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        if (d < 150) {
          ctx.strokeStyle = `rgba(34,211,238,${(1 - d / 150) * 0.45})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(mouse.x, mouse.y); ctx.lineTo(p.x, p.y); ctx.stroke();
        }
      }
      raf = requestAnimationFrame(step);
    };
    step();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      parent.removeEventListener("mousemove", move);
      parent.removeEventListener("mouseleave", leave);
    };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden />;
}

/* ================= 导航 ================= */
function SiteNav({ lang }: { lang: Lang }) {
  const items: [Bi, string][] = [
    [{ zh: "问数演示", en: "Live demo" }, "#nx-ask"],
    [{ zh: "数据管道", en: "Pipeline" }, "#nx-pipeline"],
    [{ zh: "异常预警", en: "Alerts" }, "#nx-alert"],
    [{ zh: "平台能力", en: "Platform" }, "#nx-features"],
    [{ zh: "生态集成", en: "Ecosystem" }, "#nx-eco"],
  ];
  return (
    <header
      className="relative z-20 flex items-center justify-between border-b px-6 py-4 backdrop-blur sm:px-10"
      style={{ borderColor: "var(--nx-line)", background: "rgba(10,14,26,0.7)" }}
    >
      <div className="flex items-center gap-2.5">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white"
          style={{ background: "linear-gradient(135deg,var(--nx-acc),#4C1D95)" }}
        >
          N
        </span>
        <span className="text-sm font-semibold tracking-wide" style={{ color: "var(--nx-fg)" }}>
          Nexus AI
        </span>
      </div>
      <nav className="hidden items-center gap-6 text-xs lg:flex" style={{ color: "var(--nx-muted)" }}>
        {items.map(([label, href]) => (
          <a key={href} href={href} className="transition hover:opacity-60">{L(label, lang)}</a>
        ))}
      </nav>
      <a
        href="#nx-cta"
        className="rounded-lg px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90"
        style={{ background: "var(--nx-acc)" }}
      >
        {L({ zh: "免费试用 14 天", en: "Start free trial" }, lang)}
      </a>
    </header>
  );
}

/* ================= Hero：交互背景 + 逐字终端 ================= */
function Hero({ lang }: { lang: Lang }) {
  return (
    <section className="relative overflow-hidden" style={{ background: "radial-gradient(120% 120% at 22% 0%, rgba(139,92,246,0.35) 0%, rgba(76,29,149,0.18) 38%, var(--nx-bg) 72%)" }}>
      <Constellation />
      <div className="relative z-10 px-6 py-16 sm:px-10 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
          <div>
            <Reveal>
              <span
                className="inline-block rounded-full border px-3.5 py-1.5 text-[11px] font-medium tracking-wide"
                style={{ borderColor: "rgba(139,92,246,0.5)", color: "var(--nx-acc2)", background: "rgba(139,92,246,0.08)" }}
              >
                {L({ zh: "精品科技模板 · AI 数据平台", en: "Tech Template · AI Data Platform" }, lang)}
              </span>
            </Reveal>
            <Reveal delay={120}>
              <h1 className="mt-6 text-3xl font-semibold leading-[1.25] sm:text-4xl lg:text-[2.7rem]" style={{ color: "var(--nx-fg)" }}>
                {L({ zh: "把散落的数据，变成会说话的决策", en: "Turn scattered data into decisions that speak" }, lang)}
              </h1>
            </Reveal>
            <Reveal delay={240}>
              <p className="mt-5 max-w-lg text-sm leading-relaxed sm:text-[15px]" style={{ color: "var(--nx-muted)" }}>
                {L(
                  {
                    zh: "连接 500+ 数据源，用自然语言直接查数、自动生成报表，异常第一时间预警——鼠标在背景上划过，看看这张数据网络如何被点亮。",
                    en: "Connect 500+ sources, query in plain language, auto-build reports, alert on anomalies instantly — move your cursor across the network to see it light up.",
                  },
                  lang
                )}
              </p>
            </Reveal>
            <Reveal delay={360}>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#nx-cta"
                  className="rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.03] active:scale-[0.98]"
                  style={{ background: "linear-gradient(135deg,var(--nx-acc),#6D28D9)" }}
                >
                  {L({ zh: "免费试用 14 天", en: "Start free trial" }, lang)}
                </a>
                <a
                  href="#nx-ask"
                  className="nx-ghost rounded-xl border px-6 py-3 text-sm font-medium transition"
                  style={{ borderColor: "var(--nx-line)", color: "var(--nx-fg)", background: "rgba(17,24,39,0.6)" }}
                >
                  {L({ zh: "试试问数演示", en: "Try the live demo" }, lang)}
                </a>
              </div>
            </Reveal>
          </div>
          <Reveal delay={250}>
            <Terminal lang={lang} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ================= 终端：逐字输出 ================= */
const TLINES: { kind: "cmd" | "ok" | "ans"; text: Bi }[] = [
  { kind: "cmd", text: { zh: "nexus connect --all --sync realtime", en: "nexus connect --all --sync realtime" } },
  { kind: "ok", text: { zh: "✓ 已连接 42 个数据源 · 延迟 240ms", en: "✓ 42 sources linked · latency 240ms" } },
  { kind: "cmd", text: { zh: 'ask "为什么本周留存下滑了？"', en: 'ask "why did retention dip this week?"' } },
  { kind: "ans", text: { zh: "→ 主因：新渠道流量质量下降（置信 87%）· 次因：v2.3 后引导页跳出 +9%", en: "→ Top: new-channel traffic quality (87%) · then: onboarding bounce +9% after v2.3" } },
  { kind: "cmd", text: { zh: "report weekly --send feishu", en: "report weekly --send slack" } },
  { kind: "ok", text: { zh: "✓ 周报已生成，推送至 #growth 频道", en: "✓ Weekly report delivered to #growth" } },
];

function Terminal({ lang }: { lang: Lang }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const [n, setN] = useState(0);
  const costs = TLINES.map((l) => (l.kind === "cmd" ? l.text.en.length + 4 : 8));
  const total = costs.reduce((a, b) => a + b, 0);
  const ivRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cntRef = useRef(0);
  const stop = () => { if (ivRef.current) { clearInterval(ivRef.current); ivRef.current = null; } };
  const start = () => {
    stop();
    setN(0); cntRef.current = 0;
    ivRef.current = setInterval(() => {
      cntRef.current += 1;
      setN(cntRef.current);
      if (cntRef.current >= total) stop();
    }, 26);
  };
  useEffect(() => {
    if (inView) start();
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);
  let remain = n;
  const rendered = TLINES.map((l, i) => {
    const cost = costs[i];
    let shown = "";
    if (remain > 0) {
      shown = l.kind === "cmd" ? l.text[lang === "en" ? "en" : "zh"].slice(0, remain) : remain >= cost ? l.text[lang === "en" ? "en" : "zh"] : "";
      remain -= cost;
    }
    return { ...l, shown, key: i };
  });
  const done = n >= total;
  return (
    <div ref={ref}>
      <div className="overflow-hidden rounded-2xl border text-left shadow-2xl" style={{ background: "rgba(13,17,30,0.92)", borderColor: "var(--nx-line)", backdropFilter: "blur(6px)" }}>
        <div className="flex items-center gap-1.5 border-b px-4 py-2.5" style={{ borderColor: "var(--nx-line)" }}>
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#2A3550" }} />
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#2A3550" }} />
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--nx-acc)" }} />
          <span className="ml-2 text-[10px]" style={{ color: "var(--nx-muted)", ...MONO }}>nexus — zsh</span>
          <button
            type="button"
            onClick={start}
            className="ml-auto rounded-md border px-2 py-0.5 text-[10px] transition hover:bg-white/5"
            style={{ borderColor: "var(--nx-line)", color: "var(--nx-muted)" }}
          >
            {L({ zh: "重放", en: "Replay" }, lang)}
          </button>
        </div>
        <div className="min-h-[210px] px-5 py-4 text-[11px] leading-6 sm:text-xs" style={{ ...MONO }}>
          {rendered.map((l) => (
            <div key={l.key} className="flex gap-2">
              {l.kind === "cmd" && <span className="shrink-0" style={{ color: "var(--nx-acc)" }}>$</span>}
              {l.kind === "ok" && <span className="shrink-0" style={{ color: "var(--nx-acc2)" }}>✓</span>}
              {l.kind === "ans" && <span className="shrink-0" style={{ color: "var(--nx-acc2)" }}>→</span>}
              <span style={{ color: l.kind === "cmd" ? "var(--nx-fg)" : l.kind === "ok" ? "var(--nx-muted)" : "var(--nx-acc2)", whiteSpace: "pre-wrap" }}>
                {l.shown}
              </span>
            </div>
          ))}
          <div className="flex gap-2">
            <span style={{ color: "var(--nx-acc)" }}>$</span>
            <span className="inline-block h-3.5 w-1.5" style={{ background: "var(--nx-acc)", animation: "nx-blink 1.1s steps(1) infinite" }} />
          </div>
        </div>
      </div>
      <p className="mt-3 text-center text-[11px]" style={{ color: "var(--nx-muted)" }}>
        {done
          ? L({ zh: "↑ 这一切发生在同一会话里：连接、提问、出报表", en: "↑ All in one session: connect, ask, deliver" }, lang)
          : L({ zh: "会话进行中…", en: "Session running…" }, lang)}
      </p>
    </div>
  );
}

/* ================= 问数演示：问题芯片 → 思考 → SQL → 动态图表 ================= */
const ASKS: {
  q: Bi;
  sql: string;
  labels: Bi[];
  bars: number[];
  hi: number;
  insight: Bi;
}[] = [
  {
    q: { zh: "上周注册转化率为什么跌了？", en: "Why did signup conversion drop last week?" },
    sql: "SELECT day, conv_rate FROM funnel WHERE week = 'last' GROUP BY day;",
    labels: [
      { zh: "周一", en: "Mon" }, { zh: "周二", en: "Tue" }, { zh: "周三", en: "Wed" }, { zh: "周四", en: "Thu" },
      { zh: "周五", en: "Fri" }, { zh: "周六", en: "Sat" }, { zh: "周日", en: "Sun" },
    ],
    bars: [62, 58, 49, 55, 31, 47, 52],
    hi: 4,
    insight: {
      zh: "主因：周五新渠道流量质量下降（置信 87%）；次因：移动端注册页加载时长 +1.8s。",
      en: "Main cause: Friday's new-channel traffic quality (87% confidence); secondary: mobile signup page +1.8s slower.",
    },
  },
  {
    q: { zh: "哪个渠道的用户 LTV 最高？", en: "Which channel has the highest LTV?" },
    sql: "SELECT channel, avg(ltv) FROM users GROUP BY channel ORDER BY 2 DESC;",
    labels: [
      { zh: "自然", en: "Organic" }, { zh: "搜索", en: "Search" }, { zh: "社交", en: "Social" }, { zh: "投放", en: "Paid" },
      { zh: "邮件", en: "Email" }, { zh: "联盟", en: "Referral" }, { zh: "直访", en: "Direct" },
    ],
    bars: [42, 68, 75, 58, 88, 64, 71],
    hi: 4,
    insight: {
      zh: "邮件渠道 LTV 最高（¥486）且获客成本最低——建议把 15% 投放预算重分配到邮件召回。",
      en: "Email leads LTV (¥486) with the lowest CAC — consider shifting 15% of paid budget to email retention.",
    },
  },
  {
    q: { zh: "本周经营健康度如何？", en: "How healthy is this week overall?" },
    sql: "CALL weekly_health_score('current');",
    labels: [
      { zh: "营收", en: "Rev" }, { zh: "活跃", en: "Active" }, { zh: "留存", en: "Reten." }, { zh: "转化", en: "Conv." },
      { zh: "毛利", en: "Margin" }, { zh: "NPS", en: "NPS" }, { zh: "工单", en: "Tickets" },
    ],
    bars: [72, 68, 75, 80, 78, 84, 91],
    hi: 6,
    insight: {
      zh: "健康分 84（上周 +6）：7 项核心指标 5 升 1 平 1 降，完整周报已推送至飞书。",
      en: "Health score 84 (+6 wk/wk): 5 of 7 core metrics up, full report delivered to Slack.",
    },
  },
];

function AskDemo({ lang }: { lang: Lang }) {
  const [sel, setSel] = useState(0);
  const [phase, setPhase] = useState<"idle" | "think" | "sql" | "done">("idle");
  const [sqlN, setSqlN] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const ivals = useRef<ReturnType<typeof setInterval>[]>([]);
  const clearAll = () => {
    timers.current.forEach(clearTimeout);
    ivals.current.forEach(clearInterval);
    timers.current = [];
    ivals.current = [];
  };
  const run = (i: number) => {
    clearAll();
    setSel(i); setSqlN(0); setPhase("think");
    const sql = ASKS[i].sql;
    timers.current.push(
      setTimeout(() => {
        setPhase("sql");
        const id = setInterval(() => {
          setSqlN((v) => {
            if (v >= sql.length) { clearInterval(id); setPhase("done"); return v; }
            return v + 2;
          });
        }, 14);
        ivals.current.push(id);
      }, 950)
    );
  };
  useEffect(() => () => clearAll(), []);
  const a = ASKS[sel];
  const shownSql = phase === "idle" ? a.sql : a.sql.slice(0, sqlN);
  return (
    <section id="nx-ask" className="border-t px-6 py-16 sm:px-10" style={{ borderColor: "var(--nx-line)", background: "var(--nx-bg)" }}>
      <Reveal dir="left">
        <SectionHead
          lang={lang}
          eyebrow={{ zh: "问数演示 · LIVE DEMO", en: "LIVE DEMO" }}
          title={{ zh: "像问同事一样问数据，答案带图表", en: "Ask data like a colleague — get charts back" }}
          desc={{ zh: "点击下面任意一个问题，看 Nexus 如何思考、写 SQL、画出答案。", en: "Click any question below and watch Nexus think, write SQL and chart the answer." }}
        />
      </Reveal>
      <Reveal dir="left" delay={140}>
        <div className="mt-7 flex flex-wrap gap-2.5">
          {ASKS.map((x, i) => (
            <button
              key={x.q.en}
              type="button"
              onClick={() => run(i)}
              className="rounded-full border px-4 py-2 text-xs font-medium transition"
              style={
                i === sel && phase !== "idle"
                  ? { borderColor: "var(--nx-acc)", color: "#fff", background: "rgba(139,92,246,0.25)" }
                  : { borderColor: "var(--nx-line)", color: "var(--nx-muted)", background: "var(--nx-panel)" }
              }
            >
              {L(x.q, lang)}
            </button>
          ))}
        </div>
      </Reveal>
      <Reveal dir="right" delay={220}>
        <div className="mt-6 grid overflow-hidden rounded-2xl border shadow-xl lg:grid-cols-[1fr_1.2fr]" style={{ borderColor: "var(--nx-line)", background: "var(--nx-panel)" }}>
          {/* 左：对话/SQL */}
          <div className="p-6 sm:p-7">
            <div className="flex items-start gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white" style={{ background: "var(--nx-acc)" }}>你</span>
              <div className="rounded-xl rounded-tl-sm px-4 py-2.5 text-[13px]" style={{ background: "rgba(139,92,246,0.12)", color: "var(--nx-fg)" }}>
                {L(a.q, lang)}
              </div>
            </div>
            <div className="mt-4 flex items-start gap-3">
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
                style={{ background: "linear-gradient(135deg,var(--nx-acc2),#0891B2)" }}
              >
                N
              </span>
              <div className="min-h-[120px] flex-1">
                {phase === "think" && (
                  <div className="flex items-center gap-1.5 pt-2">
                    {[0, 1, 2].map((d) => (
                      <span key={d} className="h-2 w-2 rounded-full" style={{ background: "var(--nx-acc2)", animation: `nx-dots 1.1s ease ${d * 0.18}s infinite` }} />
                    ))}
                    <span className="ml-2 text-xs" style={{ color: "var(--nx-muted)" }}>
                      {L({ zh: "正在扫描 42 个数据源…", en: "Scanning 42 sources…" }, lang)}
                    </span>
                  </div>
                )}
                {(phase === "idle" || phase === "sql" || phase === "done") && (
                  <div className="rounded-xl border p-3.5" style={{ borderColor: "var(--nx-line)", background: "rgba(10,14,26,0.7)", ...MONO }}>
                    <div className="text-[10px] tracking-widest" style={{ color: "var(--nx-muted)" }}>SQL · auto-generated</div>
                    <div className="mt-2 text-[11px] leading-5" style={{ color: "var(--nx-acc2)", whiteSpace: "pre-wrap" }}>
                      {shownSql}
                      {phase === "sql" && <span className="inline-block h-3 w-1 align-middle" style={{ background: "var(--nx-acc2)", animation: "nx-blink 1s steps(1) infinite" }} />}
                    </div>
                  </div>
                )}
                {(phase === "idle" || phase === "done") && (
                  <p className="mt-3 text-[13px] leading-relaxed" style={{ color: "var(--nx-fg)", animation: "nx-fadeup .5s ease both" }}>
                    {L(a.insight, lang)}
                  </p>
                )}
              </div>
            </div>
          </div>
          {/* 右：动态图表 */}
          <div className="border-t p-6 sm:p-7 lg:border-l lg:border-t-0" style={{ borderColor: "var(--nx-line)" }}>
            <div className="flex h-[190px] items-end gap-3 sm:gap-4">
              {a.bars.map((v, i) => {
                const hi = i === a.hi;
                return (
                  <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                    <span className="text-[10px] font-semibold" style={{ color: hi ? "var(--nx-acc2)" : "var(--nx-muted)" }}>{v}</span>
                    <div
                      className="w-full rounded-t-md transition-all duration-700"
                      style={{
                        height: phase === "think" || phase === "sql" ? "4%" : `${v}%`,
                        transitionDelay: `${i * 90}ms`,
                        background: hi
                          ? "linear-gradient(180deg,var(--nx-acc2),rgba(34,211,238,0.35))"
                          : "linear-gradient(180deg,var(--nx-acc),rgba(139,92,246,0.25))",
                        boxShadow: hi ? "0 0 18px rgba(34,211,238,0.35)" : "none",
                      }}
                    />
                  </div>
                );
              })}
            </div>
            <div className="mt-3 flex gap-3 sm:gap-4">
              {a.labels.map((lb, i) => (
                <div key={i} className="flex-1 text-center text-[10px]" style={{ color: i === a.hi ? "var(--nx-acc2)" : "var(--nx-muted)" }}>
                  {L(lb, lang)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ================= 数据管道：SVG 动画流 ================= */
function Pipeline({ lang }: { lang: Lang }) {
  const sources = ["MySQL", "PostgreSQL", "Kafka", "MongoDB", "Stripe", "CSV / S3"];
  const outputs: Bi[] = [
    { zh: "数据仓库", en: "Warehouse" },
    { zh: "指标层", en: "Metrics layer" },
    { zh: "看板 & 告警", en: "Dashboards & alerts" },
  ];
  const srcYs = [18, 64, 110, 156, 202, 248];
  const outYs = [62, 142, 222];
  const pathToHub = (y: number) => `M150 ${y + 17} C 250 ${y + 17}, 262 150, 352 150`;
  const pathToOut = (y: number) => `M448 150 C 522 150, 522 ${y + 17}, 602 ${y + 17}`;
  return (
    <section id="nx-pipeline" className="border-t px-6 py-16 sm:px-10" style={{ borderColor: "var(--nx-line)", background: "var(--nx-panel)" }}>
      <Reveal dir="right">
        <SectionHead
          lang={lang}
          eyebrow={{ zh: "它是怎么做到的 · 原理", en: "HOW IT WORKS" }}
          title={{ zh: "一条实时管道，把所有数据送到同一个地方", en: "One realtime pipeline for every source" }}
          desc={{ zh: "CDC 与流式接入双通道，源系统零侵入；数据先落地仓库，再统一建模——所以任何提问都有单一可信答案。", en: "CDC and streaming ingestion, zero footprint on sources; data lands in the warehouse first, then gets modeled once — so every answer has a single source of truth." }}
        />
      </Reveal>
      <Reveal dir="left" delay={160}>
        <div className="mt-8 overflow-x-auto rounded-2xl border p-4" style={{ borderColor: "var(--nx-line)", background: "rgba(10,14,26,0.6)" }}>
          <svg viewBox="0 0 760 300" className="mx-auto block w-full min-w-[560px] max-w-3xl">
            {srcYs.map((y, i) => (
              <g key={i}>
                <rect x="10" y={y} width="140" height="34" rx="8" fill="#111827" stroke="#1F2A44" />
                <text x="80" y={y + 21} textAnchor="middle" fontSize="11" fill="#8B93AD" fontFamily="ui-monospace, monospace">{sources[i]}</text>
                <path d={pathToHub(y)} fill="none" stroke="rgba(139,92,246,0.3)" strokeWidth="1.5" />
                <circle r="3" fill="#22D3EE">
                  <animateMotion dur={`${2.4 + i * 0.25}s`} repeatCount="indefinite" path={pathToHub(y)} />
                </circle>
              </g>
            ))}
            {/* 中枢 */}
            <circle cx="400" cy="150" r="48" fill="rgba(139,92,246,0.12)" stroke="#8B5CF6" strokeWidth="1.5" />
            <circle cx="400" cy="150" r="48" fill="none" stroke="rgba(139,92,246,0.4)" strokeWidth="1">
              <animate attributeName="r" from="48" to="62" dur="2.2s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="0.6" to="0" dur="2.2s" repeatCount="indefinite" />
            </circle>
            <text x="400" y="146" textAnchor="middle" fontSize="13" fontWeight="700" fill="#E5E9F5">Nexus</text>
            <text x="400" y="162" textAnchor="middle" fontSize="9" fill="#8B93AD">modeling engine</text>
            {outYs.map((y, i) => (
              <g key={i}>
                <path d={pathToOut(y)} fill="none" stroke="rgba(139,92,246,0.3)" strokeWidth="1.5" />
                <circle r="3" fill="#8B5CF6">
                  <animateMotion dur={`${2.2 + i * 0.3}s`} repeatCount="indefinite" path={pathToOut(y)} />
                </circle>
                <rect x="602" y={y} width="148" height="34" rx="8" fill="#111827" stroke="#1F2A44" />
                <text x="676" y={y + 21} textAnchor="middle" fontSize="11" fill="#8B93AD">{L(outputs[i], lang)}</text>
              </g>
            ))}
          </svg>
        </div>
      </Reveal>
    </section>
  );
}

/* ================= 异常预警：折线图 + 脉冲点 ================= */
function Anomaly({ lang }: { lang: Lang }) {
  const [k, setK] = useState(0);
  const points = "0,170 80,164 160,172 240,158 320,168 400,158 480,166 560,46 640,152 720,158";
  return (
    <section id="nx-alert" className="border-t px-6 py-16 sm:px-10" style={{ borderColor: "var(--nx-line)", background: "var(--nx-bg)" }}>
      <Reveal dir="left">
        <SectionHead
          lang={lang}
          eyebrow={{ zh: "异常预警 · ANOMALY", en: "ANOMALY ALERTS" }}
          title={{ zh: "不用配阈值，基线是学出来的", en: "No thresholds to configure — baselines are learned" }}
          desc={{ zh: "Nexus 按小时为每个指标学习正常波动区间，偏离即报，精确到异常的那一个点。", en: "Nexus learns each metric's normal band hourly and pings you the moment a point steps out of line." }}
        />
      </Reveal>
      <div key={k} className="relative">
        <Reveal dir="right" delay={160}>
          <div className="relative mt-8 overflow-hidden rounded-2xl border p-4 sm:p-6" style={{ borderColor: "var(--nx-line)", background: "var(--nx-panel)" }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold" style={{ color: "var(--nx-fg)" }}>
                {L({ zh: "指标：退款率 · 近 10 小时", en: "Metric: refund rate · last 10 hours" }, lang)}
              </span>
              <button
                type="button"
                onClick={() => setK((v) => v + 1)}
                className="rounded-md border px-2.5 py-1 text-[10px] transition hover:bg-white/5"
                style={{ borderColor: "var(--nx-line)", color: "var(--nx-muted)" }}
              >
                {L({ zh: "重放动画", en: "Replay" }, lang)}
              </button>
            </div>
            <div className="relative mt-4">
              <svg viewBox="0 0 720 240" className="block w-full">
                <defs>
                  <linearGradient id="nxArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polygon points={`${points} 720,240 0,240`} fill="url(#nxArea)" />
                <polyline points={points} fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinejoin="round" />
                <line x1="0" y1="165" x2="720" y2="165" stroke="rgba(229,233,245,0.18)" strokeDasharray="5 5" />
                <text x="8" y="158" fontSize="9" fill="#8B93AD">{L({ zh: "学习基线", en: "learned baseline" }, lang)}</text>
                <circle cx="560" cy="46" r="4.5" fill="#FB7185" />
                <circle cx="560" cy="46" r="5" fill="none" stroke="#FB7185" strokeWidth="1.5">
                  <animate attributeName="r" from="5" to="22" dur="1.6s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.8" to="0" dur="1.6s" repeatCount="indefinite" />
                </circle>
                <text x="560" y="30" textAnchor="middle" fontSize="10" fill="#FB7185">+3.2σ</text>
              </svg>
              {/* 告警卡 */}
              <div
                className="mx-auto mt-2 max-w-md rounded-xl border p-4 lg:absolute lg:right-8 lg:top-6 lg:mt-0 lg:w-72"
                style={{ borderColor: "rgba(251,113,133,0.4)", background: "rgba(251,113,133,0.08)", animation: "nx-fadeup .6s ease .6s both" }}
              >
                <div className="flex items-center gap-2 text-xs font-bold" style={{ color: "#FB7185" }}>
                  ⚠ {L({ zh: "退款率异常", en: "Refund rate anomaly" }, lang)}
                </div>
                <div className="mt-2 text-[11px] leading-relaxed" style={{ color: "var(--nx-muted)" }}>
                  {L({ zh: "昨天 14:20 超出基线 3.2σ，已自动推送值班群并冻结相关促销规则。", en: "Yesterday 14:20, 3.2σ above baseline. On-call pinged; promo rules auto-frozen." }, lang)}
                </div>
                <div className="mt-2.5 text-[11px] font-semibold" style={{ color: "var(--nx-acc2)" }}>
                  {L({ zh: "查看根因分析 →", en: "Open root-cause analysis →" }, lang)}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ================= 指标带 ================= */
function Metrics({ lang }: { lang: Lang }) {
  const stats = [
    { to: 99.99, decimals: 2, suffix: "%", label: { zh: "服务可用性", en: "Uptime SLA" } },
    { to: 2.1, decimals: 1, suffix: "B", label: { zh: "日均处理事件", en: "Daily events" } },
    { to: 500, suffix: "+", label: { zh: "数据源连接器", en: "Connectors" } },
    { to: 240, prefix: "<", suffix: "ms", label: { zh: "查询中位延迟", en: "Median query latency" } },
  ];
  return (
    <section className="border-t px-6 py-12 sm:px-10" style={{ borderColor: "var(--nx-line)", background: "var(--nx-panel)" }}>
      <div className="grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label.en} delay={i * 110} dir={i % 2 ? "right" : "left"}>
            <div className="text-3xl font-bold sm:text-4xl" style={{ color: "var(--nx-acc2)" }}>
              <CountUp to={s.to} decimals={s.decimals ?? 0} prefix={s.prefix} suffix={s.suffix} />
            </div>
            <div className="mt-2 text-xs sm:text-[13px]" style={{ color: "var(--nx-muted)" }}>{L(s.label, lang)}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ================= 平台能力 ================= */
function Features({ lang }: { lang: Lang }) {
  const items = [
    { icon: "🔌", title: { zh: "实时数据管道", en: "Realtime Pipelines" }, desc: { zh: "CDC 与流式接入，秒级延迟同步到仓库。", en: "CDC and streaming ingestion, second-level sync." } },
    { icon: "💬", title: { zh: "自然语言查数", en: "Ask in Plain Language" }, desc: { zh: "像问同事一样问数据，自动生成 SQL 与图表。", en: "Ask data like a colleague; SQL and charts auto-built." } },
    { icon: "📊", title: { zh: "自动化报表", en: "Automated Reports" }, desc: { zh: "定时推送至飞书、钉钉与邮箱，格式随模板。", en: "Scheduled delivery to IM and inbox, template-based." } },
    { icon: "🚨", title: { zh: "异常预警", en: "Anomaly Alerts" }, desc: { zh: "指标基线自动学习，抖动超出阈值即刻通知。", en: "Baselines learned automatically; breaches ping you." } },
    { icon: "🧩", title: { zh: "API 优先", en: "API-First" }, desc: { zh: "全部能力开放 API，可嵌入自有系统与工作流。", en: "Everything as API; embed into your own stack." } },
    { icon: "🔐", title: { zh: "私有化部署", en: "Private Deployment" }, desc: { zh: "支持 VPC 内部署与细粒度权限审计。", en: "Deploy in your VPC with fine-grained audit." } },
  ];
  return (
    <section id="nx-features" className="border-t px-6 py-16 sm:px-10" style={{ borderColor: "var(--nx-line)", background: "var(--nx-bg)" }}>
      <Reveal dir="right">
        <SectionHead
          lang={lang}
          eyebrow={{ zh: "平台能力", en: "PLATFORM" }}
          title={{ zh: "从接入到治理，一整套都在", en: "Everything from ingestion to governance" }}
        />
      </Reveal>
      <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((f, i) => (
          <Reveal key={f.title.en} delay={(i % 3) * 120} dir={i % 2 ? "right" : "left"}>
            <div
              className="group h-full rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1"
              style={{ background: "var(--nx-panel)", borderColor: "var(--nx-line)" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(139,92,246,0.55)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--nx-line)")}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl text-lg" style={{ background: "rgba(139,92,246,0.15)" }}>{f.icon}</span>
              <div className="mt-3 text-sm font-semibold" style={{ color: "var(--nx-fg)" }}>{L(f.title, lang)}</div>
              <div className="mt-1.5 text-xs leading-relaxed" style={{ color: "var(--nx-muted)" }}>{L(f.desc, lang)}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ================= 生态集成：连接器网格（同步脉冲，区别于其他模板的滚动带） ================= */
function Ecosystem({ lang }: { lang: Lang }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.25);
  const items = ["MySQL", "PostgreSQL", "Kafka", "Snowflake", "MongoDB", "BigQuery", "Stripe", "Salesforce", "HubSpot", "S3", lang === "zh" ? "飞书" : "Feishu", lang === "zh" ? "钉钉" : "DingTalk"];
  return (
    <section id="nx-eco" className="border-t px-6 py-14 sm:px-10" style={{ borderColor: "var(--nx-line)", background: "var(--nx-panel)" }}>
      <div ref={ref} className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-[11px] font-bold tracking-[0.22em]" style={{ color: "var(--nx-acc)" }}>
            {L({ zh: "生态集成", en: "ECOSYSTEM" }, lang)}
          </div>
          <h2 className="mt-2 text-xl font-semibold" style={{ color: "var(--nx-fg)" }}>
            {L({ zh: "500+ 连接器，全部在线", en: "500+ connectors, all online" }, lang)}
          </h2>
        </div>
        <span
          className="flex items-center gap-2 rounded-full border px-3 py-1 text-[11px]"
          style={{ borderColor: "rgba(52,211,153,0.4)", color: "#34D399", background: "rgba(52,211,153,0.08)" }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#34D399", animation: "nx-sync 2.6s ease infinite" }} />
          {L({ zh: "实时同步中", en: "syncing live" }, lang)}
        </span>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-6">
        {items.map((it, i) => (
          <div
            key={it}
            className="flex items-center justify-between rounded-xl border px-3.5 py-3 transition-all duration-300 hover:-translate-y-0.5"
            style={{
              borderColor: "var(--nx-line)",
              background: "rgba(10,14,26,0.6)",
              opacity: inView ? 1 : 0,
              animation: inView ? `nx-chip .5s ease ${(i % 6) * 70 + Math.floor(i / 6) * 140}ms both` : "none",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(139,92,246,0.55)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--nx-line)")}
          >
            <span className="text-xs font-medium" style={{ color: "var(--nx-fg)", ...MONO }}>{it}</span>
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: i % 3 === 0 ? "var(--nx-acc2)" : "var(--nx-acc)", animation: `nx-sync 2.8s ease ${i * 0.35}s infinite` }}
            />
          </div>
        ))}
      </div>
      <p className="mt-5 text-xs leading-relaxed" style={{ color: "var(--nx-muted)" }}>
        {L(
          { zh: "CDC、API、文件三通道接入，新增一个数据源平均只需 20 分钟；每个连接器右上角的脉冲点，就是你正在流动的数据。", en: "CDC, API and file ingestion — a new source goes live in ~20 minutes on average. Each pulsing dot is your data in motion." },
          lang
        )}
      </p>
    </section>
  )
}

/* ================= 引言 / CTA / 页脚 / 小节标题 ================= */
function Quote({ lang }: { lang: Lang }) {
  return (
    <section className="border-t px-6 py-16 text-center sm:px-10" style={{ borderColor: "var(--nx-line)", background: "var(--nx-bg)" }}>
      <Reveal>
        <div className="mx-auto max-w-3xl">
          <p className="text-lg leading-relaxed sm:text-2xl" style={{ color: "var(--nx-fg)" }}>
            {L(
              { zh: "以前分析师三天出的周报，现在业务同学自己 30 秒就能拉出来。", en: "Weekly reports that took analysts 3 days now take anyone 30 seconds." },
              lang
            )}
          </p>
          <div className="mt-5 text-xs" style={{ color: "var(--nx-muted)" }}>
            —— {L({ zh: "某电商公司数据负责人", en: "Head of Data, e-commerce client" }, lang)}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function Cta({ lang }: { lang: Lang }) {
  return (
    <section id="nx-cta" className="relative overflow-hidden px-6 py-16 text-center sm:px-10" style={{ background: "radial-gradient(120% 130% at 50% 0%, rgba(139,92,246,0.5) 0%, rgba(76,29,149,0.35) 40%, var(--nx-bg) 85%)" }}>
      <Reveal>
        <h2 className="text-2xl font-bold text-white sm:text-3xl">
          {L({ zh: "让数据团队从取数中解放出来", en: "Free your data team from ad-hoc queries" }, lang)}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/75">
          {L({ zh: "14 天全功能试用，无需绑卡，支持私有化 POC。", en: "14-day full-feature trial, no card required, POC supported." }, lang)}
        </p>
        <button
          type="button"
          className="mt-8 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-zinc-900 shadow-lg transition hover:scale-[1.03] active:scale-[0.98]"
        >
          {L({ zh: "免费开始", en: "Start for free" }, lang)}
        </button>
      </Reveal>
    </section>
  );
}

function Footer({ lang }: { lang: Lang }) {
  return (
    <footer
      className="flex flex-col items-center justify-between gap-2 border-t px-6 py-6 text-xs sm:flex-row sm:px-10"
      style={{ borderColor: "var(--nx-line)", background: "var(--nx-panel)", color: "var(--nx-muted)" }}
    >
      <span>© 2026 Nexus AI · Template demo</span>
      <span>{L({ zh: "演示内容为虚构品牌，仅用于展示模板能力。", en: "Fictional brand for template demo purposes." }, lang)}</span>
    </footer>
  );
}

function SectionHead({ lang, eyebrow, title, desc }: { lang: Lang; eyebrow: Bi; title: Bi; desc?: Bi }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <div className="text-[11px] font-bold tracking-[0.22em]" style={{ color: "var(--nx-acc)" }}>{L(eyebrow, lang)}</div>
      <h2 className="mt-3 text-2xl font-semibold leading-snug sm:text-[1.7rem]" style={{ color: "var(--nx-fg)" }}>{L(title, lang)}</h2>
      {desc && <p className="mx-auto mt-3 max-w-2xl text-[13px] leading-relaxed" style={{ color: "var(--nx-muted)" }}>{L(desc, lang)}</p>}
    </div>
  );
}

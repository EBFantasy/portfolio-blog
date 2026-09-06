"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import BackToCase from "@/components/BackToCase";

type Lang = "zh" | "en";
type Bi = { zh: string; en: string };
const L = (b: Bi, lang: Lang) => b[lang === "en" ? "en" : "zh"];

const vars = {
  "--cw-bg": "#0D1512",
  "--cw-panel": "#122019",
  "--cw-line": "#1E3A2F",
  "--cw-fg": "#D8F3E3",
  "--cw-muted": "#7FA591",
  "--cw-acc": "#34D399",
  "--cw-warn": "#FBBF24",
  "--cw-bad": "#F87171",
} as CSSProperties;

const MONO = { fontFamily: "ui-monospace, 'Cascadia Code', 'JetBrains Mono', Consolas, monospace" };

/* ================= 站点图（确定性生成：树 + 交叉链接） ================= */
const N = 24;
const BLOCKED = new Set([5, 14]); // robots.txt 禁止的路径
type NodeStatus = "undiscovered" | "queued" | "fetching" | "done" | "blocked";

const pos: { x: number; y: number }[] = [];
for (let i = 0; i < N; i++) {
  const col = i % 6;
  const row = Math.floor(i / 6);
  const jx = ((i * 37) % 23) - 11;
  const jy = ((i * 53) % 19) - 9;
  pos.push({ x: 70 + col * 104 + jx, y: 55 + row * 78 + jy });
}
const EDGES: [number, number][] = [];
for (let i = 0; i < N; i++) {
  for (const j of [i * 2 + 1, i * 2 + 2]) if (j < N) EDGES.push([i, j]);
}
[[3, 9], [5, 12], [7, 16], [10, 21], [11, 22]].forEach(([a, b]) => EDGES.push([a, b]));
const NEIGHBORS: number[][] = Array.from({ length: N }, () => []);
for (const [a, b] of EDGES) {
  NEIGHBORS[a].push(b);
  NEIGHBORS[b].push(a);
}
const depth = (i: number): number => {
  let d = 0;
  let cur = i;
  while (cur > 0) {
    cur = Math.floor((cur - 1) / 2);
    d += 1;
  }
  return d;
};
const url = (i: number): string => {
  if (i === 0) return "/index.html";
  const d = depth(i);
  return d === 1 ? `/cat-${i}.html` : `/item-${i}.html`;
};

export default function CrawlerVisualizer({ lang, backHref, backLabel }: { lang: Lang; backHref: string; backLabel: string }) {
  type Status = NodeStatus[];
  const initStatus = (): Status => Array.from({ length: N }, (_, i) => (i === 0 ? "queued" : "undiscovered"));
  const [status, setStatus] = useState<Status>(initStatus);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [concurrency, setConcurrency] = useState(2);
  const [delay, setDelay] = useState(600);
  const [robots, setRobots] = useState(true);
  const [stats, setStats] = useState({ fetched: 1, queued: 1, dup: 0, blocked: 0, violations: 0, hits429: 0 });
  const [logs, setLogs] = useState<{ t: string; bad?: boolean }[]>([
    { t: L({ zh: "就绪。robots.txt 已加载（2 条 Disallow）。点击「开始抓取」。", en: "Ready. robots.txt loaded (2 Disallow rules). Press Start." }, lang) },
  ]);

  // 队列 / 进行中 保存于 ref（引擎数据），渲染走 status 快照
  const queueRef = useRef<number[]>([0]);
  const seenRef = useRef<Set<number>>(new Set([0]));
  const activeRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const statsRef = useRef(stats);
  const runningRef = useRef(false);
  const robotsRef = useRef(true);
  const concRef = useRef(concurrency);
  const delayRef = useRef(delay);
  statsRef.current = stats;
  runningRef.current = running;
  robotsRef.current = robots;
  concRef.current = concurrency;
  delayRef.current = delay;

  const log = (line: string, bad = false) => {
    setLogs((ls) => [...ls.slice(-7), { t: line, bad }]);
  };

  const reset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    queueRef.current = [0];
    seenRef.current = new Set([0]);
    activeRef.current = 0;
    setStatus(initStatus());
    setStats({ fetched: 1, queued: 1, dup: 0, blocked: 0, violations: 0, hits429: 0 });
    setRunning(false);
    setFinished(false);
    setLogs([{ t: L({ zh: "已重置。站点图恢复初始状态。", en: "Reset. Site graph restored." }, lang) }]);
  };

  const start = () => {
    if (runningRef.current || finished) return;
    setRunning(true);
    timerRef.current = setInterval(() => {
      const conc = concRef.current;
      let budget = conc - activeRef.current;
      while (budget > 0 && queueRef.current.length > 0) {
        const id = queueRef.current.shift()!;
        // robots 拦截：出队时发现是受限页
        if (robotsRef.current && BLOCKED.has(id)) {
          setStatus((st) => st.map((v, i) => (i === id ? "blocked" : v)));
          setStats((st) => ({ ...st, blocked: st.blocked + 1 }));
          log(`SKIP ${url(id)} → ${L({ zh: "robots 禁止", en: "disallowed by robots" }, lang)}`, true);
          budget -= 1;
          continue;
        }
        budget -= 1;
        activeRef.current += 1;
        setStatus((st) => st.map((v, i) => (i === id ? "fetching" : v)));
        const ms = 300 + ((id * 97) % 260);
        setTimeout(() => {
          activeRef.current -= 1;
          // 429 模拟：激进配置下有概率被限流
          if (delayRef.current <= 400 && concRef.current >= 3 && Math.random() < 0.28) {
            queueRef.current.unshift(id);
            setStatus((st) => st.map((v, i) => (i === id ? "queued" : v)));
            setStats((st) => ({ ...st, hits429: st.hits429 + 1 }));
            log(`GET ${url(id)} → 429 ${L({ zh: "触发限流，重新排队", en: "rate-limited, requeued" }, lang)}`, true);
            return;
          }
          const links = NEIGHBORS[id].length;
          setStatus((st) => st.map((v, i) => (i === id ? "done" : v)));
          let newLinks = 0;
          for (const nb of NEIGHBORS[id]) {
            if (seenRef.current.has(nb)) {
              setStats((st) => ({ ...st, dup: st.dup + 1 }));
              continue;
            }
            seenRef.current.add(nb);
            // robots 开启时，受限页在发现阶段即拦截
            if (robotsRef.current && BLOCKED.has(nb)) {
              setStatus((st) => st.map((v, i) => (i === nb ? "blocked" : v)));
              setStats((st) => ({ ...st, blocked: st.blocked + 1 }));
              continue;
            }
            queueRef.current.push(nb);
            setStatus((st) => st.map((v, i) => (i === nb ? "queued" : v)));
            newLinks += 1;
          }
          if (!robotsRef.current && BLOCKED.has(id)) {
            setStats((st) => ({ ...st, violations: st.violations + 1 }));
            log(`GET ${url(id)} → 200 · ${links} ${L({ zh: "链接", en: "links" }, lang)} · ⚠ ${L({ zh: "违规抓取", en: "VIOLATION" }, lang)}`, true);
          } else {
            log(`GET ${url(id)} → 200 · ${links} ${L({ zh: "链接", en: "links" }, lang)} · ${ms}ms`);
          }
          setStats((st) => ({ ...st, fetched: st.fetched + 1, queued: queueRef.current.length }));
        }, ms);
      }
      if (queueRef.current.length === 0 && activeRef.current === 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = null;
        setRunning(false);
        setFinished(true);
      }
    }, delayRef.current);
  };

  const pause = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setRunning(false);
  };

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const nodeColor = (st: NodeStatus): string => {
    switch (st) {
      case "done": return "var(--cw-acc)";
      case "fetching": return "var(--cw-warn)";
      case "queued": return "#3E6B57";
      case "blocked": return "var(--cw-bad)";
      default: return "#24352D";
    }
  };

  const rate = delay > 0 ? ((concurrency * 1000) / delay).toFixed(1) : "0";
  const doneCount = status.filter((x) => x === "done").length;

  return (
    <div className="py-14">
      <BackToCase href={backHref} label={backLabel} />
      <style>{`
        @keyframes cw-pulse { 0% { r: 15; opacity: .9; } 100% { r: 24; opacity: 0; } }
        @keyframes cw-sec { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
        .cw-a { animation: cw-sec .6s ease both; }
        .cw-b { animation: cw-sec .6s ease .15s both; }
        @keyframes cw-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        .cw-slider { accent-color: var(--cw-acc); }
      `}</style>
      <div
        className="mt-6 overflow-hidden rounded-3xl border border-zinc-200 shadow-xl dark:border-zinc-800"
        style={{ ...vars, background: "var(--cw-bg)" }}
      >
        {/* 头部 */}
        <div className="cw-a border-b px-6 py-8 sm:px-10" style={{ borderColor: "var(--cw-line)" }}>
          <span className="rounded-full px-2.5 py-1 text-xs font-semibold" style={{ background: "rgba(52,211,153,0.12)", color: "var(--cw-acc)" }}>
            {L({ zh: "自动化 Demo · 爬虫调度", en: "Automation Demo · Crawler" }, lang)}
          </span>
          <h1 className="mt-3 text-2xl font-bold sm:text-3xl" style={{ color: "var(--cw-fg)" }}>
            {L({ zh: "爬虫调度可视化系统", en: "Crawler Scheduler Visualizer" }, lang)}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--cw-muted)" }}>
            {L(
              {
                zh: "对一个 24 页的模拟站点执行广度优先抓取。调高并发、缩短间隔会触发 429 限流；关闭 robots.txt 开关试试会发生什么。",
                en: "A breadth-first crawl over a 24-page simulated site. Push concurrency up or delay down to trigger 429 rate limits; toggle robots.txt off to see what happens.",
              },
              lang
            )}
          </p>
        </div>

        <div className="cw-b grid gap-5 p-6 sm:p-8 lg:grid-cols-[1.55fr_1fr]">
          {/* 左：站点图 */}
          <div className="overflow-hidden rounded-2xl border" style={{ borderColor: "var(--cw-line)", background: "var(--cw-panel)" }}>
            <div className="flex items-center justify-between border-b px-4 py-2.5" style={{ borderColor: "var(--cw-line)" }}>
              <span className="text-xs font-semibold" style={{ color: "var(--cw-fg)", ...MONO }}>site-graph · {doneCount}/{N}</span>
              <span className="text-[10px]" style={{ color: "var(--cw-muted)" }}>
                {finished
                  ? L({ zh: "✓ 抓取完成", en: "✓ crawl finished" }, lang)
                  : running
                    ? L({ zh: "抓取中…", en: "crawling…" }, lang)
                    : L({ zh: "已暂停", en: "paused" }, lang)}
              </span>
            </div>
            <svg viewBox="0 0 660 430" className="block w-full">
              {EDGES.map(([a, b], i) => {
                const on = status[a] === "done" && (status[b] === "done" || status[b] === "fetching" || status[b] === "queued");
                return (
                  <line
                    key={i}
                    x1={pos[a].x} y1={pos[a].y} x2={pos[b].x} y2={pos[b].y}
                    stroke={on ? "rgba(52,211,153,0.4)" : "rgba(30,58,47,0.8)"}
                    strokeWidth={on ? 1.6 : 1}
                  />
                );
              })}
              {pos.map((pt, i) => {
                const st = status[i];
                return (
                  <g key={i}>
                    {st === "fetching" && (
                      <circle cx={pt.x} cy={pt.y} r="15" fill="none" stroke="var(--cw-warn)" strokeWidth="1.5" style={{ animation: "cw-pulse 1s ease-out infinite" }} />
                    )}
                    <circle
                      cx={pt.x} cy={pt.y} r="13"
                      fill={nodeColor(st)}
                      fillOpacity={st === "undiscovered" ? 0.5 : 0.9}
                      stroke={st === "fetching" ? "var(--cw-warn)" : "rgba(0,0,0,0.4)"}
                      strokeWidth="1.5"
                    />
                    <text x={pt.x} y={pt.y + 3} textAnchor="middle" fontSize="8" fill={st === "undiscovered" ? "#4A5F54" : "#0B120E"} fontFamily="ui-monospace, monospace">
                      {i === 0 ? "idx" : i}
                    </text>
                    <text x={pt.x} y={pt.y + 26} textAnchor="middle" fontSize="7.5" fill={st === "blocked" ? "var(--cw-bad)" : "var(--cw-muted)"} fontFamily="ui-monospace, monospace">
                      {url(i)}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* 右：控制 + 统计 + 日志 */}
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border p-4" style={{ borderColor: "var(--cw-line)", background: "var(--cw-panel)" }}>
              <div className="flex gap-2">
                {!running && !finished && (
                  <button type="button" onClick={start} className="flex-1 rounded-lg px-4 py-2.5 text-sm font-bold text-black transition hover:brightness-110 active:scale-95" style={{ background: "var(--cw-acc)" }}>
                    {L({ zh: "开始抓取", en: "Start crawl" }, lang)}
                  </button>
                )}
                {running && (
                  <button type="button" onClick={pause} className="flex-1 rounded-lg px-4 py-2.5 text-sm font-bold text-black transition hover:brightness-110 active:scale-95" style={{ background: "var(--cw-warn)" }}>
                    {L({ zh: "暂停", en: "Pause" }, lang)}
                  </button>
                )}
                {running && (
                  <button type="button" onClick={reset} className="rounded-lg border px-4 py-2.5 text-sm font-semibold transition hover:bg-white/5" style={{ borderColor: "var(--cw-line)", color: "var(--cw-fg)" }}>
                    {L({ zh: "重置", en: "Reset" }, lang)}
                  </button>
                )}
                {finished && (
                  <button type="button" onClick={reset} className="flex-1 rounded-lg px-4 py-2.5 text-sm font-bold text-black transition hover:brightness-110 active:scale-95" style={{ background: "var(--cw-acc)" }}>
                    {L({ zh: "再来一次", en: "Run again" }, lang)}
                  </button>
                )}
              </div>
              <div className="mt-4 space-y-3 text-xs" style={{ color: "var(--cw-muted)" }}>
                <label className="block">
                  <span className="flex justify-between">
                    <span>{L({ zh: "并发数", en: "Concurrency" }, lang)}</span>
                    <b style={{ color: "var(--cw-fg)", ...MONO }}>{concurrency}</b>
                  </span>
                  <input type="range" min={1} max={4} step={1} value={concurrency} onChange={(e) => setConcurrency(Number(e.target.value))} className="cw-slider mt-1 w-full" />
                </label>
                <label className="block">
                  <span className="flex justify-between">
                    <span>{L({ zh: "抓取间隔", en: "Delay" }, lang)}</span>
                    <b style={{ color: "var(--cw-fg)", ...MONO }}>{delay}ms · ~{rate} req/s</b>
                  </span>
                  <input type="range" min={200} max={1000} step={100} value={delay} onChange={(e) => setDelay(Number(e.target.value))} className="cw-slider mt-1 w-full" />
                </label>
                <label className="flex cursor-pointer items-center justify-between pt-1">
                  <span>robots.txt {L({ zh: "协议遵守", en: "compliance" }, lang)}</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={robots}
                    onClick={() => { setRobots((v) => !v); log(robotsRef.current ? L({ zh: "⚠ 已关闭 robots 遵守——受限页面将被抓取。", en: "⚠ robots compliance off — restricted pages will be fetched." }, lang) : L({ zh: "已开启 robots 遵守。", en: "robots compliance on." }, lang), robotsRef.current); }}
                    className="relative h-6 w-11 rounded-full transition-colors"
                    style={{ background: robots ? "var(--cw-acc)" : "#3A4A42" }}
                  >
                    <span className="absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all" style={{ left: robots ? 22 : 2 }} />
                  </button>
                </label>
                {delay <= 400 && concurrency >= 3 && (
                  <p className="rounded-md px-2.5 py-1.5 text-[11px]" style={{ background: "rgba(251,191,36,0.1)", color: "var(--cw-warn)" }}>
                    ⚠ {L({ zh: "激进配置：有概率触发 429 限流。", en: "Aggressive config: 429 rate limits are likely." }, lang)}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { v: stats.fetched, label: { zh: "已抓取", en: "Fetched" } },
                { v: stats.queued, label: { zh: "队列中", en: "Queued" } },
                { v: stats.dup, label: { zh: "去重跳过", en: "Deduped" } },
                { v: stats.blocked, label: { zh: "robots 拦截", en: "Blocked" } },
                { v: stats.violations, label: { zh: "违规抓取", en: "Violations" } },
                { v: stats.hits429, label: { zh: "429 限流", en: "429 hits" } },
              ].map((x) => (
                <div key={x.label.en} className="rounded-xl border px-2 py-2.5" style={{ borderColor: "var(--cw-line)", background: "var(--cw-panel)" }}>
                  <div className="text-lg font-bold" style={{ color: x.label.en === "Violations" && x.v > 0 ? "var(--cw-bad)" : "var(--cw-acc)", ...MONO }}>{x.v}</div>
                  <div className="mt-0.5 text-[10px]" style={{ color: "var(--cw-muted)" }}>{L(x.label, lang)}</div>
                </div>
              ))}
            </div>

            <div className="min-h-[132px] flex-1 rounded-2xl border p-3.5 text-[11px] leading-5" style={{ borderColor: "var(--cw-line)", background: "rgba(0,0,0,0.3)", ...MONO }}>
              {logs.slice(-7).map((l, i) => (
                <div key={i} style={{ color: l.bad ? "var(--cw-warn)" : "var(--cw-muted)", animation: "cw-in .3s ease both" }}>
                  {l.t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

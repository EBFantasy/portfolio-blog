"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import BackToCase from "@/components/BackToCase";

type Lang = "zh" | "en";
type Bi = { zh: string; en: string };
const L = (b: Bi, lang: Lang) => b[lang === "en" ? "en" : "zh"];

const vars = {
  "--pm-bg": "#0F1420",
  "--pm-panel": "#161E30",
  "--pm-line": "#27324A",
  "--pm-fg": "#DCE6F5",
  "--pm-muted": "#8593AC",
  "--pm-acc": "#38BDF8",
  "--pm-warn": "#FB7185",
  "--pm-ok": "#34D399",
} as CSSProperties;

const MONO = { fontFamily: "ui-monospace, 'Cascadia Code', 'JetBrains Mono', Consolas, monospace" };

const PRODUCTS: { id: string; name: Bi; sku: string; base: number; vol: number }[] = [
  { id: "buds", name: { zh: "星尘耳机 Pro", en: "Stardust Buds Pro" }, sku: "sku-88410", base: 299, vol: 2.4 },
  { id: "kbd", name: { zh: "机械键盘 K87", en: "Mech Keyboard K87" }, sku: "sku-88411", base: 449, vol: 5.2 },
  { id: "mon", name: { zh: "4K 显示器 27″", en: '4K Monitor 27"' }, sku: "sku-88412", base: 1299, vol: 11 },
];

const WINDOW = 90;

export default function PriceMonitor({ lang, backHref, backLabel }: { lang: Lang; backHref: string; backLabel: string }) {
  const [sel, setSel] = useState(0);
  const [running, setRunning] = useState(false);
  const [prices, setPrices] = useState<number[]>(() => [PRODUCTS[0].base]);
  const [threshold, setThreshold] = useState(() => Math.round(PRODUCTS[0].base * 0.9));
  const [alerts, setAlerts] = useState(0);
  const [alertOn, setAlertOn] = useState(false);
  const [logs, setLogs] = useState<{ t: string; bad?: boolean }[]>([]);
  const ivRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const priceRef = useRef(PRODUCTS[0].base);
  const runRef = useRef(false);
  runRef.current = running;

  const product = PRODUCTS[sel];

  const pick = (i: number) => {
    pause();
    setSel(i);
    const base = PRODUCTS[i].base;
    priceRef.current = base;
    setPrices([base]);
    setThreshold(Math.round(base * 0.9));
    setAlertOn(false);
    setAlerts(0);
    setLogs([]);
  };

  const step = () => {
    const p = PRODUCTS[sel];
    let next = priceRef.current + (Math.random() - 0.48) * p.vol;
    // 向基准价回归，避免飘走
    next += (p.base - next) * 0.03;
    next = Math.max(p.base * 0.55, Math.min(p.base * 1.18, next));
    next = Math.round(next * 10) / 10;
    priceRef.current = next;
    setPrices((arr) => [...arr.slice(-(WINDOW - 1)), next]);

    const ms = 90 + Math.floor(Math.random() * 160);
    const crossed = next < threshold;
    if (crossed && !alertOn) {
      setAlertOn(true);
      setAlerts((a) => a + 1);
      setLogs((ls) => [...ls.slice(-7), { t: L({ zh: `⚠ 告警：¥${next.toFixed(1)} 已跌破阈值 ¥${threshold}（${p.name.zh}）`, en: `⚠ ALERT: ¥${next.toFixed(1)} below threshold ¥${threshold} (${p.name.en})` }, lang), bad: true }]);
    } else if (!crossed && alertOn) {
      setAlertOn(false);
    }
    setLogs((ls) => [...ls.slice(-7), { t: `GET /price/${p.sku} → 200 · ¥${next.toFixed(1)} · ${ms}ms` }]);
  };

  useEffect(() => {
    if (!running) return;
    const id = setInterval(step, 750);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, sel, threshold, alertOn]);

  const pause = () => {
    if (ivRef.current) clearInterval(ivRef.current);
    ivRef.current = null;
    setRunning(false);
  };

  const promo = () => {
    const p = PRODUCTS[sel];
    const next = Math.round(priceRef.current * 0.85 * 10) / 10;
    priceRef.current = next;
    setPrices((arr) => [...arr.slice(-(WINDOW - 1)), next]);
    setLogs((ls) => [...ls.slice(-7), { t: L({ zh: `⚡ 模拟促销：${p.name.zh} 直降 15% → ¥${next.toFixed(1)}`, en: `⚡ Promo simulated: ${p.name.en} -15% → ¥${next.toFixed(1)}` }, lang), bad: true }]);
  };

  const reset = () => {
    pause();
    const base = PRODUCTS[sel].base;
    priceRef.current = base;
    setPrices([base]);
    setAlertOn(false);
    setAlerts(0);
    setLogs([]);
  };

  // 图表几何
  const W = 640, H = 260, PAD = 12;
  const win = prices.slice(-WINDOW);
  const lo = Math.min(...win, threshold) * 0.985;
  const hi = Math.max(...win, threshold) * 1.015;
  const x = (i: number) => PAD + (i / Math.max(1, win.length - 1)) * (W - PAD * 2);
  const y = (v: number) => PAD + (1 - (v - lo) / Math.max(1, hi - lo)) * (H - PAD * 2);
  const pts = win.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const area = win.length > 1 ? `M${x(0)},${y(win[0])} ${win.map((v, i) => `L${x(i)},${y(v)}`).join(" ")} L${x(win.length - 1)},${H - PAD} L${x(0)},${H - PAD} Z` : "";
  const last = win[win.length - 1];
  const first = win[0];
  const chg = (((last - first) / first) * 100).toFixed(2);
  const lowest = Math.min(...win).toFixed(1);
  const thrY = y(threshold);

  return (
    <div className="py-14">
      <BackToCase href={backHref} label={backLabel} />
      <style>{`
        @keyframes pm-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        @keyframes pm-alert { 0% { opacity: 0; transform: scale(.92); } 55% { opacity: 1; transform: scale(1.04); } 100% { opacity: 1; transform: none; } }
        @keyframes pm-dot { 0% { r: 4; opacity: 1; } 100% { r: 12; opacity: 0; } }
        .pm-slider { accent-color: var(--pm-acc); }
      `}</style>
      <div
        className="mt-6 overflow-hidden rounded-3xl border border-zinc-200 shadow-xl dark:border-zinc-800"
        style={{ ...vars, background: "var(--pm-bg)" }}
      >
        {/* 头部 */}
        <div className="border-b px-6 py-8 sm:px-10" style={{ borderColor: "var(--pm-line)" }}>
          <span className="rounded-full px-2.5 py-1 text-xs font-semibold" style={{ background: "rgba(56,189,248,0.12)", color: "var(--pm-acc)" }}>
            {L({ zh: "自动化 Demo · 价格监控", en: "Automation Demo · Price Monitor" }, lang)}
          </span>
          <h1 className="mt-3 text-2xl font-bold sm:text-3xl" style={{ color: "var(--pm-fg)" }}>
            {L({ zh: "电商价格监控仪表盘", en: "E-commerce Price Monitor" }, lang)}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--pm-muted)" }}>
            {L(
              {
                zh: "采集器每 0.75 秒回报一次模拟价格，折线实时延伸。把阈值拖到现价上方试试，或直接点「模拟促销」压价触发告警。",
                en: "The collector reports a simulated price every 0.75s and the line extends live. Drag the threshold above the current price, or hit Promo to crash it and fire the alert.",
              },
              lang
            )}
          </p>
        </div>

        <div className="p-6 sm:p-8">
          {/* 商品切换 */}
          <div className="flex flex-wrap gap-2">
            {PRODUCTS.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => pick(i)}
                className="rounded-full border px-4 py-2 text-xs font-medium transition"
                style={
                  i === sel
                    ? { borderColor: "var(--pm-acc)", color: "var(--pm-acc)", background: "rgba(56,189,248,0.1)" }
                    : { borderColor: "var(--pm-line)", color: "var(--pm-muted)" }
                }
              >
                {L(p.name, lang)}
              </button>
            ))}
          </div>

          {/* 统计带 */}
          <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {[
              { label: { zh: "当前价", en: "Current" }, value: `¥${last.toFixed(1)}`, color: "var(--pm-fg)" },
              { label: { zh: "窗口涨跌", en: "Change" }, value: `${Number(chg) >= 0 ? "+" : ""}${chg}%`, color: Number(chg) >= 0 ? "var(--pm-ok)" : "var(--pm-warn)" },
              { label: { zh: "窗口最低", en: "Window low" }, value: `¥${lowest}`, color: "var(--pm-fg)" },
              { label: { zh: "告警次数", en: "Alerts" }, value: String(alerts), color: alerts > 0 ? "var(--pm-warn)" : "var(--pm-muted)" },
            ].map((x) => (
              <div key={x.label.en} className="rounded-xl border px-3 py-2.5" style={{ borderColor: "var(--pm-line)", background: "var(--pm-panel)" }}>
                <div className="text-lg font-bold" style={{ color: x.color, ...MONO }}>{x.value}</div>
                <div className="mt-0.5 text-[10px]" style={{ color: "var(--pm-muted)" }}>{L(x.label, lang)}</div>
              </div>
            ))}
          </div>

          {/* 图表 + 控件 */}
          <div className="mt-4 grid gap-5 lg:grid-cols-[1.6fr_1fr]">
            <div className="overflow-hidden rounded-2xl border" style={{ borderColor: "var(--pm-line)", background: "var(--pm-panel)" }}>
              <div className="flex items-center justify-between border-b px-4 py-2.5" style={{ borderColor: "var(--pm-line)" }}>
                <span className="text-xs font-semibold" style={{ color: "var(--pm-fg)", ...MONO }}>
                  {L(product.name, lang)} · {product.sku}
                </span>
                <span className="text-[10px]" style={{ color: "var(--pm-muted)" }}>
                  {running ? L({ zh: "采集中…", en: "polling…" }, lang) : L({ zh: "已暂停", en: "paused" }, lang)}
                </span>
              </div>
              <svg viewBox={`0 0 ${W} ${H}`} className="block w-full">
                {[0.25, 0.5, 0.75].map((f) => (
                  <line key={f} x1={PAD} x2={W - PAD} y1={PAD + f * (H - PAD * 2)} y2={PAD + f * (H - PAD * 2)} stroke="rgba(39,50,74,0.6)" strokeDasharray="3 5" />
                ))}
                {area && <path d={area} fill="rgba(56,189,248,0.12)" />}
                {win.length > 1 && <polyline points={pts} fill="none" stroke="var(--pm-acc)" strokeWidth="2" strokeLinejoin="round" />}
                <line x1={PAD} x2={W - PAD} y1={thrY} y2={thrY} stroke="var(--pm-warn)" strokeDasharray="6 4" strokeWidth="1.5" />
                <text x={W - PAD} y={thrY - 6} textAnchor="end" fontSize="10" fill="var(--pm-warn)" fontFamily="ui-monospace, monospace">
                  {L({ zh: "阈值", en: "threshold" }, lang)} ¥{threshold}
                </text>
                {win.length > 1 && (
                  <>
                    <circle cx={x(win.length - 1)} cy={y(last)} r="4" fill="var(--pm-acc)" />
                    <circle cx={x(win.length - 1)} cy={y(last)} r="4" fill="none" stroke="var(--pm-acc)" style={{ animation: "pm-dot 1.2s ease-out infinite" }} />
                  </>
                )}
              </svg>
            </div>

            <div className="flex flex-col gap-4">
              <div className="rounded-2xl border p-4" style={{ borderColor: "var(--pm-line)", background: "var(--pm-panel)" }}>
                <div className="flex gap-2">
                  {!running ? (
                    <button type="button" onClick={() => setRunning(true)} className="flex-1 rounded-lg px-4 py-2.5 text-sm font-bold text-black transition hover:brightness-110 active:scale-95" style={{ background: "var(--pm-acc)" }}>
                      {L({ zh: prices.length > 1 ? "继续监控" : "启动监控", en: prices.length > 1 ? "Resume" : "Start monitoring" }, lang)}
                    </button>
                  ) : (
                    <button type="button" onClick={() => setRunning(false)} className="flex-1 rounded-lg px-4 py-2.5 text-sm font-bold text-black transition hover:brightness-110 active:scale-95" style={{ background: "var(--pm-warn)" }}>
                      {L({ zh: "暂停", en: "Pause" }, lang)}
                    </button>
                  )}
                  <button type="button" onClick={promo} className="rounded-lg border px-3.5 py-2.5 text-xs font-bold transition hover:bg-white/5 active:scale-95" style={{ borderColor: "var(--pm-warn)", color: "var(--pm-warn)" }}>
                    ⚡ {L({ zh: "模拟促销", en: "Promo" }, lang)}
                  </button>
                  <button type="button" onClick={reset} className="rounded-lg border px-3.5 py-2.5 text-xs font-semibold transition hover:bg-white/5" style={{ borderColor: "var(--pm-line)", color: "var(--pm-fg)" }}>
                    {L({ zh: "重置", en: "Reset" }, lang)}
                  </button>
                </div>
                <label className="mt-4 block text-xs" style={{ color: "var(--pm-muted)" }}>
                  <span className="flex justify-between">
                    <span>{L({ zh: "告警阈值", en: "Alert threshold" }, lang)}</span>
                    <b style={{ color: "var(--pm-warn)", ...MONO }}>¥{threshold}</b>
                  </span>
                  <input
                    type="range"
                    min={Math.round(product.base * 0.55)}
                    max={Math.round(product.base * 1.1)}
                    value={threshold}
                    onChange={(e) => setThreshold(Number(e.target.value))}
                    className="pm-slider mt-1.5 w-full"
                  />
                </label>
                {alertOn && (
                  <div className="mt-3 rounded-lg border px-3 py-2 text-[11px] font-bold" style={{ borderColor: "var(--pm-warn)", color: "var(--pm-warn)", background: "rgba(251,113,133,0.08)", animation: "pm-alert .5s ease both" }}>
                    🔔 {L({ zh: "价格已跌破阈值——该通知订阅用户了", en: "Price crossed below threshold — time to notify subscribers" }, lang)}
                  </div>
                )}
              </div>

              <div className="min-h-[150px] flex-1 rounded-2xl border p-3.5 text-[11px] leading-5" style={{ borderColor: "var(--pm-line)", background: "rgba(0,0,0,0.3)", ...MONO }}>
                {logs.length === 0 ? (
                  <span style={{ color: "var(--pm-muted)" }}>{L({ zh: "点击「启动监控」开始采集…", en: "Press Start to begin polling…" }, lang)}</span>
                ) : (
                  logs.slice(-8).map((l, i) => (
                    <div key={i} style={{ color: l.bad ? "var(--pm-warn)" : "var(--pm-muted)", animation: "pm-in .3s ease both" }}>
                      {l.t}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

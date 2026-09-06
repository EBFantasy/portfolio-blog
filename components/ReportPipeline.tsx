"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import BackToCase from "@/components/BackToCase";

type Lang = "zh" | "en";
type Bi = { zh: string; en: string };
const L = (b: Bi, lang: Lang) => b[lang === "en" ? "en" : "zh"];

const vars = {
  "--rp-bg": "#141225",
  "--rp-panel": "#1C1832",
  "--rp-line": "#322A52",
  "--rp-fg": "#E6E1F5",
  "--rp-muted": "#9C93AD",
  "--rp-acc": "#A78BFA",
  "--rp-ok": "#34D399",
  "--rp-bad": "#F87171",
} as CSSProperties;

const MONO = { fontFamily: "ui-monospace, 'Cascadia Code', 'JetBrains Mono', Consolas, monospace" };

const FILES = [
  { id: "east", name: "east-region.csv", region: { zh: "华东", en: "East" }, rows: 128 },
  { id: "north", name: "north-region.csv", region: { zh: "华北", en: "North" }, rows: 96 },
  { id: "south", name: "south-region.csv", region: { zh: "华南", en: "South" }, rows: 110 },
];

type StageState = "pending" | "active" | "done";
const STAGES: { key: string; name: Bi; detail: Bi }[] = [
  { key: "validate", name: { zh: "校验", en: "Validate" }, detail: { zh: "剔除缺失字段行", en: "drop rows missing fields" } },
  { key: "clean", name: { zh: "清洗", en: "Clean" }, detail: { zh: "修复日期格式、补空值", en: "fix dates, fill blanks" } },
  { key: "dedupe", name: { zh: "去重", en: "Dedupe" }, detail: { zh: "按订单号去重", en: "unique by order id" } },
  { key: "merge", name: { zh: "合并", en: "Merge" }, detail: { zh: "三表合一", en: "union three sheets" } },
  { key: "summarize", name: { zh: "汇总", en: "Summarize" }, detail: { zh: "按大区聚合", en: "aggregate by region" } },
];

const SUMMARY = [
  { region: { zh: "华东", en: "East" }, orders: 118, amount: "45,620.00" },
  { region: { zh: "华北", en: "North" }, orders: 89, amount: "31,240.50" },
  { region: { zh: "华南", en: "South" }, orders: 98, amount: "39,876.20" },
];
const TOTAL = { orders: 305, amount: "116,736.70" };

export default function ReportPipeline({ lang, backHref, backLabel }: { lang: Lang; backHref: string; backLabel: string }) {
  const [imported, setImported] = useState(false);
  const [stageIdx, setStageIdx] = useState(-1); // -1 未开始
  const [stageState, setStageState] = useState<StageState[]>(STAGES.map(() => "pending"));
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => () => clearTimers(), []);

  const run = () => {
    clearTimers();
    setImported(true);
    setStageState(STAGES.map(() => "pending"));
    setDone(false);
    setStageIdx(0);
    setProgress(0);
    STAGES.forEach((_, i) => {
      const t0 = i * 1500 + 400;
      timers.current.push(
        setTimeout(() => {
          setStageIdx(i);
          setStageState((st) => st.map((v, j) => (j === i ? "active" : v)));
        }, t0)
      );
      // 进度动画
      for (const pct of [25, 50, 75]) {
        timers.current.push(setTimeout(() => setProgress(pct), t0 + (pct / 100) * 1000));
      }
      timers.current.push(
        setTimeout(() => {
          setProgress(100);
          setStageState((st) => st.map((v, j) => (j <= i ? "done" : v)));
          if (i === STAGES.length - 1) {
            timers.current.push(
              setTimeout(() => {
                setDone(true);
                setStageIdx(-1);
              }, 300)
            );
          }
        }, t0 + 1100)
      );
    });
  };

  const reset = () => {
    clearTimers();
    setImported(false);
    setStageState(STAGES.map(() => "pending"));
    setStageIdx(-1);
    setProgress(0);
    setDone(false);
  };

  const download = () => {
    const header = "region,orders,amount_cny";
    const rows = SUMMARY.map((r) => `${r.region.en},${r.orders},${r.amount}`);
    const total = `TOTAL,${TOTAL.orders},${TOTAL.amount}`;
    const csv = "\uFEFF" + [header, ...rows, total].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "quarterly-report.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const activeDetail = stageIdx >= 0 ? STAGES[stageIdx].detail : null;

  return (
    <div className="py-14">
      <BackToCase href={backHref} label={backLabel} />
      <style>{`
        @keyframes rp-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        @keyframes rp-fly { from { opacity: 0; transform: translateX(-26px) scale(.95); } to { opacity: 1; transform: none; } }
        .rp-bar { transition: width .45s ease; }
      `}</style>
      <div
        className="mt-6 overflow-hidden rounded-3xl border border-zinc-200 shadow-xl dark:border-zinc-800"
        style={{ ...vars, background: "var(--rp-bg)" }}
      >
        {/* 头部 */}
        <div className="border-b px-6 py-8 sm:px-10" style={{ borderColor: "var(--rp-line)" }}>
          <span className="rounded-full px-2.5 py-1 text-xs font-semibold" style={{ background: "rgba(167,139,250,0.14)", color: "var(--rp-acc)" }}>
            {L({ zh: "自动化 Demo · 报表流水线", en: "Automation Demo · Report Pipeline" }, lang)}
          </span>
          <h1 className="mt-3 text-2xl font-bold sm:text-3xl" style={{ color: "var(--rp-fg)" }}>
            {L({ zh: "多表报表自动化流水线", en: "Multi-Sheet Report Pipeline" }, lang)}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--rp-muted)" }}>
            {L(
              {
                zh: "三张区域明细表 → 校验、清洗、去重、合并、汇总，全程可视化。跑完后可以下载真实可用的 CSV 报表。",
                en: "Three regional sheets → validate, clean, dedupe, merge, summarize — fully visualized. Download a real, usable CSV when it finishes.",
              },
              lang
            )}
          </p>
        </div>

        <div className="grid gap-5 p-6 sm:p-8 lg:grid-cols-[1fr_1.5fr]">
          {/* 左：源文件 */}
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border p-4" style={{ borderColor: "var(--rp-line)", background: "var(--rp-panel)" }}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-widest" style={{ color: "var(--rp-acc)" }}>
                  {L({ zh: "源文件", en: "SOURCE FILES" }, lang)}
                </span>
                <span className="text-[10px]" style={{ color: "var(--rp-muted)", ...MONO }}>3 × CSV</span>
              </div>
              <div className="mt-3 space-y-2">
                {FILES.map((f, i) => (
                  <div
                    key={f.id}
                    className="flex items-center justify-between rounded-xl border px-3.5 py-3"
                    style={{
                      borderColor: imported ? "var(--rp-line)" : "rgba(50,42,82,0.4)",
                      background: imported ? "rgba(0,0,0,0.25)" : "transparent",
                      opacity: imported ? 1 : 0.35,
                      animation: imported ? `rp-fly .4s ease ${i * 160}ms both` : "none",
                      ...MONO,
                    }}
                  >
                    <span className="text-xs" style={{ color: "var(--rp-fg)" }}>{f.name}</span>
                    <span className="text-[10px]" style={{ color: "var(--rp-muted)" }}>{f.rows} {L({ zh: "行", en: "rows" }, lang)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={run}
                  className="flex-1 rounded-lg px-4 py-2.5 text-sm font-bold text-white transition hover:brightness-110 active:scale-95"
                  style={{ background: "linear-gradient(135deg,var(--rp-acc),#7C3AED)" }}
                >
                  {L({ zh: imported ? "重新运行流水线" : "导入并运行", en: imported ? "Run pipeline again" : "Import & run" }, lang)}
                </button>
                {imported && (
                  <button type="button" onClick={reset} className="rounded-lg border px-4 py-2.5 text-sm font-semibold transition hover:bg-white/5" style={{ borderColor: "var(--rp-line)", color: "var(--rp-fg)" }}>
                    {L({ zh: "重置", en: "Reset" }, lang)}
                  </button>
                )}
              </div>
            </div>

            {/* 汇总结果 */}
            {done && (
              <div className="rounded-2xl border p-4" style={{ borderColor: "var(--rp-line)", background: "var(--rp-panel)", animation: "rp-in .5s ease both" }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold tracking-widest" style={{ color: "var(--rp-ok)" }}>
                    ✓ {L({ zh: "汇总报表", en: "SUMMARY REPORT" }, lang)}
                  </span>
                  <button
                    type="button"
                    onClick={download}
                    className="rounded-lg px-3.5 py-2 text-[11px] font-bold text-white transition hover:brightness-110 active:scale-95"
                    style={{ background: "linear-gradient(135deg,var(--rp-ok),#059669)" }}
                  >
                    ↓ {L({ zh: "下载 report.csv", en: "Download report.csv" }, lang)}
                  </button>
                </div>
                <table className="mt-3 w-full text-xs" style={{ ...MONO }}>
                  <thead>
                    <tr style={{ color: "var(--rp-muted)" }}>
                      <th className="pb-1.5 text-left font-medium">{L({ zh: "大区", en: "Region" }, lang)}</th>
                      <th className="pb-1.5 text-right font-medium">{L({ zh: "订单数", en: "Orders" }, lang)}</th>
                      <th className="pb-1.5 text-right font-medium">{L({ zh: "销售额 (¥)", en: "Amount (¥)" }, lang)}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SUMMARY.map((r) => (
                      <tr key={r.region.en} style={{ color: "var(--rp-fg)" }}>
                        <td className="py-1">{L(r.region, lang)}</td>
                        <td className="py-1 text-right">{r.orders}</td>
                        <td className="py-1 text-right">{r.amount}</td>
                      </tr>
                    ))}
                    <tr style={{ color: "var(--rp-acc)", borderTop: "1px solid var(--rp-line)" }}>
                      <td className="pt-1.5 font-bold">{L({ zh: "合计", en: "TOTAL" }, lang)}</td>
                      <td className="pt-1.5 text-right font-bold">{TOTAL.orders}</td>
                      <td className="pt-1.5 text-right font-bold">{TOTAL.amount}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* 右：流水线 */}
          <div className="rounded-2xl border p-5" style={{ borderColor: "var(--rp-line)", background: "var(--rp-panel)" }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold tracking-widest" style={{ color: "var(--rp-acc)" }}>
                {L({ zh: "处理流水线", en: "PIPELINE" }, lang)}
              </span>
              <span className="text-[10px]" style={{ color: "var(--rp-muted)", ...MONO }}>
                {done ? L({ zh: "305 行 · 处理完成", en: "305 rows · done" }, lang) : imported ? L({ zh: "334 行输入", en: "334 rows in" }, lang) : L({ zh: "等待导入", en: "waiting for import" }, lang)}
              </span>
            </div>
            <div className="mt-4 space-y-3">
              {STAGES.map((st, i) => {
                const state = stageState[i];
                const isActive = state === "active";
                return (
                  <div
                    key={st.key}
                    className="rounded-xl border p-3.5 transition-all duration-300"
                    style={{
                      borderColor: isActive ? "var(--rp-acc)" : state === "done" ? "var(--rp-line)" : "rgba(50,42,82,0.4)",
                      background: isActive ? "rgba(167,139,250,0.08)" : "rgba(0,0,0,0.18)",
                      opacity: state === "pending" ? 0.5 : 1,
                    }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold"
                          style={{
                            background: state === "done" ? "var(--rp-ok)" : isActive ? "var(--rp-acc)" : "rgba(156,147,173,0.2)",
                            color: state === "pending" ? "var(--rp-muted)" : "#141225",
                          }}
                        >
                          {state === "done" ? "✓" : i + 1}
                        </span>
                        <span className="text-sm font-semibold" style={{ color: state === "pending" ? "var(--rp-muted)" : "var(--rp-fg)" }}>
                          {L(st.name, lang)}
                        </span>
                      </div>
                      <span className="text-[10px]" style={{ color: "var(--rp-muted)" }}>{L(st.detail, lang)}</span>
                    </div>
                    <div className="mt-2.5 h-1.5 overflow-hidden rounded-full" style={{ background: "rgba(0,0,0,0.3)" }}>
                      <div
                        className="rp-bar h-full rounded-full"
                        style={{ width: state === "done" ? "100%" : isActive ? `${progress}%` : "0%", background: isActive ? "var(--rp-acc)" : "var(--rp-ok)" }}
                      />
                    </div>
                    {isActive && activeDetail && (
                      <div className="mt-2 text-[10px]" style={{ color: "var(--rp-acc)", ...MONO, animation: "rp-in .3s ease both" }}>
                        {i === 0 && L({ zh: "剔除 12 行缺失字段…", en: "dropping 12 rows missing fields…" }, lang)}
                        {i === 1 && L({ zh: "修复 23 处日期格式 / 补 8 个空值…", en: "fixing 23 dates / filling 8 blanks…" }, lang)}
                        {i === 2 && L({ zh: "剔除 17 行重复订单…", en: "dropping 17 duplicate orders…" }, lang)}
                        {i === 3 && L({ zh: "合并三表 → 305 行…", en: "union three sheets → 305 rows…" }, lang)}
                        {i === 4 && L({ zh: "按大区聚合…", en: "aggregating by region…" }, lang)}
                      </div>
                    )}
                    {state === "done" && (
                      <div className="mt-2 text-[10px]" style={{ color: "var(--rp-ok)", ...MONO }}>
                        {i === 0 && L({ zh: "✓ 剔除 12 行 → 322 行有效", en: "✓ 12 rejected → 322 valid" }, lang)}
                        {i === 1 && L({ zh: "✓ 修复 23 处，补齐 8 个空值", en: "✓ 23 fixed, 8 blanks filled" }, lang)}
                        {i === 2 && L({ zh: "✓ 去除 17 行重复 → 305 行", en: "✓ 17 dupes removed → 305 rows" }, lang)}
                        {i === 3 && L({ zh: "✓ 三表合并完成", en: "✓ sheets unioned" }, lang)}
                        {i === 4 && L({ zh: "✓ 报表已生成", en: "✓ report ready" }, lang)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {!imported && (
              <p className="mt-4 rounded-lg border px-3.5 py-2.5 text-[11px]" style={{ borderColor: "var(--rp-line)", color: "var(--rp-muted)" }}>
                {L({ zh: "点击左侧「导入并运行」，流水线会按阶段推进。", en: "Hit \"Import & run\" on the left and the pipeline advances stage by stage." }, lang)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

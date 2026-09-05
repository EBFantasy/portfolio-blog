"use client";

import { useState } from "react";
import type { Dict } from "@/lib/i18n";

type PricingDict = Dict["playground"]["pricing"];
type Cycle = "monthly" | "yearly";
type PlanId = "free" | "pro" | "team";
type Phase = "idle" | "checkout" | "paying" | "success";

/** 三档价格（元/月）：年付按月折算 8 折 */
const PLANS: { id: PlanId; name: string; monthly: number; yearly: number }[] = [
  { id: "free", name: "Free", monthly: 0, yearly: 0 },
  { id: "pro", name: "Pro", monthly: 68, yearly: 54 },
  { id: "team", name: "Team", monthly: 188, yearly: 150 },
];

const PLAN_FEATURES: Record<PlanId, keyof PricingDict> = {
  free: "freeFeatures",
  pro: "proFeatures",
  team: "teamFeatures",
};

export default function PricingPlayground({ dict }: { dict: PricingDict }) {
  const [cycle, setCycle] = useState<Cycle>("monthly");
  const [plan, setPlan] = useState<PlanId>("free");
  const [target, setTarget] = useState<PlanId>("pro");
  const [phase, setPhase] = useState<Phase>("idle");
  /** 用户点击选中的档位（focus 外框），默认落在当前计划上 */
  const [selected, setSelected] = useState<PlanId>("free");

  const priceOf = (id: PlanId) => PLANS.find((p) => p.id === id)![cycle];
  /** 结账金额：按月 = 月价；按年 = 年价 × 12 */
  const dueOf = (id: PlanId) => (cycle === "monthly" ? priceOf(id) : priceOf(id) * 12);
  const due = dueOf(target);
  const isFreeTarget = target === "free";

  function openCheckout(id: PlanId) {
    setSelected(id);
    if (id === plan) return;
    if (id === "free") {
      // 免费档切换即时生效（模拟直接降级/重置）
      setPlan("free");
      return;
    }
    setTarget(id);
    setPhase("checkout");
  }

  function pay() {
    setPhase("paying");
    window.setTimeout(() => setPhase("success"), 1500);
  }

  function close() {
    if (phase === "success") setPlan(target);
    setPhase("idle");
  }

  return (
    <div className="mt-8">
      {/* 产品条 + 计费周期切换 */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 text-lg font-bold text-white">
            ☁
          </div>
          <div>
            <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{dict.productName}</div>
            <div className="text-xs text-zinc-400">{dict.productMeta}</div>
          </div>
        </div>
        <div className="flex items-center rounded-xl border border-zinc-200 p-1 dark:border-zinc-700">
          <CycleBtn active={cycle === "monthly"} onClick={() => setCycle("monthly")}>
            {dict.monthly}
          </CycleBtn>
          <span className="relative">
            <CycleBtn active={cycle === "yearly"} onClick={() => setCycle("yearly")}>
              {dict.yearly}
            </CycleBtn>
            <span className="absolute -right-2 -top-2.5 rounded-full bg-amber-500 px-1.5 py-px text-[9px] font-semibold text-white">
              {dict.saveBadge}
            </span>
          </span>
        </div>
      </div>

      {/* 三档卡片：整卡可点，点击出现品牌绿 focus 外框 */}
      <div role="radiogroup" aria-label={dict.matrixTitle} className="mt-6 grid gap-4 lg:grid-cols-3">
        {PLANS.map((p) => {
          const isCurrent = p.id === plan;
          const isSelected = selected === p.id;
          const features = dict[PLAN_FEATURES[p.id]] as string[];
          return (
            <div
              key={p.id}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onClick={() => setSelected(p.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelected(p.id);
                }
              }}
              className={`relative flex cursor-pointer flex-col rounded-3xl border bg-white p-6 outline-offset-2 transition hover:border-zinc-300 focus-visible:outline-2 focus-visible:outline-emerald-500 dark:bg-zinc-900 dark:hover:border-zinc-600 ${
                p.id === "team"
                  ? "border-sky-500 ring-2 ring-sky-500/30 dark:border-sky-400"
                  : "border-zinc-200 dark:border-zinc-800"
              } ${isCurrent ? "shadow-lg" : ""} ${
                isSelected ? "outline-2 outline-emerald-500" : ""
              }`}
            >
              {p.id === "team" && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-sky-500 px-3 py-1 text-[11px] font-medium text-white">
                  {dict.recommend}
                </span>
              )}
              {isSelected && (
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md ring-2 ring-white dark:ring-zinc-950">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{p.name}</span>
                {isCurrent && (
                  <span className="rounded-full bg-sky-500/10 px-2.5 py-1 text-[11px] font-medium text-sky-600 dark:text-sky-400">
                    {dict.currentPlan}
                  </span>
                )}
              </div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                  ¥{p.id === "free" ? 0 : priceOf(p.id)}
                </span>
                <span className="text-xs text-zinc-400">{dict.perMonth}</span>
              </div>
              {p.id !== "free" && cycle === "yearly" && (
                <p className="mt-1 text-[11px] text-amber-600 dark:text-amber-400">
                  ¥{priceOf(p.id)} × 12 = ¥{priceOf(p.id) * 12} / {dict.yearly}
                </p>
              )}
              <ul className="mt-5 flex-1 space-y-2.5">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-300">
                    <svg
                      viewBox="0 0 24 24"
                      className="mt-0.5 h-4 w-4 shrink-0 text-sky-500"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={3}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => openCheckout(p.id)}
                disabled={isCurrent}
                className={`mt-6 rounded-xl py-2.5 text-sm font-medium transition active:scale-[0.98] ${
                  isCurrent
                    ? "cursor-not-allowed border border-zinc-200 text-zinc-400 dark:border-zinc-700"
                    : p.id === "free"
                      ? "border border-zinc-300 text-zinc-700 hover:border-zinc-400 dark:border-zinc-600 dark:text-zinc-200"
                      : "bg-sky-600 text-white hover:bg-sky-500"
                }`}
              >
                {isCurrent ? dict.currentPlan : p.id === "free" ? dict.planFree : p.id === "pro" ? dict.planPro : dict.planTeam}
              </button>
            </div>
          );
        })}
      </div>

      {/* 功能对比矩阵 */}
      <h3 className="mt-10 text-sm font-medium text-zinc-900 dark:text-zinc-50">{dict.matrixTitle}</h3>
      <div className="mt-3 overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800">
        <table className="w-full min-w-[480px] text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/50">
              <th className="px-4 py-3 text-left font-medium text-zinc-400" />
              {PLANS.map((p) => (
                <th
                  key={p.id}
                  className={`px-4 py-3 text-center font-medium ${
                    p.id === plan ? "text-sky-600 dark:text-sky-400" : "text-zinc-600 dark:text-zinc-300"
                  }`}
                >
                  {p.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dict.matrix.map((row, i) => (
              <tr
                key={row.name}
                className={i % 2 === 1 ? "bg-zinc-50/60 dark:bg-zinc-800/30" : "bg-white dark:bg-zinc-900"}
              >
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300">{row.name}</td>
                {row.vals.map((v, j) => (
                  <td
                    key={j}
                    className={`px-4 py-3 text-center ${
                      v === "✓" ? "text-sky-500" : v === "—" ? "text-zinc-300 dark:text-zinc-600" : "text-zinc-700 dark:text-zinc-200"
                    }`}
                  >
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 结账浮窗 */}
      {(phase === "checkout" || phase === "paying" || phase === "success") && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
          <div className="absolute inset-0 bg-zinc-950/50 backdrop-blur-sm" onClick={() => phase === "checkout" && setPhase("idle")} />
          <div className="animate-pop relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-zinc-900">
            {phase === "checkout" && (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">{dict.checkoutTitle}</h3>
                  <button
                    onClick={() => setPhase("idle")}
                    className="text-xs text-zinc-400 transition hover:text-zinc-600 dark:hover:text-zinc-300"
                  >
                    ✕
                  </button>
                </div>
                <div className="mt-4 rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-800/60">
                  <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{dict.orderSummary}</div>
                  <dl className="mt-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-zinc-400">{dict.planLabel}</dt>
                      <dd className="font-medium text-zinc-800 dark:text-zinc-100">{target.toUpperCase()}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-zinc-400">{dict.cycleLabel}</dt>
                      <dd className="text-zinc-800 dark:text-zinc-100">
                        {cycle === "monthly" ? dict.cycleMonthly : dict.cycleYearly}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-zinc-400">{dict.productName}</dt>
                      <dd className="text-zinc-800 dark:text-zinc-100">
                        ¥{priceOf(target)}{dict.perMonth}
                      </dd>
                    </div>
                  </dl>
                  <div className="mt-3 flex items-center justify-between border-t border-zinc-200 pt-3 dark:border-zinc-700">
                    <span className="text-xs text-zinc-400">{dict.totalLabel || ""}</span>
                    <span className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">¥{due}</span>
                  </div>
                </div>
                <button
                  onClick={pay}
                  className="mt-5 w-full rounded-xl bg-sky-600 py-3 text-sm font-semibold text-white transition hover:bg-sky-500 active:scale-[0.98]"
                >
                  {dict.payBtn} · ¥{due}
                </button>
                <p className="mt-3 text-[11px] leading-relaxed text-zinc-400">{dict.checkoutNote}</p>
              </>
            )}
            {phase === "paying" && (
              <div className="flex flex-col items-center py-10">
                <span className="h-10 w-10 animate-spin rounded-full border-[3px] border-zinc-200 border-t-sky-600 dark:border-zinc-700 dark:border-t-sky-400" />
                <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">{dict.paying}</p>
              </div>
            )}
            {phase === "success" && (
              <div className="flex flex-col items-center text-center">
                <span className="flex h-14 w-14 animate-pop items-center justify-center rounded-full bg-sky-500">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-7 w-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
                <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">{dict.successTitle}</h3>
                <p className="mt-1 text-xs text-zinc-400">
                  {target.toUpperCase()} · {cycle === "monthly" ? dict.cycleMonthly : dict.cycleYearly} · ¥{due}
                </p>
                <button
                  onClick={close}
                  className="mt-6 w-full rounded-xl bg-zinc-900 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  {dict.close}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function CycleBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative rounded-lg px-4 py-1.5 text-xs font-medium transition ${
        active ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900" : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400"
      }`}
    >
      {children}
    </button>
  );
}

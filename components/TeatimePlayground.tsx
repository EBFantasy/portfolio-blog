"use client";

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import type { Dict } from "@/lib/i18n";
import {
  formatCents,
  sweetOptions,
  teaMenu,
  teaUnitPriceCents,
  tempOptions,
  toppingOptions,
  type TeaItem,
} from "@/lib/playground";

type TeatimeDict = Dict["playground"]["teatime"];
type Phase = "menu" | "ordering" | "success";

interface CartLine {
  key: string;
  itemId: string;
  tempId: string;
  sweetId: string;
  toppingIds: string[];
  qty: number;
}

const cupEmoji: Record<string, string> = { t1: "🧋", t2: "🍋", t3: "🥭", t4: "🍇", t5: "🌿", t6: "🧋" };

const progressKeys = ["statusQueued", "statusMaking", "statusReady"] as const;

export default function TeatimePlayground({ dict, lang }: { dict: TeatimeDict; lang: "zh" | "en" }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [specFor, setSpecFor] = useState<TeaItem | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [tempId, setTempId] = useState(tempOptions[0].id);
  const [sweetId, setSweetId] = useState(sweetOptions[0].id);
  const [toppingIds, setToppingIds] = useState<string[]>([]);
  const [phase, setPhase] = useState<Phase>("menu");
  const [order, setOrder] = useState<{ no: string; total: number; cups: number } | null>(null);
  const [progress, setProgress] = useState(0);

  const totalCents = cart.reduce((s, l) => s + teaUnitPriceCents(l.itemId, l.toppingIds) * l.qty, 0);
  const totalCups = cart.reduce((s, l) => s + l.qty, 0);
  const cartCount = cart.reduce((s, l) => s + l.qty, 0);

  /** 出餐进度自动流转：成功后每 2.8 秒推进一格（排队 -> 制作 -> 可取餐） */
  useEffect(() => {
    if (phase !== "success" || progress >= 2) return;
    const t = window.setTimeout(() => setProgress((p) => p + 1), 2800);
    return () => window.clearTimeout(t);
  }, [phase, progress]);

  function openSpec(item: TeaItem) {
    setSpecFor(item);
    setTempId(tempOptions[0].id);
    setSweetId(sweetOptions[0].id);
    setToppingIds([]);
  }

  function addToCart() {
    if (!specFor) return;
    const normKey = (ids: string[]) => [...ids].sort().join(",");
    setCart((prev) => {
      const idx = prev.findIndex(
        (l) =>
          l.itemId === specFor.id &&
          l.tempId === tempId &&
          l.sweetId === sweetId &&
          normKey(l.toppingIds) === normKey(toppingIds)
      );
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
        return next;
      }
      return [
        ...prev,
        {
          key: `${specFor.id}-${tempId}-${sweetId}-${normKey(toppingIds)}-${prev.length}`,
          itemId: specFor.id,
          tempId,
          sweetId,
          toppingIds,
          qty: 1,
        },
      ];
    });
    setSpecFor(null);
  }

  function changeQty(key: string, delta: number) {
    setCart((prev) =>
      prev.flatMap((l) => (l.key === key ? (l.qty + delta <= 0 ? [] : [{ ...l, qty: l.qty + delta }]) : [l]))
    );
  }

  function checkout() {
    if (cart.length === 0) return;
    setShowCart(false);
    setPhase("ordering");
    const total = totalCents;
    const cups = totalCups;
    window.setTimeout(() => {
      setOrder({ no: `T-${String(Math.floor(100 + Math.random() * 900))}`, total, cups });
      setProgress(0);
      setCart([]);
      setPhase("success");
    }, 1200);
  }

  function reset() {
    setPhase("menu");
    setOrder(null);
    setProgress(0);
    setShowCart(false);
  }

  function specSummary(line: CartLine): string {
    const t = tempOptions.find((o) => o.id === line.tempId)?.label[lang];
    const s = sweetOptions.find((o) => o.id === line.sweetId)?.label[lang];
    const tops = toppingOptions.filter((o) => line.toppingIds.includes(o.id)).map((o) => o.label[lang]);
    return [t, s, ...tops].join(" / ");
  }

  const specSubtotal = specFor ? teaUnitPriceCents(specFor.id, toppingIds) : 0;
  const queueAhead = progress === 0 ? 2 : progress === 1 ? 1 : 0;

  return (
    <div className="mt-8">
      {/* 店铺条 */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-xl">
            🧋
          </div>
          <div>
            <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{dict.shopName}</div>
            <div className="text-xs text-zinc-400">{dict.shopMeta}</div>
          </div>
        </div>
        <div className="text-xs text-zinc-400">{dict.menuLabel}</div>
      </div>

      {/* 菜单 */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {teaMenu.map((item) => (
          <div
            key={item.id}
            className="group flex flex-col rounded-2xl border border-zinc-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-amber-600"
          >
            <div className="relative flex h-24 items-center justify-center rounded-xl text-3xl opacity-90 transition group-hover:opacity-100">
              <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${item.grad} opacity-20`} />
              <span className="relative">{cupEmoji[item.id]}</span>
              {item.tag && (
                <span
                  className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-medium text-white ${
                    item.tag === "hot" ? "bg-rose-500" : "bg-sky-500"
                  }`}
                >
                  {item.tag === "hot" ? dict.tagHot : dict.tagNew}
                </span>
              )}
            </div>
            <div className="mt-3 flex-1">
              <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{item.name[lang]}</div>
              <div className="mt-0.5 text-xs text-zinc-400">{item.desc[lang]}</div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                ¥{formatCents(item.baseCents)}
              </span>
              <button
                onClick={() => openSpec(item)}
                className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-amber-600 active:scale-[0.97]"
              >
                {dict.specTitle}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 购物车栏 */}
      <div className="sticky bottom-4 z-20 mt-6 flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white/95 p-4 shadow-lg backdrop-blur dark:border-zinc-700 dark:bg-zinc-900/95">
        <button
          onClick={() => cartCount > 0 && setShowCart(true)}
          className="relative flex min-w-0 flex-1 items-center gap-2.5 text-left"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-sm text-amber-600 dark:text-amber-400">
            🛒
          </span>
          <span className="min-w-0">
            <span className="block text-xs text-zinc-400">
              {dict.cartLabel} · {cartCount}
            </span>
            {cartCount === 0 ? (
              <span className="mt-0.5 block truncate text-sm text-zinc-400">{dict.cartEmpty}</span>
            ) : (
              <span className="mt-0.5 block truncate text-sm text-zinc-700 dark:text-zinc-200">
                {cart.map((l) => teaMenu.find((t) => t.id === l.itemId)?.name[lang]).join("、")}
              </span>
            )}
          </span>
        </button>
        <div className="text-right">
          <div className="text-xs text-zinc-400">{dict.totalLabel}</div>
          <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">¥{formatCents(totalCents)}</div>
        </div>
        <button
          onClick={checkout}
          disabled={cartCount === 0}
          className="rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-amber-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {dict.checkout}
        </button>
      </div>

      {/* 规格浮层 */}
      {specFor && phase === "menu" && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
          <div className="absolute inset-0 bg-zinc-950/50 backdrop-blur-sm" onClick={() => setSpecFor(null)} />
          <div className="animate-pop relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-zinc-900">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">{dict.specTitle}</h3>
                <p className="mt-0.5 text-xs text-zinc-400">{specFor.name[lang]}</p>
              </div>
              <button
                onClick={() => setSpecFor(null)}
                className="flex h-7 w-7 items-center justify-center rounded-full text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
                aria-label="close"
              >
                ✕
              </button>
            </div>

            <SpecGroup
              label={dict.tempLabel}
              options={tempOptions}
              selectedId={tempId}
              lang={lang}
              onSelect={setTempId}
              accent="amber"
            />
            <SpecGroup
              label={dict.sweetLabel}
              options={sweetOptions}
              selectedId={sweetId}
              lang={lang}
              onSelect={setSweetId}
              accent="amber"
            />
            <SpecGroup
              label={dict.toppingLabel}
              options={toppingOptions}
              selectedIds={toppingIds}
              lang={lang}
              onToggle={(id) =>
                setToppingIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
              }
              accent="amber"
              freeLabel={dict.toppingFree}
            />

            <div className="mt-5 flex items-center justify-between border-t border-zinc-200 pt-4 dark:border-zinc-700">
              <div>
                <div className="text-xs text-zinc-400">{dict.unitPrice}</div>
                <div className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                  ¥{formatCents(specSubtotal)}
                </div>
              </div>
              <button
                onClick={addToCart}
                className="rounded-xl bg-amber-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600 active:scale-[0.98]"
              >
                {dict.addToCart}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 购物车明细浮层 */}
      {showCart && phase === "menu" && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
          <div className="absolute inset-0 bg-zinc-950/50 backdrop-blur-sm" onClick={() => setShowCart(false)} />
          <div className="animate-pop relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-zinc-900">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">{dict.cartLabel}</h3>
              <button
                onClick={() => setCart([])}
                disabled={cart.length === 0}
                className="text-xs text-zinc-400 transition hover:text-rose-500 disabled:opacity-40"
              >
                {dict.clearCart}
              </button>
            </div>
            <div className="mt-4 max-h-72 space-y-3 overflow-y-auto">
              {cart.length === 0 && <p className="py-6 text-center text-sm text-zinc-400">{dict.cartEmpty}</p>}
              {cart.map((line) => {
                const item = teaMenu.find((t) => t.id === line.itemId);
                if (!item) return null;
                return (
                  <div
                    key={line.key}
                    className="flex items-center gap-3 rounded-xl border border-zinc-100 p-3 dark:border-zinc-800"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="truncate text-sm text-zinc-800 dark:text-zinc-100">{item.name[lang]}</div>
                      <div className="mt-0.5 truncate text-xs text-zinc-400">{specSummary(line)}</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <QtyBtn onClick={() => changeQty(line.key, -1)}>−</QtyBtn>
                      <span className="w-6 text-center text-sm font-medium text-zinc-800 dark:text-zinc-100">
                        {line.qty}
                      </span>
                      <QtyBtn onClick={() => changeQty(line.key, 1)}>＋</QtyBtn>
                    </div>
                    <div className="w-16 text-right text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                      ¥{formatCents(teaUnitPriceCents(line.itemId, line.toppingIds) * line.qty)}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-zinc-200 pt-4 dark:border-zinc-700">
              <div className="text-sm text-zinc-400">{dict.totalLabel}</div>
              <div className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">¥{formatCents(totalCents)}</div>
            </div>
            <button
              onClick={checkout}
              disabled={cart.length === 0}
              className="mt-4 w-full rounded-xl bg-amber-500 py-3 text-sm font-semibold text-white transition hover:bg-amber-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {dict.checkout} · ¥{formatCents(totalCents)}
            </button>
          </div>
        </div>
      )}

      {/* 下单中 / 成功浮窗 */}
      {(phase === "ordering" || phase === "success") && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
          <div className="absolute inset-0 bg-zinc-950/50 backdrop-blur-sm" />
          <div className="animate-pop relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-zinc-900">
            {phase === "ordering" && (
              <div className="flex flex-col items-center py-10">
                <span className="h-10 w-10 animate-spin rounded-full border-[3px] border-zinc-200 border-t-amber-500 dark:border-zinc-700 dark:border-t-amber-400" />
                <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">{dict.ordering}</p>
              </div>
            )}
            {phase === "success" && order && (
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
                <div className="mt-5 w-full rounded-2xl border border-dashed border-zinc-300 p-5 dark:border-zinc-600">
                  <div className="text-[11px] tracking-widest text-zinc-400">{dict.pickupNo}</div>
                  <div className="mt-1 font-mono text-3xl font-bold tracking-[0.2em] text-zinc-900 dark:text-zinc-50">
                    {order.no}
                  </div>
                  <div className="mt-2 text-xs text-zinc-400">
                    ¥{formatCents(order.total)}
                  </div>
                </div>

                {/* 出餐进度 */}
                <div className="mt-5 w-full">
                  <div className="text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    {dict.progressLabel}
                  </div>
                  <div className="mt-3 flex items-center">
                    {progressKeys.map((k, i) => (
                      <Fragment key={k}>
                        {i > 0 && (
                          <span
                            className={`h-0.5 flex-1 transition-colors duration-500 ${
                              progress >= i ? "bg-sky-500" : "bg-zinc-200 dark:bg-zinc-700"
                            }`}
                          />
                        )}
                        <span
                          className={`flex h-6 w-6 items-center justify-center rounded-full border-2 text-[10px] font-semibold transition-all duration-500 ${
                            progress >= i
                              ? "border-sky-500 bg-sky-500 text-white"
                              : "border-zinc-300 bg-white text-zinc-400 dark:border-zinc-600 dark:bg-zinc-800"
                          }`}
                        >
                          {i + 1}
                        </span>
                      </Fragment>
                    ))}
                  </div>
                  <div className="mt-2 flex justify-between text-[11px] text-zinc-400">
                    {progressKeys.map((k, i) => (
                      <span key={k} className={progress === i ? "font-medium text-sky-600 dark:text-sky-400" : ""}>
                        {dict[k]}
                      </span>
                    ))}
                  </div>
                  {queueAhead > 0 && (
                    <p className="mt-2 text-center text-xs text-amber-600 dark:text-amber-400">
                      {dict.queueNote.replace("{n}", String(queueAhead))}
                    </p>
                  )}
                </div>

                <p className="mt-3 text-[11px] leading-relaxed text-zinc-400">{dict.pickupNote}</p>
                <div className="mt-5 flex w-full gap-2.5">
                  <button
                    onClick={reset}
                    className="flex-1 rounded-xl border border-zinc-200 py-2.5 text-sm text-zinc-600 transition hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-600"
                  >
                    {dict.again}
                  </button>
                  <Link
                    href={`/${lang}/work/teatime-ordering`}
                    className="flex-1 rounded-xl bg-zinc-900 py-2.5 text-center text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                  >
                    {dict.back}
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function QtyBtn({ onClick, children }: { onClick: () => void; children: string }) {
  return (
    <button
      onClick={onClick}
      className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-100 text-sm text-zinc-600 transition hover:bg-amber-500 hover:text-white dark:bg-zinc-800 dark:text-zinc-300"
    >
      {children}
    </button>
  );
}

function SpecGroup({
  label,
  options,
  selectedId,
  selectedIds,
  lang,
  onSelect,
  onToggle,
  accent = "amber",
  freeLabel,
}: {
  label: string;
  options: { id: string; label: { zh: string; en: string }; extraCents: number }[];
  selectedId?: string;
  selectedIds?: string[];
  lang: "zh" | "en";
  onSelect?: (id: string) => void;
  onToggle?: (id: string) => void;
  accent?: "amber" | "sky";
  freeLabel?: string;
}) {
  const active = (id: string) => (selectedIds ? selectedIds.includes(id) : selectedId === id);
  return (
    <div className="mt-4">
      <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{label}</div>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.id}
            onClick={() => (onToggle ? onToggle(o.id) : onSelect?.(o.id))}
            className={`rounded-lg border px-3 py-1.5 text-xs transition ${
              active(o.id)
                ? accent === "amber"
                  ? "border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                  : "border-sky-500 bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400"
                : "border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-600"
            }`}
          >
            {o.label[lang]}
            {o.extraCents > 0 && <span className="ml-1 opacity-70">+¥{formatCents(o.extraCents)}</span>}
            {o.extraCents === 0 && freeLabel && <span className="ml-1 opacity-50">{freeLabel}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

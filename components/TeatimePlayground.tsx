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
type Phase = "menu" | "pay" | "ordering" | "success";

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
  /** 结账浮层内选中的支付方式索引 */
  const [payMethod, setPayMethod] = useState(0);

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

  /** 去结算：进入支付确认浮层（微信小程序场景，仅微信支付） */
  function openPay() {
    if (cart.length === 0) return;
    setShowCart(false);
    setPayMethod(0);
    setPhase("pay");
  }

  /** 确认支付：模拟支付流程后出票 */
  function confirmPay() {
    if (cart.length === 0) return;
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

  /** 支付方式选项：微信收银台场景。zh: 微信支付/银行卡；en: WeChat Pay/Visa/Mastercard
   *  （微信支付境外版支持绑定 Visa 与 Mastercard，小程序内不支持 PayPal） */
  const payIconWechat = (
    <span
      className="flex h-7 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white"
      aria-hidden
    >
      微
    </span>
  );
  const payIconCard = (
    <span
      className="flex h-7 w-10 shrink-0 items-center justify-center rounded-md bg-indigo-500 text-white"
      aria-hidden
    >
      <svg
        viewBox="0 0 24 24"
        className="h-3.5 w-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
        <path d="M2.5 10h19" />
      </svg>
    </span>
  );
  const payIconVisa = (
    <span
      className="flex h-7 w-10 shrink-0 items-center justify-center rounded-md bg-blue-700 text-[9px] font-black italic tracking-tight text-white"
      aria-hidden
    >
      VISA
    </span>
  );
  const payIconMc = (
    <span
      className="flex h-7 w-10 shrink-0 items-center justify-center rounded-md bg-zinc-100 dark:bg-zinc-800"
      aria-hidden
    >
      <span className="flex items-center">
        <span className="h-3.5 w-3.5 rounded-full bg-red-500" />
        <span className="-ml-1.5 h-3.5 w-3.5 rounded-full bg-amber-400/90" />
      </span>
    </span>
  );
  const payOptions =
    lang === "zh"
      ? [
          { icon: payIconWechat, label: dict.payWechat },
          { icon: payIconCard, label: dict.payBank },
        ]
      : [
          { icon: payIconWechat, label: dict.payWechat },
          { icon: payIconVisa, label: dict.payVisa },
          { icon: payIconMc, label: dict.payMc },
        ];

  return (
    <div className="mt-10">
      {/* 手机外框 */}
      <div className="mx-auto w-full max-w-[400px]">
        <div className="rounded-[3rem] border-[10px] border-zinc-800 bg-zinc-800 shadow-2xl ring-1 ring-zinc-900/10 dark:border-zinc-700 dark:bg-zinc-700 dark:ring-white/10">
          {/* 屏幕：灵动岛 / 状态栏 / 小程序导航栏 / 滚动内容 / 底部购物车 / home indicator */}
          <div className="relative flex h-[680px] flex-col overflow-hidden rounded-[2.3rem] bg-zinc-50 dark:bg-zinc-950">
            {/* 灵动岛 */}
            <div className="pointer-events-none absolute left-1/2 top-2 z-30 h-[18px] w-20 -translate-x-1/2 rounded-full bg-black" />

            {/* 状态栏 */}
            <div className="relative z-10 flex shrink-0 items-center justify-between bg-white/95 px-6 pb-1.5 pt-2.5 text-[11px] font-semibold text-zinc-800 backdrop-blur dark:bg-zinc-900/95 dark:text-zinc-100">
              <span>9:41</span>
              <span className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-300">
                <svg viewBox="0 0 20 12" className="h-2.5 w-4" fill="currentColor" aria-hidden>
                  <rect x="0" y="8" width="3" height="4" rx="0.5" />
                  <rect x="5" y="5.5" width="3" height="6.5" rx="0.5" />
                  <rect x="10" y="3" width="3" height="9" rx="0.5" />
                  <rect x="15" y="0" width="3" height="12" rx="0.5" />
                </svg>
                <svg viewBox="0 0 28 12" className="h-2.5 w-6" fill="none" stroke="currentColor" aria-hidden>
                  <rect x="0.5" y="0.5" width="23" height="11" rx="3" />
                  <rect x="2.5" y="2.5" width="16" height="7" rx="1.5" fill="currentColor" stroke="none" />
                  <path d="M26 4v4" strokeLinecap="round" />
                </svg>
              </span>
            </div>

            {/* 小程序导航栏 */}
            <div className="relative z-10 flex shrink-0 items-center justify-between border-b border-zinc-100 bg-white/95 px-3 py-2 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/95">
              <div className="flex min-w-0 items-center gap-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-200">
                <span aria-hidden>🧋</span>
                <span className="truncate">{dict.shopName}</span>
              </div>
              <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-zinc-200 bg-white/80 px-2.5 py-0.5 text-[10px] leading-4 text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-400">
                <span className="tracking-[0.1em]" aria-hidden>
                  •••
                </span>
                <span className="h-2.5 w-px bg-zinc-200 dark:bg-zinc-700" aria-hidden />
                <span aria-hidden>◉</span>
              </div>
            </div>

            {/* 滚动内容区：店铺条 + 菜单（屏内滚动） */}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-zinc-50 [scrollbar-width:thin] dark:bg-zinc-950">
              <div className="mx-3 mt-3 flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-3 py-2.5 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex min-w-0 items-center gap-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 text-sm">
                    🧋
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-xs font-medium text-zinc-900 dark:text-zinc-50">
                      {dict.shopName}
                    </div>
                    <div className="truncate text-[10px] text-zinc-400">{dict.shopMeta}</div>
                  </div>
                </div>
                <div className="shrink-0 text-[10px] text-zinc-400">{dict.menuLabel}</div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2.5 px-3 pb-4">
                {teaMenu.map((item) => (
                  <div
                    key={item.id}
                    className="group flex flex-col rounded-xl border border-zinc-200 bg-white p-2.5 transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-amber-600"
                  >
                    <div className="relative flex h-20 items-center justify-center rounded-lg text-2xl opacity-90 transition group-hover:opacity-100">
                      <div className={`absolute inset-0 rounded-lg bg-gradient-to-br ${item.grad} opacity-20`} />
                      <span className="relative">{cupEmoji[item.id]}</span>
                      {item.tag && (
                        <span
                          className={`absolute left-1.5 top-1.5 rounded-full px-1.5 py-px text-[9px] font-medium text-white ${
                            item.tag === "hot" ? "bg-rose-500" : "bg-sky-500"
                          }`}
                        >
                          {item.tag === "hot" ? dict.tagHot : dict.tagNew}
                        </span>
                      )}
                    </div>
                    <div className="mt-2 truncate text-xs font-medium text-zinc-900 dark:text-zinc-50">
                      {item.name[lang]}
                    </div>
                    <div className="mt-0.5 truncate text-[10px] text-zinc-400">{item.desc[lang]}</div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                        ¥{formatCents(item.baseCents)}
                      </span>
                      <button
                        onClick={() => openSpec(item)}
                        className="rounded-lg bg-amber-500 px-2.5 py-1 text-[11px] font-medium text-white transition hover:bg-amber-600 active:scale-[0.97]"
                      >
                        {dict.specTitle}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 底部购物车栏（固定于手机屏幕内，不随内容滚动） */}
            <div className="z-20 shrink-0 border-t border-zinc-200 bg-white/95 px-3 py-2.5 backdrop-blur dark:border-zinc-700 dark:bg-zinc-900/95">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => cartCount > 0 && setShowCart(true)}
                  className="relative flex min-w-0 flex-1 items-center gap-2 text-left"
                >
                  <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-xs text-amber-600 dark:text-amber-400">
                    🛒
                    {cartCount > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-0.5 text-[9px] font-bold text-white">
                        {cartCount}
                      </span>
                    )}
                  </span>
                  <span className="min-w-0">
                    {cartCount === 0 ? (
                      <span className="block truncate text-xs text-zinc-400">{dict.cartEmpty}</span>
                    ) : (
                      <span className="block truncate text-xs text-zinc-700 dark:text-zinc-200">
                        {cart.map((l) => teaMenu.find((t) => t.id === l.itemId)?.name[lang]).join("、")}
                      </span>
                    )}
                  </span>
                </button>
                <div className="shrink-0 text-right">
                  <div className="text-lg font-semibold leading-5 text-zinc-900 dark:text-zinc-50">
                    ¥{formatCents(totalCents)}
                  </div>
                </div>
                <button
                  onClick={openPay}
                  disabled={cartCount === 0}
                  className="shrink-0 rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-medium text-white transition hover:bg-amber-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {dict.checkout}
                </button>
              </div>
            </div>

            {/* home indicator */}
            <div className="z-20 flex shrink-0 justify-center bg-white py-1.5 dark:bg-zinc-900">
              <span className="h-1 w-24 rounded-full bg-zinc-300 dark:bg-zinc-600" />
            </div>

            {/* 规格浮层（屏幕内 bottom sheet） */}
            {specFor && phase === "menu" && (
              <div className="absolute inset-0 z-40 flex items-end">
                <div className="absolute inset-0 bg-zinc-950/50 backdrop-blur-sm" onClick={() => setSpecFor(null)} />
                <div className="animate-pop relative max-h-[88%] w-full overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl dark:bg-zinc-900">
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

            {/* 购物车明细浮层（屏幕内 bottom sheet） */}
            {showCart && phase === "menu" && (
              <div className="absolute inset-0 z-40 flex items-end">
                <div className="absolute inset-0 bg-zinc-950/50 backdrop-blur-sm" onClick={() => setShowCart(false)} />
                <div className="animate-pop relative max-h-[80%] w-full overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl dark:bg-zinc-900">
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
                  <div className="mt-4 max-h-64 space-y-3 overflow-y-auto">
                    {cart.length === 0 && (
                      <p className="py-6 text-center text-sm text-zinc-400">{dict.cartEmpty}</p>
                    )}
                    {cart.map((line) => {
                      const item = teaMenu.find((t) => t.id === line.itemId);
                      if (!item) return null;
                      return (
                        <div
                          key={line.key}
                          className="flex items-center gap-3 rounded-xl border border-zinc-100 p-3 dark:border-zinc-800"
                        >
                          <div className="min-w-0 flex-1">
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
                    <div className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                      ¥{formatCents(totalCents)}
                    </div>
                  </div>
                  <button
                    onClick={openPay}
                    disabled={cart.length === 0}
                    className="mt-4 w-full rounded-xl bg-amber-500 py-3 text-sm font-semibold text-white transition hover:bg-amber-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {dict.checkout} · ¥{formatCents(totalCents)}
                  </button>
                </div>
              </div>
            )}

            {/* 支付确认浮层（微信小程序场景：仅微信支付） */}
            {phase === "pay" && (
              <div className="absolute inset-0 z-40 flex items-end">
                <div className="absolute inset-0 bg-zinc-950/50 backdrop-blur-sm" onClick={() => setPhase("menu")} />
                <div className="animate-pop relative w-full rounded-t-3xl bg-white p-5 shadow-2xl dark:bg-zinc-900">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">{dict.payTitle}</h3>
                    <button
                      onClick={() => setPhase("menu")}
                      className="flex h-7 w-7 items-center justify-center rounded-full text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
                      aria-label="close"
                    >
                      ✕
                    </button>
                  </div>

                  {/* 订单摘要 */}
                  <div className="mt-4 rounded-2xl bg-zinc-50 p-3.5 dark:bg-zinc-800/60">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-500 dark:text-zinc-400">
                        {totalCups} {dict.cupsUnit}
                      </span>
                      <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                        ¥{formatCents(totalCents)}
                      </span>
                    </div>
                  </div>

                  {/* 支付方式：微信支付收银台（可选零钱/银行卡；海外版支持绑定 Visa/Mastercard） */}
                  <div className="mt-4">
                    <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{dict.payMethodLabel}</div>
                    <div className="mt-2 space-y-2">
                      {payOptions.map((opt, i) => (
                        <button
                          key={opt.label}
                          onClick={() => setPayMethod(i)}
                          className={`flex w-full items-center justify-between rounded-xl border-2 px-3.5 py-2.5 text-left transition active:scale-[0.99] ${
                            payMethod === i
                              ? "border-amber-500 bg-amber-500/10"
                              : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600"
                          }`}
                        >
                          <span className="flex min-w-0 items-center gap-2.5">
                            {opt.icon}
                            <span className="text-sm font-medium text-zinc-800 dark:text-zinc-100">{opt.label}</span>
                          </span>
                          <span
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${
                              payMethod === i
                                ? "border-amber-500 bg-amber-500 text-white"
                                : "border-zinc-300 dark:border-zinc-600"
                            }`}
                          >
                            {payMethod === i && (
                              <svg
                                viewBox="0 0 24 24"
                                className="h-3 w-3"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={3.5}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden
                              >
                                <path d="M20 6L9 17l-5-5" />
                              </svg>
                            )}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={confirmPay}
                    disabled={cart.length === 0}
                    className="mt-5 w-full rounded-xl bg-amber-500 py-3 text-sm font-semibold text-white transition hover:bg-amber-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {dict.payNow} · ¥{formatCents(totalCents)}
                  </button>
                  <p className="mt-3 text-[11px] leading-relaxed text-zinc-400">{dict.payNote}</p>
                </div>
              </div>
            )}

            {/* 下单中 / 成功浮窗（屏幕内居中） */}
            {(phase === "ordering" || phase === "success") && (
              <div className="absolute inset-0 z-40 flex items-center p-4">
                <div className="absolute inset-0 bg-zinc-950/50 backdrop-blur-sm" />
                <div className="animate-pop relative max-h-full w-full overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl dark:bg-zinc-900">
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
                      <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                        {dict.successTitle}
                      </h3>
                      <div className="mt-5 w-full rounded-2xl border border-dashed border-zinc-300 p-5 dark:border-zinc-600">
                        <div className="text-[11px] tracking-widest text-zinc-400">{dict.pickupNo}</div>
                        <div className="mt-1 font-mono text-3xl font-bold tracking-[0.2em] text-zinc-900 dark:text-zinc-50">
                          {order.no}
                        </div>
                        <div className="mt-2 text-xs text-zinc-400">¥{formatCents(order.total)}</div>
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
                            <span
                              key={k}
                              className={progress === i ? "font-medium text-sky-600 dark:text-sky-400" : ""}
                            >
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
        </div>
      </div>
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

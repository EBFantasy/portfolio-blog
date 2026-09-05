"use client";

import Link from "next/link";
import { Fragment, useState } from "react";
import type { Dict } from "@/lib/i18n";
import {
  AISLE_AFTER,
  MAX_SEATS,
  SEAT_COLS,
  SEAT_ROWS,
  cinemaSessions,
  formatCents,
  isSold,
  seatPriceCents,
  seatTier,
} from "@/lib/playground";

type CinemaDict = Dict["playground"]["cinema"];
type Phase = "picking" | "checkout" | "paying" | "success";
type PayMethod = "wechat" | "alipay" | "card";

const payMethods: { id: PayMethod; dot: string }[] = [
  { id: "wechat", dot: "bg-emerald-500" },
  { id: "alipay", dot: "bg-sky-500" },
  { id: "card", dot: "bg-violet-500" },
];

export default function CinemaPlayground({ dict, lang }: { dict: CinemaDict; lang: "zh" | "en" }) {
  const [sessionId, setSessionId] = useState(cinemaSessions[0].id);
  const [picked, setPicked] = useState<string[]>([]);
  const [phase, setPhase] = useState<Phase>("picking");
  const [payMethod, setPayMethod] = useState<PayMethod>("wechat");
  const [warn, setWarn] = useState(false);
  const [order, setOrder] = useState<{ id: string; code: string } | null>(null);

  const session = cinemaSessions.find((s) => s.id === sessionId) ?? cinemaSessions[0];
  const total = picked.reduce((sum, seat) => sum + seatPriceCents(seat[0]), 0);
  const picking = phase === "picking";

  const payMethodLabel: Record<PayMethod, string> = {
    wechat: dict.payWechat,
    alipay: dict.payAlipay,
    card: dict.payCard,
  };

  function switchSession(id: string) {
    if (!picking) return;
    setSessionId(id);
    setPicked([]);
  }

  function toggleSeat(row: string, col: number) {
    if (!picking) return;
    const seat = `${row}${col + 1}`;
    if (picked.includes(seat)) {
      setPicked(picked.filter((s) => s !== seat));
    } else if (picked.length >= MAX_SEATS) {
      setWarn(true);
      window.setTimeout(() => setWarn(false), 2600);
    } else {
      setPicked([...picked, seat]);
    }
  }

  function pay() {
    setPhase("paying");
    window.setTimeout(() => {
      setOrder({
        id: `EB-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
        code: String(1000 + Math.floor(Math.random() * 9000)),
      });
      setPhase("success");
    }, 1600);
  }

  function reset() {
    setPicked([]);
    setOrder(null);
    setPayMethod("wechat");
    setPhase("picking");
  }

  return (
    <div className="mt-8">
      {/* 影片条 */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-9 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-rose-500 to-pink-600 text-[10px] font-bold text-white">
            IMAX
          </div>
          <div>
            <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{dict.movieTitle}</div>
            <div className="text-xs text-zinc-400">{dict.movieMeta}</div>
          </div>
        </div>
        <div className="text-xs text-zinc-400">{dict.vipNote}</div>
      </div>

      {/* 场次选择 */}
      <h3 className="mt-8 text-sm font-medium text-zinc-900 dark:text-zinc-50">{dict.sessionLabel}</h3>
      <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {cinemaSessions.map((s) => (
          <button
            key={s.id}
            onClick={() => switchSession(s.id)}
            disabled={!picking}
            className={`rounded-xl border px-3 py-2.5 text-left transition-all duration-150 ${
              s.id === sessionId
                ? "border-rose-500 bg-rose-50 dark:bg-rose-500/10"
                : "border-zinc-200 enabled:hover:-translate-y-0.5 enabled:hover:border-zinc-300 enabled:hover:shadow-sm dark:border-zinc-700 dark:enabled:hover:border-zinc-600"
            } disabled:cursor-default`}
          >
            <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{s.time}</div>
            <div className="mt-0.5 text-[11px] text-zinc-400">
              {s.hall[lang]} · {s.audio[lang]}
            </div>
          </button>
        ))}
      </div>

      {/* 图例 */}
      <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-zinc-500 dark:text-zinc-400">
        <Legend swatch="border border-zinc-300 bg-white dark:border-zinc-600 dark:bg-zinc-800" label={dict.legendAvailable} />
        <Legend swatch="border border-rose-400 bg-rose-50 dark:border-rose-400/70 dark:bg-rose-500/10" label={dict.legendVip} />
        <Legend swatch="bg-gradient-to-br from-rose-500 to-pink-600" label={dict.legendSelected} />
        <Legend swatch="bg-zinc-300 dark:bg-zinc-700" label={dict.legendSold} />
        <span className="ml-auto">{dict.maxSeatsNote}</span>
      </div>

      {/* 银幕 + 座位图 */}
      <div className="mt-6 rounded-3xl border border-zinc-200 bg-white p-5 sm:p-8 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto h-10 w-4/5 rounded-[100%] border-2 border-b-0 border-zinc-300 dark:border-zinc-600" />
        <p className="mt-1 text-center text-[11px] tracking-[0.35em] text-zinc-400">{dict.screenNote}</p>

        <div className="mt-6 space-y-1.5 overflow-x-auto pb-1">
          {SEAT_ROWS.map((row) => (
            <div key={row} className="flex items-center justify-center gap-1.5 sm:gap-2">
              <span className="w-4 shrink-0 text-center text-[10px] text-zinc-400">{row}</span>
              {Array.from({ length: SEAT_COLS }, (_, c) => {
                const sold = isSold(sessionId, row, c);
                const seat = `${row}${c + 1}`;
                const selected = picked.includes(seat);
                const vip = seatTier(row) === "vip";
                return (
                  <Fragment key={c}>
                    {AISLE_AFTER.includes(c) && <span className="w-3 shrink-0 sm:w-5" />}
                    <button
                      onClick={() => toggleSeat(row, c)}
                      disabled={sold || !picking}
                      title={sold ? undefined : `${seat} ¥${formatCents(seatPriceCents(row))}`}
                      aria-label={seat}
                      className={`h-5 w-5 shrink-0 rounded-[5px] transition-all duration-150 sm:h-6 sm:w-6 ${
                        sold
                          ? "cursor-not-allowed bg-zinc-300 dark:bg-zinc-700"
                          : selected
                            ? "scale-110 bg-gradient-to-br from-rose-500 to-pink-600 shadow-md"
                            : vip
                              ? "border border-rose-400/80 bg-rose-50 enabled:hover:-translate-y-0.5 enabled:hover:shadow dark:bg-rose-500/10"
                              : "border border-zinc-300 bg-white enabled:hover:-translate-y-0.5 enabled:hover:shadow dark:border-zinc-600 dark:bg-zinc-800"
                      }`}
                    />
                  </Fragment>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* 超选警告 */}
      {warn && (
        <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
          {dict.maxSeatsWarn}
        </p>
      )}

      {/* 结算栏 */}
      <div className="sticky bottom-4 z-20 mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-zinc-200 bg-white/95 p-4 shadow-lg backdrop-blur dark:border-zinc-700 dark:bg-zinc-900/95">
        <div className="min-w-0 flex-1">
          <div className="text-xs text-zinc-400">{dict.pickedLabel}</div>
          {picked.length === 0 ? (
            <p className="mt-1 truncate text-sm text-zinc-400">{dict.emptyPicked}</p>
          ) : (
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {picked.map((seat) => (
                <button
                  key={seat}
                  onClick={() => toggleSeat(seat[0], Number(seat.slice(1)) - 1)}
                  className="rounded-md bg-rose-500/10 px-2 py-0.5 text-xs font-medium text-rose-600 transition hover:bg-rose-500/20 dark:text-rose-400"
                >
                  {seat} ×
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="text-right">
          <div className="text-xs text-zinc-400">{dict.totalLabel}</div>
          <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">¥{formatCents(total)}</div>
        </div>
        <button
          onClick={() => setPhase("checkout")}
          disabled={picked.length === 0}
          className="rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {dict.lockBtn}
        </button>
      </div>

      {/* 收银台 / 支付 / 成功 modal */}
      {phase !== "picking" && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
          <div
            className="absolute inset-0 bg-zinc-950/50 backdrop-blur-sm"
            onClick={() => phase === "checkout" && setPhase("picking")}
          />
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-zinc-900 sm:p-7">
            {phase === "checkout" && (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">{dict.checkoutTitle}</h3>
                  <button
                    onClick={() => setPhase("picking")}
                    className="text-xs text-zinc-400 transition hover:text-zinc-600 dark:hover:text-zinc-300"
                  >
                    {dict.cancel}
                  </button>
                </div>

                <div className="mt-4 rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-800/60">
                  <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{dict.orderSummary}</div>
                  <dl className="mt-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-zinc-400">{dict.movieLabel}</dt>
                      <dd className="text-zinc-800 dark:text-zinc-100">{dict.movieTitle}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="shrink-0 text-zinc-400">{dict.sessionField}</dt>
                      <dd className="text-right text-zinc-800 dark:text-zinc-100">
                        {session.time} · {session.hall[lang]} · {session.audio[lang]}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="shrink-0 text-zinc-400">{dict.pickedLabel}</dt>
                      <dd className="flex flex-wrap justify-end gap-1.5">
                        {picked.map((seat) => (
                          <span
                            key={seat}
                            className="rounded-md bg-white px-1.5 py-0.5 text-xs font-medium text-zinc-700 shadow-sm dark:bg-zinc-700 dark:text-zinc-200"
                          >
                            {seat}
                          </span>
                        ))}
                      </dd>
                    </div>
                  </dl>
                  <div className="mt-3 flex items-center justify-between border-t border-zinc-200 pt-3 dark:border-zinc-700">
                    <span className="text-xs text-zinc-400">{dict.totalLabel}</span>
                    <span className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">¥{formatCents(total)}</span>
                  </div>
                </div>

                <div className="mt-4 text-xs font-medium text-zinc-500 dark:text-zinc-400">{dict.payWith}</div>
                <div className="mt-2 space-y-2">
                  {payMethods.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setPayMethod(m.id)}
                      className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${
                        payMethod === m.id
                          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10"
                          : "border-zinc-200 enabled:hover:border-zinc-300 dark:border-zinc-700 dark:enabled:hover:border-zinc-600"
                      }`}
                    >
                      <span className={`h-3 w-3 rounded-full ${m.dot}`} />
                      <span className="text-zinc-800 dark:text-zinc-100">{payMethodLabel[m.id]}</span>
                      <span
                        className={`ml-auto h-4 w-4 rounded-full border-2 transition ${
                          payMethod === m.id
                            ? "border-emerald-500 bg-emerald-500"
                            : "border-zinc-300 dark:border-zinc-600"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <button
                  onClick={pay}
                  className="mt-5 w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 active:scale-[0.98]"
                >
                  {dict.payBtn} · ¥{formatCents(total)}
                </button>
                <p className="mt-3 text-[11px] leading-relaxed text-zinc-400">{dict.checkoutNote}</p>
              </>
            )}

            {phase === "paying" && (
              <div className="flex flex-col items-center py-12">
                <span className="h-10 w-10 animate-spin rounded-full border-[3px] border-zinc-200 border-t-emerald-600 dark:border-zinc-700 dark:border-t-emerald-400" />
                <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">{dict.paying}</p>
              </div>
            )}

            {phase === "success" && order && (
              <div className="flex flex-col items-center text-center">
                <span className="flex h-14 w-14 animate-[pop_0.45s_ease-out] items-center justify-center rounded-full bg-emerald-500">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-7 w-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
                <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">{dict.successTitle}</h3>
                <p className="mt-1 text-xs text-zinc-400">
                  {dict.orderNo}: {order.id}
                </p>
                <div className="mt-5 w-full rounded-2xl border border-dashed border-zinc-300 p-5 dark:border-zinc-600">
                  <div className="text-[11px] tracking-widest text-zinc-400">{dict.pickup}</div>
                  <div className="mt-1 font-mono text-3xl font-bold tracking-[0.2em] text-zinc-900 dark:text-zinc-50">
                    {order.code}
                  </div>
                  <div className="mt-2 text-xs text-zinc-400">
                    {session.time} · {session.hall[lang]} · {picked.join(" / ")}
                  </div>
                </div>
                <p className="mt-3 text-[11px] text-zinc-400">{dict.ticketNote}</p>
                <div className="mt-5 flex w-full gap-2.5">
                  <button
                    onClick={reset}
                    className="flex-1 rounded-xl border border-zinc-200 py-2.5 text-sm text-zinc-600 transition hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-600"
                  >
                    {dict.again}
                  </button>
                  <Link
                    href={`/${lang}/work/cinema-booking`}
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

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`h-3.5 w-3.5 rounded-[4px] ${swatch}`} />
      {label}
    </span>
  );
}

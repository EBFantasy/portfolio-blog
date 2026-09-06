"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/** 元素进入视口后返回 true（一次性） */
export function useInView<T extends HTMLElement>(threshold = 0.18) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/**
 * 滚动揭示容器，支持延迟形成交错动画。
 * dir="up"（默认）淡入上移；dir="left"/"right" 从左/右滑入（科技模板用左右入场与商务/餐饮模板区分）。
 */
export function Reveal({
  children,
  delay = 0,
  dir = "up",
  className,
  style,
}: {
  children: ReactNode;
  delay?: number;
  dir?: "up" | "left" | "right";
  className?: string;
  style?: CSSProperties;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const hidden =
    dir === "left" ? "translateX(-48px)" : dir === "right" ? "translateX(48px)" : "translateY(26px)";
  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : hidden,
        transition: `opacity .75s ease ${delay}ms, transform .75s cubic-bezier(.22,.61,.36,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/** 数字滚动：进入视口后从 0 数到目标值，支持小数与后缀 */
export function CountUp({
  to,
  decimals = 0,
  suffix = "",
  prefix = "",
  duration = 1500,
  className,
  style,
}: {
  to: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const t0 = performance.now();
    const factor = Math.pow(10, decimals);
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(to * factor * eased) / factor);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration, decimals]);
  return (
    <span ref={ref} className={className} style={style}>
      {prefix}
      {val.toFixed(decimals)}
      {suffix}
    </span>
  );
}

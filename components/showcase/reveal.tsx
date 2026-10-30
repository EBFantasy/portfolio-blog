"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/** 元素进入视口后返回 true（一次性）；canAnimate 表示允许执行入场动效。 */
export function useInView<T extends HTMLElement>(threshold = 0.18) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  const [canAnimate, setCanAnimate] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let io: IntersectionObserver | null = null;

    const updateObservation = () => {
      io?.disconnect();
      io = null;

      if (media.matches || !("IntersectionObserver" in window)) {
        setCanAnimate(false);
        setInView(true);
        return;
      }

      setCanAnimate(true);
      setInView(false);
      io = new IntersectionObserver(
        (entries, observer) => {
          if (entries[0]?.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        },
        { threshold }
      );
      io.observe(el);
    };

    updateObservation();
    media.addEventListener("change", updateObservation);

    return () => {
      io?.disconnect();
      media.removeEventListener("change", updateObservation);
    };
  }, [threshold]);

  return { ref, inView, canAnimate };
}

/**
 * 滚动揭示容器，支持延迟形成交错动画。
 * dir="up"（默认）淡入上移；dir="left"/"right" 从左/右滑入（科技模板用左右入场与商务/餐饮模板区分）。
 * 初始内容始终可见，仅在浏览器确认可以观察且未要求减弱动效后才启用隐藏入场状态。
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
  const { ref, inView, canAnimate } = useInView<HTMLDivElement>();
  const offset =
    dir === "left" ? "translateX(-48px)" : dir === "right" ? "translateX(48px)" : "translateY(26px)";
  const visible = !canAnimate || inView;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : offset,
        transition: canAnimate
          ? `opacity .75s ease ${delay}ms, transform .75s cubic-bezier(.22,.61,.36,1) ${delay}ms`
          : "none",
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
  const { ref, inView, canAnimate } = useInView<HTMLSpanElement>();
  const [val, setVal] = useState(to);

  useEffect(() => {
    let raf: number | undefined;

    if (inView) {
      if (!canAnimate || duration <= 0) {
        setVal(to);
      } else {
        setVal(0);
        const t0 = performance.now();
        const factor = Math.pow(10, decimals);
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          setVal(Math.round(to * factor * eased) / factor);
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      }
    }

    return () => {
      if (raf !== undefined) cancelAnimationFrame(raf);
    };
  }, [inView, canAnimate, to, duration, decimals]);

  return (
    <span ref={ref} className={className} style={style}>
      {prefix}
      {val.toFixed(decimals)}
      {suffix}
    </span>
  );
}

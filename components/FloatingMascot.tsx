"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";

/**
 * 屏幕左侧随动 Q 版看板娘（Peeking Mascot Widget）
 *
 * 特性：
 * 1. position: fixed 固定在屏幕左侧边缘，随页面滚动常驻
 * 2. 半倚靠探头姿态，微呼吸悬浮动画
 * 3. 光标 Y 轴轻微追踪（微幅倾角与位移）
 * 4. 点击角色：触发微笑/弹性跳动，头顶冒出气泡台词
 * 5. 折叠/关闭功能：点击关闭折叠为贴边的小十字架/铃铛徽章，状态记忆在 localStorage
 */

interface MascotProps {
  quotes: string[];
  toggleShow: string;
  toggleHide: string;
}

export default function FloatingMascot({ quotes, toggleShow, toggleHide }: MascotProps) {
  const [visible, setVisible] = useState(true);
  const [quote, setQuote] = useState<string | null>(null);
  const [bouncing, setBouncing] = useState(false);
  const [tilt, setTilt] = useState(0);
  const quoteTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 初始化折叠状态
  useEffect(() => {
    try {
      const saved = localStorage.getItem("eb_mascot_visible");
      if (saved !== null) {
        setVisible(saved === "true");
      }
    } catch {
      // 忽略隐私模式下的异常
    }
  }, []);

  const toggleVisibility = (nextState: boolean) => {
    setVisible(nextState);
    try {
      localStorage.setItem("eb_mascot_visible", String(nextState));
    } catch {
      // ignore
    }
  };

  // 监听 Hero CTA 派发的交互事件（悬停“查看作品”时看板娘开心跳动）
  useEffect(() => {
    const handleHeroSlash = () => {
      if (!visible) return;
      setBouncing(true);
      setTimeout(() => setBouncing(false), 500);
      setQuote(quotes[1] || "快来看看我的作品吧！");
      if (quoteTimerRef.current) clearTimeout(quoteTimerRef.current);
      quoteTimerRef.current = setTimeout(() => setQuote(null), 3000);
    };

    window.addEventListener("hero:slash", handleHeroSlash);
    return () => window.removeEventListener("hero:slash", handleHeroSlash);
  }, [visible, quotes]);

  // 鼠标跟踪微倾角（轻柔微动，不突兀）
  useEffect(() => {
    if (!visible) return;
    const handleMouseMove = (e: MouseEvent) => {
      const windowH = window.innerHeight;
      const normalizedY = (e.clientY / windowH) * 2 - 1; // -1 ~ 1
      setTilt(normalizedY * 3.5); // 最大倾角 ±3.5deg
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [visible]);

  // 点击触发互动
  const handleClick = useCallback(() => {
    setBouncing(true);
    setTimeout(() => setBouncing(false), 500);

    // 随机台词气泡
    if (quotes && quotes.length > 0) {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setQuote(randomQuote);

      if (quoteTimerRef.current) clearTimeout(quoteTimerRef.current);
      quoteTimerRef.current = setTimeout(() => {
        setQuote(null);
      }, 3500);
    }
  }, [quotes]);

  return (
    <>
      {/* 折叠收起时：贴在屏幕左侧的小巧唤醒按钮 */}
      {!visible && (
        <button
          onClick={() => toggleVisibility(true)}
          title={toggleShow}
          aria-label={toggleShow}
          className="fixed left-0 bottom-24 z-40 flex items-center gap-1.5 rounded-r-full border border-l-0 border-amber-300/60 bg-white/90 py-2 pl-2 pr-3.5 text-xs font-medium text-amber-900 shadow-md backdrop-blur-md transition-all hover:bg-amber-50 hover:pl-3 dark:border-amber-700/60 dark:bg-zinc-900/90 dark:text-amber-200 dark:hover:bg-zinc-800"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] text-white font-bold shadow-sm">
            ✦
          </span>
          <span className="font-sans text-[11px] font-medium tracking-tight">召唤看板娘</span>
        </button>
      )}

      {/* 展开状态：左边缘半倚靠探头 */}
      {visible && (
        <div
          className="fixed left-0 bottom-12 z-40 select-none transition-transform duration-500 ease-out"
          style={{
            transform: `translateY(0) rotate(${tilt}deg)`,
            transformOrigin: "left center",
          }}
        >
          {/* 对话气泡 */}
          {quote && (
            <div className="absolute -top-14 left-10 z-50 animate-in fade-in zoom-in-95 duration-200">
              <div className="relative max-w-[200px] rounded-2xl border border-amber-300/80 bg-white/95 px-3.5 py-2 text-xs font-medium text-zinc-800 shadow-lg backdrop-blur-md dark:border-amber-700/80 dark:bg-zinc-900/95 dark:text-zinc-100">
                <span className="leading-relaxed">{quote}</span>
                {/* 气泡三角尾巴指向角色 */}
                <div className="absolute -bottom-1.5 left-4 h-3 w-3 rotate-45 border-b border-r border-amber-300/80 bg-white dark:border-amber-700/80 dark:bg-zinc-900" />
              </div>
            </div>
          )}

          {/* 收起小按钮 */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleVisibility(false);
            }}
            title={toggleHide}
            aria-label={toggleHide}
            className="absolute -top-2 right-2 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-zinc-200/80 bg-white/90 text-[11px] font-bold text-zinc-500 shadow-sm backdrop-blur transition hover:bg-zinc-100 hover:text-zinc-800 dark:border-zinc-700/80 dark:bg-zinc-800/90 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
          >
            ✕
          </button>

          {/* 角色本体容器 */}
          <div
            onClick={handleClick}
            className={`group relative flex cursor-pointer items-end transition-transform duration-300 ${
              bouncing ? "scale-105 -translate-y-2" : "hover:scale-[1.03]"
            }`}
          >
            {/* 呼吸微浮动容器 */}
            <div className="relative -ml-2.5 w-36 sm:w-44 md:w-48 filter drop-shadow-[0_8px_20px_rgba(224,144,12,0.18)] dark:drop-shadow-[0_8px_24px_rgba(224,144,12,0.14)]">
              <Image
                src="/oc_peeking.png"
                alt="Silver-haired mascot peeking from border"
                width={700}
                height={997}
                priority
                className="h-auto w-full object-contain pointer-events-auto transition-transform duration-300 group-hover:brightness-105"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";

/**
 * 屏幕左侧随动 Q 版看板娘（Web 2.5D 切件 Live2D 看板娘组件）
 *
 * 核心技术架构：
 * 1. 【底图层】：无瞳孔的眼白底面、身体、衣服、发丝与发饰
 * 2. 【瞳孔层】：左眼与右眼独立切件，平滑跟随鼠标在眼眶内绝对位移（限制在眼白内防穿模）
 * 3. 【手部层】：独立趴框手部切件，平时静止扣住左边缘；点击/CTA互动时触发弹性抬手招手动画
 * 4. 【眨眼/呼吸微动】：眼皮定时开合眨眼，全身极轻微起伏
 * 5. 【折叠/收起】：随时可收拢进左边缘徽章，状态记忆在 localStorage
 */

interface MascotProps {
  quotes: string[];
  toggleShow: string;
  toggleHide: string;
}

export default function FloatingMascot({ quotes, toggleShow, toggleHide }: MascotProps) {
  const [visible, setVisible] = useState(true);
  const [quote, setQuote] = useState<string | null>(null);
  const [waving, setWaving] = useState(false);
  const [blinking, setBlinking] = useState(false);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState(0);
  const quoteTimerRef = useRef<NodeJS.Timeout | null>(null);
  const mascotRef = useRef<HTMLDivElement | null>(null);

  // 初始化折叠记忆
  useEffect(() => {
    try {
      const saved = localStorage.getItem("eb_mascot_visible");
      if (saved !== null) {
        setVisible(saved === "true");
      }
    } catch {
      // ignore
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

  // 1. 眼睛注视光标跟踪（计算瞳孔在眼眶内的偏移）
  useEffect(() => {
    if (!visible) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!mascotRef.current) return;
      const rect = mascotRef.current.getBoundingClientRect();
      // 看板娘眼部在屏幕上的大致视线中心
      const eyeCenterX = rect.left + rect.width * 0.4;
      const eyeCenterY = rect.top + rect.height * 0.45;

      const deltaX = e.clientX - eyeCenterX;
      const deltaY = e.clientY - eyeCenterY;
      const dist = Math.hypot(deltaX, deltaY);

      // 最大位移限制在 ±5px 内，避免眼球离开眼眶
      const maxOffset = 5.5;
      const factor = dist > 0 ? Math.min(dist / 350, 1) : 0;
      const angle = Math.atan2(deltaY, deltaX);

      setEyeOffset({
        x: Math.cos(angle) * maxOffset * factor,
        y: Math.sin(angle) * maxOffset * factor,
      });

      // 整体极微幅的角度倾斜 (±2.5deg)
      const windowH = window.innerHeight;
      const normY = (e.clientY / windowH) * 2 - 1;
      setTilt(normY * 2.2);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [visible]);

  // 2. 自然眨眼动画循环（每 4~6 秒眨眼一次）
  useEffect(() => {
    if (!visible) return;
    let blinkTimer: NodeJS.Timeout;

    const triggerBlink = () => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 160);
      blinkTimer = setTimeout(triggerBlink, 3800 + Math.random() * 2600);
    };

    blinkTimer = setTimeout(triggerBlink, 3000);
    return () => clearTimeout(blinkTimer);
  }, [visible]);

  // 3. 点击触发互动（小手挥手打招呼 + 微笑 + 气泡台词）
  const handleClick = useCallback(() => {
    // 触发招手动画
    setWaving(true);
    setTimeout(() => setWaving(false), 1400);

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

  // 4. 监听 Hero CTA 联动事件（悬停“查看作品”也招手打招呼）
  useEffect(() => {
    const handleHeroSlash = () => {
      if (!visible) return;
      handleClick();
    };

    window.addEventListener("hero:slash", handleHeroSlash);
    return () => window.removeEventListener("hero:slash", handleHeroSlash);
  }, [visible, handleClick]);

  return (
    <>
      <style>{`
        @keyframes mascot-breathe {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes hand-wave {
          0% { transform: rotate(0deg); }
          18% { transform: rotate(-24deg) translateY(-4px) translateX(2px); }
          36% { transform: rotate(14deg) translateY(-2px); }
          54% { transform: rotate(-20deg) translateY(-4px) translateX(2px); }
          72% { transform: rotate(10deg) translateY(-1px); }
          90% { transform: rotate(-10deg); }
          100% { transform: rotate(0deg); }
        }
        .mascot-waving-hand {
          transform-origin: 30% 92%;
          animation: hand-wave 1.35s cubic-bezier(0.36, 0.07, 0.19, 0.97) forwards;
        }
      `}</style>

      {/* 折叠收起时：贴在屏幕左侧的微型胶囊唤醒按钮 */}
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

      {/* 展开状态：随动在屏幕左侧边缘 */}
      {visible && (
        <div
          ref={mascotRef}
          className="fixed left-0 bottom-12 z-40 select-none transition-transform duration-300 ease-out"
          style={{
            transform: `rotate(${tilt}deg)`,
            transformOrigin: "left center",
          }}
        >
          {/* 对话气泡 */}
          {quote && (
            <div className="absolute -top-14 left-12 z-50 animate-in fade-in zoom-in-95 duration-200 pointer-events-none">
              <div className="relative max-w-[210px] rounded-2xl border border-amber-300/80 bg-white/95 px-3.5 py-2 text-xs font-medium text-zinc-800 shadow-xl backdrop-blur-md dark:border-amber-700/80 dark:bg-zinc-900/95 dark:text-zinc-100">
                <span className="leading-relaxed block">{quote}</span>
                <div className="absolute -bottom-1.5 left-4 h-3 w-3 rotate-45 border-b border-r border-amber-300/80 bg-white dark:border-amber-700/80 dark:bg-zinc-900" />
              </div>
            </div>
          )}

          {/* 收起小关闭按钮 */}
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

          {/* 看板娘切件多层堆叠主体 */}
          <div
            onClick={handleClick}
            className="relative flex cursor-pointer items-end transition-transform duration-200 hover:scale-[1.02]"
            style={{ animation: "mascot-breathe 4.5s ease-in-out infinite" }}
          >
            {/* 角色整体尺寸包裹器 */}
            <div className="relative -ml-2.5 w-36 sm:w-44 md:w-48 aspect-[700/997] filter drop-shadow-[0_8px_20px_rgba(224,144,12,0.18)] dark:drop-shadow-[0_8px_24px_rgba(224,144,12,0.14)]">
              
              {/* 1. 【底图层】：无瞳孔眼白基底 + 身体头发 (Z: 1) */}
              <div className="absolute inset-0 z-10">
                <Image
                  src="/oc_base_sclera.png"
                  alt="Silver-haired mascot base"
                  fill
                  priority
                  className="object-contain pointer-events-auto"
                />
              </div>

              {/* 2. 【瞳孔层】：左眼琥珀金眼球切件 (Z: 2) */}
              {/* 基准位置: X=17.14%, Y=40.12%, W=13.57%, H=9.53% */}
              <div
                className="absolute z-20 pointer-events-none transition-transform duration-75 ease-out"
                style={{
                  left: "17.14%",
                  top: "40.12%",
                  width: "13.57%",
                  height: "9.53%",
                  transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px) ${
                    blinking ? "scaleY(0.08)" : "scaleY(1)"
                  }`,
                  transformOrigin: "center center",
                  transition: blinking
                    ? "transform 0.08s ease-in-out"
                    : "transform 0.12s ease-out",
                }}
              >
                <Image
                  src="/oc_pupil_l.png"
                  alt="Left eye pupil"
                  fill
                  className="object-contain"
                />
              </div>

              {/* 3. 【瞳孔层】：右眼琥珀金眼球切件 (Z: 2) */}
              {/* 基准位置: X=40.0%, Y=49.15%, W=15.0%, H=9.53% */}
              <div
                className="absolute z-20 pointer-events-none transition-transform duration-75 ease-out"
                style={{
                  left: "40.0%",
                  top: "49.15%",
                  width: "15.0%",
                  height: "9.53%",
                  transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px) ${
                    blinking ? "scaleY(0.08)" : "scaleY(1)"
                  }`,
                  transformOrigin: "center center",
                  transition: blinking
                    ? "transform 0.08s ease-in-out"
                    : "transform 0.12s ease-out",
                }}
              >
                <Image
                  src="/oc_pupil_r.png"
                  alt="Right eye pupil"
                  fill
                  className="object-contain"
                />
              </div>

              {/* 4. 【小手层】：独立搭在边框上的小手 (Z: 30) */}
              {/* 基准位置: X=0%, Y=46.14%, W=10.71%, H=14.04% */}
              <div
                className={`absolute z-30 pointer-events-none ${waving ? "mascot-waving-hand" : ""}`}
                style={{
                  left: "0%",
                  top: "46.14%",
                  width: "10.71%",
                  height: "14.04%",
                  transformOrigin: "20% 90%",
                }}
              >
                <Image
                  src="/oc_hand.png"
                  alt="Mascot hand"
                  fill
                  className="object-contain"
                />
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}

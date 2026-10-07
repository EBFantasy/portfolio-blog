"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";

/**
 * 屏幕左侧 Q 版看板娘（Web 2.5D 切件看板娘组件 v4）
 *
 * 层序（Z 从低到高）：
 *   base2(底图,眼球像素填平眼白+完整手指) < iris_l/r(眼球件,随光标位移,
 *   经眼孔遮罩裁切永远出不了眼眶) < lash(睁眼睫毛环,眨眼时隐藏)
 *   < lid_l/r(闭眼件,仅眨眼时显示) < eyestatic(眉毛+白发静止件,永远最上层)
 * 眨眼 = 隐藏 iris+lash、显示 lids；眉毛/白发由 static 层恒定保住。
 * 立绘本体不随动，仅眼睛注视光标；点击只弹台词气泡（不摆手）。
 */

interface MascotProps {
  quotes: string[];
  toggleShow: string;
  toggleHide: string;
}

/* 部件几何：canvas 700x997 的百分比（源自 _tmp_mascot/parts_report.json v5.1） */
const GEO = {
  irisL: { left: "16.43%", top: "39.62%", width: "13.71%", height: "8.63%" },
  irisR: { left: "43.43%", top: "49.85%", width: "13.71%", height: "7.62%" },
  lash: { left: "11.86%", top: "34.90%", width: "50.71%", height: "25.08%" },
  static: { left: "11.86%", top: "34.90%", width: "50.71%", height: "26.68%" },
  lidL: { left: "11.71%", top: "34.80%", width: "20.71%", height: "13.94%" },
  lidR: { left: "42.86%", top: "44.33%", width: "19.86%", height: "15.95%" },
};

/* 眼孔遮罩：虹膜位移后被裁切在眼眶内，绝不越界压到睫毛线 */
const SOCKET_MASK = {
  l: "url(/oc_socket_l.png)",
  r: "url(/oc_socket_r.png)",
};

export default function FloatingMascot({ quotes, toggleShow, toggleHide }: MascotProps) {
  const [visible, setVisible] = useState(true);
  const [quote, setQuote] = useState<string | null>(null);
  const [blinking, setBlinking] = useState(false);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
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

  // 1. 眼睛注视光标跟踪（仅虹膜位移；立绘本体保持静止）
  useEffect(() => {
    if (!visible) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!mascotRef.current) return;
      const rect = mascotRef.current.getBoundingClientRect();
      const eyeCenterX = rect.left + rect.width * 0.4;
      const eyeCenterY = rect.top + rect.height * 0.45;

      const deltaX = e.clientX - eyeCenterX;
      const deltaY = e.clientY - eyeCenterY;
      const dist = Math.hypot(deltaX, deltaY);

      const maxOffset = 5.5;
      const factor = dist > 0 ? Math.min(dist / 350, 1) : 0;
      const angle = Math.atan2(deltaY, deltaX);

      setEyeOffset({
        x: Math.cos(angle) * maxOffset * factor,
        y: Math.sin(angle) * maxOffset * factor,
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [visible]);

  // 2. 自然眨眼循环（每 4~6 秒一次，闭眼 160ms）
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

  // 3. 点击触发互动（只弹台词气泡，不摆手）
  const handleClick = useCallback(() => {
    if (quotes && quotes.length > 0) {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setQuote(randomQuote);

      if (quoteTimerRef.current) clearTimeout(quoteTimerRef.current);
      quoteTimerRef.current = setTimeout(() => {
        setQuote(null);
      }, 3500);
    }
  }, [quotes]);

  // 4. Hero CTA 联动
  useEffect(() => {
    const handleHeroSlash = () => {
      if (!visible) return;
      handleClick();
    };

    window.addEventListener("hero:slash", handleHeroSlash);
    return () => window.removeEventListener("hero:slash", handleHeroSlash);
  }, [visible, handleClick]);

  const openEyeOpacity = blinking ? 0 : 1;
  const lidOpacity = blinking ? 1 : 0;

  return (
    <>
      <style>{`
        @keyframes mascot-breathe {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
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

      {/* 展开状态：贴屏幕左缘 + 浏览器底缘 */}
      {visible && (
        <div
          ref={mascotRef}
          className="fixed left-0 bottom-0 z-40 select-none"
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
            <div className="relative -ml-2.5 w-36 sm:w-44 md:w-48 aspect-[700/997] filter drop-shadow-[0_8px_20px_rgba(224,144,12,0.18)] dark:drop-shadow-[0_8px_24px_rgba(224,144,12,0.14)]">
              {/* Z10 底图：眼球像素填平眼白 + 身体头发手指 */}
              <div className="absolute inset-0 z-10">
                <Image
                  src="/oc_base2.png"
                  alt="Silver-haired mascot base"
                  fill
                  priority
                  className="object-contain pointer-events-auto"
                />
              </div>

              {/* Z20 眼球件：外层固定+眼孔遮罩裁切，内层随光标位移（眨眼时隐藏） */}
              <div
                className="absolute z-20 pointer-events-none"
                style={{
                  ...GEO.irisL,
                  opacity: openEyeOpacity,
                  WebkitMaskImage: SOCKET_MASK.l,
                  maskImage: SOCKET_MASK.l,
                  WebkitMaskSize: "100% 100%",
                  maskSize: "100% 100%",
                  transition: "opacity 0.07s linear",
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
                    transition: "transform 0.12s ease-out",
                  }}
                >
                  <Image src="/oc_iris_l.png" alt="" fill className="object-contain" />
                </div>
              </div>
              <div
                className="absolute z-20 pointer-events-none"
                style={{
                  ...GEO.irisR,
                  opacity: openEyeOpacity,
                  WebkitMaskImage: SOCKET_MASK.r,
                  maskImage: SOCKET_MASK.r,
                  WebkitMaskSize: "100% 100%",
                  maskSize: "100% 100%",
                  transition: "opacity 0.07s linear",
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
                    transition: "transform 0.12s ease-out",
                  }}
                >
                  <Image src="/oc_iris_r.png" alt="" fill className="object-contain" />
                </div>
              </div>

              {/* Z30 睁眼睫毛环（眨眼时隐藏） */}
              <div
                className="absolute z-30 pointer-events-none"
                style={{ ...GEO.lash, opacity: openEyeOpacity, transition: "opacity 0.07s linear" }}
              >
                <Image src="/oc_lash.png" alt="" fill className="object-contain" />
              </div>

              {/* Z40 闭眼件（仅眨眼时显示） */}
              <div
                className="absolute z-40 pointer-events-none"
                style={{ ...GEO.lidL, opacity: lidOpacity, transition: "opacity 0.07s linear" }}
              >
                <Image src="/oc_lid_l.png" alt="" fill className="object-contain" />
              </div>
              <div
                className="absolute z-40 pointer-events-none"
                style={{ ...GEO.lidR, opacity: lidOpacity, transition: "opacity 0.07s linear" }}
              >
                <Image src="/oc_lid_r.png" alt="" fill className="object-contain" />
              </div>

              {/* Z50 静止件：眉毛+白发（永远最上层，眨眼不闪失） */}
              <div className="absolute z-50 pointer-events-none" style={GEO.static}>
                <Image src="/oc_eyestatic.png" alt="" fill className="object-contain" />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

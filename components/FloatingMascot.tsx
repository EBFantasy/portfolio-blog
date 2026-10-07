"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";

/**
 * 屏幕左侧随动 Q 版看板娘（Web 2.5D 切件 Live2D 看板娘组件 v2）
 *
 * 层序（Z 从低到高）：
 *   base2(底图,眼孔填平眼白) < iris_l/r(整眼孔虹膜件,随光标位移) < hand2(搭框手)
 *   < wristoverlay(腕部发丝盖片) < eyeoverlay(睁眼睫毛环) < lid_l/r(闭眼件,仅眨眼时显示)
 * 眨眼 = 隐藏 overlay+iris、显示 lids（qwen-image-2.1 重绘的自然闭眼件）。
 * 招手 = 手部件绕腕枢轴 (94%,50%) 旋转，wristoverlay 盖住关节防断肢。
 */

interface MascotProps {
  quotes: string[];
  toggleShow: string;
  toggleHide: string;
}

/* 部件几何：canvas 700x997 的百分比（源自 _tmp_mascot/parts_report.json） */
const GEO = {
  irisL: { left: "17.00%", top: "40.02%", width: "13.00%", height: "8.22%" },
  irisR: { left: "43.43%", top: "50.25%", width: "13.14%", height: "7.22%" },
  hand: { left: "0%", top: "48.85%", width: "7.71%", height: "10.33%" },
  wrist: { left: "0%", top: "51.86%", width: "9.86%", height: "9.53%" },
  overlay: { left: "16.43%", top: "39.62%", width: "40.86%", height: "18.25%" },
  lidL: { left: "13.86%", top: "34.80%", width: "20.86%", height: "13.94%" },
  lidR: { left: "41.71%", top: "44.33%", width: "21.00%", height: "17.35%" },
};

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

  // 1. 眼睛注视光标跟踪（虹膜在眼眶内位移，overlay 睫毛环在上层裁边）
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

      const windowH = window.innerHeight;
      const normY = (e.clientY / windowH) * 2 - 1;
      setTilt(normY * 2.2);
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

  // 3. 点击触发互动（招手 + 气泡台词）
  const handleClick = useCallback(() => {
    setWaving(true);
    setTimeout(() => setWaving(false), 1400);

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
            <div className="relative -ml-2.5 w-36 sm:w-44 md:w-48 aspect-[700/997] filter drop-shadow-[0_8px_20px_rgba(224,144,12,0.18)] dark:drop-shadow-[0_8px_24px_rgba(224,144,12,0.14)]">
              {/* Z1 底图：眼孔填平眼白 + 身体头发 */}
              <div className="absolute inset-0 z-10">
                <Image
                  src="/oc_base2.png"
                  alt="Silver-haired mascot base"
                  fill
                  priority
                  className="object-contain pointer-events-auto"
                />
              </div>

              {/* Z2 虹膜件：随光标位移（眨眼时隐藏） */}
              <div
                className="absolute z-20 pointer-events-none"
                style={{
                  ...GEO.irisL,
                  opacity: openEyeOpacity,
                  transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
                  transition: "transform 0.12s ease-out, opacity 0.07s linear",
                }}
              >
                <Image src="/oc_iris_l.png" alt="" fill className="object-contain" />
              </div>
              <div
                className="absolute z-20 pointer-events-none"
                style={{
                  ...GEO.irisR,
                  opacity: openEyeOpacity,
                  transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
                  transition: "transform 0.12s ease-out, opacity 0.07s linear",
                }}
              >
                <Image src="/oc_iris_r.png" alt="" fill className="object-contain" />
              </div>

              {/* Z3 搭框手：点击绕腕枢轴招手 */}
              <div
                className={`absolute z-30 pointer-events-none ${waving ? "mascot-waving-hand" : ""}`}
                style={{ ...GEO.hand, transformOrigin: "94% 50%" }}
              >
                <Image src="/oc_hand2.png" alt="Mascot hand" fill className="object-contain" />
              </div>

              {/* Z4 腕部发丝盖片：盖住手腕关节 */}
              <div className="absolute z-40 pointer-events-none" style={GEO.wrist}>
                <Image src="/oc_wristoverlay.png" alt="" fill className="object-contain" />
              </div>

              {/* Z5 睁眼睫毛环（眨眼时隐藏） */}
              <div
                className="absolute z-50 pointer-events-none"
                style={{ ...GEO.overlay, opacity: openEyeOpacity, transition: "opacity 0.07s linear" }}
              >
                <Image src="/oc_eyeoverlay.png" alt="" fill className="object-contain" />
              </div>

              {/* Z6 闭眼件（仅眨眼时显示） */}
              <div
                className="absolute z-60 pointer-events-none"
                style={{ ...GEO.lidL, opacity: lidOpacity, transition: "opacity 0.07s linear" }}
              >
                <Image src="/oc_lid_l.png" alt="" fill className="object-contain" />
              </div>
              <div
                className="absolute z-60 pointer-events-none"
                style={{ ...GEO.lidR, opacity: lidOpacity, transition: "opacity 0.07s linear" }}
              >
                <Image src="/oc_lid_r.png" alt="" fill className="object-contain" />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";

/**
 * 屏幕左侧 Q 版看板娘（Web 2.5D 切件看板娘组件 v5 / PSD 手扣分层版）
 *
 * 层序（Z 从低到高，眨眼态只换 lid 对）：
 *   base2(挖空眼区的完整底图,眉/发/手零损失)
 *   < wall_l/r(眼白+眼角内壁,随眼睛开合) < iris_l/r(眼球,随光标位移,被
 *   socket 遮罩裁在眼眶内) < lash_l/r(睫毛线框) < lid_l/r(闭眼件,仅眨眼显示)
 * 部件全部来自用户 PSD 手扣图层（psd_to_parts.py 收割），像素级原图一致。
 * 立绘本体不随动，仅眼睛注视光标；点击只弹台词气泡。底边贴浏览器下缘。
 */

interface MascotProps {
  quotes: string[];
  toggleShow: string;
  toggleHide: string;
}

/* 部件几何：canvas 700x997 的百分比（源自 _tmp_mascot/parts_report.json v5-PSD） */
const GEO = {
  wallL: { left: "17.14%", top: "39.82%", width: "12.57%", height: "8.32%" },
  wallR: { left: "43.29%", top: "50.15%", width: "14.00%", height: "7.12%" },
  irisL: { left: "19.00%", top: "39.92%", width: "9.57%", height: "8.02%" },
  irisR: { left: "43.43%", top: "50.15%", width: "10.43%", height: "6.52%" },
  lashL: { left: "14.43%", top: "37.21%", width: "17.29%", height: "7.72%" },
  lashR: { left: "44.86%", top: "48.95%", width: "17.14%", height: "7.32%" },
  lidL: { left: "14.14%", top: "36.91%", width: "17.86%", height: "11.43%" },
  lidR: { left: "43.00%", top: "48.65%", width: "19.29%", height: "8.83%" },
  // socket 遮罩窗口（固定不随眼球移动）：iris bbox 四周外扩 12px
  sockWinL: { left: "17.29%", top: "38.72%", width: "13.00%", height: "10.43%" },
  sockWinR: { left: "41.71%", top: "48.95%", width: "13.86%", height: "8.93%" },
};

/* iris 相对 socket 窗口原点的静止偏移与尺寸（实测换算） */
const IRIS_IN_SOCK = {
  l: { left: "13.19%", top: "11.54%", width: "73.63%", height: "76.92%" },
  r: { left: "12.37%", top: "13.48%", width: "75.26%", height: "73.03%" },
};

/* 眼眶裁切遮罩：眼球位移后仍被裁在眼眶内（用户手扣 eyesocket 轮廓） */
const SOCKET_MASK = {
  l: "url(/oc_socket_l.png?v=8)",
  r: "url(/oc_socket_r.png?v=8)",
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
              {/* Z10 底图：眼区挖空（周边皮肤回填）+ 眉毛白发手指完整 */}
              <div className="absolute inset-0 z-10">
                <Image
                  src="/oc_base2.png?v=8"
                  alt="Silver-haired mascot base"
                  fill
                  priority
                  className="object-contain pointer-events-auto"
                />
              </div>

              {/* Z15 眼白内壁 wall：眼球下层补底（眨眼时隐藏） */}
              <div
                className="absolute z-[15] pointer-events-none"
                style={{ ...GEO.wallL, opacity: openEyeOpacity, transition: "opacity 0.07s linear" }}
              >
                <Image src="/oc_wall_l.png?v=8" alt="" fill className="object-contain" />
              </div>
              <div
                className="absolute z-[15] pointer-events-none"
                style={{ ...GEO.wallR, opacity: openEyeOpacity, transition: "opacity 0.07s linear" }}
              >
                <Image src="/oc_wall_r.png?v=8" alt="" fill className="object-contain" />
              </div>

              {/* Z20 眼球：socket 遮罩窗口固定，窗口内 iris 随光标位移（眨眼隐藏） */}
              <div
                className="absolute z-20 pointer-events-none"
                style={{
                  ...GEO.sockWinL,
                  opacity: openEyeOpacity,
                  WebkitMaskImage: SOCKET_MASK.l,
                  maskImage: SOCKET_MASK.l,
                  WebkitMaskSize: "100% 100%",
                  maskSize: "100% 100%",
                  transition: "opacity 0.07s linear",
                }}
              >
                <div
                  className="absolute"
                  style={{
                    ...IRIS_IN_SOCK.l,
                    transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
                    transition: "transform 0.12s ease-out",
                  }}
                >
                  <Image src="/oc_iris_l.png?v=8" alt="" fill className="object-contain" />
                </div>
              </div>
              <div
                className="absolute z-20 pointer-events-none"
                style={{
                  ...GEO.sockWinR,
                  opacity: openEyeOpacity,
                  WebkitMaskImage: SOCKET_MASK.r,
                  maskImage: SOCKET_MASK.r,
                  WebkitMaskSize: "100% 100%",
                  maskSize: "100% 100%",
                  transition: "opacity 0.07s linear",
                }}
              >
                <div
                  className="absolute"
                  style={{
                    ...IRIS_IN_SOCK.r,
                    transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
                    transition: "transform 0.12s ease-out",
                  }}
                >
                  <Image src="/oc_iris_r.png?v=8" alt="" fill className="object-contain" />
                </div>
              </div>

              {/* Z30 睫毛线框 lash：左右眼独立（眨眼隐藏） */}
              <div
                className="absolute z-30 pointer-events-none"
                style={{ ...GEO.lashL, opacity: openEyeOpacity, transition: "opacity 0.07s linear" }}
              >
                <Image src="/oc_lash_l.png?v=8" alt="" fill className="object-contain" />
              </div>
              <div
                className="absolute z-30 pointer-events-none"
                style={{ ...GEO.lashR, opacity: openEyeOpacity, transition: "opacity 0.07s linear" }}
              >
                <Image src="/oc_lash_r.png?v=8" alt="" fill className="object-contain" />
              </div>

              {/* Z40 闭眼件（仅眨眼显示；覆盖眼白+眼球+睫毛线区） */}
              <div
                className="absolute z-40 pointer-events-none"
                style={{ ...GEO.lidL, opacity: lidOpacity, transition: "opacity 0.07s linear" }}
              >
                <Image src="/oc_lid_l.png?v=8" alt="" fill className="object-contain" />
              </div>
              <div
                className="absolute z-40 pointer-events-none"
                style={{ ...GEO.lidR, opacity: lidOpacity, transition: "opacity 0.07s linear" }}
              >
                <Image src="/oc_lid_r.png?v=8" alt="" fill className="object-contain" />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

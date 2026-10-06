"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * 首页 Live2D 剑士（分层 SVG 吉祥物）。
 *
 * 构图参照原画：白银长发外扩飘散、琥珀金瞳、黑哥特裙配白色围裙，
 * 双手举刀，刀身自左上向右下横贯身前（刀置于最上层）。
 *
 * 分层（由后至前）：后发 → 前飘发 → 身体(呼吸) → 头组(跟随光标)
 *   → 刘海/侧发 → 蝴蝶结+十字 → 手臂 → 刀 → 刀光。
 *
 * 交互：
 *  - 瞳孔与头部朝向跟随光标（写入 CSS 变量，GPU 合成，不触发 React 重渲染）
 *  - 呼吸、眨眼、发丝摆动为纯 CSS 循环
 *  - 悬停「查看作品」或点击角色 → 挥刀 + "已斩"计数 +1
 *
 * 零依赖、零图片资源，纯内联 SVG。
 */

const CSS = `
.hs-wrap{position:relative;width:100%;}
/* 柔光背景：放在 CSS 层而非 SVG 内，避免暗色模式下溢出被裁成色块方框 */
.hs-wrap::before{content:"";position:absolute;left:50%;top:38%;width:118%;aspect-ratio:1/1.06;
  transform:translate(-50%,-50%);pointer-events:none;z-index:0;border-radius:50%;
  background:radial-gradient(circle,rgba(240,176,60,0.28) 0%,rgba(240,176,60,0.10) 42%,rgba(240,176,60,0) 68%);}
html.dark .hs-wrap::before{background:radial-gradient(circle,rgba(224,144,12,0.20) 0%,rgba(224,144,12,0.07) 44%,rgba(224,144,12,0) 70%);}
.hs-wrap>*{position:relative;z-index:1;}
.hs-svg{display:block;width:100%;max-width:460px;margin:0 auto;height:auto;overflow:hidden;
  -webkit-user-select:none;user-select:none;touch-action:pan-y;}

/* 头部跟随光标微转：--tilt 由指针位置驱动 */
.hs-head{transform-box:fill-box;transform-origin:50% 96%;
  transform:rotate(calc(var(--tilt,0) * 1.2deg)) translate(calc(var(--tilt,0) * 1.6px),calc(var(--tilt,0) * -0.5px));
  transition:transform .55s cubic-bezier(.22,.61,.36,1);}
/* 瞳孔跟随：位移上限约 ±5px / ±4px */
.hs-gaze{transform:translate(calc(var(--gx,0) * 5px),calc(var(--gy,0) * 4px));
  transition:transform .15s ease-out;}

/* 呼吸：胸腔轻微起伏 */
.hs-breathe{transform-box:fill-box;transform-origin:50% 0%;
  animation:hs-breathe 4.6s ease-in-out infinite;}
@keyframes hs-breathe{0%,100%{transform:translateY(0) scaleY(1);}
  50%{transform:translateY(-3px) scaleY(1.016);}}

/* 发丝摆动：两个不同周期叠加，避免机械感 */
.hs-sway{transform-box:fill-box;transform-origin:50% 4%;
  animation:hs-sway 6.4s ease-in-out infinite;}
.hs-sway-b{transform-box:fill-box;transform-origin:50% 3%;
  animation:hs-sway 4.6s ease-in-out infinite reverse;}
@keyframes hs-sway{0%,100%{transform:rotate(-1.3deg) translateX(-1.5px);}
  50%{transform:rotate(1.7deg) translateX(1.5px);}}

/* 缎带飘动 */
.hs-ribbon{transform-box:fill-box;transform-origin:0% 0%;
  animation:hs-ribbon 3.9s ease-in-out infinite;}
@keyframes hs-ribbon{0%,100%{transform:rotate(-2.2deg) skewX(0deg);}
  50%{transform:rotate(2.8deg) skewX(2.5deg);}}

/* 眨眼：眼睑在 eyeClip 内从 scaleY(0) 压到 1 */
.hs-lid{transform-box:fill-box;transform-origin:50% 0%;
  animation:hs-blink 6.4s infinite;}
@keyframes hs-blink{0%,91%,100%{transform:scaleY(0);}
  93.5%,96%{transform:scaleY(1);}}

/* 刀光：一次性自左上扫向右下 */
@keyframes hs-slash{0%{opacity:0;transform:translate(-16px,-10px) scaleX(.5);}
  16%{opacity:.95;}100%{opacity:0;transform:translate(20px,14px) scaleX(1.3);}}
.hs-slash{opacity:0;transform-box:fill-box;transform-origin:0% 50%;
  animation:hs-slash .44s cubic-bezier(.3,.7,.4,1) forwards;}

/* 挥刀时身体前冲 */
@keyframes hs-lunge{0%{transform:translate(0,0) rotate(0deg);}
  32%{transform:translate(7px,3px) rotate(1.6deg);}100%{transform:translate(0,0) rotate(0deg);}}
.hs-lunge{transform-box:fill-box;transform-origin:50% 100%;
  animation:hs-lunge .44s cubic-bezier(.3,.7,.4,1);}

/* 计数前的呼吸灯 */
@keyframes hs-pulse{0%,100%{opacity:.4;}50%{opacity:1;}}
.hs-pulse{animation:hs-pulse 2.4s ease-in-out infinite;}

@media (prefers-reduced-motion:reduce){
  .hs-breathe,.hs-sway,.hs-sway-b,.hs-ribbon,.hs-lid,.hs-pulse{animation:none;}
  .hs-slash,.hs-lunge{animation-duration:.01ms;}
}
`;

type Props = {
  /** 已斩计数文案前缀，例如 "已斩 Bug" */
  counterLabel: string;
  /** 提示文案 */
  hint: string;
};

export default function BladeAvatar({ counterLabel, hint }: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [slashes, setSlashes] = useState(0);
  const [slashKey, setSlashKey] = useState(0);
  const [lungeKey, setLungeKey] = useState(0);

  /** 挥刀 + 计数 +1 */
  const slash = useCallback(() => {
    setSlashes((n) => n + 1);
    setSlashKey((k) => k + 1);
    setLungeKey((k) => k + 1);
  }, []);

  /** 监听 CTA 派发的 slash 事件（悬停「查看作品」即挥刀） */
  useEffect(() => {
    const onSlash = () => slash();
    window.addEventListener("hero:slash", onSlash);
    return () => window.removeEventListener("hero:slash", onSlash);
  }, [slash]);

  /** 指针位置 → CSS 变量（--gx/--gy/--tilt 归一化到 -1~1） */
  const onMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    el.style.setProperty("--gx", (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
    el.style.setProperty("--gy", (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
    el.style.setProperty("--tilt", (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
  }, []);

  const onLeave = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    el.style.setProperty("--gx", "0");
    el.style.setProperty("--gy", "0");
    el.style.setProperty("--tilt", "0");
  }, []);

  return (
    <div ref={wrapRef} className="hs-wrap" onPointerMove={onMove} onPointerLeave={onLeave}>
      <style>{CSS}</style>

      <button
        type="button"
        onClick={slash}
        className="block w-full cursor-pointer rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-500"
        aria-label={counterLabel}
      >
        <svg
          viewBox="0 0 400 640"
          className="hs-svg"
          role="img"
          aria-label="Silver-haired swordswoman mascot, an original character"
        >
          <defs>
            <linearGradient id="hsHair" x1="0" y1="0" x2="0.6" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="48%" stopColor="#f2ece7" />
              <stop offset="100%" stopColor="#d6cbc2" />
            </linearGradient>
            <linearGradient id="hsHairBack" x1="0.2" y1="0" x2="0.8" y2="1">
              <stop offset="0%" stopColor="#f4efea" />
              <stop offset="55%" stopColor="#ded4cb" />
              <stop offset="100%" stopColor="#bfb2a6" />
            </linearGradient>
            <linearGradient id="hsSkin" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fff7f1" />
              <stop offset="100%" stopColor="#f7e0d1" />
            </linearGradient>
            <linearGradient id="hsBlade" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#7f868e" />
              <stop offset="26%" stopColor="#dde4ea" />
              <stop offset="48%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#9aa1a9" />
            </linearGradient>
            <linearGradient id="hsCloth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#e9e3de" />
            </linearGradient>
            <linearGradient id="hsDark" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#443c41" />
              <stop offset="60%" stopColor="#2a2528" />
              <stop offset="100%" stopColor="#141113" />
            </linearGradient>
            <radialGradient id="hsIris" cx="50%" cy="34%" r="66%">
              <stop offset="0%" stopColor="#fdf0b8" />
              <stop offset="46%" stopColor="#e8ae2e" />
              <stop offset="100%" stopColor="#8a5410" />
            </radialGradient>
            <clipPath id="hsEyeL">
              <ellipse cx="175" cy="166" rx="16" ry="13.5" />
            </clipPath>
            <clipPath id="hsEyeR">
              <ellipse cx="225" cy="166" rx="16" ry="13.5" />
            </clipPath>
          </defs>

          {/* 地面投影 */}
          <ellipse cx="200" cy="618" rx="104" ry="13" fill="#0d0b0c" opacity="0.08" />

          {/* ============ 后发（最底层） ============ */}
          <g className="hs-sway">
            <path
              d="M200 64 C242 64 274 90 276 140 C278 190 292 254 304 326 C314 386 310 436 298 470 C291 490 277 497 270 486 C280 448 278 388 268 338 C261 306 253 284 246 264 C241 250 238 240 238 230 L162 230 C162 240 159 250 154 264 C147 284 139 306 132 338 C122 388 120 448 130 486 C123 497 109 490 102 470 C90 436 86 386 96 326 C108 254 122 190 124 140 C126 90 158 64 200 64 Z"
              fill="url(#hsHairBack)"
              stroke="#a89b8f"
              strokeWidth="1.4"
            />
            {/* 后发分束线 */}
            <g stroke="#a2968a" strokeWidth="1.1" fill="none" opacity="0.62">
              <path d="M144 214 C132 274 118 336 114 412" />
              <path d="M166 236 C158 292 150 356 150 452" />
              <path d="M256 214 C268 274 282 336 286 412" />
              <path d="M234 236 C242 292 250 356 250 452" />
            </g>
          </g>

          {/* 前飘发：几缕离开发主体的长发，强化飘逸感 */}
          <g className="hs-sway-b">
            <path
              d="M138 158 C120 232 102 316 100 404 C98 448 104 486 114 512 C104 470 100 404 108 350 C116 296 128 224 146 176 Z"
              fill="url(#hsHair)"
              stroke="#b5a99d"
              strokeWidth="1.1"
              opacity="0.96"
            />
            <path
              d="M258 152 C278 226 300 300 306 386 C310 442 304 490 292 522 C302 476 304 410 296 348 C287 284 270 214 250 168 Z"
              fill="url(#hsHair)"
              stroke="#b5a99d"
              strokeWidth="1.1"
              opacity="0.96"
            />
          </g>

          {/* ============ 身体 ============ */}
          <g className="hs-breathe">
            <g className="hs-lunge" key={lungeKey}>
              {/* 上衣 */}
              <path
                d="M200 242 C168 242 138 251 123 268 C105 288 98 334 100 384 L300 384 C302 334 295 288 277 268 C262 251 232 242 200 242 Z"
                fill="url(#hsCloth)"
                stroke="#d9cfd4"
                strokeWidth="1.5"
              />
              {/* 荷叶边领 */}
              <path
                d="M200 246 C180 246 165 252 156 261 C167 272 190 277 200 277 C210 277 233 272 244 261 C235 252 220 246 200 246 Z"
                fill="#ffffff"
                stroke="#e0d7db"
                strokeWidth="1.3"
              />
              {/* 黑色束腰 */}
              <path
                d="M128 328 C156 344 180 350 200 350 C220 350 244 344 272 328 L277 392 C246 403 222 408 200 408 C178 408 154 403 123 392 Z"
                fill="url(#hsDark)"
              />
              <circle cx="200" cy="342" r="3.6" fill="#e0a020" />
              <circle cx="200" cy="358" r="2.8" fill="#e0a020" opacity="0.85" />
              {/* 裙（宽百褶） */}
              <path
                d="M124 386 C106 434 96 500 90 566 L310 566 C304 500 294 434 276 386 C246 400 154 400 124 386 Z"
                fill="url(#hsDark)"
              />
              {/* 格纹 */}
              <g stroke="#655c62" strokeWidth="1" opacity="0.5" fill="none">
                <path d="M150 396 L128 562" />
                <path d="M200 400 L200 564" />
                <path d="M250 396 L272 562" />
                <path d="M116 452 L284 452" />
                <path d="M106 512 L294 512" />
              </g>
              {/* 白色围裙（整片） */}
              <path
                d="M200 352 C182 372 172 404 168 452 C164 500 166 542 170 572 L230 572 C234 542 236 500 232 452 C228 404 218 372 200 352 Z"
                fill="#fbf7f4"
                opacity="0.95"
              />
              <path d="M200 352 L200 572" stroke="#e6dcd6" strokeWidth="1.2" fill="none" opacity="0.8" />
              {/* 裙摆蕾丝 */}
              <path
                d="M90 566 q11-11 22 0 q11-11 22 0 q11-11 22 0 q11-11 22 0 q11-11 22 0 q11-11 22 0 q11-11 22 0 q11-11 22 0 l0 14 l-220 0 Z"
                fill="#ffffff"
                stroke="#e4dade"
                strokeWidth="1.2"
              />
            </g>
          </g>

          {/* ============ 颈 + 项圈 ============ */}
          <g className="hs-head">
            <path
              d="M181 208 L181 252 C181 262 219 262 219 252 L219 208 Z"
              fill="url(#hsSkin)"
              stroke="#e0c3b1"
              strokeWidth="1.2"
            />
            <path d="M175 248 C188 257 212 257 225 248 L225 259 C212 268 188 268 175 259 Z" fill="#2a2427" />
            <circle cx="200" cy="262" r="3" fill="#e0a020" />
          </g>

          {/* ============ 头组 ============ */}
          <g className="hs-head">
            {/* 脸：收窄 + 尖下巴 */}
            <path
              d="M141 154 C141 108 167 90 200 90 C233 90 259 108 259 154 C259 184 247 212 200 230 C153 212 141 184 141 154 Z"
              fill="url(#hsSkin)"
              stroke="#e0c3b1"
              strokeWidth="1.4"
            />
            <ellipse cx="142" cy="172" rx="6" ry="9" fill="url(#hsSkin)" stroke="#e0c3b1" strokeWidth="1.1" />
            <ellipse cx="258" cy="172" rx="6" ry="9" fill="url(#hsSkin)" stroke="#e0c3b1" strokeWidth="1.1" />
            {/* 腮红 */}
            <ellipse cx="159" cy="188" rx="10.5" ry="5.4" fill="#f0a49c" opacity="0.42" />
            <ellipse cx="241" cy="188" rx="10.5" ry="5.4" fill="#f0a49c" opacity="0.42" />
            {/* 眉 */}
            <path d="M157 143 C165 137 178 136 187 141" stroke="#b6a495" strokeWidth="2.8" fill="none" strokeLinecap="round" />
            <path d="M243 143 C235 137 222 136 213 141" stroke="#b6a495" strokeWidth="2.8" fill="none" strokeLinecap="round" />

            {/* 左眼 */}
            <ellipse cx="175" cy="166" rx="16" ry="13.5" fill="#fefcfc" />
            <g clipPath="url(#hsEyeL)">
              <g className="hs-gaze">
                <ellipse cx="175" cy="167" rx="11" ry="13" fill="url(#hsIris)" />
                <ellipse cx="175" cy="168" rx="4.6" ry="5.6" fill="#181310" />
                <ellipse cx="170.6" cy="160" r="3" fill="#ffffff" opacity="0.95" />
                <ellipse cx="180" cy="173" r="1.6" fill="#ffffff" opacity="0.6" />
              </g>
              <rect className="hs-lid" x="154" y="152" width="42" height="30" fill="url(#hsSkin)" />
            </g>
            <path d="M158 161 C165 150 185 150 192 161 C185 156 165 156 158 161 Z" fill="#2a2124" />

            {/* 右眼 */}
            <ellipse cx="225" cy="166" rx="16" ry="13.5" fill="#fefcfc" />
            <g clipPath="url(#hsEyeR)">
              <g className="hs-gaze">
                <ellipse cx="225" cy="167" rx="11" ry="13" fill="url(#hsIris)" />
                <ellipse cx="225" cy="168" rx="4.6" ry="5.6" fill="#181310" />
                <ellipse cx="220.6" cy="160" r="3" fill="#ffffff" opacity="0.95" />
                <ellipse cx="230" cy="173" r="1.6" fill="#ffffff" opacity="0.6" />
              </g>
              <rect className="hs-lid" x="204" y="152" width="42" height="30" fill="url(#hsSkin)" />
            </g>
            <path d="M208 161 C215 150 235 150 242 161 C235 156 215 156 208 161 Z" fill="#2a2124" />

            {/* 鼻 + 嘴 */}
            <path d="M199 185 q3 4 -1 5" stroke="#d9b4a1" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M193 206 q7 5 14 0" stroke="#c5857f" strokeWidth="2" fill="none" strokeLinecap="round" />

            {/* 刘海：斜刘海露出额头 */}
            <g className="hs-sway-b">
              <path
                d="M137 156 C133 100 162 76 200 76 C238 76 267 100 263 156 C257 128 247 110 235 102 C224 126 204 141 180 147 C163 151 149 158 140 170 Z"
                fill="url(#hsHair)"
                stroke="#b5a99d"
                strokeWidth="1.3"
              />
              <path d="M235 102 C226 126 205 141 182 148" stroke="#bfb3a8" strokeWidth="1.1" fill="none" />
              <path d="M164 150 C170 130 181 116 193 108" stroke="#bfb3a8" strokeWidth="1.1" fill="none" />
            </g>

            {/* 侧发（贴脸两束） */}
            <g className="hs-sway-b">
              <path d="M141 150 C134 194 133 246 140 292 C147 336 148 380 140 414 C132 388 128 342 130 296 C132 244 134 192 141 150 Z" fill="url(#hsHair)" stroke="#b5a99d" strokeWidth="1.2" />
              <path d="M259 150 C266 194 267 246 260 292 C253 336 252 380 260 414 C268 388 272 342 270 296 C268 244 266 192 259 150 Z" fill="url(#hsHair)" stroke="#b5a99d" strokeWidth="1.2" />
            </g>

            {/* 缎带 */}
            <g className="hs-ribbon">
              <path d="M160 106 C146 92 128 90 124 101 C120 112 138 121 154 118 Z" fill="#2a2427" />
              <path d="M162 106 C173 90 191 86 196 97 C201 108 185 119 169 119 Z" fill="#352e32" />
              <circle cx="161" cy="108" r="5.6" fill="#443c41" />
              <path d="M157 114 C150 134 145 156 147 178 L138 180 C133 154 138 130 147 112 Z" fill="#2a2427" />
              <path d="M164 114 C173 132 180 152 182 174 L173 179 C171 154 164 132 155 112 Z" fill="#352e32" />
            </g>
            {/* 十字发饰 */}
            <g transform="translate(161,140)">
              <path
                d="M0 -12 L3.6 -12 L3.6 -4 L12 -4 L12 0 L3.6 0 L3.6 12 L0 12 L0 0 L-12 0 L-12 -4 L0 -4 Z"
                fill="#f0eaee"
                stroke="#9a8f96"
                strokeWidth="1"
              />
            </g>
          </g>

          {/* ============ 手臂（握刀，置于刀下） ============ */}
          <g className="hs-breathe">
            <path
              d="M132 286 C114 276 98 250 90 222 C86 208 102 202 110 214 C122 240 136 262 152 272 Z"
              fill="url(#hsCloth)"
              stroke="#d5cbd0"
              strokeWidth="1.4"
            />
            <path d="M96 216 c-6-9-1-20 8-21 c8-1 13 6 13 13 c0 7-3 12-8 14 c-5 2-10 0-13-6 Z" fill="url(#hsSkin)" stroke="#e0c3b1" strokeWidth="1.2" />
            <path
              d="M268 288 C286 296 300 320 306 348 C310 366 296 372 290 356 C283 336 272 314 256 302 Z"
              fill="url(#hsCloth)"
              stroke="#d5cbd0"
              strokeWidth="1.4"
            />
            <path d="M300 350 c7-6 17-3 19 5 c2 8-4 14-11 15 c-6 1-11-4-11-10 Z" fill="url(#hsSkin)" stroke="#e0c3b1" strokeWidth="1.2" />
          </g>

          {/* ============ 刀（最前层，横贯身前） ============ */}
          <g transform="translate(88,196) rotate(34)">
            <path d="M-62 -7 L-4 -7 L-4 7 L-62 7 Z" fill="#241f22" />
            {[-52, -42, -32, -22, -12].map((x) => (
              <path key={x} d={`M${x} -7 L${x + 6} 7`} stroke="#4f474c" strokeWidth="2.2" />
            ))}
            <path d="M-64 -10 h6 a4.5 4.5 0 0 1 0 9 h-6 Z" fill="#3d373b" />
            <ellipse cx="0" cy="0" rx="6" ry="13" fill="#2f2a2e" />
            <ellipse cx="0" cy="0" rx="2.8" ry="8" fill="#e0a020" opacity="0.8" />
            <path d="M6 -6 L276 -3 L300 0 L276 3 L6 6 Z" fill="url(#hsBlade)" />
            <path d="M8 -2.4 L272 -1" stroke="#ffffff" strokeWidth="1.6" opacity="0.92" />
            <path d="M10 3.4 L266 1.6" stroke="#7a8088" strokeWidth="1" opacity="0.65" />
            <path d="M300 0 L314 0 L302 2.6 Z" fill="#9aa1a9" />
          </g>

          {/* ============ 刀光 ============ */}
          {slashKey > 0 && (
            <g key={slashKey}>
              <path className="hs-slash" d="M84 168 C160 216 250 274 336 342" stroke="#f7cd6b" strokeWidth="8" fill="none" strokeLinecap="round" />
              <path className="hs-slash" d="M92 188 C166 232 250 286 328 350" stroke="#ffffff" strokeWidth="2.6" fill="none" strokeLinecap="round" opacity="0.9" />
            </g>
          )}
        </svg>
      </button>

      {/* 已斩计数 */}
      <div className="pointer-events-none absolute -bottom-1 right-0 hidden flex-col items-end gap-1 sm:flex sm:right-1">
        <div className="flex items-center gap-1.5 rounded-full border border-emerald-300 bg-white/90 px-3 py-1 text-xs font-medium text-emerald-700 shadow-sm backdrop-blur dark:border-emerald-800 dark:bg-zinc-900/90 dark:text-emerald-300">
          <span className="hs-pulse h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span className="tabular-nums">
            {counterLabel} {slashes}
          </span>
        </div>
        <span className="max-w-[200px] text-right text-[11px] leading-snug text-zinc-500 dark:text-zinc-400">
          {hint}
        </span>
      </div>
    </div>
  );
}

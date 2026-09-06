"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import BackToCase from "@/components/BackToCase";
import { CountUp, Reveal } from "@/components/showcase/reveal";

type Lang = "zh" | "en";
type Bi = { zh: string; en: string };
const L = (b: Bi, lang: Lang) => b[lang === "en" ? "en" : "zh"];

const vars = {
  "--sf-bg": "#06070D",
  "--sf-panel": "#0C0F1A",
  "--sf-line": "#232A3C",
  "--sf-fg": "#F2F4F8",
  "--sf-muted": "#9AA3B5",
  "--sf-gold": "#E8C15A",
  "--sf-cyan": "#7DD3FC",
} as CSSProperties;

const MONO = { fontFamily: "ui-monospace, 'Cascadia Code', 'JetBrains Mono', Consolas, monospace" };
const IMG = "/showcase/starfall";

export default function StarfallSaga({ lang, backHref, backLabel }: { lang: Lang; backHref: string; backLabel: string }) {
  return (
    <div className="py-14">
      <BackToCase href={backHref} label={backLabel} />
      <style>{`
        @keyframes sf-kenburns { from { transform: scale(1.02); } to { transform: scale(1.1); } }
        @keyframes sf-fadein { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        @keyframes sf-slidein { from { opacity: 0; transform: translateX(26px); } to { opacity: 1; transform: none; } }
        @keyframes sf-slidein-l { from { opacity: 0; transform: translateX(-26px); } to { opacity: 1; transform: none; } }
        @keyframes sf-pulse { 0% { box-shadow: 0 0 0 0 rgba(232,193,90,.45); } 70% { box-shadow: 0 0 0 14px rgba(232,193,90,0); } 100% { box-shadow: 0 0 0 0 rgba(232,193,90,0); } }
        @keyframes sf-blink { 0%, 100% { opacity: 1; } 50% { opacity: .25; } }
        .sf-ghost { transition: transform .2s ease, border-color .2s ease, background .2s ease; }
        .sf-ghost:hover { border-color: rgba(232,193,90,.7) !important; background: rgba(232,193,90,.08) !important; transform: translateY(-1px); }
        .sf-newsrow:hover { background: rgba(232,193,90,.05) !important; }
        .sf-thumb:hover .sf-thumbimg { transform: scale(1.06); }
        .sf-thumb:hover .sf-play { transform: scale(1.12); }
        .sf-dl { color: var(--sf-fg); transition: background .2s ease, color .2s ease, transform .2s ease; }
        .sf-dl:hover { background: var(--sf-gold) !important; color: #000 !important; transform: translateY(-1px); }
        .sf-dl:hover .sf-dl-sub { color: rgba(0,0,0,.65) !important; }
      `}</style>
      <div
        className="mt-6 overflow-hidden rounded-3xl border border-zinc-200 shadow-xl dark:border-zinc-800"
        style={{ ...vars, background: "var(--sf-bg)" }}
      >
        <Hero lang={lang} />
        <VersionBand lang={lang} />
        <World lang={lang} />
        <Characters lang={lang} />
        <Media lang={lang} />
        <News lang={lang} />
        <Download lang={lang} />
        <Footer lang={lang} />
      </div>
    </div>
  );
}

/* ================= 导航（覆盖在 hero 之上） ================= */
function SiteNav({ lang }: { lang: Lang }) {
  const items: [Bi, string][] = [
    [{ zh: "版本", en: "Version" }, "#sf-version"],
    [{ zh: "世界观", en: "World" }, "#sf-world"],
    [{ zh: "角色", en: "Characters" }, "#sf-chars"],
    [{ zh: "影像资料", en: "Media" }, "#sf-media"],
    [{ zh: "情报", en: "News" }, "#sf-news"],
  ];
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent px-6 py-4 sm:px-10">
        <a href="#sf-top" className="flex items-baseline gap-2.5">
          <span className="text-lg font-bold tracking-[0.3em]" style={{ color: "var(--sf-fg)" }}>
            {L({ zh: "星坠战纪", en: "星坠战纪" }, lang)}
          </span>
          <span className="text-[10px] tracking-[0.35em]" style={{ color: "var(--sf-gold)", ...MONO }}>
            STARFALL SAGA
          </span>
        </a>
        <nav className="hidden items-center gap-7 text-[13px] lg:flex" style={{ color: "var(--sf-fg)" }}>
          {items.map(([label, href]) => (
            <a key={href} href={href} className="transition hover:text-[color:var(--sf-gold)]">{L(label, lang)}</a>
          ))}
        </nav>
        <a
          href="#sf-download"
          className="border px-4 py-2 text-xs font-semibold tracking-widest transition hover:bg-[color:var(--sf-gold)] hover:text-black"
          style={{ borderColor: "var(--sf-gold)", color: "var(--sf-gold)" }}
        >
          {L({ zh: "进入游戏", en: "PLAY NOW" }, lang)}
        </a>
      </div>
    </header>
  );
}

/* ================= Hero：全幅 KV + 呼吸放大 + 轮播情报条 ================= */
const TICKER: { tag: Bi; text: Bi }[] = [
  { tag: { zh: "版本", en: "VER." }, text: { zh: "1.2 版本「群星归位」现已开放，登录领取星尘 ×1600", en: "Version 1.2 \"Constellation Realigned\" is live — claim 1,600 stardust" } },
  { tag: { zh: "活动", en: "EVENT" }, text: { zh: "限定祈愿「织月者的黄昏」开启中，露娜薇概率提升", en: "Limited wish \"Dusk of the Moonthweaver\" — Lunave rate up" } },
  { tag: { zh: "公告", en: "NOTICE" }, text: { zh: "9 月 8 日 06:00 服务器维护，预计 3 小时，补偿星尘 ×300", en: "Server maintenance Sep 8, 06:00 (≈3h). Compensation: 300 stardust" } },
];

function Hero({ lang }: { lang: Lang }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => (t + 1) % TICKER.length), 4200);
    return () => clearInterval(id);
  }, []);
  const item = TICKER[tick];
  return (
    <section id="sf-top" className="relative min-h-[92vh] overflow-hidden">
      <SiteNav lang={lang} />
      {/* KV 背景：缓慢呼吸放大 */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${IMG}/kv.jpg`} alt="" className="h-full w-full object-cover" style={{ animation: "sf-kenburns 22s ease-in-out infinite alternate" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(6,7,13,0.55) 0%, rgba(6,7,13,0.12) 34%, rgba(6,7,13,0.24) 62%, var(--sf-bg) 96%)" }} />
      </div>
      {/* 中央 logo 区 */}
      <div className="relative z-10 flex min-h-[92vh] flex-col items-center justify-center px-6 pb-28 pt-24 text-center">
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="hidden h-px w-16 sm:block" style={{ background: "linear-gradient(90deg,transparent,var(--sf-gold))" }} />
            <span className="text-[11px] tracking-[0.5em]" style={{ color: "var(--sf-gold)", ...MONO }}>OPEN-GALAXY RPG</span>
            <span className="hidden h-px w-16 sm:block" style={{ background: "linear-gradient(90deg,var(--sf-gold),transparent)" }} />
          </div>
        </Reveal>
        <Reveal delay={140}>
          <h1 className="mt-5 text-5xl font-black tracking-[0.18em] sm:text-6xl lg:text-7xl" style={{ color: "var(--sf-fg)", textShadow: "0 4px 30px rgba(0,0,0,0.65)" }}>
            {L({ zh: "星坠战纪", en: "STARFALL SAGA" }, lang)}
          </h1>
        </Reveal>
        <Reveal delay={260}>
          <p className="mt-5 max-w-xl text-sm leading-relaxed sm:text-base" style={{ color: "rgba(242,244,248,0.85)", textShadow: "0 2px 14px rgba(0,0,0,0.7)" }}>
            {L({ zh: "群星陨落之时，便是你崛起之刻。", en: "When the stars fall, your legend rises." }, lang)}
          </p>
        </Reveal>
        <Reveal delay={380}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3.5">
            <a
              href="#sf-download"
              className="px-9 py-3.5 text-sm font-bold tracking-widest text-black transition hover:brightness-110 active:scale-95"
              style={{ background: "var(--sf-gold)", clipPath: "polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)" }}
            >
              {L({ zh: "立即下载", en: "DOWNLOAD" }, lang)}
            </a>
            <a
              href="#sf-media"
              className="sf-ghost group flex items-center gap-2.5 border px-7 py-3.5 text-sm font-semibold"
              style={{ borderColor: "rgba(242,244,248,0.5)", color: "var(--sf-fg)", background: "rgba(6,7,13,0.35)" }}
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full text-[9px]" style={{ background: "var(--sf-gold)", color: "#000" }}>▶</span>
              {L({ zh: "观看 PV", en: "WATCH PV" }, lang)}
            </a>
          </div>
        </Reveal>
        <Reveal delay={500}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5 text-[11px]" style={{ color: "rgba(242,244,248,0.75)" }}>
            {["iOS", "Android", "PC", lang === "zh" ? "数据互通" : "Cross-save"].map((p) => (
              <span key={p} className="border px-3 py-1.5 tracking-wider" style={{ borderColor: "rgba(242,244,248,0.28)", background: "rgba(6,7,13,0.4)" }}>{p}</span>
            ))}
          </div>
        </Reveal>
      </div>
      {/* 底部情报轮播条 */}
      <div className="absolute inset-x-0 bottom-0 z-20 border-t backdrop-blur-sm" style={{ borderColor: "rgba(242,244,248,0.14)", background: "rgba(6,7,13,0.55)" }}>
        <div className="flex items-center gap-4 px-6 py-3 sm:px-10">
          <span className="flex shrink-0 items-center gap-2 text-[11px] font-bold tracking-[0.25em]" style={{ color: "var(--sf-gold)" }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--sf-gold)", animation: "sf-blink 1.6s ease infinite" }} />
            {L({ zh: "最新情报", en: "LATEST" }, lang)}
          </span>
          <div key={tick} style={{ animation: "sf-fadein .5s ease both" }} className="min-w-0 flex-1">
            <span className="mr-2.5 border px-1.5 py-0.5 text-[10px] font-semibold align-middle" style={{ borderColor: "var(--sf-gold)", color: "var(--sf-gold)" }}>
              {L(item.tag, lang)}
            </span>
            <span className="text-xs sm:text-[13px]" style={{ color: "var(--sf-fg)" }}>{L(item.text, lang)}</span>
          </div>
          <div className="hidden shrink-0 gap-1.5 sm:flex">
            {TICKER.map((_, i) => (
              <button key={i} type="button" onClick={() => setTick(i)} className="h-1 transition-all" style={{ width: i === tick ? 18 : 8, background: i === tick ? "var(--sf-gold)" : "rgba(242,244,248,0.3)" }} aria-label={`news ${i + 1}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= 版本横幅 ================= */
function VersionBand({ lang }: { lang: Lang }) {
  return (
    <section id="sf-version" className="relative overflow-hidden" style={{ background: "var(--sf-panel)" }}>
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${IMG}/world.jpg`} alt="" className="h-full w-full object-cover opacity-45" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, var(--sf-bg) 8%, rgba(6,7,13,0.72) 46%, rgba(6,7,13,0.15) 100%)" }} />
      </div>
      <Reveal dir="left">
        <div className="relative z-10 flex flex-wrap items-center gap-x-10 gap-y-5 px-6 py-12 sm:px-10 lg:py-14">
          <div>
            <div className="text-[11px] font-bold tracking-[0.4em]" style={{ color: "var(--sf-cyan)", ...MONO }}>VERSION 1.2 · NOW LIVE</div>
            <div className="mt-2 text-2xl font-black tracking-widest sm:text-3xl" style={{ color: "var(--sf-fg)" }}>
              {L({ zh: "1.2 版本「群星归位」", en: "Version 1.2 — Constellation Realigned" }, lang)}
            </div>
            <div className="mt-2 max-w-xl text-[13px] leading-relaxed" style={{ color: "var(--sf-muted)" }}>
              {L(
                { zh: "新篇章开启：坠星环的真相浮出水面，限时活动、新角色与新装备同步上线。", en: "A new chapter begins: the truth of the Starfall Ring emerges, with a limited event, new characters and gear." },
                lang
              )}
            </div>
          </div>
          <a
            href="#sf-news"
            className="sf-ghost ml-auto border px-7 py-3 text-sm font-bold tracking-widest"
            style={{ borderColor: "var(--sf-gold)", color: "var(--sf-gold)" }}
          >
            {L({ zh: "前往活动 →", en: "EVENT DETAILS →" }, lang)}
          </a>
        </div>
      </Reveal>
    </section>
  );
}

/* ================= 世界观 ================= */
const WORLD_STATS = [
  { to: 300, suffix: "+", label: { zh: "可探索星域", en: "Explorable sectors" } },
  { to: 12, suffix: "", label: { zh: "主线章节", en: "Story chapters" } },
  { to: 60, suffix: "+", label: { zh: "可招募角色", en: "Recruitable heroes" } },
  { to: 4, suffix: "P", label: { zh: "协力会战", en: "Co-op raids" } },
];

function World({ lang }: { lang: Lang }) {
  return (
    <section id="sf-world" className="relative overflow-hidden border-t" style={{ borderColor: "var(--sf-line)", background: "var(--sf-bg)" }}>
      <div className="grid gap-0 lg:grid-cols-[1.05fr_1fr]">
        <Reveal dir="left">
          <div className="px-6 py-16 sm:px-10 lg:py-24">
            <div className="flex items-center gap-3 text-[11px] tracking-[0.35em]" style={{ color: "var(--sf-gold)", ...MONO }}>
              <span>01</span><span className="h-px w-10" style={{ background: "var(--sf-gold)" }} /><span>WORLD</span>
            </div>
            <h2 className="mt-4 text-2xl font-black tracking-wider sm:text-[2rem]" style={{ color: "var(--sf-fg)" }}>
              {L({ zh: "群星坠落之后，文明在废墟上重燃", en: "After the great fall, civilization burns anew" }, lang)}
            </h2>
            <p className="mt-5 max-w-lg text-[13.5px] leading-7" style={{ color: "var(--sf-muted)" }}>
              {L(
                { zh: "纪元 3127 年，巨大的「坠星环」毫无征兆地悬停在各文明头顶。星尘改写了物理法则，旧国崩解，新的势力从废墟中升起——而你，是极少数能听见「星语」的觉知者。集结同伴，穿越浮岛与深渊，在群星的注视下找回这个世界的答案。",
                  en: "Year 3127: a colossal Starfall Ring hangs motionless above every civilization. Stardust has rewritten physics, old nations have collapsed, and new powers rise from the ruins — you are one of the few Awakened who can hear the \"star-tongue\". Gather allies, cross floating isles and abyssal depths, and reclaim the world's answer under the gaze of the stars." },
                lang
              )}
            </p>
            <p className="mt-4 max-w-lg text-[13.5px] leading-7" style={{ color: "var(--sf-muted)" }}>
              {L(
                { zh: "你的每一次选择都会写入「星坠编年史」——赛季结束时，世界将因所有玩家的抉择而改变样貌。",
                  en: "Every choice you make is written into the Starfall Chronicle — when a season ends, the world itself changes shape." },
                lang
              )}
            </p>
            <div className="mt-9 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              {WORLD_STATS.map((s, i) => (
                <div key={s.label.en}>
                  <div className="text-2xl font-black" style={{ color: "var(--sf-gold)" }}>
                    <CountUp to={s.to} suffix={s.suffix} duration={1400} />
                  </div>
                  <div className="mt-1 text-[11px]" style={{ color: "var(--sf-muted)" }}>{L(s.label, lang)}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal dir="right">
          <div className="relative h-full min-h-[320px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${IMG}/world.jpg`} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 lg:hidden" style={{ background: "linear-gradient(180deg, var(--sf-bg) 0%, transparent 30%)" }} />
            <div className="absolute bottom-4 right-6 border px-3 py-1.5 text-[10px] tracking-[0.3em] backdrop-blur-sm" style={{ borderColor: "rgba(242,244,248,0.3)", color: "rgba(242,244,248,0.85)", background: "rgba(6,7,13,0.45)", ...MONO }}>
              {L({ zh: "浮岛群 · 观星台旧址", en: "The Floating Isles · Old Observatory" }, lang)}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ================= 角色 ================= */
const CHARS = [
  {
    id: "rin",
    img: `${IMG}/char-rin.jpg`,
    name: { zh: "凛", en: "Rin" },
    title: { zh: "断星之刃", en: "Blade That Cleaves Stars" },
    role: { zh: "星芒 · 近卫", en: "Stargleam · Vanguard" },
    desc: {
      zh: "「坠星骑士团」最后的幸存者。沉默寡言，却背负着整支队伍的遗志。她的刀能斩断星尘的流动——传说中，那一斩曾让坠星环偏移了 0.3 度。",
      en: "The last survivor of the Starfall Knights. Silent and reserved, she carries the will of her entire fallen order. Her blade can sever the flow of stardust — legend says her single strike once knocked the Ring off course by 0.3 degrees.",
    },
    quote: { zh: "刀刃所指，即是星轨的方向。", en: "Where the blade points, the stars align." },
    bars: [["ATK", 92], ["DEF", 64], ["SPD", 85], ["DIFF", 40]] as [string, number][],
  },
  {
    id: "cael",
    img: `${IMG}/char-cael.jpg`,
    name: { zh: "凱尔", en: "Cael" },
    title: { zh: "白昼孤星", en: "Lone Star of Noon" },
    role: { zh: "燧金 · 射手", en: "Flintgold · Marksman" },
    desc: {
      zh: "前星际佣兵团长，把赏金全部花在了情报网上。他说自己留下来的理由是佣金，可每次撤退，他总是最后一个离开战场。",
      en: "A former mercenary captain who spends every bounty on his intelligence network. He claims he stays for the pay — yet in every retreat, he is the last one off the field.",
    },
    quote: { zh: "瞄准之后，就不要犹豫。", en: "Once you aim, never hesitate." },
    bars: [["ATK", 84], ["DEF", 58], ["SPD", 90], ["DIFF", 55]] as [string, number][],
  },
  {
    id: "lunave",
    img: `${IMG}/char-lunave.jpg`,
    name: { zh: "露娜薇", en: "Lunave" },
    title: { zh: "织月者", en: "The Moonthweaver" },
    role: { zh: "辉月 · 术师", en: "Gleammoon · Caster" },
    desc: {
      zh: "观星台最后的大祭司继承人，能将月光织成实体的咒印。她温柔地对待所有人——除了那些试图触碰坠星环的家伙。",
      en: "Heir to the last high priestess of the Observatory, she weaves moonlight into tangible sigils. Gentle to everyone — except those who try to touch the Ring.",
    },
    quote: { zh: "月亮今晚也在看着我们哦。", en: "The moon is watching us tonight, you know." },
    bars: [["ATK", 78], ["DEF", 70], ["SPD", 62], ["DIFF", 88]] as [string, number][],
  },
];

function Characters({ lang }: { lang: Lang }) {
  const [sel, setSel] = useState(0);
  const c = CHARS[sel];
  return (
    <section id="sf-chars" className="relative overflow-hidden border-t" style={{ borderColor: "var(--sf-line)", background: "var(--sf-panel)" }}>
      <div className="px-6 pt-16 sm:px-10">
        <Reveal dir="left">
          <div className="flex items-center gap-3 text-[11px] tracking-[0.35em]" style={{ color: "var(--sf-gold)", ...MONO }}>
            <span>02</span><span className="h-px w-10" style={{ background: "var(--sf-gold)" }} /><span>CHARACTERS</span>
          </div>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-2xl font-black tracking-wider sm:text-[2rem]" style={{ color: "var(--sf-fg)" }}>
              {L({ zh: "与觉知者同行", en: "Walk with the Awakened" }, lang)}
            </h2>
            <p className="max-w-md text-xs leading-relaxed" style={{ color: "var(--sf-muted)" }}>
              {L({ zh: "点击左侧名单切换角色档案。60+ 角色均可招募，每个都有专属剧情线。", en: "Click a name to open their file. 60+ recruitable heroes, each with a personal storyline." }, lang)}
            </p>
          </div>
        </Reveal>
      </div>
      <div className="grid gap-0 pt-8 lg:grid-cols-[22rem_1fr]">
        {/* 名单 */}
        <Reveal dir="left">
          <div className="flex h-full flex-col justify-center gap-1 px-6 pb-10 sm:px-10 lg:pb-16">
            {CHARS.map((x, i) => {
              const on = i === sel;
              return (
                <button
                  key={x.id}
                  type="button"
                  onClick={() => setSel(i)}
                  className="group relative border-l-2 px-5 py-4 text-left transition-all duration-300"
                  style={{
                    borderColor: on ? "var(--sf-gold)" : "var(--sf-line)",
                    background: on ? "rgba(232,193,90,0.07)" : "transparent",
                  }}
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-xl font-black tracking-widest transition-colors" style={{ color: on ? "var(--sf-gold)" : "var(--sf-fg)" }}>
                      {L(x.name, lang)}
                    </span>
                    <span className="text-[10px] tracking-[0.25em]" style={{ color: on ? "var(--sf-gold)" : "var(--sf-muted)", ...MONO }}>{x.role[lang === "en" ? "en" : "zh"].split("·")[0].trim().toUpperCase()}</span>
                  </div>
                  <div className="mt-1 text-xs" style={{ color: "var(--sf-muted)" }}>{L(x.title, lang)}</div>
                </button>
              );
            })}
          </div>
        </Reveal>
        {/* 大立绘 + 档案 */}
        <div className="relative min-h-[540px] overflow-hidden lg:min-h-[620px]">
          {CHARS.map((x, i) => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={x.id}
              src={x.img}
              alt={x.name.en}
              className="absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-700"
              style={{ opacity: i === sel ? 1 : 0 }}
            />
          ))}
          <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(6,7,13,0.88) 0%, rgba(6,7,13,0.55) 34%, rgba(6,7,13,0.05) 62%, rgba(6,7,13,0.72) 100%)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, var(--sf-panel) 2%, transparent 40%)" }} />
          <div key={c.id} className="absolute bottom-0 left-0 max-w-lg p-6 sm:p-10" style={{ animation: "sf-slidein-l .5s ease both" }}>
            <div className="text-[11px] tracking-[0.3em]" style={{ color: "var(--sf-cyan)", ...MONO }}>{c.role[lang === "en" ? "en" : "zh"].toUpperCase()}</div>
            <div className="mt-2 flex items-baseline gap-4">
              <span className="text-4xl font-black tracking-widest" style={{ color: "var(--sf-fg)" }}>{L(c.name, lang)}</span>
              <span className="text-sm font-semibold" style={{ color: "var(--sf-gold)" }}>{L(c.title, lang)}</span>
            </div>
            <p className="mt-4 text-[13px] leading-6" style={{ color: "rgba(242,244,248,0.82)" }}>{L(c.desc, lang)}</p>
            <p className="mt-3 border-l-2 pl-3 text-[13px] italic" style={{ borderColor: "var(--sf-gold)", color: "var(--sf-muted)" }}>
              {L(c.quote, lang)}
            </p>
            <div className="mt-5 grid max-w-xs grid-cols-2 gap-x-6 gap-y-2.5">
              {c.bars.map(([k, v], bi) => (
                <div key={k}>
                  <div className="flex justify-between text-[10px] tracking-widest" style={{ color: "var(--sf-muted)", ...MONO }}>
                    <span>{k}</span><span>{v}</span>
                  </div>
                  <div className="mt-1 h-1 w-full" style={{ background: "rgba(242,244,248,0.12)" }}>
                    <div className="h-full transition-all duration-700" style={{ width: `${v}%`, background: bi % 2 ? "var(--sf-cyan)" : "var(--sf-gold)", transitionDelay: `${bi * 90}ms` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= 影像资料 ================= */
const MEDIA: { img: string; dur: string; title: Bi }[] = [
  { img: `${IMG}/media-battle.jpg`, dur: "02:14", title: { zh: "战斗演示：断星峡谷", en: "Combat Demo: Shattered-Star Canyon" } },
  { img: `${IMG}/media-city.jpg`, dur: "01:38", title: { zh: "星历祭 PV", en: "Starfeast Festival PV" } },
  { img: `${IMG}/world.jpg`, dur: "03:05", title: { zh: "世界观先导片", en: "World Prelude Film" } },
];

function Media({ lang }: { lang: Lang }) {
  return (
    <section id="sf-media" className="border-t px-6 py-16 sm:px-10 lg:py-20" style={{ borderColor: "var(--sf-line)", background: "var(--sf-bg)" }}>
      <Reveal dir="right">
        <div className="flex items-center gap-3 text-[11px] tracking-[0.35em]" style={{ color: "var(--sf-gold)", ...MONO }}>
          <span>03</span><span className="h-px w-10" style={{ background: "var(--sf-gold)" }} /><span>MEDIA</span>
        </div>
        <h2 className="mt-4 text-2xl font-black tracking-wider sm:text-[2rem]" style={{ color: "var(--sf-fg)" }}>
          {L({ zh: "影像资料", en: "Videos & Trailers" }, lang)}
        </h2>
      </Reveal>
      <div className="mt-9 grid gap-4 sm:grid-cols-3">
        {MEDIA.map((m, i) => (
          <Reveal key={m.img} dir={i === 1 ? "left" : "right"} delay={i * 110}>
            <button type="button" className="sf-thumb group block w-full text-left">
              <div className="relative aspect-video overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.img} alt={m.title.en} className="sf-thumbimg h-full w-full object-cover transition-transform duration-500" />
                <div className="absolute inset-0 transition-colors group-hover:bg-black/10" style={{ background: "linear-gradient(180deg, transparent 55%, rgba(6,7,13,0.7))" }} />
                <span
                  className="sf-play absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-sm text-black transition-transform duration-300"
                  style={{ background: "rgba(232,193,90,0.92)", animation: "sf-pulse 2.6s ease infinite" }}
                >
                  ▶
                </span>
                <span className="absolute bottom-2.5 right-3 text-[10px] tracking-widest" style={{ color: "rgba(242,244,248,0.9)", ...MONO }}>{m.dur}</span>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="text-[13px] font-semibold" style={{ color: "var(--sf-fg)" }}>{L(m.title, lang)}</span>
                <span className="text-[10px] tracking-widest transition-colors group-hover:text-[color:var(--sf-gold)]" style={{ color: "var(--sf-muted)" }}>▶ {L({ zh: "播放", en: "PLAY" }, lang)}</span>
              </div>
            </button>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ================= 情报列表 ================= */
const NEWS: { date: string; cat: Bi; color: string; title: Bi }[] = [
  { date: "2026-09-06", cat: { zh: "版本", en: "VER." }, color: "#E8C15A", title: { zh: "1.2 版本「群星归位」更新公告：新篇章、新角色、新装备", en: "Version 1.2 \"Constellation Realigned\" notes: new chapter, characters & gear" } },
  { date: "2026-09-04", cat: { zh: "活动", en: "EVENT" }, color: "#7DD3FC", title: { zh: "限定祈愿「织月者的黄昏」开启，露娜薇概率提升", en: "Limited wish \"Dusk of the Moonthweaver\": Lunave rate up" } },
  { date: "2026-09-01", cat: { zh: "活动", en: "EVENT" }, color: "#7DD3FC", title: { zh: "星历祭限时活动预告：双重掉落与专属纪念头像框", en: "Starfeast preview: double drops and exclusive portrait frame" } },
  { date: "2026-08-28", cat: { zh: "公告", en: "NOTICE" }, color: "#9AA3B5", title: { zh: "9 月 8 日服务器维护公告（06:00-09:00）", en: "Server maintenance notice (Sep 8, 06:00–09:00)" } },
  { date: "2026-08-24", cat: { zh: "社区", en: "COMM." }, color: "#A78BFA", title: { zh: "首届同人创作大赛开启，总奖金池 ¥200,000", en: "First fan-creation contest opens; ¥200,000 prize pool" } },
];

function News({ lang }: { lang: Lang }) {
  return (
    <section id="sf-news" className="border-t px-6 py-16 sm:px-10 lg:py-20" style={{ borderColor: "var(--sf-line)", background: "var(--sf-panel)" }}>
      <Reveal dir="left">
        <div className="flex items-center gap-3 text-[11px] tracking-[0.35em]" style={{ color: "var(--sf-gold)", ...MONO }}>
          <span>04</span><span className="h-px w-10" style={{ background: "var(--sf-gold)" }} /><span>INTEL</span>
        </div>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-2xl font-black tracking-wider sm:text-[2rem]" style={{ color: "var(--sf-fg)" }}>
            {L({ zh: "最新情报", en: "Latest Intel" }, lang)}
          </h2>
          <a href="#sf-download" className="text-xs font-semibold transition hover:opacity-70" style={{ color: "var(--sf-muted)" }}>
            {L({ zh: "查看全部 →", en: "VIEW ALL →" }, lang)}
          </a>
        </div>
      </Reveal>
      <Reveal dir="right" delay={140}>
        <div className="mt-8 border-t" style={{ borderColor: "var(--sf-line)" }}>
          {NEWS.map((n) => (
            <a
              key={n.title.en}
              href="#sf-news"
              className="sf-newsrow group flex items-center gap-4 border-b py-4 transition-colors sm:gap-7"
              style={{ borderColor: "var(--sf-line)" }}
            >
              <span className="shrink-0 text-xs tracking-wider" style={{ color: "var(--sf-muted)", ...MONO }}>{n.date}</span>
              <span
                className="hidden w-16 shrink-0 border px-1.5 py-0.5 text-center text-[10px] font-bold tracking-widest sm:inline-block"
                style={{ borderColor: n.color, color: n.color }}
              >
                {L(n.cat, lang)}
              </span>
              <span className="min-w-0 flex-1 truncate text-[13.5px] transition-colors group-hover:text-[color:var(--sf-gold)]" style={{ color: "var(--sf-fg)" }}>
                {L(n.title, lang)}
              </span>
              <span className="shrink-0 text-xs transition-transform group-hover:translate-x-1" style={{ color: "var(--sf-muted)" }}>→</span>
            </a>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

/* ================= 下载 CTA ================= */
function FakeQR() {
  const n = 21;
  const rects: ReactNode[] = [];
  const inFinderZone = (i: number, j: number) => (i < 7 && j < 7) || (i >= n - 7 && j < 7) || (i < 7 && j >= n - 7);
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      let on: boolean;
      if (inFinderZone(i, j)) {
        const li = i < 7 ? i : i - (n - 7);
        const lj = j < 7 ? j : j - (n - 7);
        const ring = Math.max(Math.abs(li - 3), Math.abs(lj - 3));
        on = ring !== 2;
      } else {
        on = ((i * 7 + j * 13 + ((i * j) % 11)) % 7) < 3;
      }
      if (on) rects.push(<rect key={`${i}-${j}`} x={i} y={j} width="1" height="1" />);
    }
  }
  return (
    <svg viewBox="0 0 21 21" className="h-28 w-28" fill="#F2F4F8" aria-hidden>
      {rects}
    </svg>
  );
}

function Download({ lang }: { lang: Lang }) {
  return (
    <section id="sf-download" className="relative overflow-hidden border-t px-6 py-20 text-center sm:px-10" style={{ borderColor: "var(--sf-line)", background: "radial-gradient(120% 140% at 50% 110%, rgba(232,193,90,0.16) 0%, rgba(6,7,13,0.4) 45%, var(--sf-bg) 80%)" }}>
      <Reveal>
        <div className="flex items-center justify-center gap-3 text-[11px] tracking-[0.35em]" style={{ color: "var(--sf-gold)", ...MONO }}>
          <span>05</span><span className="h-px w-10" style={{ background: "var(--sf-gold)" }} /><span>DOWNLOAD</span>
        </div>
        <h2 className="mt-5 text-3xl font-black tracking-widest sm:text-4xl" style={{ color: "var(--sf-fg)" }}>
          {L({ zh: "跨越星海，此刻启程", en: "Cross the star sea — begin now" }, lang)}
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-[13px] leading-relaxed" style={{ color: "var(--sf-muted)" }}>
          {L(
            { zh: "免费下载，三端数据互通。完成新手引导即送十连祈愿券 ×2。", en: "Free to download, cross-save everywhere. Clear the tutorial for 2× ten-pull wish tickets." },
            lang
          )}
        </p>
      </Reveal>
      <Reveal delay={160}>
        <div className="mt-10 flex flex-col items-center justify-center gap-8 sm:flex-row sm:gap-12">
          <div className="flex flex-col items-center gap-4">
            <FakeQR />
            <span className="text-[11px] tracking-widest" style={{ color: "var(--sf-muted)" }}>{L({ zh: "扫码下载", en: "Scan to download" }, lang)}</span>
          </div>
          <div className="flex flex-col items-center gap-3.5">
            {[
              { name: "App Store", sub: { zh: "iOS / iPadOS", en: "iOS / iPadOS" } },
              { name: "Google Play", sub: { zh: "Android", en: "Android" } },
              { name: "Windows", sub: { zh: "PC 客户端", en: "PC client" } },
            ].map((p) => (
              <a
                key={p.name}
                href="#sf-download"
                className="sf-dl flex w-64 items-center justify-between border px-5 py-3"
                style={{ borderColor: "var(--sf-line)", background: "rgba(12,15,26,0.7)" }}
              >
                <span className="text-left">
                  <span className="block text-sm font-bold">{p.name}</span>
                  <span className="sf-dl-sub block text-[10px] tracking-wider" style={{ color: "var(--sf-muted)" }}>{L(p.sub, lang)}</span>
                </span>
                <span className="text-lg">↓</span>
              </a>
            ))}
          </div>
        </div>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3 text-[10px]" style={{ color: "var(--sf-muted)" }}>
          <span className="border px-2 py-1 tracking-widest" style={{ borderColor: "var(--sf-line)" }}>{L({ zh: "适龄提示 12+", en: "RATED 12+" }, lang)}</span>
          <span className="border px-2 py-1 tracking-widest" style={{ borderColor: "var(--sf-line)" }}>{L({ zh: "不含付费抽卡数值门槛", en: "NO PAYWALL STATS" }, lang)}</span>
          <span className="border px-2 py-1 tracking-widest" style={{ borderColor: "var(--sf-line)" }}>{L({ zh: "客服 7×24h", en: "24/7 SUPPORT" }, lang)}</span>
        </div>
      </Reveal>
    </section>
  );
}

/* ================= 页脚 ================= */
function Footer({ lang }: { lang: Lang }) {
  const cols: { head: Bi; links: Bi[] }[] = [
    { head: { zh: "游戏", en: "Game" }, links: [{ zh: "世界观", en: "World" }, { zh: "角色图鉴", en: "Characters" }, { zh: "世界观设定集", en: "Artbook" }, { zh: "版本情报", en: "Version news" }] },
    { head: { zh: "社区", en: "Community" }, links: [{ zh: "官方论坛", en: "Forum" }, { zh: "同人创作", en: "Fan works" }, { zh: "创作者激励", en: "Creator program" }] },
    { head: { zh: "帮助", en: "Support" }, links: [{ zh: "新手指南", en: "Beginner guide" }, { zh: "客服中心", en: "Customer care" }, { zh: "家长监护", en: "Parental controls" }] },
  ];
  return (
    <footer className="border-t px-6 py-12 sm:px-10" style={{ borderColor: "var(--sf-line)", background: "var(--sf-panel)" }}>
      <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
        <div>
          <div className="flex items-baseline gap-2.5">
            <span className="text-lg font-bold tracking-[0.3em]" style={{ color: "var(--sf-fg)" }}>{L({ zh: "星坠战纪", en: "星坠战纪" }, lang)}</span>
            <span className="text-[10px] tracking-[0.35em]" style={{ color: "var(--sf-gold)", ...MONO }}>STARFALL SAGA</span>
          </div>
          <p className="mt-4 max-w-sm text-[11px] leading-relaxed" style={{ color: "var(--sf-muted)" }}>
            {L(
              { zh: "演示内容为虚构游戏品牌，仅用于展示模板能力；立绘与场景为 AI 生成的原创占位素材。", en: "Fictional game brand for template demo purposes; character and scene art are original AI-generated placeholders." },
              lang
            )}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {cols.map((c) => (
            <div key={c.head.en}>
              <div className="text-[11px] font-bold tracking-[0.3em]" style={{ color: "var(--sf-gold)" }}>{L(c.head, lang)}</div>
              <ul className="mt-3.5 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.en}>
                    <a href="#sf-top" className="text-xs transition hover:text-[color:var(--sf-gold)]" style={{ color: "var(--sf-muted)" }}>{L(l, lang)}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t pt-6 text-[10px] tracking-wider sm:flex-row" style={{ borderColor: "var(--sf-line)", color: "var(--sf-muted)" }}>
        <span>© 2026 STARFALL SAGA · Template demo</span>
        <span>{L({ zh: "虚拟游戏 · 请勿与真实产品混淆", en: "Fictional game · not a real product" }, lang)}</span>
      </div>
    </footer>
  );
}

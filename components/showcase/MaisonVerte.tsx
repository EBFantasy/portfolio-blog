"use client";

import type { CSSProperties } from "react";
import BackToCase from "@/components/BackToCase";
import { Reveal } from "@/components/showcase/reveal";

type Lang = "zh" | "en";
type Bi = { zh: string; en: string };
const L = (b: Bi, lang: Lang) => b[lang === "en" ? "en" : "zh"];

const vars = {
  "--mv-bg": "#FAF6EF",
  "--mv-panel": "#FFFFFF",
  "--mv-line": "#E9E1D2",
  "--mv-fg": "#2E3B30",
  "--mv-muted": "#8A8273",
  "--mv-acc": "#7C9A6D",
  "--mv-acc2": "#C96F4A",
  "--mv-deep": "#26312A",
} as CSSProperties;

const SERIF = { fontFamily: "Georgia, 'Times New Roman', 'STSong', 'SimSun', serif" };

export default function MaisonVerte({ lang, backHref, backLabel }: { lang: Lang; backHref: string; backLabel: string }) {
  return (
    <div className="py-14">
      <BackToCase href={backHref} label={backLabel} />
      <style>{`
        @keyframes mv-kenburns { from { transform: scale(1); } to { transform: scale(1.08); } }
        @keyframes mv-fadeup { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        @keyframes mv-bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(6px); } }
      `}</style>
      <div
        className="mt-6 overflow-hidden rounded-3xl border border-zinc-200 shadow-xl dark:border-zinc-800"
        style={vars}
      >
        <SiteNav lang={lang} />
        <Hero lang={lang} />
        <Philosophy lang={lang} />
        <MenuSection lang={lang} />
        <Provenance lang={lang} />
        <ChefSection lang={lang} />
        <Gallery lang={lang} />
        <PressQuotes lang={lang} />
        <Reservation lang={lang} />
        <Footer lang={lang} />
      </div>
    </div>
  );
}

/* ---------------- 导航 ---------------- */
function SiteNav({ lang }: { lang: Lang }) {
  const items: [Bi, string][] = [
    [{ zh: "本期菜单", en: "Menu" }, "#mv-menu"],
    [{ zh: "食材来源", en: "Provenance" }, "#mv-provenance"],
    [{ zh: "主厨", en: "Chef" }, "#mv-chef"],
    [{ zh: "预订信息", en: "Reservation" }, "#mv-reserve"],
  ];
  return (
    <header
      className="flex items-center justify-between border-b px-6 py-4 sm:px-10"
      style={{ borderColor: "var(--mv-line)", background: "var(--mv-bg)" }}
    >
      <div className="flex items-center gap-2.5">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white"
          style={{ background: "var(--mv-acc)", ...SERIF }}
        >
          翠
        </span>
        <span className="text-sm font-semibold tracking-wide" style={{ color: "var(--mv-fg)", ...SERIF }}>
          {L({ zh: "翠庭 · 法式餐厅", en: "Maison Verte" }, lang)}
        </span>
      </div>
      <nav className="hidden items-center gap-7 text-xs lg:flex" style={{ color: "var(--mv-muted)" }}>
        {items.map(([label, href]) => (
          <a key={href} href={href} className="transition hover:opacity-60">
            {L(label, lang)}
          </a>
        ))}
      </nav>
      <a
        href="#mv-reserve"
        className="rounded-full px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90"
        style={{ background: "var(--mv-acc2)" }}
      >
        {L({ zh: "预订座位", en: "Reserve a table" }, lang)}
      </a>
    </header>
  );
}

/* ---------------- Hero：全幅实景图 + Ken Burns ---------------- */
function Hero({ lang }: { lang: Lang }) {
  return (
    <section className="relative h-[520px] overflow-hidden sm:h-[560px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/showcase/maison/hero.jpg"
        alt="Maison Verte dining room"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ animation: "mv-kenburns 20s ease-in-out infinite alternate" }}
      />
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,rgba(20,26,21,.42) 0%,rgba(20,26,21,.18) 40%,rgba(20,26,21,.66) 100%)" }} />
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 text-center sm:pb-20">
        <p className="text-[11px] font-medium tracking-[0.3em] text-white/85">
          EST. 2012 · {L({ zh: "法式料理", en: "FRENCH CUISINE" }, lang)}
        </p>
        <h1 className="mt-4 text-4xl font-semibold text-white drop-shadow-lg sm:text-5xl" style={SERIF}>
          {L({ zh: "翠庭", en: "Maison Verte" }, lang)}
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-white/90 sm:text-[15px]" style={SERIF}>
          {L({ zh: "把每个季节最好的样子，端上餐桌。", en: "The season's best, served at your table." }, lang)}
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <a
            href="#mv-reserve"
            className="rounded-full px-6 py-3 text-sm font-semibold shadow-lg transition hover:scale-[1.03] active:scale-[0.98]"
            style={{ background: "var(--mv-bg)", color: "var(--mv-deep)" }}
          >
            {L({ zh: "预订座位", en: "Reserve a table" }, lang)}
          </a>
          <a
            href="#mv-menu"
            className="rounded-full border border-white/60 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
          >
            {L({ zh: "本期菜单", en: "This season's menu" }, lang)}
          </a>
        </div>
      </div>
      <span
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-lg text-white/70"
        style={{ animation: "mv-bounce 2.2s ease-in-out infinite" }}
        aria-hidden
      >
        ⌄
      </span>
    </section>
  );
}

/* ---------------- 哲学 ---------------- */
function Philosophy({ lang }: { lang: Lang }) {
  return (
    <section className="px-6 py-16 text-center sm:px-10 sm:py-20" style={{ background: "var(--mv-bg)" }}>
      <Reveal>
        <div className="mx-auto max-w-2xl">
          <div className="text-sm" style={{ color: "var(--mv-acc)" }} aria-hidden>
            ❦
          </div>
          <p className="text-[11px] font-bold tracking-[0.24em]" style={{ color: "var(--mv-muted)" }}>
            {L({ zh: "我们的哲学 · OUR PHILOSOPHY", en: "OUR PHILOSOPHY" }, lang)}
          </p>
          <h2 className="mt-5 text-2xl font-semibold leading-snug sm:text-[1.8rem]" style={{ color: "var(--mv-fg)", ...SERIF }}>
            {L(
              { zh: "菜单不为迎合谁而写，只为此时此刻的食材而写。", en: "Our menu answers to the season, not to trends." },
              lang
            )}
          </h2>
          <p className="mt-5 text-[13px] leading-loose sm:text-sm" style={{ color: "var(--mv-muted)" }}>
            {L(
              {
                zh: "翠庭的菜单每天凌晨重写一次——取决于当天清晨从合作农场与渔港送来的东西。我们相信法式料理的本质不是繁复的酱汁，而是让好的食材被恰当地对待。",
                en: "The menu at Maison Verte is rewritten every dawn, around what arrives from our partner farms and the day-boat catch. French cooking, to us, is not elaborate sauce — it is treating fine ingredients with the respect they deserve.",
              },
              lang
            )}
          </p>
        </div>
      </Reveal>
    </section>
  );
}

/* ---------------- 本期菜单 ---------------- */
function MenuSection({ lang }: { lang: Lang }) {
  const courses: [Bi, Bi, Bi][] = [
    [{ zh: "开胃小食", en: "Amuse-Bouche" }, { zh: "烟熏红椒凝脂 · 荞麦脆片", en: "Smoked pepper custard, buckwheat crisp" }, { zh: "—", en: "—" }],
    [{ zh: "前菜", en: "Entrée" }, { zh: "香煎扇贝 · 柑橘黄油 · 时令香草", en: "Seared scallop, citrus beurre blanc, herbs" }, { zh: "—", en: "—" }],
    [{ zh: "汤品", en: "Potage" }, { zh: "栗子浓汤 · 黑松露", en: "Chestnut velouté, black truffle" }, { zh: "—", en: "—" }],
    [{ zh: "渔获", en: "Poisson" }, { zh: "香草黄油烤鲈鱼 · 茴香", en: "Roasted sea bass, fennel, herb butter" }, { zh: "—", en: "—" }],
    [{ zh: "主菜", en: "Viande" }, { zh: "慢烤牛肋 · 红酒汁 · 根茎蔬菜", en: "Slow-roasted beef rib, red wine jus, roots" }, { zh: "—", en: "—" }],
    [{ zh: "芝士", en: "Fromage" }, { zh: "手工芝士拼盘 · 山地蜂蜜", en: "Farmstead cheeses, mountain honey" }, { zh: "—", en: "—" }],
    [{ zh: "甜品", en: "Dessert" }, { zh: "焦糖布蕾 · 时令水果塔", en: "Crème brûlée, seasonal fruit tart" }, { zh: "—", en: "—" }],
  ];
  return (
    <section id="mv-menu" className="border-y px-6 py-16 sm:px-10" style={{ borderColor: "var(--mv-line)", background: "var(--mv-panel)" }}>
      <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <div className="relative">
            <div className="overflow-hidden rounded-2xl shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/showcase/maison/dish.jpg"
                alt={L({ zh: "招牌菜：香煎扇贝", en: "Signature: seared scallop" }, lang)}
                className="aspect-[4/5] w-full object-cover transition-transform duration-700 hover:scale-[1.04]"
                loading="lazy"
              />
            </div>
            <div
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-5 py-2 text-xs font-semibold text-white shadow-md"
              style={{ background: "var(--mv-acc2)" }}
            >
              {L({ zh: "本期招牌 · 香煎扇贝", en: "Signature · Seared Scallop" }, lang)}
            </div>
          </div>
        </Reveal>
        <div>
          <Reveal>
            <p className="text-[11px] font-bold tracking-[0.24em]" style={{ color: "var(--mv-acc)" }}>
              {L({ zh: "秋冬季菜单 · AUTUMN–WINTER", en: "AUTUMN–WINTER TASTING" }, lang)}
            </p>
            <h2 className="mt-3 text-2xl font-semibold sm:text-3xl" style={{ color: "var(--mv-fg)", ...SERIF }}>
              {L({ zh: "七道式品鉴菜单", en: "Seven-Course Tasting Menu" }, lang)}
            </h2>
            <p className="mt-2 text-xs" style={{ color: "var(--mv-muted)" }}>
              {L({ zh: "¥688 / 位 · 佐餐酒单 +¥388 · 全桌统一", en: "¥688 per guest · wine pairing +¥388 · for the whole table" }, lang)}
            </p>
          </Reveal>
          <div className="mt-8">
            {courses.map(([name, desc], i) => (
              <Reveal key={name.en} delay={i * 70}>
                <div className="group flex items-baseline gap-3 border-b py-4 transition-colors last:border-b-0 hover:bg-[color-mix(in_srgb,var(--mv-acc)_6%,transparent)]" style={{ borderColor: "var(--mv-line)" }}>
                  <span className="w-20 shrink-0 text-xs font-semibold tracking-wide sm:w-24" style={{ color: "var(--mv-acc)", ...SERIF }}>
                    {L(name, lang)}
                  </span>
                  <span className="hidden flex-1 border-b border-dotted sm:block" style={{ borderColor: "var(--mv-line)" }} aria-hidden />
                  <span className="flex-1 text-right text-[13px] sm:flex-none sm:text-left" style={{ color: "var(--mv-fg)" }}>
                    {L(desc, lang)}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={200}>
            <p className="mt-6 text-xs leading-relaxed" style={{ color: "var(--mv-muted)" }}>
              {L(
                { zh: "菜单随当日到货调整；素食版本与忌口请提前 48 小时告知。", en: "The menu shifts with each morning's arrival. Vegetarian and allergies: 48h notice, please." },
                lang
              )}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------------- 食材来源 ---------------- */
function Provenance({ lang }: { lang: Lang }) {
  const farms = [
    { name: { zh: "金丘农场 · 崇明", en: "Golden Hill Farm, Chongming" }, what: { zh: "蔬菜与香草，凌晨现摘", en: "Vegetables & herbs, picked at dawn" } },
    { name: { zh: "河湾牧场 · 湖州", en: "Riverbend Dairy, Huzhou" }, what: { zh: "乳品与黄油，每日鲜运", en: "Dairy & butter, delivered daily" } },
    { name: { zh: "山雾香草园 · 莫干山", en: "Mist Herb Garden, Moganshan" }, what: { zh: "香草与可食花", en: "Herbs & edible flowers" } },
    { name: { zh: "舟山渔港直送", en: "Zhoushan Fleet, day-boat" }, what: { zh: "每日渔获，当晚入馔", en: "Day-boat catch, on the plate by night" } },
  ];
  return (
    <section id="mv-provenance" className="px-6 py-16 sm:px-10" style={{ background: "var(--mv-bg)" }}>
      <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <Reveal>
            <p className="text-[11px] font-bold tracking-[0.24em]" style={{ color: "var(--mv-acc)" }}>
              {L({ zh: "从农场到餐桌 · FARM TO TABLE", en: "FARM TO TABLE" }, lang)}
            </p>
            <h2 className="mt-3 text-2xl font-semibold sm:text-3xl" style={{ color: "var(--mv-fg)", ...SERIF }}>
              {L({ zh: "我们的食材地图", en: "Our Provenance Map" }, lang)}
            </h2>
            <p className="mt-4 text-[13px] leading-loose sm:text-sm" style={{ color: "var(--mv-muted)" }}>
              {L(
                {
                  zh: "每一道主料的来源，都写在菜单的页脚上。三个合作农场与一个渔港，构成了翠庭的一年四季——我们不做没有名字的采购。",
                  en: "Every hero ingredient is credited at the foot of the menu. Three farms and one fleet make up our four seasons — we buy nothing anonymous.",
                },
                lang
              )}
            </p>
          </Reveal>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {farms.map((f, i) => (
              <Reveal key={f.name.en} delay={i * 100}>
                <div
                  className="h-full rounded-2xl border p-4 transition hover:-translate-y-0.5 hover:shadow-md"
                  style={{ borderColor: "var(--mv-line)", background: "var(--mv-panel)" }}
                >
                  <div className="flex items-center gap-2 text-[13px] font-semibold" style={{ color: "var(--mv-fg)" }}>
                    <span style={{ color: "var(--mv-acc2)" }} aria-hidden>
                      ⚲
                    </span>
                    {L(f.name, lang)}
                  </div>
                  <div className="mt-1.5 pl-5 text-xs" style={{ color: "var(--mv-muted)" }}>
                    {L(f.what, lang)}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <Reveal delay={150}>
          <div className="overflow-hidden rounded-2xl shadow-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/showcase/maison/farm.jpg"
              alt={L({ zh: "合作农场的清晨", en: "Morning at our partner farm" }, lang)}
              className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-[1.04]"
              loading="lazy"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- 主厨 ---------------- */
function ChefSection({ lang }: { lang: Lang }) {
  return (
    <section id="mv-chef" className="border-y px-6 py-16 sm:px-10" style={{ borderColor: "var(--mv-line)", background: "var(--mv-deep)" }}>
      <div className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <Reveal>
          <div className="relative mx-auto max-w-sm">
            <div className="overflow-hidden rounded-2xl shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/showcase/maison/chef.jpg"
                alt={L({ zh: "行政主厨 沈亦禾", en: "Chef Yihe Shen" }, lang)}
                className="aspect-[4/5] w-full object-cover transition-transform duration-700 hover:scale-[1.04]"
                loading="lazy"
              />
            </div>
            <span
              className="absolute -right-3 top-6 rounded-full px-4 py-1.5 text-[11px] font-semibold text-white shadow-md"
              style={{ background: "var(--mv-acc2)" }}
            >
              {L({ zh: "行政主厨", en: "Executive Chef" }, lang)}
            </span>
          </div>
        </Reveal>
        <div>
          <Reveal>
            <p className="text-[11px] font-bold tracking-[0.24em]" style={{ color: "var(--mv-acc)" }}>
              {L({ zh: "厨房的灵魂 · THE KITCHEN", en: "THE KITCHEN" }, lang)}
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl" style={SERIF}>
              {L({ zh: "沈亦禾", en: "Yihe Shen" }, lang)}
            </h2>
            <p className="mt-1 text-xs text-white/60">
              {L({ zh: "翠庭行政主厨 · 主理七道式菜单", en: "Executive Chef, creator of the tasting menu" }, lang)}
            </p>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-6 max-w-xl text-[13px] leading-loose text-white/75 sm:text-sm">
              {L(
                {
                  zh: "沈亦禾在里昂 Lumière（米其林二星）的厨房里站了四年副主厨，2021 年回到这座城市加入翠庭。她的原则只有一条：让菜单跟着农场走，而不是让农场跟着菜单走。",
                  en: "Yihe Shen spent four years as sous-chef at Lumière (two Michelin stars) in Lyon before joining Maison Verte in 2021. She runs one rule: the farm leads the menu — never the other way round.",
                },
                lang
              )}
            </p>
          </Reveal>
          <Reveal delay={240}>
            <p className="mt-6 text-sm italic text-white/85" style={SERIF}>
              —— {L({ zh: "沈亦禾 & 翠庭厨房全体", en: "Yihe Shen & the Maison Verte kitchen" }, lang)}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------------- 空间画廊 ---------------- */
function Gallery({ lang }: { lang: Lang }) {
  const shots = [
    { img: "/showcase/maison/room.jpg", cap: { zh: "主厅 · 32 座", en: "Main room · 32 seats" } },
    { img: "/showcase/maison/hero.jpg", cap: { zh: "夜幕 · 烛光时分", en: "Evenings by candlelight" } },
    { img: "/showcase/maison/dish.jpg", cap: { zh: "出品 · 每日焕新", en: "The plate, refreshed daily" } },
  ];
  return (
    <section className="px-6 py-16 sm:px-10" style={{ background: "var(--mv-bg)" }}>
      <Reveal>
        <p className="text-center text-[11px] font-bold tracking-[0.24em]" style={{ color: "var(--mv-acc)" }}>
          {L({ zh: "空间与氛围 · THE ROOM", en: "THE ROOM" }, lang)}
        </p>
        <h2 className="mt-3 text-center text-2xl font-semibold sm:text-3xl" style={{ color: "var(--mv-fg)", ...SERIF }}>
          {L({ zh: "梧桐树下的小洋房", en: "A little house under the plane trees" }, lang)}
        </h2>
      </Reveal>
      <div className="mt-9 grid gap-4 sm:grid-cols-3">
        {shots.map((s, i) => (
          <Reveal key={s.cap.en} delay={i * 130}>
            <figure className="group overflow-hidden rounded-2xl shadow-sm">
              <div className="relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.img}
                  alt={L(s.cap, lang)}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                  loading="lazy"
                />
              </div>
              <figcaption className="py-3 text-center text-xs" style={{ color: "var(--mv-muted)", ...SERIF }}>
                {L(s.cap, lang)}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- 媒体评价 ---------------- */
function PressQuotes({ lang }: { lang: Lang }) {
  const quotes = [
    { text: { zh: "年度新锐法餐厅", en: "Best New French Table of the Year" }, who: { zh: "《美食与美酒》· 2024", en: "F&B Magazine · 2024" } },
    { text: { zh: "这座城市最安静自信的一张法式餐桌。", en: "The most quietly confident French table in the city." }, who: { zh: "CityTable 评论", en: "CityTable Review" } },
    { text: { zh: "食客评分 4.9 / 5 · 2,300+ 条评价", en: "Guest rating 4.9 / 5 · 2,300+ reviews" }, who: { zh: "订餐平台综合", en: "Booking platforms, aggregated" } },
  ];
  return (
    <section className="border-t px-6 py-14 sm:px-10" style={{ borderColor: "var(--mv-line)", background: "var(--mv-panel)" }}>
      <div className="grid gap-8 text-center sm:grid-cols-3">
        {quotes.map((q, i) => (
          <Reveal key={q.who.en} delay={i * 130}>
            <div>
              <p className="text-sm leading-relaxed sm:text-[15px]" style={{ color: "var(--mv-fg)", ...SERIF }}>
                “{L(q.text, lang)}”
              </p>
              <p className="mt-3 text-[11px] tracking-wide" style={{ color: "var(--mv-muted)" }}>
                —— {L(q.who, lang)}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- 预订信息 ---------------- */
function Reservation({ lang }: { lang: Lang }) {
  const info: [Bi, Bi][] = [
    [
      { zh: "营业时间", en: "Hours" },
      { zh: "周二至周日 17:30 – 22:30 · 周一店休", en: "Tue–Sun 17:30 – 22:30 · closed Mondays" },
    ],
    [
      { zh: "地址", en: "Address" },
      { zh: "悬铃木路 27 号 · 近地铁 10 号线", en: "27 Plane Tree Ave. · Metro Line 10" },
    ],
    [
      { zh: "预订", en: "Reservations" },
      { zh: "+86 21 6420 1127 · 支持在线订位", en: "+86 21 6420 1127 · online booking open" },
    ],
    [
      { zh: "温馨提示", en: "Good to know" },
      { zh: "品鉴菜单全桌统一 · 素食请提前 48 小时", en: "Tasting for the whole table · vegetarian 48h notice" },
    ],
  ];
  return (
    <section id="mv-reserve" className="px-6 py-16 sm:px-10" style={{ background: "var(--mv-deep)" }}>
      <Reveal>
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-white sm:text-3xl" style={SERIF}>
            {L({ zh: "本周仅余 6 席", en: "Only 6 tables left this week" }, lang)}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/70">
            {L(
              { zh: "周末建议提前三天预订；包间可容纳 8–20 人私宴。", en: "Weekends fill fast; private rooms seat 8–20." },
              lang
            )}
          </p>
        </div>
      </Reveal>
      <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2">
        {info.map(([k, v], i) => (
          <Reveal key={k.en} delay={i * 100}>
            <div className="rounded-2xl border border-white/12 bg-white/5 p-5 backdrop-blur transition hover:bg-white/10">
              <div className="text-[11px] font-bold tracking-[0.2em]" style={{ color: "var(--mv-acc)" }}>
                {L(k, lang)}
              </div>
              <div className="mt-2 text-[13px] leading-relaxed text-white/85">{L(v, lang)}</div>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={200}>
        <div className="mt-10 text-center">
          <button
            type="button"
            className="rounded-full px-9 py-3.5 text-sm font-semibold shadow-lg transition hover:scale-[1.03] active:scale-[0.98]"
            style={{ background: "var(--mv-acc2)", color: "#fff" }}
          >
            {L({ zh: "立即预订座位", en: "Reserve a table" }, lang)}
          </button>
        </div>
      </Reveal>
    </section>
  );
}

/* ---------------- 页脚 ---------------- */
function Footer({ lang }: { lang: Lang }) {
  return (
    <footer
      className="flex flex-col items-center justify-between gap-2 border-t px-6 py-6 text-xs sm:flex-row sm:px-10"
      style={{ borderColor: "var(--mv-line)", background: "var(--mv-bg)", color: "var(--mv-muted)" }}
    >
      <span style={SERIF}>© 2026 Maison Verte · Template demo</span>
      <span>{L({ zh: "演示内容为虚构品牌，仅用于展示模板能力。", en: "Fictional brand for template demo purposes." }, lang)}</span>
    </footer>
  );
}

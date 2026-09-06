"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import BackToCase from "@/components/BackToCase";
import { Reveal } from "@/components/showcase/reveal";

type Lang = "zh" | "en";
type Bi = { zh: string; en: string };
const L = (b: Bi, lang: Lang) => b[lang === "en" ? "en" : "zh"];

const vars = {
  "--na-bg": "#1B2838",
  "--na-deep": "#171A21",
  "--na-panel": "#16202D",
  "--na-line": "#2A475E",
  "--na-fg": "#C7D5E0",
  "--na-bright": "#FFFFFF",
  "--na-muted": "#8F98A0",
  "--na-blue": "#66C0F4",
  "--na-pink": "#FF2E88",
  "--na-green": "#BEEE11",
  "--na-offbg": "#4C6B22",
} as CSSProperties;

const MONO = { fontFamily: "ui-monospace, 'Cascadia Code', 'JetBrains Mono', Consolas, monospace" };

type Game = {
  id: string;
  img: string;
  title: Bi;
  tags: string[];
  price: number;
  discount: number;
  review?: Bi;
  studio: Bi;
  soon?: boolean;
};

const GAMES: Game[] = [
  { id: "starfall", img: "/showcase/starfall/kv.jpg", title: { zh: "星坠战纪", en: "Starfall Saga" }, tags: ["动作", "RPG"], price: 268, discount: 0, review: { zh: "特别好评", en: "Very Positive" }, studio: { zh: "坠落工作室", en: "Falling Studio" } },
  { id: "neon-blade", img: "/showcase/neon/cyber.jpg", title: { zh: "霓虹之刃", en: "Neon Blade" }, tags: ["动作", "赛博朋克"], price: 148, discount: 50, review: { zh: "特别好评", en: "Very Positive" }, studio: { zh: "雨夜互动", en: "Rainy Night Interactive" } },
  { id: "steel-tide", img: "/showcase/neon/mecha.jpg", title: { zh: "钢潮战术", en: "Steel Tide Tactics" }, tags: ["策略", "机甲"], price: 168, discount: 15, review: { zh: "好评如潮", en: "Overwhelmingly Positive" }, studio: { zh: "六边形工坊", en: "Hexagon Works" } },
  { id: "canyon", img: "/showcase/starfall/media-battle.jpg", title: { zh: "断星峡谷", en: "Shattered-Star Canyon" }, tags: ["动作"], price: 98, discount: 30, review: { zh: "多半好评", en: "Mostly Positive" }, studio: { zh: "坠落工作室", en: "Falling Studio" } },
  { id: "tavern", img: "/showcase/neon/tavern.jpg", title: { zh: "猫酒馆物语", en: "Tavern Tails" }, tags: ["模拟", "像素"], price: 58, discount: 10, review: { zh: "好评如潮", en: "Overwhelmingly Positive" }, studio: { zh: "炉火小组", en: "Hearthfire Collective" } },
  { id: "festival", img: "/showcase/starfall/media-city.jpg", title: { zh: "星历祭物语", en: "Starfeast Story" }, tags: ["模拟", "剧情"], price: 68, discount: 0, review: { zh: "特别好评", en: "Very Positive" }, studio: { zh: "纸灯游戏", en: "Paper Lantern Games" } },
  { id: "isles", img: "/showcase/starfall/world.jpg", title: { zh: "浮岛群章", en: "Chronicles of the Floating Isles" }, tags: ["冒险", "RPG"], price: 128, discount: 20, review: { zh: "多半好评", en: "Mostly Positive" }, studio: { zh: "纸灯游戏", en: "Paper Lantern Games" } },
  { id: "deepring", img: "/showcase/neon/pixel-rogue.jpg", title: { zh: "深窟回响", en: "Dungeon Echo" }, tags: ["像素", "肉鸽"], price: 48, discount: 17, review: { zh: "抢先体验", en: "Early Access" }, studio: { zh: "火把小组", en: "Torchlight Squad" }, soon: true },
  { id: "dlc-rin", img: "/showcase/starfall/char-rin.jpg", title: { zh: "星坠战纪 · 角色包「凛」", en: "Starfall Saga — Rin Character Pack" }, tags: ["DLC", "RPG"], price: 18, discount: 0, studio: { zh: "坠落工作室", en: "Falling Studio" } },
  { id: "dlc-cael", img: "/showcase/starfall/char-cael.jpg", title: { zh: "星坠战纪 · 角色包「凱尔」", en: "Starfall Saga — Cael Character Pack" }, tags: ["DLC", "RPG"], price: 18, discount: 0, studio: { zh: "坠落工作室", en: "Falling Studio" } },
  { id: "dlc-luna", img: "/showcase/starfall/char-lunave.jpg", title: { zh: "星坠战纪 · 角色包「露娜薇」", en: "Starfall Saga — Lunave Character Pack" }, tags: ["DLC", "RPG"], price: 18, discount: 0, studio: { zh: "坠落工作室", en: "Falling Studio" } },
];

const FEATURED = [GAMES[0], GAMES[1], GAMES[2]];
const TAGS = ["全部", "动作", "RPG", "策略", "机甲", "模拟", "像素", "肉鸽", "冒险", "剧情", "赛博朋克", "DLC"];

const finalPrice = (g: Game) => Math.round((g.price * (100 - g.discount)) / 100);

export default function NeonArcade({ lang, backHref, backLabel }: { lang: Lang; backHref: string; backLabel: string }) {
  const store = useStore();
  return (
    <div className="py-14">
      <BackToCase href={backHref} label={backLabel} />
      <style>{`
        @keyframes na-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes na-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        @keyframes na-pop { 0% { transform: scale(1); } 45% { transform: scale(1.5); } 100% { transform: scale(1); } }
        @keyframes na-toast { 0% { opacity: 0; transform: translateY(14px); } 12% { opacity: 1; transform: none; } 85% { opacity: 1; } 100% { opacity: 0; } }
        .na-card { transition: transform .25s ease, box-shadow .25s ease, outline-color .25s ease; outline: 1px solid transparent; }
        .na-card:hover { transform: translateY(-3px); outline-color: rgba(102,192,244,.65); box-shadow: 0 10px 26px rgba(0,0,0,.5), 0 0 18px rgba(102,192,244,.18); }
        .na-link { color: var(--na-blue); transition: color .15s ease; }
        .na-link:hover { color: var(--na-bright); }
        .na-off { background: var(--na-offbg); color: var(--na-green); font-weight: 700; padding: 2px 7px; font-size: 15px; }
        .na-input { background: rgba(0,0,0,.35); border: 1px solid var(--na-line); color: var(--na-fg); transition: border-color .2s ease; }
        .na-input:focus { outline: none; border-color: var(--na-blue); }
        .na-input::placeholder { color: var(--na-muted); }
        .na-tabbtn { transition: background .2s ease, color .2s ease; }
        .na-chip { transition: all .18s ease; }
      `}</style>
      <div
        className="mt-6 overflow-hidden rounded-3xl border border-zinc-200 shadow-xl dark:border-zinc-800"
        style={{ ...vars, background: "var(--na-bg)" }}
      >
        <StoreHeader lang={lang} store={store} />
        <StoreNav lang={lang} store={store} />
        <Featured lang={lang} store={store} />
        <DailyDeal lang={lang} store={store} />
        <CategoryRow lang={lang} store={store} />
        <TabbedRows lang={lang} store={store} />
        <Catalog lang={lang} store={store} />
        <Footer lang={lang} />
        {store.toast && (
          <div
            key={store.toast}
            className="fixed bottom-6 right-6 z-50 rounded px-4 py-3 text-xs font-semibold shadow-2xl"
            style={{ background: "#2A475E", color: "var(--na-bright)", border: "1px solid var(--na-blue)", animation: "na-toast 2.2s ease both" }}
          >
            ✓ {L({ zh: "已加入购物车", en: "Added to cart" }, lang)}：{store.toast}
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= 商店状态（跨区块共享） ================= */
function useStore() {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("全部");
  const [cart, setCart] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const addToCart = (title: Bi, lang: Lang) => {
    setCart((c) => c + 1);
    setToast(L(title, lang));
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 2200);
  };
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  return { query, setQuery, tag, setTag, cart, addToCart, toast };
}

/* ================= 顶栏 ================= */
function StoreHeader({ lang, store }: { lang: Lang; store: ReturnType<typeof useStore> }) {
  return (
    <header style={{ background: "var(--na-deep)" }}>
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3">
        <a href="#na-top" className="flex items-baseline gap-2">
          <span className="text-base font-black tracking-widest" style={{ color: "var(--na-pink)" }}>NEON</span>
          <span className="text-base font-black tracking-widest" style={{ color: "var(--na-blue)" }}>ARCADE</span>
          <span className="hidden text-[11px] tracking-[0.3em] sm:inline" style={{ color: "var(--na-muted)" }}>
            {L({ zh: "霓虹街机", en: "霓虹街机" }, lang)}
          </span>
        </a>
        <div className="flex flex-1 items-center justify-end gap-3">
          <input
            value={store.query}
            onChange={(e) => store.setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") document.getElementById("na-catalog")?.scrollIntoView({ behavior: "smooth", block: "start" }); }}
            placeholder={L({ zh: "搜索游戏…", en: "Search games…" }, lang)}
            className="na-input w-40 rounded px-3 py-1.5 text-xs sm:w-56"
          />
          <span className="relative flex h-8 w-8 items-center justify-center rounded" style={{ background: "rgba(255,255,255,0.06)" }}>
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="var(--na-fg)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M4 5h2l2.2 10.5a1.5 1.5 0 0 0 1.5 1.2h7.6a1.5 1.5 0 0 0 1.5-1.2L20.5 8H7" />
              <circle cx="10.5" cy="20" r="1.2" /><circle cx="17.5" cy="20" r="1.2" />
            </svg>
            {store.cart > 0 && (
              <span
                key={store.cart}
                className="absolute -right-1.5 -top-1.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full px-1 text-[9px] font-bold text-black"
                style={{ background: "var(--na-pink)", animation: "na-pop .4s ease", height: 18, minWidth: 18 }}
              >
                {store.cart}
              </span>
            )}
          </span>
        </div>
      </div>
    </header>
  );
}

/* ================= 商店导航条 ================= */
function StoreNav({ lang, store }: { lang: Lang; store: ReturnType<typeof useStore> }) {
  const items: [Bi, string][] = [
    [{ zh: "您的商店", en: "Your Store" }, "#na-featured"],
    [{ zh: "新鲜推荐", en: "New & Noteworthy" }, "#na-deals"],
    [{ zh: "类别", en: "Categories" }, "#na-cats"],
    [{ zh: "热榜", en: "Charts" }, "#na-rows"],
    [{ zh: "全部游戏", en: "Browse" }, "#na-catalog"],
  ];
  return (
    <nav className="border-y" style={{ borderColor: "rgba(0,0,0,0.35)", background: "linear-gradient(180deg, rgba(42,71,94,0.35), rgba(27,40,56,0))" }}>
      <div className="mx-auto flex max-w-5xl items-center gap-6 overflow-x-auto px-5 py-2.5 text-xs">
        {items.map(([label, href]) => (
          <a key={href} href={href} className="na-link whitespace-nowrap font-medium">{L(label, lang)}</a>
        ))}
        <span className="ml-auto hidden shrink-0 text-[10px] sm:inline" style={{ color: "var(--na-muted)", ...MONO }}>
          {L({ zh: `购物车（${store.cart}）`, en: `CART (${store.cart})` }, lang)}
        </span>
      </div>
    </nav>
  );
}

/* ================= 特色推荐轮播 ================= */
function Featured({ lang, store }: { lang: Lang; store: ReturnType<typeof useStore> }) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % FEATURED.length), 5500);
    return () => clearInterval(id);
  }, [paused]);
  const g = FEATURED[idx];
  return (
    <section id="na-featured" className="mx-auto max-w-5xl px-5 pt-6">
      <div
        className="grid overflow-hidden rounded md:grid-cols-[1.6fr_1fr]"
        style={{ background: "linear-gradient(180deg,#2A475E 0%,#1B2838 100%)" }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* 大图 */}
        <div className="relative aspect-[16/9] md:aspect-auto md:min-h-[340px]">
          {FEATURED.map((x, i) => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={x.id}
              src={x.img}
              alt={x.title.en}
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
              style={{ opacity: i === idx ? 1 : 0 }}
            />
          ))}
          {/* 箭头 */}
          <button
            type="button"
            aria-label="prev"
            onClick={() => setIdx((i) => (i - 1 + FEATURED.length) % FEATURED.length)}
            className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-lg font-bold text-white transition hover:bg-black/50"
            style={{ background: "rgba(0,0,0,0.3)" }}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="next"
            onClick={() => setIdx((i) => (i + 1) % FEATURED.length)}
            className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-lg font-bold text-white transition hover:bg-black/50"
            style={{ background: "rgba(0,0,0,0.3)" }}
          >
            ›
          </button>
          {/* 指示点 */}
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
            {FEATURED.map((x, i) => (
              <button
                key={x.id}
                type="button"
                aria-label={`slide ${i + 1}`}
                onClick={() => setIdx(i)}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{ width: i === idx ? 22 : 8, background: i === idx ? "var(--na-blue)" : "rgba(255,255,255,0.4)" }}
              />
            ))}
          </div>
        </div>
        {/* 信息面板 */}
        <div key={g.id} className="flex flex-col gap-3 p-5" style={{ animation: "na-in .45s ease both" }}>
          <div className="text-lg font-bold leading-snug" style={{ color: "var(--na-bright)" }}>{L(g.title, lang)}</div>
          {g.review && (
            <span className="w-fit rounded px-2 py-0.5 text-[10px] font-bold" style={{ background: "rgba(102,192,244,0.14)", color: "var(--na-blue)" }}>
              {L(g.review, lang)}
            </span>
          )}
          <p className="text-xs leading-relaxed" style={{ color: "var(--na-muted)" }}>
            {L(
              {
                zh: "本周焦点：Steam 式商店排版演示位。轮播会自动播放，鼠标悬停即可暂停，左右箭头与指示点都可点击。",
                en: "Featured this week: a Steam-style store showcase slot. The carousel auto-plays; hover to pause — arrows and dots are clickable.",
              },
              lang
            )}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {g.tags.map((t) => (
              <button key={t} type="button" onClick={() => { store.setTag(t); }} className="na-chip rounded px-2 py-0.5 text-[10px]" style={{ background: "rgba(103,193,245,0.15)", color: "var(--na-blue)" }}>
                {t}
              </button>
            ))}
          </div>
          <div className="mt-auto flex items-center justify-between">
            <PriceTag g={g} />
            <button
              type="button"
              onClick={() => store.addToCart(g.title, lang)}
              className="rounded px-4 py-2 text-xs font-bold text-white transition hover:brightness-125 active:scale-95"
              style={{ background: "linear-gradient(180deg,#67C1F5,#417A9B)" }}
            >
              {L({ zh: "加入购物车", en: "Add to Cart" }, lang)}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= 每日特惠（倒计时） ================= */
function useMidnightCountdown() {
  const [left, setLeft] = useState("--:--:--");
  useEffect(() => {
    const calc = () => {
      const now = new Date();
      const end = new Date(now);
      end.setHours(23, 59, 59, 999);
      const d = Math.max(0, end.getTime() - now.getTime());
      const h = Math.floor(d / 3.6e6);
      const m = Math.floor((d % 3.6e6) / 6e4);
      const sec = Math.floor((d % 6e4) / 1e3);
      setLeft(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`);
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, []);
  return left;
}

function DailyDeal({ lang, store }: { lang: Lang; store: ReturnType<typeof useStore> }) {
  const left = useMidnightCountdown();
  const g = GAMES[1]; // 霓虹之刃
  return (
    <section id="na-deals" className="mx-auto max-w-5xl px-5 pt-10">
      <Reveal dir="left">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: "var(--na-fg)" }}>
            {L({ zh: "特别优惠", en: "Special Offers" }, lang)}
          </h2>
          <span className="text-[11px]" style={{ color: "var(--na-muted)" }}>
            {L({ zh: "每日特惠倒计时", en: "Daily deal ends in" }, lang)}{" "}
            <b style={{ color: "var(--na-green)", ...MONO }}>{left}</b>
          </span>
        </div>
      </Reveal>
      <Reveal dir="right" delay={120}>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[GAMES[1], GAMES[2], GAMES[3], GAMES[4]].map((g) => (
            <div key={g.id} className="na-card overflow-hidden rounded" style={{ background: "linear-gradient(180deg,#2A475E 0%,#1B2838 100%)" }}>
              <div className="relative aspect-[460/215] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.img} alt={g.title.en} className="h-full w-full object-cover" />
                {g.id === "neon-blade" && (
                  <span className="absolute left-2 top-2 rounded px-2 py-0.5 text-[10px] font-bold text-black" style={{ background: "var(--na-pink)" }}>
                    {L({ zh: "每日特惠", en: "DAILY DEAL" }, lang)}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-2 p-3">
                <div className="min-w-0">
                  <div className="truncate text-xs font-semibold" style={{ color: "var(--na-fg)" }}>{L(g.title, lang)}</div>
                  <div className="mt-1 flex items-center gap-1.5">
                    {g.discount > 0 && <span className="na-off">-{g.discount}%</span>}
                    <PriceTag g={g} compact />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => store.addToCart(g.title, lang)}
                  className="shrink-0 rounded px-2.5 py-1.5 text-[10px] font-bold text-white transition hover:brightness-125 active:scale-95"
                  style={{ background: "linear-gradient(180deg,#67C1F5,#417A9B)" }}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

/* ================= 类别行 ================= */
function CategoryRow({ lang, store }: { lang: Lang; store: ReturnType<typeof useStore> }) {
  return (
    <section id="na-cats" className="mx-auto max-w-5xl px-5 pt-10">
      <Reveal dir="left">
        <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: "var(--na-fg)" }}>
          {L({ zh: "按类别浏览", en: "Browse by Category" }, lang)}
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {TAGS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                store.setTag(t);
                document.getElementById("na-catalog")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="na-chip rounded-full border px-4 py-1.5 text-xs font-medium"
              style={
                store.tag === t
                  ? { borderColor: "var(--na-blue)", color: "var(--na-blue)", background: "rgba(102,192,244,0.12)" }
                  : { borderColor: "var(--na-line)", color: "var(--na-muted)", background: "rgba(0,0,0,0.2)" }
              }
            >
              {t}
            </button>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

/* ================= 标签页行（热销 / 新品 / 即将推出） ================= */
const ROWS: { id: string; label: Bi; ids: string[] }[] = [
  { id: "hot", label: { zh: "热销商品", en: "Top Sellers" }, ids: ["starfall", "neon-blade", "steel-tide", "canyon"] },
  { id: "new", label: { zh: "新品上架", en: "New & Trending" }, ids: ["tavern", "festival", "isles", "dlc-luna"] },
  { id: "soon", label: { zh: "即将推出", en: "Coming Soon" }, ids: ["deepring", "dlc-rin", "dlc-cael"] },
];

function TabbedRows({ lang, store }: { lang: Lang; store: ReturnType<typeof useStore> }) {
  const [tab, setTab] = useState(0);
  const row = ROWS[tab];
  const games = row.ids.map((id) => GAMES.find((g) => g.id === id)).filter(Boolean) as Game[];
  return (
    <section id="na-rows" className="mx-auto max-w-5xl px-5 pt-10">
      <div className="flex items-end justify-between gap-4">
        <div className="flex gap-1">
          {ROWS.map((r, i) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setTab(i)}
              className="na-tabbtn rounded-t px-4 py-2 text-xs font-semibold"
              style={i === tab ? { background: "rgba(102,192,244,0.14)", color: "var(--na-blue)" } : { color: "var(--na-muted)" }}
            >
              {L(r.label, lang)}
            </button>
          ))}
        </div>
        <span className="hidden text-[11px] sm:inline" style={{ color: "var(--na-muted)", ...MONO }}>
          {L({ zh: "按标签页切换视图", en: "SWITCH TABS" }, lang)}
        </span>
      </div>
      <div key={row.id} className="grid gap-4 border-t p-4 sm:grid-cols-2 lg:grid-cols-4" style={{ borderColor: "var(--na-line)", background: "rgba(0,0,0,0.15)", animation: "na-in .4s ease both" }}>
        {games.map((g) => (
          <div key={g.id} className="na-card overflow-hidden rounded" style={{ background: "var(--na-panel)" }}>
            <div className="relative aspect-[460/215] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={g.img} alt={g.title.en} className="h-full w-full object-cover" />
              {g.soon && (
                <span className="absolute left-2 top-2 rounded px-2 py-0.5 text-[10px] font-bold" style={{ background: "var(--na-pink)", color: "#fff" }}>
                  {L({ zh: "预售", en: "PRE-ORDER" }, lang)}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between gap-2 p-3">
              <div className="min-w-0">
                <div className="truncate text-xs font-semibold" style={{ color: "var(--na-fg)" }}>{L(g.title, lang)}</div>
                <div className="mt-1 flex items-center gap-1.5">
                  {g.discount > 0 && <span className="na-off">-{g.discount}%</span>}
                  <PriceTag g={g} compact />
                </div>
              </div>
              <button
                type="button"
                onClick={() => store.addToCart(g.title, lang)}
                className="shrink-0 rounded px-2.5 py-1.5 text-[10px] font-bold text-white transition hover:brightness-125 active:scale-95"
                style={{ background: "linear-gradient(180deg,#67C1F5,#417A9B)" }}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ================= 全部游戏（搜索 + 标签筛选） ================= */
function Catalog({ lang, store }: { lang: Lang; store: ReturnType<typeof useStore> }) {
  const q = store.query.trim().toLowerCase();
  const list = GAMES.filter((g) => {
    const okTag = store.tag === "全部" || g.tags.includes(store.tag);
    const okQ =
      q === "" ||
      g.title.zh.toLowerCase().includes(q) ||
      g.title.en.toLowerCase().includes(q) ||
      g.studio[lang === "en" ? "en" : "zh"].toLowerCase().includes(q) ||
      g.tags.some((t) => t.toLowerCase().includes(q));
    return okTag && okQ;
  });
  return (
    <section id="na-catalog" className="mx-auto max-w-5xl scroll-mt-6 px-5 pt-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: "var(--na-fg)" }}>
          {L({ zh: "全部游戏", en: "All Games" }, lang)}{" "}
          <span style={{ color: "var(--na-muted)", ...MONO }}>({list.length})</span>
        </h2>
        <input
          value={store.query}
          onChange={(e) => store.setQuery(e.target.value)}
          placeholder={L({ zh: "输入名称 / 工作室 / 标签…", en: "Title / studio / tag…" }, lang)}
          className="na-input w-full rounded px-3 py-2 text-xs sm:w-72"
        />
      </div>
      {list.length === 0 ? (
        <div className="mt-6 rounded border p-10 text-center text-sm" style={{ borderColor: "var(--na-line)", color: "var(--na-muted)" }}>
          {L({ zh: "没有匹配的游戏——试试别的关键词或类别。", en: "No matching games — try another keyword or category." }, lang)}
        </div>
      ) : (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((g, i) => (
            <div
              key={g.id}
              className="na-card grid overflow-hidden rounded sm:grid-cols-[1fr_auto]"
              style={{ background: "var(--na-panel)", animation: `na-in .4s ease ${Math.min(i, 8) * 60}ms both` }}
            >
              <div className="flex min-w-0 gap-3 p-3">
                <div className="h-16 w-28 shrink-0 overflow-hidden rounded">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={g.img} alt={g.title.en} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0">
                  <div className="truncate text-xs font-bold" style={{ color: "var(--na-bright)" }}>{L(g.title, lang)}</div>
                  <div className="mt-0.5 text-[10px]" style={{ color: "var(--na-muted)" }}>{L(g.studio, lang)}</div>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {g.tags.slice(0, 3).map((t) => (
                      <span key={t} className="rounded px-1.5 py-0.5 text-[9px]" style={{ background: "rgba(103,193,245,0.12)", color: "var(--na-blue)" }}>{t}</span>
                    ))}
                  </div>
                  <div className="mt-1.5">
                    <PriceTag g={g} compact />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 border-t p-2.5 sm:w-28 sm:flex-col sm:justify-center sm:border-l sm:border-t-0" style={{ borderColor: "var(--na-line)" }}>
                <button
                  type="button"
                  onClick={() => store.addToCart(g.title, lang)}
                  className="w-full rounded py-1.5 text-[10px] font-bold text-white transition hover:brightness-125 active:scale-95"
                  style={{ background: "linear-gradient(180deg,#67C1F5,#417A9B)" }}
                >
                  {L({ zh: "加入购物车", en: "Add to Cart" }, lang)}
                </button>
                <span className="text-center text-[9px]" style={{ color: "var(--na-muted)" }}>
                  {g.soon ? L({ zh: "预售中", en: "Pre-order" }, lang) : L({ zh: "即刻发货", en: "Instant delivery" }, lang)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/* ================= 价格标签 ================= */
function PriceTag({ g, compact = false }: { g: Game; compact?: boolean }) {
  if (g.discount > 0) {
    return (
      <span className="inline-flex items-center gap-1.5">
        <span className={compact ? "na-off" : "na-off"} style={compact ? { fontSize: 11, padding: "1px 5px" } : undefined}>-{g.discount}%</span>
        <span className="text-[10px] line-through" style={{ color: "var(--na-muted)" }}>¥{g.price}</span>
        <span className={`font-bold ${compact ? "text-[11px]" : "text-sm"}`} style={{ color: "var(--na-green)" }}>¥{finalPrice(g)}</span>
      </span>
    );
  }
  return <span className={`font-bold ${compact ? "text-[11px]" : "text-sm"}`} style={{ color: "var(--na-fg)" }}>¥{g.price}</span>;
}

/* ================= 页脚 ================= */
function Footer({ lang }: { lang: Lang }) {
  const cols: { head: Bi; links: Bi[] }[] = [
    { head: { zh: "商店", en: "Store" }, links: [{ zh: "热销商品", en: "Top Sellers" }, { zh: "新品上架", en: "New Releases" }, { zh: "特别优惠", en: "Specials" }] },
    { head: { zh: "支持", en: "Support" }, links: [{ zh: "退款政策", en: "Refunds" }, { zh: "客服中心", en: "Customer Care" }, { zh: "系统需求", en: "System Requirements" }] },
  ];
  return (
    <footer className="mt-12" style={{ background: "var(--na-deep)" }}>
      <div className="mx-auto grid max-w-5xl gap-8 px-5 py-10 sm:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-black tracking-widest" style={{ color: "var(--na-pink)" }}>NEON</span>
            <span className="text-base font-black tracking-widest" style={{ color: "var(--na-blue)" }}>ARCADE</span>
          </div>
          <p className="mt-3 max-w-sm text-[11px] leading-relaxed" style={{ color: "var(--na-muted)" }}>
            {L(
              { zh: "演示内容为虚构游戏商店，仅用于展示模板能力；封面与立绘为 AI 生成的原创占位素材。", en: "A fictional game store for template demo purposes; covers and art are original AI-generated placeholders." },
              lang
            )}
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.head.en}>
            <div className="text-[11px] font-bold tracking-[0.25em]" style={{ color: "var(--na-blue)" }}>{L(c.head, lang)}</div>
            <ul className="mt-3 space-y-2">
              {c.links.map((l) => (
                <li key={l.en}>
                  <a href="#na-top" className="na-link text-xs">{L(l, lang)}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto max-w-5xl border-t px-5 py-5 text-[10px] tracking-wider" style={{ borderColor: "var(--na-line)", color: "var(--na-muted)" }}>
        © 2026 NEON ARCADE · Template demo · {L({ zh: "虚拟商店 · 请勿与真实产品混淆", en: "Fictional store · not a real product" }, lang)}
      </div>
    </footer>
  );
}

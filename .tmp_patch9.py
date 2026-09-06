# -*- coding: utf-8 -*-
"""NeonArcade de-Steam retheme (neon pink/violet), dedupe discount badges, vertical catalog cards. v2"""
from pathlib import Path

p = Path("D:/Programer/portfolio-blog/components/showcase/NeonArcade.tsx")
s = p.read_text(encoding="utf-8")

def rep(old, new, expect):
    global s
    c = s.count(old)
    if c != expect:
        raise SystemExit("count=" + str(c) + " expect=" + str(expect) + " for: " + old[:80])
    s = s.replace(old, new)

# ---- 1) palette vars ----
rep('''const vars = {
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
} as CSSProperties;''',
'''const vars = {
  "--na-bg": "#191522",
  "--na-deep": "#120F1A",
  "--na-panel": "#221B30",
  "--na-line": "#3A3050",
  "--na-fg": "#E4DCEF",
  "--na-bright": "#FFFFFF",
  "--na-muted": "#9C93AD",
  "--na-acc": "#FF5C8A",
  "--na-violet": "#B18CFF",
  "--na-pink": "#FF2E88",
  "--na-sale": "#FF8FAF",
  "--na-offbg": "#6E1B3C",
} as CSSProperties;''', 1)

# ---- 2) card hover glow -> pink ----
rep('        .na-card:hover { transform: translateY(-3px); outline-color: rgba(102,192,244,.65); box-shadow: 0 10px 26px rgba(0,0,0,.5), 0 0 18px rgba(102,192,244,.18); }',
    '        .na-card:hover { transform: translateY(-3px); outline-color: rgba(255,92,138,.65); box-shadow: 0 10px 26px rgba(0,0,0,.5), 0 0 18px rgba(255,92,138,.15); }', 1)

# ---- 3) logo ARCADE -> violet (header + footer, same indent) ----
rep('<span className="text-base font-black tracking-widest" style={{ color: "var(--na-blue)" }}>ARCADE</span>',
    '<span className="text-base font-black tracking-widest" style={{ color: "var(--na-violet)" }}>ARCADE</span>', 2)

# ---- 4) store nav gradient tint ----
rep('background: "linear-gradient(180deg, rgba(42,71,94,0.35), rgba(27,40,56,0))"',
    'background: "linear-gradient(180deg, rgba(58,48,80,0.35), rgba(25,21,34,0))"', 1)

# ---- 5) featured / dailydeal panel gradients ----
rep('''        style={{ background: "linear-gradient(180deg,#2A475E 0%,#1B2838 100%)" }}
        onMouseEnter={() => setPaused(true)}''',
'''        style={{ background: "linear-gradient(180deg,#2E2540 0%,#191522 100%)" }}
        onMouseEnter={() => setPaused(true)}''', 1)
rep('<div key={g.id} className="na-card overflow-hidden rounded" style={{ background: "linear-gradient(180deg,#2A475E 0%,#1B2838 100%)" }}>',
    '<div key={g.id} className="na-card overflow-hidden rounded" style={{ background: "linear-gradient(180deg,#2E2540 0%,#191522 100%)" }}>', 1)

# ---- 6) featured review tag tint ----
rep('<span className="w-fit rounded px-2 py-0.5 text-[10px] font-bold" style={{ background: "rgba(102,192,244,0.14)", color: "var(--na-blue)" }}>',
    '<span className="w-fit rounded px-2 py-0.5 text-[10px] font-bold" style={{ background: "rgba(255,92,138,0.14)", color: "var(--na-acc)" }}>', 1)

# ---- 7) featured chips tint ----
rep('<button key={t} type="button" onClick={() => { store.setTag(t); }} className="na-chip rounded px-2 py-0.5 text-[10px]" style={{ background: "rgba(103,193,245,0.15)", color: "var(--na-blue)" }}>',
    '<button key={t} type="button" onClick={() => { store.setTag(t); }} className="na-chip rounded px-2 py-0.5 text-[10px]" style={{ background: "rgba(255,92,138,0.15)", color: "var(--na-acc)" }}>', 1)

# ---- 8) category selected chip ----
rep('? { borderColor: "var(--na-blue)", color: "var(--na-blue)", background: "rgba(102,192,244,0.12)" }',
    '? { borderColor: "var(--na-acc)", color: "var(--na-acc)", background: "rgba(255,92,138,0.12)" }', 1)

# ---- 9) tab selected ----
rep('style={i === tab ? { background: "rgba(102,192,244,0.14)", color: "var(--na-blue)" } : { color: "var(--na-muted)" }}',
    'style={i === tab ? { background: "rgba(255,92,138,0.14)", color: "var(--na-acc)" } : { color: "var(--na-muted)" }}', 1)

# ---- 10) daily deal: dedupe badge ----
rep('''                  <div className="mt-1 flex items-center gap-1.5">
                    {g.discount > 0 && <span className="na-off">-{g.discount}%</span>}
                    <PriceTag g={g} compact />
                  </div>''',
'''                  <div className="mt-1 flex items-center gap-1.5">
                    <PriceTag g={g} compact />
                  </div>''', 1)

# ---- 11) tabbed rows: dedupe badge ----
rep('''                <div className="mt-1 flex items-center gap-1.5">
                  {g.discount > 0 && <span className="na-off">-{g.discount}%</span>}
                  <PriceTag g={g} compact />
                </div>''',
'''                <div className="mt-1 flex items-center gap-1.5">
                  <PriceTag g={g} compact />
                </div>''', 1)

# ---- 12) catalog card -> vertical layout ----
rep('''            <div
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
            </div>''',
'''            <div
              key={g.id}
              className="na-card overflow-hidden rounded"
              style={{ background: "var(--na-panel)", animation: `na-in .4s ease ${Math.min(i, 8) * 60}ms both` }}
            >
              <div className="relative aspect-[460/215] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.img} alt={g.title.en} className="h-full w-full object-cover" />
                {g.soon && (
                  <span className="absolute left-2 top-2 rounded px-2 py-0.5 text-[10px] font-bold" style={{ background: "var(--na-pink)", color: "#fff" }}>
                    {L({ zh: "预售", en: "PRE-ORDER" }, lang)}
                  </span>
                )}
              </div>
              <div className="p-3">
                <div className="truncate text-xs font-bold" style={{ color: "var(--na-bright)" }}>{L(g.title, lang)}</div>
                <div className="mt-0.5 text-[10px]" style={{ color: "var(--na-muted)" }}>{L(g.studio, lang)}</div>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {g.tags.slice(0, 3).map((t) => (
                    <span key={t} className="rounded px-1.5 py-0.5 text-[9px]" style={{ background: "rgba(255,92,138,0.12)", color: "var(--na-acc)" }}>{t}</span>
                  ))}
                </div>
                <div className="mt-2.5 flex items-center justify-between gap-2">
                  <PriceTag g={g} compact />
                  <button
                    type="button"
                    onClick={() => store.addToCart(g.title, lang)}
                    className="shrink-0 rounded px-3 py-1.5 text-[10px] font-bold text-white transition hover:brightness-125 active:scale-95"
                    style={{ background: "linear-gradient(180deg,#FF5C8A,#C2255C)" }}
                  >
                    {L({ zh: "加入购物车", en: "Add to Cart" }, lang)}
                  </button>
                </div>
              </div>
            </div>''', 1)

# ---- 13) remaining button gradients (featured + dailydeal + tabbedrows) ----
rep('"linear-gradient(180deg,#67C1F5,#417A9B)"', '"linear-gradient(180deg,#FF5C8A,#C2255C)"', 3)

# ---- 14) global var renames ----
rep("var(--na-blue)", "var(--na-acc)", 5)
rep("var(--na-green)", "var(--na-sale)", 3)

p.write_text(s, encoding="utf-8", newline="\n")

# ---- sanity: old steam hexes gone ----
for bad in ["67C1F5", "417A9B", "4C6B22", "BEEE11", "66C0F4", "102,192,244", "103,193,245", "2A475E", "1B2838", "na-blue", "na-green"]:
    if bad in s:
        raise SystemExit("residual: " + bad)
print("NEON RETHEME OK")

# ---- showcase.ts gallery theme ----
p2 = Path("D:/Programer/portfolio-blog/lib/showcase.ts")
s2 = p2.read_text(encoding="utf-8")
old2 = (
    '    theme: {\n'
    '      bg: "#1B2838",\n'
    '      panel: "#16202D",\n'
    '      line: "#2A475E",\n'
    '      fg: "#C7D5E0",\n'
    '      muted: "#8F98A0",\n'
    '      acc: "#66C0F4",\n'
    '      acc2: "#FF2E88",\n'
    '      heroGrad: "linear-gradient(135deg,#2A475E 0%,#1B2838 55%,#171A21 100%)",\n'
    '    },'
)
new2 = (
    '    theme: {\n'
    '      bg: "#191522",\n'
    '      panel: "#221B30",\n'
    '      line: "#3A3050",\n'
    '      fg: "#E4DCEF",\n'
    '      muted: "#9C93AD",\n'
    '      acc: "#FF5C8A",\n'
    '      acc2: "#B18CFF",\n'
    '      heroGrad: "linear-gradient(135deg,#3A3050 0%,#191522 55%,#120F1A 100%)",\n'
    '    },'
)
c2 = s2.count(old2)
assert c2 == 1, "showcase theme count=" + str(c2)
s2 = s2.replace(old2, new2)
p2.write_text(s2, encoding="utf-8", newline="\n")
print("SHOWCASE THEME OK")

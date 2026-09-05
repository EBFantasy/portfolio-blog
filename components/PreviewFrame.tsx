import type { Accent, Project } from "@/lib/work-shared";

const accentStyles: Record<
  Accent,
  { grad: string; soft: string; text: string; border: string; bar: string; chip: string }
> = {
  violet: {
    grad: "from-violet-500 to-indigo-600",
    soft: "bg-violet-500/10",
    text: "text-violet-600 dark:text-violet-400",
    border: "border-violet-300 dark:border-violet-700",
    bar: "bg-violet-400/50",
    chip: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  },
  amber: {
    grad: "from-amber-500 to-orange-600",
    soft: "bg-amber-500/10",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-300 dark:border-amber-700",
    bar: "bg-amber-400/50",
    chip: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  },
  rose: {
    grad: "from-rose-500 to-pink-600",
    soft: "bg-rose-500/10",
    text: "text-rose-600 dark:text-rose-400",
    border: "border-rose-300 dark:border-rose-700",
    bar: "bg-rose-400/50",
    chip: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
  },
  sky: {
    grad: "from-sky-500 to-blue-600",
    soft: "bg-sky-500/10",
    text: "text-sky-600 dark:text-sky-400",
    border: "border-sky-300 dark:border-sky-700",
    bar: "bg-sky-400/50",
    chip: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  },
};

/** 灰色文字占位条 */
function Line({ w, h = "h-2" }: { w: string; h?: string }) {
  return <div className={`${h} ${w} rounded-full bg-zinc-300/80 dark:bg-zinc-600/70`} />;
}

/* ---------------- 浏览器窗口 mockup ---------------- */

function BrowserFrame({ project }: { project: Project }) {
  const a = accentStyles[project.accent];
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
      {/* 浏览器 chrome */}
      <div className="flex items-center gap-1.5 border-b border-zinc-100 bg-zinc-50 px-4 py-2.5 dark:border-zinc-800 dark:bg-zinc-800/70">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        <span className="ml-3 flex-1 truncate rounded-md bg-zinc-200/80 px-3 py-1 text-[11px] text-zinc-500 dark:bg-zinc-700/70 dark:text-zinc-400">
          https://{project.slug}.demo.ebfantasy.vercel.app
        </span>
      </div>

      {project.slug === "cinema-booking" ? (
        <CinemaMock a={a} />
      ) : project.slug === "saas-pricing" ? (
        <PricingMock a={a} />
      ) : (
        <WebsiteMock a={a} />
      )}
    </div>
  );
}

/** 通用营销官网抽象布局 */
function WebsiteMock({ a }: { a: (typeof accentStyles)[Accent] }) {
  return (
    <div className="space-y-4 p-5">
      {/* 导航条 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`h-4 w-4 rounded-md bg-gradient-to-br ${a.grad}`} />
          <Line w="w-12" />
        </div>
        <div className="flex items-center gap-3">
          <Line w="w-8" />
          <Line w="w-8" />
          <span className={`h-5 w-14 rounded-md bg-gradient-to-r ${a.grad}`} />
        </div>
      </div>
      {/* hero */}
      <div className={`grid grid-cols-5 gap-4 rounded-xl ${a.soft} p-4`}>
        <div className="col-span-3 space-y-2.5 py-2">
          <Line w="w-11/12" h="h-3.5" />
          <Line w="w-8/12" h="h-3.5" />
          <Line w="w-9/12" h="h-2" />
          <Line w="w-6/12" h="h-2" />
          <div className="flex gap-2 pt-1.5">
            <span className={`h-6 w-16 rounded-lg bg-gradient-to-r ${a.grad}`} />
            <span className="h-6 w-16 rounded-lg border border-zinc-300 dark:border-zinc-600" />
          </div>
        </div>
        <div className={`col-span-2 rounded-lg bg-gradient-to-br ${a.grad} opacity-90`} />
      </div>
      {/* 三卡片 */}
      <div className="grid grid-cols-3 gap-3">
        {["opacity-90", "opacity-70", "opacity-50"].map((op, i) => (
          <div key={i} className="space-y-2 rounded-lg border border-zinc-100 p-3 dark:border-zinc-800">
            <div className={`h-10 rounded-md bg-gradient-to-br ${a.grad} ${op}`} />
            <Line w="w-9/12" />
            <Line w="w-7/12" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** 电影院选座抽象布局 */
function CinemaMock({ a }: { a: (typeof accentStyles)[Accent] }) {
  // 模拟座位图： sold=已售 selected=选中 available=可选
  const seatPattern = [
    "aaasaaaasaaa",
    "aasaaaaaasaa",
    "saaassaaasaa",
    "aasaaaaaasaa",
    "aaasaasasaaa",
  ];
  return (
    <div className="space-y-4 p-5">
      <div className="flex items-center justify-between">
        <Line w="w-20" h="h-3" />
        <span className={`rounded-md px-2 py-0.5 text-[10px] font-medium ${a.chip}`}>12 / 46</span>
      </div>
      {/* 银幕 */}
      <div className="mx-auto h-1.5 w-3/4 rounded-full bg-gradient-to-r from-transparent via-zinc-400 to-transparent dark:via-zinc-500" />
      <div className="mx-auto w-fit text-[9px] text-zinc-400">SCREEN</div>
      {/* 座位网格 */}
      <div className="mx-auto w-fit space-y-1.5 py-1">
        {seatPattern.map((row, r) => (
          <div key={r} className="flex gap-1.5">
            {row.split("").map((c, i) => (
              <span
                key={i}
                className={`h-3 w-3 rounded-[4px] ${
                  c === "s"
                    ? "bg-zinc-300 dark:bg-zinc-600"
                    : r === 1 && i === 6
                      ? `bg-gradient-to-br ${a.grad}`
                      : `border ${a.border} ${a.soft}`
                }`}
              />
            ))}
          </div>
        ))}
      </div>
      {/* 结算栏 */}
      <div className="flex items-center justify-between rounded-lg border border-zinc-100 p-2.5 dark:border-zinc-800">
        <div className="space-y-1.5">
          <Line w="w-16" />
          <Line w="w-10" h="h-1.5" />
        </div>
        <span className={`h-7 w-20 rounded-lg bg-gradient-to-r ${a.grad}`} />
      </div>
    </div>
  );
}

/** 订阅定价抽象布局 */
function PricingMock({ a }: { a: (typeof accentStyles)[Accent] }) {
  const tiers = [
    { hi: false, lines: 3 },
    { hi: true, lines: 4 },
    { hi: false, lines: 3 },
  ];
  return (
    <div className="space-y-4 p-5">
      <div className="flex items-center justify-center gap-2">
        <span className={`rounded-md px-3 py-1 text-[10px] font-medium ${a.chip}`}>Monthly</span>
        <span className="h-4 w-8 rounded-full bg-gradient-to-r from-zinc-300 to-zinc-400 dark:from-zinc-600 dark:to-zinc-500" />
        <span className={`rounded-md px-3 py-1 text-[10px] font-medium ${a.chip}`}>Yearly -20%</span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {tiers.map((t, i) => (
          <div
            key={i}
            className={`space-y-2 rounded-xl p-3 ${
              t.hi
                ? `border-2 bg-gradient-to-b ${a.soft}`
                : "border border-zinc-200 dark:border-zinc-700"
            } ${t.hi ? a.border : ""}`}
          >
            <Line w="w-8/12" />
            <div className="flex items-baseline gap-1">
              <span className={`text-lg font-semibold ${t.hi ? a.text : "text-zinc-400"}`}>
                ¥{[0, 68, 198][i]}
              </span>
              <span className="text-[9px] text-zinc-400">/mo</span>
            </div>
            {Array.from({ length: t.lines }).map((_, j) => (
              <Line key={j} w={j % 2 ? "w-8/12" : "w-10/12"} h="h-1.5" />
            ))}
            <span
              className={`block h-5 w-full rounded-md ${
                t.hi ? `bg-gradient-to-r ${a.grad}` : "border border-zinc-300 dark:border-zinc-600"
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- 手机壳 mockup ---------------- */

function PhoneFrame({ project }: { project: Project }) {
  const a = accentStyles[project.accent];
  return (
    <div className="mx-auto w-[250px] overflow-hidden rounded-[2.4rem] border-8 border-zinc-900 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
      {/* 刘海 + 状态栏 */}
      <div className="relative flex items-center justify-between bg-zinc-50 px-5 pb-1 pt-2 dark:bg-zinc-800">
        <span className="text-[9px] font-medium text-zinc-500">9:41</span>
        <span className="absolute left-1/2 top-1.5 h-4 w-16 -translate-x-1/2 rounded-full bg-zinc-900 dark:bg-zinc-950" />
        <div className="flex items-center gap-1">
          <span className="h-1.5 w-3 rounded-sm bg-zinc-400" />
          <span className="h-2 w-4 rounded-sm border border-zinc-400" />
        </div>
      </div>
      {/* 小程序内容 */}
      <div className="space-y-3 px-4 py-3">
        {/* 头部 */}
        <div className="flex items-center justify-between">
          <Line w="w-16" h="h-3" />
          <span className="h-5 w-5 rounded-full bg-zinc-200 dark:bg-zinc-700" />
        </div>
        {/* banner */}
        <div className={`flex h-20 items-end rounded-xl bg-gradient-to-br ${a.grad} p-3`}>
          <div className="space-y-1.5">
            <div className="h-2 w-20 rounded-full bg-white/80" />
            <div className="h-1.5 w-14 rounded-full bg-white/50" />
          </div>
        </div>
        {/* 分类 chips */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`h-5 w-12 rounded-full ${
                i === 0 ? `bg-gradient-to-r ${a.grad}` : "bg-zinc-100 dark:bg-zinc-800"
              }`}
            />
          ))}
        </div>
        {/* 商品双列 */}
        <div className="grid grid-cols-2 gap-2">
          {[0, 1].map((i) => (
            <div key={i} className="space-y-1.5 rounded-lg border border-zinc-100 p-2 dark:border-zinc-800">
              <div className={`h-12 rounded-md bg-gradient-to-br ${a.grad} ${i ? "opacity-60" : ""}`} />
              <Line w="w-10/12" h="h-1.5" />
              <div className="flex items-center justify-between">
                <span className={`text-[9px] font-semibold ${a.text}`}>¥{[18, 26][i]}</span>
                <span className={`h-4 w-4 rounded-full bg-gradient-to-br ${a.grad}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* 底部 tabbar */}
      <div className="flex items-center justify-around border-t border-zinc-100 px-6 py-2.5 dark:border-zinc-800">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={`h-4 w-4 rounded-md ${
              i === 0 ? `bg-gradient-to-br ${a.grad}` : "bg-zinc-300 dark:bg-zinc-700"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function PreviewFrame({ project }: { project: Project }) {
  return project.preview === "phone" ? (
    <PhoneFrame project={project} />
  ) : (
    <BrowserFrame project={project} />
  );
}

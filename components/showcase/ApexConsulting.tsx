"use client";

import { useState, type CSSProperties } from "react";
import BackToCase from "@/components/BackToCase";
import { CountUp, Reveal, useInView } from "@/components/showcase/reveal";

type Lang = "zh" | "en";
type Bi = { zh: string; en: string };
const L = (b: Bi, lang: Lang) => b[lang === "en" ? "en" : "zh"];

const vars = {
  "--sk-bg": "#F7F5F0",
  "--sk-panel": "#FFFFFF",
  "--sk-line": "#E5E0D5",
  "--sk-fg": "#1A2440",
  "--sk-muted": "#6B7280",
  "--sk-acc": "#B98A2F",
  "--sk-acc2": "#1A2440",
} as CSSProperties;

const SERIF = { fontFamily: "Georgia, 'Times New Roman', 'STSong', 'SimSun', serif" };

export default function ApexConsulting({ lang, backHref, backLabel }: { lang: Lang; backHref: string; backLabel: string }) {
  return (
    <div className="py-14">
      <BackToCase href={backHref} label={backLabel} />
      <style>{`
        @keyframes skx-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes skx-fadeup { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
      `}</style>
      <div
        className="mt-6 overflow-hidden rounded-3xl border border-zinc-200 shadow-xl dark:border-zinc-800"
        style={{ ...vars, background: "var(--sk-bg)" }}
      >
        <SiteNav lang={lang} />
        <Hero lang={lang} />
        <IndustryMarquee lang={lang} />
        <StatsBand lang={lang} />
        <Practices lang={lang} />
        <Method lang={lang} />
        <Cases lang={lang} />
        <Insights lang={lang} />
        <Partners lang={lang} />
        <Faq lang={lang} />
        <QuoteBand lang={lang} />
        <CtaBand lang={lang} />
        <Footer lang={lang} />
      </div>
    </div>
  );
}

/* ---------------- 导航 ---------------- */
function SiteNav({ lang }: { lang: Lang }) {
  const t: [Bi, string][] = [
    [{ zh: "核心业务", en: "Practices" }, "#apex-practices"],
    [{ zh: "工作方法", en: "Method" }, "#apex-method"],
    [{ zh: "客户案例", en: "Cases" }, "#apex-cases"],
    [{ zh: "研究洞察", en: "Insights" }, "#apex-insights"],
    [{ zh: "关于我们", en: "About" }, "#apex-about"],
  ];
  return (
    <header
      className="flex items-center justify-between border-b px-6 py-4 sm:px-10"
      style={{ borderColor: "var(--sk-line)", background: "var(--sk-bg)" }}
    >
      <div className="flex items-center gap-2.5">
        <span
          className="flex h-8 w-8 items-center justify-center text-sm font-bold text-white"
          style={{ background: "var(--sk-acc2)", fontFamily: SERIF.fontFamily }}
        >
          A
        </span>
        <span className="text-sm font-semibold tracking-wide" style={{ color: "var(--sk-fg)" }}>
          APEX <span style={{ color: "var(--sk-acc)" }}>·</span> 策略咨询{lang === "en" ? "" : ""}
        </span>
      </div>
      <nav className="hidden items-center gap-6 text-xs lg:flex" style={{ color: "var(--sk-muted)" }}>
        {t.map(([label, href]) => (
          <a key={href} href={href} className="transition hover:opacity-60">
            {L(label, lang)}
          </a>
        ))}
      </nav>
      <a
        href="#apex-cta"
        className="rounded-lg px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90"
        style={{ background: "var(--sk-acc)" }}
      >
        {L({ zh: "预约顾问", en: "Book a consultant" }, lang)}
      </a>
    </header>
  );
}

/* ---------------- Hero：标题 + 动效报告卡 ---------------- */
function Hero({ lang }: { lang: Lang }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const bars: [Bi, number][] = [
    [{ zh: "市场", en: "Market" }, 82],
    [{ zh: "运营", en: "Ops" }, 64],
    [{ zh: "财务", en: "Finance" }, 91],
    [{ zh: "组织", en: "Talent" }, 73],
  ];
  return (
    <section className="px-6 py-14 sm:px-10 lg:py-20" style={{ background: "var(--sk-bg)" }}>
      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <Reveal>
            <span
              className="inline-block rounded-full border px-3.5 py-1.5 text-[11px] font-medium tracking-wide"
              style={{ borderColor: "var(--sk-acc)", color: "var(--sk-acc)", background: "var(--sk-panel)" }}
            >
              {L({ zh: "精品商务模板 · 咨询公司官网", en: "Business Template · Consulting Firm" }, lang)}
            </span>
          </Reveal>
          <Reveal delay={120}>
            <h1
              className="mt-6 text-3xl font-semibold leading-[1.25] sm:text-4xl lg:text-[2.75rem]"
              style={{ color: "var(--sk-fg)", ...SERIF }}
            >
              {L({ zh: "让每一个战略决策，都有数据撑腰", en: "Every strategic decision, backed by data" }, lang)}
            </h1>
          </Reveal>
          <Reveal delay={240}>
            <p className="mt-5 max-w-lg text-sm leading-relaxed sm:text-[15px]" style={{ color: "var(--sk-muted)" }}>
              {L(
                {
                  zh: "我们为成长期企业提供市场进入、财务重组与数字化转型咨询——从两周诊断到驻场陪跑，用可量化的结果说话。",
                  en: "Market entry, financial restructuring and digital transformation advisory for growth-stage companies — from a two-week diagnostic to on-site execution, measured by results.",
                },
                lang
              )}
            </p>
          </Reveal>
          <Reveal delay={360}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#apex-cta"
                className="rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-[1.03] active:scale-[0.98]"
                style={{ background: "var(--sk-acc)" }}
              >
                {L({ zh: "预约首次免费诊断", en: "Book a free diagnostic" }, lang)}
              </a>
              <a
                href="#apex-cases"
                className="rounded-xl border px-6 py-3 text-sm font-medium transition hover:opacity-70"
                style={{ borderColor: "var(--sk-line)", color: "var(--sk-fg)", background: "var(--sk-panel)" }}
              >
                {L({ zh: "查看客户案例", en: "See client cases" }, lang)}
              </a>
            </div>
          </Reveal>
          <Reveal delay={480}>
            <p className="mt-5 text-xs" style={{ color: "var(--sk-muted)" }}>
              {L({ zh: "首次诊断会议免费 · 48 小时内出具初步评估", en: "First session free · preliminary assessment within 48 hours" }, lang)}
            </p>
          </Reveal>
        </div>

        {/* Q3 报告卡：柱条进场动画 + 数字滚动 */}
        <div ref={ref} className="relative">
          <Reveal delay={200}>
            <div
              className="rounded-2xl border p-6 shadow-2xl transition-transform duration-700 sm:p-7"
              style={{ background: "var(--sk-panel)", borderColor: "var(--sk-line)" }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold tracking-[0.18em]" style={{ color: "var(--sk-muted)" }}>
                  Q3 STRATEGY REPORT
                </span>
                <span className="rounded-full px-2.5 py-1 text-[10px] font-bold text-white" style={{ background: "var(--sk-acc)" }}>
                  <CountUp to={24} prefix="+" suffix="%" duration={1800} />
                </span>
              </div>
              <div className="mt-6 space-y-5">
                {bars.map(([label, pct], i) => (
                  <div key={L(label, lang)}>
                    <div className="flex items-center justify-between text-[11px]" style={{ color: "var(--sk-muted)" }}>
                      <span>{L(label, lang)}</span>
                      <span className="font-semibold" style={{ color: "var(--sk-fg)" }}>
                        {pct}%
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full" style={{ background: "var(--sk-line)" }}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: inView ? `${pct}%` : "0%",
                          background: "var(--sk-acc)",
                          transition: `width 1.2s cubic-bezier(.22,.61,.36,1) ${i * 160 + 200}ms`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-7 grid grid-cols-2 gap-3">
                {(
                  [
                    { v: 38, prefix: "-", suffix: "%", label: { zh: "交付周期", en: "Delivery time" } },
                    { v: 2.4, decimals: 1, suffix: "×", label: { zh: "决策效率", en: "Decision speed" } },
                  ] as { v: number; decimals?: number; prefix?: string; suffix: string; label: Bi }[]
                ).map((s) => (
                  <div key={s.label.en} className="rounded-xl px-4 py-3.5" style={{ background: "var(--sk-bg)", border: "1px solid var(--sk-line)" }}>
                    <div className="text-xl font-bold" style={{ color: "var(--sk-acc2)" }}>
                      <CountUp to={s.v} decimals={s.decimals ?? 0} prefix={s.prefix} suffix={s.suffix} duration={1600} />
                    </div>
                    <div className="mt-0.5 text-[11px]" style={{ color: "var(--sk-muted)" }}>
                      {L(s.label, lang)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------------- 行业覆盖：无缝滚动横幅 ---------------- */
function IndustryMarquee({ lang }: { lang: Lang }) {
  const items: Bi[] = [
    { zh: "智能制造", en: "Smart Manufacturing" },
    { zh: "新消费零售", en: "Consumer Retail" },
    { zh: "医疗健康", en: "Healthcare" },
    { zh: "跨境电商", en: "Cross-border E-commerce" },
    { zh: "金融科技", en: "FinTech" },
    { zh: "新能源", en: "Clean Energy" },
    { zh: "企业服务", en: "Enterprise SaaS" },
    { zh: "智慧物流", en: "Smart Logistics" },
  ];
  const row = [...items, ...items];
  return (
    <section className="border-y py-5" style={{ borderColor: "var(--sk-line)", background: "var(--sk-acc2)" }}>
      <div className="flex items-center gap-6 overflow-hidden">
        <span className="shrink-0 pl-6 text-[11px] font-semibold tracking-widest text-white/60 sm:pl-10">
          {L({ zh: "行业覆盖", en: "INDUSTRIES" }, lang)}
        </span>
        <div className="relative flex-1 overflow-hidden">
          <div className="flex w-max gap-10" style={{ animation: "skx-marquee 32s linear infinite" }}>
            {row.map((it, i) => (
              <span key={i} className="whitespace-nowrap text-sm font-medium text-white/85" style={SERIF}>
                {L(it, lang)} <span className="ml-10" style={{ color: "var(--sk-acc)" }}>◆</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- 数据带 ---------------- */
function StatsBand({ lang }: { lang: Lang }) {
  const stats = [
    { to: 12, suffix: "", unit: { zh: " 年", en: " yrs" }, label: { zh: "行业深耕", en: "Years of practice" } },
    { to: 300, suffix: "+", unit: { zh: "", en: "" }, label: { zh: "服务企业", en: "Clients advised" } },
    { to: 98, suffix: "%", unit: { zh: "", en: "" }, label: { zh: "客户续约率", en: "Client retention" } },
    { to: 4.8, decimals: 1, suffix: "", unit: { zh: " / 5", en: " / 5" }, label: { zh: "客户满意度", en: "Client satisfaction" } },
  ];
  return (
    <section className="grid grid-cols-2 gap-8 px-6 py-12 text-center sm:px-10 lg:grid-cols-4" style={{ background: "var(--sk-panel)" }}>
      {stats.map((s, i) => (
        <Reveal key={s.label.en} delay={i * 120}>
          <div className="text-3xl font-bold sm:text-4xl" style={{ color: "var(--sk-acc)" }}>
            <CountUp to={s.to} decimals={s.decimals ?? 0} suffix={s.suffix} />
            <span className="text-xl sm:text-2xl">{L(s.unit, lang)}</span>
          </div>
          <div className="mt-2 text-xs sm:text-[13px]" style={{ color: "var(--sk-muted)" }}>
            {L(s.label, lang)}
          </div>
        </Reveal>
      ))}
    </section>
  );
}

/* ---------------- 核心业务 ---------------- */
function Practices({ lang }: { lang: Lang }) {
  const items = [
    { n: "01", title: { zh: "市场进入策略", en: "Market Entry" }, desc: { zh: "从竞品格局到渠道打法，30 天输出可执行方案。", en: "From competitive landscape to channel playbook in 30 days." } },
    { n: "02", title: { zh: "财务重组", en: "Financial Restructuring" }, desc: { zh: "现金流诊断、成本结构优化与融资节奏规划。", en: "Cash-flow diagnostics, cost restructuring and fundraising cadence." } },
    { n: "03", title: { zh: "组织变革", en: "Org Transformation" }, desc: { zh: "架构调整、绩效体系与关键人才保留方案。", en: "Org design, performance systems and key-talent retention." } },
    { n: "04", title: { zh: "数字化转型", en: "Digital Transformation" }, desc: { zh: "业务流程上云、数据中台搭建与工具链落地。", en: "Cloud workflows, data platforms and toolchain adoption." } },
    { n: "05", title: { zh: "并购整合", en: "M&A Integration" }, desc: { zh: "尽调支持、整合路线图与百天计划执行。", en: "Due diligence, integration roadmap and 100-day execution." } },
    { n: "06", title: { zh: "出海咨询", en: "Global Expansion" }, desc: { zh: "合规、税务与本地化运营的一站式陪跑。", en: "Compliance, tax and localized ops, end to end." } },
  ];
  return (
    <section id="apex-practices" className="px-6 py-16 sm:px-10" style={{ background: "var(--sk-bg)" }}>
      <Reveal>
        <SectionHead
          lang={lang}
          eyebrow={{ zh: "核心业务", en: "CORE PRACTICES" }}
          title={{ zh: "六个团队，接住增长路上会遇到的每一种难题", en: "Six teams for every growth problem you might face" }}
        />
      </Reveal>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((f, i) => (
          <Reveal key={f.n} delay={(i % 3) * 120}>
            <div className="group relative h-full overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg" style={{ background: "var(--sk-panel)", borderColor: "var(--sk-line)" }}>
              <span
                className="absolute left-0 top-0 h-[3px] w-0 transition-all duration-500 group-hover:w-full"
                style={{ background: "var(--sk-acc)" }}
              />
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-bold tracking-widest" style={{ color: "var(--sk-acc)" }}>{f.n}</span>
              </div>
              <div className="mt-3 text-base font-semibold" style={{ color: "var(--sk-fg)", ...SERIF }}>
                {L(f.title, lang)}
              </div>
              <div className="mt-2 text-xs leading-relaxed sm:text-[13px]" style={{ color: "var(--sk-muted)" }}>
                {L(f.desc, lang)}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- 工作方法：四步流程 ---------------- */
function Method({ lang }: { lang: Lang }) {
  const steps = [
    { n: "1", title: { zh: "诊断", en: "Diagnose" }, desc: { zh: "两周访谈与数据摸底，找出真正的约束点。", en: "Two weeks of interviews and data audits to find the real constraint." } },
    { n: "2", title: { zh: "设计", en: "Design" }, desc: { zh: "拆成可执行里程碑，每一步都有负责人与验收标准。", en: "Accountable milestones with clear acceptance criteria." } },
    { n: "3", title: { zh: "落地", en: "Deliver" }, desc: { zh: "顾问驻场陪跑，每周复盘、及时纠偏。", en: "On-site execution with weekly reviews and course correction." } },
    { n: "4", title: { zh: "沉淀", en: "Sustain" }, desc: { zh: "方法论移交团队，效果在项目结束后仍能持续。", en: "Handover to your team, so results outlast the engagement." } },
  ];
  return (
    <section id="apex-method" className="px-6 py-16 sm:px-10" style={{ background: "var(--sk-acc2)" }}>
      <Reveal>
        <SectionHead
          lang={lang}
          eyebrow={{ zh: "工作方法", en: "HOW WE WORK" }}
          title={{ zh: "不写完报告就走人，我们陪跑到结果发生", en: "We stay until the results happen" }}
          dark
        />
      </Reveal>
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <Reveal key={s.n} delay={i * 160}>
            <div className="relative">
              {i < 3 && (
                <span className="absolute left-[calc(50%+2.2rem)] top-6 hidden h-px w-[calc(100%-4.4rem)] bg-white/20 lg:block" />
              )}
              <div className="flex flex-col items-center text-center">
                <span
                  className="z-10 flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white ring-4 ring-white/10"
                  style={{ background: "var(--sk-acc)", ...SERIF }}
                >
                  {s.n}
                </span>
                <div className="mt-4 text-sm font-semibold tracking-wide text-white">{L(s.title, lang)}</div>
                <p className="mt-2 max-w-[16rem] text-xs leading-relaxed text-white/60">{L(s.desc, lang)}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- 客户案例：标签页切换 ---------------- */
function Cases({ lang }: { lang: Lang }) {
  const cases = [
    {
      img: "/showcase/apex/case-retail.jpg",
      industry: { zh: "新消费零售", en: "Consumer Retail" },
      title: { zh: "区域零售品牌的商品架构重生", en: "Rebuilding a regional retailer's product architecture" },
      challenge: { zh: "门店客流连续 6 个季度下滑，800+ SKU 动销率不足四成。", en: "Traffic down six straight quarters; 800+ SKUs with under 40% sell-through." },
      action: { zh: "砍掉 60% 长尾 SKU，重构商品架构与门店模型，聚焦 12 个核心品类。", en: "Cut 60% of tail SKUs, rebuilt the assortment around 12 core categories." },
      metrics: [
        { v: "+31%", label: { zh: "单店营收", en: "Revenue / store" } },
        { v: "-22%", label: { zh: "库存周转天数", en: "Inventory days" } },
        { v: "6 " + (lang === "zh" ? "个月" : "months"), label: { zh: "重回盈利", en: "Back to profit" } },
      ],
      quote: { zh: "Apex 砍 SKU 的决心比我们自己还大。", en: "Apex was more decisive about cutting SKUs than we were." },
      who: { zh: "品牌创始人", en: "Founder" },
    },
    {
      img: "/showcase/apex/case-factory.jpg",
      industry: { zh: "智能制造", en: "Smart Manufacturing" },
      title: { zh: "三座工厂，一套数据底座", en: "Three factories, one data backbone" },
      challenge: { zh: "三座工厂、三套系统，生产数据靠日报 Excel 汇总。", en: "Three plants, three systems, production data reconciled in Excel." },
      action: { zh: "统一数据中台与车间看板，排产与质检流程全部线上化。", en: "Unified data platform and shop-floor dashboards; scheduling and QC digitized." },
      metrics: [
        { v: "+18%", label: { zh: "设备利用率", en: "Utilization" } },
        { v: "-38%", label: { zh: "交付周期", en: "Delivery time" } },
        { v: "3→1", label: { zh: "系统归一", en: "Systems unified" } },
      ],
      quote: { zh: "数字化的价值第一次被车间主任认可。", en: "For the first time, our plant managers actually believe in digital." },
      who: { zh: "首席运营官", en: "COO" },
    },
    {
      img: "/showcase/apex/case-global.jpg",
      industry: { zh: "跨境电商", en: "Cross-border E-commerce" },
      title: { zh: "把旺季爆仓变成历史", en: "Making peak-season chaos history" },
      challenge: { zh: "头程物流成本占比过高，旺季爆仓、淡季空转。", en: "Freight costs too high; warehouses overflow at peak, idle off-season." },
      action: { zh: "重构仓网布局与头程拼舱策略，建立动态补货模型。", en: "Rebuilt the warehouse network, consolidated freight, dynamic replenishment." },
      metrics: [
        { v: "-19%", label: { zh: "物流成本", en: "Logistics cost" } },
        { v: "+41%", label: { zh: "库存周转", en: "Inventory turns" } },
        { v: "98.6%", label: { zh: "现货率", en: "In-stock rate" } },
      ],
      quote: { zh: "旺季第一次没有爆仓。", en: "First peak season ever without a meltdown." },
      who: { zh: "供应链负责人", en: "VP Supply Chain" },
    },
  ];
  const [tab, setTab] = useState(0);
  const c = cases[tab];
  return (
    <section id="apex-cases" className="px-6 py-16 sm:px-10" style={{ background: "var(--sk-bg)" }}>
      <Reveal>
        <SectionHead
          lang={lang}
          eyebrow={{ zh: "客户案例", en: "CLIENT CASES" }}
          title={{ zh: "结果有数字，数字可追溯", en: "Results with numbers, numbers you can audit" }}
        />
      </Reveal>
      <Reveal delay={150}>
        <div className="mt-8 flex flex-wrap gap-2">
          {cases.map((x, i) => (
            <button
              key={x.industry.en}
              type="button"
              onClick={() => setTab(i)}
              className="rounded-full border px-4 py-2 text-xs font-medium transition"
              style={
                i === tab
                  ? { background: "var(--sk-acc2)", borderColor: "var(--sk-acc2)", color: "#fff" }
                  : { borderColor: "var(--sk-line)", color: "var(--sk-muted)", background: "var(--sk-panel)" }
              }
            >
              {L(x.industry, lang)}
            </button>
          ))}
        </div>
      </Reveal>
      <div key={tab} className="mt-6" style={{ animation: "skx-fadeup .5s ease both" }}>
        <div className="grid overflow-hidden rounded-2xl border shadow-sm lg:grid-cols-[1fr_1.15fr]" style={{ borderColor: "var(--sk-line)", background: "var(--sk-panel)" }}>
          <div className="relative min-h-[240px] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.img} alt={L(c.industry, lang)} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-[1.04]" loading="lazy" />
            <span className="absolute left-4 top-4 rounded-full bg-black/55 px-3 py-1 text-[11px] font-medium text-white backdrop-blur">
              {L(c.industry, lang)}
            </span>
          </div>
          <div className="p-6 sm:p-9">
            <h3 className="text-xl font-semibold sm:text-2xl" style={{ color: "var(--sk-fg)", ...SERIF }}>
              {L(c.title, lang)}
            </h3>
            <div className="mt-5 space-y-3 text-[13px] leading-relaxed">
              <p style={{ color: "var(--sk-muted)" }}>
                <span className="font-semibold" style={{ color: "var(--sk-fg)" }}>{L({ zh: "挑战 · ", en: "Challenge · " }, lang)}</span>
                {L(c.challenge, lang)}
              </p>
              <p style={{ color: "var(--sk-muted)" }}>
                <span className="font-semibold" style={{ color: "var(--sk-fg)" }}>{L({ zh: "做法 · ", en: "Approach · " }, lang)}</span>
                {L(c.action, lang)}
              </p>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {c.metrics.map((m) => (
                <div key={m.label.en} className="rounded-xl px-3 py-3 text-center" style={{ background: "var(--sk-bg)", border: "1px solid var(--sk-line)" }}>
                  <div className="text-lg font-bold sm:text-xl" style={{ color: "var(--sk-acc)" }}>{m.v}</div>
                  <div className="mt-1 text-[11px]" style={{ color: "var(--sk-muted)" }}>{L(m.label, lang)}</div>
                </div>
              ))}
            </div>
            <p className="mt-6 border-l-2 pl-4 text-[13px] italic leading-relaxed" style={{ borderColor: "var(--sk-acc)", color: "var(--sk-fg)" }}>
              “{L(c.quote, lang)}” <span className="not-italic" style={{ color: "var(--sk-muted)" }}>—— {L(c.who, lang)}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- 研究洞察 ---------------- */
function Insights({ lang }: { lang: Lang }) {
  const posts = [
    { no: "01", title: { zh: "2026 消费品牌出海白皮书", en: "2026 Go-to-Market Playbook for Consumer Brands" }, date: { zh: "2026 年 8 月 · 行业报告", en: "Aug 2026 · Industry report" } },
    { no: "02", title: { zh: "降本不裁员：组织效率的六种杠杆", en: "Cutting Costs Without Layoffs: Six Levers of Org Efficiency" }, date: { zh: "2026 年 6 月 · 方法论", en: "Jun 2026 · Methodology" } },
    { no: "03", title: { zh: "穿越利率周期：成长期企业现金流手册", en: "Through the Rate Cycle: a Cash-flow Handbook" }, date: { zh: "2026 年 4 月 · 指南", en: "Apr 2026 · Guide" } },
  ];
  return (
    <section id="apex-insights" className="px-6 py-16 sm:px-10" style={{ background: "var(--sk-panel)" }}>
      <Reveal>
        <SectionHead
          lang={lang}
          eyebrow={{ zh: "研究洞察", en: "INSIGHTS" }}
          title={{ zh: "我们的观点，公开可查", en: "Our thinking, published and checkable" }}
        />
      </Reveal>
      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {posts.map((p, i) => (
          <Reveal key={p.no} delay={i * 140}>
            <div className="group h-full cursor-pointer overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg" style={{ borderColor: "var(--sk-line)", background: "var(--sk-bg)" }}>
              <div
                className="relative flex h-40 items-center justify-center"
                style={{ background: "linear-gradient(135deg,#1A2440 0%,#2C3E66 60%,#B98A2F 140%)" }}
              >
                <span className="text-5xl font-bold text-white/90" style={SERIF}>{p.no}</span>
                <span className="absolute bottom-3 right-4 text-[10px] tracking-[0.2em] text-white/60">APEX RESEARCH</span>
              </div>
              <div className="p-5">
                <div className="text-sm font-semibold leading-snug transition group-hover:underline" style={{ color: "var(--sk-fg)", ...SERIF, textDecorationColor: "var(--sk-acc)" }}>
                  {L(p.title, lang)}
                </div>
                <div className="mt-2.5 text-[11px]" style={{ color: "var(--sk-muted)" }}>{L(p.date, lang)}</div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- 关于/合伙人 ---------------- */
function Partners({ lang }: { lang: Lang }) {
  const officeImg = "/showcase/apex/office.jpg";
  const partners = [
    { initials: "TC", name: { zh: "陈拓", en: "Tony Chen" }, role: { zh: "管理合伙人 · 前一线投行董事总经理", en: "Managing Partner · ex-MD, bulge-bracket IB" } },
    { initials: "LX", name: { zh: "林汐", en: "Lin Xi" }, role: { zh: "金融重组合伙人 · 十四年财务尽调经验", en: "Restructuring Partner · 14 years in FDD" } },
    { initials: "GY", name: { zh: "顾一帆", en: "Gu Yifan" }, role: { zh: "数字化合伙人 · 前头部厂数据平台负责人", en: "Digital Partner · ex-Head of Data Platform" } },
  ];
  return (
    <section id="apex-about" className="px-6 py-16 sm:px-10" style={{ background: "var(--sk-bg)" }}>
      <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
        <Reveal>
          <div className="overflow-hidden rounded-2xl border shadow-md" style={{ borderColor: "var(--sk-line)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={officeImg} alt="Apex office" className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]" loading="lazy" />
          </div>
        </Reveal>
        <div>
          <Reveal>
            <SectionHead
              lang={lang}
              eyebrow={{ zh: "关于我们", en: "ABOUT APEX" }}
              title={{ zh: "小团队，重资历，只做深度项目", en: "A small team of heavyweights, deep engagements only" }}
            />
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-4 text-[13px] leading-relaxed sm:text-sm" style={{ color: "var(--sk-muted)" }}>
              {L(
                {
                  zh: "Apex 不追求项目数量：每年同时推进的项目不超过 12 个，每个都由合伙人直接负责。我们的顾问一半来自投行与四大，一半来自产业一线。",
                  en: "We cap our load at 12 concurrent engagements a year, each led directly by a partner. Half our consultants come from banking and Big Four; half from industry.",
                },
                lang
              )}
            </p>
          </Reveal>
          <div className="mt-7 space-y-4">
            {partners.map((p, i) => (
              <Reveal key={p.initials} delay={i * 140}>
                <div className="flex items-center gap-4 rounded-2xl border p-4 transition hover:shadow-md" style={{ borderColor: "var(--sk-line)", background: "var(--sk-panel)" }}>
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white" style={{ background: "var(--sk-acc2)", ...SERIF }}>
                    {p.initials}
                  </span>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: "var(--sk-fg)" }}>{L(p.name, lang)}</div>
                    <div className="mt-0.5 text-xs" style={{ color: "var(--sk-muted)" }}>{L(p.role, lang)}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- FAQ 折叠 ---------------- */
function Faq({ lang }: { lang: Lang }) {
  const qa: { q: Bi; a: Bi }[] = [
    {
      q: { zh: "一个项目通常多久？怎么收费？", en: "How long is an engagement, and how do you charge?" },
      a: { zh: "以 6–14 周为主，按里程碑固定收费——不做按人天计时的黑箱账单，报价即总价。", en: "Typically 6–14 weeks at a fixed milestone-based fee. No per-day black-box billing; the quote is the price." },
    },
    {
      q: { zh: "项目结束后方案会烂尾吗？", en: "Will the plan fall apart after you leave?" },
      a: { zh: "我们默认驻场陪跑到方案跑通，并把方法论移交内部团队——目标是离开之后效果仍能持续。", en: "We stay until the plan runs, then hand the method to your team. Results should outlast us." },
    },
    {
      q: { zh: "只想做单点诊断可以吗？", en: "Can we start with just a diagnostic?" },
      a: { zh: "可以，这也是最受欢迎的起点：两周三日诊断包，输出一份带优先级的问题清单与行动建议。", en: "Yes — our most popular entry point. A two-week, three-day diagnostic produces a prioritized list of issues and actions." },
    },
    {
      q: { zh: "你们和 IT / 数据供应商是什么关系？", en: "Are you tied to any IT or data vendors?" },
      a: { zh: "完全独立、无返点绑定。推荐只看适配度，如果自建更划算我们会直接告诉你。", en: "Fully independent, zero kickbacks. We recommend only what fits — and we'll say so if building in-house is cheaper." },
    },
    {
      q: { zh: "首次会议需要准备什么？", en: "What should we prepare for the first meeting?" },
      a: { zh: "带上核心经营数据和最痛的一个问题就够。首次诊断会议免费，48 小时内给出初步评估。", en: "Just your core numbers and your most painful problem. The first session is free, with a written assessment in 48 hours." },
    },
  ];
  const [open, setOpen] = useState(0);
  return (
    <section className="px-6 py-16 sm:px-10" style={{ background: "var(--sk-panel)" }}>
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <SectionHead
            lang={lang}
            eyebrow={{ zh: "常见问题", en: "FAQ" }}
            title={{ zh: "合作之前，先说清楚的事", en: "Things to know before we start" }}
            center
          />
        </Reveal>
        <div className="mt-8 space-y-3">
          {qa.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={item.q.en} delay={i * 80}>
                <div className="overflow-hidden rounded-2xl border transition" style={{ borderColor: isOpen ? "var(--sk-acc)" : "var(--sk-line)", background: "var(--sk-bg)" }}>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="text-sm font-semibold sm:text-[15px]" style={{ color: "var(--sk-fg)" }}>{L(item.q, lang)}</span>
                    <span
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white transition-transform duration-300"
                      style={{ background: "var(--sk-acc)", transform: isOpen ? "rotate(45deg)" : "none" }}
                    >
                      +
                    </span>
                  </button>
                  {isOpen && (
                    <p className="px-5 pb-5 text-[13px] leading-relaxed" style={{ color: "var(--sk-muted)", animation: "skx-fadeup .35s ease both" }}>
                      {L(item.a, lang)}
                    </p>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- 大字引言 ---------------- */
function QuoteBand({ lang }: { lang: Lang }) {
  return (
    <section className="border-y px-6 py-16 text-center sm:px-10" style={{ borderColor: "var(--sk-line)", background: "var(--sk-bg)" }}>
      <Reveal>
        <div className="mx-auto max-w-3xl">
          <div className="text-5xl leading-none" style={{ color: "var(--sk-acc)", ...SERIF }} aria-hidden>
            “
          </div>
          <p className="mt-3 text-lg leading-relaxed sm:text-2xl" style={{ color: "var(--sk-fg)", ...SERIF }}>
            {L(
              { zh: "Apex 把我们 18 个月的上市计划压缩到了 11 个月，每一个里程碑都有据可查。", en: "Apex compressed our 18-month IPO plan into 11 — every milestone tracked and accounted for." },
              lang
            )}
          </p>
          <div className="mt-5 text-xs" style={{ color: "var(--sk-muted)" }}>
            —— {L({ zh: "某智能制造企业 CFO", en: "CFO, smart-manufacturing client" }, lang)}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ---------------- CTA ---------------- */
function CtaBand({ lang }: { lang: Lang }) {
  return (
    <section id="apex-cta" className="relative overflow-hidden px-6 py-16 text-center sm:px-10" style={{ background: "linear-gradient(135deg,#1A2440 0%,#2C3E66 55%,#B98A2F 130%)" }}>
      <Reveal>
        <h2 className="text-2xl font-bold text-white sm:text-3xl" style={SERIF}>
          {L({ zh: "下一次董事会，让数据替你发言", en: "Let data speak at your next board meeting" }, lang)}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/75">
          {L({ zh: "首次诊断会议免费，48 小时内出具初步评估。", en: "First diagnostic session is free; preliminary assessment within 48 hours." }, lang)}
        </p>
        <button
          type="button"
          className="mt-8 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-zinc-900 shadow-lg transition hover:scale-[1.03] active:scale-[0.98]"
        >
          {L({ zh: "预约顾问", en: "Book a consultant" }, lang)}
        </button>
      </Reveal>
    </section>
  );
}

/* ---------------- 页脚 ---------------- */
function Footer({ lang }: { lang: Lang }) {
  return (
    <footer
      className="flex flex-col items-center justify-between gap-2 border-t px-6 py-6 text-xs sm:flex-row sm:px-10"
      style={{ borderColor: "var(--sk-line)", background: "var(--sk-bg)", color: "var(--sk-muted)" }}
    >
      <span>© 2026 Apex Consulting · Template demo</span>
      <span>{L({ zh: "演示内容为虚构品牌，仅用于展示模板能力。", en: "Fictional brand for template demo purposes." }, lang)}</span>
    </footer>
  );
}

/* ---------------- 通用小节标题 ---------------- */
function SectionHead({
  lang,
  eyebrow,
  title,
  center,
  dark,
}: {
  lang: Lang;
  eyebrow: Bi;
  title: Bi;
  center?: boolean;
  dark?: boolean;
}) {
  return (
    <div className={center ? "text-center" : ""}>
      <div className="text-[11px] font-bold tracking-[0.22em]" style={{ color: "var(--sk-acc)" }}>
        {L(eyebrow, lang)}
      </div>
      <h2
        className="mt-3 text-2xl font-semibold leading-snug sm:text-[1.7rem]"
        style={{ color: dark ? "#fff" : "var(--sk-fg)", ...SERIF }}
      >
        {L(title, lang)}
      </h2>
    </div>
  );
}

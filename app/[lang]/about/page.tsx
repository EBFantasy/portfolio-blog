import type { Metadata } from "next";
import ContactActions from "@/components/ContactActions";
import { Reveal } from "@/components/showcase/reveal";
import { CONTACT } from "@/lib/contact";
import { getDict, isValidLocale, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: raw } = await params;
  const lang = (isValidLocale(raw) ? raw : "zh") as Locale;
  const dict = getDict(lang);
  return {
    title: dict.about.title,
    description: dict.about.desc,
    alternates: { canonical: `/${lang}/about`, languages: { zh: "/zh/about", en: "/en/about" } },
  };
}

const content = {
  zh: {
    eyebrow: "ABOUT / EBFANTASY",
    role: "软件工程师 · TypeScript 背景",
    bio: [
      "我是 EBFantasy，一名以 TypeScript 为主要工具的软件工程师，当前聚焦 Web 前端、微信小程序交互与自动化原型。这个站点既是作品集，也是我持续验证工程方法的实验场。",
      "我更在意“能不能实际操作、边界有没有说清楚”，而不是堆叠技术名词。六个交互 Demo 会明确区分内置数据与真实集成，六套概念 UI 则用于探索不同行业的视觉表达。",
    ],
    principlesTitle: "我在意的三件事",
    principles: [
      { title: "先让流程跑通", desc: "把复杂需求拆成最小可验证版本，优先验证核心操作和异常状态。" },
      { title: "把边界写出来", desc: "演示数据、真实集成、待确认能力分别标注，不用夸大文案制造信任。" },
      { title: "交付能被接手", desc: "重视组件结构、双语同步、构建验证与后续维护所需的说明。" },
    ],
    groups: [
      { name: "前端实现", items: ["TypeScript", "React / Next.js", "Tailwind CSS", "SVG 与 CSS 动效"] },
      { name: "交互与数据", items: ["复杂状态梳理", "微信小程序交互", "REST API 对接基础", "CSV 与数据可视化"] },
      { name: "工程实践", items: ["Git 工作流", "响应式与可访问性", "SEO 基础", "AI 辅助开发与人工复核"] },
    ],
    github: "GitHub / EBFantasy",
  },
  en: {
    eyebrow: "ABOUT / EBFANTASY",
    role: "Software engineer · TypeScript background",
    bio: [
      "I'm EBFantasy, a software engineer working primarily with TypeScript on web interfaces, WeChat mini program interactions and automation prototypes. This site is both a portfolio and an ongoing engineering test bed.",
      "I care more about whether people can actually test a flow and understand its boundaries than about stacking technology buzzwords. The six demos separate mock data from real integrations, while six concept UIs explore visual directions across industries.",
    ],
    principlesTitle: "Three things I optimize for",
    principles: [
      { title: "Make the flow work first", desc: "Break complex requirements into a testable version and validate core actions and edge states early." },
      { title: "State the boundaries", desc: "Label sample data, real integrations and undecided capabilities separately instead of overselling." },
      { title: "Deliver something maintainable", desc: "Care about component structure, bilingual parity, build verification and useful handover notes." },
    ],
    groups: [
      { name: "Front-end", items: ["TypeScript", "React / Next.js", "Tailwind CSS", "SVG & CSS motion"] },
      { name: "Interaction & data", items: ["Complex state modeling", "Mini program interactions", "REST API fundamentals", "CSV & data visualization"] },
      { name: "Engineering", items: ["Git workflow", "Responsive & accessible UI", "SEO fundamentals", "AI-assisted work with review"] },
    ],
    github: "GitHub / EBFantasy",
  },
} as const;

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params;
  const lang = (isValidLocale(raw) ? raw : "zh") as Locale;
  const dict = getDict(lang);
  const c = content[lang];

  return (
    <div className="py-12 sm:py-16">
      <section className="grid gap-10 lg:grid-cols-[1fr_320px] lg:items-start">
        <Reveal>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">{c.eyebrow}</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tighter text-zinc-950 sm:text-5xl dark:text-zinc-50">{dict.about.title}</h1>
          <p className="mt-3 text-sm font-medium text-emerald-800 dark:text-emerald-300">{c.role}</p>
          <div className="mt-7 max-w-[68ch] space-y-5 text-base leading-8 text-zinc-600 dark:text-zinc-300">
            {c.bio.map((para) => <p key={para}>{para}</p>)}
          </div>
        </Reveal>
        <Reveal dir="right" delay={120}>
          <aside className="rounded-[1.75rem] border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900 font-mono text-xl font-semibold text-emerald-300 dark:bg-zinc-100 dark:text-emerald-800">EB</div>
            <p className="mt-5 text-lg font-semibold text-zinc-900 dark:text-zinc-50">EBFantasy</p>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{dict.siteTagline}</p>
            <a href={CONTACT.github} target="_blank" rel="external noreferrer" className="mt-6 flex items-center justify-between rounded-xl border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-700 transition hover:border-emerald-400 hover:text-emerald-700 dark:border-zinc-700 dark:text-zinc-200 dark:hover:text-emerald-300">
              {c.github}<span aria-hidden>↗</span>
            </a>
          </aside>
        </Reveal>
      </section>

      <section className="mt-16">
        <Reveal>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">{c.principlesTitle}</h2>
        </Reveal>
        <div className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-200 md:grid-cols-3 dark:border-zinc-800 dark:bg-zinc-800">
          {c.principles.map((item, index) => (
            <article key={item.title} className="bg-white p-6 dark:bg-zinc-950">
              <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400">0{index + 1}</span>
              <h3 className="mt-4 font-semibold text-zinc-900 dark:text-zinc-50">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <Reveal>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">TOOLKIT / PRACTICE</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">{dict.about.skills}</h2>
        </Reveal>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {c.groups.map((group) => (
            <div key={group.name} className="border-t-2 border-emerald-400/70 pt-5">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{group.name}</h3>
              <ul className="mt-4 space-y-2.5">
                {group.items.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-zinc-500 dark:text-zinc-400">
                    <span className="h-1 w-1 rounded-full bg-emerald-500" />{item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <Reveal>
        <section id="contact" className="mt-16 grid scroll-mt-24 gap-8 rounded-[2rem] border border-emerald-200 bg-emerald-50/70 p-6 sm:p-9 lg:grid-cols-[1fr_400px] dark:border-emerald-900 dark:bg-emerald-950/20">
          <div className="flex flex-col justify-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">CONTACT / SAY HELLO</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">{dict.about.contact}</h2>
            <p className="mt-3 max-w-[55ch] text-sm leading-7 text-zinc-600 dark:text-zinc-400">{dict.about.contactDesc}</p>
          </div>
          <ContactActions lang={lang} />
        </section>
      </Reveal>
    </div>
  );
}

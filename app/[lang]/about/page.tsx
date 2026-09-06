import { Reveal } from "@/components/showcase/reveal";
import { getDict, isValidLocale, type Locale } from "@/lib/i18n";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: raw } = await params;
  const lang = (isValidLocale(raw) ? raw : "zh") as Locale;
  const dict = getDict(lang);

  const skills = {
    zh: {
      groups: [
        { name: "前端", items: ["TypeScript", "React / Next.js", "Tailwind CSS", "动效 (Framer Motion / GSAP)"] },
        { name: "小程序与后端", items: ["微信小程序", "Node.js", "REST API 设计", "数据库基础"] },
        { name: "工程能力", items: ["Git 工作流", "性能优化", "SEO 基础", "AI 辅助开发"] },
      ],
      bio: [
        "软件工程师，长期从事 Web 前端与微信小程序开发。习惯把复杂需求拆成能跑的最小版本，再逐步打磨成完整产品——这个站点本身就是用这套方法搭起来的。",
        "擅长将设计稿高保真还原为可交互页面，重视动效细节、加载性能与移动端适配。接单范围包括企业官网 / 营销页、微信小程序、管理后台前端等。",
      ],
    },
    en: {
      groups: [
        { name: "Front-end", items: ["TypeScript", "React / Next.js", "Tailwind CSS", "Animation (Framer Motion / GSAP)"] },
        { name: "Mini Program & Back-end", items: ["WeChat Mini Programs", "Node.js", "REST API Design", "Database Fundamentals"] },
        { name: "Engineering", items: ["Git Workflow", "Performance Tuning", "SEO Basics", "AI-assisted Development"] },
      ],
      bio: [
        "Software engineer focused on web front-end and WeChat mini program development. I break complex requirements into a minimal working version, then polish it into a full product — this site itself was built exactly that way.",
        "Experienced at turning design mockups into pixel-accurate interactive pages, with attention to motion details, loading performance and mobile adaptation. Available for corporate websites / landing pages, WeChat mini programs and admin dashboard front-ends.",
      ],
    },
  }[lang];

  return (
    <div className="py-14">
      <Reveal>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {dict.about.title}
        </h1>
        <p className="mt-3 text-zinc-500 dark:text-zinc-400">{dict.siteTagline}</p>
      </Reveal>

      <Reveal delay={120}>
        <div className="mt-10 max-w-2xl space-y-4 leading-relaxed text-zinc-600 dark:text-zinc-300">
          {skills.bio.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </Reveal>

      <Reveal dir="left" delay={100}>
        <h2 className="mt-12 text-lg font-medium text-zinc-900 dark:text-zinc-50">{dict.about.skills}</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {skills.groups.map((g) => (
            <div key={g.name} className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{g.name}</h3>
              <ul className="mt-3 space-y-1.5">
                {g.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                    <span className="h-1 w-1 rounded-full bg-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal dir="right" delay={100}>
        <h2 className="mt-12 text-lg font-medium text-zinc-900 dark:text-zinc-50">{dict.about.contact}</h2>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{dict.about.contactDesc}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm dark:border-zinc-800 dark:bg-zinc-900">
            <span className="text-zinc-400">{dict.about.wechat}</span>
            <span className="ml-2 font-medium text-zinc-700 dark:text-zinc-200">EBFantasy</span>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm dark:border-zinc-800 dark:bg-zinc-900">
            <span className="text-zinc-400">{dict.about.email}</span>
            <span className="ml-2 font-medium text-zinc-700 dark:text-zinc-200">your@email.com</span>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

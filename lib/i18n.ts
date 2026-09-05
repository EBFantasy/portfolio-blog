import "server-only";

export const locales = ["zh", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "zh";

export function isValidLocale(v: string): v is Locale {
  return (locales as readonly string[]).includes(v);
}

const zh = {
  siteName: "EBFantasy",
  siteTagline: "软件工程师 · Web 与小程序开发",
  nav: {
    home: "首页",
    work: "作品",
    blog: "博客",
    about: "关于",
    contact: "联系",
  },
  home: {
    heroBadge: "个人作品集 · 持续更新中",
    heroTitle: "把想法做成能跑的产品",
    heroDesc: "软件工程师，专注于 Web 前端与微信小程序开发。这里收录我的项目 Demo、技术文章与功能演示——每一个都可以亲手体验。",
    viewWork: "查看作品",
    readBlog: "阅读博客",
    sectionsTitle: "站点板块",
    featured: "精选作品",
    latestPosts: "最新文章",
    comingSoon: "内容筹备中，敬请期待",
    sections: [
      {
        title: "网页开发 Demo",
        desc: "带完整动效的企业官网、营销页预览，可直接在浏览器中交互体验。",
        tag: "Web",
      },
      {
        title: "微信小程序预览",
        desc: "核心交互页面的高保真预览，支持在线演示与远程真机体验。",
        tag: "Mini Program",
      },
      {
        title: "功能演示",
        desc: "支付流程、票务选座、订阅计划等功能模块的交互演示。",
        tag: "Playground",
      },
    ] as { title: string; desc: string; tag: string }[],
  },
  work: {
    title: "作品集",
    desc: "网页 Demo、小程序预览与功能演示。案例详情页附完整实现拆解。",
    empty: "第一批作品正在制作中，很快上线。",
    catAll: "全部",
    featuredWork: "精选作品",
    viewAllWork: "查看全部作品",
    detail: {
      backToWork: "返回作品列表",
      features: "核心特性",
      techStack: "技术栈",
      demo: "在线预览",
      source: "查看源码",
      demoNote: "演示站部分功能为模拟数据，交互流程完整可玩。",
      year: "年份",
      category: "类型",
      notFound: "作品不存在或尚未翻译为当前语言。",
      nextProject: "下一个作品",
    },
  },
  blog: {
    title: "博客",
    desc: "技术拆解、开发记录与踩坑笔记。",
    all: "全部",
    readMore: "阅读全文",
    backToList: "返回列表",
    notFound: "文章不存在或尚未翻译为当前语言。",
    publishedAt: "发布于",
  },
  about: {
    title: "关于我",
    desc: "软件工程师的背景、技能与联系方式。",
    skills: "技术栈",
    contact: "联系方式",
    contactDesc: "有项目想合作，或想了解更多细节，欢迎联系。",
    wechat: "微信",
    email: "邮箱",
  },
  footer: {
    rights: "保留所有权利",
    builtWith: "基于 Next.js 构建",
  },
  themeToggle: { toDark: "切换到深色模式", toLight: "切换到浅色模式" },
  langToggle: { label: "EN" },
};

const en: typeof zh = {
  siteName: "EBFantasy",
  siteTagline: "Software Engineer · Web & Mini Program Development",
  nav: {
    home: "Home",
    work: "Work",
    blog: "Blog",
    about: "About",
    contact: "Contact",
  },
  home: {
    heroBadge: "Personal Portfolio · In Progress",
    heroTitle: "Turning ideas into working products",
    heroDesc: "Software engineer focused on web front-end and WeChat mini program development. This site collects my project demos, technical writing, and interactive feature showcases.",
    viewWork: "View Work",
    readBlog: "Read Blog",
    sectionsTitle: "Explore",
    featured: "Featured Work",
    latestPosts: "Latest Posts",
    comingSoon: "Content in preparation, coming soon",
    sections: [
      {
        title: "Web Demos",
        desc: "Marketing sites and corporate homepages with rich animations, fully interactive in your browser.",
        tag: "Web",
      },
      {
        title: "Mini Program Previews",
        desc: "High-fidelity previews of core screens and flows, with live demo and remote device preview.",
        tag: "Mini Program",
      },
      {
        title: "Feature Playground",
        desc: "Interactive demos of payments, seat booking, subscription plans and more.",
        tag: "Playground",
      },
    ],
  },
  work: {
    title: "Work",
    desc: "Web demos, mini program previews and feature playgrounds. Each case comes with a full implementation breakdown.",
    empty: "The first batch of projects is in production, coming soon.",
    catAll: "All",
    featuredWork: "Featured Work",
    viewAllWork: "View all work",
    detail: {
      backToWork: "Back to work",
      features: "Key Features",
      techStack: "Tech Stack",
      demo: "Live Demo",
      source: "Source Code",
      demoNote: "Some demo features run on mock data; the full interaction flow is playable.",
      year: "Year",
      category: "Type",
      notFound: "Project not found or not yet translated to this language.",
      nextProject: "Next project",
    },
  },
  blog: {
    title: "Blog",
    desc: "Technical breakdowns, dev logs and lessons learned.",
    all: "All",
    readMore: "Read more",
    backToList: "Back to list",
    notFound: "Post not found or not yet translated to this language.",
    publishedAt: "Published",
  },
  about: {
    title: "About",
    desc: "Background, skills and contact of a software engineer.",
    skills: "Skills",
    contact: "Contact",
    contactDesc: "Have a project in mind or want to learn more? Get in touch.",
    wechat: "WeChat",
    email: "Email",
  },
  footer: {
    rights: "All rights reserved",
    builtWith: "Built with Next.js",
  },
  themeToggle: { toDark: "Switch to dark mode", toLight: "Switch to light mode" },
  langToggle: { label: "中文" },
};

const dict = { zh, en };

export type Dict = typeof zh;

export function getDict(lang: Locale): Dict {
  return dict[lang];
}

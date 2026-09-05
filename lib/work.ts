import "server-only";

import type { Project } from "@/lib/work-shared";

export const projects: Project[] = [
  {
    slug: "aurora-commerce",
    category: "web",
    preview: "browser",
    accent: "violet",
    featured: true,
    year: "2026",
    tags: ["Next.js", "GSAP", "Tailwind CSS", "动效设计"],
    title: {
      zh: "极光 · 电商品牌官网",
      en: "Aurora · E-commerce Brand Site",
    },
    summary: {
      zh: "带完整滚动动效与视差层的品牌营销官网，首屏加载即呈现产品叙事。",
      en: "A brand marketing site with full scroll-driven animations and parallax layers, telling the product story from the first screen.",
    },
    description: [
      {
        zh: "这是给一家家居生活品牌做的官网 Demo。整站以「光」为视觉主线：首屏用 Canvas 粒子模拟极光流动，向下滚动时产品卡片按时间线依次浮入，配合 sticky 分屏叙事把卖点逐段展开。",
        en: "A homepage demo built for a home-living brand. The visual theme is \"light\": the hero uses a Canvas particle field simulating an aurora, and as you scroll, product cards float in on a timeline while sticky split-screens expand each selling point.",
      },
      {
        zh: "技术上采用 Next.js App Router 服务端渲染保证首屏速度，动效层用 GSAP ScrollTrigger 编排，所有动画尊重系统 prefers-reduced-motion 设置；图片走 next/image 懒加载 + AVIF 格式，Lighthouse 移动端性能 90+。",
        en: "Technically it uses the Next.js App Router for SSR-first performance, GSAP ScrollTrigger for choreography, and every animation respects prefers-reduced-motion. Images go through next/image lazy loading in AVIF, scoring 90+ on mobile Lighthouse.",
      },
    ],
    features: [
      { zh: "Canvas 粒子极光首屏，随鼠标视差偏移", en: "Canvas aurora hero with mouse parallax" },
      { zh: "滚动时间线叙事，产品逐段浮入", en: "Scroll timeline with staggered product reveals" },
      { zh: "明暗双主题，跟随系统自动切换", en: "Light/dark themes that follow the system" },
      { zh: "移动端 Lighthouse 性能 90+", en: "90+ mobile Lighthouse performance" },
    ],
  },
  {
    slug: "teatime-ordering",
    category: "miniprogram",
    preview: "phone",
    accent: "amber",
    featured: true,
    year: "2026",
    tags: ["微信小程序", "TDesign", "云开发", "订阅消息"],
    title: {
      zh: "茶时 · 点单小程序",
      en: "Teatime · Ordering Mini Program",
    },
    summary: {
      zh: "茶饮门店点单 + 取餐码核销流程，含规格选择、购物车与订阅消息提醒。",
      en: "A tea-shop ordering flow with pickup code verification: spec pickers, cart and subscription-message reminders.",
    },
    description: [
      {
        zh: "面向中小茶饮门店的完整点单方案：首页按温度/甜度/加料弹出规格选择浮层，规格组合实时计算价格；下单后生成取餐码，出餐进度通过微信订阅消息推送到用户。",
        en: "A complete ordering solution for small tea shops: the home screen pops a spec sheet for temperature/sweetness/toppings with live price calculation; after ordering, a pickup code is generated and status updates arrive via WeChat subscription messages.",
      },
      {
        zh: "后端使用微信云开发（云函数 + 云数据库），免运维且按量计费，适合个体门店成本结构；菜单数据支持商家后台直接增删，改动即时生效无需发版。",
        en: "The backend uses WeChat CloudBase (cloud functions + cloud database): zero ops, pay-as-you-go, and a cost profile that fits small merchants. Menu data can be edited from the merchant console and takes effect instantly, no release needed.",
      },
    ],
    features: [
      { zh: "规格浮层实时计价，组合无死角", en: "Live-priced spec sheet with full combinations" },
      { zh: "取餐码 + 出餐进度订阅消息提醒", en: "Pickup code + subscription-message updates" },
      { zh: "云开发免运维，按量计费", en: "CloudBase: zero ops, pay-as-you-go" },
      { zh: "商家后台改菜单即时生效", en: "Instant menu updates, no app release" },
    ],
  },
  {
    slug: "cinema-booking",
    category: "playground",
    preview: "browser",
    accent: "rose",
    year: "2026",
    tags: ["React", "状态管理", "交互设计"],
    title: {
      zh: "星幕 · 电影院在线选座",
      en: "StarScreen · Cinema Seat Booking",
    },
    summary: {
      zh: "电影院选座交互演示：座位图缩放、连座检测、票价分区与订单结算。",
      en: "A cinema seat-picking demo: zoomable seat map, consecutive-seat detection, price zones and checkout.",
    },
    description: [
      {
        zh: "这是一个交互功能演示：完整实现了影院选座的核心状态机——可售/已售/已锁/选中四种状态流转，选座时自动检测连座（情侣座推荐），超额选择自动提示。",
        en: "An interactive feature demo implementing the full cinema-booking state machine: available / sold / locked / selected transitions, automatic consecutive-seat detection (couple-seat suggestions), and over-limit guards.",
      },
      {
        zh: "座位图支持双指缩放与拖拽（移动端友好），票价按区域（VIP/普通/后排）分层计算，底部结算栏实时汇总数量与总价——所有状态都在客户端本地流转，可直接作为功能原型给到业务方评审。",
        en: "The seat map supports pinch-zoom and drag (mobile friendly), prices are tiered by zone (VIP / standard / rear), and the checkout bar aggregates count and total in real time. All state lives client-side, ready to be reviewed as a functional prototype.",
      },
    ],
    features: [
      { zh: "四种座位状态机完整流转", en: "Full 4-state seat machine" },
      { zh: "连座自动检测与推荐", en: "Consecutive-seat auto detection" },
      { zh: "分区票价实时结算", en: "Real-time zone-based checkout" },
      { zh: "触屏缩放拖拽，移动端友好", en: "Pinch-zoom & drag, mobile friendly" },
    ],
  },
  {
    slug: "saas-pricing",
    category: "playground",
    preview: "browser",
    accent: "sky",
    year: "2026",
    tags: ["React", "Stripe", "订阅计费"],
    title: {
      zh: "订阅付费计划模块",
      en: "Subscription Pricing Module",
    },
    summary: {
      zh: "SaaS 定价页演示：月付/年付切换、功能对比矩阵与 Stripe 结账集成。",
      en: "A SaaS pricing page demo: monthly/yearly toggle, feature matrix and Stripe checkout integration.",
    },
    description: [
      {
        zh: "演示一个 SaaS 产品的付费计划页：Free / Pro / Team 三档，月付年付一键切换（年付显示折扣角标），功能对比矩阵随滚动吸顶，最贵的 Team 档做了视觉强调引导升级。",
        en: "A pricing page demo for a SaaS product: Free / Pro / Team tiers, a one-tap monthly/yearly toggle (yearly shows a discount badge), a feature matrix that sticks while scrolling, and visual emphasis on the Team tier to guide upgrades.",
      },
      {
        zh: "结账链路接入 Stripe Checkout（测试模式），点击升级按钮跳转托管支付页，支付回调后写回用户订阅状态——演示站不保存任何真实支付信息，仅展示完整前后端联调流程。",
        en: "Checkout hooks into Stripe Checkout (test mode): the upgrade button opens the hosted payment page, and the webhook writes the subscription state back. This demo stores no real payment data — it showcases the complete front/back-end integration flow.",
      },
    ],
    features: [
      { zh: "月/年付切换，年付折扣角标", en: "Monthly/yearly toggle with discount badge" },
      { zh: "功能对比矩阵滚动吸顶", en: "Sticky scrolling feature matrix" },
      { zh: "Stripe Checkout 托管支付页", en: "Stripe Checkout hosted page" },
      { zh: "支付回调写回订阅状态", en: "Webhook-driven subscription state" },
    ],
  },
];

export function getAllProjects(): Project[] {
  return projects;
}

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}

export function isValidProjectSlug(v: string): boolean {
  return projects.some((p) => p.slug === v);
}

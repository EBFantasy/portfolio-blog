import "server-only";

import type { Project } from "@/lib/work-shared";

/**
 * 作品区可见列表：自动化×3 + 功能演示×2 + 小程序×1，共 6 个。
 * 极光电商官网已随网页 Demo 方向一并移除，不再出现在作品卡片里；
 * 电影选座与订阅计费的内容页（详情页）保留且可从各自 playground 的返回按钮进入。
 */
export const projects: Project[] = [
  {
    slug: "crawler-scheduler",
    category: "automation",
    preview: "browser",
    accent: "rose",
    featured: true,
    year: "2026",
    tags: ["Python", "BFS 调度", "限流应对", "robots 协议"],
    title: {
      zh: "爬虫调度可视化系统",
      en: "Crawler Scheduler Visualizer",
    },
    summary: {
      zh: "广度优先抓取全流程可视化：并发控制、速率限制、链接去重与 robots 协议遵守。",
      en: "A visual walkthrough of BFS crawling: concurrency, rate limiting, link dedup and robots.txt compliance.",
    },
    description: [
      {
        zh: "对一个 24 页的模拟站点图执行广度优先抓取：请求队列逐个出队，抓取中的页面高亮脉冲，发现的链接自动入队，重复链接即时去重——整个调度过程逐帧可见，适合向非技术客户解释「爬虫到底在做什么」。",
        en: "A breadth-first crawl over a 24-page simulated site graph: the request queue dequeues page by page, in-flight pages pulse, discovered links enqueue automatically and duplicates are skipped on sight — the whole scheduling loop visible frame by frame, ideal for explaining crawling to non-technical clients.",
      },
      {
        zh: "并发数与抓取间隔实时可调，调得太激进会触发模拟 429 限流（页面变红冷却后重试），演示生产级采集器的速率礼仪；robots.txt 开关展示协议遵守：关闭后受限页面会被标记为违规抓取并计数。",
        en: "Concurrency and delay are live-tunable — set them too aggressively and a simulated 429 rate limit kicks in (pages turn red, cool down and retry), demonstrating production-grade rate etiquette. A robots.txt toggle shows compliance: switch it off and restricted pages get flagged and counted as violations.",
      },
    ],
    features: [
      { zh: "BFS 队列逐帧可视化，去重即时跳过", en: "Frame-by-frame BFS queue with instant dedup" },
      { zh: "并发与速率实时可调，含 429 限流模拟", en: "Live concurrency/delay with simulated 429s" },
      { zh: "robots.txt 协议开关与违规计数", en: "robots.txt toggle with violation counter" },
      { zh: "抓取日志与统计面板实时滚动", en: "Live fetch log and stats panel" },
    ],
    links: { demo: "/playground/crawler" },
  },
  {
    slug: "price-monitor",
    category: "automation",
    preview: "browser",
    accent: "amber",
    year: "2026",
    tags: ["定时任务", "数据可视化", "阈值告警", "SVG 图表"],
    title: {
      zh: "电商价格监控仪表盘",
      en: "E-commerce Price Monitor",
    },
    summary: {
      zh: "定时采集价格流并实时绘图，跌破阈值即刻告警——比价与监控类需求的完整体验。",
      en: "Scheduled price streams charted in realtime with threshold alerts — the full front end of a price-tracking need.",
    },
    description: [
      {
        zh: "面向比价与库存监控场景：模拟采集器按固定间隔回报价格，仪表盘实时延伸折线、统计区间最低价与涨跌幅，价格跌破设定阈值的那一刻弹出告警——正是商家「竞品降价第一时间通知我」想要的完整体验。",
        en: "Built for price-tracking scenarios: a simulated collector reports prices on a fixed interval, the dashboard extends the line chart live and tracks the window low and change rate, and the moment price crosses your threshold an alert fires — exactly the \"ping me when competitors drop prices\" experience merchants ask for.",
      },
      {
        zh: "三个商品各有独立波动模型（稳定/震荡/活跃），支持一键模拟促销跳水来测试告警链路；采集日志与图表同屏对照，向客户演示「数据从哪来、到哪去」一目了然。",
        en: "Three products ship with independent volatility models (stable / choppy / active), a one-tap promo-crash button tests the alert path, and the fetch log sits beside the chart so \"where data comes from and where it goes\" is obvious at a glance.",
      },
    ],
    features: [
      { zh: "定时采集价格流，折线实时延伸", en: "Scheduled price streams, live line chart" },
      { zh: "阈值告警即时触发并可测试", en: "Instant threshold alerts, testable on demand" },
      { zh: "三种波动模型一键切换", en: "Three volatility models, one tap away" },
      { zh: "采集日志与图表同屏对照", en: "Fetch log side-by-side with the chart" },
    ],
    links: { demo: "/playground/monitor" },
  },
  {
    slug: "report-pipeline",
    category: "automation",
    preview: "browser",
    accent: "sky",
    year: "2026",
    tags: ["办公自动化", "数据清洗", "Pandas 思想", "CSV 导出"],
    title: {
      zh: "多表报表自动化流水线",
      en: "Multi-Sheet Report Pipeline",
    },
    summary: {
      zh: "三张区域表自动校验、清洗、去重、合并并汇总成报表，全程可视化，产出真实可下载的 CSV。",
      en: "Three regional sheets validated, cleaned, deduped, merged and summarized on screen — producing a real, downloadable CSV.",
    },
    description: [
      {
        zh: "还原最常见办公自动化需求：把多份区域明细表合并成总表。流水线五阶段（校验→清洗→去重→合并→汇总）逐段推进，坏行剔除、格式修复、重复剔除的数量实时跳动，处理逻辑对非技术同事完全透明。",
        en: "The most requested office automation job, reproduced: merging regional detail sheets into one master. Five pipeline stages (validate → clean → dedupe → merge → summarize) advance one by one while rejected, fixed and deduped counters tick live — the logic is fully transparent to non-technical colleagues.",
      },
      {
        zh: "跑完后生成按大区汇总的报表，并可一键下载真实 CSV 文件（浏览器端直接生成）——不是截图，是可以立刻拿去用的产物。",
        en: "When the run finishes, a per-region summary report is generated and downloadable as a real CSV file, produced right in the browser — not a screenshot, an artifact you can use immediately.",
      },
    ],
    features: [
      { zh: "五阶段流水线逐段推进", en: "Five-stage pipeline, stage by stage" },
      { zh: "坏行剔除与修复计数实时跳动", en: "Live rejected/fixed/deduped counters" },
      { zh: "按大区自动汇总报表", en: "Automatic per-region summary" },
      { zh: "一键下载真实 CSV 文件", en: "One-click real CSV download" },
    ],
    links: { demo: "/playground/pipeline" },
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
    links: { demo: "/playground/teatime" },
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
    links: { demo: "/playground/cinema" },
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
    links: { demo: "/playground/pricing" },
  },
]

/**
 * 已完成但被自动化方向替换的作品：不出现在作品卡片列表，
 * 但内容页（详情页）保留且可从各自 playground 的返回按钮进入。
 */


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

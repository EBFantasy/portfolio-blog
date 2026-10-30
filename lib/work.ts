import "server-only";

import type { Project } from "@/lib/work-shared";

/** 六个可在浏览器中验证的前端交互原型；不冒充真实客户或生产集成案例。 */
export const projects: Project[] = [
  {
    slug: "crawler-scheduler",
    category: "automation",
    preview: "browser",
    accent: "rose",
    featured: true,
    year: "2026",
    tags: ["TypeScript", "BFS 状态机", "异步调度", "robots 模拟"],
    title: { zh: "爬虫调度可视化系统", en: "Crawler Scheduler Visualizer" },
    summary: {
      zh: "在 24 页模拟站点图中演示 BFS 队列、并发、延迟、去重、429 与 robots 规则。",
      en: "A 24-page simulated site graph for exploring BFS queues, concurrency, delays, dedup, 429s and robots rules.",
    },
    description: [
      {
        zh: "这是一个纯前端调度实验，不访问真实网站。请求队列、在途任务、发现链接与重复过滤都会同步呈现在站点图、日志和统计面板中，用来把抽象的爬虫调度过程变成可以操作的视觉流程。",
        en: "A front-end scheduling experiment that never visits real websites. The queue, in-flight work, discovered links and duplicate filtering stay synchronized across the graph, log and statistics panel.",
      },
      {
        zh: "并发与抓取间隔可以调整，过于激进的配置会触发模拟 429；robots 开关用于展示规则遵守与违规计数。暂停、继续和重置共享同一套任务清理逻辑，旧回调不会污染新一轮状态。",
        en: "Concurrency and delay are adjustable, with simulated 429 responses for aggressive settings. The robots toggle demonstrates compliance and violations. Pause, resume and reset share task-cleanup logic so stale callbacks cannot contaminate a new run.",
      },
    ],
    features: [
      { zh: "BFS 队列与站点图同步可视化", en: "Synchronized BFS queue and site graph" },
      { zh: "可调并发、延迟与模拟 429", en: "Adjustable concurrency, delay and simulated 429s" },
      { zh: "robots 规则开关与违规计数", en: "robots toggle with violation counting" },
      { zh: "可暂停、继续、重置的任务生命周期", en: "Pause, resume and reset across the task lifecycle" },
    ],
    links: { demo: "/playground/crawler" },
  },
  {
    slug: "price-monitor",
    category: "automation",
    preview: "browser",
    accent: "amber",
    year: "2026",
    tags: ["TypeScript", "SVG 图表", "阈值告警", "定时任务"],
    title: { zh: "电商价格监控仪表盘", en: "E-commerce Price Monitor" },
    summary: {
      zh: "用内置价格流演示定时轮询、实时折线、区间统计与阈值告警。",
      en: "Built-in price streams demonstrate scheduled polling, live charts, window statistics and threshold alerts.",
    },
    description: [
      {
        zh: "三个虚构商品分别使用稳定、震荡和活跃的价格波动模型。仪表盘按固定间隔追加数据，更新折线、最低价和涨跌幅；价格穿过设定阈值时，日志与告警区域同步反馈。",
        en: "Three fictional products use stable, choppy and active price models. The dashboard appends readings on an interval, updating the chart, window low and change rate, with synchronized logs and threshold alerts.",
      },
      {
        zh: "“模拟促销”与正常轮询调用同一套价格评估逻辑，因此即使暂停采集，也能立即验证告警条件。所有商品与价格均为演示数据，不接真实电商平台。",
        en: "The promo simulator and normal polling share the same evaluation path, so alert conditions can be tested immediately even while polling is paused. No real commerce platform is connected.",
      },
    ],
    features: [
      { zh: "三种独立价格波动模型", en: "Three independent price models" },
      { zh: "实时 SVG 折线与区间统计", en: "Live SVG chart and window statistics" },
      { zh: "轮询与促销共用阈值判断", en: "Shared threshold logic for polling and promos" },
      { zh: "可暂停的采集与同步日志", en: "Pausable polling with synchronized logs" },
    ],
    links: { demo: "/playground/monitor" },
  },
  {
    slug: "report-pipeline",
    category: "automation",
    preview: "browser",
    accent: "sky",
    year: "2026",
    tags: ["TypeScript", "CSV 转义", "流程可视化", "浏览器下载"],
    title: { zh: "多表报表自动化流水线", en: "Multi-Sheet Report Pipeline" },
    summary: {
      zh: "用内置示例数据演示校验、清洗、去重、合并、汇总，并下载正确转义的 CSV。",
      en: "Built-in sample data demonstrates validation, cleaning, dedup, merging and summaries, with correctly escaped CSV export.",
    },
    description: [
      {
        zh: "这个原型将办公报表处理拆成五个可见阶段。示例数据、坏行数量与汇总结果预先内置，页面重点展示流程编排、阶段反馈和结果呈现，而不是读取用户文件或执行真实 Pandas 任务。",
        en: "The prototype breaks office reporting into five visible stages. Sample rows, rejected counts and summaries are built in: the focus is orchestration, progress feedback and presentation, not reading user files or running real Pandas jobs.",
      },
      {
        zh: "完成后可以在浏览器生成并下载 quarterly-report.csv。导出逻辑对字段引号、千位逗号与换行进行 CSV 转义，并附带 UTF-8 BOM，避免常见表格软件打开后错列或乱码。",
        en: "The finished run produces quarterly-report.csv in the browser. Export handles quotes, thousands separators and line breaks correctly, with a UTF-8 BOM to reduce misaligned columns and encoding issues in spreadsheet apps.",
      },
    ],
    features: [
      { zh: "五阶段流程与明确示例数据边界", en: "Five stages with explicit sample-data boundaries" },
      { zh: "处理计数与阶段反馈", en: "Processing counters and stage feedback" },
      { zh: "按区域生成汇总表", en: "Per-region summary table" },
      { zh: "带 BOM 的正确 CSV 转义下载", en: "Correctly escaped CSV download with BOM" },
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
    tags: ["React", "小程序交互原型", "规格计价", "本地状态"],
    title: { zh: "茶时 · 点单交互原型", en: "Teatime · Ordering Prototype" },
    summary: {
      zh: "茶饮点单核心流程：温度、甜度、加料、实时计价、购物车与模拟出餐进度。",
      en: "A tea-ordering flow with temperature, sweetness, toppings, live pricing, cart and simulated kitchen progress.",
    },
    description: [
      {
        zh: "以移动端点单为场景的网页高保真原型。每杯饮品可独立选择规格和加料，购物车支持数量调整与清空，结算后生成模拟取餐号并自动推进出餐状态。",
        en: "A high-fidelity web prototype for mobile ordering. Each drink supports independent options and toppings, the cart handles quantity changes and clearing, and checkout creates a simulated pickup number with automatic kitchen progress.",
      },
      {
        zh: "当前实现完全在浏览器本地运行，用于评审核心交互和视觉方向；没有接入微信云开发、商家后台、真实支付或订阅消息。将这些能力写入正式项目前，需要另行确认平台与后端范围。",
        en: "The current implementation runs entirely in the browser for interaction and visual review. It does not integrate WeChat CloudBase, a merchant console, real payments or subscription messages; those require separate platform and backend scoping.",
      },
    ],
    features: [
      { zh: "规格组合与实时价格计算", en: "Option combinations with live pricing" },
      { zh: "购物车数量与合计管理", en: "Cart quantity and total management" },
      { zh: "模拟支付、取餐号与出餐状态", en: "Mock checkout, pickup number and kitchen states" },
      { zh: "移动端优先的点单界面", en: "Mobile-first ordering interface" },
    ],
    links: { demo: "/playground/teatime" },
  },
  {
    slug: "cinema-booking",
    category: "playground",
    preview: "browser",
    accent: "rose",
    featured: true,
    year: "2026",
    tags: ["React", "状态管理", "选座交互"],
    title: { zh: "星幕 · 电影院在线选座", en: "StarScreen · Cinema Seat Booking" },
    summary: {
      zh: "切换场次、选择 VIP 或标准座位、限制单笔数量，并完成模拟结算与出票。",
      en: "Switch sessions, select VIP or standard seats, enforce order limits and complete a mock checkout.",
    },
    description: [
      {
        zh: "座位图区分可售、已售、已购与当前选中状态，VIP 和标准区使用不同价格。用户可切换场次、反复选座与取消，结算栏同步汇总座位号、数量和总价。",
        en: "The seat map distinguishes available, sold, purchased and selected states, with separate VIP and standard pricing. Users can switch sessions, select and deselect seats, and watch the checkout summary update.",
      },
      {
        zh: "当前版本聚焦选座与模拟支付状态流转，不包含双指缩放、拖拽、连座推荐或独立锁定状态。支付与取票码均为演示，不会产生真实订单。",
        en: "This version focuses on seat selection and mock checkout. It does not include pinch zoom, dragging, adjacent-seat recommendations or a separate locked state. Payments and pickup codes are simulated.",
      },
    ],
    features: [
      { zh: "可售、已售、已购与选中状态", en: "Available, sold, purchased and selected states" },
      { zh: "VIP / 标准分区实时计价", en: "Live VIP and standard zone pricing" },
      { zh: "场次切换与单笔数量限制", en: "Session switching and per-order limits" },
      { zh: "模拟支付与本地已购记录", en: "Mock payment and local purchase state" },
    ],
    links: { demo: "/playground/cinema" },
  },
  {
    slug: "saas-pricing",
    category: "playground",
    preview: "browser",
    accent: "sky",
    year: "2026",
    tags: ["React", "订阅界面", "模拟结账"],
    title: { zh: "订阅付费计划模块", en: "Subscription Pricing Module" },
    summary: {
      zh: "月付 / 年付切换、三档计划、功能矩阵与不写回服务器的模拟订阅流程。",
      en: "Monthly/yearly billing, three plans, a feature matrix and a simulated subscription with no server writeback.",
    },
    description: [
      {
        zh: "演示 SaaS 定价页的常见决策路径：计费周期切换后同步更新价格与订单摘要，三档计划展示不同功能组合，功能矩阵用于核对差异，选中计划后进入模拟结账。",
        en: "A typical SaaS pricing decision flow: billing changes update prices and the order summary, three plans expose different feature sets, and a comparison matrix leads into a mock checkout.",
      },
      {
        zh: "当前结账只通过本地计时器演示处理中与成功状态，刷新后不会保留订阅。没有接入 Stripe Checkout、Webhook 或真实账户系统，页面不会收集任何支付信息。",
        en: "Checkout uses a local timer to demonstrate processing and success states; subscriptions do not survive a refresh. Stripe Checkout, webhooks and real accounts are not integrated, and no payment information is collected.",
      },
    ],
    features: [
      { zh: "月付 / 年付价格联动", en: "Synchronized monthly and yearly pricing" },
      { zh: "三档计划与功能对比矩阵", en: "Three plans and a feature matrix" },
      { zh: "订单摘要与计划选择", en: "Order summary and plan selection" },
      { zh: "本地模拟处理与成功反馈", en: "Local mock processing and success feedback" },
    ],
    links: { demo: "/playground/pricing" },
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

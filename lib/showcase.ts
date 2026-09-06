/** 模板画廊（showcase）：精致主页宣传模板演示，全部为静态页面，双语文案内聚本文件。
 *  与 work（真实作品）区分：showcase 展示「能做成什么样」的模板能力。 */

export type ShowcaseCategory = "business" | "tech" | "game";
export type Bi = { zh: string; en: string };

export interface ShowcaseTheme {
  /** 页面背景 */
  bg: string;
  /** 卡片/面板背景 */
  panel: string;
  /** 边框线 */
  line: string;
  /** 主文字 */
  fg: string;
  /** 次级文字 */
  muted: string;
  /** 主强调色 */
  acc: string;
  /** 副强调色 */
  acc2: string;
  /** hero 视觉区渐变（CSS background 值） */
  heroGrad: string;
}

export interface ShowcaseTemplate {
  slug: string;
  category: ShowcaseCategory;
  theme: ShowcaseTheme;
  /** 卡片风格角标 */
  tag: Bi;
  name: Bi;
  badge: Bi;
  headline: Bi;
  sub: Bi;
  ctaPrimary: Bi;
  ctaSecondary: Bi;
  stats: { value: string; label: Bi }[];
  featuresTitle: Bi;
  features: { icon: string; title: Bi; desc: Bi }[];
  quote: { text: Bi; author: Bi };
  ctaTitle: Bi;
  ctaDesc: Bi;
}

export const showcaseCategories: ShowcaseCategory[] = ["business", "tech", "game"];

export const categoryLabels: Record<ShowcaseCategory, Bi> = {
  business: { zh: "商务", en: "Business" },
  tech: { zh: "科技", en: "Tech" },
  game: { zh: "游戏", en: "Gaming" },
};

/** 画廊索引页 UI 文案 */
export const showcaseUI = {
  title: { zh: "模板画廊", en: "Template Gallery" } as Bi,
  desc: {
    zh: "一套主页宣传页模板能有多精致？每个模板都是完整可浏览的演示页——选一个类别，点进去看看。",
    en: "How polished can a landing page template be? Every template is a fully browsable demo page — pick a category and take a look.",
  } as Bi,
  all: { zh: "全部", en: "All" } as Bi,
  count: { zh: "套模板", en: "templates" } as Bi,
  view: { zh: "进入模板", en: "View template" } as Bi,
  back: { zh: "返回模板画廊", en: "Back to gallery" } as Bi,
  note: {
    zh: "演示内容为虚构品牌，仅用于展示模板的排版与交互能力。",
    en: "All brands shown are fictional; demos exist to showcase layout & interaction quality.",
  } as Bi,
};

export const templates: ShowcaseTemplate[] = [
  /* ---------------- 商务 1：咨询公司 ---------------- */
  {
    slug: "apex-consulting",
    category: "business",
    theme: {
      bg: "#F7F5F0",
      panel: "#FFFFFF",
      line: "#E5E0D5",
      fg: "#1A2440",
      muted: "#6B7280",
      acc: "#B98A2F",
      acc2: "#1A2440",
      heroGrad: "linear-gradient(135deg,#1A2440 0%,#2C3E66 55%,#B98A2F 130%)",
    },
    tag: { zh: "企业官网", en: "Corporate" },
    name: { zh: "Apex 策略咨询", en: "Apex Consulting" },
    badge: { zh: "精品商务模板", en: "Business Template" },
    headline: { zh: "让每一个战略决策，都有数据撑腰", en: "Every strategic decision, backed by data" },
    sub: {
      zh: "我们为成长期企业提供市场进入、财务重组与数字化转型咨询，用可量化的结果说话。",
      en: "Market entry, financial restructuring and digital transformation advisory for growth-stage companies — measured by results.",
    },
    ctaPrimary: { zh: "预约顾问", en: "Book a consultant" },
    ctaSecondary: { zh: "查看服务", en: "Our services" },
    stats: [
      { value: "12 年", label: { zh: "行业深耕", en: "Years in the field" } },
      { value: "300+", label: { zh: "服务企业", en: "Clients served" } },
      { value: "98%", label: { zh: "客户续约率", en: "Retention rate" } },
    ],
    featuresTitle: { zh: "核心业务", en: "Core Practices" },
    features: [
      { icon: "📈", title: { zh: "市场进入策略", en: "Market Entry" }, desc: { zh: "从竞品格局到渠道打法，30 天输出可执行方案。", en: "From competitive landscape to channel playbook in 30 days." } },
      { icon: "💰", title: { zh: "财务重组", en: "Financial Restructuring" }, desc: { zh: "现金流诊断、成本结构优化与融资节奏规划。", en: "Cash-flow diagnostics, cost restructuring and fundraising cadence." } },
      { icon: "🏢", title: { zh: "组织变革", en: "Org Transformation" }, desc: { zh: "架构调整、绩效体系与关键人才保留方案。", en: "Org design, performance systems and key-talent retention." } },
      { icon: "⚙️", title: { zh: "数字化转型", en: "Digital Transformation" }, desc: { zh: "业务流程上云、数据中台搭建与工具链落地。", en: "Cloud workflows, data platforms and toolchain adoption." } },
      { icon: "🤝", title: { zh: "并购整合", en: "M&A Integration" }, desc: { zh: "尽调支持、整合路线图与百天计划执行。", en: "Due diligence, integration roadmap and 100-day execution." } },
      { icon: "🌍", title: { zh: "出海咨询", en: "Global Expansion" }, desc: { zh: "合规、税务与本地化运营的一站式陪跑。", en: "Compliance, tax and localized ops, end to end." } },
    ],
    quote: {
      text: { zh: "Apex 把我们 18 个月的上市计划压缩到了 11 个月，每一个里程碑都有据可查。", en: "Apex compressed our 18-month IPO plan into 11 — every milestone tracked and accounted for." },
      author: { zh: "某智能制造企业 CFO", en: "CFO, smart-manufacturing client" },
    },
    ctaTitle: { zh: "下一次董事会，让数据替你发言", en: "Let data speak at your next board meeting" },
    ctaDesc: { zh: "首次诊断会议免费，48 小时内出具初步评估。", en: "First diagnostic session is free; preliminary assessment within 48 hours." },
  },

  /* ---------------- 商务 2：法餐厅 ---------------- */
  {
    slug: "maison-verte",
    category: "business",
    theme: {
      bg: "#FAF6EF",
      panel: "#FFFFFF",
      line: "#E9E1D2",
      fg: "#2E3B30",
      muted: "#8A8273",
      acc: "#7C9A6D",
      acc2: "#C96F4A",
      heroGrad: "linear-gradient(140deg,#2E3B30 0%,#465B48 60%,#7C9A6D 125%)",
    },
    tag: { zh: "餐饮品牌", en: "Restaurant" },
    name: { zh: "翠庭 · 法式餐厅", en: "Maison Verte" },
    badge: { zh: "精品商务模板", en: "Business Template" },
    headline: { zh: "从农场到餐桌的法式待客之道", en: "Farm-to-table, served the French way" },
    sub: {
      zh: "主厨每日依据合作农场的时令食材设计菜单，配以侍酒师推荐的自然酒单。",
      en: "Our chef designs the menu daily around seasonal produce from partner farms, paired by our sommelier.",
    },
    ctaPrimary: { zh: "预订座位", en: "Reserve a table" },
    ctaSecondary: { zh: "本期菜单", en: "This season's menu" },
    stats: [
      { value: "2012", label: { zh: "创立年份", en: "Established" } },
      { value: "24 道", label: { zh: "时令菜品", en: "Seasonal dishes" } },
      { value: "4.9", label: { zh: "食客评分", en: "Guest rating" } },
    ],
    featuresTitle: { zh: "餐厅体验", en: "The Experience" },
    features: [
      { icon: "🥂", title: { zh: "主厨品鉴菜单", en: "Tasting Menu" }, desc: { zh: "七道式时令套餐，每月随食材更替焕新。", en: "A seven-course seasonal tasting, refreshed monthly." } },
      { icon: "🍷", title: { zh: "侍酒配餐", en: "Wine Pairing" }, desc: { zh: "200+ 款自然酒库存，侍酒师按菜逐杯搭配。", en: "200+ natural wines, paired glass by glass." } },
      { icon: "🎂", title: { zh: "私宴定制", en: "Private Dining" }, desc: { zh: "8-20 人独立包间，专属菜单与花艺布置。", en: "Private rooms for 8-20 with bespoke menus." } },
      { icon: "🥐", title: { zh: "烘焙工坊", en: "Bakery Atelier" }, desc: { zh: "每日现烤可颂与法式甜点，午后限时供应。", en: "Daily croissants and pâtisserie, afternoons only." } },
      { icon: "☕", title: { zh: "企业茶歇", en: "Corporate Catering" }, desc: { zh: "会议茶歇与酒会外烩，同城 2 小时送达。", en: "Meeting breaks and receptions, delivered fresh." } },
      { icon: "🎁", title: { zh: "会员品鉴会", en: "Member Tastings" }, desc: { zh: "每月主厨之夜与产区酒主题晚宴。", en: "Monthly chef's nights and regional wine dinners." } },
    ],
    quote: {
      text: { zh: "可能是这座城市最被低估的法餐厅——每一道菜都能吃出食材的时令。", en: "Possibly the city's most underrated French table — every plate tastes of the season." },
      author: { zh: "美食专栏评论", en: "Food column review" },
    },
    ctaTitle: { zh: "本周仅余 6 席", en: "Only 6 tables left this week" },
    ctaDesc: { zh: "支持在线订位与微信提醒，周末建议提前三天预订。", en: "Book online with reminders; weekends fill up fast." },
  },

  /* ---------------- 科技 1：AI 数据平台 ---------------- */
  {
    slug: "nexus-ai",
    category: "tech",
    theme: {
      bg: "#0A0E1A",
      panel: "#111827",
      line: "#1F2A44",
      fg: "#E5E9F5",
      muted: "#8B93AD",
      acc: "#8B5CF6",
      acc2: "#22D3EE",
      heroGrad: "radial-gradient(120% 120% at 20% 0%,#8B5CF6 0%,#4C1D95 35%,#0A0E1A 75%)",
    },
    tag: { zh: "SaaS 平台", en: "SaaS Platform" },
    name: { zh: "Nexus AI 数据平台", en: "Nexus AI" },
    badge: { zh: "精品科技模板", en: "Tech Template" },
    headline: { zh: "把散落的数据，变成会说话的决策", en: "Turn scattered data into decisions that speak" },
    sub: {
      zh: "连接 500+ 数据源，用自然语言直接查数、自动生成报表，异常第一时间预警。",
      en: "Connect 500+ sources, query in plain language, auto-build reports, alert on anomalies instantly.",
    },
    ctaPrimary: { zh: "免费试用 14 天", en: "Start free trial" },
    ctaSecondary: { zh: "预约演示", en: "Book a demo" },
    stats: [
      { value: "99.99%", label: { zh: "服务可用性", en: "Uptime SLA" } },
      { value: "2.1B", label: { zh: "日均处理事件", en: "Daily events" } },
      { value: "500+", label: { zh: "数据源连接器", en: "Connectors" } },
    ],
    featuresTitle: { zh: "平台能力", en: "Platform" },
    features: [
      { icon: "🔌", title: { zh: "实时数据管道", en: "Realtime Pipelines" }, desc: { zh: "CDC 与流式接入，秒级延迟同步到仓库。", en: "CDC and streaming ingestion, second-level sync." } },
      { icon: "💬", title: { zh: "自然语言查数", en: "Ask in Plain Language" }, desc: { zh: "像问同事一样问数据，自动生成 SQL 与图表。", en: "Ask data like a colleague; SQL and charts auto-built." } },
      { icon: "📊", title: { zh: "自动化报表", en: "Automated Reports" }, desc: { zh: "定时推送至飞书、钉钉与邮箱，格式随模板。", en: "Scheduled delivery to IM and inbox, template-based." } },
      { icon: "🚨", title: { zh: "异常预警", en: "Anomaly Alerts" }, desc: { zh: "指标基线自动学习，抖动超出阈值即刻通知。", en: "Baselines learned automatically; breaches ping you." } },
      { icon: "🧩", title: { zh: "API 优先", en: "API-First" }, desc: { zh: "全部能力开放 API，可嵌入自有系统与工作流。", en: "Everything as API; embed into your own stack." } },
      { icon: "🔐", title: { zh: "私有化部署", en: "Private Deployment" }, desc: { zh: "支持 VPC 内部署与细粒度权限审计。", en: "Deploy in your VPC with fine-grained audit." } },
    ],
    quote: {
      text: { zh: "以前分析师三天出的周报，现在业务同学自己 30 秒就能拉出来。", en: "Weekly reports that took analysts 3 days now take anyone 30 seconds." },
      author: { zh: "某电商公司数据负责人", en: "Head of Data, e-commerce client" },
    },
    ctaTitle: { zh: "让数据团队从取数中解放出来", en: "Free your data team from ad-hoc queries" },
    ctaDesc: { zh: "14 天全功能试用，无需绑卡，支持私有化 POC。", en: "14-day full-feature trial, no card required, POC supported." },
  },

  /* ---------------- 科技 2：用户行为分析 ---------------- */
  {
    slug: "pulse-analytics",
    category: "tech",
    theme: {
      bg: "#060B14",
      panel: "#0D1524",
      line: "#1B2942",
      fg: "#E2EDF8",
      muted: "#7E8CA5",
      acc: "#38BDF8",
      acc2: "#34D399",
      heroGrad: "radial-gradient(120% 130% at 80% 0%,#0EA5E9 0%,#0C4A6E 40%,#060B14 80%)",
    },
    tag: { zh: "数据分析", en: "Analytics" },
    name: { zh: "Pulse 行为分析", en: "Pulse Analytics" },
    badge: { zh: "精品科技模板", en: "Tech Template" },
    headline: { zh: "看清用户每一步，增长有迹可循", en: "See every step of your funnel" },
    sub: {
      zh: "5 分钟完成接入，漏斗、留存、路径与实验一站搞定，为增长团队而生。",
      en: "Integrate in 5 minutes. Funnels, retention, paths and experiments — built for growth teams.",
    },
    ctaPrimary: { zh: "立即接入", en: "Get started" },
    ctaSecondary: { zh: "查看文档", en: "Read the docs" },
    stats: [
      { value: "5 min", label: { zh: "平均接入耗时", en: "Time to integrate" } },
      { value: "40+", label: { zh: "内置分析模型", en: "Analysis models" } },
      { value: "1B+", label: { zh: "日事件处理量", en: "Daily events" } },
    ],
    featuresTitle: { zh: "产品功能", en: "Features" },
    features: [
      { icon: "🎯", title: { zh: "全埋点采集", en: "Auto-Capture" }, desc: { zh: "SDK 自动采集关键行为，无需等发版。", en: "SDKs capture key events without releases." } },
      { icon: "🪣", title: { zh: "漏斗与路径", en: "Funnels & Paths" }, desc: { zh: "多维下钻定位流失步骤，路径图一键生成。", en: "Drill into drop-offs; path maps in one click." } },
      { icon: "🔁", title: { zh: "留存矩阵", en: "Retention Grid" }, desc: { zh: "按群组观察留存曲线，行为分层一目了然。", en: "Cohorted retention curves, behaviorally segmented." } },
      { icon: "🧪", title: { zh: "A/B 实验", en: "A/B Testing" }, desc: { zh: "分流、置信度计算与效果判定全自动化。", en: "Split traffic, compute significance, decide." } },
      { icon: "▶️", title: { zh: "会话回放", en: "Session Replay" }, desc: { zh: "高保真回放异常会话，隐私字段自动脱敏。", en: "Replay sessions with auto-masked PII." } },
      { icon: "🛡️", title: { zh: "合规就绪", en: "Compliance Ready" }, desc: { zh: "GDPR 与个保法适配，数据存储区域可选。", en: "GDPR-ready with region-pinned storage." } },
    ],
    quote: {
      text: { zh: "上线第一周我们就找到了注册转化漏斗里最大的漏洞，当周修复，转化率提升 11%。", en: "Within week one we found our biggest signup leak; fixing it lifted conversion 11%." },
      author: { zh: "SaaS 增长团队负责人", en: "Growth Lead, SaaS company" },
    },
    ctaTitle: { zh: "别再凭感觉做增长了", en: "Stop guessing your growth" },
    ctaDesc: { zh: "免费版支持每月 100 万事件，小型团队永久可用。", en: "Free tier: 1M events/month, free forever for small teams." },
  },

  /* ---------------- 游戏 1：星际题材 ---------------- */
  {
    slug: "starfall-saga",
    category: "game",
    theme: {
      bg: "#06070D",
      panel: "#0C0F1A",
      line: "#2A3040",
      fg: "#F2F4F8",
      muted: "#9AA3B5",
      acc: "#E8C15A",
      acc2: "#7DD3FC",
      heroGrad: "radial-gradient(130% 130% at 50% 0%,#4A3D1E 0%,#0E1220 45%,#06070D 85%)",
    },
    tag: { zh: "游戏官网", en: "Game Site" },
    name: { zh: "星坠战纪", en: "Starfall Saga" },
    badge: { zh: "精品游戏模板", en: "Game Template" },
    headline: { zh: "群星陨落之时，便是你崛起之刻", en: "When the stars fall, your legend rises" },
    sub: {
      zh: "开放星海战略 RPG：组建舰队、争夺星域、书写属于你的星际编年史。",
      en: "An open-galaxy strategy RPG: build your fleet, claim sectors, write your own chronicle.",
    },
    ctaPrimary: { zh: "立即预约", en: "Pre-register" },
    ctaSecondary: { zh: "观看 PV", en: "Watch trailer" },
    stats: [
      { value: "2000万", label: { zh: "全平台预约", en: "Pre-registrations" } },
      { value: "96%", label: { zh: "测试好评率", en: "Beta rating" } },
      { value: "4 章", label: { zh: "赛季剧情", en: "Season chapters" } },
    ],
    featuresTitle: { zh: "游戏特色", en: "Features" },
    features: [
      { icon: "🌌", title: { zh: "开放星海地图", en: "Open Galaxy" }, desc: { zh: "300+ 星域无缝探索，事件随赛季演化。", en: "300+ seamless sectors, evolving each season." } },
      { icon: "🛸", title: { zh: "120 位舰长", en: "120 Captains" }, desc: { zh: "专属剧情线与羁绊组合，编队策略千变万化。", en: "Unique storylines and synergy loadouts." } },
      { icon: "⚔️", title: { zh: "40 人舰队战", en: "40-Player Fleets" }, desc: { zh: "实时同屏会战，指挥链与战术道具全支持。", en: "Live battles with command chains and tactics." } },
      { icon: "📜", title: { zh: "赛季编年史", en: "Season Chronicle" }, desc: { zh: "每个赛季推进主线剧情，世界的命运由玩家投票。", en: "Story advances every season; players vote the outcome." } },
      { icon: "💻", title: { zh: "三端互通", en: "Cross-Platform" }, desc: { zh: "PC、主机与手机进度实时同步。", en: "PC, console and mobile in sync." } },
      { icon: "⚖️", title: { zh: "公平竞技", en: "Fair Play" }, desc: { zh: "不出售数值，一切强度来自策略与肝度。", en: "No stat sales; power comes from strategy." } },
    ],
    quote: {
      text: { zh: "第一次在手游里体验到了「我们的星域」这四个字的分量。", en: "The first mobile game where 'our sector' actually means something." },
      author: { zh: "二测玩家评论", en: "Beta playtest review" },
    },
    ctaTitle: { zh: "星海已就绪，只差一位指挥官", en: "The galaxy is ready. It needs a commander." },
    ctaDesc: { zh: "预约即领限定舰长皮肤，公测当日直接到账。", en: "Pre-register for an exclusive captain skin at launch." },
  },

  /* ---------------- 游戏 2：复古街机 ---------------- */
  {
    slug: "neon-arcade",
    category: "game",
    theme: {
      bg: "#0D0221",
      panel: "#181038",
      line: "#33205C",
      fg: "#F3EBFF",
      muted: "#A08FCB",
      acc: "#FF2E88",
      acc2: "#00F5D4",
      heroGrad: "linear-gradient(135deg,#FF2E88 0%,#7B2CBF 45%,#0D0221 90%)",
    },
    tag: { zh: "休闲平台", en: "Casual Platform" },
    name: { zh: "霓虹街机", en: "Neon Arcade" },
    badge: { zh: "精品游戏模板", en: "Game Template" },
    headline: { zh: "把整条游戏厅街，搬进你的口袋", en: "The whole arcade, in your pocket" },
    sub: {
      zh: "50 余款经典街机精准复刻，在线排行、创意改表与本地双人，一网打尽。",
      en: "50+ faithful arcade classics, online leaderboards, workshop mods and couch co-op.",
    },
    ctaPrimary: { zh: "免费下载", en: "Download free" },
    ctaSecondary: { zh: "游戏列表", en: "Game library" },
    stats: [
      { value: "50+", label: { zh: "经典复刻", en: "Classics remade" } },
      { value: "1ms", label: { zh: "联机延迟", en: "Netcode latency" } },
      { value: "100万+", label: { zh: "创意 Mod", en: "Workshop mods" } },
    ],
    featuresTitle: { zh: "平台亮点", en: "Highlights" },
    features: [
      { icon: "🕹️", title: { zh: "50+ 经典复刻", en: "50+ Classics" }, desc: { zh: "与原厂联名的像素级复刻，帧帧都对味。", en: "Pixel-perfect remasters, frame-accurate." } },
      { icon: "🌐", title: { zh: "在线排行", en: "Leaderboards" }, desc: { zh: "全球榜单分平台展示，挑战好友只需一步。", en: "Global boards per platform; challenge friends." } },
      { icon: "🛠️", title: { zh: "创意工坊", en: "Workshop" }, desc: { zh: "改表、换皮、新关卡，社区创作周更。", en: "Mods, skins and stages, updated weekly." } },
      { icon: "👥", title: { zh: "本地双人", en: "Couch Co-op" }, desc: { zh: "同屏合作与对战，重温街机厅的默契。", en: "Shared-screen co-op and versus, arcade style." } },
      { icon: "🎮", title: { zh: "手柄适配", en: "Gamepad Ready" }, desc: { zh: "主流手柄即插即玩，支持按键自定义。", en: "Plug-and-play pads with remapping." } },
      { icon: "📅", title: { zh: "每周上新", en: "Weekly Drops" }, desc: { zh: "每周一款新游入库，复古新作两不误。", en: "A new title every week, retro and fresh." } },
    ],
    quote: {
      text: { zh: "在手机上打出一币通关的那一刻，我仿佛又回到了放学后的街机厅。", en: "One-credit-clearing it on my phone — suddenly it's 1999 after school again." },
      author: { zh: "玩家社区热评", en: "Community spotlight" },
    },
    ctaTitle: { zh: "投入一枚硬币，重启你的高光时刻", en: "Insert coin. Restart your glory days." },
    ctaDesc: { zh: "iOS / Android / PC 全平台免费下载，含简体中文。", en: "Free on iOS, Android and PC, with full localization." },
  },
];

export function getTemplate(slug: string): ShowcaseTemplate | undefined {
  return templates.find((t) => t.slug === slug);
}

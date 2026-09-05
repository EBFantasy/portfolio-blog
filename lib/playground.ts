/** playground 共享数据与纯函数（服务端/客户端均可导入，无 server-only） */

/* ------------------------- 星幕 · 选座 ------------------------- */

export interface CinemaSession {
  id: string;
  time: string;
  hall: { zh: string; en: string };
  audio: { zh: string; en: string };
}

export const cinemaSessions: CinemaSession[] = [
  { id: "s1", time: "14:30", hall: { zh: "IMAX 3 号厅", en: "IMAX Hall 3" }, audio: { zh: "国语 2D", en: "Mandarin 2D" } },
  { id: "s2", time: "16:45", hall: { zh: "激光 5 号厅", en: "Laser Hall 5" }, audio: { zh: "国语 2D", en: "Mandarin 2D" } },
  { id: "s3", time: "19:00", hall: { zh: "IMAX 3 号厅", en: "IMAX Hall 3" }, audio: { zh: "英语原声", en: "Original English" } },
  { id: "s4", time: "21:20", hall: { zh: "激光 2 号厅", en: "Laser Hall 2" }, audio: { zh: "国语 2D", en: "Mandarin 2D" } },
];

export const SEAT_ROWS = ["A", "B", "C", "D", "E", "F", "G"] as const;
export const SEAT_COLS = 12;
/** 每排在这几个列索引之后插入过道（0-3 | 4-7 | 8-11） */
export const AISLE_AFTER = [3, 7];
/** D/E/F 三排为 VIP 区（中间靠后，观影最佳） */
export const VIP_ROWS = new Set(["D", "E", "F"]);
export const MAX_SEATS = 4;
/** 分计价避免浮点误差：49.0 元 / 29.9 元 */
export const SEAT_PRICES = { vip: 4900, std: 2990 } as const;

export type SeatTier = keyof typeof SEAT_PRICES;

export function seatTier(row: string): SeatTier {
  return VIP_ROWS.has(row) ? "vip" : "std";
}

export function seatPriceCents(row: string): number {
  return SEAT_PRICES[seatTier(row)];
}

/** 价格分转显示字符串：4900 -> "49"，2990 -> "29.9" */
export function formatCents(cents: number): string {
  const y = cents / 100;
  return Number.isInteger(y) ? String(y) : String(Number(y.toFixed(2)));
}

/** FNV-1a 确定性哈希：同一座位/场次刷新后已售状态不变 */
function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** 已售率：VIP 区 42%（好位先卖完），普通区 28% */
export function isSold(sessionId: string, row: string, col: number): boolean {
  const rate = seatTier(row) === "vip" ? 42 : 28;
  return hashStr(`${sessionId}:${row}${col}`) % 100 < rate;
}

/* ------------------------- 茶时 · 点单 ------------------------- */

export interface TeaItem {
  id: string;
  name: { zh: string; en: string };
  desc: { zh: string; en: string };
  /** 基础价（分） */
  baseCents: number;
  tag: "hot" | "new" | null;
  /** Tailwind 渐变（缩略块配色） */
  grad: string;
}

export const teaMenu: TeaItem[] = [
  {
    id: "t1",
    name: { zh: "招牌珍珠奶茶", en: "Signature Pearl Milk Tea" },
    desc: { zh: "锡兰红茶底 · 鲜煮珍珠", en: "Ceylon black tea, house-boiled pearls" },
    baseCents: 1600,
    tag: "hot",
    grad: "from-amber-400 to-orange-500",
  },
  {
    id: "t2",
    name: { zh: "手打柠檬绿茶", en: "Hand-Smashed Lemon Green Tea" },
    desc: { zh: "香水柠檬 · 现萃绿茶", en: "Fragrant lemon, fresh-brewed green tea" },
    baseCents: 1300,
    tag: "hot",
    grad: "from-lime-400 to-green-500",
  },
  {
    id: "t3",
    name: { zh: "杨枝甘露", en: "Mango Pomelo Sago" },
    desc: { zh: "芒果西柚西米露", en: "Mango, pomelo & sago" },
    baseCents: 1900,
    tag: null,
    grad: "from-yellow-400 to-amber-500",
  },
  {
    id: "t4",
    name: { zh: "芝士葡萄冻冻", en: "Grape Cheese Foam Jelly" },
    desc: { zh: "多肉葡萄 · 咸香芝士", en: "Grape slush, salted cheese foam" },
    baseCents: 1800,
    tag: "new",
    grad: "from-purple-400 to-fuchsia-500",
  },
  {
    id: "t5",
    name: { zh: "茉莉初雪轻乳茶", en: "Jasmine Snow Light Milk Tea" },
    desc: { zh: "茉莉花茶底 · 轻乳茶", en: "Jasmine tea base, light milk tea" },
    baseCents: 1500,
    tag: null,
    grad: "from-teal-300 to-cyan-500",
  },
  {
    id: "t6",
    name: { zh: "黑糖波波鲜奶", en: "Brown Sugar Boba Milk" },
    desc: { zh: "现熬黑糖 · 鲜牛乳", en: "Fresh-brewed brown sugar, whole milk" },
    baseCents: 1700,
    tag: "new",
    grad: "from-stone-400 to-amber-600",
  },
];

export interface TeaSpecOption {
  id: string;
  label: { zh: string; en: string };
  extraCents: number;
}

export const tempOptions: TeaSpecOption[] = [
  { id: "normal", label: { zh: "正常冰", en: "Normal ice" }, extraCents: 0 },
  { id: "less", label: { zh: "少冰", en: "Less ice" }, extraCents: 0 },
  { id: "none", label: { zh: "去冰", en: "No ice" }, extraCents: 0 },
];

export const sweetOptions: TeaSpecOption[] = [
  { id: "std", label: { zh: "标准糖", en: "Standard" }, extraCents: 0 },
  { id: "70", label: { zh: "七分糖", en: "70% sugar" }, extraCents: 0 },
  { id: "30", label: { zh: "三分糖", en: "30% sugar" }, extraCents: 0 },
  { id: "none", label: { zh: "无糖", en: "No sugar" }, extraCents: 0 },
];

export const toppingOptions: TeaSpecOption[] = [
  { id: "pearl", label: { zh: "珍珠", en: "Pearls" }, extraCents: 200 },
  { id: "coco", label: { zh: "椰果", en: "Coconut jelly" }, extraCents: 200 },
  { id: "cheese", label: { zh: "芝士奶盖", en: "Cheese foam" }, extraCents: 400 },
];

/** 一杯饮品的单价（基础价 + 加料） */
export function teaUnitPriceCents(itemId: string, toppingIds: string[]): number {
  const item = teaMenu.find((t) => t.id === itemId);
  if (!item) return 0;
  return item.baseCents + toppingOptions.filter((t) => toppingIds.includes(t.id)).reduce((s, t) => s + t.extraCents, 0);
}

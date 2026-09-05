/** 星幕选座 playground 共享数据与纯函数（服务端/客户端均可导入，无 server-only） */

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

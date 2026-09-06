/** work 板块共享类型与分类元数据（服务端/客户端均可导入） */

export type ProjectCategory = "miniprogram" | "playground" | "automation";
export type Accent = "violet" | "amber" | "rose" | "sky";

export type BilingualText = { zh: string; en: string };

export interface Project {
  slug: string;
  category: ProjectCategory;
  /** 详情页预览框样式：浏览器窗口 or 手机壳 */
  preview: "browser" | "phone";
  /** 卡片渐变主色（用于抽象预览与强调色） */
  accent: Accent;
  title: BilingualText;
  summary: BilingualText;
  description: BilingualText[];
  features: BilingualText[];
  tags: string[];
  year: string;
  featured?: boolean;
  links?: { demo?: string; repo?: string };
}

export const categoryMeta: Record<ProjectCategory, BilingualText> = {
  miniprogram: { zh: "小程序", en: "Mini Program" },
  playground: { zh: "功能演示", en: "Playground" },
  automation: { zh: "自动化 / 数据", en: "Automation & Data" },
};

export const projectCategories: ProjectCategory[] = ["automation", "miniprogram", "playground"];

export function getCategoryMeta(c: ProjectCategory): BilingualText {
  return categoryMeta[c];
}

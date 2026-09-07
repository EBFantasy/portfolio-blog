/**
 * 站点对外绝对地址（用于 sitemap / robots / OG metadataBase）。
 *
 * 取值优先级：
 * 1. NEXT_PUBLIC_SITE_URL —— 需要固定域名时在 Vercel 项目环境变量里手动指定（含 https://）
 * 2. VERCEL_PROJECT_PRODUCTION_URL —— Vercel 自动注入的生产域名（绑定自定义域后会自动跟上）
 * 3. 兜底：当前 Vercel 免费域名
 *
 * 注意：前面所有 URL 都不带结尾斜杠，拼接时统一写 `${SITE_URL}/xxx`。
 */
const FALLBACK = "https://portfolio-blog-ginkgos-projects.vercel.app";

function resolveSiteUrl(): string {
  const manual = process.env.NEXT_PUBLIC_SITE_URL;
  if (manual) return manual.replace(/\/+$/, "");

  const vercelProd = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelProd) return `https://${vercelProd}`.replace(/\/+$/, "");

  return FALLBACK;
}

export const SITE_URL = resolveSiteUrl();

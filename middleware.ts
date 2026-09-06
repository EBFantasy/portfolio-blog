import { NextRequest, NextResponse } from "next/server";

// 把未带语言前缀的路径重定向到 /zh 或 /en：
// 优先读用户手动选择的语言（NEXT_LOCALE cookie），没有再按浏览器语言兜底。
export function middleware(req: NextRequest) {
  const cookieLocale = req.cookies.get("NEXT_LOCALE")?.value;
  const locale = cookieLocale === "en" || cookieLocale === "zh" ? cookieLocale : undefined;
  const lang =
    locale ??
    (req.headers.get("accept-language")?.toLowerCase().includes("zh") ? "zh" : "en");
  const rest = req.nextUrl.pathname === "/" ? "" : req.nextUrl.pathname;
  return NextResponse.redirect(new URL(`/${lang}${rest}`, req.url));
}

export const config = {
  matcher: ["/((?!zh|en|api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};

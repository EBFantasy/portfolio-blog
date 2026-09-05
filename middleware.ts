import { NextRequest, NextResponse } from "next/server";

// 把未带语言前缀的路径按浏览器语言重定向到 /zh 或 /en
export function middleware(req: NextRequest) {
  const accept = req.headers.get("accept-language")?.toLowerCase() ?? "";
  const lang = accept.includes("zh") ? "zh" : "en";
  const rest = req.nextUrl.pathname === "/" ? "" : req.nextUrl.pathname;
  return NextResponse.redirect(new URL(`/${lang}${rest}`, req.url));
}

export const config = {
  matcher: ["/((?!zh|en|api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ebfantasy.vercel.app"),
  title: {
    default: "EBFantasy · 软件工程师作品集与博客",
    template: "%s · EBFantasy",
  },
  description:
    "软件工程师个人站：网页开发 Demo、微信小程序预览、功能演示与技术博客。",
};

// 在页面 hydration 前根据 localStorage / 系统偏好挂载主题，避免闪烁
const themeInit = `(function(){try{var t=localStorage.getItem("theme");var d=window.matchMedia("(prefers-color-scheme: dark)").matches;if(t==="dark"||(!t&&d)){document.documentElement.classList.add("dark")}}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}

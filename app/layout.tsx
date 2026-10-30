import type { Metadata } from "next";
import "./globals.css";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
};

// 在 hydration 前同步语言与主题，避免语言属性和配色闪烁。
const earlyInit = `(function(){var p=window.location.pathname;document.documentElement.lang=p==="/en"||p.indexOf("/en/")===0?"en":"zh";try{var t=localStorage.getItem("theme");var d=window.matchMedia("(prefers-color-scheme: dark)").matches;if(t==="dark"||(!t&&d)){document.documentElement.classList.add("dark")}}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: earlyInit }} />
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}

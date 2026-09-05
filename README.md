# EBFantasy · 个人作品集与博客

软件工程师个人站：网页开发 Demo、微信小程序预览、功能演示与技术博客。

**技术栈**：Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · MDX 式 Markdown 内容管道

## 本地开发

```bash
npm install        # 安装依赖
npm run dev        # 开发模式 http://localhost:3000
npm run build      # 生产构建
npm start          # 生产预览 http://localhost:3000
```

## 目录结构

```
app/
  layout.tsx          # 根布局（主题初始化）
  middleware.ts       # 语言自动跳转
  [lang]/             # 双语路由段（zh / en）
    page.tsx          # 首页
    work/             # 作品集（第 2 期填充）
    blog/             # 博客列表 + [slug] 详情
    about/            # 关于我
  sitemap.ts          # SEO 站点地图
content/blog/         # 文章（每篇一个目录，zh.mdx / en.mdx）
components/           # Header / Footer / ThemeToggle / LangSwitch
lib/                  # i18n 字典 + 博客读取管道
```

## 如何新增板块

1. 在 `app/[lang]/` 下新建目录，如 `playground/page.tsx`；
2. 在 `lib/i18n.ts` 的字典里加对应文案；
3. 在 `components/Header.tsx` 的 `links` 数组里加导航项。

## 如何写文章

在 `content/blog/` 下新建目录（如 `my-post/`），放入 `zh.mdx` 与 `en.mdx`：

```mdx
---
title: "文章标题"
date: "2026-09-05"
lang: "zh"
summary: "一句话摘要"
tags: ["标签1", "标签2"]
---

正文支持标准 Markdown 与 GFM 表格、代码块等。
```

## 部署

推送 GitHub 后在 Vercel 导入即可；自定义域名（EBFantasy 相关）完工后再绑定，当前使用 `*.vercel.app` 免费域名。

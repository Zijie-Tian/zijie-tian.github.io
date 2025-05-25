# Zijie Tian's Personal Blog

这是我的个人博客网站，基于 [Astro](https://astro.build) 框架和 [Fuwari](https://github.com/saicaca/fuwari) 主题构建。

## 🌐 在线访问

博客地址：[https://zijie-tian.github.io](https://zijie-tian.github.io)

## ✨ 特性

- 🚀 **快速加载** - 基于 Astro 的静态站点生成
- 🎨 **美观设计** - 现代化的 UI 设计，支持明暗主题切换
- 📱 **响应式布局** - 完美适配各种设备
- 🔍 **全文搜索** - 内置搜索功能
- 📝 **Markdown 支持** - 支持丰富的 Markdown 语法
- 🌍 **中文优化** - 针对中文内容进行了优化

## 🛠️ 技术栈

- **框架**: [Astro](https://astro.build)
- **主题**: [Fuwari](https://github.com/saicaca/fuwari)
- **样式**: [Tailwind CSS](https://tailwindcss.com)
- **部署**: GitHub Pages
- **包管理**: pnpm
- **CI/CD**: GitHub Actions

## 📝 如何添加新文章

1. 创建新文章：
   ```bash
   pnpm new-post <文章名称>
   ```

2. 编辑文章内容：
   - 文章位于 `src/content/posts/` 目录
   - 使用 Markdown 格式编写
   - 在 frontmatter 中设置标题、标签、分类等信息

3. 本地预览：
   ```bash
   pnpm dev
   ```

4. 构建和部署：
   ```bash
   git add .
   git commit -m "feat: 添加新文章"
   git push origin main
   ```

## 🚀 本地开发

### 环境要求

- Node.js <= 22
- pnpm <= 9

### 安装依赖

```bash
pnpm install
pnpm add sharp
```

### 开发命令

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 构建生产版本 |
| `pnpm preview` | 预览构建结果 |
| `pnpm new-post <filename>` | 创建新文章 |

## 📄 文章格式

```yaml
---
title: 文章标题
published: 2025-05-26
description: '文章描述'
image: './cover.jpg'  # 可选
tags: [标签1, 标签2]
category: '分类'
draft: false
lang: 'zh_CN'
---

# 文章内容

这里是文章的正文内容...
```

## 🔧 自定义配置

博客的主要配置文件位于 `src/config.ts`，可以修改：

- 网站标题和描述
- 个人信息和社交链接
- 主题颜色
- 导航菜单

## 📦 部署

本博客使用 GitHub Actions 自动部署到 GitHub Pages：

1. 推送代码到 `main` 分支
2. GitHub Actions 自动构建
3. 部署到 GitHub Pages

## 📞 联系方式

- GitHub: [zijie-tian](https://github.com/zijie-tian)
- Email: your-email@example.com

## 📄 许可证

本项目基于 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 许可证。

---

感谢 [Fuwari](https://github.com/saicaca/fuwari) 主题的作者提供的优秀模板！

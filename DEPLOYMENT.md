# GitHub Pages 部署说明

## 当前状态

✅ 项目已成功构建并推送到 `gh-pages` 分支
❌ GitHub Pages 需要手动配置

## 手动配置 GitHub Pages

请按照以下步骤在 GitHub 仓库中启用 Pages：

### 1. 访问仓库设置
1. 打开 https://github.com/Zijie-Tian/zijie-tian.github.io
2. 点击 **Settings** 标签页

### 2. 配置 Pages
1. 在左侧菜单中找到 **Pages**
2. 在 **Source** 部分选择 **Deploy from a branch**
3. 在 **Branch** 下拉菜单中选择 **gh-pages**
4. 文件夹保持 **/ (root)**
5. 点击 **Save**

### 3. 等待部署
- GitHub 会自动开始部署过程
- 通常需要几分钟时间
- 部署完成后，网站将在 https://zijie-tian.github.io 可用

## 自动部署

一旦手动配置完成，后续的部署将通过以下方式自动进行：

1. 推送代码到 `main` 分支
2. GitHub Actions 自动构建项目
3. 构建结果推送到 `gh-pages` 分支
4. GitHub Pages 自动更新网站

## 当前博客内容

博客包含以下文章：
- 我的第一篇博客文章 (个人介绍)
- Astro 框架简介 (技术文章)
- Markdown 语法示例 (示例文章)
- Simple Guides for Fuwari (使用指南)

## 故障排除

如果网站仍然无法访问：
1. 检查 GitHub Pages 设置是否正确
2. 确认 `gh-pages` 分支存在且包含构建文件
3. 等待 DNS 传播（可能需要几分钟到几小时）
4. 检查浏览器缓存，尝试硬刷新

## 联系信息

如需帮助，请检查：
- GitHub Actions 日志
- GitHub Pages 部署状态
- 仓库 Issues 页面 
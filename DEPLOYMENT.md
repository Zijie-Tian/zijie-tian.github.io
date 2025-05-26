# GitHub Pages 部署指南

本项目使用 GitHub Actions 自动部署到 GitHub Pages。

## 配置说明

### 1. Astro 配置 (`astro.config.mjs`)

```javascript
export default defineConfig({
  site: "https://zijie-tian.github.io",
  base: "/",
  // ... 其他配置
});
```

**重要说明：**
- `site`: 设置为您的 GitHub Pages 域名
- `base`: 对于用户/组织页面设置为 "/"，对于项目页面设置为 "/repository-name/"

### 2. GitHub Actions 工作流

项目使用传统的 GitHub Actions 配置，具有以下优势：

- **稳定性**: 使用经过验证的 Actions 组合
- **透明性**: 每个步骤都清晰可见
- **可控性**: 可以精确控制构建过程

**工作流步骤：**
1. 检出代码 (`actions/checkout@v4`)
2. 设置 Node.js 20 (`actions/setup-node@v4`)
3. 设置 pnpm 9 (`pnpm/action-setup@v4`)
4. 配置 GitHub Pages (`actions/configure-pages@v4`)
5. 安装依赖 (`pnpm install --frozen-lockfile`)
6. 构建项目 (`pnpm build`)
7. 上传构建产物 (`actions/upload-pages-artifact@v3`)
8. 部署到 GitHub Pages (`actions/deploy-pages@v4`)

### 3. GitHub Pages 设置

在 GitHub 仓库中进行以下设置：

1. 进入 **Settings** → **Pages**
2. 在 **Source** 中选择 **GitHub Actions**
3. 保存设置

## 部署流程

1. **自动触发**：推送到 `main` 分支时自动部署
2. **手动触发**：在 GitHub Actions 页面手动运行工作流
3. **构建过程**：
   - 检出代码
   - 设置 Node.js 和 pnpm 环境
   - 安装依赖并构建
   - 部署到 GitHub Pages

## 故障排除

### 常见问题

1. **构建失败**
   - 检查 `package.json` 中的脚本
   - 确认所有依赖都已正确安装
   - 查看 GitHub Actions 日志

2. **页面无法访问**
   - 确认 GitHub Pages 已启用
   - 检查 `site` 配置是否正确
   - 等待 DNS 传播（可能需要几分钟）

3. **资源加载失败**
   - 检查 `base` 配置
   - 确认静态资源路径正确

### CI 问题解决历史

**问题**: `withastro/action@v3` 在某些情况下可能不稳定
**解决方案**: 改用传统的 GitHub Actions 配置，提供更好的稳定性和可控性

### 调试步骤

1. 检查 GitHub Actions 运行状态
2. 验证构建产物是否正确生成
3. 确认 GitHub Pages 设置
4. 检查浏览器控制台错误

## 本地测试

在推送前本地测试：

```bash
# 安装依赖
pnpm install

# 构建项目
pnpm build

# 预览构建结果
pnpm preview
```

## 更新记录

- **2025-01-27**: 修复CI问题，改用传统GitHub Actions配置
- **2025-01-27**: 更新为使用官方 `withastro/action@v3` (后因稳定性问题回退)
- **2025-01-27**: 优化配置，遵循 Astro 官方最佳实践

## 当前状态

✅ 项目已成功构建并推送到 GitHub Pages
✅ GitHub Pages 已启用并正常工作
✅ CI/CD 流程稳定运行

## 手动配置 GitHub Pages

请按照以下步骤在 GitHub 仓库中启用 Pages：

### 1. 访问仓库设置
1. 打开 https://github.com/Zijie-Tian/zijie-tian.github.io
2. 点击 **Settings** 标签页

### 2. 配置 Pages
1. 在左侧菜单中找到 **Pages**
2. 在 **Source** 部分选择 **GitHub Actions**
3. 保存设置

### 3. 等待部署
- GitHub 会自动开始部署过程
- 通常需要几分钟时间
- 部署完成后，网站将在 https://zijie-tian.github.io 可用

## 自动部署

一旦配置完成，后续的部署将通过以下方式自动进行：

1. 推送代码到 `main` 分支
2. GitHub Actions 自动构建项目
3. 构建结果自动部署到 GitHub Pages
4. 网站自动更新

## 当前博客内容

博客包含以下文章：
- 我的第一篇博客文章 (个人介绍)
- Astro 框架简介 (技术文章)
- Markdown 语法示例 (示例文章)
- Simple Guides for Fuwari (使用指南)

## 联系信息

如需帮助，请检查：
- GitHub Actions 日志
- GitHub Pages 部署状态
- 仓库 Issues 页面 
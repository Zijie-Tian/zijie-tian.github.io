# CI 问题解决方案总结

## 🚨 问题描述

GitHub Actions CI 一直失败，出现 Jekyll 构建错误：

```
Run actions/jekyll-build-pages@v1
YAML Exception reading /github/workspace/src/layouts/Layout.astro: 
(<unknown>): mapping values are not allowed in this context at line 24 column 8
ERROR: YOUR SITE COULD NOT BE BUILT:
Invalid YAML front matter in /github/workspace/src/components/widget/Profile.astro
```

## 🔍 根本原因

1. **GitHub Pages 配置错误**: Pages 设置为 "legacy" 模式，尝试使用 Jekyll 构建 Astro 项目
2. **Jekyll 与 Astro 不兼容**: Jekyll 无法理解 Astro 文件格式，导致 YAML 解析错误
3. **缺少 .nojekyll 文件**: 没有明确告诉 GitHub Pages 不要使用 Jekyll

## ✅ 解决方案

### 1. 添加 .nojekyll 文件
```bash
touch .nojekyll
```
这告诉 GitHub Pages 不要使用 Jekyll 构建。

### 2. 更改 GitHub Pages 配置
使用 GitHub API 将 Pages 配置从 "legacy" 更改为 "workflow":
```bash
curl -X PUT -H "Authorization: token $(gh auth token)" \
  "https://api.github.com/repos/Zijie-Tian/zijie-tian.github.io/pages" \
  -d '{"source":{"branch":"main","path":"/"},"build_type":"workflow"}'
```

### 3. 使用稳定的 GitHub Actions 配置
替换 `withastro/action@v3` 为传统的分步骤配置：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 9
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      - name: Build with Astro
        run: pnpm build
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## 📊 验证结果

### 配置验证
```bash
# 检查 Pages 配置
curl -s -H "Authorization: token $(gh auth token)" \
  "https://api.github.com/repos/Zijie-Tian/zijie-tian.github.io/pages" \
  | jq '{source: .source, build_type: .build_type}'

# 结果：
{
  "source": {
    "branch": "main",
    "path": "/"
  },
  "build_type": "workflow"  # ✅ 正确
}
```

### 网站访问验证
```bash
curl -I https://zijie-tian.github.io
# HTTP/2 200 ✅ 网站正常访问
```

### 本地构建验证
```bash
pnpm build
# ✅ 构建成功，生成 33 个页面
```

## 🎯 关键学习点

1. **GitHub Pages 有两种模式**:
   - `legacy`: 使用 Jekyll 自动构建
   - `workflow`: 使用 GitHub Actions 自定义构建

2. **Astro 项目必须使用 workflow 模式**:
   - Jekyll 无法理解 Astro 语法
   - 需要自定义构建流程

3. **`.nojekyll` 文件的重要性**:
   - 明确禁用 Jekyll 处理
   - 避免文件名冲突和处理错误

4. **GitHub Actions 稳定性**:
   - 官方 Actions 有时可能不稳定
   - 传统分步骤配置更可控

## 🔧 故障排除清单

如果遇到类似问题，按以下顺序检查：

1. ✅ 确认 `.nojekyll` 文件存在
2. ✅ 验证 GitHub Pages 配置为 "workflow" 模式
3. ✅ 检查 GitHub Actions 工作流语法
4. ✅ 验证本地构建成功
5. ✅ 检查仓库权限设置

## 📝 最终状态

- ✅ CI/CD 流程稳定运行
- ✅ 网站正常访问
- ✅ 自动部署正常工作
- ✅ 所有页面正确渲染

**问题已完全解决！** 🎉 
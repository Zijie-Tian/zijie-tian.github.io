# GitHub Pages 调试指南

## 🔍 问题诊断

### 当前状态检查
- ✅ **gh-pages分支存在**: 已确认
- ✅ **构建文件正确**: index.html等文件已正确生成
- ✅ **文件内容正确**: HTML包含正确的博客内容
- ❌ **GitHub Pages未启用**: 这是主要问题

### 问题原因
GitHub Pages需要在仓库设置中手动启用，即使gh-pages分支存在，GitHub也不会自动启用Pages功能。

## 🛠️ 解决方案

### 方法1: 手动启用GitHub Pages（推荐）

1. **访问仓库设置**
   - 打开 https://github.com/Zijie-Tian/zijie-tian.github.io
   - 点击 **Settings** 标签页

2. **启用Pages**
   - 在左侧菜单找到 **Pages**
   - 在 **Source** 部分选择 **Deploy from a branch**
   - **Branch**: 选择 `gh-pages`
   - **Folder**: 选择 `/ (root)`
   - 点击 **Save**

3. **等待部署**
   - GitHub会显示部署状态
   - 通常需要1-5分钟
   - 完成后会显示网站URL

### 方法2: 检查仓库可见性

确保仓库是公开的：
1. 在仓库设置中找到 **General**
2. 滚动到底部的 **Danger Zone**
3. 确认仓库是 **Public**

### 方法3: 使用GitHub Actions部署（备选）

如果手动方法不工作，可以修改部署工作流：

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
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
      
      - name: Build
        run: pnpm build
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist
      
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## 🔍 验证步骤

### 1. 检查分支内容
```bash
curl -s https://raw.githubusercontent.com/Zijie-Tian/zijie-tian.github.io/gh-pages/index.html | head -10
```

### 2. 检查Pages状态
```bash
curl -s https://api.github.com/repos/Zijie-Tian/zijie-tian.github.io/pages
```

### 3. 测试网站访问
```bash
curl -I https://zijie-tian.github.io
```

## 📋 常见问题

### Q: 为什么GitHub Pages没有自动启用？
A: GitHub Pages需要手动启用，即使有gh-pages分支也不会自动启用。

### Q: 启用后多久可以访问？
A: 通常1-5分钟，首次启用可能需要更长时间。

### Q: 如果仍然404怎么办？
A: 
1. 检查仓库是否公开
2. 确认Pages设置正确
3. 等待DNS传播（最多24小时）
4. 清除浏览器缓存

### Q: 如何确认Pages已启用？
A: 在仓库Settings > Pages中会显示绿色的部署状态和网站URL。

## 🎯 下一步

1. **立即操作**: 按照方法1手动启用GitHub Pages
2. **验证**: 等待几分钟后访问 https://zijie-tian.github.io
3. **确认**: 检查网站是否正常显示博客内容

## 📞 如需帮助

如果按照上述步骤仍然无法解决：
1. 检查GitHub Actions日志
2. 查看仓库的Issues页面
3. 确认网络连接和DNS设置 
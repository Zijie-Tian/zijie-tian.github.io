# OneDrive 集成快速设置指南

## 🎯 你的配置信息

- **Application (client) ID**: `4b36a6d5-66ae-4656-9b1f-d73b9a4f2163`
- **Directory (tenant) ID**: `2a0b75e3-76b1-4b19-bea3-f04683913749`
- **网站域名**: `https://zijie-tian-github-io.vercel.app/`

## ✅ 已完成的配置

1. ✅ Azure应用已注册
2. ✅ 项目代码已更新Client ID
3. ✅ 组件配置已更新

## 🔧 还需要完成的步骤

### 1. 在Azure Portal中添加重定向URI

1. 访问 [Azure Portal](https://portal.azure.com)
2. 进入你的应用注册：`Astro Blog OneDrive Integration`
3. 选择"身份验证"
4. 在"重定向URI"部分点击"添加URI"
5. 添加以下URI：
   ```
   https://zijie-tian-github-io.vercel.app/onedrive-demo
   ```
6. 保存配置

### 2. 配置API权限

确保已添加以下Microsoft Graph权限：
- `Files.Read.All` - 读取用户可以访问的所有文件
- `Files.ReadWrite.All` - 读写用户可以访问的所有文件  
- `User.Read` - 登录并读取用户配置文件
- `offline_access` - 维持对数据的访问权限

### 3. 启用隐式授权流程

1. 在应用注册页面，选择"身份验证"
2. 在"隐式授权和混合流"部分
3. 勾选"访问令牌"和"ID令牌"
4. 保存配置

### 4. 创建环境变量文件（可选）

在项目根目录创建 `.env` 文件：

```env
# OneDrive 集成配置
ONEDRIVE_CLIENT_ID=4b36a6d5-66ae-4656-9b1f-d73b9a4f2163
ONEDRIVE_TENANT_ID=2a0b75e3-76b1-4b19-bea3-f04683913749

# 网站配置
SITE=https://zijie-tian-github-io.vercel.app
```

### 5. 在OneDrive中准备文件夹

在你的OneDrive中创建以下文件夹结构：

```
OneDrive/
├── Blog/
│   ├── Posts/
│   │   ├── article1.md
│   │   └── article2.md
│   ├── Images/
│   │   ├── cover1.jpg
│   │   └── cover2.png
│   └── Documents/
│       ├── notes.txt
│       └── references.pdf
```

## 🚀 测试步骤

### 本地测试
1. 启动开发服务器：
   ```bash
   pnpm dev
   ```
2. 访问：`http://localhost:4321/onedrive-demo`
3. 点击"登录 Microsoft 账户"
4. 完成授权后查看文件列表

### 生产环境测试
1. 部署到Vercel后访问：
   ```
   https://zijie-tian-github-io.vercel.app/onedrive-demo
   ```
2. 测试登录和文件显示功能

## 🔧 使用方法

### 在任何页面中集成OneDrive

```astro
---
import OneDriveIntegration from '../components/OneDriveIntegration.astro';
---

<!-- 显示Blog文件夹 -->
<OneDriveIntegration 
  clientId="4b36a6d5-66ae-4656-9b1f-d73b9a4f2163" 
  folderPath="/Blog"
/>

<!-- 显示特定子文件夹 -->
<OneDriveIntegration 
  clientId="4b36a6d5-66ae-4656-9b1f-d73b9a4f2163" 
  folderPath="/Blog/Posts"
/>
```

### 在博客文章中嵌入文件列表

你可以在任何博客文章或页面中添加OneDrive文件列表：

```astro
---
import Layout from '../layouts/Layout.astro';
import OneDriveIntegration from '../components/OneDriveIntegration.astro';
---

<Layout title="我的文档库">
  <main>
    <h1>我的文档库</h1>
    <p>这里是我在OneDrive中存储的文档：</p>
    
    <OneDriveIntegration 
      clientId="4b36a6d5-66ae-4656-9b1f-d73b9a4f2163" 
      folderPath="/Documents"
    />
  </main>
</Layout>
```

## 🐛 故障排除

### 常见问题

1. **登录失败**
   - 确认重定向URI已正确配置
   - 检查Client ID是否正确
   - 验证API权限是否已授予

2. **文件加载失败**
   - 确认OneDrive中存在指定的文件夹路径
   - 检查网络连接
   - 验证访问令牌是否有效

3. **权限错误**
   - 确认已授予必要的Microsoft Graph权限
   - 检查是否需要管理员同意（企业账户）

### 调试技巧

1. 打开浏览器开发者工具查看控制台错误
2. 检查网络请求和响应
3. 验证URL重定向是否正确

## 🎉 完成！

完成上述步骤后，你就可以在博客中使用OneDrive集成功能了！

访问演示页面：`https://zijie-tian-github-io.vercel.app/onedrive-demo` 
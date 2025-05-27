# OneDrive 集成设置指南

本指南将帮助你在Astro博客中集成OneDrive文件夹内容。

## 功能特性

- ✅ 显示OneDrive指定文件夹的文件和子文件夹
- ✅ 支持多种文件类型的图标显示
- ✅ OAuth 2.0 安全认证
- ✅ 响应式设计，支持明暗主题
- ✅ 文件大小和修改时间显示
- ✅ 直接链接到OneDrive查看文件
- ✅ 支持文件上传（通过API）
- ✅ 错误处理和加载状态

## 前置要求

1. Microsoft 账户（个人或企业）
2. Azure Portal 访问权限
3. OneDrive 存储空间

## 步骤1：Azure应用注册

### 1.1 创建应用注册

1. 访问 [Azure Portal](https://portal.azure.com)
2. 搜索并进入 "Microsoft Entra ID"
3. 在左侧菜单选择 "应用注册"
4. 点击 "新注册"

### 1.2 配置应用信息

```
应用名称: Astro Blog OneDrive Integration
支持的账户类型: 任何组织目录(任何 Azure AD 目录 - 多租户)中的账户和个人 Microsoft 账户
重定向 URI: 
  - 类型: Web
  - URI: https://zijie-tian-github-io.vercel.app/onedrive-demo
  - 本地开发: http://localhost:4321/onedrive-demo
```

### 1.3 记录重要信息

注册完成后，记录以下信息：
- **应用程序(客户端) ID**: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
- **目录(租户) ID**: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

## 步骤2：配置API权限

### 2.1 添加Microsoft Graph权限

1. 在应用注册页面，选择 "API权限"
2. 点击 "添加权限"
3. 选择 "Microsoft Graph"
4. 选择 "委托的权限"
5. 添加以下权限：

```
Files.Read.All - 读取用户可以访问的所有文件
Files.ReadWrite.All - 读写用户可以访问的所有文件
User.Read - 登录并读取用户配置文件
offline_access - 维持对数据的访问权限
```

### 2.2 授予管理员同意

如果是企业账户，可能需要管理员同意这些权限。

## 步骤3：配置身份验证

### 3.1 隐式授权流程

1. 在应用注册页面，选择 "身份验证"
2. 在 "隐式授权和混合流" 部分
3. 勾选 "访问令牌" 和 "ID令牌"
4. 保存配置

### 3.2 重定向URI配置

确保重定向URI包含：
- 生产环境: `https://zijie-tian-github-io.vercel.app/onedrive-demo`
- 开发环境: `http://localhost:4321/onedrive-demo`

## 步骤4：项目配置

### 4.1 更新组件配置

在 `src/pages/onedrive-demo.astro` 中更新Client ID：

```astro
<OneDriveIntegration 
  clientId="你的Azure应用Client ID" 
  folderPath="/Blog"
/>
```

### 4.2 环境变量配置（可选）

创建 `.env` 文件：

```env
# OneDrive 配置
ONEDRIVE_CLIENT_ID=你的Azure应用Client ID
ONEDRIVE_TENANT_ID=你的Azure租户ID
```

然后在组件中使用：

```astro
---
const clientId = import.meta.env.ONEDRIVE_CLIENT_ID || 'YOUR_CLIENT_ID';
---

<OneDriveIntegration 
  clientId={clientId} 
  folderPath="/Blog"
/>
```

## 步骤5：OneDrive文件夹准备

### 5.1 创建目标文件夹

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

### 5.2 文件夹路径配置

组件支持的路径格式：
- `/Blog` - OneDrive根目录下的Blog文件夹
- `/Blog/Posts` - Blog文件夹下的Posts子文件夹
- `/Documents/Projects` - 多级路径

## 步骤6：部署和测试

### 6.1 本地测试

```bash
# 启动开发服务器
pnpm dev

# 访问测试页面
http://localhost:4321/onedrive-demo
```

### 6.2 生产部署

确保在生产环境中：
1. 更新Azure应用的重定向URI为生产域名
2. 使用环境变量管理敏感信息
3. 启用HTTPS

## 使用方法

### 基础使用

```astro
---
import OneDriveIntegration from '../components/OneDriveIntegration.astro';
---

<OneDriveIntegration 
  clientId="your-client-id" 
  folderPath="/Blog"
/>
```

### 高级配置

```astro
<!-- 显示特定文件夹 -->
<OneDriveIntegration 
  clientId="your-client-id" 
  folderPath="/Blog/Posts"
/>

<!-- 显示根目录 -->
<OneDriveIntegration 
  clientId="your-client-id" 
  folderPath="/"
/>
```

## API端点使用

### 获取文件列表

```javascript
// GET /api/onedrive
const response = await fetch('/api/onedrive?' + new URLSearchParams({
  access_token: 'user-access-token',
  folder_path: '/Blog',
  include_content: 'false'
}));

const data = await response.json();
```

### 上传文件

```javascript
// POST /api/onedrive
const formData = new FormData();
formData.append('access_token', 'user-access-token');
formData.append('file', fileObject);
formData.append('folder_path', '/Blog');

const response = await fetch('/api/onedrive', {
  method: 'POST',
  body: formData
});
```

## 故障排除

### 常见问题

1. **登录失败**
   - 检查Client ID是否正确
   - 确认重定向URI配置正确
   - 验证API权限是否已授予

2. **文件加载失败**
   - 确认OneDrive文件夹路径存在
   - 检查访问令牌是否有效
   - 验证网络连接

3. **权限错误**
   - 确认已授予必要的Microsoft Graph权限
   - 检查是否需要管理员同意

### 调试技巧

1. 打开浏览器开发者工具查看控制台错误
2. 检查网络请求和响应
3. 验证访问令牌的有效性

## 安全考虑

1. **访问令牌安全**
   - 访问令牌存储在localStorage中
   - 令牌会在1小时后过期
   - 不要在客户端代码中硬编码敏感信息

2. **权限最小化**
   - 只请求必要的API权限
   - 定期审查和更新权限

3. **HTTPS要求**
   - 生产环境必须使用HTTPS
   - Azure应用要求安全的重定向URI

## 扩展功能

### 可能的增强

1. **文件预览**
   - 支持图片预览
   - PDF文件在线查看
   - 文本文件内容显示

2. **文件管理**
   - 文件重命名
   - 文件删除
   - 文件夹创建

3. **搜索功能**
   - 文件名搜索
   - 文件内容搜索
   - 文件类型过滤

4. **批量操作**
   - 批量下载
   - 批量上传
   - 批量删除

## 相关资源

- [Microsoft Graph API 文档](https://docs.microsoft.com/en-us/graph/)
- [OneDrive API 参考](https://docs.microsoft.com/en-us/graph/api/resources/onedrive)
- [Azure应用注册指南](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app)
- [OAuth 2.0 授权流程](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-implicit-grant-flow)

## 许可证

本集成遵循项目的MIT许可证。 
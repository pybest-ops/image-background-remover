# 🚀 Deployment Guide - Cloudflare Pages

## 方法 1: 使用 Wrangler CLI 部署（推荐）

### 前置要求
- Node.js 18+
- npm
- Cloudflare 账号

### 步骤

1. **登录 Cloudflare**
```bash
npx wrangler login
```

2. **设置 API Key**
```bash
npx wrangler secret put REMOVE_BG_API_KEY
# 然后输入你的 remove.bg API key
```

3. **构建并部署**
```bash
cd bg-remover
npm run build
npm run deploy
```

4. **访问你的网站**
Cloudflare 会显示你的网站 URL，例如：`https://bg-remover.pages.dev`

## 方法 2: 通过 Git 部署

### 前置要求
- GitHub 或 GitLab 账号
- Cloudflare 账号

### 步骤

1. **推送到 Git**
```bash
cd bg-remover
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/bg-remover.git
git push -u origin main
```

2. **在 Cloudflare Dashboard 创建项目**
   - 访问 https://dash.cloudflare.com
   - 进入 Workers & Pages
   - 创建项目 > 连接到 Git
   - 选择你的仓库

3. **配置构建设置**
   - 构建命令: `npm run build`
   - 输出目录: `out`

4. **设置环境变量**
   - 进入项目设置 > Environment variables
   - 添加变量: `REMOVE_BG_API_KEY`
   - 值: 你的 remove.bg API key

5. **部署**
   - 点击 "Save and Deploy"
   - 等待构建完成

## 方法 3: 直接上传（适合快速测试）

### 步骤

1. **本地构建**
```bash
cd bg-remover
npm run build
```

2. **在 Cloudflare Dashboard 创建项目**
   - Workers & Pages > 创建项目 > 上传资产
   - 上传 `out` 文件夹中的所有文件

3. **设置环境变量**
   - 项目设置：Environment variables
   - 添加 `REMOVE_BG_API_KEY`

## 验证部署

1. 访问你的 Cloudflare Pages URL
2. 上传一张图片
3. 点击 "Remove Background"
4. 下载处理后的图片

## 常见问题

### Q: 提示 "API key not configured"
A: 确保在 Cloudflare Dashboard 或通过 wrangler CLI 设置了 `REMOVE_BG_API_KEY` 环境变量。

### Q: API 调用失败
A: 检查：
- remove.bg API key 是否有效
- 账户是否有足够的配额（免费账户每月 50 次调用）
- 图片格式是否支持（PNG, JPG, JPEG, WEBP）

### Q: 图片上传失败
A: 确保图片大小不超过限制（remove.bg 限制为 25MB）

### Q: 如何更新网站？
A:
- 如果使用 Git：推送代码，Cloudflare 会自动重新部署
- 如果使用 wrangler：重新运行 `npm run build && npm run deploy`

## 性能优化建议

1. **启用缓存**: Cloudflare Pages 会自动缓存静态资源
2. **使用 CDN**: Cloudflare 全球边缘网络已启用
3. **图片压缩**: 可以在前端添加图片压缩以减少 API 调用时间
4. **错误处理**: 已在代码中实现，可以进一步改进用户体验

## 成本估算

### Cloudflare Pages
- **免费**: 每月 500 次构建
- **付费**: $5/月起

### remove.bg API
- **免费**: 50 次调用/月
- **付费**: $0.20/次起

### 总成本
- 个人使用：免费（50 次/月）
- 小型项目：$10-20/月
- 大型项目：根据实际使用量

## 安全建议

1. **保护 API Key**: 不要将 API key 提到公共仓库
2. **使用环境变量**: 已配置，不要硬编码
3. **限制图片大小**: 已在代码中实现
4. **添加速率限制**: 可选，在 Cloudflare Workers 中实现

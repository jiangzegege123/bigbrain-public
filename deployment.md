# BigBrain Vercel 部署指南

本项目从 GitLab 部署到 Vercel 的完整指南。

## 项目结构

```
bigbrain/
├── frontend/           # React + Vite前端
├── backend/           # Express.js后端
├── deploy-setup.sh    # 初始部署设置脚本
└── sync-to-github.sh  # 代码同步脚本
```

## 初次部署

### 1. 创建 GitHub 仓库

1. 登录 GitHub，创建新的私有仓库 `bigbrain-deploy`
2. **不要**添加任何初始文件

### 2. 运行部署设置

```bash
./deploy-setup.sh YOUR_GITHUB_USERNAME
```

### 3. 在 Vercel 上部署

#### 前端部署：

- Root Directory: `frontend`
- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

#### 后端部署（可选）：

- Root Directory: `backend`
- Framework: Other
- Build Command: `npm install`

### 4. 配置环境变量

如果部署了后端，在前端项目添加环境变量：

- `VITE_BACKEND_URL`: 后端部署 URL

## 日常开发流程

### 更新部署

```bash
# 开发完成后，同步到两个仓库
./sync-to-github.sh
```

这会：

1. 提交您的更改到 GitLab
2. 推送到 GitHub
3. 触发 Vercel 自动重新部署

### 手动操作

```bash
# 提交到GitLab
git add -A
git commit -m "Your commit message"
git push origin master

# 同步到GitHub（触发Vercel部署）
git push github master
```

## 技术说明

### 前端配置

- 使用环境变量 `VITE_BACKEND_URL` 在生产环境中配置 API 端点
- 本地开发仍使用 `http://localhost:5005`

### 后端配置

- 创建了无服务器存储适配器 (`backend/src/storage.js`)
- 在 Vercel 环境中使用内存存储
- 本地开发仍使用文件存储

### 数据持久性

⚠️ **重要**: 由于 Vercel 无服务器特性，后端数据在函数重启后会丢失。这对于作业演示是可以接受的。

## 故障排除

### GitHub 推送失败

1. 检查 SSH 密钥配置
2. 或使用 HTTPS 认证
3. 确认仓库名称和用户名正确

### Vercel 构建失败

1. 检查 Node.js 版本（推荐 16+）
2. 确认 Root Directory 设置正确
3. 检查依赖是否完整

### API 调用失败

1. 确认后端 URL 配置正确
2. 检查 CORS 设置
3. 确认环境变量设置

## 相关链接

- [Vercel Dashboard](https://vercel.com/dashboard)
- [项目部署文档](deployment.md)

# Render 部署完整指南

## ✅ 已完成的准备工作

1. ✅ 添加 PostgreSQL 依赖 (`pg` 和 `@types/pg`)
2. ✅ 更新数据库配置支持 PostgreSQL
3. ✅ 添加健康检查端点 `/api/health`
4. ✅ 配置 CORS 允许前端域名
5. ✅ 创建 `render.yaml` 自动部署配置
6. ✅ 更新前端环境变量配置

---

## 📋 部署步骤

### Step 1: 推送代码到 GitHub（5分钟）

```bash
cd "C:\Users\lxfom\Desktop\项目demo\全栈项目-个人博客"

# 初始化 Git（如果还没有）
git init

# 添加所有文件
git add .

# 提交
git commit -m "Prepare for Render deployment"

# 关联远程仓库（替换为你的GitHub仓库地址）
git remote add origin https://github.com/你的用户名/你的仓库名.git

# 推送到 GitHub
git push -u origin main
```

**注意**: 
- 确保 `.gitignore` 包含敏感文件（`.env`, `node_modules`, `data/*.db`）
- 如果已有GitHub仓库，直接推送即可

---

### Step 2: 注册 Render 账户（2分钟）

1. 访问 [https://render.com](https://render.com)
2. 点击 "Get Started for Free"
3. 使用 GitHub 账户登录（推荐）
4. 完成注册

---

### Step 3: 部署后端 API（10分钟）

#### 方法A: 使用 render.yaml 自动部署（推荐）

1. 在 Render Dashboard 点击 **"New +"** → **"Blueprint"**
2. 连接你的 GitHub 仓库
3. Render 会自动读取 `render.yaml` 配置
4. 点击 **"Apply"** 开始部署
5. 等待所有服务部署完成（约5-10分钟）

#### 方法B: 手动部署

**3.1 创建 PostgreSQL 数据库**
1. 在 Render Dashboard 点击 **"New +"** → **"PostgreSQL"**
2. 填写信息：
   - Name: `blog-db`
   - Database: `blog_cms`
   - User: `blog_user`
   - Region: Oregon (免费)
   - Plan: Free
3. 点击 **"Create Database"**
4. **复制 Internal Connection URL**（稍后使用）

**3.2 创建 Web Service（后端）**
1. 点击 **"New +"** → **"Web Service"**
2. 连接 GitHub 仓库
3. 配置：
   - Name: `blog-api`
   - Region: Oregon
   - Branch: main
   - Root Directory: `server`
   - Runtime: Node
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start:prod`
   - Plan: Free
4. 添加环境变量：
   ```
   NODE_ENV=production
   PORT=10000
   DB_TYPE=postgres
   DATABASE_URL=<粘贴刚才复制的数据库URL>
   JWT_SECRET=<生成一个随机字符串>
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=<稍后填写前端URL>
   ```
5. 点击 **"Create Web Service"**
6. 等待部署完成
7. **复制后端URL**（例如: `https://blog-api-xxx.onrender.com`）

---

### Step 4: 部署前端（10分钟）

**4.1 创建 Static Site**
1. 点击 **"New +"** → **"Static Site"**
2. 连接 GitHub 仓库
3. 配置：
   - Name: `blog-frontend`
   - Region: Oregon
   - Branch: main
   - Root Directory: `client`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
   - Plan: Free
4. 添加环境变量：
   ```
   VITE_API_URL=https://blog-api-xxx.onrender.com/api
   ```
   （替换为实际的后端URL）
5. 点击 **"Create Static Site"**
6. 等待部署完成
7. **复制前端URL**（例如: `https://blog-frontend-xxx.onrender.com`）

---

### Step 5: 更新后端环境变量（2分钟）

1. 回到后端 Web Service 设置
2. 编辑环境变量
3. 更新 `FRONTEND_URL` 为前端URL：
   ```
   FRONTEND_URL=https://blog-frontend-xxx.onrender.com
   ```
4. 保存并触发重新部署

---

### Step 6: 测试访问（2分钟）

1. 打开浏览器访问前端URL
2. 测试功能：
   - ✅ 首页加载
   - ✅ 用户注册/登录
   - ✅ 发布文章
   - ✅ 评论功能
   - ✅ 标签管理（admin）

---

## 🔧 常见问题排查

### 问题1: 后端启动失败

**检查日志**:
```bash
# 在 Render Dashboard 查看 Logs 标签
```

**常见原因**:
- 数据库连接失败 → 检查 `DATABASE_URL` 是否正确
- 端口错误 → 确保使用 `PORT` 环境变量（Render默认10000）
- 依赖缺失 → 检查 `package.json` 是否包含 `pg`

### 问题2: 前端无法连接后端

**检查**:
1. 前端环境变量 `VITE_API_URL` 是否正确
2. 后端 CORS 配置是否包含前端域名
3. 浏览器控制台是否有 CORS 错误

**解决**:
- 重新构建前端（修改环境变量后需要重新部署）
- 检查后端日志确认 CORS 配置生效

### 问题3: 数据库迁移问题

**Render PostgreSQL 会自动创建表**，但如果遇到问题：

1. 检查 TypeORM 配置中的 `synchronize: true`
2. 查看后端日志是否有数据库错误
3. 必要时手动运行迁移

### 问题4: 冷启动慢

**Render 免费套餐特性**:
- 15分钟无访问会休眠
- 下次访问需要15-30秒唤醒

**解决方案**:
- 升级到付费套餐（$7/月）
- 或使用外部监控服务定期访问保持活跃

---

## 🌐 自定义域名（可选）

### 为前端添加自定义域名

1. 在 Render Frontend 设置页面
2. 点击 **"Custom Domains"**
3. 添加你的域名（例如: `blog.yourdomain.com`）
4. 按照提示配置 DNS CNAME 记录
5. 等待 DNS 传播（最多48小时）
6. 自动 HTTPS 证书生效

### 为后端添加自定义域名

同样步骤，但通常不需要（前端通过 API URL 访问）

---

## 💰 成本说明

### 免费套餐限制

| 资源 | 限制 |
|------|------|
| Web Services | 每月750小时免费 |
| PostgreSQL | 512MB 存储，90天过期 |
| Static Sites | 无限，100GB 带宽/月 |
| 冷启动 | 15分钟无访问休眠 |

### 升级建议

**个人博客**: 免费套餐足够
**生产环境**: 
- Web Service: $7/月（无冷启动）
- PostgreSQL: $7/月（7GB存储，永不过期）

**总计**: $14/月

---

## 📝 重要提醒

### 安全注意事项

1. **不要提交 `.env` 文件到 Git**
   - 确保 `.gitignore` 包含 `.env`
   
2. **使用强密码**
   - JWT_SECRET: 至少32位随机字符串
   - 管理员密码: 首次登录后立即修改

3. **定期备份数据库**
   - Render 免费版数据库90天后过期
   - 导出重要数据定期备份

### 性能优化

1. **启用 CDN**
   - Render Static Site 已有全球CDN
   
2. **图片优化**
   - 压缩图片后再上传
   - 考虑使用云存储（如 Cloudinary）

3. **数据库索引**
   - 为常用查询字段添加索引
   - 优化慢查询

---

## 🎯 部署检查清单

- [ ] 代码已推送到 GitHub
- [ ] Render 账户已注册
- [ ] PostgreSQL 数据库已创建
- [ ] 后端 Web Service 已部署
- [ ] 前端 Static Site 已部署
- [ ] 环境变量已正确配置
- [ ] CORS 配置已更新
- [ ] 健康检查端点正常
- [ ] 前端可以访问后端API
- [ ] 所有功能测试通过
- [ ] （可选）自定义域名已配置

---

## 📞 获取帮助

如果遇到问题：

1. 查看 Render Logs 标签页
2. 检查浏览器控制台错误
3. 验证环境变量配置
4. 参考 Render 官方文档: https://render.com/docs

---

## ✨ 部署完成！

恭喜！你的博客现在已经部署到公网，可以通过以下地址访问：

- **前端**: `https://blog-frontend-xxx.onrender.com`
- **后端API**: `https://blog-api-xxx.onrender.com/api`

享受你的在线博客吧！🎉

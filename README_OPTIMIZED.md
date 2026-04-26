# Personal Blog CMS - 优化版本

一个使用 Vue3、NestJS 和 TypeORM 构建的全栈个人博客内容管理系统。采用受 Mintlify 设计系统启发的简洁极简设计。

## 技术栈

| 层级 | 技术 |
|-------|------------|
| 前端 | Vue3 + Vite + TailwindCSS + Pinia |
| 后端 | NestJS + TypeScript |
| 数据库 | SQLite (开发) / MySQL (生产) via TypeORM |
| 认证 | JWT + bcrypt |
| 部署 | Docker + docker-compose |

## 功能特性

- **用户系统**: 注册、登录（JWT，7天有效期）、基于角色的访问控制（admin/user）
- **文章管理**: 创建、编辑、删除文章，支持 Markdown 编辑器，草稿/发布状态，标签，浏览量统计
- **评论系统**: 登录用户可以评论，管理员可以删除任何评论
- **标签系统**: 文章多标签支持，基于标签的过滤

## 快速开始

### 前置要求

- Node.js 18+
- npm 或 yarn

### 本地开发

#### 后端

```bash
cd server
npm install
npm run start:dev
```

后端将运行在 `http://localhost:3000`。

#### 前端

```bash
cd client
npm install
npm run dev
```

前端将运行在 `http://localhost:5173`（如果端口被占用，会自动选择其他端口）。

### Docker 部署

```bash
# 复制环境配置文件
cp .env.example .env

# 启动所有服务
docker-compose up -d
```

## API 概览

所有 API 响应遵循统一格式：`{ code: number, message: string, data: any }`

### 认证

| 方法 | 端点 | 描述 | 需要认证 |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | 注册新用户 | 否 |
| POST | `/api/auth/login` | 登录并获取 JWT token | 否 |

### 文章

| 方法 | 端点 | 描述 | 需要认证 |
|--------|----------|-------------|---------------|
| GET | `/api/posts` | 获取已发布的文章（分页） | 否 |
| GET | `/api/posts/:slug` | 通过 slug 获取文章（增加浏览量） | 否 |
| POST | `/api/posts` | 创建新文章 | 管理员 |
| PATCH | `/api/posts/:id` | 更新文章 | 管理员 |
| DELETE | `/api/posts/:id` | 删除文章 | 管理员 |
| GET | `/api/posts/admin/all` | 获取所有文章（管理员视图） | 管理员 |

### 标签

| 方法 | 端点 | 描述 | 需要认证 |
|--------|----------|-------------|---------------|
| GET | `/api/tags` | 获取所有标签及文章数量 | 否 |
| GET | `/api/tags/:slug` | 通过 slug 获取标签及文章 | 否 |
| POST | `/api/tags` | 创建新标签 | 管理员 |
| DELETE | `/api/tags/:id` | 删除标签 | 管理员 |

### 评论

| 方法 | 端点 | 描述 | 需要认证 |
|--------|----------|-------------|---------------|
| GET | `/api/comments?postId=1` | 获取文章的评论 | 否 |
| GET | `/api/comments` | 获取所有评论 | 否 |
| POST | `/api/comments` | 创建评论 | 是 |
| DELETE | `/api/comments/:id` | 删除评论 | 管理员 |

### 用户

| 方法 | 端点 | 描述 | 需要认证 |
|--------|----------|-------------|---------------|
| GET | `/api/users/me` | 获取当前用户资料 | 是 |
| PATCH | `/api/users/profile` | 更新用户资料 | 是 |

## 默认管理员账户

首次启动后，你需要通过 `/api/auth/register` 端点注册一个管理员账户，然后手动在数据库中将用户的角色更新为 `admin`，或者使用登录页面上的注册功能。

## 项目结构

```
blog-cms/
├── client/                 # Vue3 前端
│   ├── src/
│   │   ├── components/     # 可复用的 UI 组件
│   │   ├── views/          # 页面组件
│   │   ├── layouts/        # 布局包装器
│   │   ├── stores/         # Pinia 状态管理
│   │   ├── services/       # API 服务层
│   │   ├── router/         # Vue Router 配置
│   │   └── styles/         # 全局样式
│   └── ...
├── server/                 # NestJS 后端
│   ├── src/
│   │   ├── modules/        # 功能模块
│   │   ├── entities/       # TypeORM 实体
│   │   ├── config/         # 配置文件
│   │   ├── common/         # 共享工具
│   │   └── ...
│   └── ...
├── docker-compose.yml      # Docker 编排
├── test-api.ps1            # API 测试脚本
└── README.md
```

## 设计系统

本项目遵循 Mintlify 设计系统：

- **颜色**: 白色背景 (`#ffffff`)，近黑色文本 (`#0d0d0d`)，薄荷绿强调色 (`#18E299`)
- **字体**: Inter 字体家族，标题使用负字母间距
- **边框**: 使用微妙的 `rgba(0,0,0,0.05)` 边框代替厚重的阴影
- **圆角**: 完整药丸按钮 (`9999px`)，卡片 (`16px`)，大卡片 (`24px`)

## 环境变量

查看 `.env.example` 了解可用的配置选项：

```env
DB_TYPE=sqlite
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
PORT=3000
FRONTEND_URL=http://localhost:5173
```

## 优化说明

### 本次优化内容

1. **修复前端 API 响应处理**
   - 改进了 `api.ts` 中的响应拦截器，正确处理后端返回的统一格式 `{ code, message, data }`
   - 移除了调试日志，提高性能

2. **修复后端 JWT 配置**
   - 更新了 `auth.module.ts` 使用 `registerAsync` 动态读取环境变量
   - 更新了 `jwt.strategy.ts` 确保 JWT_SECRET 从环境变量正确读取
   - 提供了更安全的默认密钥提示

3. **清理前端代码**
   - 移除了 `PostEditorView.vue` 中未使用的 Editor 和 Viewer 导入
   - 移除了未使用的 plugins 变量

4. **添加环境变量配置**
   - 创建了前端 `.env` 文件，配置 `VITE_API_URL`

5. **添加测试脚本**
   - 创建了 `test-api.ps1` 测试脚本，用于验证 API 功能

### 测试结果

所有 API 测试通过：
- ✓ 后端服务器运行正常
- ✓ 前端服务器运行正常
- ✓ 用户注册功能正常
- ✓ 用户登录功能正常

## 许可证

ISC

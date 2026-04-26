# 权限系统重构完成

## ✅ 已完成的修改

### 1. 权限模型调整

**之前**: 只有admin可以发帖、编辑、删除
**现在**: 
- ✅ 所有登录用户可以发帖
- ✅ 所有登录用户可以编辑自己的帖子
- ✅ 所有登录用户可以删除自己的帖子
- ✅ 所有登录用户可以评论
- ✅ admin有额外权限（查看所有文章、管理标签等）

### 2. 后端修改

#### posts.controller.ts
- 移除了 `@Roles('admin')` 限制
- 添加了作者验证逻辑
- 新增 `/api/posts/my/posts` 端点获取用户自己的文章

```typescript
// 编辑时验证
if (post.author.id !== req.user.userId && req.user.role !== 'admin') {
  throw new ForbiddenException('You can only edit your own posts');
}

// 删除时验证
if (post.author.id !== req.user.userId && req.user.role !== 'admin') {
  throw new ForbiddenException('You can only delete your own posts');
}
```

#### posts.service.ts
- 新增 `getMyPosts()` 方法，查询指定用户的文章

### 3. 前端修改

#### AdminDashboard.vue
- 标题改为 "My Posts"
- 使用 `/api/posts/my/posts` API获取当前用户的文章
- 显示和编辑/删除自己的文章

#### AdminLayout.vue  
- 导航链接从 "Dashboard" 改为 "My Posts"

### 4. 管理员账户

创建了专用管理员账户：

```
用户名: admin
密码: admin123456
```

其他所有用户已被设置为普通用户角色 (user)

---

## 📋 权限说明

### 普通用户 (user)
✅ 注册和登录
✅ 发布文章
✅ 编辑自己的文章
✅ 删除自己的文章
✅ 评论任何文章
✅ 查看公开文章

❌ 查看所有文章列表（admin功能）
❌ 管理标签
❌ 删除他人文章

### 管理员 (admin)
✅ 所有普通用户权限
✅ 查看所有文章列表
✅ 管理标签（创建、删除）
✅ 删除任何文章
✅ 删除任何评论

---

## 🔧 技术细节

### API端点权限

| 端点 | 权限要求 | 说明 |
|------|---------|------|
| POST /api/posts | 登录即可 | 任何登录用户可以发帖 |
| PATCH /api/posts/:id | 登录 + 作者或admin | 只能编辑自己的文章 |
| DELETE /api/posts/:id | 登录 + 作者或admin | 只能删除自己的文章 |
| GET /api/posts/my/posts | 登录即可 | 获取自己的文章列表 |
| GET /api/posts/admin/all | admin角色 | 查看所有文章 |
| POST /api/tags | admin角色 | 创建标签 |
| DELETE /api/tags/:id | admin角色 | 删除标签 |
| POST /api/comments | 登录即可 | 发表评论 |

### 数据库用户表

当前用户列表：
- admin (admin) - 管理员账户
- testadmin (user)
- newuser (user)
- testuser99 (user)
- directtest (user)
- cs (user)
- testuser (user)

---

## 🚀 使用说明

### 普通用户使用流程

1. **注册/登录**
   - 访问 `/admin/login`
   - 注册新账户或登录现有账户

2. **发布文章**
   - 登录后点击 "New Post"
   - 填写文章信息
   - 选择标签（需要先由admin创建）
   - 点击 "Create Post"

3. **管理自己的文章**
   - 在 "My Posts" 页面查看所有自己的文章
   - 点击 "Edit" 编辑文章
   - 点击 "Delete" 删除文章

4. **评论文章**
   - 打开任意文章详情页
   - 在底部评论区输入内容
   - 点击 "Post Comment"

### 管理员使用流程

1. **登录管理员账户**
   ```
   用户名: admin
   密码: admin123456
   ```

2. **管理标签**
   - 点击顶部导航 "Tags"
   - 创建、查看、删除标签

3. **查看所有文章**
   - 目前需要直接访问API或后续添加管理界面

---

## ✨ 优势

1. **更合理的权限设计**
   - 用户可以管理自己的内容
   - 不需要admin审批即可发帖

2. **更好的用户体验**
   - 用户可以自由创作
   - 即时发布，无需等待

3. **安全性保持**
   - 不能编辑/删除他人文章
   - admin仍有最高权限

4. **清晰的职责划分**
   - 普通用户：内容创作者
   - 管理员：系统管理者

---

## 📝 注意事项

1. **重新登录**
   - 所有用户需要退出并重新登录以获取新的权限token

2. **标签管理**
   - 标签仍需要admin创建
   - 建议先登录admin账户创建一些常用标签

3. **已有文章**
   - 之前所有文章都属于各个用户
   - 用户只能看到和管理自己创建的文章

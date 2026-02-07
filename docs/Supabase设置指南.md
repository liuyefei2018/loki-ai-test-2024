# Supabase 设置指南

## 概述
本文档指导您设置LokiAI项目所需的Supabase环境。

## 步骤1：创建Supabase账号和项目

### 1.1 访问Supabase
- 访问 https://supabase.com/
- 点击"Start your project"

### 1.2 登录
- 使用GitHub账号登录（推荐）
- 如果没有GitHub账号，使用邮箱注册

### 1.3 创建组织
- 组织名称：`LokiAI`
- 描述：`技术管理者AI助手SaaS平台`

### 1.4 创建项目
- 项目名称：`loki-ai-production`
- 数据库密码：`生成强密码并保存到密码管理器`
- 区域选择：`新加坡（Singapore）` 或 `日本（Tokyo）`（亚洲用户访问快）
- 定价计划：`免费计划（Free Tier）`（足够初期使用）

### 1.5 等待初始化
- 数据库初始化需要1-2分钟
- 完成后进入项目仪表板

## 步骤2：设置数据库

### 2.1 运行数据库迁移
1. 进入 **SQL Editor**
2. 点击 **New query**
3. 复制 `database/schema.sql` 内容
4. 粘贴到编辑器中
5. 点击 **Run** 执行SQL

### 2.2 验证表创建
1. 进入 **Table Editor**
2. 确认以下表已创建：
   - `user_profiles`
   - `one_on_one_conversations`
   - `team_mood_data`
   - `okrs`
   - `subscriptions`
   - `api_usage`
   - `content_templates`
   - `teams`
   - `team_members`

## 步骤3：配置身份验证

### 3.1 设置电子邮件认证
1. 进入 **Authentication** → **Providers**
2. 确保 **Email** 已启用
3. 配置SMTP设置（可选，用于发送验证邮件）

### 3.2 配置网站URL
1. 进入 **Authentication** → **URL Configuration**
2. 设置：
   - Site URL: `http://localhost:3000`（开发环境）
   - Additional Redirect URLs: 添加生产环境URL

### 3.3 启用第三方登录（可选）
1. GitHub OAuth（推荐用于开发者）
2. Google OAuth（用户友好）

## 步骤4：获取API密钥

### 4.1 项目设置页面
1. 进入 **Project Settings** → **API**
2. 记录以下信息：
   - Project URL（Supabase URL）
   - Project API keys
     - `anon` public key（前端使用）
     - `service_role` secret key（仅后端使用，保密！）

### 4.2 数据库连接信息
- Host: 在 **Connection string** 中查看
- Port: `5432`
- Database name: `postgres`
- Username: `postgres`

## 步骤5：设置环境变量

### 5.1 创建环境变量文件
在项目根目录（src/）创建 `.env.local` 文件：

```bash
# Supabase配置
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# 数据库连接（直接连接，可选）
DATABASE_URL=postgresql://postgres:your-password@db.your-project-ref.supabase.co:5432/postgres

# 应用配置
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# AI服务配置（后续添加）
NEXT_PUBLIC_CLAUDE_API_KEY=your-claude-api-key
NEXT_PUBLIC_OPENAI_API_KEY=your-openai-api-key

# 支付服务（后续添加）
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_SECRET_KEY=your-stripe-secret-key
```

### 5.2 安全注意事项
1. **永远不要提交** `.env.local` 到Git仓库
2. 确保 `.env.local` 在 `.gitignore` 中
3. `SUPABASE_SERVICE_ROLE_KEY` 具有完全访问权限，必须保密
4. 生产环境使用Vercel环境变量或类似服务

## 步骤6：配置行级安全（RLS）

### 6.1 启用RLS
所有表默认启用了行级安全。检查并确保以下策略：

### 6.2 为用户配置表创建策略
```sql
-- 用户只能访问自己的配置
CREATE POLICY "用户只能访问自己的配置" ON user_profiles
FOR ALL USING (auth.uid() = user_id);

-- 启用对所有操作的RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
```

### 6.3 为其他表创建类似策略
所有用户数据表都应遵循相同模式：用户只能访问自己的数据。

## 步骤7：设置数据库函数和触发器

### 7.1 检查自动创建的触发器
`schema.sql` 已包含：
- `update_updated_at_column()` 函数
- 所有表的 `updated_at` 触发器

### 7.2 创建实用函数
在SQL Editor中运行以下函数：

```sql
-- 获取用户统计信息（已在schema.sql中）
SELECT * FROM get_user_usage_stats('user-uuid-here');

-- 查看每日使用统计
REFRESH MATERIALIZED VIEW daily_usage_stats;
SELECT * FROM daily_usage_stats;
```

## 步骤8：测试连接

### 8.1 安装Supabase客户端
```bash
npm install @supabase/supabase-js
```

### 8.2 创建Supabase客户端工具
在 `src/lib/supabase.ts` 中：

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### 8.3 测试连接
创建测试页面或API路由验证连接。

## 步骤9：生产环境配置

### 9.1 自定义域名
1. 进入 **Settings** → **API**
2. 在 **Custom API Domains** 添加您的域名
3. 配置DNS记录

### 9.2 备份策略
1. 进入 **Database** → **Backups**
2. 设置自动备份频率
3. 配置点时间恢复（PITR）

### 9.3 监控和日志
1. 进入 **Logs** 查看API请求
2. 设置报警规则
3. 集成Sentry或类似监控

## 步骤10：安全最佳实践

### 10.1 API密钥管理
1. 定期轮换API密钥
2. 限制密钥权限
3. 使用环境变量，不在代码中硬编码

### 10.2 数据库安全
1. 启用SSL连接
2. 使用连接池
3. 定期审计数据库权限

### 10.3 网络安全
1. 启用防火墙规则
2. 限制IP访问（如果需要）
3. 使用SSL/TLS

## 常见问题

### Q: 免费计划有哪些限制？
**A**: 免费计划限制：
- 500MB数据库空间
- 1GB带宽/月
- 2个项目
- 无PITR（点时间恢复）
- 足够MVP和早期阶段使用

### Q: 如何升级到付费计划？
**A**: 进入 **Settings** → **Billing**，选择适合的计划：
- Pro计划：$25/月，更多资源
- Enterprise：定制需求

### Q: 数据库连接失败怎么办？
**A**: 检查：
1. 防火墙是否阻止5432端口
2. 连接字符串是否正确
3. IP是否在允许列表中（Supabase默认允许所有）

### Q: 如何迁移数据？
**A**: 使用Supabase Dashboard中的导入/导出功能，或使用pg_dump。

## 下一步

### 立即执行
1. [ ] 创建Supabase账号和项目
2. [ ] 运行数据库迁移（schema.sql）
3. [ ] 获取API密钥并配置环境变量
4. [ ] 测试数据库连接

### 本周内完成
1. [ ] 配置身份验证和用户管理
2. [ ] 设置行级安全策略
3. [ ] 创建测试用户和数据
4. [ ] 集成到Next.js应用

### 生产准备
1. [ ] 配置自定义域名
2. [ ] 设置备份策略
3. [ ] 配置监控和报警
4. [ ] 安全审计

## 支持资源

- [Supabase官方文档](https://supabase.com/docs)
- [Supabase Discord社区](https://discord.supabase.com/)
- [GitHub Issues](https://github.com/supabase/supabase/issues)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/supabase)

---

**最后更新**: 2026-02-07  
**更新频率**: 每月检查，根据Supabase更新调整
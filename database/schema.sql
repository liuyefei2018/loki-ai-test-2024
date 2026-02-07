-- LokiAI 数据库Schema设计
-- 版本: 1.0
-- 创建日期: 2026-02-07
-- 描述: 为LokiAI SaaS产品设计的PostgreSQL表结构

-- 启用必要的扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. 用户配置表 (扩展Supabase Auth用户)
-- Supabase Auth已经提供了auth.users表，这里创建用户配置表来存储额外信息
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  avatar_url TEXT,
  company VARCHAR(255),
  position VARCHAR(100),
  team_size VARCHAR(50), -- '1-10', '11-50', '51-200', '200+'
  industry VARCHAR(100),
  subscription_tier VARCHAR(50) DEFAULT 'free', -- 'free', 'basic', 'pro', 'enterprise'
  subscription_status VARCHAR(50) DEFAULT 'inactive', -- 'active', 'canceled', 'past_due'
  subscription_ends_at TIMESTAMP WITH TIME ZONE,
  credits_balance INTEGER DEFAULT 0,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 索引
  INDEX idx_user_profiles_user_id (user_id),
  INDEX idx_user_profiles_email (email),
  INDEX idx_user_profiles_subscription_tier (subscription_tier),
  INDEX idx_user_profiles_subscription_status (subscription_status)
);

-- 2. 1v1谈话记录表
CREATE TABLE IF NOT EXISTS one_on_one_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  employee_name VARCHAR(255) NOT NULL,
  employee_role VARCHAR(255),
  conversation_type VARCHAR(100) DEFAULT 'regular', -- 'regular', 'performance', 'career', 'difficult'
  conversation_date DATE,
  status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'scheduled', 'completed', 'cancelled'
  
  -- 输入数据
  recent_performance TEXT,
  conversation_goals TEXT,
  concerns TEXT,
  additional_context TEXT,
  
  -- AI生成内容
  agenda_outline JSONB, -- 结构化议程
  questions_suggestions JSONB, -- 建议问题列表
  talking_points JSONB, -- 谈话要点
  potential_responses JSONB, -- 预期回应
  advice_recommendations JSONB, -- 建议和推荐
  follow_up_actions JSONB, -- 后续行动
  
  -- 元数据
  tokens_used INTEGER DEFAULT 0,
  ai_model VARCHAR(100) DEFAULT 'claude-3-5-sonnet',
  is_template BOOLEAN DEFAULT FALSE,
  template_name VARCHAR(255),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- 索引
  INDEX idx_one_on_one_user_id (user_id),
  INDEX idx_one_on_one_status (status),
  INDEX idx_one_on_one_conversation_date (conversation_date),
  INDEX idx_one_on_one_created_at (created_at)
);

-- 3. 团队情绪数据表
CREATE TABLE IF NOT EXISTS team_mood_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  team_name VARCHAR(255) NOT NULL,
  period_start DATE NOT NULL, -- 数据周期开始
  period_end DATE NOT NULL, -- 数据周期结束
  
  -- 输入数据
  weekly_reports JSONB, -- 周报内容集合
  meeting_notes JSONB, -- 会议纪要
  chat_logs JSONB, -- 聊天记录（匿名化）
  feedback_data JSONB, -- 反馈数据
  
  -- AI分析结果
  mood_score DECIMAL(3, 2), -- 整体情绪分数 (0-5)
  sentiment_analysis JSONB, -- 情感分析详细结果
  risk_indicators JSONB, -- 风险指标
  highlighted_concerns JSONB, -- 突出关注点
  recommendations JSONB, -- 建议
  
  -- 团队成员情绪细分
  team_members_mood JSONB, -- 各成员情绪数据
  at_risk_members JSONB, -- 风险成员列表
  
  -- 元数据
  data_source_count INTEGER DEFAULT 0,
  tokens_used INTEGER DEFAULT 0,
  analysis_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 索引
  INDEX idx_team_mood_user_id (user_id),
  INDEX idx_team_mood_period_start (period_start),
  INDEX idx_team_mood_period_end (period_end),
  INDEX idx_team_mood_mood_score (mood_score),
  UNIQUE (user_id, team_name, period_start, period_end)
);

-- 4. OKR表
CREATE TABLE IF NOT EXISTS okrs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  objective TEXT NOT NULL,
  quarter VARCHAR(10) NOT NULL, -- 格式: '2026-Q1'
  status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'active', 'completed', 'cancelled'
  progress_percentage INTEGER DEFAULT 0,
  
  -- AI拆解结果
  key_results JSONB, -- 关键结果列表
  action_items JSONB, -- 行动项
  milestones JSONB, -- 里程碑
  metrics JSONB, -- 衡量指标
  dependencies JSONB, -- 依赖项
  
  -- 时间范围
  start_date DATE,
  end_date DATE,
  
  -- 元数据
  is_template BOOLEAN DEFAULT FALSE,
  template_name VARCHAR(255),
  tokens_used INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 索引
  INDEX idx_okrs_user_id (user_id),
  INDEX idx_okrs_quarter (quarter),
  INDEX idx_okrs_status (status),
  INDEX idx_okrs_created_at (created_at)
);

-- 5. 订阅和支付表
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  stripe_subscription_id VARCHAR(255),
  stripe_customer_id VARCHAR(255),
  plan_id VARCHAR(100) NOT NULL, -- 'monthly', 'annual', 'enterprise'
  plan_name VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL, -- 'active', 'canceled', 'past_due', 'unpaid'
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  canceled_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 索引
  INDEX idx_subscriptions_user_id (user_id),
  INDEX idx_subscriptions_stripe_subscription_id (stripe_subscription_id),
  INDEX idx_subscriptions_status (status),
  INDEX idx_subscriptions_current_period_end (current_period_end)
);

-- 6. API使用记录表 (用于计费和限制)
CREATE TABLE IF NOT EXISTS api_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  endpoint VARCHAR(255) NOT NULL,
  model_used VARCHAR(100),
  input_tokens INTEGER DEFAULT 0,
  output_tokens INTEGER DEFAULT 0,
  total_tokens INTEGER DEFAULT 0,
  cost_usd DECIMAL(10, 6) DEFAULT 0,
  success BOOLEAN DEFAULT TRUE,
  error_message TEXT,
  request_metadata JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 索引
  INDEX idx_api_usage_user_id (user_id),
  INDEX idx_api_usage_created_at (created_at),
  INDEX idx_api_usage_endpoint (endpoint)
);

-- 7. 内容模板表
CREATE TABLE IF NOT EXISTS content_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  template_type VARCHAR(100) NOT NULL, -- 'conversation', 'okr', 'mood_analysis'
  name VARCHAR(255) NOT NULL,
  description TEXT,
  content JSONB NOT NULL, -- 模板内容
  is_public BOOLEAN DEFAULT FALSE, -- 是否公开模板
  usage_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 索引
  INDEX idx_content_templates_user_id (user_id),
  INDEX idx_content_templates_template_type (template_type),
  INDEX idx_content_templates_is_public (is_public)
);

-- 8. 团队管理表 (如果用户有团队)
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  team_name VARCHAR(255) NOT NULL,
  description TEXT,
  member_count INTEGER DEFAULT 0,
  settings JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 索引
  INDEX idx_teams_user_id (user_id),
  UNIQUE (user_id, team_name)
);

-- 9. 团队成员表
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255),
  email VARCHAR(255),
  join_date DATE,
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'inactive', 'left'
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 索引
  INDEX idx_team_members_team_id (team_id),
  INDEX idx_team_members_status (status)
);

-- 更新时间戳触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为所有需要updated_at的表创建触发器
CREATE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON user_profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_one_on_one_conversations_updated_at 
  BEFORE UPDATE ON one_on_one_conversations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_mood_data_updated_at 
  BEFORE UPDATE ON team_mood_data 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_okrs_updated_at 
  BEFORE UPDATE ON okrs 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at 
  BEFORE UPDATE ON subscriptions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_templates_updated_at 
  BEFORE UPDATE ON content_templates 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at 
  BEFORE UPDATE ON teams 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at 
  BEFORE UPDATE ON team_members 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 创建用于数据分析的物化视图
CREATE MATERIALIZED VIEW IF NOT EXISTS daily_usage_stats AS
SELECT 
  DATE(created_at) as usage_date,
  COUNT(DISTINCT user_id) as active_users,
  COUNT(*) as total_requests,
  SUM(total_tokens) as total_tokens,
  SUM(cost_usd) as total_cost
FROM api_usage
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(created_at);

-- 创建RPC函数用于常用操作

-- 获取用户使用统计
CREATE OR REPLACE FUNCTION get_user_usage_stats(p_user_id UUID)
RETURNS TABLE(
  total_conversations BIGINT,
  total_okrs BIGINT,
  total_mood_analyses BIGINT,
  total_tokens_used BIGINT,
  current_month_cost DECIMAL(10, 2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(DISTINCT o.id)::BIGINT as total_conversations,
    COUNT(DISTINCT ok.id)::BIGINT as total_okrs,
    COUNT(DISTINCT tm.id)::BIGINT as total_mood_analyses,
    COALESCE(SUM(au.total_tokens), 0)::BIGINT as total_tokens_used,
    COALESCE(SUM(CASE 
      WHEN au.created_at >= DATE_TRUNC('month', CURRENT_DATE) 
      THEN au.cost_usd 
      ELSE 0 
    END), 0)::DECIMAL(10, 2) as current_month_cost
  FROM user_profiles up
  LEFT JOIN one_on_one_conversations o ON o.user_id = up.user_id
  LEFT JOIN okrs ok ON ok.user_id = up.user_id
  LEFT JOIN team_mood_data tm ON tm.user_id = up.user_id
  LEFT JOIN api_usage au ON au.user_id = up.user_id
  WHERE up.user_id = p_user_id
  GROUP BY up.user_id;
END;
$$ LANGUAGE plpgsql;

-- 注释
COMMENT ON TABLE user_profiles IS '用户配置信息表，扩展Supabase Auth用户数据';
COMMENT ON TABLE one_on_one_conversations IS '1v1谈话记录和AI生成内容';
COMMENT ON TABLE team_mood_data IS '团队情绪分析和风险评估数据';
COMMENT ON TABLE okrs IS 'OKR目标管理和AI拆解结果';
COMMENT ON TABLE subscriptions IS '用户订阅和支付信息';
COMMENT ON TABLE api_usage IS 'API使用记录，用于计费和限制';
COMMENT ON TABLE content_templates IS '内容模板存储';
COMMENT ON TABLE teams IS '用户创建的团队';
COMMENT ON TABLE team_members IS '团队成员信息';

-- 初始化数据 (可选模板)
INSERT INTO content_templates (user_id, template_type, name, description, content, is_public)
VALUES 
  (
    '00000000-0000-0000-0000-000000000000', -- 系统用户ID
    'conversation',
    '标准1v1绩效谈话模板',
    '用于常规绩效评估的1v1谈话模板',
    '{"agenda": ["开场寒暄", "回顾上次行动项", "讨论近期表现", "收集反馈", "设定下一步目标", "结束谈话"], "questions": ["最近工作中有哪些进展顺利？", "遇到的最大挑战是什么？", "需要我提供什么支持？", "你对团队有什么建议？", "下一步的职业发展目标是什么？"]}'::jsonb,
    TRUE
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    'okr',
    '技术团队季度OKR模板',
    '技术团队季度目标设定模板',
    '{"objective": "提升系统稳定性和开发效率", "keyResults": ["将系统可用性从99%提升到99.9%", "减少生产环境事故50%", "提高代码审查效率30%", "完成技术债务清理计划"]}'::jsonb,
    TRUE
  );
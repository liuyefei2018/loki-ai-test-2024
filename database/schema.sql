CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  avatar_url TEXT,
  company VARCHAR(255),
  position VARCHAR(100),
  team_size VARCHAR(50),
  industry VARCHAR(100),
  subscription_tier VARCHAR(50) DEFAULT 'free',
  subscription_status VARCHAR(50) DEFAULT 'inactive',
  subscription_ends_at TIMESTAMP WITH TIME ZONE,
  credits_balance INTEGER DEFAULT 0,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS one_on_one_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_profile_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  employee_name VARCHAR(255) NOT NULL,
  employee_role VARCHAR(255),
  conversation_type VARCHAR(100) DEFAULT 'regular',
  conversation_date DATE,
  status VARCHAR(50) DEFAULT 'draft',
  recent_performance TEXT,
  conversation_goals TEXT,
  concerns TEXT,
  additional_context TEXT,
  agenda_outline JSONB,
  questions_suggestions JSONB,
  talking_points JSONB,
  potential_responses JSONB,
  advice_recommendations JSONB,
  follow_up_actions JSONB,
  tokens_used INTEGER DEFAULT 0,
  ai_model VARCHAR(100) DEFAULT 'claude-3-5-sonnet',
  is_template BOOLEAN DEFAULT FALSE,
  template_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS team_mood_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_profile_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  team_name VARCHAR(255) NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  weekly_reports JSONB,
  meeting_notes JSONB,
  chat_logs JSONB,
  feedback_data JSONB,
  mood_score NUMERIC(3,2),
  sentiment_analysis JSONB,
  risk_indicators JSONB,
  highlighted_concerns JSONB,
  recommendations JSONB,
  team_members_mood JSONB,
  at_risk_members JSONB,
  data_source_count INTEGER DEFAULT 0,
  tokens_used INTEGER DEFAULT 0,
  analysis_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_profile_id, team_name, period_start, period_end)
);

CREATE TABLE IF NOT EXISTS okrs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_profile_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  objective TEXT NOT NULL,
  quarter VARCHAR(10) NOT NULL,
  status VARCHAR(50) DEFAULT 'draft',
  progress_percentage INTEGER DEFAULT 0,
  key_results JSONB,
  action_items JSONB,
  milestones JSONB,
  metrics JSONB,
  dependencies JSONB,
  start_date DATE,
  end_date DATE,
  is_template BOOLEAN DEFAULT FALSE,
  template_name VARCHAR(255),
  tokens_used INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_profile_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  stripe_subscription_id VARCHAR(255),
  stripe_customer_id VARCHAR(255),
  plan_id VARCHAR(100) NOT NULL,
  plan_name VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  canceled_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS api_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_profile_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  endpoint VARCHAR(255) NOT NULL,
  model_used VARCHAR(100),
  input_tokens INTEGER DEFAULT 0,
  output_tokens INTEGER DEFAULT 0,
  total_tokens INTEGER DEFAULT 0,
  cost_usd NUMERIC(10,6) DEFAULT 0,
  success BOOLEAN DEFAULT TRUE,
  error_message TEXT,
  request_metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS content_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_profile_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  template_type VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  content JSONB NOT NULL,
  is_public BOOLEAN DEFAULT FALSE,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_profile_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  team_name VARCHAR(255) NOT NULL,
  description TEXT,
  member_count INTEGER DEFAULT 0,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_profile_id, team_name)
);

CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255),
  email VARCHAR(255),
  join_date DATE,
  status VARCHAR(50) DEFAULT 'active',
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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

CREATE MATERIALIZED VIEW IF NOT EXISTS daily_usage_stats AS
SELECT
  DATE(created_at) AS usage_date,
  COUNT(DISTINCT user_profile_id) AS active_users,
  COUNT(*) AS total_requests,
  SUM(total_tokens) AS total_tokens,
  SUM(cost_usd) AS total_cost
FROM api_usage
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(created_at);

CREATE OR REPLACE FUNCTION get_user_usage_stats(p_user_profile_id UUID)
RETURNS TABLE(
  total_conversations BIGINT,
  total_okrs BIGINT,
  total_mood_analyses BIGINT,
  total_tokens_used BIGINT,
  current_month_cost NUMERIC(10,2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(DISTINCT o.id)::BIGINT AS total_conversations,
    COUNT(DISTINCT ok.id)::BIGINT AS total_okrs,
    COUNT(DISTINCT tm.id)::BIGINT AS total_mood_analyses,
    COALESCE(SUM(au.total_tokens), 0)::BIGINT AS total_tokens_used,
    COALESCE(SUM(CASE WHEN au.created_at >= DATE_TRUNC('month', CURRENT_DATE) THEN au.cost_usd ELSE 0 END), 0)::NUMERIC(10,2) AS current_month_cost
  FROM user_profiles up
  LEFT JOIN one_on_one_conversations o ON o.user_profile_id = up.id
  LEFT JOIN okrs ok ON ok.user_profile_id = up.id
  LEFT JOIN team_mood_data tm ON tm.user_profile_id = up.id
  LEFT JOIN api_usage au ON au.user_profile_id = up.id
  WHERE up.id = p_user_profile_id
  GROUP BY up.id;
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE user_profiles IS '用户配置信息表，扩展Supabase Auth用户数据';
COMMENT ON TABLE one_on_one_conversations IS '1v1谈话记录和AI生成内容';
COMMENT ON TABLE team_mood_data IS '团队情绪分析和风险评估数据';
COMMENT ON TABLE okrs IS 'OKR目标管理和AI拆解结果';
COMMENT ON TABLE subscriptions IS '用户订阅和支付信息';
COMMENT ON TABLE api_usage IS 'API使用记录，用于计费和限制';
COMMENT ON TABLE content_templates IS '内容模板存储';
COMMENT ON TABLE teams IS '用户创建的团队';
COMMENT ON TABLE team_members IS '团队成员信息';

-- Skipping example INSERTs into content_templates to avoid NULL user_profile_id errors

CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles (user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles (email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_subscription_tier ON user_profiles (subscription_tier);
CREATE INDEX IF NOT EXISTS idx_user_profiles_subscription_status ON user_profiles (subscription_status);

CREATE INDEX IF NOT EXISTS idx_one_on_one_user_profile_id ON one_on_one_conversations (user_profile_id);
CREATE INDEX IF NOT EXISTS idx_one_on_one_status ON one_on_one_conversations (status);
CREATE INDEX IF NOT EXISTS idx_one_on_one_conversation_date ON one_on_one_conversations (conversation_date);
CREATE INDEX IF NOT EXISTS idx_one_on_one_created_at ON one_on_one_conversations (created_at);

CREATE INDEX IF NOT EXISTS idx_team_mood_user_profile_id ON team_mood_data (user_profile_id);
CREATE INDEX IF NOT EXISTS idx_team_mood_period_start ON team_mood_data (period_start);
CREATE INDEX IF NOT EXISTS idx_team_mood_period_end ON team_mood_data (period_end);
CREATE INDEX IF NOT EXISTS idx_team_mood_mood_score ON team_mood_data (mood_score);

CREATE INDEX IF NOT EXISTS idx_okrs_user_profile_id ON okrs (user_profile_id);
CREATE INDEX IF NOT EXISTS idx_okrs_quarter ON okrs (quarter);
CREATE INDEX IF NOT EXISTS idx_okrs_status ON okrs (status);
CREATE INDEX IF NOT EXISTS idx_okrs_created_at ON okrs (created_at);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_profile_id ON subscriptions (user_profile_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON subscriptions (stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions (status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_current_period_end ON subscriptions (current_period_end);

CREATE INDEX IF NOT EXISTS idx_api_usage_user_profile_id ON api_usage (user_profile_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_created_at ON api_usage (created_at);
CREATE INDEX IF NOT EXISTS idx_api_usage_endpoint ON api_usage (endpoint);

CREATE INDEX IF NOT EXISTS idx_content_templates_user_profile_id ON content_templates (user_profile_id);
CREATE INDEX IF NOT EXISTS idx_content_templates_template_type ON content_templates (template_type);
CREATE INDEX IF NOT EXISTS idx_content_templates_is_public ON content_templates (is_public);

CREATE INDEX IF NOT EXISTS idx_teams_user_profile_id ON teams (user_profile_id);
CREATE UNIQUE INDEX IF NOT EXISTS ux_teams_user_profile_team_name ON teams (user_profile_id, team_name);

CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members (team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_status ON team_members (status);
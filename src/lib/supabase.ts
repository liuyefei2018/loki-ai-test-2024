import { createClient } from '@supabase/supabase-js';

// 从环境变量获取Supabase配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// 验证环境变量
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase环境变量未设置。请检查您的.env.local文件。\n' +
    '需要: NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY\n' +
    '当前值:\n' +
    `- NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? '已设置' : '未设置'}\n` +
    `- NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey ? '已设置' : '未设置'}`
  );
}

// 创建Supabase客户端
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  db: {
    schema: 'public',
  },
});

// 服务端Supabase客户端（使用服务角色密钥）
export const getServiceSupabase = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY环境变量未设置');
  }
  
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

// 类型定义（根据数据库表结构生成）
export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          user_id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          company: string | null;
          position: string | null;
          team_size: string | null;
          industry: string | null;
          subscription_tier: string;
          subscription_status: string;
          subscription_ends_at: string | null;
          credits_balance: number;
          settings: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          company?: string | null;
          position?: string | null;
          team_size?: string | null;
          industry?: string | null;
          subscription_tier?: string;
          subscription_status?: string;
          subscription_ends_at?: string | null;
          credits_balance?: number;
          settings?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          company?: string | null;
          position?: string | null;
          team_size?: string | null;
          industry?: string | null;
          subscription_tier?: string;
          subscription_status?: string;
          subscription_ends_at?: string | null;
          credits_balance?: number;
          settings?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
      };
      one_on_one_conversations: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          employee_name: string;
          employee_role: string | null;
          conversation_type: string;
          conversation_date: string | null;
          status: string;
          recent_performance: string | null;
          conversation_goals: string | null;
          concerns: string | null;
          additional_context: string | null;
          agenda_outline: Record<string, any> | null;
          questions_suggestions: Record<string, any> | null;
          talking_points: Record<string, any> | null;
          potential_responses: Record<string, any> | null;
          advice_recommendations: Record<string, any> | null;
          follow_up_actions: Record<string, any> | null;
          tokens_used: number;
          ai_model: string;
          is_template: boolean;
          template_name: string | null;
          created_at: string;
          updated_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          employee_name: string;
          employee_role?: string | null;
          conversation_type?: string;
          conversation_date?: string | null;
          status?: string;
          recent_performance?: string | null;
          conversation_goals?: string | null;
          concerns?: string | null;
          additional_context?: string | null;
          agenda_outline?: Record<string, any> | null;
          questions_suggestions?: Record<string, any> | null;
          talking_points?: Record<string, any> | null;
          potential_responses?: Record<string, any> | null;
          advice_recommendations?: Record<string, any> | null;
          follow_up_actions?: Record<string, any> | null;
          tokens_used?: number;
          ai_model?: string;
          is_template?: boolean;
          template_name?: string | null;
          created_at?: string;
          updated_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          employee_name?: string;
          employee_role?: string | null;
          conversation_type?: string;
          conversation_date?: string | null;
          status?: string;
          recent_performance?: string | null;
          conversation_goals?: string | null;
          concerns?: string | null;
          additional_context?: string | null;
          agenda_outline?: Record<string, any> | null;
          questions_suggestions?: Record<string, any> | null;
          talking_points?: Record<string, any> | null;
          potential_responses?: Record<string, any> | null;
          advice_recommendations?: Record<string, any> | null;
          follow_up_actions?: Record<string, any> | null;
          tokens_used?: number;
          ai_model?: string;
          is_template?: boolean;
          template_name?: string | null;
          created_at?: string;
          updated_at?: string;
          completed_at?: string | null;
        };
      };
      // 其他表的类型定义可以后续添加
    };
    Views: {
      daily_usage_stats: {
        Row: {
          usage_date: string | null;
          active_users: number | null;
          total_requests: number | null;
          total_tokens: number | null;
          total_cost: number | null;
        };
      };
    };
    Functions: {
      get_user_usage_stats: {
        Args: { p_user_id: string };
        Returns: {
          total_conversations: number;
          total_okrs: number;
          total_mood_analyses: number;
          total_tokens_used: number;
          current_month_cost: number;
        }[];
      };
    };
  };
};

// 常用查询函数
export const conversationQueries = {
  // 获取用户的所有谈话
  getByUserId: async (userId: string) => {
    const { data, error } = await supabase
      .from('one_on_one_conversations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  // 获取单个谈话
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('one_on_one_conversations')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // 创建新谈话
  create: async (conversation: any) => {
    const { data, error } = await supabase
      .from('one_on_one_conversations')
      .insert([conversation])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // 更新谈话
  update: async (id: string, updates: any) => {
    const { data, error } = await supabase
      .from('one_on_one_conversations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // 删除谈话
  delete: async (id: string) => {
    const { error } = await supabase
      .from('one_on_one_conversations')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },
};

// 用户相关查询
export const userQueries = {
  // 获取或创建用户配置
  getOrCreateProfile: async (userId: string, email: string) => {
    // 首先尝试获取现有配置
    const { data: existing } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (existing) return existing;
    
    // 如果不存在，创建新配置
    const { data: newProfile, error } = await supabase
      .from('user_profiles')
      .insert([{
        user_id: userId,
        email,
        subscription_tier: 'free',
        subscription_status: 'active',
        credits_balance: 10, // 新用户赠送10个积分
      }])
      .select()
      .single();
    
    if (error) throw error;
    return newProfile;
  },
  
  // 获取用户配置
  getProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // 更新用户配置
  updateProfile: async (userId: string, updates: any) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
};

// 工具函数：检查认证状态
export const checkAuth = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('认证检查错误:', error);
    return null;
  }
  
  return session;
};

// 工具函数：获取当前用户
export const getCurrentUser = async () => {
  const session = await checkAuth();
  
  if (!session) {
    return null;
  }
  
  // 获取用户配置
  try {
    const profile = await userQueries.getProfile(session.user.id);
    return {
      ...session.user,
      profile,
    };
  } catch (error) {
    console.error('获取用户配置错误:', error);
    return session.user;
  }
};
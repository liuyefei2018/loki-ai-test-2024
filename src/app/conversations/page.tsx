import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Calendar, User, Clock, MessageSquare, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

// 模拟数据 - 实际开发中从Supabase获取
const mockConversations = [
  {
    id: '1',
    title: '与张三的季度绩效谈话',
    employeeName: '张三',
    employeeRole: '高级后端工程师',
    date: '2026-02-15',
    status: 'scheduled',
    type: 'performance',
    lastUpdated: '2小时前',
    preview: '讨论Q1表现、职业发展路径、技术方向选择...',
  },
  {
    id: '2',
    title: '新员工李四的30天跟进',
    employeeName: '李四',
    employeeRole: '前端工程师',
    date: '2026-02-10',
    status: 'completed',
    type: 'onboarding',
    lastUpdated: '1天前',
    preview: '了解入职适应情况、项目理解程度、团队融入情况...',
  },
  {
    id: '3',
    title: '与王五的职业规划谈话',
    employeeName: '王五',
    employeeRole: '技术主管',
    date: '2026-02-20',
    status: 'draft',
    type: 'career',
    lastUpdated: '3天前',
    preview: '讨论管理职责、团队建设、个人成长方向...',
  },
  {
    id: '4',
    title: '与赵六的项目复盘',
    employeeName: '赵六',
    employeeRole: '全栈工程师',
    date: '2026-02-05',
    status: 'completed',
    type: 'project',
    lastUpdated: '5天前',
    preview: '复盘项目A的实施过程、技术决策、团队协作问题...',
  },
];

const statusConfig = {
  draft: { label: '草稿', variant: 'outline' as const },
  scheduled: { label: '已安排', variant: 'secondary' as const },
  completed: { label: '已完成', variant: 'default' as const },
  cancelled: { label: '已取消', variant: 'destructive' as const },
};

const typeConfig = {
  performance: { label: '绩效', color: 'bg-blue-100 text-blue-800' },
  onboarding: { label: '入职', color: 'bg-green-100 text-green-800' },
  career: { label: '职业', color: 'bg-purple-100 text-purple-800' },
  project: { label: '项目', color: 'bg-amber-100 text-amber-800' },
  regular: { label: '常规', color: 'bg-gray-100 text-gray-800' },
};

export default function ConversationsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <h1 className="text-lg font-bold">LokiAI</h1>
                  <p className="text-xs text-muted-foreground">1v1 谈话准备器</p>
                </div>
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/conversations" className="font-medium text-primary">
                  谈话记录
                </Link>
                <Link href="/team-mood" className="text-muted-foreground hover:text-primary">
                  团队情绪
                </Link>
                <Link href="/okrs" className="text-muted-foreground hover:text-primary">
                  OKR管理
                </Link>
                <Link href="/templates" className="text-muted-foreground hover:text-primary">
                  模板库
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                帮助中心
              </Button>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* 页面标题和操作 */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">1v1 谈话准备器</h1>
              <p className="text-muted-foreground">
                用 AI 帮助您准备与团队成员的 1v1 谈话，生成专业的谈话提纲和建议
              </p>
            </div>
            <Link href="/conversations/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                新建谈话
              </Button>
            </Link>
          </div>
        </div>

        {/* 搜索和筛选 */}
        <div className="mb-8 rounded-lg bg-white p-4 shadow-sm">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="搜索谈话、员工姓名或关键词..." className="pl-10" />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                筛选
              </Button>
              <Button variant="outline">导出</Button>
            </div>
          </div>
        </div>

        {/* 状态统计 */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">总谈话数</p>
                  <p className="text-2xl font-bold">24</p>
                </div>
                <div className="rounded-lg bg-primary/10 p-3">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">本周安排</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
                <div className="rounded-lg bg-blue-100 p-3">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">待完成</p>
                  <p className="text-2xl font-bold">2</p>
                </div>
                <div className="rounded-lg bg-amber-100 p-3">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">AI生成内容</p>
                  <p className="text-2xl font-bold">142</p>
                </div>
                <div className="rounded-lg bg-green-100 p-3">
                  <MessageSquare className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 谈话列表 */}
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">最近的谈话</h2>
            <Button variant="ghost" size="sm">
              查看全部
            </Button>
          </div>
          <div className="grid gap-4">
            {mockConversations.map((conversation) => {
              const status = statusConfig[conversation.status as keyof typeof statusConfig];
              const type = typeConfig[conversation.type as keyof typeof typeConfig];
              
              return (
                <Link key={conversation.id} href={`/conversations/${conversation.id}`}>
                  <Card className="transition-all hover:shadow-md">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{conversation.title}</CardTitle>
                          <CardDescription className="flex items-center gap-4 mt-2">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {conversation.employeeName} · {conversation.employeeRole}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {conversation.date}
                            </span>
                          </CardDescription>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge variant={status.variant}>{status.label}</Badge>
                          <span className={`text-xs px-2 py-1 rounded-full ${type.color}`}>
                            {type.label}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <p className="text-sm text-muted-foreground">{conversation.preview}</p>
                    </CardContent>
                    <CardFooter className="border-t pt-3 text-xs text-muted-foreground flex justify-between">
                      <span>最后更新: {conversation.lastUpdated}</span>
                      <Button variant="ghost" size="sm">
                        查看详情
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* 快速开始 */}
        <Card>
          <CardHeader>
            <CardTitle>快速开始</CardTitle>
            <CardDescription>
              不知道如何开始？尝试以下模板或查看指南
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="border-dashed">
                <CardContent className="pt-6 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">绩效评估谈话</h3>
                  <p className="text-sm text-muted-foreground">用于季度或年度绩效评估</p>
                  <Button variant="outline" size="sm" className="mt-4">
                    使用模板
                  </Button>
                </CardContent>
              </Card>
              <Card className="border-dashed">
                <CardContent className="pt-6 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold">新员工跟进</h3>
                  <p className="text-sm text-muted-foreground">30/60/90天入职跟进</p>
                  <Button variant="outline" size="sm" className="mt-4">
                    使用模板
                  </Button>
                </CardContent>
              </Card>
              <Card className="border-dashed">
                <CardContent className="pt-6 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <Calendar className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold">职业规划谈话</h3>
                  <p className="text-sm text-muted-foreground">讨论长期职业发展方向</p>
                  <Button variant="outline" size="sm" className="mt-4">
                    使用模板
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* 页脚 */}
      <footer className="border-t bg-white mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            LokiAI 1v1 谈话准备器 · 专为技术管理者设计 · 让每一次谈话都有准备
          </p>
        </div>
      </footer>
    </div>
  );
}
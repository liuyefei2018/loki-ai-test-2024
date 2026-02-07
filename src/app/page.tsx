import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, MessageSquare, Users, Target, Sparkles } from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      title: '1v1 谈话准备器',
      description: 'AI帮助您准备与团队成员的1v1谈话，生成谈话提纲、问题建议和应对策略',
      icon: MessageSquare,
      status: 'ready',
      href: '/conversations',
    },
    {
      title: '团队情绪仪表盘',
      description: '分析团队周报、会议纪要和聊天记录，发现情绪趋势和离职风险',
      icon: Users,
      status: 'beta',
      href: '/team-mood',
    },
    {
      title: 'OKR 拆解助手',
      description: '将季度目标拆解为可执行的关键结果、行动项和里程碑',
      icon: Target,
      status: 'soon',
      href: '/okrs',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* 导航栏 */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">LokiAI</h1>
                <p className="text-sm text-muted-foreground">技术管理者AI助手</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/auth/login">
                <Button variant="ghost">登录</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>免费开始</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="container mx-auto px-4 py-12">
        {/* 英雄区域 */}
        <section className="mb-16 text-center">
          <Badge className="mb-4" variant="outline">
            🚀 现已推出 Beta 版
          </Badge>
          <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl">
            用 AI 提升您的
            <span className="block text-primary">技术管理效率</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground">
            LokiAI 专为技术管理者设计，帮助您准备 1v1 谈话、分析团队情绪、拆解 OKR，
            让管理更轻松，团队更高效。
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="gap-2">
                免费开始使用
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/conversations">
              <Button size="lg" variant="outline">
                查看演示
              </Button>
            </Link>
          </div>
        </section>

        {/* 功能展示 */}
        <section className="mb-16">
          <h2 className="mb-8 text-center text-3xl font-bold">核心功能</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link key={feature.title} href={feature.href}>
                  <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1">
                    <CardHeader>
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <Badge
                          variant={
                            feature.status === 'ready'
                              ? 'default'
                              : feature.status === 'beta'
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {feature.status === 'ready'
                            ? '已上线'
                            : feature.status === 'beta'
                            ? 'Beta 测试'
                            : '即将推出'}
                        </Badge>
                      </div>
                      <CardTitle>{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="ghost" className="w-full gap-2">
                        了解更多
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 价值主张 */}
        <section className="mb-16 rounded-2xl bg-primary/5 p-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-4 text-2xl font-bold">为什么选择 LokiAI？</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                  <span>基于17年技术管理经验的专业知识</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                  <span>结合心理学和组织行为学原理</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                  <span>专为中国互联网团队优化</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                  <span>数据安全，隐私保护</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-2xl font-bold">适合谁使用？</h3>
              <div className="space-y-4">
                <div className="rounded-lg bg-white p-4 shadow-sm">
                  <h4 className="font-semibold">技术总监/CTO</h4>
                  <p className="text-sm text-muted-foreground">
                    管理多个团队，需要高效处理管理事务
                  </p>
                </div>
                <div className="rounded-lg bg-white p-4 shadow-sm">
                  <h4 className="font-semibold">研发经理</h4>
                  <p className="text-sm text-muted-foreground">
                    直接管理工程师团队，需要处理日常1v1谈话
                  </p>
                </div>
                <div className="rounded-lg bg-white p-4 shadow-sm">
                  <h4 className="font-semibold">技术主管</h4>
                  <p className="text-sm text-muted-foreground">
                    刚开始带团队，需要管理指导和支持
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 行动召唤 */}
        <section className="text-center">
          <h2 className="mb-4 text-3xl font-bold">立即开始提升您的管理效率</h2>
          <p className="mx-auto mb-8 max-w-2xl text-muted-foreground">
            免费注册，体验 AI 如何改变您的管理方式。前100名注册用户享受永久免费额度。
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="gap-2">
              免费注册
              <Sparkles className="h-4 w-4" />
            </Button>
          </Link>
        </section>
      </main>

      {/* 页脚 */}
      <footer className="border-t bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">LokiAI</p>
                <p className="text-sm text-muted-foreground">技术管理者AI助手</p>
              </div>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              <p>© {new Date().getFullYear()} LokiAI. 保留所有权利。</p>
              <p className="mt-1">专为技术管理者设计，让管理更轻松</p>
            </div>
            <div className="flex gap-4">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
                隐私政策
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">
                服务条款
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">
                联系我们
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
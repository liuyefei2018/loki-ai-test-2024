"use client"

import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Users, Target, ArrowRight, Calendar, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const stats = [
    { label: "本周谈话", value: "3", change: "+1", icon: MessageSquare, color: "bg-blue-500" },
    { label: "团队情绪", value: "7.2", change: "+0.3", icon: TrendingUp, color: "bg-green-500" },
    { label: "OKR进度", value: "68%", change: "+12%", icon: Target, color: "bg-purple-500" },
    { label: "待办事项", value: "5", change: "-2", icon: Calendar, color: "bg-orange-500" },
  ]

  const quickActions = [
    { title: "准备1v1谈话", description: "为下周的团队会议做准备", icon: MessageSquare, href: "/conversations/new" },
    { title: "查看情绪报告", description: "分析团队本周情绪趋势", icon: Users, href: "/team-mood" },
    { title: "更新OKR进度", description: "记录关键结果完成情况", icon: Target, href: "/okrs" },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">欢迎回来，{user.email?.split('@')[0] || '管理员'}！</h1>
        <p className="text-muted-foreground mt-2">这是您今天的管理概览</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <div className={`${stat.color} p-2 rounded-full`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{stat.change}</span> 较上周
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 快速操作 */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">快速操作</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <Link key={index} href={action.href}>
                <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                    <CardDescription>{action.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>

      {/* 最近活动 */}
      <Card>
        <CardHeader>
          <CardTitle>最近活动</CardTitle>
          <CardDescription>您最近的管理活动记录</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">与张三的1v1谈话</p>
                  <p className="text-sm text-muted-foreground">昨天 14:30 - 绩效评估</p>
                </div>
              </div>
              <Button variant="outline" size="sm">查看详情</Button>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Target className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Q2 OKR进度更新</p>
                  <p className="text-sm text-muted-foreground">2天前 - 产品发布进度</p>
                </div>
              </div>
              <Button variant="outline" size="sm">查看详情</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

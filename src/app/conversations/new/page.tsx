'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Sparkles, Save, Calendar, User, Target, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function NewConversationPage() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    employeeName: '',
    employeeRole: '',
    conversationType: 'performance',
    conversationDate: '',
    recentPerformance: '',
    conversationGoals: '',
    concerns: '',
    additionalContext: '',
  });

  const conversationTypes = [
    { value: 'performance', label: '绩效评估', description: '季度或年度绩效评估谈话' },
    { value: 'career', label: '职业规划', description: '讨论长期职业发展方向' },
    { value: 'onboarding', label: '新员工跟进', description: '30/60/90天入职跟进' },
    { value: 'project', label: '项目复盘', description: '项目结束后复盘和反馈' },
    { value: 'difficult', label: '困难谈话', description: '处理绩效问题或冲突' },
    { value: 'regular', label: '常规谈话', description: '每周或每月的定期沟通' },
  ];

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    if (!formData.employeeName || !formData.title) {
      alert('请填写员工姓名和谈话标题');
      return;
    }

    setIsGenerating(true);
    // 模拟AI生成过程
    setTimeout(() => {
      setIsGenerating(false);
      // 实际开发中，这里会调用API生成内容，然后跳转到详情页
      alert('AI内容生成完成！实际开发中会跳转到详情页面。');
      // router.push(`/conversations/123`);
    }, 2000);
  };

  const handleSaveDraft = () => {
    // 保存草稿逻辑
    alert('草稿已保存');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/conversations" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                <ArrowLeft className="h-4 w-4" />
                返回
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h1 className="text-lg font-bold">创建新谈话</h1>
                  <p className="text-xs text-muted-foreground">1v1 谈话准备器</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={handleSaveDraft}>
                <Save className="mr-2 h-4 w-4" />
                保存草稿
              </Button>
              <Button onClick={handleGenerate} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                    生成中...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    AI 生成内容
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* 左侧表单 */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>谈话基本信息</CardTitle>
                <CardDescription>填写谈话的基本信息，AI将基于这些信息生成内容</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 标题和员工信息 */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">谈话标题 *</Label>
                    <Input
                      id="title"
                      placeholder="例如：与张三的季度绩效谈话"
                      value={formData.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="conversationDate">谈话日期</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="conversationDate"
                        type="date"
                        className="pl-10"
                        value={formData.conversationDate}
                        onChange={(e) => handleChange('conversationDate', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="employeeName">员工姓名 *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="employeeName"
                        placeholder="例如：张三"
                        className="pl-10"
                        value={formData.employeeName}
                        onChange={(e) => handleChange('employeeName', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employeeRole">员工职位</Label>
                    <Input
                      id="employeeRole"
                      placeholder="例如：高级后端工程师"
                      value={formData.employeeRole}
                      onChange={(e) => handleChange('employeeRole', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="conversationType">谈话类型</Label>
                  <Select
                    value={formData.conversationType}
                    onValueChange={(value) => handleChange('conversationType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择谈话类型" />
                    </SelectTrigger>
                    <SelectContent>
                      {conversationTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex flex-col">
                            <span>{type.label}</span>
                            <span className="text-xs text-muted-foreground">{type.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* 详细内容 */}
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-primary" />
                      <Label htmlFor="conversationGoals">谈话目标</Label>
                    </div>
                    <Textarea
                      id="conversationGoals"
                      placeholder="这次谈话的主要目标是什么？例如：评估Q1绩效、讨论晋升机会、解决项目中的问题..."
                      rows={3}
                      value={formData.conversationGoals}
                      onChange={(e) => handleChange('conversationGoals', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      明确的目标有助于AI生成更精准的内容
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recentPerformance">近期表现</Label>
                    <Textarea
                      id="recentPerformance"
                      placeholder="员工近期的表现如何？亮点、成就、需要改进的地方..."
                      rows={4}
                      value={formData.recentPerformance}
                      onChange={(e) => handleChange('recentPerformance', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="concerns">关注点或问题</Label>
                    <Textarea
                      id="concerns"
                      placeholder="需要特别关注的问题或员工的担忧..."
                      rows={3}
                      value={formData.concerns}
                      onChange={(e) => handleChange('concerns', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additionalContext">补充信息</Label>
                    <Textarea
                      id="additionalContext"
                      placeholder="其他相关信息：团队背景、项目情况、公司变化等..."
                      rows={3}
                      value={formData.additionalContext}
                      onChange={(e) => handleChange('additionalContext', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右侧侧边栏 */}
          <div className="space-y-6">
            {/* AI生成提示 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  AI 生成内容
                </CardTitle>
                <CardDescription>AI将基于您的输入生成以下内容</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-primary/5 p-4">
                  <h4 className="font-semibold mb-2">包含内容：</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                      <span>谈话提纲和议程安排</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                      <span>开场白和破冰问题</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                      <span>核心问题建议（5-10个）</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                      <span>预期回应和应对策略</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                      <span>谈话要点和关键信息</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                      <span>后续行动计划</span>
                    </li>
                  </ul>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>💡 提示：提供的信息越详细，AI生成的内容越精准。</p>
                </div>
              </CardContent>
            </Card>

            {/* 使用模板 */}
            <Card>
              <CardHeader>
                <CardTitle>使用模板</CardTitle>
                <CardDescription>快速从模板开始</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: '标准绩效评估', type: 'performance', badge: '常用' },
                  { name: '新员工30天跟进', type: 'onboarding', badge: '推荐' },
                  { name: '职业发展规划', type: 'career', badge: '专业' },
                  { name: '项目复盘会议', type: 'project', badge: '实用' },
                ].map((template) => (
                  <button
                    key={template.name}
                    className="w-full text-left rounded-lg border p-3 hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      // 加载模板逻辑
                      alert(`加载模板: ${template.name}`);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{template.name}</p>
                        <p className="text-xs text-muted-foreground">{template.type}</p>
                      </div>
                      <Badge variant="outline">{template.badge}</Badge>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* 提示和建议 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                  最佳实践提示
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="rounded-lg bg-amber-50 p-3 border border-amber-200">
                  <p className="font-medium text-amber-800">保持积极导向</p>
                  <p className="text-amber-700">即使讨论问题，也要以建设性方式提出</p>
                </div>
                <div className="rounded-lg bg-blue-50 p-3 border border-blue-200">
                  <p className="font-medium text-blue-800">具体化反馈</p>
                  <p className="text-blue-700">提供具体事例而非泛泛而谈</p>
                </div>
                <div className="rounded-lg bg-green-50 p-3 border border-green-200">
                  <p className="font-medium text-green-800">双向沟通</p>
                  <p className="text-green-700">准备更多开放式问题，鼓励员工分享</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* 底部操作栏 */}
      <div className="sticky bottom-0 border-t bg-white/95 backdrop-blur-sm py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              <p>💡 填写完整信息后点击"AI生成内容"按钮</p>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => router.push('/conversations')}>
                取消
              </Button>
              <Button variant="outline" onClick={handleSaveDraft}>
                保存为草稿
              </Button>
              <Button onClick={handleGenerate} disabled={isGenerating}>
                {isGenerating ? '生成中...' : 'AI 生成内容'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
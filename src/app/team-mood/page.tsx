export default function TeamMoodPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">团队情绪仪表盘</h1>
      <p className="text-muted-foreground mb-8">
        分析团队周报、会议纪要和聊天记录，发现情绪趋势和离职风险。
      </p>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="border rounded-lg p-6">
          <h3 className="font-semibold mb-2">情绪趋势</h3>
          <p className="text-sm text-muted-foreground">功能开发中...</p>
        </div>
        <div className="border rounded-lg p-6">
          <h3 className="font-semibold mb-2">团队成员状态</h3>
          <p className="text-sm text-muted-foreground">功能开发中...</p>
        </div>
        <div className="border rounded-lg p-6">
          <h3 className="font-semibold mb-2">风险预警</h3>
          <p className="text-sm text-muted-foreground">功能开发中...</p>
        </div>
      </div>
    </div>
  )
}

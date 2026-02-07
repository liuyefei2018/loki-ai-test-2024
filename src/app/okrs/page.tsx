export default function OKRsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">OKR 拆解助手</h1>
      <p className="text-muted-foreground mb-8">
        将季度目标拆解为可执行的关键结果、行动项和里程碑。
      </p>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="border rounded-lg p-6">
          <h3 className="font-semibold mb-2">目标管理</h3>
          <p className="text-sm text-muted-foreground">功能开发中...</p>
        </div>
        <div className="border rounded-lg p-6">
          <h3 className="font-semibold mb-2">进度追踪</h3>
          <p className="text-sm text-muted-foreground">功能开发中...</p>
        </div>
        <div className="border rounded-lg p-6">
          <h3 className="font-semibold mb-2">AI拆解</h3>
          <p className="text-sm text-muted-foreground">功能开发中...</p>
        </div>
      </div>
    </div>
  )
}

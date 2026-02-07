#!/bin/bash

# LokiAI GitHub仓库设置脚本
# 使用说明：
# 1. 在GitHub上创建新仓库（https://github.com/new）
# 2. 将仓库命名为 "loki-ai" 或 "loki-ai-app"
# 3. 不要初始化README、.gitignore或license
# 4. 运行此脚本

set -e

echo "🚀 LokiAI GitHub仓库设置脚本"
echo "=============================="

# 检查是否在正确的目录中
if [ ! -f "package.json" ]; then
    echo "错误：请在项目根目录（src/）中运行此脚本"
    exit 1
fi

# 检查git是否安装
if ! command -v git &> /dev/null; then
    echo "错误：git未安装。请先安装git。"
    exit 1
fi

# 检查是否已设置远程仓库
if git remote -v | grep -q origin; then
    echo "⚠️  远程仓库已设置。当前远程仓库："
    git remote -v
    echo ""
    read -p "是否要更新远程仓库URL？(y/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
    else
        echo "取消操作。"
        exit 0
    fi
fi

echo "📝 请输入GitHub仓库URL（例如：https://github.com/你的用户名/loki-ai.git）"
read -p "仓库URL: " repo_url

if [ -z "$repo_url" ]; then
    echo "错误：必须提供仓库URL。"
    exit 1
fi

# 添加远程仓库
echo "🔗 添加远程仓库..."
git remote add origin "$repo_url"

# 验证远程仓库
echo "🔍 验证远程仓库..."
if ! git ls-remote --exit-code origin &> /dev/null; then
    echo "错误：无法访问远程仓库。请检查URL和权限。"
    echo "可能的原因："
    echo "1. 仓库不存在"
    echo "2. 没有访问权限"
    echo "3. 网络问题"
    git remote remove origin
    exit 1
fi

echo "✅ 远程仓库验证成功！"

# 推送代码
echo "📤 推送代码到GitHub..."
echo "这可能会要求您输入GitHub凭据。"
echo ""

# 尝试推送
if git push -u origin master; then
    echo "✅ 代码推送成功！"
    echo ""
    echo "🌐 您的仓库现在位于：$(echo $repo_url | sed 's/\.git$//')"
else
    echo "❌ 推送失败。可能的原因："
    echo "1. 认证失败"
    echo "2. 分支名称冲突（尝试: git push -u origin main）"
    echo "3. 网络问题"
    echo ""
    echo "手动推送命令："
    echo "  git push -u origin master"
    echo "或"
    echo "  git push -u origin main"
    exit 1
fi

echo ""
echo "🎉 完成！"
echo ""
echo "下一步："
echo "1. 在GitHub仓库设置中启用GitHub Pages（如果需要）"
echo "2. 设置GitHub Actions进行CI/CD"
echo "3. 将仓库连接到Vercel进行自动部署"
echo ""
echo "快速连接到Vercel："
echo "1. 访问 https://vercel.com/new"
echo "2. 导入GitHub仓库"
echo "3. 配置环境变量"
echo "4. 部署！"
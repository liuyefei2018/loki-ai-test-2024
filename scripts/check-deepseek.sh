#!/bin/bash
# DeepSeek API 配置验证脚本
echo "🔍 DeepSeek API 配置检查"
echo "=========================================="
echo ""

# 检查 .env.local 是否存在
if [ ! -f ".env.local" ]; then
    echo "❌ 错误: .env.local 文件不存在"
    echo "💡 请从模板创建: cp src/.env.local.example .env.local"
    exit 1
fi

echo "✅ .env.local 文件存在"

# 读取并检查 DEEPSEEK_API_KEY
API_KEY=$(grep "DEEPSEEK_API_KEY=" .env.local | cut -d'=' -f2)

if [ -z "$API_KEY" ]; then
    echo "❌ 错误: DEEPSEEK_API_KEY 未设置"
    echo "💡 请编辑 .env.local 文件，添加你的API密钥"
    exit 1
fi

if [ "$API_KEY" = "your-deepseek-api-key-here" ]; then
    echo "❌ 错误: DEEPSEEK_API_KEY 仍是默认值"
    echo "💡 请将 .env.local 中的 your-deepseek-api-key-here 替换为真实API密钥"
    exit 1
fi

# 显示密钥信息（部分隐藏）
MASKED_KEY="${API_KEY:0:8}...${API_KEY: -4}"
echo "✅ DEEPSEEK_API_KEY 已配置"
echo "   密钥: $MASKED_KEY"
echo "   长度: ${#API_KEY} 字符"
echo ""

# 检查 .gitignore
if grep -q ".env.local" .gitignore 2>/dev/null; then
    echo "✅ .env.local 已在 .gitignore 中"
    echo "   API密钥不会被提交到Git"
else
    echo "⚠️  警告: .env.local 未在 .gitignore 中"
    echo "💡 建议添加: echo '.env.local' >> .gitignore"
fi

echo ""
echo "=========================================="
echo "🎉 DeepSeek API 配置检查通过！"
echo ""
echo "📋 下一步:"
echo "   1. npm install --legacy-peer-deps"
echo "   2. npm run dev"
echo "   3. 访问 http://localhost:3000"
echo ""
echo "📖 更多信息: docs/API_KEY_SECURITY.md"
echo "=========================================="

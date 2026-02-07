@echo off
REM LokiAI GitHub仓库设置脚本 (Windows版本)
REM 使用说明：
REM 1. 在GitHub上创建新仓库（https://github.com/new）
REM 2. 将仓库命名为 "loki-ai" 或 "loki-ai-app"
REM 3. 不要初始化README、.gitignore或license
REM 4. 运行此脚本

echo 🚀 LokiAI GitHub仓库设置脚本
echo ==============================

REM 检查是否在正确的目录中
if not exist "package.json" (
    echo 错误：请在项目根目录（src/）中运行此脚本
    exit /b 1
)

REM 检查git是否安装
where git >nul 2>nul
if errorlevel 1 (
    echo 错误：git未安装。请先安装git。
    exit /b 1
)

REM 检查是否已设置远程仓库
git remote -v | findstr origin >nul
if not errorlevel 1 (
    echo ⚠️  远程仓库已设置。当前远程仓库：
    git remote -v
    echo.
    set /p response=是否要更新远程仓库URL？(y/n): 
    if /i "%response%"=="y" (
        git remote remove origin
    ) else (
        echo 取消操作。
        exit /b 0
    )
)

echo.
echo 📝 请输入GitHub仓库URL（例如：https://github.com/你的用户名/loki-ai.git）
set /p repo_url=仓库URL: 

if "%repo_url%"=="" (
    echo 错误：必须提供仓库URL。
    exit /b 1
)

REM 添加远程仓库
echo 🔗 添加远程仓库...
git remote add origin "%repo_url%"

REM 验证远程仓库
echo 🔍 验证远程仓库...
git ls-remote --exit-code origin >nul 2>nul
if errorlevel 1 (
    echo 错误：无法访问远程仓库。请检查URL和权限。
    echo 可能的原因：
    echo 1. 仓库不存在
    echo 2. 没有访问权限
    echo 3. 网络问题
    git remote remove origin
    exit /b 1
)

echo ✅ 远程仓库验证成功！

REM 推送代码
echo 📤 推送代码到GitHub...
echo 这可能会要求您输入GitHub凭据。
echo.

REM 尝试推送
git push -u origin master
if not errorlevel 1 (
    echo ✅ 代码推送成功！
    echo.
    echo 🌐 您的仓库现在位于：%repo_url:.git=%
) else (
    echo ❌ 推送失败。可能的原因：
    echo 1. 认证失败
    echo 2. 分支名称冲突（尝试: git push -u origin main）
    echo 3. 网络问题
    echo.
    echo 手动推送命令：
    echo   git push -u origin master
    echo 或
    echo   git push -u origin main
    exit /b 1
)

echo.
echo 🎉 完成！
echo.
echo 下一步：
echo 1. 在GitHub仓库设置中启用GitHub Pages（如果需要）
echo 2. 设置GitHub Actions进行CI/CD
echo 3. 将仓库连接到Vercel进行自动部署
echo.
echo 快速连接到Vercel：
echo 1. 访问 https://vercel.com/new
echo 2. 导入GitHub仓库
echo 3. 配置环境变量
echo 4. 部署！
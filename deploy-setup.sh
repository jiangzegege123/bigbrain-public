#!/bin/bash

# Vercel部署设置脚本
# 请在运行前设置您的GitHub用户名

echo "=== BigBrain Vercel部署设置 ==="
echo ""

# 检查是否设置了GitHub用户名
if [ -z "$1" ]; then
    echo "❌ 请提供您的GitHub用户名"
    echo "使用方法: ./deploy-setup.sh YOUR_GITHUB_USERNAME"
    echo ""
    echo "例如: ./deploy-setup.sh johnsmith"
    exit 1
fi

GITHUB_USERNAME=$1
REPO_NAME="bigbrain-deploy"

echo "GitHub用户名: $GITHUB_USERNAME"
echo "仓库名: $REPO_NAME"
echo ""

# 检查是否已存在github远程仓库
if git remote get-url github >/dev/null 2>&1; then
    echo "✅ GitHub远程仓库已存在"
else
    echo "📡 添加GitHub远程仓库..."
    
    # 尝试SSH，如果失败则使用HTTPS
    if git remote add github "git@github.com:$GITHUB_USERNAME/$REPO_NAME.git" 2>/dev/null; then
        echo "✅ 使用SSH添加GitHub远程仓库"
    else
        echo "⚠️  SSH失败，使用HTTPS..."
        git remote remove github 2>/dev/null || true
        git remote add github "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
        echo "✅ 使用HTTPS添加GitHub远程仓库"
    fi
fi

echo ""
echo "🚀 推送代码到GitHub..."
if git push github master; then
    echo "✅ 代码成功推送到GitHub"
else
    echo "❌ 推送失败。请检查："
    echo "   1. GitHub仓库是否已创建"
    echo "   2. SSH密钥是否配置正确"
    echo "   3. 或者使用HTTPS认证"
    exit 1
fi

echo ""
echo "🎉 设置完成！"
echo ""
echo "下一步："
echo "1. 登录 https://vercel.com"
echo "2. 点击 'Add New...' > 'Project'"
echo "3. 选择您的GitHub仓库: $GITHUB_USERNAME/$REPO_NAME"
echo "4. 前端部署:"
echo "   - Root Directory: frontend"
echo "   - Framework: Vite"
echo "5. 后端部署:"
echo "   - Root Directory: backend" 
echo "   - Framework: Other"
echo ""
echo "GitHub仓库: https://github.com/$GITHUB_USERNAME/$REPO_NAME"

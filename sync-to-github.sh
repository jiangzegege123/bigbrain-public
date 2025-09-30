#!/bin/bash

# 同步代码到GitHub的便捷脚本

echo "=== 同步代码到GitHub和Vercel ==="
echo ""

# 检查是否有未提交的更改
if ! git diff --quiet || ! git diff --cached --quiet; then
    echo "📝 发现未提交的更改，正在提交..."
    
    # 显示更改的文件
    echo "更改的文件:"
    git diff --name-only
    git diff --cached --name-only
    echo ""
    
    # 提交更改
    read -p "请输入提交信息: " commit_message
    if [ -z "$commit_message" ]; then
        commit_message="Update for deployment"
    fi
    
    git add -A
    git commit -m "$commit_message"
    echo "✅ 更改已提交"
else
    echo "ℹ️  没有新的更改需要提交"
fi

echo ""
echo "🔄 推送到GitLab (origin)..."
if git push origin master; then
    echo "✅ 成功推送到GitLab"
else
    echo "❌ 推送到GitLab失败"
    exit 1
fi

echo ""
echo "🔄 推送到GitHub (github)..."
if git push github master; then
    echo "✅ 成功推送到GitHub"
    echo "🚀 Vercel会自动重新部署"
else
    echo "❌ 推送到GitHub失败"
    echo "请检查GitHub远程仓库配置"
    exit 1
fi

echo ""
echo "🎉 同步完成！"
echo "您的更改现在已经在GitLab和GitHub上，Vercel会自动重新部署。"

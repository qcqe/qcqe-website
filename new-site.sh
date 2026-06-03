#!/bin/bash
read -p "输入网站名称 (如: client1): " SITE_NAME
mkdir -p ~/Desktop/工作进度/市场部/sites/$SITE_NAME
cd ~/Desktop/工作进度/市场部/sites/$SITE_NAME
git init
git remote add origin "git@github.com:qcqe/${SITE_NAME}-website.git"
git remote add gitee "git@gitee.com:fexlink_1_0/${SITE_NAME}-website.git"
echo "✅ 网站目录已创建: ~/Desktop/工作进度/市场部/sites/$SITE_NAME"
echo "📋 下一步："
echo "  1. 在 GitHub 创建仓库: https://github.com/new"
echo "  2. 在 Gitee 创建仓库: https://gitee.com/projects/new"
echo "  3. 打开 GitHub Desktop → File → Add Local Repository"

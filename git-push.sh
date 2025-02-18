#!/bin/bash

# 顏色定義
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
NC="\033[0m" # No Color

# 錯誤處理函數
error_exit() {
    echo -e "${RED}錯誤: $1${NC}" >&2
    exit 1
}

# 檢查是否在 git 倉庫中
git rev-parse --is-inside-work-tree &>/dev/null || error_exit "不在 git 倉庫中！"

# 獲取當前分支
current_branch=$(git branch --show-current)
echo -e "${YELLOW}當前分支: $current_branch${NC}"

# 檢查是否有未提交的更改
if [ -z "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}沒有需要提交的更改${NC}"
    exit 0
fi

# 顯示更改的文件
echo -e "${YELLOW}更改的文件:${NC}"
git status --porcelain | sed 's/^/  /'

# 獲取提交信息
commit_message="$1"
if [ -z "$commit_message" ]; then
    commit_message="更新: $(date '+%Y-%m-%d %H:%M:%S')"
fi

# 提交更改
if [ -n "$(git ls-files --others --exclude-standard)" ]; then
    echo -e "${YELLOW}發現新文件，使用 git add${NC}"
    git add . || error_exit "git add 失敗"
    git commit -m "$commit_message" || error_exit "git commit 失敗"
else
    git commit -am "$commit_message" || error_exit "git commit 失敗"
fi

# 推送到遠程
echo -e "${YELLOW}正在推送到遠程...${NC}"
git push || error_exit "git push 失敗"

echo -e "${GREEN}完成！${NC}"
echo -e "${GREEN}提交信息: $commit_message${NC}"

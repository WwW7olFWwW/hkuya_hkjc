# HKUYA.org (/hkjc) Deployment Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 把 VitePress 站點部署到阿里雲 ECS，並以 Caddy 對外提供 `https://hkuya.org/hkjc/`。

**Architecture:** 以 VitePress 靜態輸出到 `.vitepress/dist`，同步到 ECS 上的網站目錄，Caddy 以反向代理或靜態檔案站點方式提供 `/hkjc/` 子路徑；HTTPS 由 Caddy 自動簽發。

**Tech Stack:** VitePress, Node.js, Caddy, Linux (Aliyun ECS)

### Task 1: 確認本機 build 與輸出路徑

**Files:**
- Modify: `docs/memory.md`

**Step 1: 執行 build**

Run: `npm run docs:build`
Expected: build 成功，輸出在 `.vitepress/dist`。

**Step 2: 記錄 build 結果與警告**

Update: `docs/memory.md`，紀錄 build 成功與警告（若有）。

### Task 2: 準備 ECS 上的目錄結構

**Files:**
- Create: `/var/www/hkuya.org/hkjc` (ECS)

**Step 1: 建立部署目錄**

Run (ECS): `sudo mkdir -p /var/www/hkuya.org/hkjc`

**Step 2: 設定目錄權限**

Run (ECS): `sudo chown -R www-data:www-data /var/www/hkuya.org`

### Task 3: 上傳靜態檔案到 ECS

**Files:**
- Source: `.vitepress/dist/**`
- Target: `/var/www/hkuya.org/hkjc/`

**Step 1: Rsync 上傳**

Run (local):
`rsync -avz --delete .vitepress/dist/ <user>@<ecs-ip>:/var/www/hkuya.org/hkjc/`

Expected: 檔案同步完成。

### Task 4: Caddy 設定（子路徑 /hkjc）

**Files:**
- Modify: `/etc/caddy/Caddyfile` (ECS)

**Step 1: 建立 Caddyfile**

Add:

```
hkuya.org {
  encode gzip zstd

  handle_path /hkjc/* {
    root * /var/www/hkuya.org/hkjc
    try_files {path} {path}/ /hkjc/index.html
    file_server
  }
}
```

**Step 2: 檢查並 reload Caddy**

Run (ECS):
`sudo caddy validate --config /etc/caddy/Caddyfile`

Run (ECS):
`sudo systemctl reload caddy`

Expected: Caddy reload 成功。

### Task 5: DNS 與 HTTPS 驗證

**Files:**
- DNS (domain provider)

**Step 1: 確認 DNS**

Set A/AAAA record:
- `hkuya.org` → ECS 公網 IP

**Step 2: 驗證 HTTPS**

Open: `https://hkuya.org/hkjc/`
Expected: HTTPS 正常、頁面可載入。

### Task 6: 部署後驗收

**Files:**
- Modify: `docs/memory.md`

**Step 1: 檢查主要路徑**

Check:
- `https://hkuya.org/hkjc/`
- `https://hkuya.org/hkjc/admin.html`

**Step 2: 更新部署記錄**

Update: `docs/memory.md` 記錄部署完成時間與驗收項目結果。

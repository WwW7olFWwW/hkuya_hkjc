# Project Memory

- 站點使用 VitePress v2.0.0-alpha.15，base 設為 `/hkjc/`。
- 單頁式 landing：ProjectIntro → Interview → Timeline → Positions → AboutUs → Contact。
- UI 使用最新 shadcn-vue default 風格；不使用 Umami。
- 實習崗位與時間表資料已抽離至 `data/positions.ts`、`data/timeline.ts`。
- 內容改為 Supabase 驅動：`lib/content/defaultContent.ts` 為 fallback，`content_blocks` 會在前端 runtime 載入並透過 Realtime 更新。
- 環境變數：`VITE_SUPABASE_URL`、`VITE_SUPABASE_ANON_KEY`（參考 `.env.example`）。
- 管理頁：`admin.md` → `/admin.html`，使用共用帳號登入後可編輯各區塊內容。
- 後台表單改為 Form.io（@formio/js），Admin 內含 Content Editor + Schema Builder；表單定義存 Supabase `formio_forms`，歷史存 `formio_forms_history`，每個 slug 保留最近 7 版，回滾有二次確認。
- Schema Builder 支援「產生初始 schema」：依 `defaultContent` 結構建立 editgrid/textarea 等欄位，產生後可儲存。
- Content Editor 提供「批次產生並儲存」：一鍵為所有 slug 產生並寫入 schema（會建立歷史版本）。
- Content Editor 提供「只建立缺少的」：僅為缺少 schema 的 slug 產生並儲存。
- Content Editor 仍寫回 `content_blocks`；多行輸入依 `defaultContent` 模板把字串拆成陣列（例如 duties/eligibility）。
- Form.io CSS 已由 `styles/global.css` 引入 `@formio/js/dist/formio.full.min.css`。
- 匯出 schema：`npm run formio:export -- --slug <slug>`，輸出到 `lib/forms/formio/{slug}.json`，並在匯出前寫入 history（即使匯出失敗，history 仍保留）。
- About Us/Contact 已改為後台可編輯（organizations/email/tel）。
- Google Sheet 連結尚未接入，後續可新增 CSV 轉換流程。
- Dev 反代：/hkjc 目前 Caddy 指向 [::1]:5173（VitePress dev 預設只綁 IPv6 loopback）。
- Tailwind v4：`styles/global.css` 需加 `@config "../tailwind.config.ts"`（可搭配 `@source` 指定掃描範圍）；`tailwind.config.ts` 要合併 `defaultTheme` 才會產生 spacing/字級/rounded 等核心 utilities。
- 所有 section 版型對齊 root；內容改由 Supabase `content.fields.*` 驅動，但保留 root 的結構與 CSS class（如 timeline/tabs/position）。
- 2026-01-30 視覺調整方向：活力活動感，新增 CTA 橙色與淡色背景層級，強化導覽對齊與錨點 scroll margin。
- 已套用活動感視覺調整：導覽列對齊、背景紋理、CTA 橙色、主次卡片層級、Tabs a11y、Contact/Interview 區塊版型更新。
- 2026-02-03 合併 `plan/formio-js` → `main`（fast-forward），新增 Form.io Builder/Editor 與 schema 管理相關檔案。
- 為避免 VitePress build 讀取 `@formio/js` edit.data 失敗，Formio Builder/Editor 改用 `@formio/js/dist/formio.full.js` 動態載入；`.vitepress/config.ts` 加入 `optimizeDeps.exclude` 與 `ssr.external`。
- 新增 `lib/formio/schemaDefaults.ts` 以補齊 schema 產生流程。
- `npm test` 全數通過；`npm run docs:build` 成功但有警告：`bootstrap-icons` 字型未在 build 時解析、`formio.full.js` 多處 `eval` 警告、chunk size > 500 kB。
- 2026-02-04 部署前再測：`npm run docs:build` 成功；警告同上（字型解析、eval、chunk size）。 
- 2026-02-04 已部署到 ECS：靜態檔案在 `/var/www/hkuya.org/hkjc`，Caddy 站台 `hkuya.org` 對外提供 `/hkjc`；Caddy 已成功取得 hkuya.org 憑證並回應 `/hkjc/`、`/hkjc/admin.html`。

## 部署指引（重新 docs:build 並部署到 /var/www/hkuya.org/hkjc）

### 前置條件
- `.env.local` 必須存在於專案根目錄，並包含：
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

### 步驟
1. 進入專案並確認環境變數檔案：
   ```bash
   cd /home/pklaw/hkuya_hkjc
   ls -l .env.local
   ```

2. 重新建置：
   ```bash
   npm run docs:build
   ```

3. 備份舊站（建議）：
   ```bash
   ts=$(date +%Y%m%d%H%M%S)
   sudo mv /var/www/hkuya.org/hkjc /var/www/hkuya.org/hkjc.bak-$ts
   sudo mkdir -p /var/www/hkuya.org/hkjc
   ```

4. 部署新產物：
   ```bash
   sudo cp -a /home/pklaw/hkuya_hkjc/.vitepress/dist/. /var/www/hkuya.org/hkjc/
   ```

5. 本機驗證：
   ```bash
   rg -n "__SUPABASE_" /var/www/hkuya.org/hkjc/admin.html
   curl -sS -o /dev/null -w "%{http_code}\n" --resolve hkuya.org:443:127.0.0.1 https://hkuya.org/hkjc/admin.html
   ```

### 回滾方式（如需要）
```bash
sudo rm -rf /var/www/hkuya.org/hkjc
sudo mv /var/www/hkuya.org/hkjc.bak-<timestamp> /var/www/hkuya.org/hkjc
```

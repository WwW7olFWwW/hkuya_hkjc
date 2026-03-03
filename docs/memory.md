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
- Form.io 資產改為由 `lib/formio/formioAssets.ts` 指向 `public/formio/formio.full.min.js/.css`（避免主站 bundle 夾帶錯誤字型路徑）。
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
- 2026-02-12 11:47 已重新部署（修正 Footer hydration mismatch）：備份為 `/var/www/hkuya.org/hkjc.bak-20260212114753`，新版本已覆蓋 `/var/www/hkuya.org/hkjc`，本機回環驗證 `/hkjc/`、`/hkjc/admin.html` 皆為 200。
- 2026-02-12 11:58 已修正 PocketBase 連線：production build 會把 loopback `VITE_POCKETBASE_URL` 轉為 `/pb`；Caddy `hkuya.org` 站台新增 `handle /pb/*` 反代到 `127.0.0.1:8090`；重新部署後 `window.__POCKETBASE_URL__="/pb"`，`/pb/api/health` 與 `hkjc_content_blocks` 查詢皆回 200。
- 2026-02-12 Interview 區塊新增可編輯欄位：`firstRoundLabel`、`firstRoundDate`、`secondRoundLabel`、`secondRoundDate`；前台 `InterviewSection` 改為直接讀取這四個 `content.fields`。若後台沿用舊版 interview schema，需在後台重新產生/儲存 schema 才會顯示新欄位。
- 2026-02-12 12:35 已修正 `/hkjc/admin.html` hydration mismatch：`AdminPage` 登入表單改為 client mount 後才渲染（SSR 顯示「後台載入中...」），避免 SSR 與瀏覽器端表單狀態不一致。重新部署備份為 `/var/www/hkuya.org/hkjc.bak-20260212123501`，`/hkjc/admin.html` 與 `/pb/api/health` 皆回 200。
- 2026-02-13 Nav/Footer 連結改為後台同一套配置（`site_settings.fields.headerLinks/footerQuickLinks/footerSocialLinks`）；新增 `lib/navigation/normalizeLinks.ts` 實作 href 規則（允許 `https://`、`/path`、`#anchor`）、`primary` 去重（最多 1 個、允許 0 個）、社交 icon 白名單（facebook/instagram）。站內路徑會自動套 base `/hkjc`。依需求「不顯示主強調」，前台已不再使用 `primary` 進行任何視覺差異（僅保留欄位與唯一性規則）。已重新部署，備份 `/var/www/hkuya.org/hkjc.bak-20260213021918`。
- 2026-02-13 修正 `/hkjc/admin.html` bootstrap-icons 字型載入錯誤（OTS parsing error）：把 `bootstrap-icons.woff2/.woff` 放入 `public/formio/fonts/`，並移除 `styles/global.css` 的 `@formio/js/dist/formio.full.min.css` 全域匯入，避免產生不存在的 `/hkjc/assets/fonts/bootstrap-icons.*` 請求。已重新部署，備份 `/var/www/hkuya.org/hkjc.bak-20260213024724`。
- 2026-02-13 進一步收斂 admin hydration 風險：`.vitepress/theme/Layout.vue` 在 `admin.md` 路由不再渲染全域 `NavBar/FooterBar`，並移除 admin 頁面頂部 header offset（`site-main--admin`）。已重新部署，備份 `/var/www/hkuya.org/hkjc.bak-20260213030858`。
- 2026-02-13 根因定位完成：`/hkjc/admin`（或 `/hkjc/admin/`）會由 server 回 `index.html`，但 client router 會解析成 admin route，導致 hydration mismatch。已在 `.vitepress/config.ts` 注入 redirect script，把 alias 路徑轉到 `/hkjc/admin.html`。已重新部署，備份 `/var/www/hkuya.org/hkjc.bak-20260213033342`。
- 2026-02-13 修正 Form.io EditGrid 操作按鈕無文字：`FormioEditor/FormioBuilder` root 增加 `admin-formio`，並在 `styles/global.css` 為 `.editRow/.removeRow` 加入「編輯/刪除」文字 fallback（`::after`）。已重新部署到 `/var/www/hkuya.org/hkjc`，部署前備份於 `/home/pklaw/deploy_backups/hkjc-20260213035238`。
- 2026-02-26 12:16 已部署最新 admin UI/UX 版本到 `/var/www/hkuya.org/hkjc`，部署前備份為 `/var/www/hkuya.org/hkjc.bak-20260226121653`。驗證結果：`https://hkuya.org/pb/api/health` 回 200；`/hkjc/` 與 `/hkjc/admin.html` 經轉址後最終為 `https://www.hkuya.org/...` 並回 200。
- 2026-02-26 12:33 已部署 Content Editor 排版優化版到 `/var/www/hkuya.org/hkjc`，部署前備份為 `/var/www/hkuya.org/hkjc.bak-20260226123332`。驗證結果：`/pb/api/health` 回 200；`/hkjc/`、`/hkjc/admin.html` 由 `hkuya.org` 308 轉址至 `www.hkuya.org` 後最終回 200。
- 2026-02-26 15:xx `positions` 後台編輯體驗優化：新增 `lib/formio/enhanceSchemaForAdmin.ts`，針對 `positions` 強化 schema（可讀 label、EditGrid 操作文案、行列提示/placeholder），並接入 Editor/Builder/批次產生流程。
- 2026-02-26 15:21 在「不使用低記憶體模式」前提下，先清理閒置 `context7-mcp/mcp-server-github` 程序釋放記憶體，再以正常 `npm run docs:build` 成功建置並重新部署。部署前備份為 `/var/www/hkuya.org/hkjc.bak-20260226152145`；`/pb/api/health` 回 200，`/hkjc/`、`/hkjc/admin.html` 轉址後最終 200。
- 2026-02-26 15:38 已部署 About Us 圖片上傳替換功能版：備份為 `/var/www/hkuya.org/hkjc.bak-20260226153802`，新版覆蓋 `/var/www/hkuya.org/hkjc`；`/pb/api/health` 回 200，`/hkjc/`、`/hkjc/admin.html` 轉址後最終 200。
- 2026-02-26 15:50 已部署 Project Intro `posterUrl` 上傳替換版：備份為 `/var/www/hkuya.org/hkjc.bak-20260226155043`，新版覆蓋 `/var/www/hkuya.org/hkjc`；`/pb/api/health` 回 200，`/hkjc/`、`/hkjc/admin.html` 轉址後最終 200。
- 2026-02-26 16:05 修正 Formio `file` 欄位舊值相容問題（`t.files.forEach is not a function`）後重新部署：首次 build OOM（exit 137），改為終止閒置 `context7-mcp` 進程釋放記憶體，再以正常模式 build 成功並部署；備份為 `/var/www/hkuya.org/hkjc.bak-20260226160506`，`/pb/api/health` 與 `/hkjc/`、`/hkjc/admin.html` 轉址後最終皆 200。
- 2026-02-26 16:31 修正首頁圖片 404（`poster.webp` / `logo.png` bare filename）導致版面異常：`mapSubmissionToContent` 加入 base64 優先與 bare filename template fallback，前台 `ProjectIntro/AboutUs` 增加 bare filename → `/images/*` 映射，`normalizeContent` 也加入圖片路徑正規化；重新部署備份 `/var/www/hkuya.org/hkjc.bak-20260226163101`，`/pb/api/health`、`/hkjc/`、`/hkjc/admin.html` 轉址後最終皆 200。
- 2026-02-26 17:39 修正 admin Formio 圖片預覽 base 路徑：`mapContentToFormioSubmission` 增加 base-aware preview URL（`/hkjc/images/*`），`FormioEditor` 傳入 `import.meta.env.BASE_URL`，`mapSubmissionToContent` 增加 `/hkjc/images/*` 回寫為模板 `/images/*` 的保護。重新部署備份 `/var/www/hkuya.org/hkjc.bak-20260226173926`；`/pb/api/health`、`/hkjc/`、`/hkjc/admin.html` 最終 200，`/hkjc/images/poster.webp` 與 `/hkjc/images/logo.png` 200。
- 2026-02-26 18:25 修正「有舊圖時看不到上傳按鈕」：Formio `file` 模板在 `multiple=false && files.length>0` 會隱藏 `fileBrowse`。已將 `about_us.logo`、`project_intro.posterUrl` 於 admin 增強 schema 改為 `multiple=true`，並補齊 `input/uploadOnly/filePattern/webcam`；同時 `mapSubmissionToContent` 在 string template + file array 改取最後一筆（最新上傳）確保替換生效。已部署，備份 `/var/www/hkuya.org/hkjc.bak-20260226182534`，`/pb/api/health`、`/hkjc/`、`/hkjc/admin.html`、`/hkjc/images/logo.png`、`/hkjc/images/poster.webp` 皆 200。
- 2026-03-03 11:54 修復 positions 區塊字符串被錯誤拆分成字符數組的問題：在 `normalizeContent.ts` 新增 `fixBrokenStringArray` 函數，檢測並修復所有單字符元素組成的數組（如 "Job Positions" → ["J", "o", "b", ...]），擴展 `normalizePositionsFields` 遞歸處理所有嵌套字段（titleZh/titleEn/location/description/companyLines/roleLines/requirements/duties）。已部署，備份 `/var/www/hkuya.org/hkjc.bak-20260303115451`，`/pb/api/health`、`/hkjc/`、`/hkjc/admin.html` 最終皆 200。
- 2026-03-03 12:10 修復 positions 字段從 PocketBase 字符串轉換為數組的問題：發現 PocketBase 中 companyLines/roleLines/requirements/duties 保存為字符串（換行符分隔），而前端組件期望數組格式。在 `normalizePositionsFields` 中添加字符串檢測，使用 `normalizeStringList` 將換行符分隔的字符串拆分成數組，同時保留 `fixBrokenStringArray` 修復字符數組的邏輯。已部署，備份 `/var/www/hkuya.org/hkjc.bak-20260303121044`，`/pb/api/health`、`/hkjc/`、`/hkjc/admin.html` 皆 200。

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

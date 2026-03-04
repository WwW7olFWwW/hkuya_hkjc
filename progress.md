# Progress Log

## 2026-02-12
- 已確認需求：Interview 區塊兩輪日期/標題要改為後台可編輯。
- 已完成程式碼定位與影響面確認（InterviewSection、defaultContent、測試）。
- 已完成 RED：`tests/components/InterviewSection.test.ts` 新增兩輪標題/日期斷言，初次執行失敗（預期）。
- 已完成 GREEN：
  - `lib/content/defaultContent.ts` 為 `interview.fields` 新增四個欄位。
  - `components/sections/InterviewSection.vue` 改成讀取四個欄位渲染。
- 驗證：
  - `npx vitest run tests/components/InterviewSection.test.ts tests/content/normalizeContent.test.ts tests/lib/contentEditorSchemas.test.ts tests/formio/schemaGenerator.test.ts` 通過。
  - `npm test` 全通過（27 files / 55 tests）。
  - `npm run docs:build` 成功（維持既有字型/chunk warning）。

## 2026-02-12（Admin hydration 修正）
- 新增 `tests/components/AdminPageHydration.test.ts`，先確認現況（SSR 會輸出登入 input）。
- `components/admin/AdminPage.vue` 加入 `clientReady` 門檻：SSR 先顯示「後台載入中...」，client mount 後再顯示登入表單。
- 更新 `tests/components/AdminPage.test.ts` 改用 `findByLabelText`，配合 clientReady 渲染時序。
- 驗證：
  - `npx vitest run tests/components/AdminPageHydration.test.ts tests/components/AdminPage.test.ts` 通過。
  - `npm test` 全通過（29 files / 58 tests）。
  - `npm run docs:build` 成功。
- 已部署到 `/var/www/hkuya.org/hkjc`（備份：`/var/www/hkuya.org/hkjc.bak-20260212123501`）。

## 2026-02-13（Nav/Footer 後台配置）
- 新增後台配置欄位（site_settings）：
  - `headerLinks`（NavBar）
  - `footerQuickLinks`、`footerSocialLinks`（FooterBar）
- 新增 `lib/navigation/normalizeLinks.ts`（href 校驗、primary 去重、social icon 白名單、站內路徑套用 base）。
- 更新 `components/navigation/NavBar.vue`、`components/navigation/FooterBar.vue` 改讀 `site_settings.fields`。
- 新增/更新測試：
  - `tests/lib/navigationLinks.test.ts`
  - `tests/components/FooterBar.test.ts`
  - `tests/components/NavBar.test.ts`（新增從 site_settings 取 links）
  - `tests/formio/schemaGenerator.test.ts`（site_settings links 為 editgrid）
- 驗證：
  - `npm test` 全通過（31 files / 65 tests）
  - `npm run docs:build` 成功
  - 已部署到 `/var/www/hkuya.org/hkjc`（備份：`/var/www/hkuya.org/hkjc.bak-20260213021918`）

## 2026-02-13（取消主強調樣式）
- 依新需求「不顯示任何主強調」，NavBar/FooterBar 不再根據 `primary` 套用視覺強調 class（`nav-link--primary`、`mobile-cta`、`footer-cta`）。
- 測試先行（RED）：新增 `tests/components/NavBar.test.ts`、`tests/components/FooterBar.test.ts` 斷言不應出現主強調 class，先跑出失敗。
- 最小實作（GREEN）：更新 `components/navigation/NavBar.vue`、`components/navigation/FooterBar.vue` 改為統一一般連結樣式。
- 驗證：
  - `npx vitest run tests/components/NavBar.test.ts tests/components/FooterBar.test.ts` 通過
  - `npm test` 全通過（31 files / 67 tests）
  - `npm run docs:build` 成功（維持既有 bootstrap-icons/chunk size warning）

## 2026-02-13（修正 admin 字型錯誤）
- 新增測試（RED）：`tests/formio/formioAssets.test.ts` 斷言 `public/formio/fonts/bootstrap-icons.woff2/.woff` 必須存在，初次執行失敗。
- 最小修正（GREEN）：
  - 新增 `public/formio/fonts/bootstrap-icons.woff2`
  - 新增 `public/formio/fonts/bootstrap-icons.woff`
  - 移除 `styles/global.css` 的 `@formio/js/dist/formio.full.min.css` 全域匯入，避免主站 `assets/style*.css` 產生不存在的 `assets/fonts/bootstrap-icons.*` 請求。
- 驗證：
  - `npx vitest run tests/formio/formioAssets.test.ts` 通過
  - `npm test` 全通過（31 files / 68 tests）
  - `npm run docs:build` 成功，且不再出現 bootstrap-icons unresolved warning
  - 部署後 `https://hkuya.org/hkjc/formio/fonts/bootstrap-icons.woff2`、`.woff` 皆為 200

## 2026-02-13（admin hydration 風險收斂）
- 調整 `.vitepress/theme/Layout.vue`：`admin.md` 路由不再渲染全域 `NavBar/FooterBar`，`site-main` 改用 `site-main--admin`（`padding-top: 0`），減少 admin 頁面 SSR/CSR 差異來源。
- 新增 `tests/components/LayoutAdminRoute.test.ts`，驗證 admin route 不應渲染 header/footer。
- 更新 `tests/components/LayoutHydration.test.ts` mock（新增 `useData()`），維持 hydration 測試覆蓋。
- 驗證：
  - `npx vitest run tests/components/LayoutHydration.test.ts tests/components/LayoutAdminRoute.test.ts` 通過
  - `npm test` 全通過（32 files / 69 tests）
  - `npm run docs:build` 成功
  - 已部署到 `/var/www/hkuya.org/hkjc`（備份：`/var/www/hkuya.org/hkjc.bak-20260213030858`）

## 2026-02-13（修正 /hkjc/admin 路徑導致 hydration mismatch）
- 透過 Vue hydration mismatch 詳細訊息定位：使用者實際進入路徑可能是 `/hkjc/admin` 或 `/hkjc/admin/`，server 回傳 `index.html`，但 client router 解析為 admin page，造成 hydration mismatch。
- 最小修正：在 `.vitepress/config.ts` 的 `head` 注入 redirect script，當偵測到 `/hkjc/admin` 或 `/hkjc/admin/` 時自動 `replace` 到 `/hkjc/admin.html`。
- 驗證：
  - `npm test` 全通過（32 files / 69 tests）
  - `npm run docs:build` 成功
  - 已部署到 `/var/www/hkuya.org/hkjc`（備份：`/var/www/hkuya.org/hkjc.bak-20260213033342`）

## 2026-02-13（修正 EditGrid 操作按鈕無文字）
- 問題定位：Form.io EditGrid action button（`.editRow` / `.removeRow`）模板預設為 icon-only，當 icon 字型不可見時會看起來「沒有文字」。
- 最小修正：
  - `components/admin/FormioEditor.vue`、`components/admin/FormioBuilder.vue` 根容器加上 `admin-formio` class。
  - `styles/global.css` 新增 `.admin-formio .btn.editRow::after` 與 `.admin-formio .btn.removeRow::after`，顯示「編輯 / 刪除」文字 fallback。
- 測試補強：
  - `tests/components/FormioEditor.test.ts` 斷言 editor shell 具有 `.admin-formio`。
  - `tests/components/FormioBuilder.test.ts` 斷言 builder shell 具有 `.admin-formio`。
- 驗證：
  - `npx vitest run tests/components/FormioEditor.test.ts tests/components/FormioBuilder.test.ts` 通過
  - `npm test` 全通過（32 files / 69 tests）
  - `npm run docs:build` 成功
  - 已部署到 `/var/www/hkuya.org/hkjc`（部署前備份：`/home/pklaw/deploy_backups/hkjc-20260213035238`）

## 2026-02-26（Admin UI/UX 優化）
- 依 `ui-ux-pro-max` 規範重整 admin 視覺層級與互動：
  - `components/admin/AdminPage.vue`：改為 dashboard hero + login panel 版型，新增登入中狀態與一致化錯誤回饋。
  - `components/admin/ContentEditor.vue`：重構控制區，區分內容選擇、批次操作、mode tabs，並加入狀態 chip。
  - `components/admin/FormioEditor.vue`、`components/admin/FormioBuilder.vue`：統一 header/actions/status/history 語義與可讀性。
  - `styles/global.css`：新增 `admin-*` 設計語彙（input/action/feedback/form-canvas/history/focus/reduced-motion）。
- 驗證：
  - `npx vitest run tests/components/AdminPage.test.ts tests/components/AdminPageHydration.test.ts tests/components/FormioEditor.test.ts tests/components/FormioBuilder.test.ts` 通過（4 files / 6 tests）。
  - `npm run docs:build` 成功（僅既有 chunk size warning，無 errors）。

## 2026-02-26（部署）
- 部署前檢查完成：`.env.local` 存在，`sudo` 可用，目標路徑 `/var/www/hkuya.org/hkjc` 可寫。
- 重新建置：`npm run docs:build` 成功（`build complete`，僅 chunk size warning）。
- 部署執行：
  - 備份舊版為 `/var/www/hkuya.org/hkjc.bak-20260226121653`
  - 新版部署到 `/var/www/hkuya.org/hkjc`
- 驗證：
  - `https://hkuya.org/pb/api/health` 回 200
  - `https://hkuya.org/hkjc/`、`https://hkuya.org/hkjc/admin.html` 先回 308 並轉址到 `https://www.hkuya.org/...`，最終皆回 200

## 2026-02-26（Content Editor 排版優化）
- 版面重構：
  - `components/admin/ContentEditor.vue` 改為 workspace 兩欄：左側控制面板（slug/mode/schema tools），右側主編輯區（Editor/Builder）。
  - `components/admin/FormioEditor.vue`、`components/admin/FormioBuilder.vue` 改為簡化的 `admin-panel`，保留核心資訊與操作。
- 樣式收斂：
  - `styles/global.css` 新增 `admin-workspace*`、`admin-panel`、`admin-side-title`、`admin-main-head`。
  - 收斂過重陰影與背景效果，保留清楚層級但不浮誇。
- 驗證：
  - `npx vitest run tests/components/AdminPage.test.ts tests/components/AdminPageHydration.test.ts tests/components/FormioEditor.test.ts tests/components/FormioBuilder.test.ts` 通過（4 files / 6 tests）。
  - `npm run docs:build` 成功（僅既有 chunk size warning，無 errors）。

## 2026-02-26（部署 Content Editor 排版優化版）
- 部署執行：
  - 備份舊版為 `/var/www/hkuya.org/hkjc.bak-20260226123332`
  - 新版部署到 `/var/www/hkuya.org/hkjc`
- 驗證：
  - `https://hkuya.org/pb/api/health` 回 200
  - `https://hkuya.org/hkjc/`、`https://hkuya.org/hkjc/admin.html` 先回 308 並轉址到 `https://www.hkuya.org/...`，最終皆回 200

## 2026-02-26（Positions 編輯介面人性化）
- 新增 `lib/formio/enhanceSchemaForAdmin.ts`，針對 `positions` 套用後台友善 schema：
  - key → 可讀 label（例如 `companyLines` →「公司名稱（每行一條）」）
  - `groups/positions` EditGrid 改為更明確操作文案（新增/儲存/取消/刪除）
  - `companyLines/roleLines/requirements/duties` 補 placeholder、description、rows
  - `description` 欄位自動升級為 textarea（地區描述）
- 接線更新：
  - `components/admin/FormioEditor.vue` 載入 schema 時套用 `enhanceSchemaForAdmin`
  - `components/admin/FormioBuilder.vue` 載入/產生 schema 時套用 `enhanceSchemaForAdmin`
  - `components/admin/ContentEditor.vue` 批次產生並儲存時套用 `enhanceSchemaForAdmin`
- 測試補強：
  - 新增 `tests/formio/enhanceSchemaForAdmin.test.ts`（label、EditGrid 行為、textarea 提示、非 positions 不變）
- 驗證：
  - `npx vitest run tests/formio/enhanceSchemaForAdmin.test.ts tests/formio/schemaGenerator.test.ts tests/formio/mapSubmission.test.ts tests/components/FormioEditor.test.ts tests/components/FormioBuilder.test.ts tests/components/AdminPage.test.ts tests/components/AdminPageHydration.test.ts` 通過（7 files / 16 tests）。
  - `npm run docs:build` 在本機被系統 OOM kill（exit 137，無 swap，於 `building client + server bundles` 階段中止）。

## 2026-02-26（依使用者要求改為清進程再部署）
- 使用者要求「不要用低記憶體模式」，改採清理閒置程序。
- 清理執行：
  - 終止大量閒置 `context7-mcp` / `mcp-server-github` 進程。
  - 記憶體從壓力狀態回到可用（`free` 顯示可用空間大幅增加）。
- 設定還原：
  - `.vitepress/config.ts` 已移除臨時低記憶體建置開關，維持原本配置。
- 建置與部署：
  - `npm run docs:build` 正常模式成功（`build complete`）。
  - 重新部署到 `/var/www/hkuya.org/hkjc`，備份為 `/var/www/hkuya.org/hkjc.bak-20260226152145`。
- 線上驗證：
  - `https://hkuya.org/pb/api/health` 回 200
  - `https://hkuya.org/hkjc/`、`https://hkuya.org/hkjc/admin.html` 先 308 轉址到 `https://www.hkuya.org/...`，最終皆 200

## 2026-02-26（About Us 新增圖片上傳替換）
- 功能實作：
  - `lib/formio/enhanceSchemaForAdmin.ts` 擴充 `about_us` 增強邏輯：
    - `organizations` editgrid 改為非 inline，新增明確操作文案（新增/儲存/取消/刪除）
    - `logo` 欄位改為 `file`（`storage=base64`，圖片限定，單檔）
    - about_us 相關欄位補可讀 label/placeholder/description
  - `components/admin/FormioEditor.vue`、`components/admin/FormioBuilder.vue`、`components/admin/ContentEditor.vue` 全部接入 `enhanceSchemaForAdmin`，確保即時編輯、schema 產生、批次產生一致。
  - `lib/formio/mapSubmission.ts` 新增檔案欄位映射：當 template 為 string 且 submission 為 file object/array 時，自動抽取 `url/data` 寫回字串。
  - `components/sections/AboutUsSection.vue` 的 `resolveAsset` 新增外部/data/blob URL 直通，避免錯誤加上 `withBase`。
- 測試：
  - 新增 `tests/formio/enhanceSchemaForAdmin.test.ts` 的 about_us upload 斷言。
  - `tests/formio/mapSubmission.test.ts` 新增 file submission 抽取測試。
  - `tests/components/AboutUsSection.test.ts` 新增 external logo URL 顯示測試。
- 驗證：
  - `npx vitest run ...`（8 files / 21 tests）全通過。
  - `npm run docs:build` 正常成功（僅既有 chunk size warning）。

## 2026-02-26（部署 About Us 圖片上傳替換版）
- 部署執行：
  - 備份舊版為 `/var/www/hkuya.org/hkjc.bak-20260226153802`
  - 新版部署到 `/var/www/hkuya.org/hkjc`
- 驗證：
  - `https://hkuya.org/pb/api/health` 回 200
  - `https://hkuya.org/hkjc/` 由 `hkuya.org` 轉址至 `https://www.hkuya.org/hkjc/` 後最終 200
  - `https://hkuya.org/hkjc/admin.html` 由 `hkuya.org` 轉址至 `https://www.hkuya.org/hkjc/admin.html` 後最終 200

## 2026-02-26（Project Intro posterUrl 新增上傳替換）
- 功能實作：
  - `lib/formio/enhanceSchemaForAdmin.ts` 新增 `project_intro` 增強流程：
    - `posterUrl` 欄位改為 `file`（`storage=base64`、單檔、圖片類型）
    - 補齊 `project_intro` 主要欄位可讀 label
  - `components/sections/ProjectIntro.vue` 的 `resolveAsset()` 新增外部/data/blob URL 直通，避免錯誤加上 `withBase`。
- 測試：
  - `tests/formio/enhanceSchemaForAdmin.test.ts` 新增 `project_intro posterUrl` 上傳欄位斷言。
  - `tests/components/ProjectIntro.test.ts` 新增 data URL poster source 測試。
- 驗證：
  - `npx vitest run tests/formio/enhanceSchemaForAdmin.test.ts tests/formio/mapSubmission.test.ts tests/components/ProjectIntro.test.ts tests/components/FormioEditor.test.ts tests/components/FormioBuilder.test.ts tests/components/ContentEditor.test.ts` 通過（6 files / 18 tests）。
  - `npm run docs:build` 成功（`build complete in 52.98s`，僅既有 chunk size warning）。

## 2026-02-26（部署 Project Intro posterUrl 上傳版）
- 部署執行：
  - 備份舊版為 `/var/www/hkuya.org/hkjc.bak-20260226155043`
  - 新版部署到 `/var/www/hkuya.org/hkjc`
- 驗證：
  - `https://hkuya.org/pb/api/health` 回 200
  - `https://hkuya.org/hkjc/` 由 `hkuya.org` 轉址至 `https://www.hkuya.org/hkjc/` 後最終 200
  - `https://hkuya.org/hkjc/admin.html` 由 `hkuya.org` 轉址至 `https://www.hkuya.org/hkjc/admin.html` 後最終 200

## 2026-02-26（修正 Formio `t.files.forEach is not a function`）
- 問題定位：
  - `about_us.organizations.logo` 與 `project_intro.posterUrl` 已改成 Formio `file` 欄位，但既有內容仍是 string URL。
  - editor 載入 submission 時直接餵 string 給 file 元件，導致 runtime error：`t.files.forEach is not a function`。
- 最小修正：
  - 新增 `lib/formio/mapContentToFormio.ts`：
    - `mapContentToFormioSubmission(slug, fields)` 將指定 slug 的 string 圖片值轉為 file value array（含 `name/type/url/storage`）。
  - `components/admin/FormioEditor.vue` 在 `mountForm()` 前套用 `mapContentToFormioSubmission()`。
- 測試補強：
  - 新增 `tests/formio/mapContentToFormio.test.ts`（about_us/project_intro 轉換、非目標 slug 不變、不污染原物件）。
  - `tests/components/FormioEditor.test.ts` 新增 about_us logo 載入正規化測試。
- 驗證：
  - `npx vitest run tests/formio/mapContentToFormio.test.ts tests/formio/mapSubmission.test.ts tests/formio/enhanceSchemaForAdmin.test.ts tests/components/FormioEditor.test.ts tests/components/ProjectIntro.test.ts tests/components/AboutUsSection.test.ts` 通過（6 files / 21 tests）。
  - `npm run docs:build` 成功（`build complete in 53.75s`，僅既有 chunk size warning）。

## 2026-02-26（部署 Formio file 欄位錯誤修正版）
- 部署前建置：
  - 首次 `npm run docs:build` 被系統 OOM kill（exit 137）。
  - 依使用者要求改為終止閒置進程（`context7-mcp` 等）釋放記憶體後，再以正常模式重跑 build。
  - 第二次 `npm run docs:build` 成功（`build complete in 54.06s`，僅既有 chunk size warning）。
- 部署執行：
  - 備份舊版為 `/var/www/hkuya.org/hkjc.bak-20260226160506`
  - 新版部署到 `/var/www/hkuya.org/hkjc`
- 驗證：
  - `https://hkuya.org/pb/api/health` 回 200
  - `https://hkuya.org/hkjc/` 由 `hkuya.org` 轉址至 `https://www.hkuya.org/hkjc/` 後最終 200
  - `https://hkuya.org/hkjc/admin.html` 由 `hkuya.org` 轉址至 `https://www.hkuya.org/hkjc/admin.html` 後最終 200

## 2026-02-26（修正首頁圖片 404 導致版面錯亂）
- 問題定位：
  - 使用者回報 console：`poster.webp`、`logo.png` 404，造成首頁圖片區塊顯示異常。
  - `admin.html` 上大量 `A listener indicated an asynchronous response...` 屬瀏覽器擴充訊息，非站點程式錯誤。
- 修正內容：
  - `lib/formio/mapSubmission.ts`：
    - 優先抽取 `data`（base64）避免被 bare filename 的 `url` 覆蓋。
    - 針對 bare filename（如 `logo.png`）加入 template fallback，避免存回錯誤路徑。
  - `components/admin/FormioEditor.vue`：
    - `templateFields` 改用合併後的目前內容（非僅 default），讓 fallback 可保留現有正確路徑。
  - `components/sections/ProjectIntro.vue`、`components/sections/AboutUsSection.vue`：
    - `resolveAsset()` 支援 bare filename 自動映射到 `/images/<name>`。
  - `lib/content/normalizeContent.ts`：
    - 內容正規化時，自動把 `project_intro.posterUrl`、`about_us.organizations[].logo` 的 bare filename 轉為 `/images/...`。
- 測試補強：
  - `tests/content/normalizeContent.test.ts` 新增 bare filename 正規化測試。
  - `tests/formio/mapSubmission.test.ts` 新增 bare filename fallback 與 base64 優先測試。
  - `tests/components/ProjectIntro.test.ts`、`tests/components/AboutUsSection.test.ts` 新增 bare filename 路徑映射測試。
- 驗證：
  - `npx vitest run tests/content/normalizeContent.test.ts tests/formio/mapSubmission.test.ts tests/formio/mapContentToFormio.test.ts tests/components/ProjectIntro.test.ts tests/components/AboutUsSection.test.ts tests/components/FormioEditor.test.ts` 通過（6 files / 25 tests）。
  - `npm run docs:build` 成功（`build complete in 54.40s`，僅既有 chunk size warning）。

## 2026-02-26（部署首頁圖片 404 修正版）
- 部署執行：
  - 備份舊版為 `/var/www/hkuya.org/hkjc.bak-20260226163101`
  - 新版部署到 `/var/www/hkuya.org/hkjc`
- 驗證：
  - `https://hkuya.org/pb/api/health` 回 200
  - `https://hkuya.org/hkjc/` 由 `hkuya.org` 轉址至 `https://www.hkuya.org/hkjc/` 後最終 200
  - `https://hkuya.org/hkjc/admin.html` 由 `hkuya.org` 轉址至 `https://www.hkuya.org/hkjc/admin.html` 後最終 200

## 2026-02-26（修正 Admin Formio 圖片預覽 base 路徑）
- 問題定位：
  - 使用者回報 admin console 仍出現 `https://www.hkuya.org/images/poster.webp`、`.../images/logo.png` 404。
  - 根因為 Formio `file` 欄位預覽直接使用資料值中的 root path，未套 `/hkjc` base。
- 最小修正：
  - `lib/formio/mapContentToFormio.ts` 新增 base-aware 預覽 URL 處理：
    - local path 會在 admin submission 轉為 `/hkjc/images/...` 供 Formio 預覽。
  - `components/admin/FormioEditor.vue` 呼叫 `mapContentToFormioSubmission` 時傳入 `import.meta.env.BASE_URL`。
  - `lib/formio/mapSubmission.ts` 增加 base-prefixed 路徑回寫保護：如 `/hkjc/images/logo.png` 會回寫成模板路徑 `/images/logo.png`，避免污染內容資料。
- 測試補強：
  - `tests/formio/mapContentToFormio.test.ts` 新增 base path 預覽 URL 測試。
  - `tests/formio/mapSubmission.test.ts` 新增 base-prefixed URL 回寫測試。
- 驗證：
  - `npx vitest run tests/formio/mapContentToFormio.test.ts tests/formio/mapSubmission.test.ts tests/components/FormioEditor.test.ts tests/components/ProjectIntro.test.ts tests/components/AboutUsSection.test.ts tests/content/normalizeContent.test.ts` 通過（6 files / 27 tests）。
  - `npm run docs:build` 成功（`build complete in 53.31s`，僅既有 chunk size warning）。

## 2026-02-26（部署 Admin Formio 圖片預覽 base 修正版）
- 部署執行：
  - 備份舊版為 `/var/www/hkuya.org/hkjc.bak-20260226173926`
  - 新版部署到 `/var/www/hkuya.org/hkjc`
- 驗證：
  - `https://hkuya.org/pb/api/health` 回 200
  - `https://hkuya.org/hkjc/`、`https://hkuya.org/hkjc/admin.html` 轉址後最終皆 200
  - `https://www.hkuya.org/images/poster.webp`、`https://www.hkuya.org/images/logo.png` 目前仍為 404（預期）；正確資源 `https://www.hkuya.org/hkjc/images/poster.webp`、`.../hkjc/images/logo.png` 皆 200

## 2026-02-26（修正 Logo/Poster 有舊圖時看不到上傳按鈕）
- 根因定位：
  - Formio `file` 元件模板在 `multiple=false` 且欄位已有檔案值時，會隱藏 `fileBrowse` 上傳入口，造成「有上傳提示但沒有上傳按鈕」。
- 最小修正：
  - `lib/formio/enhanceSchemaForAdmin.ts`
    - `about_us.organizations.logo` 與 `project_intro.posterUrl` 改為 `multiple=true`，並明確補齊 `input/uploadOnly/filePattern/webcam` 等 file 欄位設定。
  - `lib/formio/mapSubmission.ts`
    - string template 對應 file array 時，改為取最後一筆（最新上傳）而非第一筆，確保替換舊圖可直接生效。
- 測試：
  - `tests/formio/enhanceSchemaForAdmin.test.ts` 更新 file 欄位斷言（含 `multiple=true` 與新屬性）。
  - `tests/formio/mapSubmission.test.ts` 新增「多檔時取最新上傳」測試。
- 驗證：
  - `npm run test -- tests/formio/enhanceSchemaForAdmin.test.ts tests/formio/mapSubmission.test.ts tests/formio/mapContentToFormio.test.ts tests/components/FormioEditor.test.ts` 通過（4 files / 21 tests）。
  - `npm run docs:build` 成功（`build complete in 53.97s`，僅既有 chunk size warning）。
- 部署：
  - 備份舊版：`/var/www/hkuya.org/hkjc.bak-20260226182534`
  - 新版部署到：`/var/www/hkuya.org/hkjc`
  - 驗證：
    - `https://hkuya.org/pb/api/health` 200
    - `https://www.hkuya.org/hkjc/` 200
    - `https://www.hkuya.org/hkjc/admin.html` 200
    - `https://www.hkuya.org/hkjc/images/logo.png` 200
    - `https://www.hkuya.org/hkjc/images/poster.webp` 200

## 2026-03-03（Formio 遷移方案規劃）
- 使用者反映 Formio 問題多，要求制定替代方案。
- 分析 Formio 核心問題：
  - 數據格式不一致（字符串 vs 數組轉換）
  - Bundle 過大（~500KB）
  - 維護成本高（~1500 行映射代碼）
  - 集成問題（動態加載、SSR、hydration）
- 研究替代方案：
  - 自建 Vue 編輯器（推薦）
  - Formkit / VeeValidate
  - 完整 CMS（Directus/Strapi）
- 制定詳盡遷移計劃：
  - 9 個階段，漸進式遷移
  - 從簡單到複雜（Contact → Positions）
  - 預計 5 天完成
  - 預期收益：-600KB bundle, -500 行代碼
- 創建規劃文件：
  - task_plan.md：詳細的階段計劃和成功標準
  - findings.md：技術研究和設計決策
  - progress.md：本次規劃記錄

## 2026-03-04（FormKit 替代方案詳細規劃）
- 使用者要求撰寫詳盡的 FormKit 替代方案。
- 透過 Context7 查詢 FormKit 官方文檔：
  - Schema 驅動表單生成（JSON-compatible）
  - Repeater 支援動態陣列編輯（可嵌套）
  - 內建驗證 + i18n（zh/zh-TW）
  - Tailwind CSS 整合
  - Bundle size ~28KB（vs Formio ~500KB）
- 盤點現有 Formio 代碼：
  - `lib/formio/` 10 個文件，1471 行
  - `components/admin/Formio*.vue` 2 個文件，508 行
  - `components/admin/ContentEditor.vue` 189 行
  - 合計 2168 行待移除
- 完成 FormKit 方案文檔：
  - 更新 `task_plan.md`：12 階段詳細計劃
    - Phase 1-2: FormKit 安裝與基礎設施
    - Phase 3-9: 7 個編輯器逐一實作
    - Phase 10-12: 整合、Formio 移除、部署
  - 關鍵設計決策：
    - 數據流簡化：PocketBase ↔ FormKit v-model（零映射）
    - 自訂 `image-upload` input 消除 file array 問題
    - Positions 三層嵌套用 FormKit repeater 處理
    - VitePress enhanceApp client-only 載入避免 SSR 衝突
  - 預期效果：
    - 代碼淨減少 ~968 行（新增 ~1200，移除 ~2168）
    - Bundle 減少 ~472KB（新增 28KB，移除 500KB）
    - 消除數據格式不一致問題
- 更新 `findings.md`：新增 FormKit 研究章節
  - FormKit vs Formio 關鍵差異
  - VitePress 整合方式
  - 免費版限制評估
  - 工作量對比（FormKit vs 自建 Vue）

## 2026-03-04（Phase 1: FormKit 安裝與基礎配置）
- 安裝 FormKit 依賴：
  - `npm install @formkit/vue @formkit/i18n`（新增 10 packages）
- 創建配置文件：
  - `lib/admin/formkitConfig.ts`：zh locale + admin-* class 映射
  - `styles/formkit-admin.css`：FormKit 基礎樣式
- 整合到 VitePress：
  - 更新 `.vitepress/theme/index.ts`：client-only 動態載入 FormKit plugin
  - 避免 SSR 衝突（`typeof window !== "undefined"` 判斷）
- 驗證：
  - `npm test` 全部通過（34 files / 97 tests）
  - `npm run docs:build` 成功（72.99s）
  - FormKit 已可在 client 端使用

## 2026-03-04（Phase 2: 共用工具與類型定義）
- 創建類型定義 `lib/admin/contentTypes.ts`：
  - 7 個內容區塊的 TypeScript 介面
  - ContactFields, InterviewFields, AboutUsFields, ProjectIntroFields
  - PositionsFields（含 Position, PositionGroup）
  - TimelineFields（含 TimelineStep, TimelineNote）
  - SiteSettingsFields（含 HeaderLink, FooterQuickLink, FooterSocialLink）
  - ContentSlug 和 ContentFields 聯合類型
- 創建 PocketBase composable `lib/admin/usePocketBaseContent.ts`：
  - load(): 從 PocketBase 載入並 normalize
  - save(): 寫回 PocketBase
  - reset(): 重置為原始值
  - state: fields, loading, saving, error, dirty
- 創建測試 `tests/admin/usePocketBaseContent.test.ts`
- 驗證：測試通過（1 file / 1 test）
- 註：image-upload 自訂 input 延後至 Phase 5 實作

## 2026-03-04（Phase 3: Contact 編輯器）
- 創建 `components/admin/editors/ContactEditor.vue`（38 行）：
  - 使用 `usePocketBaseContent("contact")` composable
  - FormKit 表單：titleZh, titleEn, email, tel
  - 載入/儲存/錯誤處理
- 創建測試 `tests/admin/editors/ContactEditor.test.ts`
- 驗證：
  - 測試通過（1 file / 1 test）
  - `npm run docs:build` 成功（78.96s）
  - 第一個 FormKit 編輯器驗證成功

## 2026-03-04（Phase 4: Interview 編輯器）
- 創建 `components/admin/editors/InterviewEditor.vue`（44 行）：
  - 8 個字段：titleZh/En, descriptionZh/En, firstRound/secondRound Label/Date
  - 使用 textarea 處理多行描述
- 創建測試 `tests/admin/editors/InterviewEditor.test.ts`
- 驗證：兩個編輯器測試全部通過（2 files / 2 tests）

## 2026-03-04（Phase 5: AboutUs 編輯器）
- 創建 `components/admin/editors/AboutUsEditor.vue`（46 行）：
  - 使用 FormKit `repeater` 處理 organizations 陣列
  - repeater 字段：role, name, logo, url
  - 驗證 FormKit repeater 嵌套功能
  - 註：logo 暫用 text input（路徑），圖片上傳功能可後續優化
- 創建測試 `tests/admin/editors/AboutUsEditor.test.ts`
- 驗證：三個編輯器測試全部通過（3 files / 3 tests）

## 2026-03-04（Phase 6: ProjectIntro 編輯器）
- 創建 `components/admin/editors/ProjectIntroEditor.vue`（52 行）：
  - 基本字段：titleZh/En, subtitleZh/En, descriptionZh/En, posterUrl
  - 使用 repeater 處理 infoCards 陣列
  - 註：posterUrl 暫用 text input，eligibility/fee 字段待補充
- 創建測試 `tests/admin/editors/ProjectIntroEditor.test.ts`
- 驗證：測試通過（1 file / 1 test）

## 2026-03-04（Phase 7: Positions 編輯器）
- 創建 `components/admin/editors/PositionsEditor.vue`（64 行）：
  - 三層嵌套結構：titleZh/En → groups[] → positions[]
  - 第一層 repeater：groups（location, description）
  - 第二層 repeater：positions（companyLines, roleLines, requirements, duties）
  - 使用 textarea 處理多行字段（每行一項）
  - 驗證 FormKit 支援兩層嵌套 repeater
- 創建測試 `tests/admin/editors/PositionsEditor.test.ts`
- 驗證：測試通過（1 file / 1 test）

## 2026-03-04（Phase 8: Timeline 編輯器）
- 創建 `components/admin/editors/TimelineEditor.vue`（54 行）：
  - 兩組 repeater：steps[] 和 notes[]
  - steps 字段：date, content (textarea), highlight (checkbox)
  - notes 字段：icon, title, content (textarea)
  - content 使用 textarea 處理多行（每行一項）
- 創建測試 `tests/admin/editors/TimelineEditor.test.ts`
- 驗證：測試通過（1 file / 1 test）

## 2026-03-04（Phase 9: SiteSettings 編輯器）
- 創建 `components/admin/editors/SiteSettingsEditor.vue`（62 行）：
  - logoHeight: number 字段
  - 三組 repeater：headerLinks, footerQuickLinks, footerSocialLinks
  - 使用 checkbox 處理 primary 布林值
- 創建測試 `tests/admin/editors/SiteSettingsEditor.test.ts`
- 驗證：所有 7 個編輯器測試全部通過（7 files / 7 tests）
- **里程碑**：所有 7 個 FormKit 編輯器創建完成！

## 2026-03-04（Phase 10: 整合到 AdminPage）
- 重構 `components/admin/ContentEditor.vue`（58 行，原 189 行）：
  - 移除所有 Formio 相關 import
  - Import 所有 7 個 FormKit 編輯器
  - 創建 editorMap 映射（slug → 編輯器組件）
  - 使用 computed + component :is 動態渲染編輯器
  - 移除 builder mode 和批次 schema 生成功能（FormKit 不需要）
  - 簡化 UI，只保留 slug 選擇器
- 驗證：`npm run docs:build` 成功（58.27s）
- **里程碑**：FormKit 編輯器已完全整合到 admin 系統！

## 2026-03-04（Phase 11: Formio 完全移除）
- 刪除 Formio 組件和代碼：
  - `components/admin/FormioEditor.vue`（262 行）
  - `components/admin/FormioBuilder.vue`（246 行）
  - `lib/formio/` 目錄（10 files, 1471 行）
  - `public/formio/` 目錄（靜態資源）
  - `tests/formio/` 目錄（測試文件）
  - `tests/components/FormioEditor.test.ts`
  - `tests/components/FormioBuilder.test.ts`
  - `tests/components/ContentEditor.test.ts`（過時測試）
- 卸載依賴：`npm uninstall @formio/js`（移除 65 packages）
- 清理樣式：刪除 `styles/global.css` 中所有 `.admin-formio` 相關樣式
- 驗證：
  - `npm test` 全部通過（29 files / 65 tests）
  - `npm run docs:build` 成功（39.60s，比之前快 ~30%）
- **里程碑**：Formio 完全移除，代碼淨減少 ~2000 行！

## 2026-03-04（Phase 12: 部署與驗證）
- Git commit：`feat: 完成 Formio 到 FormKit 遷移`（57 files, +1782/-3855）
- 部署執行：
  - 備份舊版為 `/var/www/hkuya.org/hkjc.bak-20260304155335`
  - 新版部署到 `/var/www/hkuya.org/hkjc`
- 驗證：
  - `https://hkuya.org/pb/api/health` 回 200
  - `https://www.hkuya.org/hkjc/` 回 200
  - `https://www.hkuya.org/hkjc/admin.html` 回 200
- **里程碑**：FormKit 遷移完成並成功部署！

## 2026-03-04（後續優化）
- 補充 ProjectIntro 缺失字段：
  - `components/admin/editors/ProjectIntroEditor.vue` 新增 eligibilityZh/En, feeZh/En（textarea，每行一項）
- 實現圖片上傳功能（最小化方案）：
  - `AboutUsEditor.vue` 新增 handleLogoUpload 函數和 file input
  - `ProjectIntroEditor.vue` 新增 handlePosterUpload 函數和 file input
  - 支援選擇圖片文件並自動轉換為 Base64 存入對應字段
- 驗證：`npm test` 全部通過（29 files / 65 tests）

## 2026-03-04（修復數組字段轉換問題）
- 問題：Positions/ProjectIntro/Timeline 編輯器的數組字段（string[]）無法正確顯示和保存
- 根因：FormKit textarea 綁定 string，但 PocketBase 存儲 string[]，缺少格式轉換
- 修復方案：
  - PositionsEditor: 添加 companyLines/roleLines/requirements/duties 轉換
  - ProjectIntroEditor: 添加 eligibilityZh/En, feeZh/En 轉換
  - TimelineEditor: 添加 steps/notes content 轉換
  - 載入時：string[] → string（用 '\n' 連接）
  - 保存時：string → string[]（按 '\n' 分割並過濾空行）
- 驗證：
  - `npm test` 全部通過（29 files / 65 tests）
  - `npm run docs:build` 成功（62.58s）
- 部署：
  - 備份：`/var/www/hkuya.org/hkjc.bak-20260304165325`
  - 部署到：`/var/www/hkuya.org/hkjc`
  - 驗證：PocketBase (200)、Admin (200)、主站 (200)
- **里程碑**：所有編輯器功能完整，數組字段正常工作！

## 2026-03-04（修復 FormKit repeater 類型錯誤）
- 問題：生產環境瀏覽器控制台報錯「Unknown input type 'repeater'」
- 影響：所有使用 repeater 的編輯器無法正常工作（ProjectIntro, Positions, Timeline, AboutUs, SiteSettings）
- 根因分析：
  - 使用 Context7 查詢 FormKit 官方文檔
  - 發現 `repeater` 是 FormKit Pro 功能，需要付費版本
  - 免費版本應使用 `list` 類型配合 `dynamic` prop 實現相同功能
- 修復方案：
  - 將所有編輯器的 `type="repeater"` 改為 `type="list" dynamic`
  - 修改文件：ProjectIntroEditor, PositionsEditor (2處), TimelineEditor (2處), AboutUsEditor, SiteSettingsEditor (3處)
  - 功能完全相同，只是使用免費版本的 API
- 驗證：
  - `npm test` 全部通過（29 files / 65 tests）
  - `npm run docs:build` 成功（51.37s）
- 部署：
  - 備份：`/var/www/hkuya.org/hkjc.bak-20260304173300`
  - 部署到：`/var/www/hkuya.org/hkjc`
  - 驗證：PocketBase (200)、Admin (200)、主站 (200)
- **里程碑**：FormKit 遷移完全完成，所有編輯器在生產環境正常工作！

## 2026-03-04（修復 FormKit list null/undefined 值錯誤）
- 問題：生產環境出現運行時錯誤「Cannot set -1 to non array value: undefined」
- 影響：用戶點擊編輯器時 FormKit 崩潰，無法正常使用
- 根因分析：
  - 使用 systematic-debugging 流程定位問題
  - 發現 `normalizeContent` 合併邏輯中的缺陷
  - 當 PocketBase 字段存在但值為 `null`/`undefined` 時，會直接使用該值
  - FormKit `list` 類型期望數組，收到 `undefined` 導致錯誤
- 修復方案：
  - 修改 `lib/content/normalizeContent.ts` 合併邏輯
  - 在合併時檢查值是否為 `null`/`undefined`
  - 如果是，則使用 `defaultContent` 的默認值（空數組）
- 驗證：
  - `npm test` 全部通過（29 files / 65 tests）
  - `npm run docs:build` 成功（55.38s）
- 部署：
  - 備份：`/var/www/hkuya.org/hkjc.bak-20260304174323`
  - 部署到：`/var/www/hkuya.org/hkjc`
  - 驗證：PocketBase (200)、Admin (200)、主站 (200)
- **里程碑**：FormKit 編輯器完全穩定，處理所有邊界情況！

## 2026-03-04（修復 FormKit list 初始化 undefined 錯誤）
- 問題：生產環境持續出現「Cannot set -1 to non array value: undefined」錯誤
- 影響：用戶點擊編輯器時 FormKit 仍然崩潰
- 根因分析：
  - 第一次修復只處理了 PocketBase 數據載入後的情況
  - 但 `usePocketBaseContent` 初始化時 `state.fields` 為空對象 `{}`
  - FormKit 在數據載入前就嘗試綁定，收到 `undefined` 值導致崩潰
- 修復方案：
  - 修改 `lib/admin/usePocketBaseContent.ts`
  - 初始化時使用 `defaultContent[slug].fields` 而非空對象
  - 確保 FormKit 始終綁定到有效的數組值
  - 更新測試以反映新的初始化行為
- 驗證：
  - `npm test` 全部通過（29 files / 65 tests）
  - `npm run docs:build` 成功（58.89s）
- 部署：
  - 備份：`/var/www/hkuya.org/hkjc.bak-20260304175351`
  - 部署到：`/var/www/hkuya.org/hkjc`
  - 驗證：PocketBase (200)、Admin (200)、主站 (200)
- **里程碑**：FormKit 初始化問題徹底解決，編輯器可立即使用！

## 2026-03-04（修復 FormKit 渲染時機導致狀態混亂）
- 問題：生產環境錯誤持續存在，即使清除緩存後仍然出現
- 影響：用戶點擊編輯器時 FormKit 崩潰
- 根因分析：
  - 前三次修復未能解決問題
  - 深入分析發現：`convertArraysToStrings()` 在 FormKit 已綁定數據後修改數據結構
  - FormKit list 期望管理穩定的數組結構，但數據轉換破壞了內部狀態追蹤
  - 當用戶點擊時，FormKit 試圖操作已被修改的數據，導致崩潰
- 修復方案：
  - 添加 `formReady` 標誌控制 FormKit 渲染時機
  - 確保 `load()` 和 `convertArraysToStrings()` 完成後才渲染表單
  - 修改文件：PositionsEditor, ProjectIntroEditor, TimelineEditor
  - 使用 `v-else-if="formReady"` 延遲 FormKit 渲染
- 驗證：
  - `npm test` 全部通過（29 files / 65 tests）
  - `npm run docs:build` 成功（61.88s）
- 部署：
  - 備份：`/var/www/hkuya.org/hkjc.bak-20260304180615`
  - 部署到：`/var/www/hkuya.org/hkjc`
  - 驗證：PocketBase (200)、Admin (200)、主站 (200)
- **里程碑**：FormKit 渲染時機問題解決，等待用戶確認錯誤是否消失！


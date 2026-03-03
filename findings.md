# Findings

## 2026-02-12
- `components/sections/InterviewSection.vue` 目前把兩輪面試標題與日期硬編碼在 template。
- `lib/content/defaultContent.ts` 的 `interview.fields` 目前只有 `titleZh/titleEn/descriptionZh/descriptionEn`。
- `lib/content/normalizeContent.ts` 會用 `defaultContent` 做欄位回填，所以只要把新欄位加進 default，即可兼容舊資料。
- 後台 schema 生成依賴 `defaultContent`，新增欄位後可由既有 Content Editor/Schema Builder 管理。
- `InterviewSection` 改成讀 `firstRoundLabel/firstRoundDate/secondRoundLabel/secondRoundDate` 後，前台顯示值可直接由內容資料控制。
- 注意：若資料庫中 `interview` 的既有 Form.io schema 是舊版，後台可能不會立即顯示新欄位；可在後台用「產生初始 schema」後儲存，或用「批次產生並儲存」覆蓋更新。
- `/hkjc/admin.html` 的 hydration mismatch 在瀏覽器環境更常見，修正策略採「不 SSR 登入表單」，避免與 client 端密碼管理器/表單狀態干擾。
- `POST /pb/api/collections/hkjc_admins/auth-with-password` 回傳 `400 {"message":"Failed to authenticate."}` 代表帳號或密碼不正確（不是連線失敗）；端點可達時這是正常回應型態。
- NavBar 與 FooterBar 原本連結為硬編碼；改為讀取 `site_settings.fields.headerLinks/footerQuickLinks/footerSocialLinks` 後即可同一套後台配置。
- 新增 `lib/navigation/normalizeLinks.ts` 統一處理：
  - href 只允許 `https://`、`/path`、`#anchor`
  - `primary` 允許 0 或 1；多於 1 時保留第一個
  - 社交 icon 目前白名單 `facebook|instagram`
- `resolveConfiguredHref()` 會對 `/path` 套 `withBase`，因此 `/admin.html` 會自動變成 `/hkjc/admin.html`。
- 依最新需求，「primary」僅保留資料層唯一性規則，不再參與前台樣式判斷；NavBar/FooterBar 連結目前全部以同一套樣式顯示。
- `bootstrap-icons` 字型錯誤（OTS parsing error）主因是 Form.io CSS 的字型檔路徑在 runtime 找不到：
  - `styles/global.css` 直接 `@import @formio/js/dist/formio.full.min.css` 會在主站 `assets/style*.css` 內留下 `fonts/bootstrap-icons.*` 相對路徑，但 `assets/fonts` 實際不存在。
  - 同時 `/formio/formio.full.min.css` 也會引用 `formio/fonts/bootstrap-icons.*`，原本 `public/formio/fonts` 缺檔。
- Console 中 `installHook.js`、`content.js`（例如 `Could not load project settings: Missing projectId`、React DevTools 提示）屬瀏覽器擴充注入腳本訊息，非本站 bundle 檔案（本站 bundle 為 `framework.* / theme.* / app.*`）。
- 透過 Playwright（無擴充、乾淨環境）對 `/hkjc/` 與 `/hkjc/admin.html` 實測，無法重現 hydration mismatch；顯示此類 warning 仍可能與客端環境注入有關。
- 為降低 admin 路由的 hydration 風險，`.vitepress/theme/Layout.vue` 於 `admin.md` 路由不再渲染全域 `NavBar/FooterBar`，並移除該頁面 header padding。
- 取得 Vue mismatch 詳細訊息後確認根因：請求路徑為 `/hkjc/admin`（或 `/hkjc/admin/`）時，server 回傳的是 `index.html`（含 header/footer 與「內容載入中...」），但 client router 解析為 admin page（`h1 內容編輯後台`），導致 hydration mismatch。

## 2026-02-26
- `ui-ux-pro-max` skill 的 `scripts` 在本機為路徑指標檔（`../../../src/ui-ux-pro-max/scripts`），目標路徑不存在，無法直接執行 `search.py`；本次改採 skill 內既有規則手動落地。
- Admin 既有頁面已具備 `admin-card/admin-subcard/admin-pill/admin-tabs` 等基礎樣式，但缺少一致化的 action/input/focus/feedback 規範，導致操作層級不明確。
- `AdminPage` 保留 `clientReady` gate 可避免 SSR 輸出登入 input，本次改版仍維持此策略，避免回歸 hydration mismatch 風險。
- 補齊可及性與互動基線：`admin-input/admin-action/admin-tab` 均加入 `focus-visible`，主要互動元件維持至少 44px 高度；另加入 `prefers-reduced-motion` 分支。
- 版面層級調整後，`ContentEditor` 與 `FormioBuilder/FormioEditor` 的控制區、狀態訊息、歷史列表視覺語義一致，減少管理流程切換成本。
- Content Editor 改為 workspace 佈局後，可把高頻操作（模式切換、批次 schema）固定在左側，降低視線往返；右側僅保留主要編輯任務，閱讀負擔明顯較低。
- `admin-tabs` 調整成可橫排/直排共用，搭配 `admin-tabs--stack` 在側欄中使用，避免為同功能維護兩套樣式。
- `positions` 後台編輯痛點主要來自通用 schema：欄位 label 直接使用 key、巢狀 EditGrid 按鈕文案抽象，且缺少「每行一條」類型欄位的輸入提示。
- 透過新增 `lib/formio/enhanceSchemaForAdmin.ts`，可在不改資料結構的前提下，僅針對 `positions` 動態強化 schema（label、placeholder、description、EditGrid 文案與行為）。
- 將優化層接入 `FormioEditor`、`FormioBuilder` 與批次 schema 產生流程後，既有資料可直接受益，未來重建 schema 也會沿用新體驗。
- 本機環境目前可用記憶體不足（3.5Gi、無 swap，建置時被系統 kill），`docs:build` 可能在 `building client + server bundles` 階段 OOM 終止（exit 137）。
- `about_us` 無法替換 logo 的核心問題不是資料表，而是後台 schema：`organizations.logo` 只有 textfield，且 submission 檔案值未轉為字串。
- 前台 `AboutUsSection` 的 `resolveAsset()` 原本一律 `withBase()`，對 `https://` 或 `data:` 來源會產生錯誤 URL；需先判斷外部/data/blob 再決定是否加 base。
- 使用 Formio `file` 元件（`storage=base64`）可在不改後端儲存架構下直接支援圖片上傳與替換；提交值通常為陣列物件，需於 `mapSubmissionToContent` 抽取 `url/data` 成為字串欄位。
- `project_intro.posterUrl` 目前同樣是純字串 textfield，若要在 admin 可替換上傳，需在 schema enhancement 階段把欄位轉為 `file(base64)`。
- `ProjectIntro` 與 `AboutUs` 同樣需要處理外部/data/blob 圖片來源；若一律 `withBase()`，上傳後的 `data:` 圖片會無法顯示。
- 實際線上錯誤 `t.files.forEach is not a function` 的直接成因：Formio `file` 欄位收到既有內容的 string 值（例如 logo URL），而非 file value array。
- 解法是「只在載入 editor submission 前」做值轉換：string URL → `[{name,type,url,storage}]`；儲存時仍沿用 `mapSubmissionToContent` 回寫為字串，保持資料庫相容。

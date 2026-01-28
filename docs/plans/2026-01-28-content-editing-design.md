# 內容可編輯與即時更新（Supabase）設計稿

## 背景
現有站點為 VitePress 單頁式 Landing，內容大多在元件與資料檔中寫死。需求是：非技術人員可修改所有文字（必要），可選更換圖片（非必要），且修改後前端立即可見。

## 目標
- 任何文案可在後台編輯並即時反映到前端。
- 管理者以單一共用帳號登入。
- 前端仍維持靜態部署，降低維運成本。
- 日流量 < 1K PV，資源配置極小化。

## 架構概覽
- 前端：VitePress 靜態站，改為「執行期載入內容」。
- 後端：Supabase（Postgres + Storage + Realtime + Auth）。
- 管理後台：自製簡化編輯頁，僅提供必要欄位與上傳入口。

## 內容模型（Postgres）
採單一表 `content_blocks` 統一管理區塊內容，降低欄位分散與維護成本。

建議欄位：
- `id` UUID (PK)
- `slug` TEXT UNIQUE（例：`project_intro`、`timeline`、`positions`）
- `fields` JSONB（包含所有文案與圖片 URL）
- `updated_at` TIMESTAMPTZ

`fields` 內可使用固定結構，例如：
- `titleZh` / `titleEn`
- `contentZh` / `contentEn`
- `items`（陣列，用於卡片或列表）
- `imageUrl`（可選）

## 編輯頁設計
- 登入方式：共用帳號 Email/Password（Supabase Auth）。
- 介面：一頁式表單，按 `slug` 展示區塊欄位。
- 圖片：可輸入 URL，或上傳至 Supabase Storage 後回填 URL。
- 表單驗證：必填欄位不可空；圖片 URL 格式檢查；字數上限。

## 即時更新與資料流
- 初次載入：前端讀取 `content_blocks`，依 `slug` 映射到各區塊。
- 即時更新：前端訂閱 Realtime 事件（`update`），收到後僅刷新對應 `slug`。
- 失敗回退：Realtime 斷線時啟用短輪詢（10–30 秒），以 `updated_at` 判斷是否需要更新。

## 權限與安全
- 前端使用匿名 key 只讀；寫入只允許登入的共用帳號。
- RLS 規則：匿名 `SELECT` 允許；`INSERT/UPDATE/DELETE` 僅限管理者角色。
- Storage 規則：匿名可讀，寫入僅限管理者。

## 錯誤處理
- 讀取失敗：顯示上一次成功載入的內容與提示訊息。
- 更新失敗：保留原內容，並提示「內容尚未更新」。
- 欄位缺失：使用預設值，避免破版。

## 測試與驗證
- 編輯流程：更新一筆內容後，前端在數秒內刷新。
- 權限測試：匿名無法寫入；共用帳號可寫入。
- 斷線情境：關閉 Realtime 時，輪詢仍可更新。

## 部署與資源估算（<1K PV）
- Supabase：最小方案即可
- 前端：既有靜態部署
- 資源參考：1 vCPU / 1–2 GB RAM / 20–50 GB 儲存（若需自管）

## 風險與後續
- 若內容結構更複雜，可拆分為多表（如 `timeline_items`、`positions`）。
- 可視需要加入版本回溯或審核流程（非必要）。


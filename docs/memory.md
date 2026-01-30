# Project Memory

- 站點使用 VitePress v2.0.0-alpha.15，base 設為 `/hkjc/`。
- 單頁式 landing：ProjectIntro → Interview → Timeline → Positions → AboutUs → Contact。
- UI 使用最新 shadcn-vue default 風格；不使用 Umami。
- 實習崗位與時間表資料已抽離至 `data/positions.ts`、`data/timeline.ts`。
- 內容改為 Supabase 驅動：`lib/content/defaultContent.ts` 為 fallback，`content_blocks` 會在前端 runtime 載入並透過 Realtime 更新。
- 環境變數：`VITE_SUPABASE_URL`、`VITE_SUPABASE_ANON_KEY`（參考 `.env.example`）。
- 管理頁：`admin.md` → `/admin.html`，使用共用帳號登入後可編輯各區塊內容。
- 後台表單改用 JSON Forms（@jsonforms/core、@jsonforms/vue、@jsonforms/vue-vanilla），支援巢狀陣列欄位新增/刪除（timeline/positions）。
- About Us/Contact 已改為後台可編輯（organizations/email/tel）。
- Google Sheet 連結尚未接入，後續可新增 CSV 轉換流程。
- Dev 反代：/hkjc 目前 Caddy 指向 [::1]:5173（VitePress dev 預設只綁 IPv6 loopback）。
- Tailwind v4：`styles/global.css` 需加 `@config "../tailwind.config.ts"`（可搭配 `@source` 指定掃描範圍）；`tailwind.config.ts` 要合併 `defaultTheme` 才會產生 spacing/字級/rounded 等核心 utilities。
- 所有 section 版型對齊 root；內容改由 Supabase `content.fields.*` 驅動，但保留 root 的結構與 CSS class（如 timeline/tabs/position）。
- 2026-01-30 視覺調整方向：活力活動感，新增 CTA 橙色與淡色背景層級，強化導覽對齊與錨點 scroll margin。
- 已套用活動感視覺調整：導覽列對齊、背景紋理、CTA 橙色、主次卡片層級、Tabs a11y、Contact/Interview 區塊版型更新。

# HKUYA HKJC VitePress 重構設計

**日期**: 2026-01-27

## 目標
- 以 VitePress v2.0.0-alpha.15 重構舊版單頁 Landing
- 保留既有內容與佈局（中文/英文雙語、區塊順序與錨點）
- UI 改用最新 shadcn-vue（default 樣式）+ Tailwind
- base 路徑為 `/hkjc/`

## 資訊架構
- 單頁首頁：ProjectIntro、Interview、Timeline、Positions、AboutUs、ContactUs
- 固定導覽列 + 行動版抽屜 + 頁尾
- 主要入口為 `index.md`，僅掛載 `<HomePage />`

## 技術方案
- VitePress 自訂 theme（`.vitepress/theme`）
- 內容拆為 Vue 元件，集中於 `components/sections/`
- 導覽列/頁尾為 `components/navigation/`
- 依賴 shadcn-vue 元件：Button、Sheet、Accordion、Dialog、Separator
- 不保留 Umami 追蹤腳本

## 可維護性設計
- 實習崗位資料抽到 `data/positions.ts`
- 時間表資料抽到 `data/timeline.ts`
- 後續可新增 CSV -> JSON 轉換流程銜接 Google Sheet

## 樣式/互動
- 導覽列維持藍綠漸層 + 白字按鈕
- 區塊以卡片、柔和陰影、清楚層級為主
- 海報放大改用 Dialog
- 手機版導覽改用 Sheet

## 風險與後續
- shadcn-vue 生成檔需遵守「不可用箭頭函數」規範，需做一致性調整
- Google Sheet 來源待接（先做靜態資料版本）

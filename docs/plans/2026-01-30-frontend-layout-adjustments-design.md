# HKUYA HKJC 活動感視覺調整草案

**日期**: 2026-01-30

## 目標
- 強化「活動招募」氛圍，避免過度通用的白底卡片感
- 提升導覽與內容對齊一致性，減少跳躍感
- 明確區分中英層級，提升掃讀效率
- 保留現有資訊架構與內容結構，不改動資料來源與路由

## 視覺方向（C：活力活動感）
- 主視覺：藍綠為底，新增高能量橙色作 CTA 與提醒色
- 背景：加入淡斜紋/點陣紋理，避免平鋪純白
- 層級：主卡 + 次卡，避免「卡片湯」

## 主要改動
### 佈局與對齊
- 導覽列內容包在 `PageContainer` 內，與正文左右對齊
- Section 增加 `scroll-margin-top`，避免錨點被固定導覽遮擋

### 字體與層級
- 中文主標保持主視覺，英文為副標（縮小、降對比、加字距）
- 標題改為分行呈現，避免中英同權重擠壓

### 色彩與強調
- 新增變數：`--brand-accent`（橙色）、`--brand-peach`（淡橙）、`--brand-ice`（淡綠）、`--brand-sky`（淡藍）
- Apply NOW 為唯一高亮 CTA（導覽列、首屏、Footer 一致）

### 卡片層級
- 主要資訊：白底 + 明顯陰影
- 次要資訊：淡色底 + 細邊框，減少陰影

## 互動與動勢
- 首屏標題、海報、資訊卡做一次性淡入上移（小幅度）
- Tabs/Position hover 僅輕微位移與陰影增強
- 避免過度微動畫，維持專業感

## 可用性與可讀性
- Tabs 補齊 `role="tab"`、`aria-selected`、`aria-controls`
- 提升白字在漸層背景上的對比度（加深底色或加深 overlay）
- 移動端菜單 CTA 置頂並高亮

## 影響範圍
- `components/navigation/NavBar.vue`：導覽對齊、CTA 強化
- `components/layout/SectionBlock.vue`：scroll margin、區塊背景調整
- `components/sections/ProjectIntro.vue`：中英層級與主視覺版型
- `components/sections/InterviewSection.vue`：日期區塊重排與強調
- `components/sections/TimelineSection.vue`：主次卡層級、時間軸樣式
- `components/sections/PositionsSection.vue`：Tabs 視覺與 a11y
- `components/sections/AboutUsSection.vue`：卡片節奏與標籤色
- `components/sections/ContactSection.vue`：資訊分欄、圖示底色
- `styles/global.css`：色彩變數、背景紋理、通用樣式

## 非目標
- 不調整內容資料來源與結構
- 不更換前端技術棧與套件

## 風險與注意事項
- CTA 色彩需與品牌一致，避免過度花俏
- 背景紋理需控制對比度，避免影響可讀性

# HKUYA HKJC VitePress 重構 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 以 VitePress v2.0.0-alpha.15 + shadcn-vue default 風格重構舊版單頁 Landing，維持內容與佈局，base 設為 `/hkjc/`。

**Architecture:** 自訂 VitePress theme，使用 `Layout` 包含 NavBar / Footer，首頁 `index.md` 掛載 `<HomePage />`，各區塊拆成 Vue 元件，實習崗位與時間表資料抽離成 TS 檔方便維護。

**Tech Stack:** VitePress v2.0.0-alpha.15, Vue 3, Tailwind CSS, shadcn-vue (default), TypeScript.

---

### Task 1: 初始化 VitePress 專案與基礎設定

**Files:**
- Create: `package.json`
- Create: `.vitepress/config.ts`
- Create: `.vitepress/theme/index.ts`
- Create: `.vitepress/theme/Layout.vue`
- Create: `styles/global.css`
- Create: `postcss.config.cjs`
- Create: `tailwind.config.ts`
- Modify: `.gitignore`

**Step 1: 初始化專案**

Run:
```
npm init -y
```

**Step 2: 安裝依賴**

Run:
```
npm install -D vitepress@2.0.0-alpha.15 tailwindcss postcss autoprefixer typescript
npm install vue
```

**Step 3: 建立 VitePress 設定**

Create `/.vitepress/config.ts`:
- 設定 `base: '/hkjc/'`
- `lang: 'zh-TW'`
- `title` / `description` 取自舊版 metadata
- `vite.resolve.alias` 設 `@` 指向專案根目錄

**Step 4: 建立 Theme 入口與 Layout**

Create `/.vitepress/theme/index.ts`:
- 匯入 `../styles/global.css`
- `export default` 包含 `Layout` 與 `enhanceApp`
- 於 `enhanceApp` 全域註冊 `HomePage`

Create `/.vitepress/theme/Layout.vue`:
- 包含 `<NavBar />`、`<Content />`、`<FooterBar />`
- `main` 加上頂部間距避免被固定導覽列蓋住

**Step 5: 建立 Tailwind / PostCSS**

Create `/postcss.config.cjs` (避免箭頭函數):
```
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
}
```

Create `/tailwind.config.ts`:
- content 包含 `index.md`, `.vitepress/**/*`, `components/**/*`, `data/**/*`
- 設定自訂色彩 CSS 變數

Create `/styles/global.css`:
- `@tailwind base; @tailwind components; @tailwind utilities;`
- 定義 CSS 變數、基礎字體與背景

**Step 6: Commit**

Run:
```
git add package.json package-lock.json .vitepress styles postcss.config.cjs tailwind.config.ts .gitignore

git commit -m "chore: scaffold vitepress"
```

---

### Task 2: 初始化 shadcn-vue (default) 並加入基礎元件

**Files:**
- Create/Modify: `components.json`
- Create: `components/ui/*`
- Modify: `tailwind.config.ts`

**Step 1: 初始化 shadcn-vue**

Run:
```

npx shadcn-vue@latest init
```

選擇 default 風格、ts、tailwind、vitepress 結構。

**Step 2: 加入元件**

Run:
```

npx shadcn-vue@latest add button sheet accordion dialog separator
```

**Step 3: 檢查並修正箭頭函數**

- 搜尋 `=>`，將所有 JS/TS 的箭頭函數改為 `function`

Run:
```

rg -n "=>" .
```

**Step 4: Commit**

Run:
```



git add components/ui components.json tailwind.config.ts

git commit -m "chore: add shadcn-vue ui"
```

---

### Task 3: 建立資料層 (timeline / positions)

**Files:**
- Create: `data/timeline.ts`
- Create: `data/positions.ts`

**Step 1: 建立 timeline 資料**

Create `/data/timeline.ts`:
- 把舊版 `timeline.tsx` 的 `timelineData` 與 `projectDetails` 轉成資料結構

**Step 2: 建立 positions 資料**

Create `/data/positions.ts`:
- 把舊版 `positions.tsx` 的 `positionData` 轉成資料結構
- 保留所有中文/英文內容

**Step 3: Commit**

Run:
```

git add data/timeline.ts data/positions.ts

git commit -m "chore: add timeline and positions data"
```

---

### Task 4: 建立共用元件與區塊元件

**Files:**
- Create: `components/layout/SectionBlock.vue`
- Create: `components/layout/PageContainer.vue`
- Create: `components/sections/ProjectIntro.vue`
- Create: `components/sections/InterviewSection.vue`
- Create: `components/sections/TimelineSection.vue`
- Create: `components/sections/PositionsSection.vue`
- Create: `components/sections/AboutUsSection.vue`
- Create: `components/sections/ContactSection.vue`
- Create: `components/HomePage.vue`

**Step 1: 建立基礎 layout 元件**

- `SectionBlock`：負責 section 內距與背景
- `PageContainer`：固定寬度與水平 padding

**Step 2: 建立各區塊元件**

- 將舊版內容搬到對應 Vue 元件
- `ProjectIntro` 使用 Dialog 顯示海報放大
- `PositionsSection` 使用 Accordion (shadcn) 作地點折疊
- `TimelineSection` 使用 data/timeline.ts
- `PositionsSection` 使用 data/positions.ts
- 所有事件處理使用 `function` 宣告

**Step 3: 建立 HomePage**

- 依序渲染 6 個 section
- 保留原本錨點 id

**Step 4: Commit**

Run:
```

git add components

git commit -m "feat: add page sections"
```

---

### Task 5: 導覽列與頁尾

**Files:**
- Create: `components/navigation/NavBar.vue`
- Create: `components/navigation/FooterBar.vue`
- Modify: `.vitepress/theme/Layout.vue`

**Step 1: NavBar**

- 導覽列固定頂部，按鈕樣式與舊版相近
- 行動版使用 Sheet
- 連結維持舊版 anchor + Google Form

**Step 2: Footer**

- 內容與舊版一致
- 社群 link 保留

**Step 3: Layout 對接**

- Layout 引入 NavBar / Footer

**Step 4: Commit**

Run:
```



git add components/navigation .vitepress/theme/Layout.vue

git commit -m "feat: add nav and footer"
```

---

### Task 6: 首頁與資產

**Files:**
- Create: `index.md`
- Create: `public/images/*`

**Step 1: 建立首頁**

Create `/index.md`:
```
---
layout: home
---

<HomePage />
```

**Step 2: 複製舊版圖片資產**

- 從 `/home/pklaw/hkuya_hkjc/old/hkuya_hkjc-main/public/images` 複製到新專案 `public/images`

**Step 3: Commit**

Run:
```



git add index.md public/images

git commit -m "feat: add homepage and assets"
```

---

### Task 7: 手動驗收

**Step 1: 啟動 dev server**

Run:
```

npm run docs:dev
```

**Step 2: 手動檢查**

- 導覽列錨點可正常跳轉
- 手機版抽屜可開關
- 海報可放大/關閉
- Positions 各地點可展開
- base 路徑 `/hkjc/` 正常

**Step 3: 最終 Commit**

Run:
```

git status
```

確認乾淨後回報結果。

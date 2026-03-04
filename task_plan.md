# Task Plan: 從 Formio 遷移到 FormKit

## Goal
移除 Formio 依賴（@formio/js ~500KB + 2168 行映射代碼），改用 FormKit 作為後台編輯框架，解決數據格式不一致、維護成本高、bundle 過大等問題。

## 為什麼選 FormKit（而非自建 Vue 編輯器）

| 維度 | Formio (現狀) | 自建 Vue 編輯器 | FormKit |
|---|---|---|---|
| Bundle size | ~500KB | ~0KB（原生 Vue） | ~28KB (core + vue) |
| 數據映射 | 需 1500+ 行映射代碼 | 無需映射 | 無需映射，直接 v-model |
| 重複陣列 (EditGrid) | 多層嵌套問題多 | 需自建 ArrayField | 原生 `repeater` 支援 |
| 圖片上傳 | file 元件格式衝突 | 需自建 ImageUpload | 可自訂 file input |
| Schema 驅動 | 有（但格式不一致） | 無 | 有，JSON-compatible |
| 驗證 | 內建但難自訂 | 需自建 | 內建 + 自訂規則 |
| i18n | 有 | 需自建 | 原生支援 zh-TW |
| 主題 | Bootstrap 依賴 | 需自建 CSS | 支援 Tailwind/自訂 class |
| 學習曲線 | 高（API 龐大） | 低（純 Vue） | 中（但有良好文檔） |
| 長期維護 | 差（格式問題頻發） | 中（需自行維護全部） | 好（活躍社區，定期更新） |

**結論**：FormKit 比自建方案省去重複陣列、驗證、i18n 的重複工作，同時比 Formio 輕量 95%，且數據格式原生一致。

## 現有 Formio 代碼盤點（待移除）

| 文件 | 行數 | 用途 | 移除時機 |
|---|---|---|---|
| `lib/formio/enhanceSchemaForAdmin.ts` | 402 | schema 增強（label/placeholder） | Phase 8 |
| `lib/formio/mapSubmission.ts` | 228 | 提交資料映射（file→string 等） | Phase 8 |
| `lib/formio/schemaGenerator.ts` | 197 | 從 defaultContent 產生 schema | Phase 8 |
| `lib/formio/schemaStore.ts` | 195 | PocketBase schema CRUD | Phase 8 |
| `lib/formio/mapContentToFormio.ts` | 195 | 內容→Formio submission 轉換 | Phase 8 |
| `lib/formio/schemaDefaults.ts` | 84 | schema 預設值 | Phase 8 |
| `lib/formio/resolveFormio.ts` | 62 | 動態載入 Formio | Phase 8 |
| `lib/formio/schemaHistory.ts` | 52 | schema 歷史紀錄 | Phase 8 |
| `lib/formio/formioAssets.ts` | 53 | 靜態資源管理 | Phase 8 |
| `lib/formio/loadFormio.ts` | 3 | Formio 載入入口 | Phase 8 |
| `components/admin/FormioEditor.vue` | 262 | Formio 編輯器封裝 | Phase 7 |
| `components/admin/FormioBuilder.vue` | 246 | Formio Builder 封裝 | Phase 7 |
| `components/admin/ContentEditor.vue` | 189 | 內容選擇器（保留但重構） | Phase 7 |
| **合計** | **2168** | | |

另外需移除：
- `public/formio/` 靜態資源目錄（fonts、CSS）
- `@formio/js` npm 依賴（~500KB）
- `styles/global.css` 中的 `.admin-formio` 相關樣式

## Phases

| Phase | Status | Notes |
|---|---|---|
| 1. FormKit 安裝與基礎配置 | pending | 安裝 FormKit，配置 VitePress enhanceApp |
| 2. 共用工具與類型定義 | pending | PocketBase 數據操作 composable、TypeScript 類型 |
| 3. 簡單編輯器（Contact） | pending | 驗證 FormKit 方案可行性 |
| 4. 簡單編輯器（Interview） | pending | 純文本字段 |
| 5. 中等複雜度（AboutUs） | pending | 含 repeater + 圖片上傳 |
| 6. 中等複雜度（ProjectIntro） | pending | 含圖片上傳 + 多組 repeater |
| 7. 複雜編輯器（Positions） | pending | 三層嵌套 repeater |
| 8. 複雜編輯器（Timeline） | pending | 嵌套陣列 + content[] |
| 9. 其他（SiteSettings） | pending | links repeater + icon 選擇 |
| 10. 整合到 AdminPage | pending | 替換 ContentEditor 路由 |
| 11. Formio 移除與清理 | pending | 刪除所有 Formio 代碼 |
| 12. 部署與驗證 | pending | 建置、部署、線上測試 |

## Errors Encountered
| Error | Attempt | Resolution |
|---|---:|---|

## Design Decisions

### 架構設計

```
components/admin/
  editors/                     # 新增目錄
    ContactEditor.vue          # ~40 行
    InterviewEditor.vue        # ~60 行
    AboutUsEditor.vue          # ~100 行
    ProjectIntroEditor.vue     # ~120 行
    PositionsEditor.vue        # ~150 行
    TimelineEditor.vue         # ~120 行
    SiteSettingsEditor.vue     # ~100 行
  AdminPage.vue                # 保留，改為 import 新編輯器
  ContentEditor.vue            # 重構：slug 選擇 + 路由到對應編輯器

lib/admin/
  usePocketBaseContent.ts      # PocketBase CRUD composable
  contentTypes.ts              # TypeScript 類型定義
  formkitConfig.ts             # FormKit 全域配置

styles/
  formkit-admin.css            # FormKit admin 主題（取代 .admin-formio）
```

### 數據流（新架構 vs 舊架構）

**舊架構（Formio）**：
```
PocketBase → mapRecordsToContent → normalizeContent
                                       ↓
                              enhanceSchemaForAdmin
                                       ↓
                              mapContentToFormio (string→file array 等)
                                       ↓
                                   Formio 渲染
                                       ↓
                              mapSubmissionToContent (file array→string 等)
                                       ↓
                                 PocketBase 寫回
```

**新架構（FormKit）**：
```
PocketBase → mapRecordsToContent → normalizeContent
                                       ↓
                              FormKit v-model 直接綁定
                              （數據格式 = PocketBase 格式）
                                       ↓
                                 PocketBase 寫回
```

> 移除了 4 個中間映射步驟，數據格式全程一致。

### FormKit 在 VitePress 中的整合方式

VitePress 使用 `enhanceApp` 註冊 plugin：

```typescript
// .vitepress/theme/index.ts
import { plugin as formkitPlugin, defaultConfig } from "@formkit/vue"
import formkitConfig from "../../lib/admin/formkitConfig"

export default {
  enhanceApp: function({ app }) {
    // 只在 client 端載入 FormKit（避免 SSR 問題）
    if (typeof window !== "undefined") {
      app.use(formkitPlugin, defaultConfig(formkitConfig))
    }
  }
}
```

### FormKit 全域配置

```typescript
// lib/admin/formkitConfig.ts
import { zh } from "@formkit/i18n"

export default {
  locales: { zh },
  locale: "zh",
  config: {
    classes: {
      // 複用既有 admin-input/admin-action 樣式
      input: "admin-input",
      label: "admin-label",
      help: "admin-help-text",
      messages: "admin-feedback admin-feedback--error",
      message: "admin-feedback-message"
    }
  }
}
```

### PocketBase 數據操作 Composable

```typescript
// lib/admin/usePocketBaseContent.ts
// 介面定義（供所有編輯器使用）

interface ContentEditorState {
  fields: Record<string, unknown>   // 當前編輯的字段數據
  loading: boolean                  // 載入中
  saving: boolean                   // 儲存中
  error: string | null              // 錯誤訊息
  dirty: boolean                    // 是否有未儲存變更
}

// function usePocketBaseContent(slug: string): {
//   state: Ref<ContentEditorState>
//   load(): Promise<void>          // 從 PocketBase 載入
//   save(): Promise<void>          // 寫回 PocketBase
//   reset(): void                  // 重置為載入時的值
// }
```

### 圖片上傳策略

Formio 的 `file(storage=base64)` 產生 `[{name, type, url, data, storage}]`，需要映射回 string。

FormKit 方案：**自訂 `image-upload` input**

```typescript
// 自訂 FormKit input：image-upload
// - 接收 string value（圖片路徑或 data:URI）
// - 顯示預覽 + 上傳按鈕
// - 選擇檔案後讀為 base64 data:URI，直接 emit 字串
// - 無需任何格式轉換，PocketBase 直接儲存字串

// 使用方式：
// <FormKit type="image-upload" name="logo" label="Logo" />
// v-model 值: "/images/logo.png" 或 "data:image/png;base64,..."
```

> 這完全消除了 Formio 的 file array ↔ string 映射問題。

### Positions 三層嵌套處理

Positions 是最複雜的區塊，結構如下：

```
positions.fields
  titleZh: string
  titleEn: string
  groups[]:                    # FormKit repeater (第 1 層)
    location: string
    description: string
    positions[]:               # FormKit repeater (第 2 層)
      companyLines: string     # textarea，\n 分隔
      roleLines: string       # textarea，\n 分隔
      requirements: string    # textarea，\n 分隔
      duties: string          # textarea，\n 分隔
```

**關鍵設計決策**：PocketBase 中 `companyLines/roleLines/requirements/duties` 儲存為 `\n` 分隔字串。

FormKit 方案：直接用 `textarea`，保持字串格式不變。前台 `normalizeContent()` 已有 string→array 轉換邏輯。

```vue
<!-- PositionsEditor.vue 核心結構（pseudocode） -->
<FormKit type="form" v-model="state.fields">
  <FormKit type="text" name="titleZh" label="標題（中文）" />
  <FormKit type="text" name="titleEn" label="標題（英文）" />

  <FormKit type="repeater" name="groups" label="地區分組"
    add-label="+ 新增地區" min="1">
    <FormKit type="text" name="location" label="地區" />
    <FormKit type="textarea" name="description" label="地區描述" />

    <FormKit type="repeater" name="positions" label="崗位列表"
      add-label="+ 新增崗位" min="1">
      <FormKit type="textarea" name="companyLines"
        label="公司名稱（每行一條）" :rows="3" />
      <FormKit type="textarea" name="roleLines"
        label="崗位名稱（每行一條）" :rows="2" />
      <FormKit type="textarea" name="requirements"
        label="崗位要求（每行一條）" :rows="4" />
      <FormKit type="textarea" name="duties"
        label="工作內容（每行一條）" :rows="4" />
    </FormKit>
  </FormKit>
</FormKit>
```

> FormKit 的 `repeater` 原生支援嵌套，無需自建 EditGrid 邏輯。

## Implementation Plan

### Phase 1: FormKit 安裝與基礎配置
**目標**：安裝 FormKit，在 VitePress 中配置可用

**任務**：
1. `npm install @formkit/vue @formkit/i18n`
2. 可選：`npm install @formkit/themes`（若使用官方主題）
3. 創建 `lib/admin/formkitConfig.ts`
4. 更新 `.vitepress/theme/index.ts` 的 `enhanceApp`（client-only）
5. 創建 `styles/formkit-admin.css` 基礎樣式
6. 驗證：在 admin 頁面渲染一個簡單 FormKit input

**SSR 注意事項**：
- FormKit plugin 只在 `typeof window !== "undefined"` 時註冊
- 編輯器組件使用 `<ClientOnly>` 包裹
- admin.md 路由已不渲染 NavBar/FooterBar，減少 SSR 衝突

**驗證標準**：
- `npm test` 通過
- `npm run docs:build` 成功
- admin 頁面可渲染 FormKit input

### Phase 2: 共用工具與類型定義
**目標**：建立所有編輯器共用的基礎設施

**任務**：
1. 創建 `lib/admin/contentTypes.ts`：
   - 每個 slug 的 fields 類型定義
   - ContentBlock 泛型介面
2. 創建 `lib/admin/usePocketBaseContent.ts`：
   - `usePocketBaseContent(slug)` composable
   - load / save / reset / dirty 狀態
   - 自動呼叫 `normalizeContent`
3. 創建自訂 `image-upload` FormKit input：
   - 接收 string value
   - 顯示預覽（img tag）
   - 上傳後轉為 data:URI string
   - 無需格式轉換
4. 編寫測試：
   - `tests/admin/usePocketBaseContent.test.ts`
   - `tests/admin/imageUploadInput.test.ts`

**驗證標準**：
- 所有新測試通過
- TypeScript 編譯無錯誤

### Phase 3: Contact 編輯器（最簡單）
**目標**：實作第一個 FormKit 編輯器，驗證整體方案

**字段**：
```typescript
interface ContactFields {
  titleZh: string   // text
  titleEn: string   // text
  email: string     // email
  tel: string       // tel
}
```

**FormKit schema**：
```javascript
[
  { $formkit: "text", name: "titleZh", label: "標題（中文）" },
  { $formkit: "text", name: "titleEn", label: "標題（英文）" },
  { $formkit: "email", name: "email", label: "電郵", validation: "required|email" },
  { $formkit: "tel", name: "tel", label: "電話" }
]
```

**任務**：
1. 創建 `components/admin/editors/ContactEditor.vue`（~40 行）
2. 使用 `usePocketBaseContent("contact")` 載入/儲存
3. 編寫 `tests/admin/editors/ContactEditor.test.ts`
4. 暫時在 admin 頁面可直接訪問此編輯器

**驗證標準**：
- 可載入 PocketBase 現有 contact 數據
- 修改後可儲存回 PocketBase
- 前台 `/hkjc/` 的 contact 區塊正確顯示修改後數據

### Phase 4: Interview 編輯器
**字段**：
```typescript
interface InterviewFields {
  titleZh: string
  titleEn: string
  descriptionZh: string   // textarea
  descriptionEn: string   // textarea
  firstRoundLabel: string
  firstRoundDate: string
  secondRoundLabel: string
  secondRoundDate: string
}
```

**任務**：同 Phase 3 模式，約 60 行。

### Phase 5: AboutUs 編輯器（含 repeater + 圖片上傳）
**字段**：
```typescript
interface AboutUsFields {
  titleZh: string
  titleEn: string
  organizations: Array<{
    role: string
    name: string
    logo: string      // image-upload
    url: string
  }>
}
```

**FormKit 結構**：
```vue
<FormKit type="repeater" name="organizations" label="機構列表"
  add-label="+ 新增機構">
  <FormKit type="text" name="role" label="角色" />
  <FormKit type="text" name="name" label="名稱" />
  <FormKit type="image-upload" name="logo" label="Logo" />
  <FormKit type="url" name="url" label="網址" />
</FormKit>
```

**任務**：
1. 創建 `components/admin/editors/AboutUsEditor.vue`（~100 行）
2. 確保 image-upload 自訂 input 正常工作
3. 確保 repeater 增刪正常
4. 測試 logo 上傳後前台正確顯示

### Phase 6: ProjectIntro 編輯器
**字段**：
```typescript
interface ProjectIntroFields {
  titleZh: string
  subtitleZh: string
  titleEn: string
  subtitleEn: string
  descriptionZh: string    // textarea
  descriptionEn: string    // textarea
  posterUrl: string        // image-upload
  infoCards: Array<{
    titleZh: string
    titleEn: string
    contentZh: string
    contentEn: string
  }>
  eligibilityZh: string    // textarea（\n 分隔）
  eligibilityEn: string    // textarea（\n 分隔）
  feeZh: string            // textarea（\n 分隔）
  feeEn: string            // textarea（\n 分隔）
}
```

> `eligibilityZh/En` 和 `feeZh/En` 在 PocketBase 可能是 string[] 或 string，
> 編輯器統一用 textarea 編輯（每行一項），儲存時保持原格式。

### Phase 7: Positions 編輯器（最複雜）
**字段**：見上方 "Positions 三層嵌套處理"

**任務**：
1. 創建 `components/admin/editors/PositionsEditor.vue`（~150 行）
2. 使用 FormKit `repeater` 嵌套兩層
3. `companyLines/roleLines/requirements/duties` 用 textarea
4. 前台 `normalizeContent` 已有 string→array 邏輯，無需修改
5. 測試三層嵌套增刪排序

### Phase 8: Timeline 編輯器
**字段**：
```typescript
interface TimelineFields {
  titleZh: string
  titleEn: string
  steps: Array<{
    date: string
    content: string[]      // repeater 或 textarea
    highlight: boolean
  }>
  notes: Array<{
    icon: string           // select: money | calendar | ...
    title: string
    content: string[]      // repeater 或 textarea
  }>
}
```

> `content` 是 string[]，可用 repeater 或 textarea（每行一項）。
> 建議用 textarea 統一體驗，前台 normalizeContent 已有 string→array 轉換。

### Phase 9: SiteSettings 編輯器
**字段**：
```typescript
interface SiteSettingsFields {
  logoHeight: number        // number
  headerLinks: Array<{
    titleZh: string
    titleEn: string
    href: string
    primary: boolean
  }>
  footerQuickLinks: Array<{
    label: string
    href: string
    primary: boolean
  }>
  footerSocialLinks: Array<{
    label: string
    href: string
    icon: string            // select: facebook | instagram
  }>
}
```

### Phase 10: 整合到 AdminPage
**目標**：重構 ContentEditor 路由，使用新編輯器

**任務**：
1. 重構 `components/admin/ContentEditor.vue`：
   - 保留 slug 下拉選擇
   - 根據 slug 動態載入對應編輯器組件
   - 移除 Formio 相關 import
2. 更新 `components/admin/AdminPage.vue`（如需調整）
3. 確保所有 7 個 slug 都正確路由到新編輯器

**slug → 編輯器映射**：
```typescript
const editorMap = {
  contact: ContactEditor,
  interview: InterviewEditor,
  about_us: AboutUsEditor,
  project_intro: ProjectIntroEditor,
  positions: PositionsEditor,
  timeline: TimelineEditor,
  site_settings: SiteSettingsEditor
}
```

### Phase 11: Formio 移除與清理
**目標**：徹底移除 Formio 依賴

**任務**：
1. 刪除 `lib/formio/` 目錄（10 個文件，1471 行）
2. 刪除 `components/admin/FormioEditor.vue`（262 行）
3. 刪除 `components/admin/FormioBuilder.vue`（246 行）
4. 刪除 `public/formio/` 目錄（fonts、CSS 靜態資源）
5. `npm uninstall @formio/js`
6. 清理 `styles/global.css` 中 `.admin-formio` 相關樣式
7. 清理 `tests/formio/` 測試文件
8. 更新 `tests/components/` 中引用 Formio 的測試

**預期淨減少**：
- ~2168 行 Formio 映射/集成代碼
- ~500KB bundle（@formio/js）
- ~200KB 靜態資源（public/formio/fonts）

**預期新增**：
- ~700 行 FormKit 編輯器代碼（7 個編輯器）
- ~200 行共用工具（composable + config + types）
- ~28KB bundle（@formkit/vue + @formkit/i18n）

**淨效果**：代碼 -1268 行，bundle -472KB

### Phase 12: 部署與驗證
**任務**：
1. `npm test` 全部通過
2. `npm run docs:build` 成功
3. 備份 → 部署到 `/var/www/hkuya.org/hkjc`
4. 驗證每個編輯器：
   - 載入現有數據 ✅
   - 修改並儲存 ✅
   - 前台正確顯示 ✅
   - 圖片上傳/替換 ✅
5. 檢查 console 無錯誤

## Success Criteria

1. 所有 7 個編輯器功能完整（載入、編輯、儲存）
2. 數據與現有 PocketBase 結構完全兼容（不需任何 migration）
3. 所有測試通過
4. Bundle size 減少 > 400KB
5. 無 `@formio/js` 依賴
6. 無 `t.files.forEach is not a function` 類錯誤
7. 無數據格式不一致問題（string ↔ array 衝突）
8. 生產環境運行正常

## Risk Assessment

| Risk | Impact | Mitigation |
|---|---|---|
| FormKit repeater 不支援 3 層嵌套 | High | Phase 1 先做 PoC 驗證；若不行改用自建 Vue repeater |
| FormKit SSR 與 VitePress 衝突 | Medium | client-only 載入，admin 路由已無 SSR header/footer |
| 現有數據格式邊界 case | Medium | normalizeContent 已處理 string↔array；逐步遷移可隨時回退 |
| FormKit 付費 Pro 功能限制 | Low | repeater/file 在免費版可用；Pro 只是預建 UI theme |

## Timeline Estimate

- Phase 1-2（基礎設施）: 0.5 天
- Phase 3-4（簡單編輯器）: 0.5 天
- Phase 5-6（中等編輯器）: 1 天
- Phase 7-8（複雜編輯器）: 1.5 天
- Phase 9（SiteSettings）: 0.5 天
- Phase 10-12（整合/清理/部署）: 1 天

**總計**: 約 5 天

## npm 依賴變更摘要

**移除**：
```
@formio/js: ^5.2.2
```

**新增**：
```
@formkit/vue: latest
@formkit/i18n: latest
```

**可選**：
```
@formkit/themes: latest      # 官方主題（若不想自訂 CSS）
@formkit/tailwindcss: latest  # Tailwind 整合（若將來用 Tailwind）
```

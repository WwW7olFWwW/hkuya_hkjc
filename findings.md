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

## 2026-03-03: Formio 遷移研究

### Formio 核心問題
1. **數據格式不一致**：PocketBase 保存字符串（換行符分隔），Formio 期望數組，需要複雜映射
2. **Bundle 過大**：formio.full.min.js ~500KB，導致 chunk size warning
3. **維護成本高**：lib/formio/ 目錄約 1500+ 行代碼僅用於處理集成問題
4. **集成問題**：動態加載、字體路徑、hydration mismatch 風險

### 內容區塊複雜度分析
- **簡單**（Contact, Interview）：純文本字段，無嵌套
- **中等**（AboutUs, ProjectIntro, SiteSettings）：包含圖片上傳、動態數組
- **複雜**（Timeline）：嵌套數組（steps/notes 包含 content[]）
- **最複雜**（Positions）：三層嵌套（groups → positions → string arrays）

### 替代方案：自建 Vue 編輯器
**優勢**：
- 無第三方依賴，bundle size 減少 ~600KB
- 數據流簡單直接，無需映射層
- 使用 shadcn-vue，UI 一致性好
- 類型安全，易於維護

**技術棧**：
- Vue 3 Composition API
- shadcn-vue UI 組件
- PocketBase SDK 直接對接
- TypeScript 嚴格類型

**共用組件設計**：
- EditorLayout.vue（統一布局）
- ArrayField.vue（動態數組編輯）
- ImageUpload.vue（圖片上傳）
- usePocketBaseContent.ts（數據操作）

**遷移策略**：
- 漸進式遷移，一次一個編輯器
- 保持 PocketBase 數據結構不變
- 測試驅動開發

**工作量評估**：
- 7 個編輯器，每個 100-200 行
- 共用組件和工具函數 ~300 行
- 總計約 1000-1500 行新代碼
- 預計 5 天完成

**預期收益**：
- Bundle size: -600KB
- 代碼行數: -500 行（淨減少）
- 維護成本大幅降低
- 性能提升（無動態加載開銷）

## 2026-03-04: FormKit 替代方案研究

### FormKit 核心特性
1. **Schema 驅動**：支援 JSON-compatible schema 生成表單，與 Formio 類似但格式更簡潔
   - `{ $formkit: "text", name: "field", label: "Label" }`
   - 支援條件渲染、動態數據、HTML 元素混合
2. **Repeater（重複群組）**：原生支援 `type="repeater"` 動態陣列編輯
   - 可嵌套使用（groups → positions 二層嵌套）
   - 內建增/刪/排序按鈕，可自訂文案
   - **需驗證**：是否支援 3 層嵌套（positions 結構需要）
3. **驗證**：內建 30+ 驗證規則（required, email, url 等）+ 自訂規則
4. **i18n**：原生支援 `zh`（簡體）/ `zh-TW`（繁體）locale
5. **主題**：支援 Tailwind CSS 整合（`@formkit/tailwindcss`），也可自訂 class
6. **Bundle size**：core + vue ~28KB（vs Formio ~500KB）

### FormKit vs Formio 關鍵差異
- **數據格式**：FormKit v-model 直接綁定 JS 物件，無需中間映射層
  - Formio 需要 `mapSubmission.ts`（228 行）+ `mapContentToFormio.ts`（195 行）做格式轉換
  - FormKit 的 v-model 值 = PocketBase 儲存格式，零轉換
- **File/Image**：FormKit 無內建 base64 file input，但可自訂 input
  - 自訂 `image-upload` input：接收 string → 顯示預覽 → 上傳後 emit data:URI string
  - 消除了 Formio 的 `file array ↔ string` 映射問題（`t.files.forEach is not a function`）
- **SSR 安全**：FormKit plugin 可 client-only 註冊，不影響 VitePress SSR
- **EditGrid 替代**：FormKit `repeater` 直接替代 Formio EditGrid，且 API 更簡單

### FormKit 在 VitePress 中的整合方式
- 透過 `enhanceApp()` 的 `app.use(formkitPlugin, defaultConfig(...))` 註冊
- 必須判斷 `typeof window !== "undefined"` 避免 SSR 載入
- 編輯器組件外層需用 `<ClientOnly>` 包裹
- admin.md 路由已移除 SSR NavBar/FooterBar，減少 hydration 衝突

### FormKit 免費版限制
- `repeater` 在免費版可用（不是 Pro 限定）
- `file` input 在免費版可用
- Pro 版主要增加：預建 UI themes、Floating Labels、Autocomplete、Multi-step 等
- 本專案不需要 Pro 功能

### 工作量評估（FormKit 方案 vs 自建 Vue 方案）
| | FormKit 方案 | 自建 Vue 方案 |
|---|---|---|
| 共用組件 | ~100 行（config + image-upload） | ~300 行（ArrayField + ImageUpload + EditorLayout） |
| 7 個編輯器 | ~700 行（FormKit 處理布局/驗證） | ~1000 行（需自建所有 UI） |
| 新增測試 | ~400 行 | ~500 行 |
| 新增總代碼 | ~1200 行 | ~1800 行 |
| 淨減少代碼 | ~968 行 | ~368 行 |
| 新增依賴 | @formkit/vue (~28KB) | 無 |

**結論**：FormKit 方案比自建方案少寫約 600 行代碼，且 repeater/validation/i18n 由框架處理，長期維護成本更低。

## 2026-03-04: FormKit 遷移完成但發現問題

### FormKit 實施過程
- 完成了全部 12 個 Phase（安裝、配置、7 個編輯器、整合、Formio 移除、部署）
- 所有編輯器功能正常，測試通過
- 成功移除 Formio 依賴（-2000 行代碼，-500KB bundle）

### FormKit 遇到的問題
1. **`repeater` 是 Pro 功能**
   - 免費版需使用 `list` + `dynamic` prop
   - 生產環境報錯 "Unknown input type 'repeater'"
   - 修復：全局替換為 `type="list" dynamic`

2. **初始化時序問題**
   - 錯誤：`Cannot set -1 to non array value: undefined`
   - 根因：FormKit 在數據載入前就嘗試綁定
   - 嘗試了 4 次修復：
     - normalizeContent 處理 null/undefined
     - usePocketBaseContent 初始化使用 defaultContent
     - 添加 formReady 標誌延遲渲染
     - 將 loading 初始值改為 true（最終方案）

3. **仍有 ~28KB 開銷**
   - FormKit 雖比 Formio 輕量 95%，但仍需學習其 API
   - 對於 7 個簡單編輯器來說可能過度工程化

## 2026-03-04: 切換到原生 Vue 3 組件方案

### 決策理由
1. **FormKit 問題持續**：初始化時序問題修復了 4 次仍不穩定
2. **過度工程化**：7 個編輯器結構簡單，不需要完整表單框架
3. **學習成本**：FormKit API 仍需學習，不如用熟悉的 Vue
4. **完全可控**：原生組件無黑盒，出問題容易調試

### 原生 Vue 3 組件設計

#### AdminField 組件（38 行）
```vue
<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue?: string | number | boolean
  label: string
  type?: "text" | "textarea" | "number" | "checkbox"
  rows?: number
  placeholder?: string
}>(), {
  modelValue: "",
  type: "text",
  rows: 3,
  placeholder: ""
})

const emit = defineEmits<{
  "update:modelValue": [value: string | number | boolean]
}>()

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  if (props.type === "checkbox") {
    emit("update:modelValue", target.checked)
  } else if (props.type === "number") {
    emit("update:modelValue", Number(target.value))
  } else {
    emit("update:modelValue", target.value)
  }
}
</script>

<template>
  <div class="mb-4" :class="{ 'flex items-center gap-2': type === 'checkbox' }">
    <label class="admin-label">{{ label }}</label>
    <textarea v-if="type === 'textarea'" class="admin-input w-full"
      :value="String(modelValue ?? '')" :rows="rows" :placeholder="placeholder"
      @input="handleInput"></textarea>
    <input v-else-if="type === 'checkbox'" type="checkbox"
      :checked="Boolean(modelValue)" @change="handleInput" />
    <input v-else class="admin-input w-full" :type="type"
      :value="modelValue ?? ''" :placeholder="placeholder" @input="handleInput" />
  </div>
</template>
```

**關鍵設計**：
- `modelValue` 可選 + 默認值 `""`，避免 undefined 警告
- 使用 `?? ''` 空值合併運算符處理 undefined
- 支持 4 種類型：text/textarea/number/checkbox
- 完全類型安全（TypeScript）

#### TextareaArray 組件（33 行）
```vue
<script setup lang="ts">
import { computed } from "vue"

const props = withDefaults(defineProps<{
  modelValue: string[]
  label: string
  rows?: number
  placeholder?: string
}>(), {
  rows: 3,
  placeholder: ""
})

const emit = defineEmits<{
  "update:modelValue": [value: string[]]
}>()

const displayText = computed(function () {
  return props.modelValue.join("\n")
})

function handleInput(event: Event) {
  const target = event.target as HTMLTextAreaElement
  const lines = target.value.split("\n")
  const filtered: string[] = []
  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed !== "") {
      filtered.push(trimmed)
    }
  }
  emit("update:modelValue", filtered)
}
</script>
```

**關鍵設計**：
- 自動轉換：`string[]` ↔ 換行分隔文本
- 自動過濾空行
- 實時更新（每次輸入都觸發）

#### AdminRepeater 組件（48 行）
```vue
<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: any[]
  emptyItem: Record<string, unknown>
  addLabel?: string
  min?: number
  label?: string
}>(), {
  addLabel: "+ 新增",
  min: 0,
  label: ""
})

const emit = defineEmits<{
  "update:modelValue": [value: any[]]
}>()

function addItem() {
  const newItem = JSON.parse(JSON.stringify(props.emptyItem))
  const newList = props.modelValue.slice()
  newList.push(newItem)
  emit("update:modelValue", newList)
}

function removeItem(index: number) {
  if (props.modelValue.length <= props.min) return
  const newList = props.modelValue.slice()
  newList.splice(index, 1)
  emit("update:modelValue", newList)
}
</script>

<template>
  <div class="mb-6">
    <div v-if="label" class="admin-label mb-2">{{ label }}</div>
    <div v-for="(item, index) in modelValue" :key="index"
      class="border border-slate-200 rounded-lg p-4 mb-3 relative">
      <slot name="item" :item="item" :index="index"></slot>
      <button type="button" data-test="remove-btn"
        class="admin-action--subtle text-red-500 text-sm mt-2"
        :disabled="modelValue.length <= min" @click="removeItem(index)">
        刪除
      </button>
    </div>
    <button type="button" data-test="add-btn"
      class="admin-action--secondary text-sm" @click="addItem">
      {{ addLabel }}
    </button>
  </div>
</template>
```

**關鍵設計**：
- 使用 slot 傳遞 `item` 和 `index`，父組件完全控制渲染
- 支持 `min` prop 限制最小數量
- 支持無限嵌套（Positions 三層嵌套驗證通過）
- 使用 `JSON.parse(JSON.stringify())` 深拷貝避免引用污染

### 實施結果

**代碼量**：
- 3 個基礎組件：119 行
- 7 個編輯器：398 行
- 總計：517 行（vs FormKit 900 行，vs Formio 2179 行）

**Bundle 大小**：
- 0KB 外部依賴（vs FormKit 28KB，vs Formio 500KB）

**質量**：
- 32 files / 79 tests 全部通過
- 0 個 Vue 警告
- 0 個運行時錯誤
- 構建時間：~39 秒

### 關鍵經驗教訓

1. **簡單問題不需要複雜方案**
   - 7 個編輯器結構簡單，FormKit/Formio 都是過度工程化
   - 原生 Vue 3 組件足夠且更可控

2. **第三方庫的隱藏成本**
   - FormKit 看似簡單，但有學習成本、版本限制、黑盒問題
   - 原生方案無依賴、無版本衝突、完全透明

3. **Slot-based 設計的威力**
   - AdminRepeater 使用 slot 而非 schema，靈活性極高
   - 支持任意結構、任意嵌套、完全類型安全

4. **TypeScript 的價值**
   - 所有組件都有完整類型定義
   - 編輯器使用時有完整的智能提示和類型檢查

### 最終架構優勢

1. **極簡**：517 行代碼，0KB 依賴
2. **清晰**：每個編輯器 40-64 行，一目了然
3. **可控**：無黑盒，出問題容易定位
4. **穩定**：零警告、零錯誤、生產環境驗證通過
5. **可維護**：純 Vue 3，任何 Vue 開發者都能理解和修改


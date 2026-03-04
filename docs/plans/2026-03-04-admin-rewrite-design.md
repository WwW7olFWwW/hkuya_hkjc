# Admin 系統重構設計：移除 FormKit，改用原生 Vue 3

## 問題背景

FormKit 遷移後持續出現 `Cannot set -1 to non array value: undefined` 錯誤。
15 次 Git 提交中有 9 次（60%）是修復 FormKit 問題。根本原因是 FormKit 的內部狀態管理系統與 Vue 響應式系統衝突——當編輯器修改數據結構（string[] → string）時，FormKit 追蹤的「影子狀態」與 Vue 實際狀態不同步。

## 設計決策

- **方案**：原生 Vue 3 + 自建表單組件庫
- **功能範圍**：完全重新設計全部 7 個編輯器
- **數據兼容**：完全兼容現有 PocketBase 數據格式，零遷移
- **質量目標**：高質量、可維護

## 核心架構

### 數據流（簡化後）

```
PocketBase (string[])
  → usePocketBaseContent.load()
  → normalizeContent()
  → state.fields（原始格式，不做任何轉換）
  → 編輯器組件 v-model 直接綁定
  → TextareaArray 組件內部處理顯示轉換
  → save() 直接寫回 PocketBase
```

**與現有方案的關鍵差異**：不再需要 `convertArraysToStrings()`、`formReady` 標誌、`handleSave` 深拷貝等 hack。數據格式在整個生命週期中保持一致。

### 移除清單

| 項目 | 說明 |
|------|------|
| `@formkit/vue`, `@formkit/i18n` | npm 依賴 |
| `lib/admin/formkitConfig.ts` | FormKit 配置 |
| `styles/formkit-admin.css` | FormKit 樣式 |
| `.vitepress/theme/index.ts` 中 FormKit 載入 | client-only 動態 import 邏輯 |
| 所有編輯器中的 `formReady` | 時序控制 hack |
| 所有編輯器中的 `convertArraysToStrings` | 數據轉換 hack |
| 所有編輯器中的 `handleSave` 深拷貝邏輯 | 狀態恢復 hack |

## 新增組件（3 個）

### 1. TextareaArray.vue（~40 行）

解決數組轉換問題的核心組件。

**職責**：接受 `string[]` 的 v-model，內部渲染為 textarea，用戶看到換行分隔的文本，但外部數據始終是 `string[]`。

```vue
<!-- 使用方式 -->
<TextareaArray v-model="position.companyLines" label="公司名稱" :rows="3" />
```

**Props**：
- `modelValue`: string[]
- `label`: string
- `rows`: number (default: 3)
- `placeholder`: string (optional)

**內部邏輯**：
- computed `displayText`: `modelValue.join('\n')`
- `@input` handler: `emit('update:modelValue', text.split('\n').filter(Boolean))`

### 2. AdminField.vue（~60 行）

統一 label + input + 樣式的包裝組件。

```vue
<!-- 使用方式 -->
<AdminField label="標題（中文）" v-model="state.fields.titleZh" />
<AdminField label="描述" v-model="state.fields.descriptionZh" type="textarea" :rows="4" />
<AdminField label="Logo 高度" v-model="state.fields.logoHeight" type="number" />
<AdminField label="主要連結" v-model="link.primary" type="checkbox" />
```

**Props**：
- `label`: string
- `modelValue`: string | number | boolean
- `type`: 'text' | 'textarea' | 'number' | 'checkbox' (default: 'text')
- `rows`: number (for textarea)
- `placeholder`: string (optional)

**樣式**：使用現有 `admin-label`、`admin-input` class。

### 3. AdminRepeater.vue（~80 行）

動態陣列管理組件，替代 FormKit 的 `list dynamic`。

```vue
<!-- 使用方式 -->
<AdminRepeater
  v-model="state.fields.headerLinks"
  :empty-item="{ titleZh: '', titleEn: '', href: '', primary: false }"
  add-label="+ 新增連結"
>
  <template #item="{ item, index }">
    <AdminField label="標題（中文）" v-model="item.titleZh" />
    <AdminField label="連結" v-model="item.href" />
  </template>
</AdminRepeater>
```

**Props**：
- `modelValue`: any[]
- `emptyItem`: object（新增項目的模板）
- `addLabel`: string (default: '+ 新增')
- `min`: number (default: 0)

**Slots**：
- `#item`: `{ item, index }` — 自定義每項內容

**功能**：
- 新增：`JSON.parse(JSON.stringify(emptyItem))` 深拷貝後 push
- 刪除：splice(index, 1)，檢查 min 限制
- 使用現有 `admin-action` 樣式

## 7 個編輯器重寫規格

### 統一結構

```vue
<script setup lang="ts">
import { onMounted } from "vue"
import { usePocketBaseContent } from "@/lib/admin/usePocketBaseContent"

const { state, load, save } = usePocketBaseContent("slug")
onMounted(load)
</script>

<template>
  <div class="admin-card p-6">
    <h2 class="text-xl font-semibold mb-4">編輯器標題</h2>
    <div v-if="state.loading" class="admin-feedback">載入中...</div>
    <div v-else-if="state.error" class="admin-feedback admin-feedback--error">{{ state.error }}</div>
    <form v-else @submit.prevent="save">
      <!-- 字段 -->
      <div class="mt-4">
        <button type="submit" :disabled="state.saving" class="admin-action">
          {{ state.saving ? "儲存中..." : "儲存" }}
        </button>
      </div>
    </form>
  </div>
</template>
```

### 各編輯器字段映射

#### ContactEditor（最簡單）
- 4× AdminField (text): titleZh, titleEn, email, tel

#### InterviewEditor
- 8× AdminField: titleZh, titleEn, descriptionZh (textarea), descriptionEn (textarea), firstRoundLabel, firstRoundDate, secondRoundLabel, secondRoundDate

#### AboutUsEditor
- 2× AdminField (text): titleZh, titleEn
- 1× AdminRepeater: organizations
  - 每項：role, name, logo, url (AdminField)
  - 圖片上傳：file input + FileReader + Base64（保留現有模式）

#### ProjectIntroEditor
- 7× AdminField: titleZh, subtitleZh, titleEn, subtitleEn, descriptionZh (textarea), descriptionEn (textarea), posterUrl
- 圖片上傳：file input + FileReader + Base64
- 1× AdminRepeater: infoCards
  - 每項：titleZh, titleEn, contentZh, contentEn
- 4× TextareaArray: eligibilityZh, eligibilityEn, feeZh, feeEn

#### PositionsEditor（最複雜，兩層嵌套）
- 2× AdminField (text): titleZh, titleEn
- 1× AdminRepeater: groups
  - 每項：location, description (AdminField)
  - 1× AdminRepeater (嵌套): positions
    - 每項：4× TextareaArray (companyLines, roleLines, requirements, duties)

#### TimelineEditor
- 2× AdminField (text): titleZh, titleEn
- 1× AdminRepeater: steps
  - 每項：date (AdminField), content (TextareaArray), highlight (AdminField checkbox)
- 1× AdminRepeater: notes
  - 每項：icon, title (AdminField), content (TextareaArray)

#### SiteSettingsEditor
- 1× AdminField (number): logoHeight
- 3× AdminRepeater: headerLinks, footerQuickLinks, footerSocialLinks
  - headerLinks 每項：titleZh, titleEn, href (AdminField), primary (checkbox)
  - footerQuickLinks 每項：label, href (AdminField), primary (checkbox)
  - footerSocialLinks 每項：label, href, icon (AdminField)

## usePocketBaseContent 調整

Composable 基本不變，唯一調整：

- `loading` 初始值可改回 `false`（原生表單沒有 FormKit 的時序問題）
- 如保持 `true` 也無影響

## ContentEditor.vue 調整

保持現有的動態組件 + `:key="activeSlug"` 模式，只移除 FormKit 相關 import。

## 測試策略

- 現有 8 個測試文件結構保留
- 移除 FormKit 相關 mock
- 新增 3 個通用組件的單元測試：
  - `tests/admin/components/TextareaArray.test.ts`
  - `tests/admin/components/AdminField.test.ts`
  - `tests/admin/components/AdminRepeater.test.ts`

## 預期效果

| 指標 | 現在（FormKit） | 重構後 |
|------|----------------|--------|
| 第三方依賴 | @formkit/vue + @formkit/i18n | 無 |
| 數據轉換 hack | 4 個編輯器需要 convertArraysToStrings | 0 |
| formReady 標誌 | 3 個編輯器 | 0 |
| handleSave 深拷貝 | 3 個編輯器 | 0 |
| 代碼量 | ~1,114 行 | ~700 行（估計） |
| 「Cannot set -1」錯誤 | 持續出現 | 不可能出現（無 FormKit 狀態管理） |

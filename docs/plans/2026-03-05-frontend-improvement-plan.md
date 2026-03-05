# 前端改善計劃

**日期**: 2026-03-05
**目標**: 解決前端頁面的 20 個設計問題，提升用戶體驗、可訪問性和性能

## 優先級分類

### 🔴 高優先級（P0）- 影響核心功能
- #3 電話號碼可點擊
- #7 編輯器切換未保存警告
- #1 載入狀態優化
- #11 Tabs 鍵盤導航

### 🟡 中優先級（P1）- 提升體驗
- #2 導航欄 Logo 跳轉
- #4 雙語內容優化
- #5 職位詳情視覺提示
- #6 海報放大按鈕優化
- #8 編輯器預覽功能
- #12 圖片 alt 文本
- #13 焦點樣式
- #14 移動端導航優化
- #19 圖片性能優化
- #20 實時訂閱錯誤處理

### 🟢 低優先級（P2）- 錦上添花
- #9 圖片上傳進度
- #10 拖拽排序
- #15 觸摸目標尺寸
- #16 時間軸視覺優化
- #17 空狀態美化
- #18 卡片顏色語義化

---

## 高優先級問題詳細方案

### #1 載入狀態體驗優化

**問題**: HomePage.vue 只顯示純文字 "內容載入中..."

**解決方案**: 添加 loading spinner 組件

**實施步驟**:

1. 創建 LoadingSpinner 組件
2. 更新 HomePage.vue 使用新組件
3. 可選：添加骨架屏

**代碼實現**:

```vue
<!-- components/ui/LoadingSpinner.vue -->
<template>
  <div class="flex items-center justify-center py-16">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green"></div>
  </div>
</template>
```

```vue
<!-- HomePage.vue 修改 -->
<template>
  <div v-if="isReady">
    <!-- 現有內容 -->
  </div>
  <LoadingSpinner v-else />
</template>

<script setup lang="ts">
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue"
// ...
</script>
```

**工作量**: 0.5 小時
**依賴**: 無
**測試**: 清除緩存後重新載入頁面，確認 spinner 顯示

---

### #3 電話號碼可點擊

**問題**: ContactSection.vue 的電話號碼無法直接撥打

**解決方案**: 添加 tel: 鏈接

**實施步驟**:
1. 修改 ContactSection.vue 的電話顯示邏輯
2. 添加 hover 樣式提示可點擊

**代碼實現**:

```vue
<!-- components/sections/ContactSection.vue -->
<template>
  <!-- ... -->
  <div class="rounded-2xl card-muted p-4 flex items-center gap-3">
    <span class="icon-pill">
      <Phone class="h-4 w-4" />
    </span>
    <span>
      Tel: 
      <a :href="'tel:' + content.fields.tel" class="text-brand-blue hover:underline">
        {{ content.fields.tel }}
      </a>
    </span>
  </div>
</template>
```

**工作量**: 0.25 小時
**依賴**: 無
**測試**: 在移動端點擊電話號碼，確認彈出撥號界面

---

### #7 編輯器切換未保存警告

**問題**: ContentEditor.vue 切換內容區塊時未保存更改會丟失

**解決方案**: 添加切換前檢查和確認對話框

**實施步驟**:
1. 在 usePocketBaseContent 中添加 isDirty 狀態追蹤
2. 在 ContentEditor.vue 中監聽切換事件
3. 顯示確認對話框

**代碼實現**:

```typescript
// lib/admin/usePocketBaseContent.ts 修改
export function usePocketBaseContent(slug: string) {
  const state = reactive({
    // ...
    isDirty: false,
    originalFields: {} as any
  })

  async function load() {
    // ... 現有邏輯
    state.originalFields = JSON.parse(JSON.stringify(state.fields))
    state.isDirty = false
  }

  function checkDirty() {
    state.isDirty = JSON.stringify(state.fields) !== JSON.stringify(state.originalFields)
  }

  watch(() => state.fields, checkDirty, { deep: true })

  return { state, load, save, reset, checkDirty }
}
```

```vue
<!-- components/admin/ContentEditor.vue -->
<script setup lang="ts">
import { ref, computed, watch } from "vue"
import { useConfirmDialog } from "@/lib/ui/useConfirmDialog"

const activeSlug = ref(slugs[0])
const pendingSlug = ref("")
const { confirm } = useConfirmDialog()

async function handleSlugChange(newSlug: string) {
  // 檢查當前編輯器是否有未保存更改
  const currentEditor = editorMap[activeSlug.value]
  if (currentEditor && currentEditor.state?.isDirty) {
    const confirmed = await confirm({
      title: "未保存的更改",
      message: "切換內容區塊將丟失未保存的更改，確定要繼續嗎？",
      confirmText: "放棄更改",
      cancelText: "取消"
    })
    if (!confirmed) {
      // 恢復選擇
      pendingSlug.value = activeSlug.value
      return
    }
  }
  activeSlug.value = newSlug
}

watch(pendingSlug, handleSlugChange)
</script>

<template>
  <select v-model="pendingSlug" class="admin-input w-full text-sm">
    <option v-for="slug in slugs" :key="slug" :value="slug">{{ slug }}</option>
  </select>
</template>
```

```typescript
// lib/ui/useConfirmDialog.ts (新建)
import { ref } from "vue"

const isOpen = ref(false)
const dialogConfig = ref({ title: "", message: "", confirmText: "確定", cancelText: "取消" })
let resolvePromise: (value: boolean) => void

export function useConfirmDialog() {
  function confirm(config: typeof dialogConfig.value) {
    dialogConfig.value = config
    isOpen.value = true
    return new Promise<boolean>(function(resolve) {
      resolvePromise = resolve
    })
  }

  function handleConfirm() {
    isOpen.value = false
    resolvePromise(true)
  }

  function handleCancel() {
    isOpen.value = false
    resolvePromise(false)
  }

  return { confirm, isOpen, dialogConfig, handleConfirm, handleCancel }
}
```

**工作量**: 2 小時
**依賴**: 需要確認對話框組件（可使用現有 Dialog 組件）
**測試**: 
1. 編輯內容但不保存
2. 切換到其他區塊
3. 確認彈出警告對話框

---

### #11 Tabs 鍵盤導航

**問題**: PositionsSection.vue 的 tabs 無法用鍵盤左右箭頭切換

**解決方案**: 添加鍵盤事件處理

**實施步驟**:
1. 添加 @keydown 事件監聽
2. 處理 ArrowLeft/ArrowRight/Home/End 鍵
3. 管理焦點移動

**代碼實現**:

```vue
<!-- components/sections/PositionsSection.vue -->
<script setup lang="ts">
// ... 現有代碼

function handleTabKeydown(event: KeyboardEvent, currentIndex: number) {
  const groups = props.content.fields.groups
  let newIndex = currentIndex

  if (event.key === "ArrowLeft") {
    event.preventDefault()
    newIndex = currentIndex > 0 ? currentIndex - 1 : groups.length - 1
  } else if (event.key === "ArrowRight") {
    event.preventDefault()
    newIndex = currentIndex < groups.length - 1 ? currentIndex + 1 : 0
  } else if (event.key === "Home") {
    event.preventDefault()
    newIndex = 0
  } else if (event.key === "End") {
    event.preventDefault()
    newIndex = groups.length - 1
  } else {
    return
  }

  setActiveIndex(newIndex)
  // 移動焦點到新的 tab
  const newTab = document.getElementById("tab-" + newIndex)
  if (newTab) {
    newTab.focus()
  }
}
</script>

<template>
  <button
    v-for="(group, groupIndex) in content.fields.groups"
    :key="group.location"
    type="button"
    class="tabs-button"
    :class="isActiveIndex(groupIndex) ? 'tabs-button--active' : ''"
    role="tab"
    :id="'tab-' + groupIndex"
    :aria-selected="isActiveIndex(groupIndex)"
    aria-controls="positions-panel"
    :tabindex="isActiveIndex(groupIndex) ? 0 : -1"
    @click="setActiveIndex(groupIndex)"
    @keydown="handleTabKeydown($event, groupIndex)"
  >
    <!-- ... -->
  </button>
</template>
```

**工作量**: 1 小時
**依賴**: 無
**測試**:
1. Tab 鍵聚焦到第一個 tab
2. 使用左右箭頭切換 tab
3. Home/End 鍵跳轉到首尾
4. 確認焦點正確移動

---


## 中優先級問題詳細方案

### #2 導航欄 Logo 跳轉優化

**問題**: Logo 點擊跳轉到 #project-intro 而非頁面頂部

**解決方案**: 修改為跳轉到頁面頂部

**代碼實現**:

```vue
<!-- components/navigation/NavBar.vue -->
<template>
  <a href="#" class="flex items-center gap-3">
    <img :src="resolveAsset('/images/3x.png')" alt="HKUYA" class="w-auto" :style="logoStyle" />
  </a>
</template>
```

**工作量**: 0.1 小時
**依賴**: 無

---

### #4 雙語內容優化

**問題**: 中英文內容混排，閱讀體驗差

**解決方案**: 添加視覺分隔或語言切換功能

**方案 A - 視覺分隔（簡單）**:

```vue
<!-- 在雙語段落之間添加分隔 -->
<div class="space-y-3">
  <p class="text-slate-800">{{ content.fields.descriptionZh }}</p>
  <div class="border-l-2 border-brand-green/30 pl-3">
    <p class="text-slate-600 italic">{{ content.fields.descriptionEn }}</p>
  </div>
</div>
```

**方案 B - 語言切換（完整）**:

```typescript
// lib/i18n/useLanguage.ts (新建)
import { ref, computed } from "vue"

type Language = "zh" | "en"
const currentLanguage = ref<Language>("zh")

export function useLanguage() {
  function setLanguage(lang: Language) {
    currentLanguage.value = lang
    localStorage.setItem("preferred-language", lang)
  }

  function toggleLanguage() {
    setLanguage(currentLanguage.value === "zh" ? "en" : "zh")
  }

  const isZh = computed(function() {
    return currentLanguage.value === "zh"
  })

  return { currentLanguage, setLanguage, toggleLanguage, isZh }
}
```

```vue
<!-- components/navigation/LanguageToggle.vue (新建) -->
<script setup lang="ts">
import { useLanguage } from "@/lib/i18n/useLanguage"
const { currentLanguage, toggleLanguage } = useLanguage()
</script>

<template>
  <button @click="toggleLanguage" class="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-sm">
    {{ currentLanguage === "zh" ? "EN" : "中" }}
  </button>
</template>
```

```vue
<!-- 在各 Section 中使用 -->
<script setup lang="ts">
import { useLanguage } from "@/lib/i18n/useLanguage"
const { isZh } = useLanguage()
</script>

<template>
  <p v-if="isZh">{{ content.fields.descriptionZh }}</p>
  <p v-else>{{ content.fields.descriptionEn }}</p>
</template>
```

**工作量**: 方案 A: 1 小時 / 方案 B: 4 小時
**依賴**: 方案 B 需要在所有 Section 組件中實施
**建議**: 先實施方案 A，後續可升級到方案 B

---

### #5 職位詳情視覺提示

**問題**: details/summary 元素無展開提示

**解決方案**: 添加箭頭圖標和動畫

**代碼實現**:

```vue
<!-- components/sections/PositionsSection.vue -->
<script setup lang="ts">
import { ChevronDown } from "lucide-vue-next"
</script>

<template>
  <details class="position-detail group">
    <summary class="position-summary flex items-center justify-between cursor-pointer">
      <span>崗位要求 Job Requirements</span>
      <ChevronDown class="h-4 w-4 transition-transform group-open:rotate-180" />
    </summary>
    <ul class="space-y-2 text-sm text-slate-600 mt-3">
      <!-- ... -->
    </ul>
  </details>
</template>
```

```css
/* styles/global.css 添加 */
.position-detail summary {
  list-style: none;
}
.position-detail summary::-webkit-details-marker {
  display: none;
}
```

**工作量**: 0.5 小時
**依賴**: 無

---

### #6 海報放大按鈕優化

**問題**: 放大按鈕可能遮擋海報內容

**解決方案**: 改為 hover 時顯示遮罩層

**代碼實現**:

```vue
<!-- components/sections/ProjectIntro.vue -->
<template>
  <DialogTrigger as-child>
    <button type="button" class="relative w-full text-left poster-card group">
      <img
        :src="resolveAsset(content.fields.posterUrl)"
        alt="實習計劃海報"
        class="w-full rounded-xl shadow-md transition-transform duration-200"
      />
      <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200 rounded-xl flex items-center justify-center">
        <span class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pill-accent shadow-lg">
          <ZoomIn class="h-5 w-5" />
          放大查看
        </span>
      </div>
    </button>
  </DialogTrigger>
</template>
```

**工作量**: 0.5 小時
**依賴**: 無

---

### #8 編輯器預覽功能

**問題**: 管理後台無法即時預覽效果

**解決方案**: 添加分屏預覽或彈窗預覽

**方案 A - 新標籤頁預覽（簡單）**:

```vue
<!-- components/admin/ContentEditor.vue -->
<template>
  <div class="flex items-center justify-between mb-4">
    <h2 class="text-xl font-semibold">內容編輯</h2>
    <a href="/" target="_blank" class="admin-action-secondary">
      在新標籤頁預覽
    </a>
  </div>
</template>
```

**方案 B - 分屏預覽（完整）**:

```vue
<!-- components/admin/ContentEditor.vue -->
<script setup lang="ts">
const showPreview = ref(false)
</script>

<template>
  <div class="grid gap-4" :class="showPreview ? 'lg:grid-cols-2' : ''">
    <section class="admin-workspace">
      <button @click="showPreview = !showPreview" class="admin-action-secondary mb-4">
        {{ showPreview ? "隱藏預覽" : "顯示預覽" }}
      </button>
      <component :is="currentEditor" :key="activeSlug" />
    </section>
    
    <section v-if="showPreview" class="border-l pl-4">
      <iframe src="/" class="w-full h-screen border rounded-lg"></iframe>
    </section>
  </div>
</template>
```

**工作量**: 方案 A: 0.25 小時 / 方案 B: 2 小時
**依賴**: 方案 B 需要處理 iframe 通信和自動刷新
**建議**: 先實施方案 A

---

### #12 圖片 alt 文本優化

**問題**: 圖片 alt 文本不夠描述性

**解決方案**: 更新所有圖片的 alt 屬性

**實施步驟**:
1. 審查所有組件中的 img 標籤
2. 更新 alt 文本為具體描述
3. 考慮從 CMS 中獲取 alt 文本

**代碼實現**:

```vue
<!-- ProjectIntro.vue -->
<img
  :src="resolveAsset(content.fields.posterUrl)"
  :alt="'HKUYA HKJC 暑期實習計劃海報 - ' + content.fields.titleZh"
  class="w-full rounded-xl shadow-md"
/>

<!-- AboutUsSection.vue -->
<img
  :src="resolveAsset(org.logo)"
  :alt="org.name + ' 標誌'"
  class="h-20 w-auto object-contain"
/>
```

**工作量**: 1 小時
**依賴**: 無
**文件清單**:
- ProjectIntro.vue
- AboutUsSection.vue
- NavBar.vue

---

### #13 焦點樣式優化

**問題**: 缺少明顯的焦點指示器

**解決方案**: 添加全局 focus-visible 樣式

**代碼實現**:

```css
/* styles/global.css */
@layer base {
  *:focus-visible {
    outline: 2px solid var(--brand-green);
    outline-offset: 2px;
    border-radius: 4px;
  }

  button:focus-visible,
  a:focus-visible {
    outline: 2px solid var(--brand-green);
    outline-offset: 2px;
  }

  input:focus-visible,
  textarea:focus-visible,
  select:focus-visible {
    outline: 2px solid var(--brand-blue);
    outline-offset: 0;
    border-color: var(--brand-blue);
  }
}
```

**工作量**: 0.5 小時
**依賴**: 無
**測試**: 使用 Tab 鍵導航，確認所有可交互元素有明顯焦點樣式

---

### #14 移動端導航優化

**問題**: 移動端導航項目顯示雙語過於擁擠

**解決方案**: 移動端只顯示中文

**代碼實現**:

```vue
<!-- components/navigation/NavBar.vue -->
<template>
  <nav class="nav-desktop">
    <Button v-for="(item, index) in navItems" :key="item.href + '-' + index" as-child variant="ghost">
      <a :href="resolveLinkHref(item.href)" class="nav-link">
        <span class="text-base font-medium">{{ item.titleZh }}</span>
        <span class="text-xs opacity-80">{{ item.titleEn }}</span>
      </a>
    </Button>
  </nav>

  <div class="nav-mobile">
    <Sheet>
      <SheetContent>
        <div class="mt-10 space-y-2">
          <a v-for="(item, index) in navItems" :key="item.href + '-' + index" :href="resolveLinkHref(item.href)" class="mobile-link">
            <!-- 移動端只顯示中文 -->
            <span class="text-lg font-medium">{{ item.titleZh }}</span>
          </a>
        </div>
      </SheetContent>
    </Sheet>
  </div>
</template>
```

**工作量**: 0.25 小時
**依賴**: 無

---


### #19 圖片性能優化

**問題**: 圖片未優化，無懶加載和響應式尺寸

**解決方案**: 添加懶加載和 srcset

**代碼實現**:

```vue
<!-- ProjectIntro.vue -->
<img
  :src="resolveAsset(content.fields.posterUrl)"
  :alt="'HKUYA HKJC 暑期實習計劃海報'"
  loading="lazy"
  class="w-full rounded-xl shadow-md"
/>

<!-- AboutUsSection.vue -->
<img
  :src="resolveAsset(org.logo)"
  :alt="org.name + ' 標誌'"
  loading="lazy"
  class="h-20 w-auto object-contain"
/>
```

**進階方案 - 響應式圖片**:

```vue
<picture>
  <source
    media="(max-width: 640px)"
    :srcset="resolveAsset(content.fields.posterUrl + '?w=640')"
  />
  <source
    media="(max-width: 1024px)"
    :srcset="resolveAsset(content.fields.posterUrl + '?w=1024')"
  />
  <img
    :src="resolveAsset(content.fields.posterUrl)"
    :alt="'HKUYA HKJC 暑期實習計劃海報'"
    loading="lazy"
    class="w-full rounded-xl shadow-md"
  />
</picture>
```

**工作量**: 基礎方案: 0.5 小時 / 進階方案: 2 小時（需要圖片處理服務）
**依賴**: 進階方案需要配置圖片 CDN 或處理服務
**建議**: 先實施基礎方案（添加 loading="lazy"）

---

### #20 實時訂閱錯誤處理

**問題**: subscribeContentChanges 無錯誤處理

**解決方案**: 添加 try-catch 和重連邏輯

**代碼實現**:

```vue
<!-- components/HomePage.vue -->
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue"
import { useContentStore } from "@/lib/content/store"
import { applyContentUpdate, subscribeContentChanges } from "@/lib/content/realtime"

const { contentState, load } = useContentStore()
const isReady = ref(false)
const connectionError = ref(false)
let subscription: { unsubscribe: Function } | null = null

async function initializeContent() {
  try {
    await load()
    isReady.value = true
    await setupSubscription()
  } catch (error) {
    console.error("載入內容失敗:", error)
    connectionError.value = true
  }
}

async function setupSubscription() {
  try {
    subscription = await subscribeContentChanges(function (payload) {
      contentState.value = applyContentUpdate(contentState.value, payload)
    })
    connectionError.value = false
  } catch (error) {
    console.error("訂閱失敗:", error)
    connectionError.value = true
    // 5 秒後重試
    setTimeout(setupSubscription, 5000)
  }
}

onMounted(initializeContent)

onBeforeUnmount(function () {
  if (subscription && typeof subscription.unsubscribe === "function") {
    subscription.unsubscribe()
  }
})
</script>

<template>
  <div v-if="isReady">
    <div v-if="connectionError" class="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded-lg shadow-lg text-sm">
      ⚠️ 實時更新連接中斷，正在重新連接...
    </div>
    <!-- 現有內容 -->
  </div>
  <LoadingSpinner v-else />
</template>
```

**工作量**: 1.5 小時
**依賴**: 無
**測試**: 斷開網絡連接，確認顯示錯誤提示並自動重連

---

## 低優先級問題詳細方案

### #9 圖片上傳進度反饋

**問題**: 圖片上傳無進度提示

**解決方案**: 添加上傳狀態和進度條

**代碼實現**:

```vue
<!-- components/admin/editors/ProjectIntroEditor.vue -->
<script setup lang="ts">
const uploadProgress = ref(0)
const isUploading = ref(false)

function handlePosterUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  // 檢查文件大小（限制 5MB）
  if (file.size > 5 * 1024 * 1024) {
    alert("圖片大小不能超過 5MB")
    return
  }

  isUploading.value = true
  uploadProgress.value = 0

  const reader = new FileReader()
  
  reader.onprogress = function(e) {
    if (e.lengthComputable) {
      uploadProgress.value = Math.round((e.loaded / e.total) * 100)
    }
  }

  reader.onload = function (e) {
    state.fields.posterUrl = e.target?.result as string
    isUploading.value = false
    uploadProgress.value = 0
  }

  reader.onerror = function() {
    alert("圖片上傳失敗")
    isUploading.value = false
    uploadProgress.value = 0
  }

  reader.readAsDataURL(file)
}
</script>

<template>
  <div class="mb-4">
    <input 
      type="file" 
      accept="image/*" 
      class="admin-input text-sm" 
      @change="handlePosterUpload"
      :disabled="isUploading"
    />
    <div v-if="isUploading" class="mt-2">
      <div class="w-full bg-slate-200 rounded-full h-2">
        <div 
          class="bg-brand-green h-2 rounded-full transition-all duration-300"
          :style="{ width: uploadProgress + '%' }"
        ></div>
      </div>
      <p class="text-xs text-slate-600 mt-1">上傳中... {{ uploadProgress }}%</p>
    </div>
  </div>
</template>
```

**工作量**: 1 小時
**依賴**: 無

---

### #10 AdminRepeater 拖拽排序

**問題**: 只能用按鈕調整順序，操作繁瑣

**解決方案**: 添加拖拽功能

**代碼實現**:

```bash
# 安裝依賴
npm install @vueuse/core
```

```vue
<!-- components/admin/fields/AdminRepeater.vue -->
<script setup lang="ts">
import { useSortable } from "@vueuse/integrations/useSortable"
import { ref } from "vue"

const listRef = ref<HTMLElement | null>(null)

useSortable(listRef, modelValue, {
  animation: 150,
  handle: ".drag-handle"
})
</script>

<template>
  <div ref="listRef">
    <div v-for="(item, index) in modelValue" :key="index" class="repeater-item">
      <div class="flex items-center gap-2">
        <button type="button" class="drag-handle cursor-move p-2 hover:bg-slate-100 rounded">
          <GripVertical class="h-4 w-4 text-slate-400" />
        </button>
        <div class="flex-1">
          <slot name="item" :item="item" :index="index" />
        </div>
        <div class="flex gap-1">
          <button type="button" @click="moveUp(index)" :disabled="index === 0">上移</button>
          <button type="button" @click="moveDown(index)" :disabled="index === modelValue.length - 1">下移</button>
          <button type="button" @click="remove(index)">刪除</button>
        </div>
      </div>
    </div>
  </div>
</template>
```

**工作量**: 2 小時
**依賴**: @vueuse/core

---

### #15 觸摸目標尺寸優化

**問題**: 某些按鈕可能小於 44x44px

**解決方案**: 審查並調整所有可點擊元素尺寸

**代碼實現**:

```css
/* styles/global.css */
@layer components {
  /* 確保最小觸摸目標 */
  button,
  a,
  [role="button"],
  [role="tab"] {
    min-height: 44px;
    min-width: 44px;
  }

  /* 小圖標按鈕需要足夠的 padding */
  .icon-button {
    padding: 12px;
  }
}
```

**實施步驟**:
1. 使用瀏覽器開發工具審查所有按鈕和鏈接
2. 測量尺寸，標記小於 44x44px 的元素
3. 調整 padding 或 min-width/min-height

**工作量**: 1.5 小時
**依賴**: 無

---


### #16 時間軸視覺優化

**問題**: completed/active/pending 狀態區分不明顯

**解決方案**: 增強視覺對比和動畫

**代碼實現**:

```css
/* styles/global.css 添加 */
.timeline-step--completed .timeline-circle {
  background: var(--brand-green);
  border-color: var(--brand-green);
  box-shadow: 0 0 0 4px rgba(0, 126, 78, 0.1);
}

.timeline-step--completed .timeline-line {
  background: var(--brand-green);
}

.timeline-step--active .timeline-circle {
  background: var(--brand-blue);
  border-color: var(--brand-blue);
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  box-shadow: 0 0 0 4px rgba(3, 33, 105, 0.2);
}

.timeline-step--active .timeline-badge {
  background: var(--brand-blue);
  color: white;
  font-weight: 600;
}

.timeline-step--pending .timeline-circle {
  background: white;
  border-color: var(--brand-muted);
}

.timeline-step--pending .timeline-line {
  background: var(--brand-muted);
  opacity: 0.3;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}
```

**工作量**: 1 小時
**依賴**: 無

---

### #17 空狀態美化

**問題**: 職位列表空狀態只有純文字

**解決方案**: 添加插圖和更友好的文案

**代碼實現**:

```vue
<!-- components/sections/PositionsSection.vue -->
<script setup lang="ts">
import { Briefcase } from "lucide-vue-next"
</script>

<template>
  <div v-if="!hasPositions()" class="text-center py-12">
    <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
      <Briefcase class="h-8 w-8 text-slate-400" />
    </div>
    <h3 class="text-lg font-semibold text-slate-700 mb-2">暫無職位</h3>
    <p class="text-sm text-slate-500">更多職位正在更新中，敬請期待</p>
  </div>
</template>
```

**工作量**: 0.5 小時
**依賴**: 無

---

### #18 卡片顏色語義化

**問題**: AboutUsSection 使用 index % 3 分配顏色，無語義

**解決方案**: 根據組織角色分配顏色或統一樣式

**方案 A - 統一樣式（簡單）**:

```vue
<!-- components/sections/AboutUsSection.vue -->
<template>
  <div class="section-card p-5 flex flex-col items-center text-center min-h-[220px]">
    <!-- 移除 :class="getOrganizationClass(index)" -->
  </div>
</template>
```

**方案 B - 基於角色的顏色（語義化）**:

```typescript
function getOrganizationClass(org: Organization) {
  const role = org.role.toLowerCase()
  
  if (role.includes("主辦") || role.includes("organizer")) {
    return "org-card--blue"
  }
  if (role.includes("協辦") || role.includes("co-organizer")) {
    return "org-card--green"
  }
  if (role.includes("支持") || role.includes("support")) {
    return "org-card--peach"
  }
  
  return "org-card--green"
}
```

```vue
<template>
  <div
    v-for="org in organizations"
    :key="org.role"
    class="section-card p-5 flex flex-col items-center text-center min-h-[220px]"
    :class="getOrganizationClass(org)"
  >
    <!-- ... -->
  </div>
</template>
```

**工作量**: 方案 A: 0.25 小時 / 方案 B: 1 小時
**依賴**: 無
**建議**: 方案 A（統一樣式更簡潔）

---


## 實施路線圖

### 第一階段：快速修復（1-2 天）

**目標**: 解決最緊急的用戶體驗問題

**任務清單**:
- [ ] #3 電話號碼可點擊 (0.25h)
- [ ] #2 導航欄 Logo 跳轉 (0.1h)
- [ ] #1 載入狀態優化 (0.5h)
- [ ] #5 職位詳情視覺提示 (0.5h)
- [ ] #12 圖片 alt 文本 (1h)
- [ ] #14 移動端導航優化 (0.25h)

**總工作量**: 約 2.6 小時

**驗收標準**:
- 移動端可直接撥打電話
- Logo 點擊回到頂部
- 載入時顯示 spinner
- details 元素有箭頭提示
- 所有圖片有描述性 alt
- 移動端導航更簡潔

---

### 第二階段：可訪問性和鍵盤導航（2-3 天）

**目標**: 提升可訪問性，支持鍵盤用戶

**任務清單**:
- [ ] #11 Tabs 鍵盤導航 (1h)
- [ ] #13 焦點樣式優化 (0.5h)
- [ ] #15 觸摸目標尺寸 (1.5h)

**總工作量**: 約 3 小時

**驗收標準**:
- Tabs 支持箭頭鍵切換
- 所有可交互元素有明顯焦點樣式
- 所有按鈕至少 44x44px

---

### 第三階段：管理後台改進（3-5 天）

**目標**: 提升管理後台用戶體驗

**任務清單**:
- [ ] #7 編輯器切換未保存警告 (2h)
- [ ] #8 編輯器預覽功能 - 方案 A (0.25h)
- [ ] #9 圖片上傳進度 (1h)

**總工作量**: 約 3.25 小時

**驗收標準**:
- 切換編輯器前提示未保存更改
- 可在新標籤頁預覽
- 圖片上傳顯示進度

---

### 第四階段：視覺和性能優化（5-7 天）

**目標**: 提升視覺體驗和頁面性能

**任務清單**:
- [ ] #4 雙語內容優化 - 方案 A (1h)
- [ ] #6 海報放大按鈕優化 (0.5h)
- [ ] #19 圖片性能優化 - 基礎方案 (0.5h)
- [ ] #20 實時訂閱錯誤處理 (1.5h)
- [ ] #16 時間軸視覺優化 (1h)
- [ ] #17 空狀態美化 (0.5h)
- [ ] #18 卡片顏色語義化 - 方案 A (0.25h)

**總工作量**: 約 5.25 小時

**驗收標準**:
- 雙語內容有視覺分隔
- 海報 hover 顯示放大提示
- 圖片使用懶加載
- 連接中斷時顯示提示
- 時間軸狀態清晰
- 空狀態有圖標和友好文案
- 組織卡片樣式統一

---

### 第五階段：進階功能（可選）

**目標**: 錦上添花的功能

**任務清單**:
- [ ] #4 雙語內容優化 - 方案 B (4h)
- [ ] #8 編輯器預覽功能 - 方案 B (2h)
- [ ] #10 AdminRepeater 拖拽排序 (2h)
- [ ] #19 圖片性能優化 - 進階方案 (2h)

**總工作量**: 約 10 小時

---

## 工作量總結

### 按優先級統計

| 優先級 | 問題數量 | 基礎方案工作量 | 進階方案工作量 |
|--------|---------|--------------|--------------|
| P0 高優先級 | 4 | 3.85h | - |
| P1 中優先級 | 10 | 6.85h | 8h |
| P2 低優先級 | 6 | 5.25h | 4h |
| **總計** | **20** | **15.95h** | **12h** |

### 建議實施策略

**最小可行方案（MVP）**: 
- 實施階段 1-3（P0 + 部分 P1）
- 總工作量: 約 9 小時（1-2 個工作日）
- 解決最緊急的用戶體驗和可訪問性問題

**完整方案**:
- 實施階段 1-4（所有基礎方案）
- 總工作量: 約 16 小時（2-3 個工作日）
- 解決所有已識別問題的基礎版本

**理想方案**:
- 實施階段 1-5（包含進階功能）
- 總工作量: 約 26 小時（3-4 個工作日）
- 包含語言切換、分屏預覽等進階功能

---


## 依賴關係圖

```
第一階段（快速修復）
├── 無依賴，可並行實施
└── 為後續階段建立基礎

第二階段（可訪問性）
├── 依賴：第一階段完成
└── 可與第三階段並行

第三階段（管理後台）
├── 依賴：#7 需要確認對話框組件
└── 可與第二階段並行

第四階段（視覺優化）
├── 依賴：前三階段完成
└── #20 依賴 #1 的 LoadingSpinner

第五階段（進階功能）
├── 依賴：對應基礎方案完成
└── 可選實施
```

---

## 測試計劃

### 功能測試

**瀏覽器兼容性**:
- Chrome/Edge (最新版)
- Firefox (最新版)
- Safari (最新版)
- 移動端瀏覽器 (iOS Safari, Chrome Mobile)

**測試設備**:
- 桌面 (1920x1080, 1366x768)
- 平板 (768x1024)
- 手機 (375x667, 414x896)

**測試清單**:
- [ ] 所有鏈接可點擊且跳轉正確
- [ ] 表單輸入和提交正常
- [ ] 圖片正確載入和顯示
- [ ] 動畫流暢無卡頓
- [ ] 響應式佈局在各尺寸下正常

### 可訪問性測試

**工具**:
- Lighthouse (Chrome DevTools)
- axe DevTools
- WAVE (Web Accessibility Evaluation Tool)

**測試項目**:
- [ ] 鍵盤導航完整覆蓋
- [ ] 焦點順序合理
- [ ] ARIA 屬性正確
- [ ] 顏色對比度符合 WCAG AA
- [ ] 屏幕閱讀器測試 (NVDA/VoiceOver)

### 性能測試

**指標**:
- Lighthouse Performance Score > 90
- First Contentful Paint < 1.5s
- Largest Contentful Paint < 2.5s
- Cumulative Layout Shift < 0.1

**測試場景**:
- [ ] 首次訪問（冷啟動）
- [ ] 二次訪問（有緩存）
- [ ] 慢速 3G 網絡
- [ ] 圖片懶加載效果

---

## 風險評估

### 高風險項目

**#7 編輯器切換警告**
- **風險**: 可能影響現有編輯流程
- **緩解**: 充分測試，提供"不再提示"選項

**#20 實時訂閱錯誤處理**
- **風險**: 重連邏輯可能導致重複訂閱
- **緩解**: 添加訂閱狀態管理，防止重複

### 中風險項目

**#4 雙語內容優化（方案 B）**
- **風險**: 需要修改所有 Section 組件
- **緩解**: 先實施方案 A，驗證後再升級

**#10 拖拽排序**
- **風險**: 引入新依賴 @vueuse/core
- **緩解**: 評估包大小影響，考慮原生實現

### 低風險項目

- 大部分 UI 調整和樣式優化
- 風險可控，易於回滾

---

## 回滾計劃

**Git 分支策略**:
```bash
main (生產環境)
├── feature/quick-fixes (第一階段)
├── feature/accessibility (第二階段)
├── feature/admin-improvements (第三階段)
└── feature/visual-optimization (第四階段)
```

**回滾步驟**:
1. 識別問題提交
2. 創建回滾分支
3. 使用 `git revert` 撤銷更改
4. 測試驗證
5. 部署回滾版本

**備份策略**:
- 每個階段完成後創建 Git tag
- 保留最近 3 個版本的部署包
- 數據庫定期備份（如有）

---

## 成功指標

### 用戶體驗指標

- [ ] 移動端用戶可直接撥打電話（#3）
- [ ] 頁面載入時有明確反饋（#1）
- [ ] 鍵盤用戶可完整操作（#11）
- [ ] 管理員編輯不會意外丟失內容（#7）

### 技術指標

- [ ] Lighthouse Accessibility Score > 95
- [ ] Lighthouse Performance Score > 90
- [ ] 所有圖片使用懶加載（#19）
- [ ] 零 console 錯誤

### 業務指標

- [ ] 用戶停留時間增加
- [ ] 跳出率降低
- [ ] 移動端轉化率提升
- [ ] 管理員編輯效率提升

---

## 維護建議

### 代碼規範

**組件命名**:
- Section 組件: `*Section.vue`
- 管理組件: `*Editor.vue`
- UI 組件: 小寫開頭

**樣式規範**:
- 優先使用 Tailwind 工具類
- 自定義樣式使用 CSS 變量
- 避免內聯樣式

**可訪問性檢查清單**:
- [ ] 所有圖片有 alt
- [ ] 表單有 label
- [ ] 按鈕有描述性文本
- [ ] 顏色對比度充足
- [ ] 支持鍵盤導航

### 定期審查

**每月**:
- 運行 Lighthouse 審計
- 檢查 console 錯誤
- 更新依賴包

**每季度**:
- 可訪問性全面測試
- 性能基準測試
- 用戶反饋收集

---

## 附錄：相關資源

### 設計系統

- [Tailwind CSS 文檔](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev/)
- [Radix UI](https://www.radix-ui.com/)

### 可訪問性

- [WCAG 2.1 指南](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA 最佳實踐](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM 對比度檢查器](https://webaim.org/resources/contrastchecker/)

### 性能優化

- [Web Vitals](https://web.dev/vitals/)
- [圖片優化指南](https://web.dev/fast/#optimize-your-images)
- [懶加載最佳實踐](https://web.dev/lazy-loading/)

---

## 結論

本改善計劃識別了 20 個前端設計問題，涵蓋用戶體驗、可訪問性、性能和管理後台四個方面。

**關鍵要點**:

1. **優先級明確**: P0 問題影響核心功能，需立即解決
2. **工作量可控**: 基礎方案約 16 小時，可在 2-3 天內完成
3. **風險可控**: 大部分為 UI 調整，易於測試和回滾
4. **效果顯著**: 預期可提升 Lighthouse 分數和用戶滿意度

**建議實施順序**:
1. 第一階段（快速修復）- 立即開始
2. 第二階段（可訪問性）- 並行進行
3. 第三階段（管理後台）- 並行進行
4. 第四階段（視覺優化）- 依次完成
5. 第五階段（進階功能）- 根據資源決定

**下一步行動**:
- [ ] 評審本計劃並確認優先級
- [ ] 分配開發資源
- [ ] 創建 Git 分支
- [ ] 開始第一階段實施

---

**文檔版本**: 1.0  
**創建日期**: 2026-03-05  
**最後更新**: 2026-03-05  
**負責人**: 待定


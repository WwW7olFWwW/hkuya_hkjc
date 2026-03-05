# Task Plan: Admin 系統重構 - 原生 Vue 3 組件方案

## Goal
移除 FormKit 依賴，改用原生 Vue 3 組件作為後台編輯框架，實現最小化、零依賴的表單解決方案。

## 方案演變歷史

1. **Formio 階段**（已完成移除）
   - 問題：~500KB bundle、2168 行映射代碼、數據格式不一致
   
2. **FormKit 階段**（2026-03-04 完成但發現問題）
   - 完成了全部 12 個 Phase
   - 發現問題：`repeater` 是 Pro 功能，免費版需用 `list` + `dynamic`
   - 生產環境出現初始化時序問題
   
3. **原生 Vue 3 組件階段**（當前方案，2026-03-04 完成）
   - 決策：FormKit 仍有 ~28KB 開銷，且需要學習其 API
   - 改用 3 個極簡原生組件：AdminField、TextareaArray、AdminRepeater
   - 結果：零外部依賴、代碼極簡、完全可控

## 當前架構

### 核心組件（3 個）

```
components/admin/fields/
  AdminField.vue          # 38 行 - 通用表單字段（text/textarea/number/checkbox）
  TextareaArray.vue       # 33 行 - 字符串數組編輯（換行分隔）
  AdminRepeater.vue       # 48 行 - 動態列表編輯（slot-based）
```

### 編輯器（7 個）

```
components/admin/editors/
  ContactEditor.vue       # 38 行 - 4 個字段
  InterviewEditor.vue     # 44 行 - 8 個字段
  AboutUsEditor.vue       # 46 行 - repeater + 圖片上傳
  ProjectIntroEditor.vue  # 52 行 - 多字段 + repeater
  PositionsEditor.vue     # 64 行 - 三層嵌套 repeater
  TimelineEditor.vue      # 54 行 - 雙 repeater
  SiteSettingsEditor.vue  # 62 行 - 三組 repeater
```

### 數據流（極簡）

```
PocketBase → normalizeContent → v-model 直接綁定 → PocketBase
```

無需任何中間映射層！

## 實施狀態

| Phase | Status | Notes |
|---|---|---|
| 1. 創建 AdminField 組件 | ✅ 完成 | 支持 text/textarea/number/checkbox |
| 2. 創建 TextareaArray 組件 | ✅ 完成 | 字符串數組 ↔ 換行文本 |
| 3. 創建 AdminRepeater 組件 | ✅ 完成 | slot-based，支持嵌套 |
| 4. Contact 編輯器 | ✅ 完成 | 最簡單，4 個字段 |
| 5. Interview 編輯器 | ✅ 完成 | 8 個字段 |
| 6. AboutUs 編輯器 | ✅ 完成 | repeater + 圖片上傳 |
| 7. ProjectIntro 編輯器 | ✅ 完成 | 多字段 + repeater |
| 8. Positions 編輯器 | ✅ 完成 | 三層嵌套 |
| 9. Timeline 編輯器 | ✅ 完成 | 雙 repeater |
| 10. SiteSettings 編輯器 | ✅ 完成 | 三組 repeater |
| 11. 整合到 ContentEditor | ✅ 完成 | 動態路由到編輯器 |
| 12. FormKit 移除 | ✅ 完成 | 移除 formkitConfig.ts 等 |
| 13. 修復 Vue 警告 | ✅ 完成 | AdminField 支持 undefined |
| 14. 測試與部署 | ✅ 完成 | 32 files / 79 tests 通過 |

## 成果總結

### 代碼量對比

| 方案 | 組件代碼 | 工具代碼 | 映射代碼 | 總計 |
|---|---|---|---|---|
| Formio | 508 行 | 200 行 | 1471 行 | 2179 行 |
| FormKit | 700 行 | 200 行 | 0 行 | 900 行 |
| 原生 Vue | 398 行 | 200 行 | 0 行 | 598 行 |

**淨減少**：1581 行（-72%）

### Bundle 大小對比

| 方案 | 依賴 | 大小 |
|---|---|---|
| Formio | @formio/js | ~500KB |
| FormKit | @formkit/vue + @formkit/i18n | ~28KB |
| 原生 Vue | 無 | 0KB |

**淨減少**：500KB（-100%）

### 質量指標

- ✅ 測試覆蓋：32 files / 79 tests 全部通過
- ✅ 構建時間：~39 秒
- ✅ Vue 警告：0 個
- ✅ 運行時錯誤：0 個
- ✅ 生產環境驗證：全部 200

## 關鍵設計決策

### 1. AdminField 組件設計

**問題**：如何用一個組件處理 text/textarea/number/checkbox？

**解決**：
- 使用 `type` prop 切換渲染邏輯
- `modelValue` 支持 `string | number | boolean`
- 可選 prop + 默認值避免 undefined 警告

### 2. TextareaArray 組件設計

**問題**：PocketBase 存 `string[]`，如何編輯？

**解決**：
- 顯示時：`array.join('\n')`
- 輸入時：`text.split('\n').filter(line => line.trim())`
- 自動過濾空行

### 3. AdminRepeater 組件設計

**問題**：如何支持任意結構的動態列表？

**解決**：
- 使用 slot 傳遞 `item` 和 `index`
- 父組件完全控制每個 item 的渲染
- 支持無限嵌套（Positions 三層嵌套驗證通過）

### 4. 圖片上傳策略

**問題**：如何處理圖片上傳？

**解決**：
- 使用原生 `<input type="file">`
- FileReader 讀取為 Base64
- 直接存入 PocketBase 字符串字段
- 無需 file array 映射

## 未來優化方向

### 可選優化（非必需）

1. **圖片上傳組件化**
   - 創建 `ImageUpload.vue` 組件
   - 封裝 file input + 預覽邏輯
   - 當前方案：每個編輯器內聯實現（~10 行）

2. **表單驗證**
   - 當前：無驗證（依賴 PocketBase 後端驗證）
   - 可選：添加前端驗證邏輯

3. **樣式優化**
   - 當前：使用既有 `admin-*` 樣式類
   - 可選：統一 Tailwind CSS

### 不建議的方向

❌ **引入表單庫**（FormKit/VeeValidate/等）
- 理由：當前方案已足夠簡單，引入依賴得不償失

❌ **Schema 驅動表單**
- 理由：7 個編輯器結構差異大，schema 反而增加複雜度

❌ **抽象過度**
- 理由：當前每個編輯器 40-64 行，清晰易懂，無需抽象

## Success Criteria（已達成）

- ✅ 所有 7 個編輯器功能完整
- ✅ 數據與 PocketBase 完全兼容
- ✅ 所有測試通過（32 files / 79 tests）
- ✅ Bundle size 減少 500KB
- ✅ 無外部表單庫依賴
- ✅ 無數據格式映射問題
- ✅ 生產環境運行正常
- ✅ 零 Vue 警告

## 部署記錄

### 2026-03-05
- Commit: `fix: AdminField 支持 undefined modelValue，消除 Vue 警告`
- 備份: `/var/www/hkuya.org/hkjc.bak-20260305112645`
- 驗證: PocketBase (200)、主站 (200)、Admin (200)
- 狀態: ✅ 生產環境穩定運行

## 總結

原生 Vue 3 組件方案是最優解：
- **最小化**：598 行代碼，0KB 依賴
- **最簡單**：3 個基礎組件，7 個編輯器
- **最可控**：無黑盒，完全掌握邏輯
- **最穩定**：零警告，零錯誤

FormKit 和 Formio 都是過度工程化的解決方案，對於 7 個簡單編輯器來說完全不必要。

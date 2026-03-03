# Task Plan

## Goal
把 Interview 區塊的「第一輪/第二輪面試日期與標題」改成可由後台編輯。

## Phases
| Phase | Status | Notes |
|---|---|---|
| 1. 現況確認與欄位設計 | complete | 確認 Interview 日期/標題為硬編碼，改為 content fields |
| 2. 測試先行（RED） | complete | InterviewSection 測試先失敗（找不到新日期） |
| 3. 最小實作（GREEN） | complete | defaultContent 新增四欄位，InterviewSection 改綁定欄位 |
| 4. 回歸驗證 | complete | 相關測試、全量測試、docs build 全通過 |

## Errors Encountered
| Error | Attempt | Resolution |
|---|---:|---|

## Additional Task（2026-02-12）
| Phase | Status | Notes |
|---|---|---|
| A1. 定位 admin hydration mismatch | complete | 日誌顯示問題發生於 `/hkjc/admin.html` 場景 |
| A2. 測試與最小修正 | complete | AdminPage 改為 clientReady 後渲染登入表單 |
| A3. 驗證與部署 | complete | 測試全綠、重新 build + 部署完成 |

## Additional Task（2026-02-12 Nav/Footer Admin Config）
| Phase | Status | Notes |
|---|---|---|
| B1. 欄位與資料模型設計 | complete | site_settings 新增 header/footer links 結構 |
| B2. TDD Red（測試先行） | complete | NavBar/FooterBar 與 helper 測試先失敗 |
| B3. 最小實作 | complete | 新增 normalize helper + NavBar/FooterBar 接線 |
| B4. 回歸驗證 | complete | 測試全綠、docs build 成功並完成部署 |

## Additional Task（2026-02-13 No Primary Highlight）
| Phase | Status | Notes |
|---|---|---|
| C1. 測試先行（RED） | complete | 先新增斷言：不應渲染 `nav-link--primary/mobile-cta/footer-cta`，測試失敗 |
| C2. 最小實作（GREEN） | complete | NavBar/FooterBar 改為統一一般連結 class，不再依 `primary` 切換樣式 |
| C3. 回歸驗證 | complete | 目標測試、全量測試、docs build 均通過 |

## Additional Task（2026-02-13 Admin Font Error）
| Phase | Status | Notes |
|---|---|---|
| D1. 測試先行（RED） | complete | 新增測試要求 `public/formio/fonts/bootstrap-icons.woff2/.woff` 存在，先失敗 |
| D2. 最小實作（GREEN） | complete | 補齊字型檔，並移除全域 Form.io CSS 匯入避免無效 `/assets/fonts/*` 請求 |
| D3. 回歸驗證 | complete | 測試、build、部署與線上字型檔 200 檢查完成 |

## Additional Task（2026-02-13 Admin Hydration Risk）
| Phase | Status | Notes |
|---|---|---|
| E1. 問題重現與定位 | complete | 無擴充乾淨環境（Playwright）未重現 mismatch，先收斂 admin 路由可變因素 |
| E2. 最小實作 | complete | admin route 移除全域 Nav/Footer，降低 SSR/CSR 差異面 |
| E3. 回歸驗證 | complete | 新增 route 測試 + 既有 hydration 測試 + 全量測試 + build + 部署完成 |

## Additional Task（2026-02-13 Admin Alias Redirect）
| Phase | Status | Notes |
|---|---|---|
| F1. 問題定位 | complete | Vue 詳細訊息確認 `/hkjc/admin` server 回 index、client 解析 admin，造成 hydration mismatch |
| F2. 最小實作 | complete | 注入 head script：`/hkjc/admin`、`/hkjc/admin/` 自動導向 `/hkjc/admin.html` |
| F3. 回歸驗證 | complete | 全量測試、build、部署與線上 HTML 檢查完成 |

## Additional Task（2026-02-26 Admin UI/UX 優化）
| Phase | Status | Notes |
|---|---|---|
| G1. 現況盤點與規則對齊 | complete | 盤點 `AdminPage/ContentEditor/Formio*` 現有版型與可及性缺口，對齊 `ui-ux-pro-max` 規範 |
| G2. 介面重構 | complete | 登入區改為 dashboard hero + login panel，內容控制區改為一致化 actions/tabs/status |
| G3. 樣式系統補強 | complete | 新增 `admin-*` 設計語彙：focus-visible、44px touch target、reduced motion、feedback/status 規範 |
| G4. 驗證 | complete | admin 相關 vitest 全綠，`npm run docs:build` 成功（僅既有 chunk size warning） |

## Additional Task（2026-02-26 Deploy）
| Phase | Status | Notes |
|---|---|---|
| H1. 部署前檢查 | complete | `.env.local` 存在，`sudo` 可用，目標目錄可寫 |
| H2. 重新建置 | complete | `npm run docs:build` 成功（僅 chunk size warning） |
| H3. 部署與備份 | complete | 備份 `/var/www/hkuya.org/hkjc.bak-20260226121653`，新版本覆蓋 `/var/www/hkuya.org/hkjc` |
| H4. 線上驗證 | complete | `/pb/api/health` 200；`/hkjc/`、`/hkjc/admin.html` 經轉址後最終 200 |

## Additional Task（2026-02-26 Content Editor Layout Refresh）
| Phase | Status | Notes |
|---|---|---|
| I1. 視覺問題盤點 | complete | 主要問題為控制區與工作區層級混雜，操作入口分散 |
| I2. 版面重構 | complete | 改為左側控制面板（slug/mode/tools）+ 右側主工作區（Editor/Builder） |
| I3. 樣式收斂 | complete | 新增 `admin-workspace/admin-panel` 等樣式，降低陰影與過度裝飾 |
| I4. 驗證 | complete | admin 相關 vitest 全綠，`docs:build` 成功 |

## Additional Task（2026-02-26 Re-Deploy）
| Phase | Status | Notes |
|---|---|---|
| J1. 佈署執行 | complete | 備份 `/var/www/hkuya.org/hkjc.bak-20260226123332`，新版本覆蓋 `/var/www/hkuya.org/hkjc` |
| J2. 驗證 | complete | `/pb/api/health` 200；`/hkjc/`、`/hkjc/admin.html` 經轉址後最終 200 |

## Additional Task（2026-02-26 Positions Editor UX）
| Phase | Status | Notes |
|---|---|---|
| K1. 問題定位 | complete | `positions` schema 為通用自動生成，欄位標籤與 EditGrid 操作語義不足 |
| K2. 最小實作 | complete | 新增 `enhanceSchemaForAdmin`，對 `positions` 套用可讀標籤、提示文與 EditGrid 文案 |
| K3. 接線 | complete | Editor/Builder/批次產生流程皆套用 positions 優化 schema |
| K4. 驗證 | complete | formio + admin 測試全綠；`docs:build` 受環境記憶體限制被 OOM kill（exit 137） |

## Additional Task（2026-02-26 Process Cleanup + Deploy）
| Phase | Status | Notes |
|---|---|---|
| L1. 清理閒置進程 | complete | 終止大量閒置 `context7-mcp/mcp-server-github` 程序，記憶體回升至可建置 |
| L2. 正常建置 | complete | 以正常模式 `npm run docs:build` 成功（未使用低記憶體模式） |
| L3. 佈署與驗證 | complete | 備份 `/var/www/hkuya.org/hkjc.bak-20260226152145`；線上健康檢查通過 |

## Additional Task（2026-02-26 About Us 圖片上傳）
| Phase | Status | Notes |
|---|---|---|
| M1. 根因定位 | complete | `about_us.organizations.logo` 為純字串欄位，無上傳元件與檔案值映射 |
| M2. 功能實作 | complete | `logo` 改為 Formio file(base64) 上傳，並優化 about_us 欄位標籤與 editgrid 操作文案 |
| M3. 相容處理 | complete | `mapSubmissionToContent` 新增檔案值抽取為字串；前台 `AboutUsSection` 支援 data/http 圖片來源 |
| M4. 驗證 | complete | 關聯測試全綠（8 files / 21 tests），`npm run docs:build` 正常成功 |

## Additional Task（2026-02-26 About Us 功能部署）
| Phase | Status | Notes |
|---|---|---|
| N1. 佈署與備份 | complete | 備份 `/var/www/hkuya.org/hkjc.bak-20260226153802`，新版本覆蓋 `/var/www/hkuya.org/hkjc` |
| N2. 線上驗證 | complete | `/pb/api/health` 200；`/hkjc/`、`/hkjc/admin.html` 轉址後最終 200 |

## Additional Task（2026-02-26 Project Intro 海報上傳）
| Phase | Status | Notes |
|---|---|---|
| O1. 根因定位 | complete | `project_intro.posterUrl` 為 textfield，後台無法直接上傳替換 |
| O2. 功能實作 | complete | `enhanceSchemaForAdmin` 新增 `project_intro` 增強，將 `posterUrl` 改為 `file(base64)` |
| O3. 前台相容 | complete | `ProjectIntro.resolveAsset()` 支援 `http(s)/data/blob` 直通 |
| O4. 驗證 | complete | 目標測試全綠（6 files / 18 tests），`npm run docs:build` 成功 |

## Additional Task（2026-02-26 Project Intro 功能部署）
| Phase | Status | Notes |
|---|---|---|
| P1. 佈署與備份 | complete | 備份 `/var/www/hkuya.org/hkjc.bak-20260226155043`，新版本覆蓋 `/var/www/hkuya.org/hkjc` |
| P2. 線上驗證 | complete | `/pb/api/health` 200；`/hkjc/`、`/hkjc/admin.html` 轉址後最終 200 |

## Additional Task（2026-02-26 Formio File 欄位錯誤修正）
| Phase | Status | Notes |
|---|---|---|
| Q1. 根因定位 | complete | `about_us.logo`/`project_intro.posterUrl` 為 string，餵給 Formio `file` 元件觸發 `t.files.forEach is not a function` |
| Q2. 最小修正 | complete | 新增 `mapContentToFormioSubmission`，載入 editor 前把 string 轉為 file value array |
| Q3. 測試補強 | complete | 新增 `mapContentToFormio` 測試與 FormioEditor 正規化測試 |
| Q4. 驗證 | complete | 關聯測試全綠（6 files / 21 tests），`npm run docs:build` 成功 |

## Additional Task（2026-02-26 Formio File 錯誤修正部署）
| Phase | Status | Notes |
|---|---|---|
| R1. 記憶體處理與建置 | complete | 首次 build OOM（137）；終止閒置 `context7-mcp` 進程後，正常模式 build 成功 |
| R2. 佈署與驗證 | complete | 備份 `/var/www/hkuya.org/hkjc.bak-20260226160506`；`/pb/api/health`、`/hkjc/`、`/hkjc/admin.html` 檢查通過 |

## Additional Task（2026-02-26 首頁圖片 404 修正）
| Phase | Status | Notes |
|---|---|---|
| S1. 根因定位 | complete | `poster.webp` / `logo.png` bare filename 造成 404；extension 訊息非站點錯誤 |
| S2. 最小修正 | complete | `mapSubmission` fallback、`resolveAsset` bare filename 映射、`normalizeContent` 圖片路徑正規化 |
| S3. 測試補強 | complete | 新增 normalizeContent/mapSubmission/sections 相關測試 |
| S4. 驗證 | complete | 關聯測試全綠（6 files / 25 tests），`npm run docs:build` 成功 |

## Additional Task（2026-02-26 首頁圖片 404 修正版部署）
| Phase | Status | Notes |
|---|---|---|
| T1. 佈署與備份 | complete | 備份 `/var/www/hkuya.org/hkjc.bak-20260226163101`，新版本覆蓋 `/var/www/hkuya.org/hkjc` |
| T2. 線上驗證 | complete | `/pb/api/health` 200；`/hkjc/`、`/hkjc/admin.html` 轉址後最終 200 |

## Additional Task（2026-02-26 Admin Formio 圖片預覽 base 修正）
| Phase | Status | Notes |
|---|---|---|
| U1. 根因定位 | complete | Formio `file` 欄位在 admin 預覽使用 root path `/images/*`，未套 `/hkjc` base |
| U2. 最小修正 | complete | `mapContentToFormioSubmission` 支援 base-aware preview URL；`FormioEditor` 傳入 `BASE_URL` |
| U3. 相容保護 | complete | `mapSubmissionToContent` 回寫時將 `/hkjc/images/*` 還原為模板 `/images/*` |
| U4. 驗證 | complete | 關聯測試全綠（6 files / 27 tests），`npm run docs:build` 成功 |

## Additional Task（2026-02-26 Admin Formio 圖片預覽 base 修正版部署）
| Phase | Status | Notes |
|---|---|---|
| V1. 佈署與備份 | complete | 備份 `/var/www/hkuya.org/hkjc.bak-20260226173926`，新版本覆蓋 `/var/www/hkuya.org/hkjc` |
| V2. 線上驗證 | complete | `/pb/api/health` 200；`/hkjc/`、`/hkjc/admin.html` 最終 200；`/hkjc/images/poster.webp`、`/hkjc/images/logo.png` 200 |

# CMS 第 3 期：其餘編輯器 實作計畫

**Goal:** 後台開放週報、活動、資源、專案、研究文章、學期設定；已刪除涵蓋全類別；週報支援「貼一整段自動拆」。

**Architecture:** 第 2 期的合作對象是手寫的一套；第 3 期抽成通用層——`makeCollection(table)` 提供 list/save/softDelete/restore/reorder，`EntityPage` 提供清單＋對話框＋刪除確認＋重建狀態，每一類只寫「欄位表單」與「列的摘要」。發布時的驗證直接用 `content.schema.ts` 的 zod（跟前台同一份），所以後台存得進去的東西，前台一定畫得出來。

**Tech Stack:** 同第 2 期。

## Global Constraints
- 沿用第 2 期：中英必填才能發布、草稿只給新項目、已發布項目編輯即發布（確認框）、軟刪除、圖片走 `/media/<folder>/…`、介面中文、視覺同官網。
- 所有 `data` 在發布時必須通過對應的 zod schema；錯誤訊息對到欄位。
- 資源頁的「書」仍來自英語讀書會活動（決定 #9），資源編輯器只管職缺／獎學金／計畫。
- 活動只顯示「目前學期」（學期設定裡的 `semester.code`），列表可切換學期看其他學期的草稿。

## File Structure
| 檔案 | 責任 |
|---|---|
| `src/lib/admin/collection.ts` | `makeCollection<T>(table, { columns(data) })` 通用 CRUD |
| `src/lib/admin/media.ts` | `uploadMedia(file, folder, maxEdge)`（partners 的 uploadLogo 改用它） |
| `src/lib/admin/validate.ts` | `zodErrors(schema, data)` → `Record<path, message>` |
| `src/lib/admin/weekly-parse.ts` | 週報貼上格式的解析（純函式，單元測試） |
| `src/components/admin/EntityPage.tsx` | 通用清單頁（排序可選） |
| `src/components/admin/fields/*.tsx` | `TextField`、`BilingualField`、`ListField`、`PairListField`、`SelectField`、`ImageField`、`DateField` |
| `src/components/admin/forms/{PaperForm,ResourceForm,ProjectForm,EventForm,WeeklyIssueForm,SettingsForm}.tsx` | 各類表單 |
| `src/app/(admin)/admin/{papers,resources,projects,events,weekly,settings}/page.tsx` | 路由 |
| `src/components/admin/TrashList.tsx` | 擴到全類別 |
| `tests/unit/weekly-parse.test.ts`、`tests/unit/validate.test.ts` | 單元 |
| `tests/admin/{papers,resources,projects,events,weekly,settings}.spec.ts` | E2E（每類：新增→發布→清單出現→DB 驗證→刪除→已刪除→還原） |
| `docs/週報貼上格式.md` | 給週報 Prompt 用的固定格式 |

## Tasks（每個都先紅後綠再 commit）
1. 通用層：`collection.ts`、`validate.ts`、`media.ts`、fields、`EntityPage`；把合作對象改用通用層（E2E 6 條仍綠）。
2. 研究文章（最簡單，驗證通用層）。
3. 資源（含截止日；過期在清單標灰）。
4. 專案（封面上傳、四張投影片、四種視覺、拖曳排序）。
5. 活動（依類型顯示欄位；讀書會含書封上傳；學期切換）。
6. 週報（期數＋三則；貼上拆解；自動建議下一期期數與日期）。
7. 學期設定（semester＋membership 的表單）；已刪除擴到全類別；總覽全部「可用」。
8. 文件（使用說明、週報貼上格式）、部署、正式站端到端、三輪 QA。

# 20 家 YC S26 官網：敘事節奏研究

2026-09-09 實測。用 Playwright 逐家載入、**分段捲到底、點開手風琴／頁籤**，
記錄段落標題序列、互動元件、頁面長度。原始資料 `/tmp/yc20/data.json`。

> ⚠️ 這份研究**只看「怎麼講」**：段落順序、表達手法、互動元件。
> **主視覺一律不參考**——FTL 的視覺沿用自己的社群貼文。

## 一、量到的數字

| 指標 | 20 家的值 | FTL 首頁（改寫前 → 改寫後） |
|---|---|---|
| 頁面長度 | 中位數 **7876px**（900 – 16290） | 4896px → **7937px** |
| 段落數（h2） | 中位數 **9 段** | 6 段 → **9 段** |

### 互動元件出現率

| 元件 | 家數 | 備註 |
|---|---|---|
| 手風琴 accordion | **12/20** | 出現率最高，幾乎都用在 FAQ |
| canvas | 12/20 | 動態圖形 |
| sticky | 12/20 | 多為導覽或側欄 |
| 跑馬燈 | 9/20 | |
| 表單 | 7/20 | |
| 影片 / 程式碼 | 6/20 | |
| 頁籤 tabs | 5/20 | |
| logo 牆 | 3/20 | **比想像中少很多** |
| **表格** | **2/20** | **最稀有 → 用了最有辨識度** |
| 捲動進場動畫 | 9/20 | **不到一半，不是必需品** |

FAQ 段落：**10/20**（context、rex、pango、glen、agentcard、archal、tsenta、codag、machine0、mireye）

## 二、共同的敘事骨架

把 20 家的段落標題序列排開之後，最常見的順序是：

1. **一句話說清楚你是什麼**（H1，含一個具體動詞）
2. **先講現況有多爛**（痛點，不是先誇自己）
3. **我們怎麼運作**（機制，常用 01/02/03）
4. **證據**（案例、數字、引述）
5. **上手有多快**
6. **FAQ**
7. **收尾：把首屏那句話變成一個具體畫面**

### 各段的實例

**先講痛點**（至少 7 家在前半段就講現況有多爛）
- Rex：`Manual work is the bottleneck between invoices and cash.`
- Controlseat：`Most condition monitoring never sees your plant.`
- Codag：`Agents are great at reasoning and terrible at reading`
- Truffle：直接把段落命名為 `The Problem / The Solution / The Impact`

**上手有多快**（7 家有獨立段落）
- Rex：`Onboard in a week. Unblock cash in days.`
- Truffle：`Go live in a week, not a quarter.`
- Glen：`Set up in 5 minutes`
- Archal：`Start with one API key`

**收尾那一句**——不是「聯絡我們」，是把首屏的主張變成一個畫面
- Rex：`See Rex run your order-to-cash.`
- Controlseat：`Find out what your machines are already telling you.`
- Tsenta：`Get the next 25 applications off your plate by tonight.`
- Context：`Ship an agent that actually knows things.`
- Realpact：`The brokerage that runs itself.`

## 三、值得抄的六個手法（都與主視覺無關）

| 來源 | 手法 | FTL 怎麼用 |
|---|---|---|
| **Rex** | **對照表**：左欄現況、右欄用了之後，逐列比對 | 「只有修學程 vs 加入 FTL」四列對照 ✅ 已做 |
| **Context.dev** | **三步驟**，編號超大、說明只有兩行 | 報名 → 每週動手 → 交出來被電 ✅ 已做 |
| **Rex / Truffle / Glen** | 獨立的「**多快**」段落 | 「一個學期，三個步驟」✅ 已做 |
| **12/20 家** | **FAQ 手風琴**，標題改寫成有個性的說法 | 「加入之前，大家都會問的」✅ 已做 |
| **Truffle** | 對「**不是目標受眾的人**」也給一個行動：`Not an operator? Everyone knows someone who runs a restaurant.` | 待用：「不是政大的？把這頁傳給你認識的政大人」 |
| **Codag / Touchmark** | **對比句當標題**：`Your agent works the same / Your bill does not` | 待用 |

## 四、改寫後的首頁敘事

01 現況（痛點）＋ 對照表 → 02 怎麼運作（三步驟）→ 03 FinTech 週報 →
04 我們堅持的三件事 → 05 大字聲明（喘息）→ 06 近期活動 →
07 加入之前大家都會問的（FAQ）→ 08 聯絡我們 → 09 收尾 → 合作對象

**主視覺完全沒有變動**：藍、玻璃卡、思源黑體 900、iOS 清單列、切角卡片、
點陣紋理、編號破格，全部沿用。新增的只有敘事元件的排版樣式。

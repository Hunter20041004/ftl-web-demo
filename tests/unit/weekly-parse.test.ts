import test from "node:test";
import assert from "node:assert/strict";
import { parseWeeklyPaste } from "../../src/lib/admin/weekly-parse.ts";

const SAMPLE = `【本期一句話】這週兩家公司都在買資格。
【Issue lede】Two companies bought access this week.
---
【短標】Circle 買跨境支付
【Headline】Circle buys payments
【標題】Circle 以 4 億美元收購 Tazapay
【Title】Circle to acquire Tazapay for $400M
【一句話】發行 USDC 的 Circle 宣布收購。
【Lede】Circle, issuer of USDC, announced the deal.
【重點】
- 交易金額 4 億美元
- 2027 年完成
【Facts】
- $400 million
- Closing in 2027
【背景】Circle 的主力產品是 USDC。
【Context】Circle's main product is USDC.
【說法】穩定幣結算正在成為核心基礎設施。｜Jeremy Allaire，Circle 執行長
【Quote】Stablecoin settlement is becoming core infrastructure.｜Jeremy Allaire, Circle CEO
【為什麼重要】買的是最後一哩。
【Why】It buys the last mile.
【台灣視角】台灣的子法最快 2027 年。
【Taiwan】Taiwan's rules come in 2027.
【接下來】
- 新加坡金管局核准
【Watch】
- MAS approval
【名詞】穩定幣：釘住美元的加密貨幣。
【Term】Stablecoin: a dollar-pegged crypto.
【來源】
- Circle 新聞稿｜Circle press release｜https://example.com/pr｜一手
- Payments Dive｜Payments Dive｜https://example.com/pd
---
【短標】第二則
【Headline】Second
【標題】第二則標題
【Title】Second title
【一句話】二
【Lede】Two
【重點】
- a
【Facts】
- a
【背景】b
【Context】b
【為什麼重要】c
【Why】c
【台灣視角】d
【Taiwan】d
【接下來】
- e
【Watch】
- e
【來源】
- s｜s｜https://example.com/2｜一手
`;

test("parses issue lede and stories with all fields", () => {
  const r = parseWeeklyPaste(SAMPLE);
  assert.equal(r.lede, "這週兩家公司都在買資格。");
  assert.equal(r.ledeEn, "Two companies bought access this week.");
  assert.equal(r.stories.length, 2);
  const s = r.stories[0];
  assert.equal(s.headline, "Circle 買跨境支付");
  assert.equal(s.headlineEn, "Circle buys payments");
  assert.equal(s.title, "Circle 以 4 億美元收購 Tazapay");
  assert.deepEqual(s.facts, ["交易金額 4 億美元", "2027 年完成"]);
  assert.deepEqual(s.factsEn, ["$400 million", "Closing in 2027"]);
  assert.equal(s.quote, "穩定幣結算正在成為核心基礎設施。");
  assert.equal(s.quoteBy, "Jeremy Allaire，Circle 執行長");
  assert.equal(s.quoteByEn, "Jeremy Allaire, Circle CEO");
  assert.equal(s.term, "穩定幣：釘住美元的加密貨幣。");
  assert.deepEqual(s.sources, [
    { label: "Circle 新聞稿", labelEn: "Circle press release", href: "https://example.com/pr", primary: true },
    { label: "Payments Dive", labelEn: "Payments Dive", href: "https://example.com/pd", primary: false },
  ]);
  assert.equal(r.stories[1].quote, undefined);
  assert.equal(r.stories[1].term, undefined);
});

test("missing fields are left empty and reported", () => {
  const r = parseWeeklyPaste("【標題】只有標題\n【Title】Title only");
  assert.equal(r.stories.length, 1);
  assert.equal(r.stories[0].lede, "");
  assert.ok(r.missing.includes("stories.0.lede"));
  assert.ok(r.missing.includes("lede"));
});

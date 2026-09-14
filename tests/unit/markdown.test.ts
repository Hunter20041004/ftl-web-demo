import test from "node:test";
import assert from "node:assert/strict";
import { parseMarkdown } from "../../src/lib/markdown.ts";

// 文章內文用一小套安全的 Markdown：段落、## 小標、- 清單、> 引言、**粗體**、[連結](url)。
// 不產生 HTML 字串，而是結構化節點，前台用 React 畫，所以永遠不會把使用者文字當 HTML 執行。
test("blocks: paragraphs, headings, lists, quotes", () => {
  const nodes = parseMarkdown("## 標題\n\n第一段\n第一段第二行\n\n- 甲\n- 乙\n\n> 引言\n\n第二段");
  assert.deepEqual(nodes.map((n) => n.type), ["heading", "paragraph", "list", "quote", "paragraph"]);
  assert.equal(nodes[0].type === "heading" && nodes[0].level, 2);
  assert.equal(nodes[2].type === "list" && nodes[2].items.length, 2);
});

test("inline: bold and links; raw html stays text", () => {
  const [p] = parseMarkdown("這是 **重點** 和 [連結](https://example.com) 還有 <b>標籤</b>");
  assert.equal(p.type, "paragraph");
  const spans = p.type === "paragraph" ? p.spans : [];
  assert.deepEqual(spans.find((s) => s.type === "bold"), { type: "bold", text: "重點" });
  assert.deepEqual(spans.find((s) => s.type === "link"), { type: "link", text: "連結", href: "https://example.com" });
  assert.ok(spans.some((s) => s.type === "text" && s.text.includes("<b>標籤</b>")));
});

test("javascript: links are neutralised", () => {
  const [p] = parseMarkdown("[x](javascript:alert(1))");
  const link = p.type === "paragraph" ? p.spans.find((s) => s.type === "link") : undefined;
  assert.equal(link, undefined);
});

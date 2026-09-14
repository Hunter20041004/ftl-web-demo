// 文章內文的小型 Markdown：只支援段落、## / ### 小標、- 清單、> 引言、**粗體**、[文字](網址)。
// 輸出是結構化節點，交給 React 畫；使用者文字永遠是文字，不會被當成 HTML。
export type Span = { type: "text"; text: string } | { type: "bold"; text: string } | { type: "link"; text: string; href: string };
export type Block =
  | { type: "heading"; level: 2 | 3; spans: Span[] }
  | { type: "paragraph"; spans: Span[] }
  | { type: "list"; items: Span[][] }
  | { type: "quote"; spans: Span[] };

const SAFE_HREF = /^(https?:\/\/|mailto:|\/)/i;

export function parseInline(text: string): Span[] {
  const spans: Span[] = [];
  const re = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  for (const m of text.matchAll(re)) {
    if (m.index! > last) spans.push({ type: "text", text: text.slice(last, m.index) });
    if (m[1] !== undefined) spans.push({ type: "bold", text: m[1] });
    else if (SAFE_HREF.test(m[3])) spans.push({ type: "link", text: m[2], href: m[3] });
    else spans.push({ type: "text", text: m[2] });   // 不安全的網址只留文字
    last = m.index! + m[0].length;
  }
  if (last < text.length) spans.push({ type: "text", text: text.slice(last) });
  return spans;
}

export function parseMarkdown(src: string): Block[] {
  const blocks: Block[] = [];
  const chunks = src.replace(/\r/g, "").split(/\n{2,}/).map((c) => c.trim()).filter(Boolean);
  for (const chunk of chunks) {
    const lines = chunk.split("\n");
    const h = lines[0].match(/^(#{2,3})\s+(.*)$/);
    if (h && lines.length === 1) { blocks.push({ type: "heading", level: h[1].length as 2 | 3, spans: parseInline(h[2]) }); continue; }
    if (lines.every((l) => /^[-*]\s+/.test(l))) { blocks.push({ type: "list", items: lines.map((l) => parseInline(l.replace(/^[-*]\s+/, ""))) }); continue; }
    if (lines.every((l) => /^>\s?/.test(l))) { blocks.push({ type: "quote", spans: parseInline(lines.map((l) => l.replace(/^>\s?/, "")).join(" ")) }); continue; }
    blocks.push({ type: "paragraph", spans: parseInline(lines.join(" ")) });
  }
  return blocks;
}

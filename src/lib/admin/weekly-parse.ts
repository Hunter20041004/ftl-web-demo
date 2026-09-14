// 週報「貼一整段」的解析。格式見 docs/週報貼上格式.md：
// 每個欄位一個【標記】，中文標記與英文標記成對；清單型欄位底下一行一條（- 開頭）；三則之間用 --- 分隔。
import type { WeeklyStory } from "../content.schema.ts";

export type ParsedStory = WeeklyStory & { headline: string; headlineEn: string };
export type ParsedIssue = { lede: string; ledeEn: string; stories: ParsedStory[]; missing: string[] };

// 標記 → 欄位。left＝中文、right＝英文
const TEXT: Array<[string, string, keyof ParsedStory, keyof ParsedStory]> = [
  ["短標", "Headline", "headline", "headlineEn"],
  ["標題", "Title", "title", "titleEn"],
  ["一句話", "Lede", "lede", "ledeEn"],
  ["背景", "Context", "context", "contextEn"],
  ["為什麼重要", "Why", "why", "whyEn"],
  ["台灣視角", "Taiwan", "taiwan", "taiwanEn"],
  ["名詞", "Term", "term", "termEn"],
];
const LISTS: Array<[string, string, keyof ParsedStory, keyof ParsedStory]> = [
  ["重點", "Facts", "facts", "factsEn"],
  ["接下來", "Watch", "watch", "watchEn"],
];
const REQUIRED: Array<keyof ParsedStory> = ["headline", "headlineEn", "title", "titleEn", "lede", "ledeEn", "facts", "factsEn", "context", "contextEn", "why", "whyEn", "taiwan", "taiwanEn", "watch", "watchEn", "sources"];

type Blocks = Map<string, string[]>;

// 把一段文字切成「標記 → 底下的行」
function blocks(text: string): Blocks {
  const out: Blocks = new Map();
  let current: string | null = null;
  for (const raw of text.split("\n")) {
    const line = raw.replace(/\r$/, "");
    const m = line.match(/^【([^】]+)】\s*(.*)$/);
    if (m) {
      current = m[1].trim();
      out.set(current, m[2].trim() ? [m[2].trim()] : []);
    } else if (current !== null && line.trim()) {
      out.get(current)!.push(line.trim());
    }
  }
  return out;
}
const text = (b: Blocks, key: string) => (b.get(key) ?? []).join("\n").trim();
const list = (b: Blocks, key: string) => (b.get(key) ?? []).map((l) => l.replace(/^[-•・]\s*/, "").trim()).filter(Boolean);
const splitQuote = (s: string): [string, string] => { const i = s.lastIndexOf("｜"); return i < 0 ? [s, ""] : [s.slice(0, i).trim(), s.slice(i + 1).trim()]; };

function parseStory(chunk: string): ParsedStory {
  const b = blocks(chunk);
  const s: Record<string, unknown> = {};
  for (const [zh, en, kz, ke] of TEXT) { s[kz] = text(b, zh); s[ke] = text(b, en); }
  for (const [zh, en, kz, ke] of LISTS) { s[kz] = list(b, zh); s[ke] = list(b, en); }
  const [quote, quoteBy] = splitQuote(text(b, "說法"));
  const [quoteEn, quoteByEn] = splitQuote(text(b, "Quote"));
  if (quote) { s.quote = quote; s.quoteBy = quoteBy || undefined; }
  if (quoteEn) { s.quoteEn = quoteEn; s.quoteByEn = quoteByEn || undefined; }
  if (!s.term) delete s.term;
  if (!s.termEn) delete s.termEn;
  s.sources = list(b, "來源").map((line) => {
    const p = line.split("｜").map((x) => x.trim());
    const href = p.find((x) => /^https?:\/\//.test(x)) ?? "";
    const primary = p.some((x) => /^(一手|primary)$/i.test(x));
    return { label: p[0] ?? "", labelEn: p[1] && !/^https?:\/\//.test(p[1]) ? p[1] : p[0] ?? "", href, primary };
  });
  return s as unknown as ParsedStory;
}

export function parseWeeklyPaste(input: string): ParsedIssue {
  const [head, ...rest] = input.split(/^\s*---+\s*$/m);
  // 第一段若沒有「本期一句話」，代表整份沒有導語，第一段就是第一則
  const headBlocks = blocks(head);
  const hasLede = headBlocks.has("本期一句話") || headBlocks.has("Issue lede");
  const chunks = hasLede ? rest : [head, ...rest];
  const stories = chunks.map((c) => c.trim()).filter(Boolean).map(parseStory);
  const missing: string[] = [];
  const lede = hasLede ? text(headBlocks, "本期一句話") : "";
  const ledeEn = hasLede ? text(headBlocks, "Issue lede") : "";
  if (!lede) missing.push("lede");
  if (!ledeEn) missing.push("ledeEn");
  for (let i = stories.length; i < 3; i += 1) missing.push(`stories.${i}`);   // 一期要三則
  stories.forEach((s, i) => {
    for (const k of REQUIRED) {
      const v = s[k];
      if (v === undefined || v === "" || (Array.isArray(v) && v.length === 0)) missing.push(`stories.${i}.${k}`);
    }
  });
  return { lede, ledeEn, stories, missing };
}

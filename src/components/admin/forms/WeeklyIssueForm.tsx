"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { IssueDraft } from "@/lib/admin/weekly";
import { parseWeeklyPaste, type ParsedStory } from "@/lib/admin/weekly-parse";
import type { FormProps } from "../EntityPage";
import { BilingualField, BilingualListField, Err, TextField } from "../fields";

const sourcesToText = (s: ParsedStory["sources"]) => s.map((x) => [x.label, x.labelEn, x.href, x.primary ? "一手" : ""].filter(Boolean).join("｜")).join("\n");
const textToSources = (t: string): ParsedStory["sources"] => t.split("\n").map((l) => l.trim()).filter(Boolean).map((line) => {
  const p = line.split("｜").map((x) => x.trim());
  const href = p.find((x) => /^https?:\/\//.test(x)) ?? "";
  return { label: p[0] ?? "", labelEn: p[1] && !/^https?:\/\//.test(p[1]) ? p[1] : p[0] ?? "", href, primary: p.some((x) => /^(一手|primary)$/i.test(x)) };
});

export function WeeklyIssueForm({ data, setData, errors, isNew }: FormProps<IssueDraft>) {
  const [paste, setPaste] = useState("");
  const [missing, setMissing] = useState<string[]>([]);
  const [pasteVersion, setPasteVersion] = useState(0);   // 拆解後讓來源文字框重掛，帶入新值
  const set = <K extends keyof IssueDraft>(k: K, v: IssueDraft[K]) => setData((d) => ({ ...d, [k]: v }));
  const setStory = (i: number, patch: Partial<ParsedStory>) => setData((d) => ({ ...d, stories: d.stories.map((s, j) => (j === i ? { ...s, ...patch } : s)) as IssueDraft["stories"] }));

  const applyPaste = () => {
    const parsed = parseWeeklyPaste(paste);
    setData((d) => ({
      ...d, lede: parsed.lede || d.lede, ledeEn: parsed.ledeEn || d.ledeEn,
      stories: [0, 1, 2].map((i) => parsed.stories[i] ?? d.stories[i]) as IssueDraft["stories"],
    }));
    setMissing(parsed.missing);
    setPasteVersion((v) => v + 1);
  };

  return (
    <>
      {isNew ? (
        <div className="grid gap-2 rounded-2xl bg-secondary/60 p-4">
          <Label htmlFor="paste">貼上整份週報</Label>
          <Textarea id="paste" rows={6} value={paste} onChange={(e) => setPaste(e.target.value)} className="rounded-xl bg-white/80 font-mono text-xs" placeholder="用「週報 Prompt」產出的固定格式（【標題】【Title】…，三則用 --- 隔開）" />
          <div className="flex items-center gap-3">
            <Button type="button" variant="outline" size="sm" onClick={applyPaste} disabled={!paste.trim()}>拆解</Button>
            <span className="text-xs text-muted-foreground">拆完會填進下面的欄位，可以再逐格修改</span>
          </div>
          {missing.length ? <p className="text-xs text-destructive">拆解後還缺 {missing.length} 個欄位（已標出），請補齊。</p> : null}
        </div>
      ) : null}

      <div className="grid gap-3 md:grid-cols-3">
        <TextField id="vol" label="期數" type="number" value={data.vol} onChange={(v) => set("vol", v === "" ? Number.NaN : Number(v))} error={errors.vol} />
        <TextField id="range_start" label="起" type="date" value={data.range_start} onChange={(v) => set("range_start", v)} error={errors.range_start} />
        <TextField id="range_end" label="迄" type="date" value={data.range_end} onChange={(v) => set("range_end", v)} error={errors.range_end} />
      </div>
      <BilingualField id="lede" label="本期一句話" zh={data.lede} en={data.ledeEn} onZh={(v) => set("lede", v)} onEn={(v) => set("ledeEn", v)} errors={errors} multiline />

      {data.stories.map((s, i) => {
        const p = (k: string) => `stories.${i}.${k}`;
        const err = (k: string) => errors[p(k)] ?? (missing.includes(p(k)) ? "貼上的內容沒有這一欄" : undefined);
        const errsFor = (k: string) => ({ [p(k)]: err(k) ?? "", [p(`${k}En`)]: err(`${k}En`) ?? "" });
        return (
          <fieldset key={i} data-testid={`story-${i}`} className="grid gap-3 rounded-2xl bg-white/60 p-4 shadow-[var(--glass-hi),var(--shadow-soft)]">
            <legend className="px-1 text-sm font-semibold text-primary">第 {i + 1} 則</legend>
            <BilingualField id={p("headline")} label="短標" zh={s.headline} en={s.headlineEn} onZh={(v) => setStory(i, { headline: v })} onEn={(v) => setStory(i, { headlineEn: v })} errors={errsFor("headline")} placeholderZh="建議 12 字內、最多 100 字，首頁封面用" />
            <BilingualField id={p("title")} label="標題" zh={s.title} en={s.titleEn} onZh={(v) => setStory(i, { title: v })} onEn={(v) => setStory(i, { titleEn: v })} errors={errsFor("title")} />
            <BilingualField id={p("lede")} label="一句話" zh={s.lede} en={s.ledeEn} onZh={(v) => setStory(i, { lede: v })} onEn={(v) => setStory(i, { ledeEn: v })} errors={errsFor("lede")} multiline />
            <BilingualListField id={p("facts")} label="重點" zh={s.facts} en={s.factsEn} onZh={(v) => setStory(i, { facts: v })} onEn={(v) => setStory(i, { factsEn: v })} errors={errsFor("facts")} />
            <BilingualField id={p("context")} label="背景" zh={s.context} en={s.contextEn} onZh={(v) => setStory(i, { context: v })} onEn={(v) => setStory(i, { contextEn: v })} errors={errsFor("context")} multiline />
            <div className="grid gap-3 md:grid-cols-2">
              <TextField id={p("quote")} label="說法（中文，可空）" value={s.quote} onChange={(v) => setStory(i, { quote: v || undefined })} error={err("quote")} multiline />
              <TextField id={p("quoteEn")} label="說法（英文，可空）" value={s.quoteEn} onChange={(v) => setStory(i, { quoteEn: v || undefined })} error={err("quoteEn")} multiline />
              <TextField id={p("quoteBy")} label="誰說的（中文）" value={s.quoteBy} onChange={(v) => setStory(i, { quoteBy: v || undefined })} error={err("quoteBy")} />
              <TextField id={p("quoteByEn")} label="誰說的（英文）" value={s.quoteByEn} onChange={(v) => setStory(i, { quoteByEn: v || undefined })} error={err("quoteByEn")} />
            </div>
            <BilingualField id={p("why")} label="為什麼重要" zh={s.why} en={s.whyEn} onZh={(v) => setStory(i, { why: v })} onEn={(v) => setStory(i, { whyEn: v })} errors={errsFor("why")} multiline />
            <BilingualField id={p("taiwan")} label="台灣視角" zh={s.taiwan} en={s.taiwanEn} onZh={(v) => setStory(i, { taiwan: v })} onEn={(v) => setStory(i, { taiwanEn: v })} errors={errsFor("taiwan")} multiline />
            <BilingualListField id={p("watch")} label="接下來" zh={s.watch} en={s.watchEn} onZh={(v) => setStory(i, { watch: v })} onEn={(v) => setStory(i, { watchEn: v })} errors={errsFor("watch")} />
            <BilingualField id={p("term")} label="名詞（可空）" zh={s.term} en={s.termEn} onZh={(v) => setStory(i, { term: v || undefined })} onEn={(v) => setStory(i, { termEn: v || undefined })} errors={errsFor("term")} />
            <SourcesField key={pasteVersion} id={p("sources")} sources={s.sources} onChange={(v) => setStory(i, { sources: v })} error={err("sources")} />
          </fieldset>
        );
      })}
    </>
  );
}

// 來源用文字框編輯；初始值來自 sources，之後以打字的文字為準（父層用 key 在貼上拆解後重掛）
function SourcesField({ id, sources, onChange, error }: { id: string; sources: ParsedStory["sources"]; onChange: (v: ParsedStory["sources"]) => void; error?: string }) {
  const [text, setText] = useState(() => sourcesToText(sources));
  return (
    <div className="grid gap-1.5" data-field={id}>
      <Label htmlFor={`${id}-text`}>來源</Label>
      <Textarea id={`${id}-text`} rows={3} value={text} className="rounded-xl bg-white/80" placeholder="標籤｜英文標籤｜https://…｜一手（一行一筆）" aria-invalid={Boolean(error)}
        onChange={(e) => { setText(e.target.value); onChange(textToSources(e.target.value)); }} />
      <p className="text-xs text-muted-foreground">一行一筆：標籤｜英文標籤｜網址｜一手（一手來源才寫最後一段）</p>
      <Err msg={error} />
    </div>
  );
}

"use client";

import type { Article } from "@/lib/content.schema";
import type { FormProps } from "../EntityPage";
import { BilingualField, BilingualListField, ImageField, TextField } from "../fields";
import { slugify } from "./ProjectForm";

export const emptyArticle = (): Article => ({ slug: "", title: "", titleEn: "", author: "", authorEn: "", date: new Date().toISOString().slice(0, 10), summary: "", summaryEn: "", body: "", tags: [], tagsEn: [] });

const BODY_HINT = "可以用：空一行分段、「## 小標」、「- 清單」、「> 引言」、「**粗體**」、「[文字](網址)」";

export function ArticleForm({ data, setData, errors, isNew }: FormProps<Article>) {
  const set = <K extends keyof Article>(k: K, v: Article[K]) => setData((d) => ({ ...d, [k]: v }));
  return (
    <>
      <div className="grid gap-3 md:grid-cols-2">
        <TextField id="slug" label="網址代號" value={data.slug} onChange={(v) => set("slug", slugify(v))} error={errors.slug} placeholder="stablecoin-regulation-2026" hint={isNew ? "只能小寫英數與連字號；發布後不要改" : "發布後不要改"} />
        <TextField id="date" label="日期" type="date" value={data.date} onChange={(v) => set("date", v)} error={errors.date} />
      </div>
      <BilingualField id="title" label="標題" zh={data.title} en={data.titleEn} onZh={(v) => set("title", v)} onEn={(v) => set("titleEn", v)} errors={errors} />
      <BilingualField id="author" label="作者" zh={data.author} en={data.authorEn} onZh={(v) => set("author", v)} onEn={(v) => set("authorEn", v)} errors={errors} placeholderZh="專案開發部 曾○庭" placeholderEn="Projects, Tseng" />
      <BilingualField id="summary" label="摘要" zh={data.summary} en={data.summaryEn} onZh={(v) => set("summary", v)} onEn={(v) => set("summaryEn", v)} errors={errors} multiline placeholderZh="兩三句講這篇在講什麼、結論是什麼；列表卡片上顯示的就是這段" />
      <ImageField id="cover" label="封面圖（可留空）" value={data.cover} onChange={(v) => set("cover", v)} folder="articles" maxEdge={1600} error={errors.cover} />
      <TextField id="body" label="內文（中文）" value={data.body} onChange={(v) => set("body", v)} error={errors.body} multiline hint={BODY_HINT} />
      <TextField id="bodyEn" label="內文（英文，可留空）" value={data.bodyEn} onChange={(v) => set("bodyEn", v || undefined)} error={errors.bodyEn} multiline hint="沒有英文版時，英文模式會顯示中文內文" />
      <BilingualListField id="tags" label="標籤" zh={data.tags} en={data.tagsEn} onZh={(v) => set("tags", v)} onEn={(v) => set("tagsEn", v)} errors={errors} hint="一行一個，可留空" />
    </>
  );
}

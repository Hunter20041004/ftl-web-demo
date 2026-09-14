"use client";

import type { Paper } from "@/lib/content.schema";
import type { FormProps } from "../EntityPage";
import { BilingualField, SelectField, TextField } from "../fields";

export const emptyPaper = (): Paper => ({ title: "", authors: "", venue: "", year: new Date().getFullYear(), region: "tw", summary: "", summaryEn: "", href: "" });

export function PaperForm({ data, setData, errors }: FormProps<Paper>) {
  const set = <K extends keyof Paper>(k: K, v: Paper[K]) => setData((d) => ({ ...d, [k]: v }));
  return (
    <>
      <BilingualField id="title" label="標題" zh={data.title} en={data.titleEn} onZh={(v) => set("title", v)} onEn={(v) => set("titleEn", v || undefined)} errors={errors} placeholderZh="英文論文直接填英文標題即可" />
      <BilingualField id="authors" label="作者" zh={data.authors} en={data.authorsEn} onZh={(v) => set("authors", v)} onEn={(v) => set("authorsEn", v || undefined)} errors={errors} />
      <BilingualField id="venue" label="出處" zh={data.venue} en={data.venueEn} onZh={(v) => set("venue", v)} onEn={(v) => set("venueEn", v || undefined)} errors={errors} placeholderZh="期刊、工作論文或報告名稱" />
      <div className="grid gap-3 md:grid-cols-2">
        <TextField id="year" label="年份" type="number" value={data.year} onChange={(v) => set("year", v === "" ? Number.NaN : Number(v))} error={errors.year} />
        <SelectField id="region" label="地區" value={data.region} onChange={(v) => set("region", v as Paper["region"])} error={errors.region} options={[{ value: "tw", label: "台灣" }, { value: "intl", label: "國際" }]} />
      </div>
      <BilingualField id="summary" label="摘要" zh={data.summary} en={data.summaryEn} onZh={(v) => set("summary", v)} onEn={(v) => set("summaryEn", v)} errors={errors} multiline placeholderZh="一句話講這篇在講什麼" />
      <TextField id="href" label="連結" value={data.href} onChange={(v) => set("href", v)} error={errors.href} placeholder="https://" />
    </>
  );
}

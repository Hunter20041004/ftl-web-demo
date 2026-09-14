"use client";

import type { Resource } from "@/lib/content.schema";
import type { FormProps } from "../EntityPage";
import { BilingualField, BilingualListField, SelectField, TextField } from "../fields";

export const KIND_LABELS: Record<Resource["kind"], { zh: string; en: string }> = {
  job: { zh: "職缺", en: "Job" },
  scholarship: { zh: "獎學金", en: "Scholarship" },
  program: { zh: "計畫", en: "Program" },
};

export const emptyResource = (): Resource => ({ kind: "job", kindZh: "職缺", kindEn: "Job", title: "", titleEn: "", org: "", orgEn: "", summary: "", summaryEn: "" });

export function ResourceForm({ data, setData, errors }: FormProps<Resource>) {
  const set = <K extends keyof Resource>(k: K, v: Resource[K]) => setData((d) => ({ ...d, [k]: v }));
  const setKind = (kind: Resource["kind"]) => setData((d) => ({ ...d, kind, kindZh: KIND_LABELS[kind].zh, kindEn: KIND_LABELS[kind].en }));
  return (
    <>
      <SelectField id="kind" label="類型" value={data.kind} onChange={(v) => setKind(v as Resource["kind"])} error={errors.kind}
        options={Object.entries(KIND_LABELS).map(([value, l]) => ({ value, label: l.zh }))} />
      <BilingualField id="title" label="標題" zh={data.title} en={data.titleEn} onZh={(v) => set("title", v)} onEn={(v) => set("titleEn", v)} errors={errors} />
      <BilingualField id="org" label="單位" zh={data.org} en={data.orgEn} onZh={(v) => set("org", v)} onEn={(v) => set("orgEn", v)} errors={errors} />
      <BilingualField id="summary" label="說明" zh={data.summary} en={data.summaryEn} onZh={(v) => set("summary", v)} onEn={(v) => set("summaryEn", v)} errors={errors} multiline />
      <BilingualListField id="details" label="細項" zh={data.details} en={data.detailsEn} onZh={(v) => set("details", v.length ? v : undefined)} onEn={(v) => set("detailsEn", v.length ? v : undefined)} errors={errors} hint="工作內容、條件、金額…一行一條，可留空" />
      <div className="grid gap-3 md:grid-cols-3">
        <TextField id="href" label="連結" value={data.href} onChange={(v) => set("href", v || undefined)} error={errors.href} placeholder="https://" />
        <TextField id="contact" label="聯絡方式" value={data.contact} onChange={(v) => set("contact", v || undefined)} error={errors.contact} placeholder="email 或電話，可留空" />
        <TextField id="deadline" label="截止日" type="date" value={data.deadline} onChange={(v) => set("deadline", v || undefined)} error={errors.deadline} hint="到期後自動從前台下架" />
      </div>
    </>
  );
}

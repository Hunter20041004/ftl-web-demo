"use client";

import type { Partner } from "@/lib/content.schema";
import type { FormProps } from "../EntityPage";
import { CheckField, ImageField, TextField } from "../fields";

export const emptyPartner = (): Partner => ({ zh: "", en: "", href: "" });

export function PartnerForm({ data, setData, errors }: FormProps<Partner>) {
  const set = <K extends keyof Partner>(k: K, v: Partner[K]) => setData((d) => ({ ...d, [k]: v }));
  return (
    <>
      <TextField id="zh" label="中文名稱" value={data.zh} onChange={(v) => set("zh", v)} error={errors.zh} placeholder="臺灣區塊鏈愛好者協會（TABEI）" />
      <TextField id="en" label="英文名稱" value={data.en} onChange={(v) => set("en", v)} error={errors.en} placeholder="Taiwan Blockchain Enthusiasts Institute" />
      <TextField id="href" label="連結" value={data.href} onChange={(v) => set("href", v)} error={errors.href} placeholder="https://" />
      <ImageField id="logo" label="Logo" value={data.logo} onChange={(v) => set("logo", v)} folder="partners" maxEdge={400} error={errors.logo} />
      <CheckField id="markOnly" label="Logo 已含名稱，前台不另顯示文字" checked={Boolean(data.markOnly)} onChange={(v) => set("markOnly", v || undefined)} />
    </>
  );
}

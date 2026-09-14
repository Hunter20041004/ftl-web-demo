// 合作對象：通用層的實例。資料形狀＝前台的 Partner。
import type { Partner } from "../content.schema.ts";
import { makeCollection } from "./collection.ts";
export { publicMediaUrl } from "./media.ts";

export const partners = makeCollection<Partner>("partners");
export type PartnerRow = Awaited<ReturnType<typeof partners.list>>[number];

export function validatePartner(p: Partial<Partner>, opts: { draft?: boolean } = {}): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!opts.draft) {
    if (!p.zh?.trim()) errors.zh = "必填";
    if (!p.en?.trim()) errors.en = "必填";
    if (!p.href?.trim()) errors.href = "必填";
  }
  if (p.href && !/^https?:\/\//.test(p.href)) errors.href = "要以 http:// 或 https:// 開頭";
  return errors;
}

// 相容第 2 期的呼叫方式（TrashList 用）
export const listPartners = (includeDeleted = false) => partners.list({ includeDeleted });
export const restorePartner = partners.restore;

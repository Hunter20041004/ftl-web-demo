"use client";

import { partnerSchema, type Partner } from "@/lib/content.schema";
import { partners, publicMediaUrl, validatePartner } from "@/lib/admin/partners";
import { EntityPage } from "./EntityPage";
import { PartnerForm, emptyPartner } from "./forms/PartnerForm";

// 前台網址要 http(s) 開頭：草稿也擋格式（發布走 zod 之外再加這一條）
const hrefSchema = partnerSchema.refine((p) => /^https?:\/\//.test(p.href), { path: ["href"], message: "要以 http:// 或 https:// 開頭" });

export function PartnersList() {
  return (
    <EntityPage<Partner>
      title="合作對象" intro="拖曳（手機用箭頭）可以調整前台的順序，改完會自動重建。" addLabel="新增合作對象" noun="合作對象"
      collection={partners} schema={hrefSchema} empty={emptyPartner} sortable
      draftCheck={(d) => validatePartner(d, { draft: true })}
      Form={PartnerForm}
      summary={(row) => (
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-16 shrink-0 items-center justify-center rounded-lg bg-white shadow-[var(--glass-hi),var(--shadow-soft)]">
            {/* eslint-disable-next-line @next/next/no-img-element -- Storage 公開網址 */}
            {row.data.logo ? <img src={publicMediaUrl(row.data.logo)} alt="" className="max-h-8 max-w-14 object-contain" /> : <span className="text-xs text-muted-foreground">無</span>}
          </div>
          <div className="min-w-0">
            <p className="font-medium md:truncate">{row.data.zh} <span className="text-muted-foreground">／ {row.data.en}</span></p>
            <p className="truncate text-xs text-muted-foreground">{row.data.href}</p>
          </div>
        </div>
      )}
    />
  );
}

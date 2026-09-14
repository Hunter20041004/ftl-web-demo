"use client";

import { paperSchema, type Paper } from "@/lib/content.schema";
import { papers } from "@/lib/admin/collections";
import { EntityPage } from "./EntityPage";
import { PaperForm, emptyPaper } from "./forms/PaperForm";

const listOptions = { order: "year", ascending: false } as const;

export function PapersList() {
  return (
    <EntityPage<Paper>
      title="研究文章" intro="洞察頁的「研究文章」區，依年份新到舊排列。" addLabel="新增研究文章" noun="研究文章"
      collection={papers} schema={paperSchema} empty={emptyPaper} listOptions={listOptions}
      Form={PaperForm}
      summary={(row) => (
        <div className="min-w-0">
          <p className="font-medium md:truncate">{row.data.title}</p>
          <p className="truncate text-xs text-muted-foreground">{row.data.authors} · {row.data.venue} · {row.data.year}</p>
        </div>
      )}
    />
  );
}

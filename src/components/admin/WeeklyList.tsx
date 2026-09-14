"use client";

import { useEffect, useState } from "react";
import { emptyIssue, issueSchema, suggestNext, weekly, type IssueDraft } from "@/lib/admin/weekly";
import type { Row } from "@/lib/admin/collection";
import { EntityPage } from "./EntityPage";
import { WeeklyIssueForm } from "./forms/WeeklyIssueForm";

const mmdd = (iso: string) => iso.slice(5).replace("-", "/");

export function WeeklyList() {
  const [issues, setIssues] = useState<Row<IssueDraft>[]>([]);
  useEffect(() => { weekly.list().then(setIssues).catch(() => setIssues([])); }, []);
  const next = suggestNext(issues);
  return (
    <EntityPage<IssueDraft>
      title="FinTech 週報" intro="一期三則。新增時可以把週報 Prompt 產出的整份內容貼上拆解，再逐格檢查。首頁顯示最新 3 期。" addLabel="新增一期" noun="週報"
      collection={weekly} schema={issueSchema} empty={() => emptyIssue(next.vol, next.start, next.end)} wide
      draftCheck={(d) => (d.vol ? {} : { vol: "必填" }) as Record<string, string>}
      onSaved={() => weekly.list().then(setIssues).catch(() => undefined)}
      Form={WeeklyIssueForm}
      summary={(row) => (
        <div className="min-w-0">
          <p className="font-medium md:truncate"><span className="mr-2 font-mono text-xs text-muted-foreground">Vol.{row.data.vol}</span>{row.data.stories.map((s) => s.headline).filter(Boolean).join("／")}</p>
          <p className="truncate text-xs text-muted-foreground">{mmdd(row.data.range_start)} – {mmdd(row.data.range_end)}・{row.data.lede}</p>
        </div>
      )}
    />
  );
}

"use client";

import { useEffect, useState } from "react";
import { countTable } from "@/lib/admin/admins";
import { getRebuildStatus, type RebuildStatus } from "@/lib/admin/rebuild";
import { withBasePath } from "@/lib/site-data";

const CATEGORIES = [
  { table: "partners", label: "合作對象", href: "/admin/partners/", ready: true },
  { table: "weekly_issues", label: "週報", ready: false },
  { table: "events", label: "活動", ready: false },
  { table: "resources", label: "資源", ready: false },
  { table: "projects", label: "專案", ready: false },
  { table: "papers", label: "研究文章", ready: false },
] as const;

export function AdminOverview() {
  const [counts, setCounts] = useState<Record<string, { published: number; draft: number }>>({});
  const [rebuild, setRebuild] = useState<RebuildStatus | { status: "error"; message: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all(CATEGORIES.map(async (c) => [c.table, await countTable(c.table)] as const))
      .then((pairs) => { if (!cancelled) setCounts(Object.fromEntries(pairs)); });
    getRebuildStatus().then((s) => { if (!cancelled) setRebuild(s); }).catch((e: Error) => { if (!cancelled) setRebuild({ status: "error", message: e.message }); });
    return () => { cancelled = true; };
  }, []);

  const rebuildText = !rebuild ? "查詢中…"
    : rebuild.status === "error" ? `查不到：${rebuild.message}`
    : rebuild.status === "none" ? "還沒有重建紀錄"
    : rebuild.status === "completed" ? `${rebuild.conclusion === "success" ? "成功" : `失敗（${rebuild.conclusion}）`}・${new Date(rebuild.updatedAt!).toLocaleString("zh-TW")}`
    : "進行中…";

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold">總覽</h1>
      <div className="mt-5 rounded-2xl bg-card p-5 ring-1 ring-border" data-testid="last-rebuild">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground">最近一次正式站重建</p>
        <p className="mt-1 font-medium">{rebuildText}{rebuild && "url" in rebuild && rebuild.url ? <> <a className="text-sm text-primary underline" href={rebuild.url} target="_blank" rel="noreferrer">紀錄</a></> : null}</p>
        <p className="mt-1 text-sm text-muted-foreground">正式站：<a className="text-primary underline" href="https://hunter20041004.github.io/ftl-web-demo/" target="_blank" rel="noreferrer">hunter20041004.github.io/ftl-web-demo</a></p>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3">
        {CATEGORIES.map((c) => {
          const n = counts[c.table];
          const body = (
            <>
              <p className="text-sm text-muted-foreground">{c.label}{!c.ready ? <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs">後台第 3 期</span> : null}</p>
              <p className="mt-1 text-2xl font-bold" data-testid={`count-${c.table}`}>{n ? n.published : "…"}</p>
              <p className="text-xs text-muted-foreground">已發布{n && n.draft ? `・${n.draft} 筆草稿` : ""}</p>
            </>
          );
          return c.ready
            ? <a key={c.table} href={withBasePath(c.href)} className="rounded-2xl bg-card p-5 ring-1 ring-border transition hover:ring-primary">{body}</a>
            : <div key={c.table} className="rounded-2xl bg-card/60 p-5 ring-1 ring-border">{body}</div>;
        })}
      </div>
    </div>
  );
}

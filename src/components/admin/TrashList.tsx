"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Collection, Row } from "@/lib/admin/collection";
import { partners } from "@/lib/admin/partners";
import { articles, projects, resources, events } from "@/lib/admin/collections";
import { weekly } from "@/lib/admin/weekly";
import { RebuildStatus } from "./RebuildStatus";

type Entry = { kind: string; collection: Collection<object>; row: Row<object>; label: string };
type Obj = Record<string, string | undefined>;

// 六類的軟刪除項目集中在這裡；還原已發布的項目會自動重建。
const SOURCES: Array<{ kind: string; collection: Collection<object>; label: (d: Obj) => string }> = [
  { kind: "合作對象", collection: partners as Collection<object>, label: (d) => `${d.zh} ／ ${d.en}` },
  { kind: "洞察文章", collection: articles as Collection<object>, label: (d) => String(d.title) },
  { kind: "資源", collection: resources as Collection<object>, label: (d) => String(d.title) },
  { kind: "專案", collection: projects as Collection<object>, label: (d) => String(d.name) },
  { kind: "活動", collection: events as Collection<object>, label: (d) => String(d.zh) },
  { kind: "週報", collection: weekly as unknown as Collection<object>, label: (d) => `Vol.${d.vol}` },
];

export function TrashList() {
  const [entries, setEntries] = useState<Entry[] | null>(null);
  const [version, setVersion] = useState(0);
  const [rebuildTick, setRebuildTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    Promise.all(SOURCES.map(async (s) => (await s.collection.list({ includeDeleted: true })).filter((r) => r.deleted_at).map((row) => ({ kind: s.kind, collection: s.collection, row, label: s.label(row.data as Obj) }))))
      .then((groups) => { if (!cancelled) setEntries(groups.flat().sort((a, b) => (b.row.deleted_at ?? "").localeCompare(a.row.deleted_at ?? ""))); });
    return () => { cancelled = true; };
  }, [version]);

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold">已刪除</h1>
      <p className="mt-1 text-sm text-muted-foreground">還原後會回到原本的清單；已發布的項目會自動重建回到前台。</p>
      <div className="mt-4"><RebuildStatus trigger={rebuildTick} /></div>
      <ul className="mt-5 grid gap-2">
        {entries === null ? <li className="glass px-4 py-8 text-center text-sm text-muted-foreground">載入中…</li> : null}
        {entries?.map((e) => (
          <li key={`${e.kind}-${e.row.id}`} data-testid="trash-row" className="flex items-center gap-4 glass px-4 py-3">
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{e.kind}</span>
            <p className="min-w-0 flex-1 truncate">{e.label}</p>
            <span className="text-xs text-muted-foreground">{e.row.deleted_at?.slice(0, 10)}</span>
            <Button variant="outline" size="sm" onClick={async () => { await e.collection.restore(e.row.id); setVersion((v) => v + 1); if (e.row.status === "published") setRebuildTick((t) => t + 1); }}>還原</Button>
          </li>
        ))}
        {entries && entries.length === 0 ? <li className="glass px-4 py-8 text-center text-sm text-muted-foreground">沒有已刪除的項目。</li> : null}
      </ul>
    </div>
  );
}

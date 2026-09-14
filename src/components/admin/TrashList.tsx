"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { listPartners, restorePartner, type PartnerRow } from "@/lib/admin/partners";
import { RebuildStatus } from "./RebuildStatus";

// 已刪除：目前只有合作對象；第 3 期其他類別加進來。
export function TrashList() {
  const [rows, setRows] = useState<PartnerRow[] | null>(null);
  const [version, setVersion] = useState(0);
  const [rebuildTick, setRebuildTick] = useState(0);
  const reload = useCallback(async () => { setVersion((v) => v + 1); }, []);
  useEffect(() => {
    let cancelled = false;
    listPartners(true).then((r) => { if (!cancelled) setRows(r.filter((x) => x.deleted_at)); });
    return () => { cancelled = true; };
  }, [version]);
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold">已刪除</h1>
      <p className="mt-1 text-sm text-muted-foreground">還原後會回到原本的清單；已發布的項目會自動重建回到前台。</p>
      <div className="mt-4"><RebuildStatus trigger={rebuildTick} /></div>
      <ul className="mt-5 grid gap-2">
        {rows?.map((row) => (
          <li key={row.id} className="flex items-center gap-4 glass px-4 py-3">
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs">合作對象</span>
            <p className="min-w-0 flex-1 truncate">{row.data.zh} <span className="text-muted-foreground">／ {row.data.en}</span></p>
            <Button variant="outline" size="sm" onClick={async () => { await restorePartner(row.id); await reload(); if (row.status === "published") setRebuildTick((t) => t + 1); }}>還原</Button>
          </li>
        ))}
        {rows && rows.length === 0 ? <li className="glass px-4 py-8 text-center text-sm text-muted-foreground">沒有已刪除的項目。</li> : null}
      </ul>
    </div>
  );
}

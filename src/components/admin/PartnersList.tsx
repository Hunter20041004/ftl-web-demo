"use client";

import { useCallback, useEffect, useState } from "react";
import type { Partner } from "@/lib/content.schema";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { listPartners, publicMediaUrl, reorderPartners, savePartner, softDeletePartner, type PartnerRow } from "@/lib/admin/partners";
import { PartnerForm } from "./PartnerForm";
import { RebuildStatus } from "./RebuildStatus";

// 合作對象：清單（可拖曳排序）＋新增／編輯對話框＋刪除確認。發布後顯示重建狀態。
export function PartnersList() {
  const [rows, setRows] = useState<PartnerRow[] | null>(null);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<PartnerRow | "new" | null>(null);
  const [deleting, setDeleting] = useState<PartnerRow | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [rebuildTick, setRebuildTick] = useState(0);

  const [version, setVersion] = useState(0);
  const reload = useCallback(async () => { setVersion((v) => v + 1); }, []);
  useEffect(() => {
    let cancelled = false;
    listPartners().then((r) => { if (!cancelled) { setRows(r); setError(""); } }).catch((e: Error) => { if (!cancelled) setError(e.message); });
    return () => { cancelled = true; };
  }, [version]);

  const onSubmit = async (data: Partner, status: "draft" | "published") => {
    const row = editing === "new" ? undefined : editing!;
    await savePartner({ id: row?.id, data, status });
    setEditing(null);
    await reload();
    if (status === "published") setRebuildTick((t) => t + 1);
  };

  const onDrop = async (targetId: string) => {
    if (!rows || !dragId || dragId === targetId) return;
    const ids = rows.map((r) => r.id);
    const from = ids.indexOf(dragId), to = ids.indexOf(targetId);
    ids.splice(to, 0, ids.splice(from, 1)[0]);
    setRows(ids.map((id) => rows.find((r) => r.id === id)!).map((r, i) => ({ ...r, position: i })));
    setDragId(null);
    await reorderPartners(ids);
    setRebuildTick((t) => t + 1);
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    await softDeletePartner(deleting.id);
    setDeleting(null);
    await reload();
    setRebuildTick((t) => t + 1);
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">合作對象</h1>
          <p className="mt-1 text-sm text-muted-foreground">拖曳可以調整前台的順序。</p>
        </div>
        <Button className="rounded-full" onClick={() => setEditing("new")}>新增合作對象</Button>
      </div>

      <div className="mt-5"><RebuildStatus trigger={rebuildTick} /></div>
      {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}

      <ul className="mt-5 grid gap-2">
        {rows?.map((row) => (
          <li
            key={row.id}
            data-testid="partner-row"
            draggable
            onDragStart={() => setDragId(row.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => void onDrop(row.id)}
            className={`flex items-center gap-4 glass px-4 py-3 ${dragId === row.id ? "opacity-50" : ""}`}
          >
            <span className="cursor-grab text-muted-foreground" aria-hidden="true">⋮⋮</span>
            <div className="flex h-10 w-16 shrink-0 items-center justify-center rounded-lg bg-white shadow-[var(--glass-hi),var(--shadow-soft)]">
              {/* eslint-disable-next-line @next/next/no-img-element -- Storage 公開網址 */}
              {row.data.logo ? <img src={publicMediaUrl(row.data.logo)} alt="" className="max-h-8 max-w-14 object-contain" /> : <span className="text-xs text-muted-foreground">無</span>}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{row.data.zh} <span className="text-muted-foreground">／ {row.data.en}</span></p>
              <p className="truncate text-xs text-muted-foreground">{row.data.href}</p>
            </div>
            {row.status === "draft" ? <span className="rounded-full bg-muted px-2 py-0.5 text-xs">草稿</span> : null}
            <Button variant="ghost" size="sm" onClick={() => setEditing(row)}>編輯</Button>
            <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setDeleting(row)}>刪除</Button>
          </li>
        ))}
        {rows && rows.length === 0 ? <li className="glass px-4 py-8 text-center text-sm text-muted-foreground">還沒有合作對象。</li> : null}
      </ul>

      <Dialog open={editing !== null} onOpenChange={(open) => { if (!open) setEditing(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing === "new" ? "新增合作對象" : "編輯合作對象"}</DialogTitle>
            <DialogDescription>中英文名稱都要填，發布後前台跑馬燈會顯示。</DialogDescription>
          </DialogHeader>
          {editing ? (
            <PartnerForm
              key={editing === "new" ? "new" : editing.id}
              initial={editing === "new" ? undefined : editing.data}
              isPublished={editing !== "new" && editing.status === "published"}
              onSubmit={onSubmit}
              onCancel={() => setEditing(null)}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={deleting !== null} onOpenChange={(open) => { if (!open) setDeleting(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>刪除「{deleting?.data.zh}」？</DialogTitle>
            <DialogDescription>會從前台消失；可以在「已刪除」還原。</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleting(null)}>取消</Button>
            <Button variant="outline" className="text-destructive" onClick={() => void confirmDelete()}>確定刪除</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

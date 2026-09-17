"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { ZodType } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Collection, Row } from "@/lib/admin/collection";
import { zodErrors } from "@/lib/admin/validate";
import { RebuildStatus } from "./RebuildStatus";
import { scrollToFirstError, type Errors } from "./fields";

// 通用清單頁：清單（可拖曳排序）＋新增／編輯對話框＋刪除確認＋發布後的重建狀態。
// 每一類只要提供：collection、schema（發布驗證）、空白資料、表單元件、列摘要。
export type FormProps<T> = { data: T; setData: (updater: (d: T) => T) => void; errors: Errors; isNew: boolean };

export function EntityPage<T extends object>(props: {
  title: string; intro?: string; addLabel: string; noun: string;
  collection: Collection<T>; schema: ZodType; empty: (rows: Row<T>[]) => T;   // 給目前清單，方便算「下一個」
  Form: (p: FormProps<T>) => ReactNode;   // 當元件用（<Form/>），表單裡才能有自己的 hooks
  summary: (row: Row<T>) => ReactNode;
  sortable?: boolean; wide?: boolean;
  listOptions?: Parameters<Collection<T>["list"]>[0];
  toolbar?: ReactNode;
  draftCheck?: (data: T) => Errors;         // 存草稿時的最低檢查（預設：不檢查）
  toForm?: (row: Row<T>) => T;              // 打開編輯時把列轉成表單資料（預設：row.data）
  onSaved?: (row: Row<T>) => void;
}) {
  const { collection, sortable = false, Form } = props;
  const [rows, setRows] = useState<Row<T>[] | null>(null);
  const [error, setError] = useState("");
  const [version, setVersion] = useState(0);
  const [editing, setEditing] = useState<Row<T> | "new" | null>(null);
  const [form, setForm] = useState<T | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState<Row<T> | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [rebuildTick, setRebuildTick] = useState(0);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let cancelled = false;
    collection.list(props.listOptions).then((r) => { if (!cancelled) { setRows(r); setError(""); } }).catch((e: Error) => { if (!cancelled) setError(e.message); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- listOptions 由父層以固定物件傳入
  }, [version, collection]);
  const reload = () => setVersion((v) => v + 1);

  const open = (row: Row<T> | "new") => { setEditing(row); setForm(row === "new" ? props.empty(rows ?? []) : structuredClone(props.toForm ? props.toForm(row) : row.data)); setErrors({}); };
  const close = () => { setEditing(null); setForm(null); setConfirming(false); };
  const isPublished = editing !== null && editing !== "new" && editing.status === "published";

  const submit = async (status: "draft" | "published") => {
    if (!form || !editing) return;
    const errs = status === "published" ? zodErrors(props.schema, form) : (props.draftCheck?.(form) ?? {});
    setErrors(errs);
    if (Object.keys(errs).length) { setTimeout(() => scrollToFirstError(errs), 0); return; }
    if (status === "published" && isPublished && !confirming) { setConfirming(true); return; }
    setBusy(true);
    try {
      const saved = await collection.save({ id: editing === "new" ? undefined : editing.id, data: form, status });
      props.onSaved?.(saved);
      close(); reload();
      if (status === "published") { setNotice(""); setRebuildTick((t) => t + 1); }
      else setNotice(`已存成草稿，還沒上線；之後按「編輯」→「發布」才會出現在前台。`);
    } catch (e) { setErrors({ form: `儲存失敗：${(e as Error).message}` }); }
    finally { setBusy(false); setConfirming(false); }
  };

  const move = async (id: string, to: number) => {
    if (!rows) return;
    const ids = rows.map((r) => r.id);
    const from = ids.indexOf(id);
    if (to < 0 || to >= ids.length || from === to) return;
    ids.splice(to, 0, ids.splice(from, 1)[0]);
    setRows(ids.map((x) => rows.find((r) => r.id === x)!).map((r, i) => ({ ...r, position: i })));
    await collection.reorder(ids);
    setRebuildTick((t) => t + 1);
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    await collection.softDelete(deleting.id);
    const wasLive = deleting.status === "published";
    setDeleting(null); reload();
    if (wasLive) setRebuildTick((t) => t + 1);
  };

  return (
    <div className={props.wide ? "max-w-5xl" : "max-w-3xl"}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{props.title}</h1>
          {props.intro ? <p className="mt-1 text-sm text-muted-foreground">{props.intro}</p> : null}
        </div>
        <div className="flex items-center gap-3">{props.toolbar}<Button className="rounded-full" onClick={() => open("new")}>{props.addLabel}</Button></div>
      </div>

      <div className="mt-5 grid gap-2">
        {notice ? <p className="rounded-xl bg-secondary px-4 py-3 text-sm text-primary" role="status">{notice}</p> : null}
        <RebuildStatus trigger={rebuildTick} />
      </div>
      {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}

      <ul className="mt-5 grid gap-2">
        {rows === null && !error ? <li className="glass px-4 py-8 text-center text-sm text-muted-foreground">載入中…</li> : null}
        {rows?.map((row, i) => (
          <li key={row.id} data-testid="entity-row" data-status={row.status}
            draggable={sortable} onDragStart={() => setDragId(row.id)} onDragOver={(e) => { if (sortable) e.preventDefault(); }}
            onDrop={() => { if (sortable && dragId) { void move(dragId, i); setDragId(null); } }}
            className={`flex flex-wrap items-center gap-3 overflow-hidden glass px-4 py-3 md:flex-nowrap md:gap-4 ${dragId === row.id ? "opacity-50" : ""}`}>
            {sortable ? (
              <>
                <span className="hidden cursor-grab text-muted-foreground md:inline" aria-hidden="true">⋮⋮</span>
                <span className="flex flex-col md:hidden">
                  <button type="button" className="flex h-10 w-10 items-center justify-center text-sm text-muted-foreground" aria-label="往上" onClick={() => void move(row.id, i - 1)}>▲</button>
                  <button type="button" className="flex h-10 w-10 items-center justify-center text-sm text-muted-foreground" aria-label="往下" onClick={() => void move(row.id, i + 1)}>▼</button>
                </span>
              </>
            ) : null}
            <div className="min-w-0 flex-1 basis-40 [overflow-wrap:anywhere]">{props.summary(row)}</div>
            {row.status === "draft" ? <span className="rounded-full bg-muted px-2 py-0.5 text-xs">草稿</span> : null}
            <div className="ml-auto flex gap-1">
              <Button variant="ghost" size="sm" onClick={() => open(row)}>編輯</Button>
              <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setDeleting(row)}>刪除</Button>
            </div>
          </li>
        ))}
        {rows && rows.length === 0 ? <li className="glass px-4 py-8 text-center text-sm text-muted-foreground">還沒有{props.noun}。</li> : null}
      </ul>

      <Dialog open={editing !== null} onOpenChange={(o) => { if (!o) close(); }}>
        <DialogContent className={`max-h-[92vh] overflow-y-auto ${props.wide ? "sm:max-w-3xl" : "sm:max-w-xl"}`}>
          <DialogHeader>
            <DialogTitle>{editing === "new" ? props.addLabel : `編輯${props.noun}`}</DialogTitle>
            <DialogDescription>中英文欄位都要填才能發布。</DialogDescription>
          </DialogHeader>
          {form && editing ? (
            <form className="grid gap-5" onSubmit={(e) => { e.preventDefault(); void submit("published"); }}>
              <Form data={form} setData={(u) => setForm((d) => (d ? u(d) : d))} errors={errors} isNew={editing === "new"} />
              {errors.form ? <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{errors.form}</p> : null}
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={close} disabled={busy}>取消</Button>
                {!isPublished ? <Button type="button" variant="outline" onClick={() => void submit("draft")} disabled={busy}>存草稿</Button> : null}
                <Button type="submit" disabled={busy}>發布</Button>
              </div>
            </form>
          ) : null}
          <Dialog open={confirming} onOpenChange={setConfirming}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>這會直接上線</DialogTitle>
                <DialogDescription>這個項目已經發布過，儲存後約 2 分鐘正式站就會更新。</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setConfirming(false)}>再看看</Button>
                <Button onClick={() => void submit("published")} disabled={busy}>確定發布</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </DialogContent>
      </Dialog>

      <Dialog open={deleting !== null} onOpenChange={(o) => { if (!o) setDeleting(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>刪除這個{props.noun}？</DialogTitle>
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

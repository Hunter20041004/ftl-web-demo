"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { addAdmin, listAdmins, normalizeEmail, removeAdmin, type AdminRow } from "@/lib/admin/admins";
import { useSession } from "@/lib/admin/auth";

export function AdminsList() {
  const session = useSession();
  const me = session?.user.email?.toLowerCase();
  const [rows, setRows] = useState<AdminRow[] | null>(null);
  const [version, setVersion] = useState(0);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    listAdmins().then((r) => { if (!cancelled) setRows(r); }).catch((e: Error) => { if (!cancelled) setError(e.message); });
    return () => { cancelled = true; };
  }, [version]);

  const add = async () => {
    const normalized = normalizeEmail(email);
    if (!normalized) { setError("Email 格式不對"); return; }
    try { await addAdmin(normalized, me ?? ""); setEmail(""); setError(""); setVersion((v) => v + 1); }
    catch (e) { setError((e as Error).message); }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold">管理員</h1>
      <p className="mt-1 text-sm text-muted-foreground">名單上的 Google 帳號才能登入後台。換屆時把新幹部加進來、舊的移除。</p>

      <form className="mt-5 flex items-end gap-3" onSubmit={(e) => { e.preventDefault(); void add(); }}>
        <div className="grid flex-1 gap-1.5">
          <Label htmlFor="admin-email">Email</Label>
          <Input id="admin-email" type="email" value={email} placeholder="name@gmail.com" onChange={(e) => setEmail(e.target.value)} />
        </div>
        <Button type="submit" className="rounded-full">加入</Button>
      </form>
      {error ? <p className="mt-2 text-sm text-destructive">{error}</p> : null}

      <ul className="mt-5 grid gap-2">
        {rows?.map((row) => (
          <li key={row.email} data-testid="admin-row" data-email={row.email} className="flex items-center gap-4 glass px-4 py-3">
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{row.email}{row.email === me ? <span className="ml-2 rounded-full bg-secondary px-2 py-0.5 text-xs text-primary">你</span> : null}</p>
              <p className="text-xs text-muted-foreground">由 {row.added_by ?? "—"} 於 {row.added_at.slice(0, 10)} 加入</p>
            </div>
            {row.email !== me ? <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setRemoving(row.email)}>移除</Button> : null}
          </li>
        ))}
      </ul>

      <Dialog open={removing !== null} onOpenChange={(o) => { if (!o) setRemoving(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>移除 {removing}？</DialogTitle>
            <DialogDescription>對方會立刻無法登入後台。</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRemoving(null)}>取消</Button>
            <Button variant="outline" className="text-destructive" onClick={async () => { if (removing) await removeAdmin(removing); setRemoving(null); setVersion((v) => v + 1); }}>確定移除</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

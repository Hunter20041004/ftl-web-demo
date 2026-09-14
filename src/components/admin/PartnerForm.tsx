"use client";

import { useRef, useState } from "react";
import type { Partner } from "@/lib/content.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { publicMediaUrl, uploadLogo, validatePartner } from "@/lib/admin/partners";

type Props = {
  initial?: Partner;
  isPublished: boolean;           // 已發布的項目：只有「發布」鍵，且按下前確認
  onSubmit: (data: Partner, status: "draft" | "published") => Promise<void>;
  onCancel: () => void;
};

const EMPTY: Partner = { zh: "", en: "", href: "", logo: undefined, markOnly: false };

export function PartnerForm({ initial, isPublished, onSubmit, onCancel }: Props) {
  const [data, setData] = useState<Partner>(initial ?? EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const firstError = useRef<HTMLDivElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const set = (k: keyof Partner, v: string | boolean | undefined) => setData((d) => ({ ...d, [k]: v }));

  const submit = async (status: "draft" | "published") => {
    const errs = validatePartner(data, { draft: status === "draft" });
    setErrors(errs);
    if (Object.keys(errs).length) { firstError.current?.scrollIntoView({ block: "center" }); return; }
    if (status === "published" && isPublished && !confirming) { setConfirming(true); return; }
    setBusy(true);
    try { await onSubmit({ ...data, logo: data.logo || undefined, markOnly: data.markOnly || undefined }, status); }
    catch (e) { setErrors({ form: `儲存失敗：${(e as Error).message}` }); }
    finally { setBusy(false); setConfirming(false); }
  };

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try { set("logo", await uploadLogo(file)); }
    catch (e) { setErrors((x) => ({ ...x, logo: (e as Error).message })); }
    finally { setUploading(false); }
  };

  const field = (key: keyof Partner, label: string, placeholder: string) => (
    <div className="grid gap-1.5" ref={!firstError.current && errors[key] ? firstError : undefined}>
      <Label htmlFor={`partner-${key}`}>{label}</Label>
      <Input id={`partner-${key}`} value={String(data[key] ?? "")} placeholder={placeholder} aria-invalid={Boolean(errors[key])} onChange={(e) => set(key, e.target.value)} />
      {errors[key] ? <p className="text-xs text-destructive">{errors[key]}</p> : null}
    </div>
  );

  return (
    <form className="grid gap-5" onSubmit={(e) => { e.preventDefault(); void submit("published"); }}>
      {field("zh", "中文名稱", "臺灣區塊鏈愛好者協會（TABEI）")}
      {field("en", "英文名稱", "Taiwan Blockchain Enthusiasts Institute")}
      {field("href", "連結", "https://")}
      <div className="grid gap-1.5">
        <Label>Logo</Label>
        <div className="flex items-center gap-3">
          <Button type="button" variant="outline" size="sm" onClick={() => fileInput.current?.click()} disabled={uploading}>選擇圖片</Button>
          <span className="text-xs text-muted-foreground">PNG、JPG 或 SVG；會自動縮到 400px</span>
          <input ref={fileInput} id="partner-logo" type="file" accept="image/*" className="sr-only" aria-label="Logo" onChange={(e) => void onFile(e.target.files?.[0])} />
        </div>
        {uploading ? <p className="text-xs text-muted-foreground">上傳中…</p> : null}
        {data.logo ? (
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element -- Storage 公開網址 */}
            <img data-testid="logo-preview" src={publicMediaUrl(data.logo)} alt="" className="h-10 max-w-40 rounded-lg bg-white object-contain p-1 shadow-[var(--glass-hi),var(--shadow-soft)]" />
            <button type="button" className="text-xs text-muted-foreground hover:underline" onClick={() => set("logo", undefined)}>移除</button>
          </div>
        ) : null}
        {errors.logo ? <p className="text-xs text-destructive">{errors.logo}</p> : null}
      </div>
      <div className="flex items-center gap-3">
        <Switch id="partner-markOnly" checked={Boolean(data.markOnly)} onCheckedChange={(v) => set("markOnly", v)} />
        <Label htmlFor="partner-markOnly">Logo 已含名稱，前台不另顯示文字</Label>
      </div>
      {errors.form ? <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{errors.form}</p> : null}
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={busy}>取消</Button>
        {!isPublished ? <Button type="button" variant="outline" onClick={() => void submit("draft")} disabled={busy || uploading}>存草稿</Button> : null}
        <Button type="submit" disabled={busy || uploading}>發布</Button>
      </div>

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
    </form>
  );
}

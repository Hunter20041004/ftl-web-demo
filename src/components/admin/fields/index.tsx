"use client";

// 表單欄位的積木。每個欄位都吃 errors[path] 來標紅；中英成對的用 BilingualField。
import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { publicMediaUrl, uploadMedia } from "@/lib/admin/media";

export type Errors = Record<string, string>;

export function Err({ msg }: { msg?: string }) {
  return msg ? <p className="text-xs text-destructive">{msg}</p> : null;
}

export function TextField({ id, label, value, onChange, error, placeholder, multiline, type = "text", hint }: {
  id: string; label: string; value: string | number | undefined; onChange: (v: string) => void; error?: string; placeholder?: string; multiline?: boolean; type?: string; hint?: string;
}) {
  const invalid = Boolean(error);
  return (
    <div className="grid gap-1.5" data-field={id}>
      <Label htmlFor={id}>{label}</Label>
      {multiline
        ? <Textarea id={id} value={value ?? ""} placeholder={placeholder} aria-invalid={invalid} rows={4} onChange={(e) => onChange(e.target.value)} className="rounded-xl bg-white/80" />
        : <Input id={id} type={type} value={value ?? ""} placeholder={placeholder} aria-invalid={invalid} onChange={(e) => onChange(e.target.value)} />}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      <Err msg={error} />
    </div>
  );
}

// 中文＋英文成對：路徑 key 與 keyEn
export function BilingualField({ id, label, zh, en, onZh, onEn, errors, multiline, placeholderZh, placeholderEn }: {
  id: string; label: string; zh?: string; en?: string; onZh: (v: string) => void; onEn: (v: string) => void; errors?: Errors; multiline?: boolean; placeholderZh?: string; placeholderEn?: string;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <TextField id={id} label={`${label}（中文）`} value={zh} onChange={onZh} error={errors?.[id]} multiline={multiline} placeholder={placeholderZh} />
      <TextField id={`${id}En`} label={`${label}（英文）`} value={en} onChange={onEn} error={errors?.[`${id}En`]} multiline={multiline} placeholder={placeholderEn} />
    </div>
  );
}

// 一行一條的清單（重點、標籤、書的主題…）
export function ListField({ id, label, value, onChange, error, hint }: { id: string; label: string; value: string[] | undefined; onChange: (v: string[]) => void; error?: string; hint?: string }) {
  return (
    <div className="grid gap-1.5" data-field={id}>
      <Label htmlFor={id}>{label}</Label>
      <Textarea id={id} value={(value ?? []).join("\n")} rows={3} aria-invalid={Boolean(error)} onChange={(e) => onChange(e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))} className="rounded-xl bg-white/80" placeholder="一行一條" />
      <p className="text-xs text-muted-foreground">{hint ?? "一行一條"}</p>
      <Err msg={error} />
    </div>
  );
}

export function BilingualListField({ id, label, zh, en, onZh, onEn, errors, hint }: { id: string; label: string; zh?: string[]; en?: string[]; onZh: (v: string[]) => void; onEn: (v: string[]) => void; errors?: Errors; hint?: string }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <ListField id={id} label={`${label}（中文）`} value={zh} onChange={onZh} error={errors?.[id]} hint={hint} />
      <ListField id={`${id}En`} label={`${label}（英文）`} value={en} onChange={onEn} error={errors?.[`${id}En`]} hint={hint} />
    </div>
  );
}

// 「名稱｜內容」一行一組（工作坊模組）
export function PairListField({ id, label, value, onChange, error }: { id: string; label: string; value: Array<[string, string]> | undefined; onChange: (v: Array<[string, string]>) => void; error?: string }) {
  return (
    <div className="grid gap-1.5" data-field={id}>
      <Label htmlFor={id}>{label}</Label>
      <Textarea id={id} value={(value ?? []).map(([a, b]) => `${a}｜${b}`).join("\n")} rows={4} aria-invalid={Boolean(error)} className="rounded-xl bg-white/80" placeholder="名稱｜說明，一行一組"
        onChange={(e) => onChange(e.target.value.split("\n").map((s) => s.trim()).filter(Boolean).map((line) => { const i = line.indexOf("｜"); return i < 0 ? [line, ""] : [line.slice(0, i).trim(), line.slice(i + 1).trim()]; }))} />
      <p className="text-xs text-muted-foreground">一行一組，用全形「｜」隔開名稱與說明</p>
      <Err msg={error} />
    </div>
  );
}

export function SelectField({ id, label, value, onChange, options, error }: { id: string; label: string; value: string | undefined; onChange: (v: string) => void; options: Array<{ value: string; label: string }>; error?: string }) {
  return (
    <div className="grid gap-1.5" data-field={id}>
      <Label htmlFor={id}>{label}</Label>
      <select id={id} value={value ?? ""} aria-invalid={Boolean(error)} onChange={(e) => onChange(e.target.value)} className="h-10 rounded-xl border border-input bg-white/80 px-3 text-sm">
        <option value="" disabled>請選擇</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <Err msg={error} />
    </div>
  );
}

export function CheckField({ id, label, checked, onChange }: { id: string; label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-sm" htmlFor={id}>
      <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-[#1668e3]" />
      {label}
    </label>
  );
}

export function ImageField({ id, label, value, onChange, folder, maxEdge = 1200, error, hint }: { id: string; label: string; value: string | undefined; onChange: (v: string | undefined) => void; folder: string; maxEdge?: number; error?: string; hint?: string }) {
  const input = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true); setUploadError("");
    try { onChange(await uploadMedia(file, folder, maxEdge)); }
    catch (e) { setUploadError((e as Error).message); }
    finally { setUploading(false); }
  };
  return (
    <div className="grid gap-1.5" data-field={id}>
      <Label>{label}</Label>
      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" variant="outline" size="sm" onClick={() => input.current?.click()} disabled={uploading}>{uploading ? "上傳中…" : "選擇圖片"}</Button>
        <span className="text-xs text-muted-foreground">{hint ?? `PNG、JPG 或 SVG；會自動縮到 ${maxEdge}px`}</span>
        <input ref={input} id={id} type="file" accept="image/*" className="sr-only" aria-label={label} onChange={(e) => void onFile(e.target.files?.[0])} />
      </div>
      {value ? (
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element -- Storage 公開網址 */}
          <img data-testid={`${id}-preview`} src={publicMediaUrl(value)} alt="" className="h-16 max-w-48 rounded-lg bg-white object-contain p-1 shadow-[var(--glass-hi),var(--shadow-soft)]" />
          <button type="button" className="text-xs text-muted-foreground hover:underline" onClick={() => onChange(undefined)}>移除</button>
        </div>
      ) : null}
      <Err msg={error ?? uploadError} />
    </div>
  );
}

// 第一個有錯的欄位捲到畫面中間
export function scrollToFirstError(errors: Errors) {
  const first = Object.keys(errors)[0];
  if (!first) return;
  const el = document.querySelector(`[data-field="${first}"]`) ?? document.getElementById(first);
  el?.scrollIntoView({ block: "center", behavior: "smooth" });
}

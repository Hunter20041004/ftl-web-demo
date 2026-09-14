"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { membershipSchema, semesterSchema } from "@/lib/content.schema";
import { getSettings, saveSettings, type Settings } from "@/lib/admin/settings";
import { zodErrors } from "@/lib/admin/validate";
import { RebuildStatus } from "./RebuildStatus";
import { BilingualField, BilingualListField, CheckField, Err, TextField, scrollToFirstError, type Errors } from "./fields";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({ semester: semesterSchema, membership: membershipSchema });

// 四欄一行：中文名｜中文值｜英文名｜英文值（獎勵級距、常見問題都是這種 4-tuple）
const tuple4ToText = (rows: Array<[string, string, string, string]>) => rows.map((r) => r.join("｜")).join("\n");
const textToTuple4 = (t: string): Array<[string, string, string, string]> => t.split("\n").map((l) => l.trim()).filter(Boolean).map((l) => { const p = l.split("｜").map((x) => x.trim()); return [p[0] ?? "", p[1] ?? "", p[2] ?? "", p[3] ?? ""]; });

function TupleField({ id, label, value, onChange, error, hint }: { id: string; label: string; value: Array<[string, string, string, string]>; onChange: (v: Array<[string, string, string, string]>) => void; error?: string; hint: string }) {
  return (
    <div className="grid gap-1.5" data-field={id}>
      <Label htmlFor={id}>{label}</Label>
      <Textarea id={id} rows={5} defaultValue={tuple4ToText(value)} className="rounded-xl bg-white/80" aria-invalid={Boolean(error)} onChange={(e) => onChange(textToTuple4(e.target.value))} />
      <p className="text-xs text-muted-foreground">{hint}</p>
      <Err msg={error} />
    </div>
  );
}

export function SettingsForm() {
  const [data, setData] = useState<Settings | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [rebuildTick, setRebuildTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    getSettings().then((s) => { if (!cancelled) setData(s); }).catch((e: Error) => { if (!cancelled) setLoadError(e.message); });
    return () => { cancelled = true; };
  }, []);

  if (loadError) return <p className="text-sm text-destructive">{loadError}</p>;
  if (!data) return <p className="text-sm text-muted-foreground">載入中…</p>;

  const S = data.semester, M = data.membership;
  const setS = (p: Partial<Settings["semester"]>) => setData((d) => d && ({ ...d, semester: { ...d.semester, ...p } }));
  const setM = (p: Partial<Settings["membership"]>) => setData((d) => d && ({ ...d, membership: { ...d.membership, ...p } }));
  const setR = (p: Partial<Settings["membership"]["reward"]>) => setM({ reward: { ...M.reward, ...p } });
  const setType = (i: number, p: Partial<Settings["membership"]["types"][number]>) => setM({ types: M.types.map((t, j) => (j === i ? { ...t, ...p } : t)) });
  const setTimeline = (i: number, p: Partial<Settings["membership"]["timeline"][number]>) => setM({ timeline: M.timeline.map((t, j) => (j === i ? { ...t, ...p } : t)) });

  const submit = async () => {
    const errs = zodErrors(schema, data);
    setErrors(errs);
    if (Object.keys(errs).length) { setTimeout(() => scrollToFirstError(errs), 0); return; }
    if (!confirming) { setConfirming(true); return; }
    setBusy(true);
    try { await saveSettings(data); setRebuildTick((t) => t + 1); }
    catch (e) { setErrors({ form: `儲存失敗：${(e as Error).message}` }); }
    finally { setBusy(false); setConfirming(false); }
  };

  const section = "grid gap-3 rounded-2xl bg-white/60 p-4 shadow-[var(--glass-hi),var(--shadow-soft)]";
  return (
    <form className="grid max-w-4xl gap-5" onSubmit={(e) => { e.preventDefault(); void submit(); }}>
      <div>
        <h1 className="text-2xl font-bold">學期設定</h1>
        <p className="mt-1 text-sm text-muted-foreground">學期代號決定前台顯示哪一學期的活動。招募時程、社費與出席獎勵金、常見問題也在這裡改。這一頁沒有草稿，儲存就是發布。</p>
      </div>
      <RebuildStatus trigger={rebuildTick} />

      <fieldset className={section}>
        <legend className="px-1 text-sm font-semibold text-primary">學期</legend>
        <div className="grid gap-3 md:grid-cols-2">
          <TextField id="semester.code" label="學期代號" value={S.code} onChange={(v) => setS({ code: v })} error={errors["semester.code"]} placeholder="115-1" hint="活動要標同一個代號才會出現在前台" />
          <TextField id="semester.range" label="期間" value={S.range} onChange={(v) => setS({ range: v })} error={errors["semester.range"]} placeholder="2026.09 – 2026.12" hint="前台顯示用；活動日期的年份也從這裡的起始年推" />
        </div>
        <BilingualField id="semester.meetingDay" label="上課日" zh={S.meetingDay} en={S.meetingDayEn} onZh={(v) => setS({ meetingDay: v })} onEn={(v) => setS({ meetingDayEn: v })} errors={errors} placeholderZh="每週三" placeholderEn="Wednesdays" />
        <TextField id="semester.focus" label="標語" value={S.focus} onChange={(v) => setS({ focus: v })} error={errors["semester.focus"]} />
        <BilingualField id="semester.concept" label="學期概念" zh={S.concept} en={S.conceptEn} onZh={(v) => setS({ concept: v })} onEn={(v) => setS({ conceptEn: v })} errors={errors} multiline />
      </fieldset>

      <fieldset className={section}>
        <legend className="px-1 text-sm font-semibold text-primary">社員身份</legend>
        {M.types.map((t, i) => (
          <div key={i} className="grid gap-3 rounded-xl bg-white/70 p-3">
            <BilingualField id={`membership.types.${i}.name`} label="名稱" zh={t.name} en={t.en} onZh={(v) => setType(i, { name: v })} onEn={(v) => setType(i, { en: v })} errors={{ [`membership.types.${i}.name`]: errors[`membership.types.${i}.name`] ?? "", [`membership.types.${i}.nameEn`]: errors[`membership.types.${i}.en`] ?? "" }} />
            <BilingualField id={`membership.types.${i}.fee`} label="社費" zh={t.fee} en={t.feeEn} onZh={(v) => setType(i, { fee: v })} onEn={(v) => setType(i, { feeEn: v })} errors={errors} />
            <BilingualField id={`membership.types.${i}.how`} label="怎麼加入" zh={t.how} en={t.howEn} onZh={(v) => setType(i, { how: v })} onEn={(v) => setType(i, { howEn: v })} errors={errors} />
            <BilingualField id={`membership.types.${i}.perks`} label="權益" zh={t.perks} en={t.perksEn} onZh={(v) => setType(i, { perks: v })} onEn={(v) => setType(i, { perksEn: v })} errors={errors} multiline />
          </div>
        ))}
      </fieldset>

      <fieldset className={section}>
        <legend className="px-1 text-sm font-semibold text-primary">招募時程</legend>
        {M.timeline.map((t, i) => (
          <div key={i} className="grid gap-3 md:grid-cols-[8rem_1fr_1fr_auto]">
            <TextField id={`membership.timeline.${i}.date`} label="日期" value={t.date} onChange={(v) => setTimeline(i, { date: v })} error={errors[`membership.timeline.${i}.date`]} placeholder="09/07 – 09/17" />
            <TextField id={`membership.timeline.${i}.zh`} label="中文" value={t.zh} onChange={(v) => setTimeline(i, { zh: v })} error={errors[`membership.timeline.${i}.zh`]} />
            <TextField id={`membership.timeline.${i}.en`} label="英文" value={t.en} onChange={(v) => setTimeline(i, { en: v })} error={errors[`membership.timeline.${i}.en`]} />
            <div className="flex items-end gap-2 pb-2">
              <CheckField id={`membership.timeline.${i}.done`} label="已結束" checked={t.done} onChange={(v) => setTimeline(i, { done: v })} />
              <button type="button" className="text-xs text-destructive" onClick={() => setM({ timeline: M.timeline.filter((_, j) => j !== i) })}>刪</button>
            </div>
          </div>
        ))}
        <div><Button type="button" variant="outline" size="sm" onClick={() => setM({ timeline: [...M.timeline, { date: "", zh: "", en: "", done: false }] })}>加一段</Button></div>
      </fieldset>

      <fieldset className={section}>
        <legend className="px-1 text-sm font-semibold text-primary">社費與出席獎勵金</legend>
        <BilingualField id="membership.reward.headline" label="一句話" zh={M.reward.headline} en={M.reward.headlineEn} onZh={(v) => setR({ headline: v })} onEn={(v) => setR({ headlineEn: v })} errors={errors} />
        <TupleField id="membership.reward.tiers" label="級距" value={M.reward.tiers} onChange={(v) => setR({ tiers: v })} error={errors["membership.reward.tiers"]} hint="一行一級：堂數（中文）｜金額（中文）｜堂數（英文）｜金額（英文）" />
        <BilingualField id="membership.reward.countedSessions" label="計入的場次" zh={M.reward.countedSessions} en={M.reward.countedSessionsEn} onZh={(v) => setR({ countedSessions: v })} onEn={(v) => setR({ countedSessionsEn: v })} errors={errors} multiline />
        <BilingualField id="membership.reward.attendance" label="出席認定" zh={M.reward.attendance} en={M.reward.attendanceEn} onZh={(v) => setR({ attendance: v })} onEn={(v) => setR({ attendanceEn: v })} errors={errors} multiline />
        <BilingualField id="membership.reward.payout" label="發放方式" zh={M.reward.payout} en={M.reward.payoutEn} onZh={(v) => setR({ payout: v })} onEn={(v) => setR({ payoutEn: v })} errors={errors} multiline />
        <BilingualField id="membership.reward.points" label="積分獎金" zh={M.reward.points} en={M.reward.pointsEn} onZh={(v) => setR({ points: v })} onEn={(v) => setR({ pointsEn: v })} errors={errors} multiline />
        <BilingualListField id="membership.payment" label="繳費步驟" zh={M.payment} en={M.paymentEn} onZh={(v) => setM({ payment: v })} onEn={(v) => setM({ paymentEn: v })} errors={errors} />
      </fieldset>

      <fieldset className={section}>
        <legend className="px-1 text-sm font-semibold text-primary">常見問題</legend>
        <TupleField id="membership.faq" label="問答" value={M.faq} onChange={(v) => setM({ faq: v })} error={errors["membership.faq"]} hint="一行一題：問（中文）｜答（中文）｜問（英文）｜答（英文）" />
      </fieldset>

      {errors.form ? <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{errors.form}</p> : null}
      <div className="flex justify-end"><Button type="submit" disabled={busy}>發布</Button></div>

      <Dialog open={confirming} onOpenChange={setConfirming}>
        <DialogContent>
          <DialogHeader><DialogTitle>這會直接上線</DialogTitle><DialogDescription>學期設定沒有草稿，儲存後約 2 分鐘正式站更新。</DialogDescription></DialogHeader>
          <DialogFooter><Button variant="ghost" onClick={() => setConfirming(false)}>再看看</Button><Button onClick={() => void submit()} disabled={busy}>確定發布</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  );
}

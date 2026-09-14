"use client";

import { useEffect, useMemo, useState } from "react";
import { events, type EventData } from "@/lib/admin/collections";
import type { Query } from "@/lib/admin/collection";
import { getSettings } from "@/lib/admin/settings";
import { EntityPage } from "./EntityPage";
import { EventForm, KIND_OPTIONS, emptyEvent, eventSchema } from "./forms/EventForm";

// 活動：預設看「目前學期」（學期設定裡的代號）；可切到其他學期先準備下學期的活動。
export function EventsList() {
  const [current, setCurrent] = useState<string | null>(null);
  const [semester, setSemester] = useState<string | null>(null);
  const [known, setKnown] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getSettings(), events.list({ includeDeleted: true })]).then(([s, rows]) => {
      if (cancelled) return;
      const code = s.semester.code;
      setCurrent(code); setSemester((prev) => prev ?? code);
      setKnown([...new Set([code, ...rows.map((r) => String(r.semester))])].sort().reverse());
    });
    return () => { cancelled = true; };
  }, []);

  const listOptions = useMemo(() => (semester ? { filter: (q: Query) => q.eq("semester", semester) as Query, order: "week", ascending: true } : undefined), [semester]);
  if (!semester || !current) return <p className="text-sm text-muted-foreground">載入中…</p>;

  const kindLabel = (k: string) => KIND_OPTIONS.find((o) => o.value === k)?.label ?? k;
  return (
    <EntityPage<EventData>
      key={semester}
      title="活動" intro={`前台只顯示目前學期（${current}）的活動，依週次排序。要準備下學期，先在學期設定改代號，或在這裡切換學期新增。`} addLabel="新增活動" noun="活動"
      collection={events} schema={eventSchema} empty={() => emptyEvent(semester)} listOptions={listOptions} wide
      toolbar={
        <select value={semester} onChange={(e) => setSemester(e.target.value)} className="h-10 rounded-full border border-input bg-white/80 px-3 text-sm" aria-label="學期">
          {known.map((s) => <option key={s} value={s}>{s}{s === current ? "（目前）" : ""}</option>)}
        </select>
      }
      Form={EventForm}
      summary={(row) => (
        <div className="min-w-0">
          <p className="font-medium md:truncate"><span className="mr-2 font-mono text-xs text-muted-foreground">W{String(row.week).padStart(2, "0")} {String(row.date).slice(5)}</span><span className="mr-2 rounded-full bg-secondary px-2 py-0.5 text-xs text-primary">{kindLabel(row.data.kind)}</span>{row.data.zh}</p>
          <p className="truncate text-xs text-muted-foreground">{row.data.lecture ? `${row.data.lecture.speaker}，${row.data.lecture.org}` : row.data.workshop?.title ?? row.data.book?.title ?? row.data.note ?? ""}</p>
        </div>
      )}
    />
  );
}

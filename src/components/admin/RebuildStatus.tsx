"use client";

import { useEffect, useState } from "react";
import { getRebuildStatus, triggerRebuild, type RebuildStatus as Status } from "@/lib/admin/rebuild";

// 發布後顯示「已送出重建」，並每 15 秒問一次進度直到跑完。也可只顯示最近一次（總覽用）。
export function RebuildStatus({ trigger, onDone }: { trigger?: number; onDone?: () => void }) {
  const [status, setStatus] = useState<Status | null>(null);
  const [error, setError] = useState<string>("");
  const message = trigger ? "已送出重建，約 2 分鐘後上線。" : "";

  useEffect(() => {
    if (!trigger) return;
    let cancelled = false;
    triggerRebuild().catch((e: Error) => { if (!cancelled) setError(`重建沒有觸發成功：${e.message}`); });
    const poll = async () => {
      try {
        const s = await getRebuildStatus();
        if (cancelled) return;
        setStatus(s);
        if (s.status === "completed") { onDone?.(); return; }
      } catch (e) { if (!cancelled) setError(`查詢狀態失敗：${(e as Error).message}`); return; }
      timer = setTimeout(poll, 15_000);
    };
    let timer = setTimeout(poll, 8_000);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [trigger, onDone]);

  if (!message) return null;
  const label = status?.status === "completed"
    ? (status.conclusion === "success" ? "重建完成，正式站已更新。" : `重建失敗（${status.conclusion}）。`)
    : status?.status === "in_progress" ? "重建進行中…" : null;
  return (
    <div className={`rounded-xl px-4 py-3 text-sm ${error || status?.conclusion === "failure" ? "bg-red-50 text-red-700" : "bg-secondary text-primary"}`} role="status">
      <p>{message}</p>
      {label ? <p className="mt-1">{label}{status?.url ? <> <a className="underline" href={status.url} target="_blank" rel="noreferrer">查看紀錄</a></> : null}</p> : null}
      {error ? <p className="mt-1">{error}</p> : null}
    </div>
  );
}

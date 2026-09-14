"use client";

import { useEffect, useState } from "react";
import { getRebuildStatus, triggerRebuild, type RebuildStatus as Status } from "@/lib/admin/rebuild";

// 發布後顯示「已送出重建」，並每 15 秒問一次進度直到跑完。也可只顯示最近一次（總覽用）。
export function RebuildStatus({ trigger, onDone }: { trigger?: number; onDone?: () => void }) {
  // 每次觸發都從零開始：只認「觸發之後才更新」的 run，避免把上一次的結果當成這一次
  const [state, setState] = useState<{ trigger: number; status: Status | null; error: string }>({ trigger: 0, status: null, error: "" });
  const message = trigger ? "已送出重建，約 2 分鐘後上線。" : "";
  const status = state.trigger === trigger ? state.status : null;
  const error = state.trigger === trigger ? state.error : "";

  useEffect(() => {
    if (!trigger) return;
    let cancelled = false;
    const startedAt = Date.now();
    triggerRebuild().catch((e: Error) => { if (!cancelled) setState({ trigger, status: null, error: `重建沒有觸發成功：${e.message}` }); });
    const poll = async () => {
      try {
        const s = await getRebuildStatus();
        if (cancelled) return;
        // 只認觸發之後才建立的 run（留 15 秒給時鐘誤差）
        const fresh = s.createdAt ? Date.parse(s.createdAt) >= startedAt - 15_000 : false;
        if (fresh) setState({ trigger, status: s, error: "" });
        if (fresh && s.status === "completed") { onDone?.(); return; }
      } catch (e) { if (!cancelled) setState({ trigger, status: null, error: `查詢狀態失敗：${(e as Error).message}` }); return; }
      timer = setTimeout(poll, 15_000);
    };
    let timer = setTimeout(poll, 8_000);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [trigger, onDone]);

  if (!message) return null;
  const label = status?.status === "completed"
    ? (status.conclusion === "success" ? "重建完成，正式站已更新。" : `重建失敗（${status.conclusion}）。`)
    : status?.status === "in_progress" ? "重建進行中…" : "排隊中…";
  return (
    <div className={`rounded-xl px-4 py-3 text-sm ${error || status?.conclusion === "failure" ? "bg-red-50 text-red-700" : "bg-secondary text-primary"}`} role="status">
      <p>{message}</p>
      {label ? <p className="mt-1">{label}{status?.url ? <> <a className="underline" href={status.url} target="_blank" rel="noreferrer">查看紀錄</a></> : null}</p> : null}
      {error ? <p className="mt-1">{error}</p> : null}
    </div>
  );
}

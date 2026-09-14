// 通用的內容表存取：每張表都是「可篩選欄位 + data jsonb + status + deleted_at」。
// columns(data) 從 data 推出要一起寫進去的可篩選欄位（例如 events 的 semester/week/date/kind）。
import { getSupabase } from "./supabase.ts";

export type Row<T> = { id: string; position: number; status: "draft" | "published"; deleted_at: string | null; updated_at: string; data: T } & Record<string, unknown>;

export type Collection<T> = {
  table: string;
  list: (opts?: { includeDeleted?: boolean; filter?: (q: Query) => Query; order?: string; ascending?: boolean }) => Promise<Row<T>[]>;
  save: (row: { id?: string; data: T; status: "draft" | "published"; position?: number }) => Promise<Row<T>>;
  reorder: (ids: string[]) => Promise<void>;
  softDelete: (id: string) => Promise<void>;
  restore: (id: string) => Promise<void>;
};

// supabase-js 的查詢型別很長，這裡只用得到 eq/is/order
export type Query = ReturnType<ReturnType<ReturnType<typeof getSupabase>["from"]>["select"]>;

export function makeCollection<T extends object>(table: string, opts: { columns?: (data: T) => Record<string, unknown>; hasPosition?: boolean } = {}): Collection<T> {
  const hasPosition = opts.hasPosition ?? true;
  const columns = opts.columns ?? (() => ({}));
  const selectCols = `id, ${hasPosition ? "position, " : ""}status, deleted_at, updated_at, data`;

  const list: Collection<T>["list"] = async (o = {}) => {
    let q = getSupabase().from(table).select(o.filter ? "*" : selectCols) as Query;
    if (!o.includeDeleted) q = q.is("deleted_at", null);
    if (o.filter) q = o.filter(q);
    q = q.order(o.order ?? (hasPosition ? "position" : "updated_at"), { ascending: o.ascending ?? hasPosition });
    const { data, error } = await q;
    if (error) throw new Error(error.message);
    return (data as unknown as Row<T>[]).map((r) => ({ ...r, position: r.position ?? 0 }));
  };

  const nextPosition = async () => {
    const { data } = await getSupabase().from(table).select("position").order("position", { ascending: false }).limit(1);
    return ((data?.[0] as { position?: number } | undefined)?.position ?? -1) + 1;
  };

  const save: Collection<T>["save"] = async (row) => {
    const sb = getSupabase();
    const payload: Record<string, unknown> = { data: row.data, status: row.status, ...columns(row.data) };
    if (hasPosition && row.position !== undefined) payload.position = row.position;
    const q = row.id
      ? sb.from(table).update(payload).eq("id", row.id)
      : sb.from(table).insert({ ...payload, ...(hasPosition ? { position: row.position ?? (await nextPosition()) } : {}) });
    const { data, error } = await q.select("*").single();
    if (error) throw new Error(error.message);
    return data as unknown as Row<T>;
  };

  const reorder: Collection<T>["reorder"] = async (ids) => {
    for (const [i, id] of ids.entries()) {
      const { error } = await getSupabase().from(table).update({ position: i }).eq("id", id);
      if (error) throw new Error(error.message);
    }
  };
  const softDelete: Collection<T>["softDelete"] = async (id) => {
    const { error } = await getSupabase().from(table).update({ deleted_at: new Date().toISOString() }).eq("id", id);
    if (error) throw new Error(error.message);
  };
  const restore: Collection<T>["restore"] = async (id) => {
    const { error } = await getSupabase().from(table).update({ deleted_at: null }).eq("id", id);
    if (error) throw new Error(error.message);
  };
  return { table, list, save, reorder, softDelete, restore };
}

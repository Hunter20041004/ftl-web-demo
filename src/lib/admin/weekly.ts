// 週報：一期＝weekly_issues 一列＋weekly_stories 三列。後台把它當一個物件編輯，存檔時拆開寫。
import { z } from "zod";
import { weeklyStorySchema } from "../content.schema.ts";
import type { Collection, Row } from "./collection.ts";
import { getSupabase } from "./supabase.ts";
import type { ParsedStory } from "./weekly-parse.ts";

export type IssueDraft = { vol: number; range_start: string; range_end: string; lede: string; ledeEn: string; stories: [ParsedStory, ParsedStory, ParsedStory] };

const storySchema = weeklyStorySchema.extend({ headline: z.string().min(1).max(100), headlineEn: z.string().min(1) });
export const issueSchema = z.object({
  vol: z.number().int().min(1),
  range_start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), range_end: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  lede: z.string().min(1), ledeEn: z.string().min(1),
  stories: z.tuple([storySchema, storySchema, storySchema]),
});

export const emptyStory = (): ParsedStory => ({ headline: "", headlineEn: "", title: "", titleEn: "", lede: "", ledeEn: "", facts: [], factsEn: [], context: "", contextEn: "", why: "", whyEn: "", taiwan: "", taiwanEn: "", watch: [], watchEn: [], sources: [] });
export const emptyIssue = (vol: number, start: string, end: string): IssueDraft => ({ vol, range_start: start, range_end: end, lede: "", ledeEn: "", stories: [emptyStory(), emptyStory(), emptyStory()] });

type IssueRow = { id: string; vol: number; range_start: string; range_end: string; status: "draft" | "published"; deleted_at: string | null; updated_at: string; data: { lede: string; ledeEn: string } };
type StoryRow = { id: string; issue_id: string; position: number; data: ParsedStory };

export const weekly: Collection<IssueDraft> = {
  table: "weekly_issues",
  async list(opts = {}) {
    const sb = getSupabase();
    let q = sb.from("weekly_issues").select("*").order("vol", { ascending: false });
    if (!opts.includeDeleted) q = q.is("deleted_at", null);
    const { data: issues, error } = await q;
    if (error) throw new Error(error.message);
    const ids = (issues as IssueRow[]).map((i) => i.id);
    const { data: stories } = ids.length ? await sb.from("weekly_stories").select("*").in("issue_id", ids).order("position") : { data: [] as StoryRow[] };
    return (issues as IssueRow[]).map((i) => {
      const mine = ((stories ?? []) as StoryRow[]).filter((s) => s.issue_id === i.id).map((s) => s.data);
      const draft: IssueDraft = { vol: i.vol, range_start: i.range_start, range_end: i.range_end, lede: i.data.lede ?? "", ledeEn: i.data.ledeEn ?? "", stories: [mine[0] ?? emptyStory(), mine[1] ?? emptyStory(), mine[2] ?? emptyStory()] };
      return { id: i.id, position: 0, status: i.status, deleted_at: i.deleted_at, updated_at: i.updated_at, data: draft } as Row<IssueDraft>;
    });
  },
  async save(row) {
    const sb = getSupabase();
    const d = row.data;
    const payload = { vol: d.vol, range_start: d.range_start, range_end: d.range_end, data: { lede: d.lede, ledeEn: d.ledeEn }, status: row.status };
    const q = row.id ? sb.from("weekly_issues").update(payload).eq("id", row.id) : sb.from("weekly_issues").insert(payload);
    const { data: issue, error } = await q.select("*").single();
    if (error) throw new Error(error.code === "23505" ? `第 ${d.vol} 期已經存在` : error.message);
    const issueId = (issue as IssueRow).id;
    for (const [i, story] of d.stories.entries()) {
      const { error: se } = await sb.from("weekly_stories").upsert({ issue_id: issueId, position: i + 1, data: story }, { onConflict: "issue_id,position" });
      if (se) throw new Error(se.message);
    }
    return { id: issueId, position: 0, status: row.status, deleted_at: null, updated_at: (issue as IssueRow).updated_at, data: d } as Row<IssueDraft>;
  },
  async reorder() { /* 週報依期數排序，不手動排 */ },
  async softDelete(id) { const { error } = await getSupabase().from("weekly_issues").update({ deleted_at: new Date().toISOString() }).eq("id", id); if (error) throw new Error(error.message); },
  async restore(id) { const { error } = await getSupabase().from("weekly_issues").update({ deleted_at: null }).eq("id", id); if (error) throw new Error(error.message); },
};

// 新增一期時的預設：下一個期數、上一期結束日的隔天起七天
export function suggestNext(issues: Row<IssueDraft>[]) {
  const latest = issues[0];
  const vol = (latest?.data.vol ?? 0) + 1;
  const start = latest ? addDays(latest.data.range_end, 1) : new Date().toISOString().slice(0, 10);
  return { vol, start, end: addDays(start, 6) };
}
function addDays(iso: string, n: number) {
  const d = new Date(`${iso}T00:00:00Z`); d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

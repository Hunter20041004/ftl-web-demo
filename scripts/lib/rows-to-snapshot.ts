// DB 列 → 前台快照。純函式，沒有 I/O，所以能用假資料測。
import { parseSnapshot, type Snapshot } from "../../src/lib/content.schema.ts";

export type Rows = {
  settings: Array<{ id: string; data: unknown }>;
  events: Array<{ id: string; semester: string; week: number; date: string; kind: string; position: number; data: unknown }>;
  resources: Array<{ id: string; kind: string; deadline: string | null; position: number; data: unknown }>;
  projects: Array<{ id: string; position: number; data: unknown }>;
  papers: Array<{ id: string; year: number; data: unknown }>;
  partners: Array<{ id: string; position: number; data: unknown }>;
  weekly_issues: Array<{ id: string; vol: number; range_start: string; range_end: string; data: unknown }>;
  weekly_stories: Array<{ id: string; issue_id: string; position: number; data: unknown }>;
};

type Obj = Record<string, unknown>;
const obj = (x: unknown): Obj => (x && typeof x === "object" ? (x as Obj) : {});
const mmdd = (iso: string) => `${iso.slice(5, 7)}/${iso.slice(8, 10)}`;

export function rowsToSnapshot(rows: Rows, opts: { today: string; generatedAt: string }): Snapshot {
  const settings = obj(rows.settings.find((s) => s.id === "default")?.data);
  const semester = obj(settings.semester);
  const code = String(semester.code ?? "");

  const events = rows.events.filter((e) => e.semester === code).sort((a, b) => a.week - b.week || a.position - b.position);
  const calendar = events.map((e) => {
    const { lecture: _l, workshop: _w, book: _b, ...rest } = obj(e.data);
    return { week: e.week, date: e.date, kind: e.kind, ...rest };
  });
  const lectures = events.filter((e) => e.kind === "lecture").map((e) => ({ week: e.week, date: e.date, ...obj(obj(e.data).lecture) }));
  const workshops = events.filter((e) => e.kind === "workshop").map((e) => ({ week: e.week, date: e.date, ...obj(obj(e.data).workshop) }));
  const books = events.filter((e) => e.kind === "reading").map((e) => ({ week: e.week, date: e.date, ...obj(obj(e.data).book) }));

  const resources = rows.resources
    .filter((r) => r.kind !== "book" && (!r.deadline || r.deadline >= opts.today))
    .sort((a, b) => a.position - b.position)
    .map((r) => r.data);

  const projectDecks = [...rows.projects].sort((a, b) => a.position - b.position).map((p) => p.data);
  const papers = [...rows.papers].sort((a, b) => b.year - a.year).map((p) => p.data);
  const partners = [...rows.partners].sort((a, b) => a.position - b.position).map((p) => p.data);

  const storiesByIssue = new Map<string, Rows["weekly_stories"]>();
  for (const s of rows.weekly_stories) storiesByIssue.set(s.issue_id, [...(storiesByIssue.get(s.issue_id) ?? []), s]);
  const weekly = [...rows.weekly_issues].sort((a, b) => b.vol - a.vol).map((issue) => {
    const stories = (storiesByIssue.get(issue.id) ?? []).sort((a, b) => a.position - b.position).map((s) => obj(s.data));
    const data = obj(issue.data);
    return {
      vol: issue.vol,
      range: `${mmdd(issue.range_start)} – ${mmdd(issue.range_end)}`,
      year: Number(issue.range_start.slice(0, 4)),
      headlines: stories.map((s) => s.headline),
      headlinesEn: stories.map((s) => s.headlineEn),
      lede: data.lede, ledeEn: data.ledeEn,
      stories: stories.map(({ headline: _h, headlineEn: _e, ...rest }) => rest),
    };
  });

  return parseSnapshot({
    generatedAt: opts.generatedAt,
    semester, membership: settings.membership,
    calendar, lectures, workshops, books, resources, partners, weekly, projectDecks, papers,
  });
}

// 找出快照裡所有 /media/... 圖片路徑（合作對象 logo、書封、專案封面與投影片圖）
export function collectImagePaths(snapshot: Snapshot): string[] {
  const out = new Set<string>();
  const add = (p?: string) => { if (p && p.startsWith("/media/")) out.add(p); };
  snapshot.partners.forEach((p) => add(p.logo));
  snapshot.books.forEach((b) => add(b.cover));
  snapshot.projectDecks.forEach((d) => { add(d.cover); d.slides.forEach((s) => { if (s.visual.kind === "image") add(s.visual.src); }); });
  return [...out];
}

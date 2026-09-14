// 快照 → DB 列（seed 用）。是 rows-to-snapshot 的反向；兩邊互為測試。
import type { Snapshot } from "../../src/lib/content.schema.ts";
import type { Rows } from "./rows-to-snapshot.ts";

const toMedia = (p?: string) => (p && p.startsWith("/assets/") ? p.replace("/assets/", "/media/") : p);

export function rewriteAssetPaths(s: Snapshot): Snapshot {
  return {
    ...s,
    partners: s.partners.map((p) => ({ ...p, ...(p.logo ? { logo: toMedia(p.logo)! } : {}) })),
    books: s.books.map((b) => ({ ...b, cover: toMedia(b.cover)! })),
    projectDecks: s.projectDecks.map((d) => ({
      ...d, cover: toMedia(d.cover)!,
      slides: d.slides.map((sl) => (sl.visual.kind === "image" ? { ...sl, visual: { ...sl.visual, src: toMedia(sl.visual.src)! } } : sl)) as Snapshot["projectDecks"][number]["slides"],
    })),
  };
}

const isoFromRange = (year: number, mmdd: string) => `${year}-${mmdd.slice(0, 2)}-${mmdd.slice(3, 5)}`;
// 活動日期 MM/DD → ISO：年份取學期 range 的起始年（"2026.09 – 2026.12"），月份小於起始月就算下一年（下學期跨年）
function eventIso(mmdd: string, semesterRange: string) {
  const startYear = Number(semesterRange.slice(0, 4));
  const startMonth = Number(semesterRange.slice(5, 7));
  const month = Number(mmdd.slice(0, 2));
  return `${month < startMonth ? startYear + 1 : startYear}-${mmdd.slice(0, 2)}-${mmdd.slice(3, 5)}`;
}
const omitWeekDate = <T extends { week: number; date: string }>({ week: _w, date: _d, ...rest }: T) => rest;

export function snapshotToRows(s: Snapshot): Rows {
  const lectures = new Map(s.lectures.map((l) => [l.week, l]));
  const workshops = new Map(s.workshops.map((w) => [w.week, w]));
  const books = new Map(s.books.map((b) => [b.week, b]));
  return {
    settings: [{ id: "default", data: { semester: s.semester, membership: s.membership } }],
    events: s.calendar.map((c, i) => {
      const { week, date, kind, ...rest } = c;
      const l = lectures.get(week), w = workshops.get(week), b = books.get(week);
      const detail = kind === "lecture" && l ? { lecture: omitWeekDate(l) } : kind === "workshop" && w ? { workshop: omitWeekDate(w) } : kind === "reading" && b ? { book: omitWeekDate(b) } : {};
      return { id: `${s.semester.code}-w${String(week).padStart(2, "0")}`, semester: s.semester.code, week, date: eventIso(date, s.semester.range), kind, position: i, data: { ...rest, ...detail } };
    }),
    resources: s.resources.map((r, i) => ({ id: `res-${i + 1}`, kind: r.kind, deadline: r.deadline ?? null, position: i, data: r })),
    projects: s.projectDecks.map((p, i) => ({ id: p.id, position: i, data: p })),
    papers: s.papers.map((p, i) => ({ id: `paper-${i + 1}`, year: p.year, data: p })),
    partners: s.partners.map((p, i) => ({ id: `partner-${i + 1}`, position: i, data: p })),
    weekly_issues: s.weekly.map((w) => ({ id: `vol-${w.vol}`, vol: w.vol, range_start: isoFromRange(w.year, w.range.slice(0, 5)), range_end: isoFromRange(w.year, w.range.slice(-5)), data: { lede: w.lede, ledeEn: w.ledeEn } })),
    weekly_stories: s.weekly.flatMap((w) => w.stories.map((st, i) => ({ id: `vol-${w.vol}-${i + 1}`, issue_id: `vol-${w.vol}`, position: i + 1, data: { ...st, headline: w.headlines[i], headlineEn: w.headlinesEn[i] } }))),
  };
}

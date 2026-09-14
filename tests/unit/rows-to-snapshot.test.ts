import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { rowsToSnapshot, collectImagePaths, type Rows } from "../../scripts/lib/rows-to-snapshot.ts";
import { parseSnapshot } from "../../src/lib/content.schema.ts";

// 用 repo 內的快照反推一組 DB 列，當作固定測試資料
const snap = parseSnapshot(JSON.parse(readFileSync(new URL("../../src/lib/content.snapshot.json", import.meta.url), "utf8")));

function omitWeekDate<T extends { week: number; date: string }>(x: T | undefined) {
  if (!x) throw new Error("fixture missing");
  const { week: _w, date: _d, ...rest } = x;
  return rest;
}

export function rowsFromSnapshot(): Rows {
  const lectures = new Map(snap.lectures.map((l) => [l.week, l]));
  const workshops = new Map(snap.workshops.map((w) => [w.week, w]));
  const books = new Map(snap.books.map((b) => [b.week, b]));
  return {
    settings: [{ id: "default", data: { semester: snap.semester, membership: snap.membership } }],
    events: snap.calendar.map((c, i) => {
      const { week, date, kind, ...rest } = c;
      const detail = kind === "lecture" ? { lecture: omitWeekDate(lectures.get(week)) }
        : kind === "workshop" ? { workshop: omitWeekDate(workshops.get(week)) }
        : kind === "reading" ? { book: omitWeekDate(books.get(week)) } : {};
      // DB 的 date 欄位是 ISO（YYYY-MM-DD）；前台用 MM/DD。年份取學期起始年。
      return { id: `e${i}`, semester: snap.semester.code, week, date: `${snap.semester.range.slice(0, 4)}-${date.replace("/", "-")}`, kind, position: i, data: { ...rest, ...detail } };
    }),
    resources: snap.resources.map((r, i) => ({ id: `r${i}`, kind: r.kind, deadline: r.deadline ?? null, position: i, data: r })),
    projects: snap.projectDecks.map((p, i) => ({ id: p.id, position: i, data: p })),
    articles: snap.articles.map((a, i) => ({ id: a.slug, published_at: a.date, position: i, data: a })),
    partners: snap.partners.map((p, i) => ({ id: `pa${i}`, position: i, data: p })),
    weekly_issues: snap.weekly.map((w) => ({ id: `w${w.vol}`, vol: w.vol, range_start: `${w.year}-${w.range.slice(0, 5).replace("/", "-")}`, range_end: `${w.year}-${w.range.slice(-5).replace("/", "-")}`, data: { lede: w.lede, ledeEn: w.ledeEn } })),
    weekly_stories: snap.weekly.flatMap((w) => w.stories.map((s, i) => ({ id: `w${w.vol}s${i}`, issue_id: `w${w.vol}`, position: i + 1, data: { ...s, headline: w.headlines[i], headlineEn: w.headlinesEn[i] } }))),
  };
}

test("rows round-trip to the same snapshot", () => {
  const out = rowsToSnapshot(rowsFromSnapshot(), { today: "2026-09-14", generatedAt: "2026-09-14T00:00:00Z" });
  assert.deepEqual(out.calendar, snap.calendar);
  assert.deepEqual(out.lectures, snap.lectures);
  assert.deepEqual(out.workshops, snap.workshops);
  assert.deepEqual(out.books, snap.books);
  assert.deepEqual(out.weekly, snap.weekly);
  assert.deepEqual(out.projectDecks, snap.projectDecks);
  assert.deepEqual(out.partners, snap.partners);
  assert.deepEqual(out.articles, snap.articles);
});

test("event dates come back as MM/DD even though the DB stores ISO", () => {
  const out = rowsToSnapshot(rowsFromSnapshot(), { today: "2026-09-14", generatedAt: "x" });
  assert.equal(out.calendar[0].date, "09/09");
  assert.equal(out.lectures[0].date, snap.lectures[0].date);
});

test("expired resources and other semesters are excluded", () => {
  const rows = rowsFromSnapshot();
  rows.resources.push({ id: "old", kind: "job", deadline: "2026-01-01", position: 99, data: { ...snap.resources[0], title: "過期" } });
  rows.events.push({ ...rows.events[0], id: "next", semester: "115-2" });
  const out = rowsToSnapshot(rows, { today: "2026-09-14", generatedAt: "x" });
  assert.ok(!out.resources.some((r) => r.title === "過期"));
  assert.equal(out.calendar.length, snap.calendar.length);
});

test("invalid row data fails loudly with the path", () => {
  const rows = rowsFromSnapshot();
  rows.partners[0] = { ...rows.partners[0], data: { zh: "沒英文", href: "https://x/" } };
  assert.throws(() => rowsToSnapshot(rows, { today: "2026-09-14", generatedAt: "x" }), /partners\.0\.en/);
});

test("collectImagePaths lists every /media path once", () => {
  const out = rowsToSnapshot(rowsFromSnapshot(), { today: "2026-09-14", generatedAt: "x" });
  const paths = collectImagePaths({ ...out, partners: [{ zh: "a", en: "a", href: "https://a/", logo: "/media/partners/a.png" }, { zh: "b", en: "b", href: "https://b/", logo: "/media/partners/a.png" }] });
  assert.equal(paths.filter((p) => p === "/media/partners/a.png").length, 1);
});

test("all categories empty still produces a valid snapshot", () => {
  const rows = rowsFromSnapshot();
  rows.events = []; rows.resources = []; rows.projects = []; rows.articles = []; rows.partners = []; rows.weekly_issues = []; rows.weekly_stories = [];
  const out = rowsToSnapshot(rows, { today: "2026-09-14", generatedAt: "x" });
  assert.deepEqual([out.calendar, out.resources, out.projectDecks, out.articles, out.partners, out.weekly], [[], [], [], [], [], []]);
});

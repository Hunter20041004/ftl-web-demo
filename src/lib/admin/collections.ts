// 六類內容的通用層實例＋各自的可篩選欄位。
import type { Paper, ProjectDeck, Resource } from "../content.schema.ts";
import { makeCollection } from "./collection.ts";

export const papers = makeCollection<Paper>("papers", { columns: (d) => ({ year: d.year }), hasPosition: false });
export const resources = makeCollection<Resource>("resources", { columns: (d) => ({ kind: d.kind, deadline: d.deadline || null }) });
export const projects = makeCollection<ProjectDeck>("projects");

// 活動：data 放 CalendarItem 的其餘欄位＋依類型的細節；可篩選欄位 semester/week/date/kind
export type EventData = {
  kind: "lecture" | "workshop" | "reading" | "social" | "school";
  semester: string; week: number; date: string;   // date 為 ISO（YYYY-MM-DD）
  zh: string; en: string; note?: string; noteEn?: string; counts: boolean;
  lecture?: { title: string; titleEn: string; speaker: string; speakerEn: string; role: string; roleEn: string; org: string; orgEn: string; bio: string[]; bioEn: string[]; abstract: string; abstractEn: string };
  workshop?: { title: string; titleEn: string; goal: string; goalEn: string; modules: Array<[string, string]>; modulesEn: Array<[string, string]> };
  book?: { title: string; author: string; cover: string; synopsis: string; synopsisEn: string; topics: string[] };
};
// events.data 只存 zh/en/note/noteEn/counts＋細節；semester/week/date/kind 是欄位（pull-content 從欄位讀）
export const events = makeCollection<EventData>("events", {
  columns: (d) => ({ semester: d.semester, week: d.week, date: d.date, kind: d.kind }),
});

export type WeeklyIssueData = { vol: number; range_start: string; range_end: string; lede: string; ledeEn: string };
export const weeklyIssues = makeCollection<WeeklyIssueData>("weekly_issues", {
  columns: (d) => ({ vol: d.vol, range_start: d.range_start, range_end: d.range_end }),
  hasPosition: false,
});

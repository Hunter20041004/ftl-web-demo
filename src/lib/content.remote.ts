// 六類內容＋學期設定：來自最近一次成功拉到的快照（scripts/pull-content.ts 產生）。
// 沒有 Supabase 鑰匙的環境（本機開發、fork）直接用 repo 內的這份快照，所以 npm run dev 不需要任何帳號。
import snapshotJson from "./content.snapshot.json";
import { parseSnapshot } from "./content.schema.ts";

export type { CalendarItem, Lecture, Workshop, Book, Resource, Partner, WeeklyStory, WeeklyIssue, SlideVisual, Slide, ProjectDeck, Article } from "./content.schema.ts";

const snapshot = parseSnapshot(snapshotJson);

export const semester = snapshot.semester;
export const membership = snapshot.membership;
export const calendar = snapshot.calendar;
export const lectures = snapshot.lectures;
export const workshops = snapshot.workshops;
export const books = snapshot.books;
export const resources = snapshot.resources;
export const partners = snapshot.partners;
export const weekly = snapshot.weekly;
export const projectDecks = snapshot.projectDecks;
export const articles = snapshot.articles;
export const contentGeneratedAt = snapshot.generatedAt;

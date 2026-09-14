import { z } from "zod";

// 六類內容＋學期設定的形狀。跟 content.ts 原本的 TS 型別一模一樣，前台元件才不用改。
// 命名規則：中文欄位 xxx、英文欄位 xxxEn；兩者都必填（英文版永遠完整）。

const str = z.string().min(1);

export const semesterSchema = z.object({
  code: str, range: str, meetingDay: str, meetingDayEn: str, focus: str, concept: str, conceptEn: str,
});

export const membershipSchema = z.object({
  types: z.array(z.object({ name: str, en: str, fee: str, feeEn: str, how: str, howEn: str, perks: str, perksEn: str })),
  timeline: z.array(z.object({ date: str, zh: str, en: str, done: z.boolean() })),
  reward: z.object({
    headline: str, headlineEn: str,
    tiers: z.array(z.tuple([str, str, str, str])),
    countedSessions: str, countedSessionsEn: str,
    attendance: str, attendanceEn: str,
    payout: str, payoutEn: str,
    points: str, pointsEn: str,
  }),
  faq: z.array(z.tuple([str, str, str, str])),
  payment: z.array(str), paymentEn: z.array(str),
  note: z.string().optional(),
});

export const calendarKindSchema = z.enum(["lecture", "workshop", "reading", "social", "school"]);
export const calendarItemSchema = z.object({
  week: z.number().int().min(1), date: str, kind: calendarKindSchema, zh: str, en: str,
  note: z.string().optional(), noteEn: z.string().optional(), counts: z.boolean(),
});
export const lectureSchema = z.object({
  week: z.number().int(), date: str, title: str, titleEn: str, speaker: str, speakerEn: str, role: str, roleEn: str,
  org: str, orgEn: str, bio: z.array(str), bioEn: z.array(str), abstract: str, abstractEn: str,
});
export const workshopSchema = z.object({
  week: z.number().int(), date: str, title: str, titleEn: str, goal: str, goalEn: str,
  modules: z.array(z.tuple([str, str])), modulesEn: z.array(z.tuple([str, str])),
});
export const bookSchema = z.object({
  week: z.number().int(), date: str, title: str, author: str, cover: str, synopsis: str, synopsisEn: str, topics: z.array(str),
});

export const resourceSchema = z.object({
  kind: z.enum(["job", "scholarship", "program"]), kindZh: str, kindEn: str, title: str, titleEn: str, org: str, orgEn: str,
  summary: str, summaryEn: str, details: z.array(str).optional(), detailsEn: z.array(str).optional(),
  href: z.string().optional(), contact: z.string().optional(), deadline: z.string().optional(),
});

export const partnerSchema = z.object({
  zh: str, en: str, href: str, logo: z.string().optional(), markOnly: z.boolean().optional(),
});

export const weeklySourceSchema = z.object({ label: str, labelEn: str, href: z.string().url(), primary: z.boolean() });
export const weeklyStorySchema = z.object({
  title: str, titleEn: str, lede: str, ledeEn: str, facts: z.array(str), factsEn: z.array(str),
  context: str, contextEn: str, quote: z.string().optional(), quoteEn: z.string().optional(),
  quoteBy: z.string().optional(), quoteByEn: z.string().optional(), why: str, whyEn: str, taiwan: str, taiwanEn: str,
  watch: z.array(str), watchEn: z.array(str), term: z.string().optional(), termEn: z.string().optional(),
  sources: z.array(weeklySourceSchema).min(1),
});
export const weeklyIssueSchema = z.object({
  vol: z.number().int().min(1), range: str, year: z.number().int(),
  headlines: z.tuple([str, str, str]), headlinesEn: z.tuple([str, str, str]),
  lede: str, ledeEn: str, stories: z.array(weeklyStorySchema).length(3),
});

export const slideVisualSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("image"), src: str, alt: z.string().optional() }),
  z.object({ kind: z.literal("flow"), steps: z.array(str), stepsEn: z.array(str) }),
  z.object({ kind: z.literal("stats"), items: z.array(z.tuple([str, str, str])) }),
  z.object({ kind: z.literal("list"), items: z.array(str), itemsEn: z.array(str) }),
]);
export const slideSchema = z.object({ kicker: str, kickerEn: str, title: str, titleEn: str, body: str, bodyEn: str, visual: slideVisualSchema });
export const projectDeckSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/), name: str, nameEn: str, tagline: str, taglineEn: str, tags: z.array(str), tagsEn: z.array(str),
  repo: str, demo: z.string().optional(), owner: str, ownerEn: str, status: z.enum(["done", "wip"]), cover: str,
  slides: z.tuple([slideSchema, slideSchema, slideSchema, slideSchema]),
});

export const paperSchema = z.object({
  title: str, titleEn: z.string().optional(), authors: str, authorsEn: z.string().optional(), venue: str, venueEn: z.string().optional(),
  year: z.number().int(), region: z.enum(["intl", "tw"]), summary: str, summaryEn: str, href: str,
});

export const snapshotSchema = z.object({
  generatedAt: str,
  semester: semesterSchema,
  membership: membershipSchema,
  calendar: z.array(calendarItemSchema),
  lectures: z.array(lectureSchema),
  workshops: z.array(workshopSchema),
  books: z.array(bookSchema),
  resources: z.array(resourceSchema),
  partners: z.array(partnerSchema),
  weekly: z.array(weeklyIssueSchema),
  projectDecks: z.array(projectDeckSchema),
  papers: z.array(paperSchema),
});

export type Snapshot = z.infer<typeof snapshotSchema>;
export type CalendarKind = z.infer<typeof calendarKindSchema>;
export type CalendarItem = z.infer<typeof calendarItemSchema>;
export type Lecture = z.infer<typeof lectureSchema>;
export type Workshop = z.infer<typeof workshopSchema>;
export type Book = z.infer<typeof bookSchema>;
export type Resource = z.infer<typeof resourceSchema>;
export type Partner = z.infer<typeof partnerSchema>;
export type WeeklyStory = z.infer<typeof weeklyStorySchema>;
export type WeeklyIssue = z.infer<typeof weeklyIssueSchema>;
export type SlideVisual = z.infer<typeof slideVisualSchema>;
export type Slide = z.infer<typeof slideSchema>;
export type ProjectDeck = z.infer<typeof projectDeckSchema>;
export type Paper = z.infer<typeof paperSchema>;

export function parseSnapshot(json: unknown): Snapshot {
  const result = snapshotSchema.safeParse(json);
  if (result.success) return result.data;
  const lines = result.error.issues.map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`);
  throw new Error(`content snapshot invalid:\n  ${lines.join("\n  ")}`);
}

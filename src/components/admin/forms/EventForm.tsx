"use client";

import { z } from "zod";
import { bookSchema, calendarKindSchema, lectureSchema, workshopSchema } from "@/lib/content.schema";
import type { EventData } from "@/lib/admin/collections";
import type { FormProps } from "../EntityPage";
import { BilingualField, BilingualListField, CheckField, ImageField, ListField, PairListField, SelectField, TextField } from "../fields";

export const KIND_OPTIONS = [
  { value: "lecture", label: "講座" }, { value: "workshop", label: "工作坊" }, { value: "reading", label: "英語讀書會" },
  { value: "social", label: "社團活動" }, { value: "school", label: "全校行事" },
];

// 發布驗證：基本欄位＋依類型必須有對應細節
export const eventSchema = z.object({
  kind: calendarKindSchema, semester: z.string().min(1), week: z.number().int().min(1), date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  zh: z.string().min(1), en: z.string().min(1), note: z.string().optional(), noteEn: z.string().optional(), counts: z.boolean(),
  lecture: lectureSchema.omit({ week: true, date: true }).optional(),
  workshop: workshopSchema.omit({ week: true, date: true }).optional(),
  book: bookSchema.omit({ week: true, date: true }).optional(),
}).superRefine((d, ctx) => {
  if (d.kind === "lecture" && !d.lecture) ctx.addIssue({ code: "custom", path: ["lecture"], message: "講座要填講者資料" });
  if (d.kind === "workshop" && !d.workshop) ctx.addIssue({ code: "custom", path: ["workshop"], message: "工作坊要填目標與模組" });
  if (d.kind === "reading" && !d.book) ctx.addIssue({ code: "custom", path: ["book"], message: "讀書會要填書" });
});

export const emptyEvent = (semester: string): EventData => ({ kind: "social", semester, week: 1, date: "", zh: "", en: "", counts: false });

const emptyLecture = () => ({ title: "", titleEn: "", speaker: "", speakerEn: "", role: "", roleEn: "", org: "", orgEn: "", bio: [], bioEn: [], abstract: "", abstractEn: "" });
const emptyWorkshop = () => ({ title: "", titleEn: "", goal: "", goalEn: "", modules: [], modulesEn: [] });
const emptyBook = () => ({ title: "", author: "", cover: "", synopsis: "", synopsisEn: "", topics: [] });

export function EventForm({ data, setData, errors }: FormProps<EventData>) {
  const set = <K extends keyof EventData>(k: K, v: EventData[K]) => setData((d) => ({ ...d, [k]: v }));
  const setKind = (kind: EventData["kind"]) => setData((d) => ({
    ...d, kind,
    lecture: kind === "lecture" ? d.lecture ?? emptyLecture() : undefined,
    workshop: kind === "workshop" ? d.workshop ?? emptyWorkshop() : undefined,
    book: kind === "reading" ? d.book ?? emptyBook() : undefined,
  }));
  const L = data.lecture, W = data.workshop, B = data.book;
  const setL = (p: Partial<NonNullable<EventData["lecture"]>>) => setData((d) => ({ ...d, lecture: { ...(d.lecture ?? emptyLecture()), ...p } }));
  const setW = (p: Partial<NonNullable<EventData["workshop"]>>) => setData((d) => ({ ...d, workshop: { ...(d.workshop ?? emptyWorkshop()), ...p } }));
  const setB = (p: Partial<NonNullable<EventData["book"]>>) => setData((d) => ({ ...d, book: { ...(d.book ?? emptyBook()), ...p } }));

  return (
    <>
      <div className="grid gap-3 md:grid-cols-4">
        <SelectField id="kind" label="類型" value={data.kind} onChange={(v) => setKind(v as EventData["kind"])} error={errors.kind} options={KIND_OPTIONS} />
        <TextField id="semester" label="學期" value={data.semester} onChange={(v) => set("semester", v.trim())} error={errors.semester} placeholder="115-1" hint="要跟學期設定的代號一樣才會上前台" />
        <TextField id="week" label="週次" type="number" value={data.week} onChange={(v) => set("week", Number(v))} error={errors.week} />
        <TextField id="date" label="日期" type="date" value={data.date} onChange={(v) => set("date", v)} error={errors.date} />
      </div>
      <BilingualField id="zh" label="活動名稱" zh={data.zh} en={data.en} onZh={(v) => set("zh", v)} onEn={(v) => set("en", v)} errors={{ zh: errors.zh ?? "", zhEn: errors.en ?? "" }} />
      <BilingualField id="note" label="一行說明" zh={data.note} en={data.noteEn} onZh={(v) => set("note", v || undefined)} onEn={(v) => set("noteEn", v || undefined)} errors={errors} placeholderZh="例如：幹部群／客座講師帶領實作" />
      <CheckField id="counts" label="計入出席獎勵金" checked={data.counts} onChange={(v) => set("counts", v)} />

      {data.kind === "lecture" && L ? (
        <fieldset className="grid gap-3 rounded-2xl bg-white/60 p-4 shadow-[var(--glass-hi),var(--shadow-soft)]">
          <legend className="px-1 text-sm font-semibold text-primary">講座</legend>
          {errors.lecture ? <p className="text-xs text-destructive">{errors.lecture}</p> : null}
          <BilingualField id="lecture.title" label="講題" zh={L.title} en={L.titleEn} onZh={(v) => setL({ title: v })} onEn={(v) => setL({ titleEn: v })} errors={errors} />
          <BilingualField id="lecture.speaker" label="講者" zh={L.speaker} en={L.speakerEn} onZh={(v) => setL({ speaker: v })} onEn={(v) => setL({ speakerEn: v })} errors={errors} />
          <BilingualField id="lecture.role" label="職稱" zh={L.role} en={L.roleEn} onZh={(v) => setL({ role: v })} onEn={(v) => setL({ roleEn: v })} errors={errors} />
          <BilingualField id="lecture.org" label="單位" zh={L.org} en={L.orgEn} onZh={(v) => setL({ org: v })} onEn={(v) => setL({ orgEn: v })} errors={errors} />
          <BilingualField id="lecture.abstract" label="摘要" zh={L.abstract} en={L.abstractEn} onZh={(v) => setL({ abstract: v })} onEn={(v) => setL({ abstractEn: v })} errors={errors} multiline />
          <BilingualListField id="lecture.bio" label="簡歷" zh={L.bio} en={L.bioEn} onZh={(v) => setL({ bio: v })} onEn={(v) => setL({ bioEn: v })} errors={errors} hint="一行一條，例如「學歷｜政大財管」" />
        </fieldset>
      ) : null}
      {data.kind === "workshop" && W ? (
        <fieldset className="grid gap-3 rounded-2xl bg-white/60 p-4 shadow-[var(--glass-hi),var(--shadow-soft)]">
          <legend className="px-1 text-sm font-semibold text-primary">工作坊</legend>
          {errors.workshop ? <p className="text-xs text-destructive">{errors.workshop}</p> : null}
          <BilingualField id="workshop.title" label="題目" zh={W.title} en={W.titleEn} onZh={(v) => setW({ title: v })} onEn={(v) => setW({ titleEn: v })} errors={errors} />
          <BilingualField id="workshop.goal" label="核心目標" zh={W.goal} en={W.goalEn} onZh={(v) => setW({ goal: v })} onEn={(v) => setW({ goalEn: v })} errors={errors} multiline />
          <div className="grid gap-3 md:grid-cols-2">
            <PairListField id="workshop.modules" label="模組（中文）" value={W.modules} onChange={(v) => setW({ modules: v })} error={errors["workshop.modules"]} />
            <PairListField id="workshop.modulesEn" label="模組（英文）" value={W.modulesEn} onChange={(v) => setW({ modulesEn: v })} error={errors["workshop.modulesEn"]} />
          </div>
        </fieldset>
      ) : null}
      {data.kind === "reading" && B ? (
        <fieldset className="grid gap-3 rounded-2xl bg-white/60 p-4 shadow-[var(--glass-hi),var(--shadow-soft)]">
          <legend className="px-1 text-sm font-semibold text-primary">英語讀書會的書</legend>
          {errors.book ? <p className="text-xs text-destructive">{errors.book}</p> : null}
          <div className="grid gap-3 md:grid-cols-2">
            <TextField id="book.title" label="書名（英文原名）" value={B.title} onChange={(v) => setB({ title: v })} error={errors["book.title"]} />
            <TextField id="book.author" label="作者" value={B.author} onChange={(v) => setB({ author: v })} error={errors["book.author"]} />
          </div>
          <ImageField id="book.cover" label="書封" value={B.cover || undefined} onChange={(v) => setB({ cover: v ?? "" })} folder="books" maxEdge={600} error={errors["book.cover"]} />
          <BilingualField id="book.synopsis" label="簡介" zh={B.synopsis} en={B.synopsisEn} onZh={(v) => setB({ synopsis: v })} onEn={(v) => setB({ synopsisEn: v })} errors={errors} multiline />
          <ListField id="book.topics" label="主題（英文）" value={B.topics} onChange={(v) => setB({ topics: v })} error={errors["book.topics"]} hint="一行一條，前台顯示英文" />
        </fieldset>
      ) : null}
    </>
  );
}

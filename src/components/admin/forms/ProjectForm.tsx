"use client";

import type { ProjectDeck, Slide, SlideVisual } from "@/lib/content.schema";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { FormProps } from "../EntityPage";
import { BilingualField, BilingualListField, Err, ImageField, SelectField, TextField } from "../fields";

const KICKERS: Array<[string, string]> = [["痛點", "Pain point"], ["解法", "Solution"], ["產品", "Product"], ["影響", "Impact"]];
const emptySlide = (i: number): Slide => ({ kicker: KICKERS[i][0], kickerEn: KICKERS[i][1], title: "", titleEn: "", body: "", bodyEn: "", visual: { kind: "list", items: [], itemsEn: [] } });

export const emptyProject = (): ProjectDeck => ({
  id: "", name: "", nameEn: "", tagline: "", taglineEn: "", tags: [], tagsEn: [], repo: "", owner: "社員專案", ownerEn: "Member project", status: "done", cover: "",
  slides: [emptySlide(0), emptySlide(1), emptySlide(2), emptySlide(3)],
});

export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// 視覺的文字表示：flow／list 一行一條；stats 一行「數字｜中文說明｜英文說明」
function visualToText(v: SlideVisual): { a: string; b: string } {
  if (v.kind === "flow") return { a: v.steps.join("\n"), b: v.stepsEn.join("\n") };
  if (v.kind === "list") return { a: v.items.join("\n"), b: v.itemsEn.join("\n") };
  if (v.kind === "stats") return { a: v.items.map((t) => t.join("｜")).join("\n"), b: "" };
  return { a: v.src, b: v.alt ?? "" };
}
const lines = (t: string) => t.split("\n").map((s) => s.trim()).filter(Boolean);

export function ProjectForm({ data, setData, errors, isNew }: FormProps<ProjectDeck>) {
  const set = <K extends keyof ProjectDeck>(k: K, v: ProjectDeck[K]) => setData((d) => ({ ...d, [k]: v }));
  const setSlide = (i: number, patch: Partial<Slide>) => setData((d) => ({ ...d, slides: d.slides.map((s, j) => (j === i ? { ...s, ...patch } : s)) as ProjectDeck["slides"] }));
  const setVisual = (i: number, visual: SlideVisual) => setSlide(i, { visual });

  return (
    <>
      <div className="grid gap-3 md:grid-cols-2">
        <TextField id="id" label="網址代號" value={data.id} onChange={(v) => set("id", slugify(v))} error={errors.id} placeholder="course-scheduler" hint={isNew ? "只能小寫英數與連字號；發布後不要改" : "發布後不要改"} />
        <SelectField id="status" label="狀態" value={data.status} onChange={(v) => set("status", v as ProjectDeck["status"])} error={errors.status} options={[{ value: "done", label: "已完成" }, { value: "wip", label: "進行中" }]} />
      </div>
      <BilingualField id="name" label="名稱" zh={data.name} en={data.nameEn} onZh={(v) => set("name", v)} onEn={(v) => set("nameEn", v)} errors={errors} />
      <BilingualField id="tagline" label="一句話" zh={data.tagline} en={data.taglineEn} onZh={(v) => set("tagline", v)} onEn={(v) => set("taglineEn", v)} errors={errors} />
      <BilingualField id="owner" label="負責人" zh={data.owner} en={data.ownerEn} onZh={(v) => set("owner", v)} onEn={(v) => set("ownerEn", v)} errors={errors} placeholderZh="社員專案" />
      <BilingualListField id="tags" label="標籤" zh={data.tags} en={data.tagsEn} onZh={(v) => set("tags", v)} onEn={(v) => set("tagsEn", v)} errors={errors} />
      <div className="grid gap-3 md:grid-cols-2">
        <TextField id="repo" label="GitHub" value={data.repo} onChange={(v) => set("repo", v)} error={errors.repo} placeholder="https://github.com/…" />
        <TextField id="demo" label="Demo" value={data.demo} onChange={(v) => set("demo", v || undefined)} error={errors.demo} placeholder="可留空" />
      </div>
      <ImageField id="cover" label="封面圖" value={data.cover || undefined} onChange={(v) => set("cover", v ?? "")} folder="projects" maxEdge={1200} error={errors.cover} />

      <h3 className="mt-2 text-base font-bold">四張投影片</h3>
      {data.slides.map((slide, i) => {
        const vt = visualToText(slide.visual);
        const e = (k: string) => errors[`slides.${i}.${k}`];
        return (
          <fieldset key={i} data-testid={`slide-${i}`} className="grid gap-3 rounded-2xl bg-white/60 p-4 shadow-[var(--glass-hi),var(--shadow-soft)]">
            <legend className="px-1 text-sm font-semibold text-primary">{i + 1}. {slide.kicker} <span className="font-normal text-muted-foreground">/ {slide.kickerEn}</span></legend>
            <BilingualField id={`slides.${i}.title`} label="標題" zh={slide.title} en={slide.titleEn} onZh={(v) => setSlide(i, { title: v })} onEn={(v) => setSlide(i, { titleEn: v })} errors={errors} />
            <BilingualField id={`slides.${i}.body`} label="內文" zh={slide.body} en={slide.bodyEn} onZh={(v) => setSlide(i, { body: v })} onEn={(v) => setSlide(i, { bodyEn: v })} errors={errors} multiline />
            <SelectField id={`slides.${i}.visual.kind`} label="視覺類型" value={slide.visual.kind} error={e("visual.kind") ?? e("visual")}
              onChange={(kind) => setVisual(i, kind === "image" ? { kind, src: "" } : kind === "flow" ? { kind, steps: [], stepsEn: [] } : kind === "stats" ? { kind, items: [] } : { kind: "list", items: [], itemsEn: [] })}
              options={[{ value: "image", label: "圖片" }, { value: "flow", label: "流程（步驟）" }, { value: "stats", label: "數字" }, { value: "list", label: "清單" }]} />
            {slide.visual.kind === "image" ? (
              <div className="grid gap-2">
                <ImageField id={`slides.${i}.visual.src`} label="投影片圖片" value={slide.visual.src || undefined} onChange={(v) => setVisual(i, { kind: "image", src: v ?? "" })} folder="projects" maxEdge={1200} error={e("visual.src")} />
                {data.cover ? <div><Button type="button" variant="ghost" size="sm" onClick={() => setVisual(i, { kind: "image", src: data.cover })}>用封面圖</Button></div> : null}
              </div>
            ) : slide.visual.kind === "stats" ? (
              <div className="grid gap-1.5" data-field={`slides.${i}.visual.items`}>
                <Label htmlFor={`slides.${i}.stats`}>數字</Label>
                <Textarea id={`slides.${i}.stats`} rows={3} value={vt.a} className="rounded-xl bg-white/80" placeholder="數字｜中文說明｜英文說明，一行一組"
                  onChange={(ev) => setVisual(i, { kind: "stats", items: lines(ev.target.value).map((l) => { const p = l.split("｜").map((s) => s.trim()); return [p[0] ?? "", p[1] ?? "", p[2] ?? ""]; }) })} />
                <p className="text-xs text-muted-foreground">一行一組，用全形「｜」隔開：數字｜中文說明｜英文說明</p>
                <Err msg={e("visual.items")} />
              </div>
            ) : (
              <BilingualListField id={`slides.${i}.visual.${slide.visual.kind === "flow" ? "steps" : "items"}`} label={slide.visual.kind === "flow" ? "步驟" : "清單"} zh={lines(vt.a)} en={lines(vt.b)} errors={errors}
                onZh={(v) => setVisual(i, slide.visual.kind === "flow" ? { kind: "flow", steps: v, stepsEn: lines(vt.b) } : { kind: "list", items: v, itemsEn: lines(vt.b) })}
                onEn={(v) => setVisual(i, slide.visual.kind === "flow" ? { kind: "flow", steps: lines(vt.a), stepsEn: v } : { kind: "list", items: lines(vt.a), itemsEn: v })} />
            )}
          </fieldset>
        );
      })}
    </>
  );
}

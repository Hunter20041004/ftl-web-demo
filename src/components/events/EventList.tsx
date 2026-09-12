"use client";

import { useEffect, useRef, useState } from "react";
import { books, calendar, calendarKinds, lectures, workshops, type CalendarItem } from "@/lib/content";
import { SplitTitle } from "@/components/ui/SplitTitle";
import { withBasePath } from "@/lib/site-data";

function Icon({ name }: { name: string }) {
  return (
    <svg className="icon" aria-hidden="true">
      <use href={`#i-${name}`} />
    </svg>
  );
}

// 活動列表：點一列就在對話框裡看那一場的完整資訊（講座＝講者與摘要、工作坊＝目標與模組、讀書會＝書與討論題）。
function Detail({ item }: { item: CalendarItem }) {
  const lecture = lectures.find((l) => l.week === item.week);
  const workshop = workshops.find((w) => w.week === item.week);
  const book = books.find((b) => b.week === item.week);
  return (
    <div className="event-detail">
      <div className="card__top">
        <span className={calendarKinds[item.kind].tag} data-en={calendarKinds[item.kind].en} suppressHydrationWarning>{calendarKinds[item.kind].zh}</span>
        <span className="card__index num">Week {String(item.week).padStart(2, "0")} · {item.date} · <span data-en="Wednesday" suppressHydrationWarning>週三</span></span>
      </div>
      <h3 className="h2"><SplitTitle text={item.zh} en={item.en} /></h3>
      {lecture ? (
        <>
          <p className="lecture__speaker"><b className="grad-text" data-en={lecture.speakerEn} suppressHydrationWarning>{lecture.speaker}</b>　<span data-en={`${lecture.roleEn}, ${lecture.orgEn}`} suppressHydrationWarning>{`${lecture.role}，${lecture.org}`}</span></p>
          <p className="card__body" data-en={lecture.abstractEn} suppressHydrationWarning>{lecture.abstract}</p>
          <ul className="bio">{lecture.bio.map((line, i) => <li key={line} data-en={lecture.bioEn[i]} suppressHydrationWarning>{line}</li>)}</ul>
        </>
      ) : null}
      {workshop ? (
        <>
          <p className="card__body"><b data-en="Goal｜" suppressHydrationWarning>核心目標｜</b><span data-en={workshop.goalEn} suppressHydrationWarning>{workshop.goal}</span></p>
          <ul className="bullets-plain">{workshop.modules.map(([name, body], i) => <li key={name}><b data-en={workshop.modulesEn[i][0]} suppressHydrationWarning>{name}</b>　<span data-en={workshop.modulesEn[i][1]} suppressHydrationWarning>{body}</span></li>)}</ul>
          <p className="card__body" data-en={item.noteEn} suppressHydrationWarning>{item.note}</p>
        </>
      ) : null}
      {book ? (
        <div className="event-detail__book">
          {/* eslint-disable-next-line @next/next/no-img-element -- 書封，靜態檔 */}
          <img className="book__cover" src={withBasePath(book.cover)} alt="" />
          <div>
            <p className="dim en">{book.author}</p>
            <p className="card__body" data-en={book.synopsisEn} suppressHydrationWarning>{book.synopsis}</p>
            <ul className="bullets-plain en">{book.topics.map((t) => <li key={t}>{t}</li>)}</ul>
            <p className="card__body" data-en={item.noteEn} suppressHydrationWarning>{item.note}</p>
          </div>
        </div>
      ) : null}
      {!lecture && !workshop && !book ? <p className="card__body" data-en={item.noteEn} suppressHydrationWarning>{item.note}</p> : null}
      {item.counts ? <p className="counts"><Icon name="check" /><span data-en="Counts toward the attendance reward" suppressHydrationWarning>計入出席獎勵金</span></p> : null}
    </div>
  );
}

export function EventList() {
  const [open, setOpen] = useState<CalendarItem | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const onNativeClose = () => { if (!dialogRef.current?.open) setOpen(null); };

  return (
    <>
      <div className="rows" id="event-list" data-stagger="">
        {calendar.map((item) => {
          const muted = item.kind === "school";
          const Tag = muted ? "div" : "button";
          return (
            <Tag
              key={item.week}
              className={`row reveal${muted ? " row--muted" : " row--button"}`}
              data-cat={item.kind}
              data-event={item.week}
              {...(muted ? {} : { type: "button" as const, onClick: () => setOpen(item) })}
            >
              <span className="row__date num"><b>{item.date}</b><span>W{String(item.week).padStart(2, "0")}</span></span>
              <div className="row__main">
                <div className="row__title" data-en={item.en} suppressHydrationWarning>{item.zh}</div>
                <div className="row__meta"><span className={calendarKinds[item.kind].tag} data-en={calendarKinds[item.kind].en} suppressHydrationWarning>{calendarKinds[item.kind].zh}</span><span data-en={item.noteEn} suppressHydrationWarning>{item.note}</span></div>
              </div>
              <span className="row__side">
                {item.counts ? <span className="counts" title="計入出席獎勵金"><Icon name="check" /><span data-en="Counts" suppressHydrationWarning>計入</span></span> : null}
                {!muted ? <Icon name="chevron-right" /> : null}
              </span>
            </Tag>
          );
        })}
      </div>
      <div className="empty" id="event-empty" data-show="false"><Icon name="calendar" /><p data-en="Nothing in this category." suppressHydrationWarning>這個類型沒有場次。</p></div>
      <dialog ref={dialogRef} className="project-dialog" onClose={onNativeClose} onClick={(e) => { if (e.target === e.currentTarget) setOpen(null); }}>
        {open ? (
          <div className="project-dialog__inner">
            <button type="button" className="week__btn project-dialog__close" aria-label="關閉" onClick={() => setOpen(null)}><Icon name="close" /></button>
            <Detail item={open} />
          </div>
        ) : null}
      </dialog>
    </>
  );
}

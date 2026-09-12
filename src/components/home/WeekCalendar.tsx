"use client";

import { useState, useSyncExternalStore } from "react";
import { calendar, calendarKinds, membership } from "@/lib/content";

// 首頁「重要時程」：一週七天（週一到週日）的日曆，每次載入依今天的日期算出本週，
// 所以每週自動換頁。資料來自 content.ts 的行事曆與招募時程（都是 2026 年）。
// 靜態匯出沒有伺服器，所以「今天」在瀏覽器端算；SSR 先畫出開學那一週，載入後再換成本週。

type DayItem = { label: string; labelEn?: string; kind: string; kindEn: string; tagClass: string };

const YEAR = 2026;
const DAY_NAMES = ["一", "二", "三", "四", "五", "六", "日"];
const DAY_NAMES_EN = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function parseMonthDay(mmdd: string) {
  const [m, d] = mmdd.split("/").map(Number);
  return new Date(YEAR, m - 1, d);
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function mondayOf(date: Date) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const offset = (d.getDay() + 6) % 7; // 週一＝0
  d.setDate(d.getDate() - offset);
  return d;
}

// 把兩份資料攤平成「某一天有什麼」。
function buildItems(): Array<{ date: Date; item: DayItem }> {
  const out: Array<{ date: Date; item: DayItem }> = [];
  for (const entry of calendar) {
    if (entry.kind === "school") continue;
    out.push({ date: parseMonthDay(entry.date), item: { label: entry.zh, labelEn: entry.en, kind: calendarKinds[entry.kind].zh, kindEn: calendarKinds[entry.kind].en, tagClass: calendarKinds[entry.kind].tag } });
  }
  // 招募的長區間（書審 09/07 – 09/17）只標開始與截止兩天，不然一整排都是同一句
  for (const step of membership.timeline) {
    const [start, end] = step.date.split("–").map((s) => s.trim());
    const from = parseMonthDay(start);
    if (!end) {
      out.push({ date: from, item: { label: step.zh, labelEn: step.en, kind: "招募", kindEn: "Recruitment", tagClass: "tag tag--ok" } });
      continue;
    }
    const to = parseMonthDay(end);
    // 拿掉開頭的括號註記（「（六、日）晚上面試」→「晚上面試」）
    const short = step.zh.replace(/^（.*?）/, "");
    const days = Math.round((to.getTime() - from.getTime()) / 86400000) + 1;
    if (days <= 2) {
      // 兩天內的區間（例如週末面試）每天都標同一句
      for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
        out.push({ date: new Date(d), item: { label: short, labelEn: step.en, kind: "招募", kindEn: "Recruitment", tagClass: "tag tag--ok" } });
      }
      continue;
    }
    out.push({ date: from, item: { label: `${short}開始`, labelEn: `${step.en} open`, kind: "招募", kindEn: "Recruitment", tagClass: "tag tag--ok" } });
    out.push({ date: to, item: { label: `${short}截止`, labelEn: `${step.en} close`, kind: "招募", kindEn: "Recruitment", tagClass: "tag tag--ok" } });
  }
  return out;
}

const ITEMS = buildItems();
const SEMESTER_START = parseMonthDay("09/09");

// 「今天」用 useSyncExternalStore 拿：伺服器端（靜態匯出）回傳開學日，瀏覽器端回傳真正的今天，
// 不會有 hydration 不一致，也不用在 effect 裡 setState。
const noop = () => () => {};
function useToday() {
  const key = useSyncExternalStore(noop, () => new Date().toDateString(), () => SEMESTER_START.toDateString());
  return new Date(key);
}

// 可以往前翻 3 週、往後翻 6 週
const MIN_OFFSET = -3;
const MAX_OFFSET = 6;

export function WeekCalendar() {
  const today = useToday();
  const [offset, setOffset] = useState(0);

  const monday = mondayOf(today);
  monday.setDate(monday.getDate() + offset * 7);
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return { date, items: ITEMS.filter((entry) => sameDay(entry.date, date)).map((entry) => entry.item) };
  });
  const sunday = days[6].date;
  const fmt = (d: Date) => `${d.getMonth() + 1}/${String(d.getDate()).padStart(2, "0")}`;
  const isEmptyWeek = days.every((day) => day.items.length === 0);
  const next = ITEMS.filter((entry) => entry.date > sunday).sort((a, b) => a.date.getTime() - b.date.getTime())[0];
  // 翻到別週時 key 換掉，格子重新進場，看得出來換頁了

  return (
    <div className="week" data-week-start={fmt(monday)} data-week-offset={offset}>
      <div className="week__bar">
        <p className="week__range num">{fmt(monday)} – {fmt(sunday)}{offset === 0 ? <span className="week__now" data-en="This week">本週</span> : null}</p>
        <div className="week__nav">
          <button type="button" className="week__btn" data-week-nav="prev" aria-label="上一週" disabled={offset <= MIN_OFFSET} onClick={() => setOffset((o) => Math.max(MIN_OFFSET, o - 1))}>‹</button>
          <button type="button" className="week__btn week__btn--text" data-week-nav="today" disabled={offset === 0} onClick={() => setOffset(0)} data-en="Today">回到本週</button>
          <button type="button" className="week__btn" data-week-nav="next" aria-label="下一週" disabled={offset >= MAX_OFFSET} onClick={() => setOffset((o) => Math.min(MAX_OFFSET, o + 1))}>›</button>
        </div>
      </div>
      <ol className="week__grid" key={fmt(monday)}>
        {days.map((day, i) => (
          <li className={`week__day${sameDay(day.date, today) ? " week__day--today" : ""}${day.items.length ? "" : " week__day--empty"}`} key={i}>
            <span className="week__head"><b data-en={DAY_NAMES_EN[i]}>週{DAY_NAMES[i]}</b><span className="num">{fmt(day.date)}</span></span>
            <ul className="week__items">
              {day.items.map((item) => (
                <li key={item.label}><span className={item.tagClass} data-en={item.kindEn}>{item.kind}</span><span data-en={item.labelEn}>{item.label}</span></li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
      {isEmptyWeek && next ? (
        <p className="week__next" data-en={`Nothing this week. Next: ${fmt(next.date)} ${next.item.labelEn ?? next.item.label}`}>本週沒有排程。下一項：{fmt(next.date)} {next.item.label}</p>
      ) : null}
    </div>
  );
}

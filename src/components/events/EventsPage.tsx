import { SitePageShell } from "@/components/layout/SitePageShell";
import { calendar, calendarKinds, membership, semester, type CalendarKind } from "@/lib/content";

function Icon({ name }: { name: string }) {
  return (
    <svg className="icon" aria-hidden="true">
      <use href={`#i-${name}`} />
    </svg>
  );
}

const filters: Array<[CalendarKind | "all", string, string]> = [
  ["all", "All", "全部"],
  ["lecture", "Lectures", "講座"],
  ["workshop", "Workshops", "工作坊"],
  ["reading", "English reading", "英語讀書會"],
  ["social", "Socials", "社團活動"],
];

// 活動頁：115-1 的 16 週行事曆（來自課程規劃計畫）＋ 招募時程。
export function EventsPage() {
  return (
    <SitePageShell>
      <main id="main" className="page">
        <section className="pagehead">
          <div className="wrap reveal">
            <span className="eyebrow" data-en="Events">活動</span>
            <h1 className="h1" data-en={`115-1 calendar · ${semester.meetingDayEn}`}>115-1 行事曆 · {semester.meetingDay}</h1>
            <p className="lead" data-en="Sixteen weeks from 09/09 to 12/23. Sessions marked ✓ count toward the attendance reward (11 in total).">9/09 到 12/23 共十六週。標示 ✓ 的場次計入出席獎勵金（共 11 堂）。</p>
          </div>
        </section>

        <section className="section--tight section">
          <div className="wrap">
            <div className="filters reveal" data-filter-group="" data-filter-target="#event-list" data-filter-empty="#event-empty" role="group" aria-label="活動類型篩選">
              {filters.map(([cat, en, zh], index) => (
                <button className="filter" type="button" data-filter={cat} aria-pressed={index === 0} data-en={en} key={cat}>{zh}</button>
              ))}
            </div>
            <div className="rows" id="event-list" data-stagger="">
              {calendar.map((item) => (
                <div className={`row reveal${item.kind === "school" ? " row--muted" : ""}`} data-cat={item.kind} key={item.week}>
                  <span className="row__date num"><b>{item.date}</b><span>W{String(item.week).padStart(2, "0")}</span></span>
                  <div className="row__main">
                    <div className="row__title" data-en={item.en}>{item.zh}</div>
                    <div className="row__meta"><span className={calendarKinds[item.kind].tag} data-en={calendarKinds[item.kind].en}>{calendarKinds[item.kind].zh}</span><span data-en={item.noteEn}>{item.note}</span></div>
                  </div>
                  <span className="row__side">{item.counts ? <span className="counts" title="計入出席獎勵金"><Icon name="check" /><span data-en="Counts">計入</span></span> : null}</span>
                </div>
              ))}
            </div>
            <div className="empty" id="event-empty" data-show="false"><Icon name="calendar" /><p data-en="Nothing in this category.">這個類型沒有場次。</p></div>
          </div>
        </section>

        <section className="section section--alt" id="recruit">
          <div className="wrap">
            <div className="sec-head reveal reveal--fade">
              <div><span className="eyebrow" data-en="Recruitment">招募時程</span><h2 className="h1" data-en="Project-member admissions">專案生招募</h2></div>
              <a className="link-arrow" href="/join/"><span data-en="How to apply">報名方式</span><Icon name="arrow-right" /></a>
            </div>
            <ol className="timeline-glass" data-stagger>
              {membership.timeline.map((step) => (
                <li className={`tstep reveal${step.done ? " tstep--done" : ""}`} key={step.date}>
                  <span className="tstep__date num">{step.date}</span>
                  <span className="tstep__label" data-en={step.en}>{step.zh}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>
    </SitePageShell>
  );
}

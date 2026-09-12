import { SitePageShell } from "@/components/layout/SitePageShell";
import { books, calendar, calendarKinds, chainSeries, lectures, membership, semester, workshops, type CalendarKind } from "@/lib/content";

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
            <h1 className="h1" data-en={`115-1 calendar and courses · ${semester.meetingDayEn}`}>115-1 行事曆與課程 · {semester.meetingDay}</h1>
            <p className="lead" data-en="Sixteen weeks from 09/09 to 12/23. Sessions marked ✓ count toward the attendance reward (11 in total). Course details are below the calendar.">9/09 到 12/23 共十六週。標示 ✓ 的場次計入出席獎勵金（共 11 堂）。課程內容在行事曆下方。</p>
            <div className="chips mt-5">
              <a className="chip" href="#calendar" data-en="Calendar">行事曆</a>
              <a className="chip" href="#lectures" data-en="Lectures ×3">講座 ×3</a>
              <a className="chip" href="#workshops" data-en="Workshops ×3">工作坊 ×3</a>
              <a className="chip" href="#reading" data-en="English reading ×3">英語讀書會 ×3</a>
              <a className="chip" href="#blockchain" data-en="Blockchain series">區塊鏈基礎系列</a>
            </div>
          </div>
        </section>

        <section className="section--tight section" id="calendar">
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

        <section className="section--tight section" id="lectures">
          <div className="wrap">
            <div className="sec-head reveal reveal--fade">
              <div><span className="eyebrow" data-en="Expert lectures">專家講座</span><h2 className="h1" data-en="Three lectures">三場講座</h2></div>
            </div>
            <div className="stack" style={{ gap: 18 }} data-stagger>
              {lectures.map((lecture) => (
                <article className="card card--lecture reveal reveal--rise" key={lecture.week}>
                  <div className="card__top">
                    <span className="card__index num">Week {String(lecture.week).padStart(2, "0")} · {lecture.date}</span>
                    <span className="tag" data-en="Lecture">講座</span>
                  </div>
                  <h3 className="h2">{lecture.title}</h3>
                  <p className="lecture__speaker"><b className="grad-text">{lecture.speaker}</b>　{lecture.role}，{lecture.org}</p>
                  <p className="card__body">{lecture.abstract}</p>
                  <ul className="bio">
                    {lecture.bio.map((line) => <li key={line}>{line}</li>)}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section--alt" id="workshops">
          <div className="wrap">
            <div className="sec-head reveal reveal--fade">
              <div><span className="eyebrow" data-en="Hands-on workshops">實務工作坊</span><h2 className="h1" data-en="Three workshops">三場工作坊</h2></div>
            </div>
            <div className="grid grid-3" data-stagger>
              {workshops.map((workshop) => (
                <article className="card reveal reveal--rise" key={workshop.week}>
                  <div className="card__top">
                    <span className="card__index num">Week {String(workshop.week).padStart(2, "0")} · {workshop.date}</span>
                    <span className="tag tag--cyan" data-en="Workshop">工作坊</span>
                  </div>
                  <h3 className="h3" data-en={workshop.titleEn}>{workshop.title}</h3>
                  <p className="card__body"><b>核心目標｜</b>{workshop.goal}</p>
                  <ul className="bullets-plain">
                    {workshop.modules.map(([name, body]) => <li key={name}><b>{name}</b>　{body}</li>)}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="reading">
          <div className="wrap">
            <div className="sec-head reveal reveal--fade">
              <div><span className="eyebrow" data-en="Professional English reading club">專業英語讀書會</span><h2 className="h1" data-en="Three books">三本書</h2><p className="lead mt-4" data-en="Presentations, group discussion and closing remarks are all in English.">導讀簡報、小組討論與總結發言全程使用英文。</p></div>
            </div>
            <div className="grid grid-3" data-stagger>
              {books.map((book) => (
                <article className="card reveal reveal--rise" key={book.week}>
                  <div className="card__top">
                    <span className="card__index num">Week {String(book.week).padStart(2, "0")} · {book.date}</span>
                    <span className="tag tag--warn" data-en="Reading">讀書會</span>
                  </div>
                  <h3 className="h3 en">{book.title}</h3>
                  <p className="dim en" style={{ fontSize: ".95rem" }}>{book.author}</p>
                  <p className="card__body">{book.synopsis}</p>
                  <ul className="bullets-plain en">
                    {book.topics.map((topic) => <li key={topic}>{topic}</li>)}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section--alt" id="blockchain">
          <div className="wrap">
            <div className="sec-head reveal reveal--fade">
              <div>
                <span className="eyebrow" data-en="Blockchain Foundations Series">區塊鏈基礎系列課程</span>
                <h2 className="h1" data-en="Four sessions in Chinese, one in English. No coding required.">四堂中文、一場英文。零基礎、不需程式。</h2>
                <p className="lead mt-4">社團主辦，{chainSeries.coHost}共同主辦，納入協會「{chainSeries.program}」。{chainSeries.format}</p>
              </div>
            </div>
            <div className="panel reveal" style={{ marginBottom: 24 }}>
              <dl className="info-list info-list--inline">
                <div className="info"><dt data-en="Instructor">講師</dt><dd>{chainSeries.instructor}</dd></div>
                <div className="info"><dt data-en="Audience">對象</dt><dd>{chainSeries.audience}</dd></div>
                <div className="info"><dt data-en="Dates">日期</dt><dd data-en="Chinese sessions to be announced; the English session is on 10/21.">中文場日期另行公告；英文場 10/21 社課時段。</dd></div>
              </dl>
            </div>
            <div className="stack" style={{ gap: 14 }} data-stagger>
              {chainSeries.courses.map((course) => (
                <article className="card card--row reveal reveal--rise" key={course.n}>
                  <span className="principle__n">{course.n}</span>
                  <div>
                    <h3 className="h3">{course.title}</h3>
                    <p className="keywords en">{course.keywords}</p>
                    <p className="card__body">{course.hook}</p>
                    <p className="card__body">{course.body}</p>
                    <p className="card__body"><b>體驗｜</b>{course.practice}</p>
                  </div>
                </article>
              ))}
            </div>
            <p className="note mt-6"><Icon name="alert" /><span data-en="Session dates and venue will be announced via the LINE Bot.">中文場日期與地點確定後由 LINE Bot 公告。</span></p>
          </div>
        </section>
      </main>
    </SitePageShell>
  );
}

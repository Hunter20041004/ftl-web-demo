import { SitePageShell } from "@/components/layout/SitePageShell";
import { EventList } from "@/components/events/EventList";
import { books, chainSeries, lectures, semester, workshops, type CalendarKind } from "@/lib/content";

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
            <h1 className="h1" data-en={`115-1 events · ${semester.meetingDayEn}`}>115-1 活動 · {semester.meetingDay}</h1>
            <p className="lead" data-en="09/09 – 12/23. Sessions marked ✓ count toward the attendance reward.">9/09 – 12/23。標示「計入」的場次計入出席獎勵金。</p>
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
            <EventList />
          </div>
        </section>

        <section className="section--tight section" id="lectures">
          <div className="wrap">
            <div className="sec-head reveal reveal--fade">
              <h2 className="h1" data-en="Lectures">講座</h2>
            </div>
            <div className="stack" style={{ gap: 18 }} data-stagger>
              {lectures.map((lecture) => (
                <article className="card card--lecture reveal reveal--rise" key={lecture.week}>
                  <div className="card__top">
                    <span className="card__index num">Week {String(lecture.week).padStart(2, "0")} · {lecture.date}</span>
                    <span className="tag" data-en="Lecture">講座</span>
                  </div>
                  <h3 className="h2" data-en={lecture.titleEn}>{lecture.title}</h3>
                  <p className="lecture__speaker"><b className="grad-text" data-en={lecture.speakerEn}>{lecture.speaker}</b>　<span data-en={`${lecture.roleEn}, ${lecture.orgEn}`}>{lecture.role}，{lecture.org}</span></p>
                  <p className="card__body" data-en={lecture.abstractEn}>{lecture.abstract}</p>
                  <ul className="bio">
                    {lecture.bio.map((line, i) => <li key={line} data-en={lecture.bioEn[i]}>{line}</li>)}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section--alt" id="workshops">
          <div className="wrap">
            <div className="sec-head reveal reveal--fade">
              <h2 className="h1" data-en="Workshops">工作坊</h2>
            </div>
            <div className="grid grid-3" data-stagger>
              {workshops.map((workshop) => (
                <article className="card reveal reveal--rise" key={workshop.week}>
                  <div className="card__top">
                    <span className="card__index num">Week {String(workshop.week).padStart(2, "0")} · {workshop.date}</span>
                    <span className="tag tag--cyan" data-en="Workshop">工作坊</span>
                  </div>
                  <h3 className="h3" data-en={workshop.titleEn}>{workshop.title}</h3>
                  <p className="card__body"><b data-en="Goal｜">核心目標｜</b><span data-en={workshop.goalEn}>{workshop.goal}</span></p>
                  <ul className="bullets-plain">
                    {workshop.modules.map(([name, body], i) => <li key={name}><b data-en={workshop.modulesEn[i][0]}>{name}</b>　<span data-en={workshop.modulesEn[i][1]}>{body}</span></li>)}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="reading">
          <div className="wrap">
            <div className="sec-head reveal reveal--fade">
              <div><h2 className="h1" data-en="English reading club">英語讀書會</h2><p className="lead mt-4" data-en="Conducted entirely in English.">全程英文。</p></div>
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
                  <p className="card__body" data-en={book.synopsisEn}>{book.synopsis}</p>
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
                <h2 className="h1" data-en="Blockchain Foundations Series">區塊鏈基礎系列課程</h2>
                <p className="lead mt-4" data-en={`Hosted by the society, co-hosted by ${chainSeries.coHostEn}, part of the ${chainSeries.programEn}. ${chainSeries.formatEn}`}>社團主辦，{chainSeries.coHost}共同主辦，納入協會「{chainSeries.program}」。{chainSeries.format}</p>
              </div>
            </div>
            <div className="panel reveal" style={{ marginBottom: 24 }}>
              <dl className="info-list info-list--inline">
                <div className="info"><dt data-en="Instructor">講師</dt><dd data-en={chainSeries.instructorEn}>{chainSeries.instructor}</dd></div>
                <div className="info"><dt data-en="Audience">對象</dt><dd data-en={chainSeries.audienceEn}>{chainSeries.audience}</dd></div>
                <div className="info"><dt data-en="Dates">日期</dt><dd data-en="Chinese sessions to be announced; the English session is on 10/21.">中文場日期另行公告；英文場 10/21 社課時段。</dd></div>
              </dl>
            </div>
            <details className="stack" style={{ gap: 14 }} data-stagger>
              <summary className="chip" style={{ alignSelf: "flex-start", cursor: "pointer", listStyle: "none" }} data-en="Show the five sessions">展開五堂課程內容</summary>
              {chainSeries.courses.map((course) => (
                <article className="card card--row reveal reveal--rise" key={course.n}>
                  <span className="principle__n">{course.n}</span>
                  <div>
                    <h3 className="h3" data-en={course.titleEn}>{course.title}</h3>
                    <p className="keywords en" data-en={course.keywordsEn}>{course.keywords}</p>
                    <p className="card__body" data-en={course.hookEn}>{course.hook}</p>
                    <p className="card__body" data-en={course.bodyEn}>{course.body}</p>
                    <p className="card__body"><b data-en="Hands-on｜">體驗｜</b><span data-en={course.practiceEn}>{course.practice}</span></p>
                  </div>
                </article>
              ))}
            </details>
          </div>
        </section>
      </main>
    </SitePageShell>
  );
}

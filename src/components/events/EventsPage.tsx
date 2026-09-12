import { SplitTitle } from "@/components/ui/SplitTitle";
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
            <span className="eyebrow" data-en="Events" suppressHydrationWarning>活動</span>
            <h1 className="h1" data-en={`115-1 events · ${semester.meetingDayEn}`} suppressHydrationWarning>{`115-1 活動 · ${semester.meetingDay}`}</h1>
            <p className="lead" data-en="09/09 – 12/23. Sessions marked ✓ count toward the attendance reward." suppressHydrationWarning>9/09 – 12/23。標示「計入」的場次計入出席獎勵金。</p>
            <div className="chips mt-5">
              <a className="chip" href="#calendar" data-en="Calendar" suppressHydrationWarning>行事曆</a>
              <a className="chip" href="#lectures" data-en="Lectures ×3" suppressHydrationWarning>講座 ×3</a>
              <a className="chip" href="#workshops" data-en="Workshops ×3" suppressHydrationWarning>工作坊 ×3</a>
              <a className="chip" href="#reading" data-en="English reading ×3" suppressHydrationWarning>英語讀書會 ×3</a>
              <a className="chip" href="#blockchain" data-en="Blockchain series" suppressHydrationWarning>區塊鏈基礎系列</a>
            </div>
          </div>
        </section>

        <section className="section--tight section" id="calendar">
          <div className="wrap">
            <div className="filters reveal" data-filter-group="" data-filter-target="#event-list" data-filter-empty="#event-empty" role="group" aria-label="活動類型篩選">
              {filters.map(([cat, en, zh], index) => (
                <button className="filter" type="button" data-filter={cat} aria-pressed={index === 0} data-en={en} suppressHydrationWarning key={cat}>{zh}</button>
              ))}
            </div>
            <EventList />
          </div>
        </section>

        <section className="section--tight section" id="lectures">
          <div className="wrap">
            <div className="sec-head reveal reveal--fade">
              <h2 className="h1" data-en="Lectures" suppressHydrationWarning>講座</h2>
            </div>
            <div className="stack" style={{ gap: 18 }} data-stagger>
              {lectures.map((lecture) => (
                <article className="card card--lecture reveal reveal--rise" key={lecture.week}>
                  <div className="card__top">
                    <span className="card__index num">Week {String(lecture.week).padStart(2, "0")} · {lecture.date}</span>
                    <span className="tag" data-en="Lecture" suppressHydrationWarning>講座</span>
                  </div>
                  <h3 className="h2"><SplitTitle text={lecture.title} en={lecture.titleEn} /></h3>
                  <p className="lecture__speaker"><b className="grad-text" data-en={lecture.speakerEn} suppressHydrationWarning>{lecture.speaker}</b>　<span data-en={`${lecture.roleEn}, ${lecture.orgEn}`} suppressHydrationWarning>{`${lecture.role}，${lecture.org}`}</span></p>
                  <p className="card__body" data-en={lecture.abstractEn} suppressHydrationWarning>{lecture.abstract}</p>
                  <ul className="bio">
                    {lecture.bio.map((line, i) => <li key={line} data-en={lecture.bioEn[i]} suppressHydrationWarning>{line}</li>)}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section--alt" id="workshops">
          <div className="wrap">
            <div className="sec-head reveal reveal--fade">
              <h2 className="h1" data-en="Workshops" suppressHydrationWarning>工作坊</h2>
            </div>
            <div className="grid grid-3" data-stagger>
              {workshops.map((workshop) => (
                <article className="card reveal reveal--rise" key={workshop.week}>
                  <div className="card__top">
                    <span className="card__index num">Week {String(workshop.week).padStart(2, "0")} · {workshop.date}</span>
                    <span className="tag tag--cyan" data-en="Workshop" suppressHydrationWarning>工作坊</span>
                  </div>
                  <h3 className="h3"><SplitTitle text={workshop.title} en={workshop.titleEn} /></h3>
                  <p className="card__body"><b data-en="Goal｜" suppressHydrationWarning>核心目標｜</b><span data-en={workshop.goalEn} suppressHydrationWarning>{workshop.goal}</span></p>
                  <ul className="bullets-plain">
                    {workshop.modules.map(([name, body], i) => <li key={name}><b data-en={workshop.modulesEn[i][0]} suppressHydrationWarning>{name}</b>　<span data-en={workshop.modulesEn[i][1]} suppressHydrationWarning>{body}</span></li>)}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="reading">
          <div className="wrap">
            <div className="sec-head reveal reveal--fade">
              <div><h2 className="h1" data-en="English reading club" suppressHydrationWarning>英語讀書會</h2><p className="lead mt-4" data-en="Conducted entirely in English." suppressHydrationWarning>全程英文。</p></div>
            </div>
            <div className="grid grid-3" data-stagger>
              {books.map((book) => (
                <article className="card reveal reveal--rise" key={book.week}>
                  <div className="card__top">
                    <span className="card__index num">Week {String(book.week).padStart(2, "0")} · {book.date}</span>
                    <span className="tag tag--warn" data-en="Reading" suppressHydrationWarning>讀書會</span>
                  </div>
                  <h3 className="h3 en">{book.title}</h3>
                  <p className="dim en" style={{ fontSize: ".95rem" }}>{book.author}</p>
                  <p className="card__body" data-en={book.synopsisEn} suppressHydrationWarning>{book.synopsis}</p>
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
                <h2 className="h1" data-en="Blockchain Foundations Series" suppressHydrationWarning>區塊鏈基礎系列課程</h2>
                <p className="lead mt-4" data-en={`Hosted by the society, co-hosted by ${chainSeries.coHostEn}, part of the ${chainSeries.programEn}. ${chainSeries.formatEn}`} suppressHydrationWarning>{`社團主辦，${chainSeries.coHost}共同主辦，納入協會「${chainSeries.program}」。${chainSeries.format}`}</p>
              </div>
            </div>
            <div className="panel reveal" style={{ marginBottom: 24 }}>
              <dl className="info-list info-list--inline">
                <div className="info"><dt data-en="Instructor" suppressHydrationWarning>講師</dt><dd data-en={chainSeries.instructorEn} suppressHydrationWarning>{chainSeries.instructor}</dd></div>
                <div className="info"><dt data-en="Audience" suppressHydrationWarning>對象</dt><dd data-en={chainSeries.audienceEn} suppressHydrationWarning>{chainSeries.audience}</dd></div>
                <div className="info"><dt data-en="Dates" suppressHydrationWarning>日期</dt><dd data-en="Chinese sessions to be announced; the English session is on 10/21." suppressHydrationWarning>中文場日期另行公告；英文場 10/21 社課時段。</dd></div>
              </dl>
            </div>
            <details className="stack" style={{ gap: 14 }} data-stagger>
              <summary className="chip" style={{ alignSelf: "flex-start", cursor: "pointer", listStyle: "none" }} data-en="Show the five sessions" suppressHydrationWarning>展開五堂課程內容</summary>
              {chainSeries.courses.map((course) => (
                <article className="card card--row reveal reveal--rise" key={course.n}>
                  <span className="principle__n">{course.n}</span>
                  <div>
                    <h3 className="h3"><SplitTitle text={course.title} en={course.titleEn} /></h3>
                    <p className="keywords en" data-en={course.keywordsEn} suppressHydrationWarning>{course.keywords}</p>
                    <p className="card__body" data-en={course.hookEn} suppressHydrationWarning>{course.hook}</p>
                    <p className="card__body" data-en={course.bodyEn} suppressHydrationWarning>{course.body}</p>
                    <p className="card__body"><b data-en="Hands-on｜" suppressHydrationWarning>體驗｜</b><span data-en={course.practiceEn} suppressHydrationWarning>{course.practice}</span></p>
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

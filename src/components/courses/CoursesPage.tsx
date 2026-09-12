import { SitePageShell } from "@/components/layout/SitePageShell";
import { books, chainSeries, lectures, semester, workshops } from "@/lib/content";

function Icon({ name }: { name: string }) {
  return (
    <svg className="icon" aria-hidden="true">
      <use href={`#i-${name}`} />
    </svg>
  );
}

// 課程頁：115-1 的三種社課（講座、工作坊、英語讀書會）＋ 區塊鏈基礎系列課程。
// 內容直接來自課程規劃計畫與課程企劃書，不加詮釋。
export function CoursesPage() {
  return (
    <SitePageShell>
      <main id="main" className="page">
        <section className="pagehead">
          <div className="wrap reveal">
            <span className="eyebrow" data-en="Courses">課程</span>
            <h1 className="h1" data-en={`115-1 course plan · ${semester.focus}`}>115-1 課程規劃 · {semester.focus}</h1>
            <p className="lead" data-en="Wednesdays, September to December. Three formats rotate: an industry lecture, a hands-on workshop, and an English reading session. A separate blockchain series runs outside regular hours.">9 月到 12 月的每週三，三種形式輪流：業界講座、實務工作坊、英語讀書會。另有額外時段的區塊鏈基礎系列課程。</p>
            <div className="chips mt-5">
              <a className="chip" href="#lectures" data-en="Lectures ×3">講座 ×3</a>
              <a className="chip" href="#workshops" data-en="Workshops ×3">工作坊 ×3</a>
              <a className="chip" href="#reading" data-en="English reading ×3">英語讀書會 ×3</a>
              <a className="chip" href="#blockchain" data-en="Blockchain series">區塊鏈基礎系列</a>
            </div>
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

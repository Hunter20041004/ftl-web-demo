import { SitePageShell } from "@/components/layout/SitePageShell";
import { books, chainSeries, resources } from "@/lib/content";

function Icon({ name }: { name: string }) {
  return (
    <svg className="icon" aria-hidden="true">
      <use href={`#i-${name}`} />
    </svg>
  );
}

const kindIcon: Record<string, string> = { job: "briefcase", scholarship: "sparkle", program: "rocket", news: "news" };
const kindTag: Record<string, string> = { job: "tag", scholarship: "tag tag--ok", program: "tag tag--cyan", news: "tag tag--ghost" };

// 資源頁：職缺、獎學金、計畫、產學新聞（使用者提供的連結）＋ 本學期書單。
export function ResourcesPage() {
  const job = resources.find((r) => r.kind === "job");
  const others = resources.filter((r) => r.kind !== "job");
  return (
    <SitePageShell>
      <main id="main" className="page">
        <section className="pagehead">
          <div className="wrap reveal">
            <span className="eyebrow" data-en="Resources">資源</span>
            <h1 className="h1" data-en="Jobs, scholarships and programs">職缺、獎學金與計畫</h1>
            <p className="lead" data-en="Opportunities that reach the society are posted here and pushed through the LINE Bot. Each entry links to the original source.">社團收到的機會會放在這裡，並透過 LINE Bot 推播。每一則都附原始來源。</p>
          </div>
        </section>

        <section className="section--tight section" id="jobs">
          <div className="wrap">
            <div className="sec-head reveal reveal--fade">
              <div><span className="eyebrow" data-en="Job openings">職缺</span><h2 className="h1" data-en="Openings sent to the society">企業提供給社團的職缺</h2></div>
            </div>
            {job ? (
              <article className="card card--feature reveal">
                <div className="card__top"><span className={kindTag.job} data-en="Job">{job.kindZh}</span><span className="card__index">{job.org}</span></div>
                <h3 className="h2">{job.title}</h3>
                <p className="card__body">{job.summary}</p>
                <ul className="bullets-plain">
                  {job.details?.map((line) => <li key={line}>{line}</li>)}
                </ul>
                <p className="card__body"><b data-en="Contact｜">聯絡｜</b>{job.contact}</p>
                <div className="card__foot"><a className="btn" href="mailto:aaron.chao@chubb.com"><Icon name="mail" /><span data-en="Email the recruiter">寫信給招募窗口</span></a></div>
              </article>
            ) : null}
          </div>
        </section>

        <section className="section section--alt" id="opportunities">
          <div className="wrap">
            <div className="sec-head reveal reveal--fade">
              <div><span className="eyebrow" data-en="Scholarships, programs, news">獎學金、計畫與產學動態</span><h2 className="h1" data-en="Scholarships, programs and industry news">獎學金、計畫與產學動態</h2></div>
            </div>
            <div className="grid grid-3" data-stagger>
              {others.map((item) => (
                <a className="card reveal reveal--rise" href={item.href} target="_blank" rel="noopener noreferrer" key={item.title}>
                  <div className="card__top"><span className="ios-row__icon"><Icon name={kindIcon[item.kind]} /></span><span className={kindTag[item.kind]}>{item.kindZh}</span></div>
                  <h3 className="h3">{item.title}</h3>
                  <p className="dim" style={{ fontSize: ".92rem" }}>{item.org}</p>
                  <p className="card__body">{item.summary}</p>
                  <div className="card__foot"><span className="dim" style={{ fontSize: ".9rem" }} data-en="Open source">開啟來源</span><Icon name="arrow-up-right" /></div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="library">
          <div className="wrap">
            <div className="sec-head reveal reveal--fade">
              <div><span className="eyebrow" data-en="Reading list">書單</span><h2 className="h1" data-en="This semester’s reading list">本學期書單</h2></div>
              <a className="link-arrow" href="/courses/#reading"><span data-en="Discussion topics">討論題目</span><Icon name="arrow-right" /></a>
            </div>
            <div className="rows" data-stagger>
              {books.map((book) => (
                <div className="row reveal" key={book.week}>
                  <span className="ios-row__icon"><Icon name="book" /></span>
                  <div className="row__main">
                    <div className="row__title en">{book.title}</div>
                    <div className="row__meta"><span className="en">{book.author}</span><span className="num">Week {String(book.week).padStart(2, "0")} · {book.date}</span></div>
                  </div>
                  <span className="row__side"><span className="tag tag--warn" data-en="English">英文</span></span>
                </div>
              ))}
              <div className="row reveal">
                <span className="ios-row__icon"><Icon name="book" /></span>
                <div className="row__main">
                  <div className="row__title en">Proof of Stake — The Making of Ethereum and the Philosophy of Blockchains</div>
                  <div className="row__meta"><span className="en">Vitalik Buterin</span><span>{chainSeries.name} 英文場 · 10/21</span></div>
                </div>
                <span className="row__side"><span className="tag tag--warn" data-en="English">英文</span></span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </SitePageShell>
  );
}

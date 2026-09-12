import { SitePageShell } from "@/components/layout/SitePageShell";
import { weekly } from "@/lib/content";

function Icon({ name }: { name: string }) {
  return (
    <svg className="icon" aria-hidden="true">
      <use href={`#i-${name}`} />
    </svg>
  );
}

// 洞察頁＝FinTech 週報。最新一期完整展開（封面三則短標 ＋ 三則摘要 ＋ 來源），往期收成清單。
export function InsightsPage() {
  const [latest, ...past] = weekly;
  return (
    <SitePageShell>
      <main id="main" className="page">
        <section className="pagehead">
          <div className="wrap reveal">
            <span className="eyebrow" data-en="Insights">洞察</span>
            <h1 className="h1" data-en="FinTech Weekly">FinTech 週報</h1>
            <p className="lead" data-en="Three stories a week, written so a first-year business student can follow them. Every fact links back to a source; primary sources (regulators, company statements) come first.">每週三則，寫到大一新生看得懂。每一個事實都連得回來源，一手來源（主管機關、公司公告）優先。</p>
          </div>
        </section>

        <section className="section--tight section" id="weekly">
          <div className="wrap">
            <article className="issue reveal">
              <div className="issue__cover">
                <span className="issue__eyebrow en">Vol.{String(latest.vol).padStart(2, "0")} · 本週精選</span>
                <p className="issue__range num">{latest.range}</p>
                <ol className="issue__headlines">
                  {latest.headlines.map((h) => <li key={h}><span className="grad-text">{h}</span></li>)}
                </ol>
              </div>
              <div className="issue__stories" data-stagger>
                {latest.stories.map((story, i) => (
                  <div className="card issue__story reveal reveal--rise" key={story.title}>
                    <span className="issue__n num">{String(i + 1).padStart(2, "0")}</span>
                    <h2 className="h2">{story.title}</h2>
                    <p className="card__body">{story.summary}</p>
                    <details className="issue__sources">
                      <summary data-en="Sources">來源</summary>
                      <ul>
                        {story.sources.map((s) => (
                          <li key={s.href}><a href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a>{s.primary ? <span className="tag tag--ghost">一手</span> : null}</li>
                        ))}
                      </ul>
                    </details>
                  </div>
                ))}
              </div>
              {latest.note ? <p className="note mt-6"><Icon name="alert" /><span>{latest.note}</span></p> : null}
            </article>
          </div>
        </section>

        <section className="section section--alt" id="archive">
          <div className="wrap">
            <div className="sec-head reveal reveal--fade">
              <h2 className="h1" data-en="Past issues">往期</h2>
            </div>
            <div className="rows" data-stagger>
              {past.map((issue) => (
                <details className="row row--issue reveal" key={issue.vol}>
                  <summary className="row__summary">
                    <span className="row__date num"><b>Vol.{String(issue.vol).padStart(2, "0")}</b><span>{issue.range}</span></span>
                    <span className="row__main"><span className="row__title">{issue.headlines.join("／")}</span></span>
                    <Icon name="chevron-right" />
                  </summary>
                  <div className="row__expand">
                    {issue.stories.map((story) => (
                      <div key={story.title}>
                        <h3 className="h3">{story.title}</h3>
                        <p className="card__body">{story.summary}</p>
                        <p className="dim" style={{ fontSize: ".9rem" }}>{story.sources.map((s, i) => <span key={s.href}>{i ? "、" : "來源："}<a href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a></span>)}</p>
                      </div>
                    ))}
                    {issue.note ? <p className="dim" style={{ fontSize: ".9rem" }}>{issue.note}</p> : null}
                  </div>
                </details>
              ))}
            </div>
            <p className="dim mt-6" style={{ fontSize: ".95rem" }} data-en="Produced with the society’s weekly-digest prompt: a sourced fact card first, then the copy; nothing is added that is not on the card.">依社團的週報 Prompt 產出：先做附來源的選題卡，再寫文案；卡上沒有的事實一個都不加。</p>
          </div>
        </section>
      </main>
    </SitePageShell>
  );
}

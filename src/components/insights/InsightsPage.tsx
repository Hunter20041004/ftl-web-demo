import { SitePageShell } from "@/components/layout/SitePageShell";
import { papers, weekly, type WeeklyStory } from "@/lib/content";

function Icon({ name }: { name: string }) {
  return (
    <svg className="icon" aria-hidden="true">
      <use href={`#i-${name}`} />
    </svg>
  );
}

// 洞察頁＝FinTech 週報。最新一期完整展開（封面三則短標 ＋ 三則摘要 ＋ 來源），往期收成清單。
// 每則新聞的固定結構：一句話 → 重點 → 背景 → 說法 → 為什麼重要 → 台灣視角 → 接下來 →（名詞）
function StoryBody({ story }: { story: WeeklyStory }) {
  return (
    <div className="story">
      <p className="story__lede" data-en={story.ledeEn} suppressHydrationWarning>{story.lede}</p>
      <ul className="story__facts">
        {story.facts.map((f, i) => <li key={f} data-en={story.factsEn[i]} suppressHydrationWarning>{f}</li>)}
      </ul>
      <p className="story__context"><b data-en="Background｜" suppressHydrationWarning>背景｜</b><span data-en={story.contextEn} suppressHydrationWarning>{story.context}</span></p>
      {story.quote ? (
        <blockquote className="story__quote">
          <p data-en={story.quoteEn} suppressHydrationWarning>{`「${story.quote}」`}</p>
          <cite data-en={story.quoteByEn} suppressHydrationWarning>{story.quoteBy}</cite>
        </blockquote>
      ) : null}
      <p className="story__why"><b data-en="Why it matters｜" suppressHydrationWarning>為什麼重要｜</b><span data-en={story.whyEn} suppressHydrationWarning>{story.why}</span></p>
      <p className="story__taiwan"><b data-en="Taiwan｜" suppressHydrationWarning>台灣視角｜</b><span data-en={story.taiwanEn} suppressHydrationWarning>{story.taiwan}</span></p>
      <div className="story__watch">
        <b data-en="What to watch" suppressHydrationWarning>接下來看什麼</b>
        <ul>{story.watch.map((w, i) => <li key={w} data-en={story.watchEn[i]} suppressHydrationWarning>{w}</li>)}</ul>
      </div>
      {story.term ? <p className="story__term"><b data-en="Term｜" suppressHydrationWarning>名詞｜</b><span data-en={story.termEn} suppressHydrationWarning>{story.term}</span></p> : null}
    </div>
  );
}

export function InsightsPage() {
  const [latest, ...past] = weekly;
  return (
    <SitePageShell>
      <main id="main" className="page">
        <section className="pagehead">
          <div className="wrap reveal">
            <span className="eyebrow" data-en="Insights" suppressHydrationWarning>洞察</span>
            <h1 className="h1" data-en="FinTech Weekly" suppressHydrationWarning>FinTech 週報</h1>
          </div>
        </section>

        <section className="section--tight section" id="weekly">
          <div className="wrap">
            <article className="issue reveal" id={`vol-${latest.vol}`}>
              <div className="issue__cover">
                <span className="issue__eyebrow en" data-en={`Vol.${String(latest.vol).padStart(2, "0")} · Highlights`} suppressHydrationWarning>{`Vol.${String(latest.vol).padStart(2, "0")} · 本期精選`}</span>
                <p className="issue__range num">{latest.range}</p>
                <ol className="issue__headlines">
                  {latest.headlines.map((h, i) => <li key={h}><span className="grad-text" data-en={latest.headlinesEn[i]} suppressHydrationWarning>{h}</span></li>)}
                </ol>
                <p className="issue__lede" data-en={latest.ledeEn} suppressHydrationWarning>{latest.lede}</p>
              </div>
              <div className="issue__stories" data-stagger>
                {latest.stories.map((story, i) => (
                  <div className="card issue__story reveal reveal--rise" key={story.title}>
                    <span className="issue__n num">{String(i + 1).padStart(2, "0")}</span>
                    <h2 className="h2" data-en={story.titleEn} suppressHydrationWarning>{story.title}</h2>
                    <StoryBody story={story} />
                    <details className="issue__sources">
                      <summary data-en="Sources" suppressHydrationWarning>來源</summary>
                      <ul>
                        {story.sources.map((s) => (
                          <li key={s.href}><a href={s.href} target="_blank" rel="noopener noreferrer" data-en={s.labelEn} suppressHydrationWarning>{s.label}</a>{s.primary ? <span className="tag tag--ghost" data-en="Primary" suppressHydrationWarning>一手</span> : null}</li>
                        ))}
                      </ul>
                    </details>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section className="section section--alt" id="archive">
          <div className="wrap">
            <div className="sec-head reveal reveal--fade">
              <h2 className="h1" data-en="Past issues" suppressHydrationWarning>往期</h2>
            </div>
            <div className="rows" data-stagger>
              {past.map((issue) => (
                <details className="row row--issue reveal" id={`vol-${issue.vol}`} key={issue.vol}>
                  <summary className="row__summary">
                    <span className="row__date num"><b>Vol.{String(issue.vol).padStart(2, "0")}</b><span>{issue.range}</span></span>
                    <span className="row__main"><span className="row__title" data-en={issue.headlinesEn.join(" / ")} suppressHydrationWarning>{issue.headlines.join("／")}</span></span>
                    <Icon name="chevron-right" />
                  </summary>
                  <div className="row__expand">
                    {issue.stories.map((story) => (
                      <div key={story.title}>
                        <h3 className="h3" data-en={story.titleEn} suppressHydrationWarning>{story.title}</h3>
                        <StoryBody story={story} />
                        <p className="dim" style={{ fontSize: ".9rem" }}><span data-en="Sources: " suppressHydrationWarning>來源：</span>{story.sources.map((s, i) => <span key={s.href}>{i ? "、" : ""}<a href={s.href} target="_blank" rel="noopener noreferrer" data-en={s.labelEn} suppressHydrationWarning>{s.label}</a></span>)}</p>
                      </div>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
        <section className="section" id="research">
          <div className="wrap">
            <div className="sec-head reveal reveal--fade">
              <h2 className="h1" data-en="Research" suppressHydrationWarning>研究文章</h2>
            </div>
            <div className="grid grid-2" data-stagger>
              {papers.map((paper) => (
                <a className="card paper reveal reveal--rise" href={paper.href} target="_blank" rel="noopener noreferrer" key={paper.href}>
                  <div className="card__top"><span className={paper.region === "tw" ? "tag tag--cyan" : "tag"} data-en={paper.region === "tw" ? "Taiwan" : "International"} suppressHydrationWarning>{paper.region === "tw" ? "國內" : "國外"}</span><span className="card__index num">{paper.year}</span></div>
                  <h3 className="h3" data-en={paper.titleEn} suppressHydrationWarning>{paper.title}</h3>
                  <p className="dim" style={{ fontSize: ".95rem" }} data-en={paper.authorsEn || paper.venueEn ? `${paper.authorsEn ?? paper.authors} · ${paper.venueEn ?? paper.venue}` : undefined} suppressHydrationWarning>{`${paper.authors} · ${paper.venue}`}</p>
                  <p className="card__body" data-en={paper.summaryEn} suppressHydrationWarning>{paper.summary}</p>
                  <div className="card__foot"><span className="dim" style={{ fontSize: ".9rem" }} data-en="Read the paper" suppressHydrationWarning>閱讀原文</span><Icon name="arrow-up-right" /></div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
    </SitePageShell>
  );
}

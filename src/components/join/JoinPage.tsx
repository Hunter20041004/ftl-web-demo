import { SitePageShell } from "@/components/layout/SitePageShell";
import { membership } from "@/lib/content";

function Icon({ name }: { name: string }) {
  return (
    <svg className="icon" aria-hidden="true">
      <use href={`#i-${name}`} />
    </svg>
  );
}

// 入社頁：兩種身份、時程、社費與出席獎勵金、繳費步驟、Q&A。數字全部來自社費辦法 v2.2。
export function JoinPage() {
  return (
    <SitePageShell>
      <main id="main" className="page">
        <section className="pagehead">
          <div className="wrap reveal">
            <span className="eyebrow" data-en="Join">入社</span>
            <h1 className="h1" data-en="How to join">入社方式</h1>
            <p className="lead" data-en="Two membership types. No deposit: attendance is rewarded at the end of term."><b className="grad-text">{membership.reward.headline}</b>　三位業界講者、三場工作坊、三場英語讀書會、一場校友會、一場雞尾酒會，共 11 堂。不收保證金，出席獎勵金期末發放。</p>
            <div className="hero__cta mt-6">
              <a className="btn btn--primary btn--lg" href="https://page.line.me/nccufintechlab"><Icon name="message" /><span data-en="Apply via LINE Bot">透過 LINE Bot 報名</span></a>
              <a className="btn btn--lg" href="#faq" data-en="Read the FAQ">先看常見問題</a>
            </div>
          </div>
        </section>

        <section className="section--tight section" id="types">
          <div className="wrap">
            <div className="grid grid-2" data-stagger>
              {membership.types.map((type) => (
                <article className="card reveal reveal--rise" key={type.name}>
                  <div className="card__top"><h2 className="h2" data-en={type.en}>{type.name}</h2><span className="tag num">{type.fee}</span></div>
                  <p className="card__body"><b data-en="How to join｜">入社方式｜</b>{type.how}</p>
                  <p className="card__body"><b data-en="Includes｜">包含｜</b>{type.perks}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section--alt" id="timeline">
          <div className="wrap">
            <div className="sec-head reveal reveal--fade">
              <div><span className="eyebrow" data-en="Project-member schedule">專案生招募時程</span><h2 className="h1" data-en="Screening → interview → results">書審 → 面試 → 公布</h2><p className="lead mt-4" data-en="Screening: fill in the Google form and submit a résumé. Interviews are held in groups.">書審：填寫 Google 表單並繳交履歷。面試採團體面試。</p></div>
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

        <section className="section" id="reward">
          <div className="wrap">
            <div className="sec-head reveal reveal--fade">
              <div><span className="eyebrow" data-en="Attendance reward">出席獎勵金</span><h2 className="h1" data-en="Attend more, get more back">出席越多，領回越多</h2></div>
            </div>
            <div className="grid grid-2" style={{ alignItems: "start" }}>
              <div className="panel reveal">
                <table className="tiers">
                  <thead><tr><th data-en="Sessions attended (of 11)">出席堂數（計 11 堂）</th><th data-en="Reward">獎勵金</th></tr></thead>
                  <tbody>
                    {membership.reward.tiers.map(([sessions, amount]) => (
                      <tr key={sessions}><td>{sessions}</td><td className="num"><b className="grad-text">{amount}</b></td></tr>
                    ))}
                  </tbody>
                </table>
                <p className="card__body mt-4">{membership.reward.countedSessions}</p>
              </div>
              <div className="stack" style={{ gap: 14 }}>
                <div className="card reveal"><h3 className="h3" data-en="How attendance is counted">出席怎麼算</h3><p className="card__body">{membership.reward.attendance}</p></div>
                <div className="card reveal"><h3 className="h3" data-en="When it is paid">什麼時候發</h3><p className="card__body">{membership.reward.payout}</p></div>
                <div className="card reveal"><h3 className="h3" data-en="Points prize (separate)">積分獎金（另計）</h3><p className="card__body">{membership.reward.points}</p></div>
              </div>
            </div>
          </div>
        </section>

        <section className="section--tight section section--alt" id="payment">
          <div className="wrap">
            <div className="sec-head reveal reveal--fade">
              <div><span className="eyebrow" data-en="Payment">繳費步驟</span><h2 className="h1" data-en="Everything runs through the LINE Bot">全部在 LINE Bot 上完成</h2></div>
            </div>
            <ol className="steps" data-stagger>
              {membership.payment.map((step, index) => (
                <li className="card reveal" key={step}><span className="numchip">{index + 1}</span><p className="card__body">{step}</p></li>
              ))}
            </ol>
            <p className="note mt-6"><Icon name="alert" /><span data-en="Cash is not accepted, except at the counter on welcome night.">不接受現金；迎新當日設現金收費櫃台並開立收據。</span></p>
          </div>
        </section>

        <section className="section" id="faq">
          <div className="wrap">
            <div className="sec-head reveal reveal--fade">
              <div><span className="eyebrow" data-en="FAQ">常見問題</span><h2 className="h1" data-en="FAQ">常見問題</h2></div>
            </div>
            <div className="faq" data-stagger>
              {membership.faq.map(([q, a]) => (
                <details className="faq__item card reveal" key={q}>
                  <summary className="faq__q"><span>{q}</span><Icon name="chevron-right" /></summary>
                  <p className="card__body">{a}</p>
                </details>
              ))}
            </div>
            <p className="dim mt-6" style={{ fontSize: ".9rem" }}>{membership.note}</p>
          </div>
        </section>
      </main>
    </SitePageShell>
  );
}

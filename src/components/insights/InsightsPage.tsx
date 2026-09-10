import { SitePageShell } from "@/components/layout/SitePageShell";

function Icon({ name, className = "icon" }: { name: string; className?: string }) {
  return <svg className={className} aria-hidden="true"><use href={`#i-${name}`} /></svg>;
}

const issues = [
  ["Vol.23 — The FSC sandbox turns five: what actually graduated", "Vol.23｜監理沙盒滿五年，真正畢業的有哪些", "Regulation · Payments · Insurtech", "監理 · 支付 · 保險科技", "2026.08.26"],
  ["Vol.22 — Embedded lending on e-commerce platforms, and who eats the default", "Vol.22｜電商平台的嵌入式借貸，違約誰吸收", "Lending · Credit risk", "借貸 · 信用風險", "2026.08.19"],
  ["Vol.21 — Taiwan’s open banking phase 3: the bit nobody implemented", "Vol.21｜台灣開放銀行第三階段，沒人真的做的那部分", "Open banking · API", "開放銀行 · API", "2026.08.12"],
  ["Vol.20 — Robo-advisors after the drawdown: churn tells a different story", "Vol.20｜回檔之後的機器人理財，留存率說了不一樣的故事", "Wealth tech · Behaviour", "財富科技 · 投資行為", "2026.08.05"],
] as const;

const research = [
  {
    tagEn: "Payments", tagZh: "支付", meta: "2026 · 48 PAGES",
    titleEn: "Taiwan’s mobile payment plateau: why growth stopped at convenience stores",
    titleZh: "台灣行動支付的天花板：為什麼成長停在超商門口",
    bodyEn: "We tracked adoption across six merchant categories and interviewed 14 small merchants. The blocker turned out to be settlement timing, not consumer habit.",
    bodyZh: "我們追蹤六類商家的採用率，並訪談 14 位小型商家。卡點其實是撥款時間，不是消費者習慣。",
  },
  {
    tagEn: "Credit", tagZh: "信貸", meta: "2026 · 36 PAGES",
    titleEn: "Alternative credit data in Taiwan: what is legal, what is useful, what is neither",
    titleZh: "台灣的替代性信用資料：哪些合法、哪些有用、哪些兩者都不是",
    bodyEn: "A mapping of data sources against the Personal Data Protection Act, with a predictive-power estimate for each. Several popular sources score close to zero.",
    bodyZh: "把資料來源對照個資法逐項盤點，並估計各自的預測力。有幾個很流行的來源，預測力接近零。",
  },
  {
    tagEn: "Wealth tech", tagZh: "財富科技", meta: "2026 · 41 PAGES",
    titleEn: "Who actually uses robo-advisors in Taiwan — a survey of 512 users",
    titleZh: "台灣到底是誰在用機器人理財——512 位使用者調查",
    bodyEn: "Sample skews young and urban, and we say so. Within that limit: the strongest predictor of staying invested was not returns, it was whether the app explained the drawdown.",
    bodyZh: "樣本偏年輕、偏都會，這點我們寫明了。在這個限制內：留下來最強的預測因子不是報酬，而是 App 有沒有解釋那次回檔。",
  },
] as const;

export function InsightsPage() {
  return (
    <SitePageShell>
      <main id="main" className="page">
        <section className="pagehead">
          <div className="wrap reveal">
            <span className="eyebrow" data-en="Insights">洞察</span>
            <h1 className="h1" data-en="Three stories a week, and a few we couldn’t fit in a week">一週三則，加上幾件一週講不完的事</h1>
            <p className="lead" data-en="The weekly digest is written by rotating members and reviewed by the academic lead before it goes out. Deep dives take a term.">週報由成員輪流撰寫，發出前由學術長審過。深度研究則是整學期的工作。</p>
          </div>
        </section>

        <section className="section--tight section section--alt" id="weekly">
          <div className="wrap">
            <div className="sec-head reveal">
              <div><span className="eyebrow" data-en="Weekly digest">FinTech 週報</span><h2 className="h1" data-en="Every Monday, 08:00">每週一早上八點</h2></div>
              <a className="btn" href="/contact/"><Icon name="message" /><span data-en="Get it on LINE">用 LINE 訂閱</span></a>
            </div>

            <div className="rows" data-stagger="">
              <article className="card reveal" style={{ padding: "clamp(20px,2.6vw,32px)" }}>
                <div className="card__top"><span className="tag" data-en="Latest issue">最新一期</span><span className="card__index num">VOL.24 · 2026.09.02</span></div>
                <div className="bullets">
                  <p className="bullet"><span className="bn">01</span><span data-en="Pure-play digital banks cleared for FX business — the rule change turns FX spread into a real revenue line, so watch who prices for volume and who prices for margin.">純網銀獲准承作外幣業務——這次鬆綁把匯差變成真正的收入項，重點在誰衝量、誰守利差。</span></p>
                  <p className="bullet"><span className="bn">02</span><span data-en="Stablecoin settlement passes 5% of SEA cross-border e-commerce. Not speculation: merchants are dodging three-day settlement. The open question is who now carries the FX risk.">穩定幣結算首度佔東南亞跨境電商 5%。不是投機，是商家在避開三天清算。未解的問題是匯率風險現在由誰承擔。</span></p>
                  <p className="bullet"><span className="bn">03</span><span data-en="Brokerages roll out AI research assistants. Headcount didn’t drop; the job changed — less writing, more verifying.">券商導入 AI 投研助理。人數沒少，工作內容變了——寫得少、查證得多。</span></p>
                </div>
                <div className="card__foot"><a className="link-arrow" href="#"><span data-en="Read the full issue">讀完整這期</span><Icon name="arrow-right" /></a><span className="dim num" style={{ fontSize: ".78rem" }}>15 min read</span></div>
              </article>

              {issues.map(([titleEn, titleZh, metaEn, metaZh, date]) => (
                <a className="row reveal" href="#" key={date}>
                  <span className="ios-row__icon"><Icon name="news" /></span>
                  <span className="row__main"><span className="row__title" data-en={titleEn}>{titleZh}</span><span className="row__meta"><span data-en={metaEn}>{metaZh}</span></span></span>
                  <span className="row__side"><span className="card__index num">{date}</span><Icon name="chevron-right" className="icon row__chev" /></span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <hr className="divider" />

        <section className="section" id="research">
          <div className="wrap">
            <div className="sec-head reveal">
              <div>
                <span className="eyebrow" data-en="Deep dives">深度產業研究</span>
                <h2 className="h1" data-en="One question, one term, one report">一個問題、一學期、一份報告</h2>
                <p className="lead mt-4" data-en="Each report states its data sources and its limits on page two. If we couldn’t verify something, we say so instead of rounding it into a conclusion.">每份報告在第二頁就寫明資料來源與限制。查不到的東西我們就寫查不到，不會四捨五入成結論。</p>
              </div>
            </div>

            <div className="grid grid-2" data-stagger="">
              {research.map((item) => (
                <a className="card reveal" href="#" key={item.meta}>
                  <div className="card__top"><span className="tag tag--cyan" data-en={item.tagEn}>{item.tagZh}</span><span className="card__index num">{item.meta}</span></div>
                  <h3 className="h3" data-en={item.titleEn}>{item.titleZh}</h3>
                  <p className="card__body" data-en={item.bodyEn}>{item.bodyZh}</p>
                  <div className="card__foot"><span className="link-arrow"><span data-en="Download PDF">下載 PDF</span><Icon name="download" /></span></div>
                </a>
              ))}

              <a className="card reveal" href="#">
                <div className="card__top"><span className="tag tag--warn" data-en="In progress">進行中</span><span className="card__index num">2026 FALL</span></div>
                <h3 className="h3" data-en="Insurtech claims automation: the 30% that always comes back to a human">保險科技的理賠自動化：那永遠會退回人工的三成</h3>
                <p className="card__body" data-en="Currently interviewing claims staff at three insurers. Publishing in January regardless of whether the answer is interesting.">目前正在訪談三家保險公司的理賠人員。無論答案有不有趣，一月都會發表。</p>
                <div className="card__foot"><span className="dim" style={{ fontSize: ".84rem" }} data-en="Expected 2027.01">預計 2027.01 發表</span></div>
              </a>
            </div>
          </div>
        </section>
      </main>
    </SitePageShell>
  );
}

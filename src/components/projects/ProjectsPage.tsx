import { SitePageShell } from "@/components/layout/SitePageShell";

function Icon({ name }: { name: string }) {
  return <svg className="icon" aria-hidden="true"><use href={`#i-${name}`} /></svg>;
}

const industryProjects = [
  {
    partnerZh: "合作企業 01", partnerEn: "Partner Bank 01", term: "2026 SPRING",
    titleZh: "把交易盜刷警示的誤報砍下來", titleEn: "Cutting false positives in transaction fraud alerts",
    bodyZh: "他們的規則引擎警示太多，分析師乾脆不看了。我們用梯度提升重建評分，外加一層法遵團隊仍讀得懂的規則。",
    bodyEn: "Their rule engine flagged too much; analysts stopped trusting it. We rebuilt the scoring with gradient boosting plus a rule layer the compliance team could still read.",
    tags: ["Python", "LightGBM", "SHAP"], statusZh: "已交付", statusEn: "Delivered", statusClass: "tag--ok", metaZh: "5 人 · 12 週", metaEn: "Team of 5 · 12 weeks",
  },
  {
    partnerZh: "合作企業 02", partnerEn: "Partner Firm 02", term: "2026 SPRING",
    titleZh: "給非分析師看的零售投研儀表板", titleEn: "A retail research dashboard that a non-analyst can read",
    bodyZh: "委託內容是「客戶根本不開那份 PDF」。我們把 30 頁的月報變成六個視圖，並拿給沒交易過的人測試。",
    bodyEn: "The brief was “our clients don’t open the PDF”. We turned a 30-page monthly report into six views, and tested them on people who had never traded.",
    tags: ["React", "D3", "FastAPI"], statusZh: "已交付", statusEn: "Delivered", statusClass: "tag--ok", metaZh: "4 人 · 14 週", metaEn: "Team of 4 · 14 weeks",
  },
  {
    partnerZh: "合作新創 03", partnerEn: "Partner Startup 03", term: "2026 FALL",
    titleZh: "KYC 文件審查：自動化該在哪裡停手", titleEn: "KYC document review: where automation should stop",
    bodyZh: "進行中。我們在量哪幾類文件 OCR 流程可以安全處理、哪幾類必須留給人——答案沒有銷售簡報講得那麼好看。",
    bodyEn: "Ongoing. We are measuring which document types an OCR pipeline handles safely and which ones must stay with a human — the answer is less flattering than the sales deck.",
    tags: ["OCR", "RegTech", "Evaluation"], statusZh: "進行中", statusEn: "In progress", statusClass: "tag--warn", metaZh: "6 人 · 第 4／12 週", metaEn: "Team of 6 · week 4 of 12",
  },
] as const;

const selfProjects = [
  { titleZh: "公開資訊觀測站，但講人話", titleEn: "TWSE filings, in plain language", kindZh: "開源", kindEn: "Open source", kindClass: "tag--cyan", bodyZh: "一支爬蟲加一個摘要器，把重大訊息公告變成兩句話的筆記。原本只是拿來寫週報，後來因為同學一直要，就開源了。", bodyEn: "A scraper plus a summariser that turns material-information filings into two-sentence notes. Used internally to write the weekly digest, then opened up because classmates kept asking for access.", tags: ["Python", "LLM", "GitHub"] },
  { titleZh: "那檔 ETF 到底扣了你多少", titleEn: "How much does that ETF actually cost you", kindZh: "網頁工具", kindEn: "Web tool", kindClass: "tag--cyan", bodyZh: "一個試算工具，把十年持有的總成本算出來，包含沒人放在首頁的那些費用。起因是一場「0.4% 根本沒差吧」的爭論。", bodyEn: "A calculator that shows total holding cost over 10 years including the fees nobody puts on the front page. Built after an argument about whether 0.4% “is basically nothing”.", tags: ["TypeScript", "Chart.js"] },
  { titleZh: "回答社團問題的 LINE Bot", titleEn: "A LINE bot that answers club questions", kindZh: "內部工具", kindEn: "Internal tool", kindClass: "tag--cyan", bodyZh: "起因是每次招募，幹部都在回答同樣的六個問題。現在它處理掉大約八成，剩下的轉給真人。", bodyEn: "Built because the officers were answering the same six questions every recruitment cycle. It now handles roughly 80% of them, and hands the rest to a human.", tags: ["LINE Messaging API", "RAG"] },
  { titleZh: "不要騙自己的回測", titleEn: "Backtesting without lying to yourself", kindZh: "開發中", kindEn: "Work in progress", kindClass: "tag--warn", bodyZh: "一個教學用的回測框架，故意讓你在同一個策略上開關「前視偏誤」與「存活者偏誤」，直接看結果被灌水多少。", bodyEn: "A teaching harness that deliberately shows how look-ahead bias and survivorship bias inflate results, by letting you toggle them on and off on the same strategy.", tags: ["Python", "Pandas", "Teaching"] },
] as const;

export function ProjectsPage() {
  return (
    <SitePageShell>
      <main id="main" className="page">
        <section className="pagehead">
          <div className="wrap reveal">
            <span className="eyebrow" data-en="Projects">專案</span>
            <h1 className="h1" data-en="Things we actually built, and what broke along the way">我們真的做出來的東西，以及過程中壞掉的部分</h1>
            <p className="lead" data-en="Two tracks: projects commissioned by a partner with a real deadline, and projects we started ourselves because the question annoyed us. Both ship.">兩條線：一條是業界委託、有真實期限的產學合作；一條是我們自己覺得問題很煩所以動手做的自主專案。兩條都要交件。</p>
          </div>
        </section>

        <section className="section--tight section">
          <div className="wrap">
            <div className="sec-head reveal"><div><span className="eyebrow" data-en="Industry collaboration">產學合作</span><h2 className="h1" data-en="Commissioned work">業界出題，我們交件</h2><p className="lead mt-4" data-en="A partner defines the problem, we deliver in 10–14 weeks, and they review it in front of everyone. Partner names below are placeholders.">合作方出題，我們用 10–14 週交件，成果由對方當著所有人的面檢視。以下合作方名稱為示意。</p></div></div>
            <div className="grid grid-3" data-stagger>
              {industryProjects.map((p) => (
                <article className="card card--bar card--interactive reveal" key={p.titleZh}>
                  <div className="card__top"><span className="tag" data-en={p.partnerEn}>{p.partnerZh}</span><span className="card__index num">{p.term}</span></div>
                  <h3 className="h3" data-en={p.titleEn}>{p.titleZh}</h3>
                  <p className="card__body" data-en={p.bodyEn}>{p.bodyZh}</p>
                  <div className="tag-row mt-4">{p.tags.map((tag) => <span className="tag tag--ghost" key={tag}>{tag}</span>)}</div>
                  <div className="card__foot"><span className={`tag ${p.statusClass}`} data-en={p.statusEn}>{p.statusZh}</span><span className="dim" style={{ fontSize: ".82rem" }} data-en={p.metaEn}>{p.metaZh}</span></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <hr className="divider" />

        <section className="section section--alt" id="self">
          <div className="wrap">
            <div className="sec-head reveal"><div><span className="eyebrow" data-en="Self-initiated">自主專案</span><h2 className="h1" data-en="Nobody asked for these">沒有人要求我們做這些</h2><p className="lead mt-4" data-en="Started because a member got annoyed by something. Some of them turned out to be useful to more people than we expected.">起因都是某個成員被某件事煩到。其中幾個後來對比我們預期更多的人有用。</p></div></div>
            <div className="grid grid-2" data-stagger>
              {selfProjects.map((p) => (
                <article className="card card--bar card--interactive reveal" key={p.titleZh}>
                  <div className="card__top"><h3 className="h3" data-en={p.titleEn}>{p.titleZh}</h3><span className={`tag ${p.kindClass}`} data-en={p.kindEn}>{p.kindZh}</span></div>
                  <p className="card__body" data-en={p.bodyEn}>{p.bodyZh}</p>
                  <div className="tag-row mt-4">{p.tags.map((tag) => <span className="tag tag--ghost" key={tag}>{tag}</span>)}</div>
                </article>
              ))}
            </div>
            <div className="panel reveal mt-7" style={{ padding: "clamp(24px,3.5vw,44px)", display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center", justifyContent: "space-between" }}>
              <div><h3 className="h2" data-en="Got a problem worth 12 weeks of our time?">有值得我們花 12 週的問題嗎？</h3><p className="lead mt-4" style={{ maxWidth: "52ch" }} data-en="We take on two to three commissioned projects per term. Tell us the problem, not the solution.">我們每學期接兩到三個委託專案。跟我們說問題，不用先想好解法。</p></div>
              <a className="btn btn--primary btn--lg" href="/contact/"><span data-en="Talk to us">跟我們談談</span><Icon name="arrow-right" /></a>
            </div>
          </div>
        </section>
      </main>
    </SitePageShell>
  );
}

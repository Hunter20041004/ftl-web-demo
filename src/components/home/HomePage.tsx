import { SitePageShell } from "@/components/layout/SitePageShell";

function Icon({ name, className = "icon" }: { name: string; className?: string }) {
  return (
    <svg className={className} aria-hidden="true">
      <use href={`#i-${name}`} />
    </svg>
  );
}

export function HomePage() {
  return (
    <SitePageShell mobius>
      <main id="main" className="page" data-visual-baseline="v1-main-fa033f0">
        <section className="hero">
          <span className="hero__bloom" aria-hidden="true" />
          <div className="wrap">
            <div className="hero__grid">
              <div className="reveal">
                <span className="eyebrow">NCCU FinTech Innovation Lab</span>
                <h1 className="display hero__title">
                  <span data-en="NCCU FinTech">政大金融科技</span><br />
                  <span className="grad-text" data-en="Innovation Lab">創新實驗室</span>
                </h1>
                <p className="hero__sub" data-en="NCCU’s first FinTech academic society">政大第一個 FinTech 學術社團</p>
                <p className="lead hero__desc" data-en="Finance × Technology × Industry × Building things. We turn the FinTech you learn in class into something you can actually build, explain, and put on a résumé.">金融 × 科技 × 產學 × 實作。我們把課堂上的金融科技，變成做得出來、講得清楚、寫得進履歷的東西。</p>
                <div className="hero__cta">
                  <a className="btn btn--primary btn--lg" href="/contact/"><span data-en="Join FTL">加入 FTL</span><Icon name="arrow-right" /></a>
                  <a className="btn btn--lg" href="/projects/" data-en="See what we’ve built">看看我們做了什麼</a>
                </div>
              </div>
              <div className="pane pane--rows reveal">
                <div className="ios-list" data-stagger>
                  {[
                    ["/about/", "cap", "修完學程，然後呢？", "Finished the FinTech program. Now what?"],
                    ["/projects/", "users", "想做專案，找誰一起？", "Want to build something — with who?"],
                    ["/insights/", "file", "履歷只有修過課，怎麼辦？", "Résumé says “took the course”. And?"],
                    ["/resources/#contests", "trophy", "想參加商業競賽，找不到隊友？", "Case competitions but no teammates?"],
                  ].map(([href, icon, zh, en]) => (
                    <a key={href} className="ios-row reveal" href={href}>
                      <span className="ios-row__icon"><Icon name={icon} /></span>
                      <span className="ios-row__label" data-en={en}>{zh}</span>
                      <Icon name="chevron-right" className="icon ios-row__chev" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="pane pane--stats reveal reveal--stat">
              <div className="stats">
                <div className="stat"><b>64</b><span data-en="Members">成員人數</span></div>
                <div className="stat"><b>12</b><span data-en="Events this year">今年活動場次</span></div>
                <div className="stat"><b>8</b><span data-en="Live projects">進行中專案</span></div>
                <div className="stat"><b>3</b><span data-en="Industry partners">產學合作</span></div>
              </div>
            </div>

            <p className="endorse reveal"><Icon name="shield" /><span data-en="Founded under the guidance of the NCCU College of Commerce FinTech Research Center">政大商學院金融科技研究中心 指導成立</span></p>
          </div>
        </section>

        <section className="section--tight section section--alt" id="weekly">
          <div className="wrap">
            <div className="sec-head reveal reveal--fade">
              <div><span className="eyebrow" data-en="Weekly Digest">FinTech 週報</span><h2 className="h1" data-en="This week in FinTech">這禮拜的金融科技，發生了什麼</h2><p className="lead mt-4" data-en="Every Monday we pick three stories that actually matter, and say why they matter in two sentences.">每週一，我們挑三則真的重要的消息，並用兩句話說清楚它為什麼重要。</p></div>
              <a className="link-arrow" href="/insights/#weekly"><span data-en="All issues">看所有期數</span><Icon name="arrow-right" /></a>
            </div>
            <div className="weekly" data-stagger>
              <a className="card card--feature reveal reveal--rise" href="/insights/#weekly"><div className="card__top"><span className="card__index num">VOL.24 · 09.02</span><span className="tag" data-en="Regulation">監理</span></div><h3 className="h3" data-en="Pure-play digital banks cleared for FX business — three players, three strategies">純網銀獲准承作外幣業務，三家的打法完全不同</h3><p className="card__body" data-en="The rule change turns FX spread into a real revenue line for digital-only banks. Watch who prices for volume and who prices for margin.">這次鬆綁把匯差變成純網銀真正的收入項。重點在於誰選擇衝量、誰選擇守利差。</p><div className="card__foot"><span className="dim en" style={{ fontSize: ".78rem", fontWeight: 700 }}>4 min read</span><Icon name="arrow-up-right" /></div></a>
              <div className="weekly__side">
                <a className="card card--sec reveal reveal--rise" href="/insights/#weekly"><div className="card__top"><span className="card__index num">VOL.24 · 09.02</span><span className="tag tag--cyan" data-en="Payments">支付</span></div><h3 className="h3" data-en="Stablecoin settlement passes 5% of SEA cross-border e-commerce">穩定幣結算首度佔東南亞跨境電商 5%</h3><p className="card__body" data-en="Not speculation — merchants are using it to dodge three-day settlement. The interesting question is who takes the FX risk now.">這次不是投機，是商家用它避開三天的清算等待。有趣的問題是：匯率風險現在由誰承擔。</p><div className="card__foot"><span className="dim en" style={{ fontSize: ".78rem", fontWeight: 700 }}>6 min read</span><Icon name="arrow-up-right" /></div></a>
                <a className="card card--sec reveal reveal--rise" href="/insights/#weekly"><div className="card__top"><span className="card__index num">VOL.24 · 09.02</span><span className="tag tag--warn" data-en="AI × Markets">AI × 資本市場</span></div><h3 className="h3" data-en="Brokerages roll out AI research assistants — what happens to junior analysts">券商導入 AI 投研助理後，初階分析師去哪了</h3><p className="card__body" data-en="Headcount didn’t drop. The job changed: less writing, more verifying. That shift is the part worth preparing for.">人數沒有變少，工作內容變了：寫得少、查證得多。值得準備的是這個轉向。</p><div className="card__foot"><span className="dim en" style={{ fontSize: ".78rem", fontWeight: 700 }}>5 min read</span><Icon name="arrow-up-right" /></div></a>
              </div>
            </div>
          </div>
        </section>

        <hr className="divider" />

        <section className="section" id="mission"><div className="wrap"><div className="sec-head reveal reveal--fade"><div><span className="eyebrow" data-en="Our mission">社團宗旨</span><h2 className="h1" data-en="Three things we insist on">我們堅持的三件事</h2></div><a className="link-arrow" href="/about/"><span data-en="The full story">完整的成立背景</span><Icon name="arrow-right" /></a></div><div className="numlist" data-stagger>{[
          ["01", "做出來，不只是討論", "Ship it, don’t just discuss it", "每學期每組都要交出一個能用的東西：一個模型、一個儀表板，或一份社團以外的人真的會讀的報告。「我們有研究」不算成果。", "Every term each team ships one thing that works — a model, a dashboard, or a report someone outside the club actually reads. “We researched it” does not count as a deliverable."],
          ["02", "金融與程式坐在同一張桌子", "Finance and code at the same table", "分組刻意混編：財金、資管、統計、法律。懂法規的人和懂模型的人互相聽不懂的地方，往往就是好問題出現的地方。", "Teams are deliberately mixed: finance, MIS, statistics, law. The friction between them is where the good questions come from."],
          ["03", "一隻腳踩在業界", "Keep one foot in the industry", "每學期請銀行、券商與新創的業師來看我們的東西——不是演講，是針對成果的批評。被講難聽話也是成果的一部分。", "Mentors from banks, brokerages and startups review our work each term — not as a talk, but as a critique of what we built."],
        ].map(([n, zhTitle, enTitle, zhBody, enBody]) => <article className="nl reveal" key={n}><span className="nl__n">{n}</span><div><h3 data-en={enTitle}>{zhTitle}</h3><p data-en={enBody}>{zhBody}</p></div></article>)}</div></div></section>

        <section className="section section--alt" id="events"><div className="wrap"><div className="sec-head reveal reveal--fade"><div><span className="eyebrow" data-en="Upcoming">近期活動</span><h2 className="h1" data-en="What’s happening next">接下來這幾場</h2></div><a className="link-arrow" href="/events/"><span data-en="All events">所有活動</span><Icon name="arrow-right" /></a></div><div className="agenda" data-stagger>{[
          ["Weekly session", "社課", "09.18 THU", "用 Python 抓公開資訊觀測站：從爬蟲到能用的資料表", "Scraping MOPS with Python: from crawler to a table you can use", "自備筆電。結束時你會帶走一支能跑的腳本，和一份整理好的上市櫃申報資料。", "Bring a laptop. You leave with a working script and a cleaned dataset of TWSE filings."],
          ["Workshop", "工作坊", "09.27 SAT", "信用風險模型實作：從 LendingClub 資料到一張說得清楚的評分卡", "Credit risk in practice: from LendingClub data to an explainable scorecard", "半天，三人一組。結束前由一位中型銀行的風控主管逐組檢視每張評分卡。", "Half a day, in teams of three. A risk manager from a mid-size bank reviews every scorecard at the end."],
          ["Reading group", "讀書會", "10.02 THU", "《The Pay Off》第 1–3 章：每一筆支付背後那條看不見的軌道", "“The Pay Off”, ch. 1–3: the invisible rails behind every payment", "先讀再吵。線上進行，90 分鐘，每章由一個人帶讀。", "Read first, argue second. Online, 90 minutes, one person leads each chapter."],
        ].map(([enTag, zhTag, date, zhTitle, enTitle, zhBody, enBody], index) => <a className={`card card--event ${index === 0 ? "card--event-lead " : ""}reveal reveal--rise`} href="/events/" key={date}><div className="card__top"><span className="tag" data-en={enTag}>{zhTag}</span><span className="card__index num">{date}</span></div><h3 className="h3" data-en={enTitle}>{zhTitle}</h3><p className="card__body" data-en={enBody}>{zhBody}</p></a>)}</div></div></section>

        <hr className="divider" />

        <section className="section slab" id="contact"><div className="wrap"><div className="reveal"><div className="grid grid-2" style={{ gap: "clamp(32px,5vw,64px)", alignItems: "center" }}><div><span className="eyebrow" data-en="Get in touch">聯絡我們</span><h2 className="h1" data-en="Easiest way in: add the LINE Bot">最快的方式：加 LINE Bot</h2><p className="lead mt-4" data-en="It answers recruitment questions, pushes the weekly digest, and reminds you before every session. A human takes over when it can’t help.">它會回答招募問題、推播每週週報、在每場活動前提醒你。答不出來時會轉給真人。</p><div className="hero__cta mt-6"><a className="btn btn--primary" href="https://page.line.me/nccufintechlab"><Icon name="message" /><span data-en="Add LINE Bot">加入 LINE Bot</span></a><a className="btn" href="mailto:nccufintechlab@gmail.com"><Icon name="mail" /><span>Email</span></a></div></div><div className="pane pane--rows reveal"><div className="ios-list" data-stagger>{[["https://www.instagram.com/nccufintechlab/", "instagram", "Instagram", "@nccufintechlab"], ["https://page.line.me/nccufintechlab", "message", "LINE Bot", "@nccufintechlab"], ["https://www.threads.com/@nccufintechlab", "threads", "Threads", "@nccufintechlab"], ["mailto:nccufintechlab@gmail.com", "mail", "Email", "nccufintechlab@gmail.com"]].map(([href, icon, label, meta]) => <a className="ios-row reveal" href={href} key={label}><span className="ios-row__icon"><Icon name={icon} /></span><span className="ios-row__label">{label}<br /><span className="dim en" style={{ fontSize: ".78rem", fontWeight: 700 }}>{meta}</span></span><Icon name="chevron-right" className="icon ios-row__chev" /></a>)}</div></div></div></div></div></section>

        <section className="section--tight section" id="partners"><div className="wrap"><div className="sec-head reveal reveal--fade" style={{ marginBottom: 32 }}><div><span className="eyebrow" data-en="Partners & mentors">合作對象</span><h2 className="h2" data-en="Who works with us">和我們一起做事的人</h2></div><p className="note" style={{ maxWidth: "34ch" }}><Icon name="alert" /><span data-en="Placeholder entries — swap in real logos and names.">此處為示意項目，之後換成實際的 logo 與名稱。</span></p></div></div><div className="marquee reveal"><div className="marquee__track"><div className="marquee__group">{[["合作企業 01", "Partner Bank 01", "純網銀", "Pure-play digital bank"], ["合作企業 02", "Partner Firm 02", "券商 · 財富科技", "Securities / wealth tech"], ["業師 · 支付", "Mentor · Payments", "跨境清算", "Cross-border settlement"], ["合作新創 03", "Partner Startup 03", "法遵科技 · KYC", "RegTech / KYC"], ["業師 · 信用風險", "Mentor · Credit risk", "中型商業銀行", "Mid-size commercial bank"], ["政大金融科技研究中心", "NCCU FinTech Research Center", "指導單位", "Founding advisor"], ["合作機構 04", "Partner Fund 04", "資產管理", "Asset management"]].map(([zh, en, zhSub, enSub]) => <div className="partner" key={en}><span className="partner__dot" /><span><b data-en={en}>{zh}</b><span data-en={enSub}>{zhSub}</span></span></div>)}</div></div></div></section>
      </main>
    </SitePageShell>
  );
}

import { SitePageShell } from "@/components/layout/SitePageShell";
import { WeekCalendar } from "@/components/home/WeekCalendar";
import { LogoDraw } from "@/components/visual/LogoDraw";
import { partners, projectDecks, weekly } from "@/lib/content";
import { withBasePath } from "@/lib/site-data";

function Icon({ name, className = "icon" }: { name: string; className?: string }) {
  return (
    <svg className={className} aria-hidden="true">
      <use href={`#i-${name}`} />
    </svg>
  );
}

const channels = [
  ["https://page.line.me/nccufintechlab", "message", "LINE Bot", "@nccufintechlab"],
  ["https://www.instagram.com/nccufintechlab/", "instagram", "Instagram", "@nccufintechlab"],
  ["https://www.threads.com/@nccufintechlab", "threads", "Threads", "@nccufintechlab"],
  ["mailto:nccufintechlab@gmail.com", "mail", "Email", "nccufintechlab@gmail.com"],
];

// 我們做的五件事：每張連到對應的內頁段落
// 寫給「對社團有興趣的人」：每張卡講你加入後會得到什麼
// 五張卡用同一個句型：「你會得到什麼」（粗體一句）＋「怎麼得到」（一句）。
// 順序照一個學期的學習路徑：先聽（講座）→ 動手（工作坊）→ 讀與說（讀書會）→ 做出成果（專案）→ 認識人（交流）。
const formats = [
  { icon: "users", zh: "講座", en: "Lectures", getZh: "產業第一手洞察", getEn: "First-hand industry insight", bodyZh: "每學期三位來自不同領域的業界講者，講他們正在解決的問題與判斷的依據。", bodyEn: "Three industry speakers a semester, each from a different sector, on the problems they are solving and how they decide.", href: "/events/#lectures" },
  { icon: "layers", zh: "工作坊", en: "Workshops", getZh: "構想到原型的實作力", getEn: "Concept-to-prototype execution", bodyZh: "三場實作，從痛點拆解到原型、提案與簡報；每一場結束時，手上都有一個做出來的成品。", bodyEn: "Three hands-on sessions, from pain points to prototype, proposal and pitch; you leave each one with something built.", href: "/events/#workshops" },
  { icon: "book", zh: "英語讀書會", en: "English reading club", getZh: "專業領域的英語溝通力", getEn: "Professional English communication", bodyZh: "三本金融科技的書，全程英文導讀與討論，把課堂上學到的東西用英文講出來。", bodyEn: "Three FinTech books, presented and discussed entirely in English, so what you learn in class becomes something you can say.", href: "/events/#reading" },
  { icon: "rocket", zh: "專案", en: "Projects", getZh: "可納入履歷的實作成果", getEn: "Portfolio-ready deliverables", bodyZh: "把講座聽到的與工作坊做過的組合起來，與不同科系的社員組隊，完成一個能放進履歷、公開展示的專案。", bodyEn: "Combine what you heard in lectures and built in workshops: team up across departments and finish a project you can put on a résumé and show in public.", href: "/projects/" },
  { icon: "sparkle", zh: "交流", en: "Networking", getZh: "業界與校友人脈", getEn: "Industry and alumni network", bodyZh: "校友 networking 會、雞尾酒會與學期聚餐，認識已經在業界的校友、業師，和跟你一起做專案的人。", bodyEn: "Alumni networking, a cocktail party and semester dinners: meet alumni already in the industry, mentors, and the people you build with.", href: "/events/#calendar" },
];

// 首頁順序：這是誰 → 做什麼 → 本週 → 最新週報 → 專案 → 合作對象 → 聯絡。每段都是摘要，細節在內頁。
export function HomePage() {
  return (
    <SitePageShell>
      <main id="main" className="page" data-visual-baseline="glass-v6">
        <section className="hero">
          <div className="wrap">
            <div className="hero__grid">
              <div className="reveal">
                <h1 className="display hero__title">
                  <span data-en="NCCU FinTech">政大金融科技</span><br />
                  <span className="grad-text" data-en="Innovation Lab">創新實驗室</span>
                </h1>
                <p className="hero__sub en">NCCU FinTech Innovation Lab</p>
                <p className="lead hero__desc" data-en="Finance × Technology × Industry × Practice">金融 × 科技 × 產學 × 實作</p>
                <div className="hero__cta">
                  <a className="btn btn--primary btn--lg" href="https://page.line.me/nccufintechlab"><Icon name="message" /><span data-en="Add LINE Bot">加入 LINE Bot</span></a>
                  <a className="btn btn--lg" href={withBasePath("/about/#membership")} data-en="Membership info">社員相關資訊</a>
                </div>
              </div>
              <LogoDraw />
            </div>
          </div>
        </section>

        <section className="section--tight section" id="who">
          <div className="wrap">
            <div className="sec-head reveal reveal--fade">
              <div>
                <h2 className="h1" data-en="Who we are">我們是誰</h2>
                <p className="lead mt-4" data-en="If you are curious about FinTech but don’t know where to start, this is the place: open to every department and year including graduate students, guided by the NCCU College of Commerce FinTech Research Center.">如果你對金融科技有興趣、但不知道從哪裡開始，這裡就是起點：不分科系與年級、含研究所，由政大商學院金融科技研究中心指導成立。</p>
              </div>
              <a className="link-arrow" href={withBasePath("/about/")}><span data-en="About us">關於我們</span><Icon name="arrow-right" /></a>
            </div>
            <div className="formats" data-stagger>
              {formats.map((f) => (
                <a className="card format reveal reveal--rise" href={withBasePath(f.href)} key={f.zh}>
                  <span className="ios-row__icon"><Icon name={f.icon} /></span>
                  <h3 className="h3" data-en={f.en}>{f.zh}</h3>
                  <p className="format__get grad-text" data-en={f.getEn}>{f.getZh}</p>
                  <p className="card__body" data-en={f.bodyEn}>{f.bodyZh}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="section section--alt" id="schedule">
          <div className="wrap">
            <div className="sec-head reveal reveal--fade">
              <h2 className="h1" data-en="This week">重要時程</h2>
              <a className="link-arrow" href={withBasePath("/events/")}><span data-en="Full calendar">整學期行事曆</span><Icon name="arrow-right" /></a>
            </div>
            <div className="reveal"><WeekCalendar /></div>
          </div>
        </section>

        <section className="section" id="weekly">
          <div className="wrap">
            <div className="sec-head reveal reveal--fade">
              <h2 className="h1" data-en="FinTech Weekly">FinTech 週報</h2>
              <a className="link-arrow" href={withBasePath("/insights/")}><span data-en="All issues">所有期數</span><Icon name="arrow-right" /></a>
            </div>
            <div className="grid grid-3" data-stagger>
              {weekly.slice(0, 3).map((issue, n) => (
                <a className={`issue__cover issue__cover--link reveal reveal--rise${n === 0 ? " issue__cover--latest" : ""}`} href={withBasePath(`/insights/#vol-${issue.vol}`)} key={issue.vol}>
                  <span className="issue__eyebrow en" data-en={`Vol.${String(issue.vol).padStart(2, "0")}${n === 0 ? " · Latest" : ""}`}>Vol.{String(issue.vol).padStart(2, "0")}{n === 0 ? " · 最新" : ""}</span>
                  <p className="issue__range num">{issue.range}</p>
                  <ol className="issue__headlines issue__headlines--small">
                    {issue.headlines.map((h, i) => <li key={h}><span className="grad-text" data-en={issue.headlinesEn[i]}>{h}</span></li>)}
                  </ol>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="section section--alt" id="projects">
          <div className="wrap">
            <div className="sec-head reveal reveal--fade">
              <h2 className="h1" data-en="Projects">專案</h2>
              <a className="link-arrow" href={withBasePath("/projects/")}><span data-en="All projects">所有專案</span><Icon name="arrow-right" /></a>
            </div>
            <div className="grid grid-3" data-stagger>
              {projectDecks.map((deck) => (
                <a className="card project-teaser reveal reveal--rise" href={withBasePath(`/projects/#${deck.id}`)} key={deck.id}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- GitHub 社群圖 */}
                  <img className="project-teaser__img" src={withBasePath(deck.cover)} alt="" loading="lazy" />
                  <div className="card__top"><h3 className="h3" data-en={deck.nameEn}>{deck.name}</h3>{deck.status === "wip" ? <span className="tag tag--warn" data-en="In progress">進行中</span> : <span className="tag tag--ghost" data-en={deck.ownerEn}>{deck.owner}</span>}</div>
                  <p className="card__body" data-en={deck.taglineEn}>{deck.tagline}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="section--tight section" id="partners">
          <div className="wrap">
            <div className="sec-head reveal reveal--fade" style={{ marginBottom: 24 }}>
              <h2 className="h1" data-en="Partners">合作對象</h2>
            </div>
          </div>
          <div className="marquee reveal">
            <div className="marquee__track">
              <div className="marquee__group">
                {partners.map((partner) => (
                  <a className="partner" key={partner.en} href={partner.href} target="_blank" rel="noopener noreferrer">
                    {/* eslint-disable-next-line @next/next/no-img-element -- 合作單位 logo，靜態檔 */}
                    {partner.logo ? <img className={`partner__logo${"markOnly" in partner ? " partner__logo--mark" : ""}`} src={withBasePath(partner.logo)} alt="" loading="lazy" /> : <span className="partner__dot" />}
                    <b data-en={partner.en}>{partner.zh}</b>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section--tight section" id="contact-wrap">
          <div className="slab reveal" id="contact">
            <div className="wrap" style={{ paddingBlock: "clamp(40px,5vw,72px)" }}>
              <div className="grid grid-2" style={{ gap: "clamp(32px,5vw,64px)", alignItems: "center" }}>
                <div>
                  <h2 className="h1" data-en="Contact">聯絡我們</h2>
                  <p className="lead mt-4" data-en="Membership and session questions: LINE Bot. Collaboration proposals: email.">入社與社課問題透過 LINE Bot；合作提案請寄 Email。</p>
                  {/* 桌機才顯示 QR：手機沒辦法掃自己的螢幕，直接點右邊的 LINE Bot 卡 */}
                  <div className="qr mt-6">
                    {/* eslint-disable-next-line @next/next/no-img-element -- QR code，靜態檔 */}
                    <img className="qr__img" src={withBasePath("/assets/line-qr.png")} alt="LINE Bot QR code" width={480} height={480} loading="lazy" />
                  </div>
                </div>
                <div className="ios-list" data-stagger>
                  {channels.map(([href, icon, label, meta]) => (
                    <a className="ios-row reveal" href={href} key={label}>
                      <span className="ios-row__icon"><Icon name={icon} /></span>
                      <span className="ios-row__label">{label}<br /><span className="dim en ios-row__meta">{meta}</span></span>
                      <Icon name="chevron-right" className="icon ios-row__chev" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </SitePageShell>
  );
}

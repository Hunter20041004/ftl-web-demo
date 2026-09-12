import { SitePageShell } from "@/components/layout/SitePageShell";
import { WeekCalendar } from "@/components/home/WeekCalendar";
import { LogoDraw } from "@/components/visual/LogoDraw";
import { partners, projectDecks, weekly } from "@/lib/content";

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
const formats = [
  { icon: "users", zh: "講座", en: "Lectures", bodyZh: "直接聽業界的人講他們正在做的事：一學期三位講者，來自三個不同領域。", bodyEn: "Hear people from the industry talk about what they are actually doing: three speakers a semester, from three different sectors.", href: "/events/#lectures" },
  { icon: "layers", zh: "工作坊", en: "Workshops", bodyZh: "動手做，不只聽。三場實作，離開時你手上會有原型、提案或簡報。", bodyEn: "Build, not just listen. Three hands-on sessions; you leave with a prototype, a proposal or a pitch deck.", href: "/events/#workshops" },
  { icon: "book", zh: "英語讀書會", en: "English reading club", bodyZh: "用英文討論三本金融科技的書，把專業英文練到能開口。", bodyEn: "Discuss three FinTech books entirely in English and get comfortable speaking the professional vocabulary.", href: "/events/#reading" },
  { icon: "rocket", zh: "專案", en: "Projects", bodyZh: "跟不同科系的人組隊，做出一個能放進履歷、能公開展示的成果。", bodyEn: "Team up across departments and build something you can put on a résumé and show in public.", href: "/projects/" },
  { icon: "sparkle", zh: "交流", en: "Networking", bodyZh: "認識校友、業師和其他社員：networking 會、雞尾酒會、期中與期末聚餐。", bodyEn: "Meet alumni, mentors and other members: networking night, cocktail party, mid-term and end-of-term dinners.", href: "/events/#calendar" },
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
                  <a className="btn btn--lg" href="/about/#membership" data-en="Membership info">社員相關資訊</a>
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
                <p className="lead mt-4" data-en="If you are curious about FinTech but don’t know where to start, this is the place: NCCU’s first FinTech student society, open to every department and year including graduate students, guided by the NCCU College of Commerce FinTech Research Center. One session every Wednesday — here is what you get.">如果你對金融科技有興趣、但不知道從哪裡開始，這裡就是起點：政大第一個 FinTech 學術社團，不分科系與年級、含研究所，由政大商學院金融科技研究中心指導成立。每週三一堂社課，你會得到這五件事。</p>
              </div>
              <a className="link-arrow" href="/about/"><span data-en="About us">關於我們</span><Icon name="arrow-right" /></a>
            </div>
            <div className="formats" data-stagger>
              {formats.map((f) => (
                <a className="card format reveal reveal--rise" href={f.href} key={f.zh}>
                  <span className="ios-row__icon"><Icon name={f.icon} /></span>
                  <h3 className="h3" data-en={f.en}>{f.zh}</h3>
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
              <a className="link-arrow" href="/events/"><span data-en="Full calendar">整學期行事曆</span><Icon name="arrow-right" /></a>
            </div>
            <div className="reveal"><WeekCalendar /></div>
          </div>
        </section>

        <section className="section" id="weekly">
          <div className="wrap">
            <div className="sec-head reveal reveal--fade">
              <h2 className="h1" data-en="FinTech Weekly">FinTech 週報</h2>
              <a className="link-arrow" href="/insights/"><span data-en="All issues">所有期數</span><Icon name="arrow-right" /></a>
            </div>
            <div className="grid grid-3" data-stagger>
              {weekly.slice(0, 3).map((issue, n) => (
                <a className={`issue__cover issue__cover--link reveal reveal--rise${n === 0 ? " issue__cover--latest" : ""}`} href={`/insights/#vol-${issue.vol}`} key={issue.vol}>
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
              <a className="link-arrow" href="/projects/"><span data-en="All projects">所有專案</span><Icon name="arrow-right" /></a>
            </div>
            <div className="grid grid-3" data-stagger>
              {projectDecks.map((deck) => (
                <a className="card project-teaser reveal reveal--rise" href={`/projects/#${deck.id}`} key={deck.id}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- GitHub 社群圖 */}
                  <img className="project-teaser__img" src={deck.cover} alt="" loading="lazy" />
                  <div className="card__top"><h3 className="h3" data-en={deck.nameEn}>{deck.name}</h3><span className="tag tag--ghost" data-en={deck.ownerEn}>{deck.owner}</span></div>
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
                  <div className="partner" key={partner.en}><span className="partner__dot" /><b data-en={partner.en}>{partner.zh}</b></div>
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
                  <p className="lead mt-4" data-en="Recruitment and session questions: LINE Bot. Collaboration and press: email.">招募與社課問題找 LINE Bot；合作與採訪請寄 Email。</p>
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

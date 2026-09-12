import { SitePageShell } from "@/components/layout/SitePageShell";
import { LogoDraw } from "@/components/visual/LogoDraw";
import { WeekCalendar } from "@/components/home/WeekCalendar";
import { partners } from "@/lib/content";

function Icon({ name, className = "icon" }: { name: string; className?: string }) {
  return (
    <svg className={className} aria-hidden="true">
      <use href={`#i-${name}`} />
    </svg>
  );
}

const channels = [
  ["https://www.instagram.com/nccufintechlab/", "instagram", "Instagram", "@nccufintechlab"],
  ["https://page.line.me/nccufintechlab", "message", "LINE Bot", "@nccufintechlab"],
  ["https://www.threads.com/@nccufintechlab", "threads", "Threads", "@nccufintechlab"],
  ["mailto:nccufintechlab@gmail.com", "mail", "Email", "nccufintechlab@gmail.com"],
];

// 首頁只放三件事：本週重要時程、怎麼找到我們、合作對象。細節都在內頁。
export function HomePage() {
  return (
    <SitePageShell>
      <main id="main" className="page" data-visual-baseline="glass-v6">
        <section className="hero">
          <div className="wrap">
            <div className="hero__grid">
              <div className="reveal">
                <span className="eyebrow" data-en="Founded under the guidance of the NCCU College of Commerce FinTech Research Center">政大商學院金融科技研究中心 指導成立</span>
                <h1 className="display hero__title">
                  <span data-en="NCCU FinTech">政大金融科技</span><br />
                  <span className="grad-text" data-en="Innovation Lab">創新實驗室</span>
                </h1>
                <p className="hero__sub" data-en="NCCU’s first FinTech student society · AI × FinTech × Business">政大第一個 FinTech 學術社團 · AI × FinTech × Business</p>
                <p className="lead hero__desc" data-en="Every Wednesday this semester: 3 industry lectures, 3 hands-on workshops, 3 English reading sessions, plus alumni networking. Project-member applications are open until 09/17.">這學期每週三：3 場業界講座、3 場實務工作坊、3 場英語讀書會，加上校友交流。專案生報名至 9/17。</p>
                <div className="hero__cta">
                  <a className="btn btn--primary btn--lg" href="/about/#join"><span data-en="Apply as a project member">報名專案生</span><Icon name="arrow-right" /></a>
                  <a className="btn btn--lg" href="https://page.line.me/nccufintechlab"><Icon name="message" /><span data-en="Add LINE Bot">加入 LINE Bot</span></a>
                </div>
              </div>
              <LogoDraw />
            </div>
          </div>
        </section>

        <section className="section" id="schedule">
          <div className="wrap">
            <div className="sec-head reveal reveal--fade">
              <h2 className="h1" data-en="This week">重要時程</h2>
              <a className="link-arrow" href="/events/"><span data-en="Full calendar">整學期行事曆</span><Icon name="arrow-right" /></a>
            </div>
            <div className="reveal"><WeekCalendar /></div>
          </div>
        </section>

        <section className="section--tight section" id="contact-wrap">
          <div className="slab reveal" id="contact">
            <div className="wrap" style={{ paddingBlock: "clamp(40px,5vw,72px)" }}>
              <div className="grid grid-2" style={{ gap: "clamp(32px,5vw,64px)", alignItems: "center" }}>
                <div>
                  <h2 className="h1" data-en="Contact">聯絡我們</h2>
                  <p className="lead mt-4" data-en="Recruitment and session questions: LINE Bot. Collaboration and press: email.">招募與社課問題找 LINE Bot；合作與採訪請寄 Email。</p>
                  <div className="hero__cta mt-6">
                    <a className="btn" href="https://page.line.me/nccufintechlab"><Icon name="message" /><span data-en="Add LINE Bot">加入 LINE Bot</span></a>
                    <a className="btn btn--primary" href="mailto:nccufintechlab@gmail.com"><Icon name="mail" /><span>Email</span></a>
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
      </main>
    </SitePageShell>
  );
}

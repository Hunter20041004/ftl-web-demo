import { SitePageShell } from "@/components/layout/SitePageShell";
import { LogoDraw } from "@/components/visual/LogoDraw";
import { calendar, calendarKinds, lectures, membership, partners, semester } from "@/lib/content";

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

// 首頁只放三件事：現在正在招募、這學期上什麼、怎麼找到我們。細節都在內頁。
export function HomePage() {
  const upcoming = calendar.filter((item) => item.kind !== "school").slice(1, 5);
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
                  <a className="btn btn--primary btn--lg" href="/join/"><span data-en="Apply as a project member">報名專案生</span><Icon name="arrow-right" /></a>
                  <a className="btn btn--lg" href="https://page.line.me/nccufintechlab"><Icon name="message" /><span data-en="Add LINE Bot">加入 LINE Bot</span></a>
                </div>
              </div>
              <LogoDraw />
            </div>
          </div>
        </section>

        <section className="section--tight section" id="recruit">
          <div className="wrap">
            <div className="sec-head reveal reveal--fade">
              <div><span className="eyebrow" data-en="Recruitment">招募時程</span><h2 className="h1" data-en="Project-member admissions, 115-1">115-1 專案生招募</h2></div>
              <a className="link-arrow" href="/join/"><span data-en="Fees, rewards and how to apply">社費、獎勵金與報名方式</span><Icon name="arrow-right" /></a>
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

        <section className="section section--alt" id="semester">
          <div className="wrap">
            <div className="sec-head reveal reveal--fade">
              <div>
                <span className="eyebrow" data-en="This semester">本學期</span>
                <h2 className="h1" data-en={`${semester.range} · ${semester.meetingDayEn}`}>{semester.range} · {semester.meetingDay}</h2>
                <p className="lead mt-4" data-en={semester.conceptEn}>{semester.concept}</p>
              </div>
              <a className="link-arrow" href="/courses/"><span data-en="Full course plan">完整課程規劃</span><Icon name="arrow-right" /></a>
            </div>
            <div className="principles" data-stagger>
              {lectures.map((lecture) => (
                <a className="principle glass reveal reveal--rise" href="/courses/#lectures" key={lecture.week}>
                  <span className="principle__n">{lecture.date}</span>
                  <h3>{lecture.title}</h3>
                  <p>{lecture.speaker}｜{lecture.role}，{lecture.org}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="events">
          <div className="wrap">
            <div className="sec-head reveal reveal--fade">
              <div><span className="eyebrow" data-en="Upcoming">近期社課</span><h2 className="h1" data-en="Next four sessions">接下來四堂</h2></div>
              <a className="link-arrow" href="/events/"><span data-en="Semester calendar">整學期行事曆</span><Icon name="arrow-right" /></a>
            </div>
            <div className="agenda" data-stagger>
              {upcoming.map((item, index) => (
                <a className={`card card--event ${index === 0 ? "card--event-lead " : ""}reveal reveal--rise`} href="/events/" key={item.week}>
                  <div className="card__top"><span className={calendarKinds[item.kind].tag} data-en={calendarKinds[item.kind].en}>{calendarKinds[item.kind].zh}</span><span className="card__index num">{item.date} · W{item.week}</span></div>
                  <h3 className="h3" data-en={item.en}>{item.zh}</h3>
                  <p className="card__body" data-en={item.noteEn}>{item.note}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="section--tight section" id="contact-wrap">
          <div className="slab reveal" id="contact">
            <div className="wrap" style={{ paddingBlock: "clamp(40px,5vw,72px)" }}>
              <div className="grid grid-2" style={{ gap: "clamp(32px,5vw,64px)", alignItems: "center" }}>
                <div>
                  <span className="eyebrow" data-en="Get in touch">聯絡我們</span>
                  <h2 className="h1" data-en="Questions? Ask the LINE Bot">有問題，先問 LINE Bot</h2>
                  <p className="lead mt-4" data-en="Recruitment questions, session reminders and check-in all run through the LINE Bot. A person takes over when it can’t answer.">招募問題、社課提醒、簽到都在 LINE Bot 上。答不出來的會轉給幹部。</p>
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
              <div><span className="eyebrow" data-en="Partners & speakers">合作單位與講者</span><h2 className="h2" data-en="Who we work with this semester">這學期一起合作的單位</h2></div>
            </div>
          </div>
          <div className="marquee reveal">
            <div className="marquee__track">
              <div className="marquee__group">
                {partners.map((partner) => (
                  <div className="partner" key={partner.en}><span className="partner__dot" /><span><b data-en={partner.en}>{partner.zh}</b><span data-en={partner.subEn}>{partner.sub}</span></span></div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </SitePageShell>
  );
}

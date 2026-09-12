import { SitePageShell } from "@/components/layout/SitePageShell";
import { leadership, semester } from "@/lib/content";

function Icon({ name }: { name: string }) {
  return (
    <svg className="icon" aria-hidden="true">
      <use href={`#i-${name}`} />
    </svg>
  );
}

// 關於我們：社團是什麼、成立資訊、幹部組織。姓名依社團提供的名單（遮罩形式）。
export function AboutPage() {
  return (
    <SitePageShell>
      <main id="main" className="page">
        <section className="pagehead">
          <div className="wrap reveal">
            <span className="eyebrow" data-en="About">關於我們</span>
            <h1 className="h1" data-en="NCCU’s first FinTech student society">政大第一個 FinTech 學術社團</h1>
            <p className="lead" data-en="Founded under the guidance of the NCCU College of Commerce FinTech Research Center. Each semester we run industry lectures, hands-on workshops, English reading sessions and alumni networking, organised around one theme.">由政大商學院金融科技研究中心指導成立。每學期以一個主題串起業界講座、實務工作坊、英語讀書會與校友交流，本學期主題是 {semester.focus}。</p>
          </div>
        </section>

        <section className="section--tight section" id="facts">
          <div className="wrap">
            <div className="grid grid-2" style={{ gap: "clamp(24px,4vw,48px)", alignItems: "start" }}>
              <div className="panel reveal">
                <span className="eyebrow" data-en="Facts">成立資訊</span>
                <dl className="info-list">
                  <div className="info"><dt data-en="Founded">成立</dt><dd><b className="num">2026.05.10</b><br /><span className="dim" style={{ fontSize: ".9rem" }} data-en="Date of the first Instagram post">以 Instagram 第一篇貼文的日期為準</span></dd></div>
                  <div className="info"><dt data-en="Advisor">指導單位</dt><dd data-en="NCCU College of Commerce FinTech Research Center">政大商學院金融科技研究中心</dd></div>
                  <div className="info"><dt data-en="Open to">招收對象</dt><dd data-en="All departments and years, including graduate students">跨系、跨年級、含研究所</dd></div>
                  <div className="info"><dt data-en="Meets">社課時間</dt><dd>{semester.meetingDay}（{semester.range}）</dd></div>
                  <div className="info"><dt data-en="Tagline">標語</dt><dd data-en="Finance × Technology × Industry × Practice">金融 × 科技 × 產學 × 實作</dd></div>
                </dl>
              </div>
              <div className="reveal">
                <span className="eyebrow" data-en="How a semester works">一個學期怎麼運作</span>
                <h2 className="h2" data-en="Four formats, in rotation">四種形式，輪流進行</h2>
                <ul className="bullets-plain mt-4">
                  <li><b data-en="Lectures｜">講座｜</b><span data-en="Three industry speakers per semester, one each from a different sector.">每學期三位業界講者，各來自不同領域。</span></li>
                  <li><b data-en="Workshops｜">工作坊｜</b><span data-en="Three hands-on sessions led by officers and guest instructors, each producing something concrete (a prototype, a proposal, a pitch deck).">三場由幹部群與客座講師帶領的實作，每場都有產出：原型、提案、簡報。</span></li>
                  <li><b data-en="English reading club｜">英語讀書會｜</b><span data-en="Three books, discussed entirely in English.">三本書，全程英文討論。</span></li>
                  <li><b data-en="Networking｜">交流｜</b><span data-en="Alumni networking, a cocktail party and semester dinners.">校友 networking 會、雞尾酒會、期中與期末聚餐。</span></li>
                </ul>
                <a className="link-arrow mt-5" href="/courses/"><span data-en="See this semester’s courses">看這學期的課程</span><Icon name="arrow-right" /></a>
              </div>
            </div>
          </div>
        </section>

        <section className="section section--alt" id="members">
          <div className="wrap">
            <div className="sec-head reveal reveal--fade">
              <div><span className="eyebrow" data-en="Officers">幹部</span><h2 className="h1" data-en="President, vice president and four departments">社長、副社長與四個部門</h2></div>
              <p className="note"><Icon name="alert" /><span data-en="Names are partially masked as provided by the society.">姓名依社團提供的名單，部分遮罩。</span></p>
            </div>
            <div className="grid grid-2" style={{ marginBottom: 18 }} data-stagger>
              <article className="card reveal reveal--rise">
                <span className="member__role" data-en="President">社長</span>
                <h3 className="h2">{leadership.president.name}</h3>
                <p className="card__body">{leadership.president.dept}</p>
              </article>
              <article className="card reveal reveal--rise">
                <span className="member__role" data-en="Vice President">副社長</span>
                <h3 className="h2">{leadership.vicePresident.name}</h3>
                <p className="card__body">{leadership.vicePresident.dept}</p>
              </article>
            </div>
            <div className="grid grid-4" data-stagger>
              {leadership.departments.map((dept) => (
                <article className="card reveal reveal--rise" key={dept.name}>
                  <span className="member__role" data-en={dept.en}>{dept.name}</span>
                  <ul className="roster">
                    {dept.members.map((member) => (
                      <li key={member.name}><b>{member.name}</b><span className="dim">{member.dept}</span></li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </SitePageShell>
  );
}

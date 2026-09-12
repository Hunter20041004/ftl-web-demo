import { SitePageShell } from "@/components/layout/SitePageShell";
import { MembershipTabs } from "@/components/about/MembershipTabs";
import { leadership, membership } from "@/lib/content";

function Icon({ name }: { name: string }) {
  return (
    <svg className="icon" aria-hidden="true">
      <use href={`#i-${name}`} />
    </svg>
  );
}

// 關於我們：社團是什麼、成立資訊、指導單位、幹部、社員相關資訊、常見問題。
// 幹部一人一格（預留照片位）；姓名依社團提供的名單（遮罩形式）。
const officers = [
  { role: "社長", roleEn: "President", ...leadership.president },
  { role: "副社長", roleEn: "Vice President", ...leadership.vicePresident },
  ...leadership.departments.flatMap((dept) => dept.members.map((m) => ({ role: dept.name, roleEn: dept.en, ...m }))),
];

export function AboutPage() {
  return (
    <SitePageShell>
      <main id="main" className="page">
        <section className="pagehead">
          <div className="wrap reveal">
            <span className="eyebrow" data-en="About">關於我們</span>
            <h1 className="h1" data-en="NCCU’s first FinTech student society">政大第一個 FinTech 學術社團</h1>
            <p className="lead" data-en="Founded under the guidance of the NCCU College of Commerce FinTech Research Center.">由政大商學院金融科技研究中心指導成立。</p>
          </div>
        </section>

        <section className="section--tight section" id="facts">
          <div className="wrap">
            <div className="grid grid-2" style={{ gap: "clamp(24px,4vw,48px)", alignItems: "start" }}>
              <div className="panel reveal">
                <h2 className="h2" data-en="Facts">成立資訊</h2>
                <dl className="info-list">
                  <div className="info"><dt data-en="Founded">成立</dt><dd><b className="num">2026.05.10</b></dd></div>
                  <div className="info"><dt data-en="Open to">招收對象</dt><dd data-en="All departments and years, including graduate students">跨系、跨年級、含研究所</dd></div>
                  <div className="info"><dt data-en="Tagline">標語</dt><dd data-en="Finance × Technology × Industry × Practice">金融 × 科技 × 產學 × 實作</dd></div>
                </dl>
              </div>
              <div className="panel reveal" id="center" style={{ padding: "clamp(24px,3.5vw,44px)" }}>
                <h2 className="h2" data-en="Advisor">指導單位</h2>
                <p className="h3 mt-4" data-en="NCCU College of Commerce FinTech Research Center">政大商學院金融科技研究中心</p>
                <dl className="info-list mt-6">
                  <div className="info"><dt data-en="Website">網站</dt><dd><a href="https://www.ftrc.nccu.edu.tw/" target="_blank" rel="noopener noreferrer">ftrc.nccu.edu.tw</a></dd></div>
                  <div className="info"><dt data-en="Address">地址</dt><dd data-en="Room 302, 3F, Yi-Xian Building, No. 64, Sec. 2, Zhinan Rd., Wenshan Dist., Taipei 116">116 臺北市文山區指南路二段 64 號<br />逸仙樓 3 樓 302 室</dd></div>
                  <div className="info"><dt data-en="Phone">電話</dt><dd><a href="tel:+886229393091,65306">02-2939-3091 <span data-en="ext.">分機</span> 65306</a></dd></div>
                  <div className="info"><dt>Email</dt><dd><a href="mailto:ftrc@nccu.edu.tw">ftrc@nccu.edu.tw</a></dd></div>
                </dl>
              </div>
            </div>
          </div>
        </section>

        <section className="section--tight section" id="how" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="panel reveal" style={{ maxWidth: 860 }}>
                <h2 className="h2" data-en="How a semester works">一個學期怎麼運作</h2>
                <ul className="bullets-plain mt-4">
                  <li><b data-en="Lectures｜">講座｜</b><span data-en="Three industry speakers per semester, one each from a different sector.">每學期三位業界講者，各來自不同領域。</span></li>
                  <li><b data-en="Workshops｜">工作坊｜</b><span data-en="Three hands-on sessions led by officers and guest instructors, each producing something concrete (a prototype, a proposal, a pitch deck).">三場由幹部群與客座講師帶領的實作，每場都有產出：原型、提案、簡報。</span></li>
                  <li><b data-en="English reading club｜">英語讀書會｜</b><span data-en="Three books, discussed entirely in English.">三本書，全程英文討論。</span></li>
                  <li><b data-en="Networking｜">交流｜</b><span data-en="Alumni networking, a cocktail party and semester dinners.">校友 networking 會、雞尾酒會、期中與期末聚餐。</span></li>
                </ul>
                <a className="link-arrow mt-5" href="/events/#lectures"><span data-en="See this semester’s courses">看這學期的課程</span><Icon name="arrow-right" /></a>
            </div>
          </div>
        </section>

        <section className="section section--alt" id="members">
          <div className="wrap">
            <div className="sec-head reveal reveal--fade">
              <h2 className="h1" data-en="Officers">幹部</h2>
            </div>
            <div className="grid grid-4" data-stagger>
              {officers.map((officer) => (
                <article className="card member reveal reveal--rise" key={`${officer.role}-${officer.name}`}>
                  <div className="member__ava" aria-hidden="true"><span className="member__initial">{officer.name.slice(0, 1)}</span></div>
                  <div>
                    <span className="member__role" data-en={officer.roleEn}>{officer.role}</span>
                    <h3 className="h3">{officer.name}</h3>
                    <p className="card__body" data-en={officer.deptEn}>{officer.dept}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 社員相關資訊：照「加入 → 報名 → 繳費 → 出席領回」的順序講一次，重複的數字不再各段重講 */}
        <section className="section" id="membership">
          <div className="wrap">
            <div className="sec-head reveal reveal--fade">
              <h2 className="h1" data-en="Membership">社員相關資訊</h2>
              <a className="btn btn--primary" href="https://page.line.me/nccufintechlab"><Icon name="message" /><span data-en="Apply via LINE Bot">透過 LINE Bot 報名</span></a>
            </div>

            <MembershipTabs />
          </div>
        </section>

        <section className="section--tight section section--alt" id="faq">
          <div className="wrap">
            <div className="sec-head reveal reveal--fade">
              <h2 className="h1" data-en="FAQ">常見問題</h2>
            </div>
            <div className="faq" data-stagger>
              {membership.faq.map(([q, a, qEn, aEn]) => (
                <details className="faq__item card reveal" key={q}>
                  <summary className="faq__q"><span data-en={qEn}>{q}</span><Icon name="chevron-right" /></summary>
                  <p className="card__body" data-en={aEn}>{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
    </SitePageShell>
  );
}

import { SitePageShell } from "@/components/layout/SitePageShell";
import { leadership, membership, semester } from "@/lib/content";

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
            <p className="lead" data-en="Founded under the guidance of the NCCU College of Commerce FinTech Research Center. Each semester we run industry lectures, hands-on workshops, English reading sessions and alumni networking, organised around one theme.">由政大商學院金融科技研究中心指導成立。每學期以一個主題串起業界講座、實務工作坊、英語讀書會與校友交流，本學期主題是 {semester.focus}。</p>
          </div>
        </section>

        <section className="section--tight section" id="facts">
          <div className="wrap">
            <div className="grid grid-2" style={{ gap: "clamp(24px,4vw,48px)", alignItems: "start" }}>
              <div className="panel reveal">
                <h2 className="h2" data-en="Facts">成立資訊</h2>
                <dl className="info-list">
                  <div className="info"><dt data-en="Founded">成立</dt><dd><b className="num">2026.05.10</b><br /><span className="dim" style={{ fontSize: ".9rem" }} data-en="Date of the first Instagram post">以 Instagram 第一篇貼文的日期為準</span></dd></div>
                  <div className="info"><dt data-en="Advisor">指導單位</dt><dd data-en="NCCU College of Commerce FinTech Research Center">政大商學院金融科技研究中心</dd></div>
                  <div className="info"><dt data-en="Open to">招收對象</dt><dd data-en="All departments and years, including graduate students">跨系、跨年級、含研究所</dd></div>
                  <div className="info"><dt data-en="Meets">社課時間</dt><dd>{semester.meetingDay}（{semester.range}）</dd></div>
                  <div className="info"><dt data-en="Tagline">標語</dt><dd data-en="Finance × Technology × Industry × Practice">金融 × 科技 × 產學 × 實作</dd></div>
                </dl>
              </div>
              <div className="reveal">
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
          </div>
        </section>

        <section className="section--tight section" id="advisor" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div style={{ maxWidth: 720 }}>
              <div className="panel reveal" id="center" style={{ padding: "clamp(24px,3.5vw,44px)" }}>
                <h2 className="h2" data-en="Advisor">指導單位</h2>
                <p className="h3 mt-4" data-en="NCCU College of Commerce FinTech Research Center">政大商學院金融科技研究中心</p>
                <p className="lead mt-4" style={{ fontSize: "1rem" }} data-en="FTL was founded under the Center’s guidance. For academic collaboration or matters concerning the FinTech program, contact the Center directly.">FTL 在研究中心指導下成立。學術合作、研究夥伴，或與金融科技學程本身有關的事，請直接聯絡研究中心。</p>
                <dl className="info-list mt-6">
                  <div className="info"><dt data-en="Website">網站</dt><dd><a href="https://www.ftrc.nccu.edu.tw/" target="_blank" rel="noopener noreferrer">ftrc.nccu.edu.tw</a></dd></div>
                  <div className="info"><dt data-en="Address">地址</dt><dd data-en="Room 302, 3F, Yi-Xian Building, No. 64, Sec. 2, Zhinan Rd., Wenshan Dist., Taipei 116">116 臺北市文山區指南路二段 64 號<br />逸仙樓 3 樓 302 室</dd></div>
                  <div className="info"><dt data-en="Phone">電話</dt><dd><a href="tel:+886229393091,65306">02-2939-3091 <span data-en="ext.">分機</span> 65306</a></dd></div>
                  <div className="info"><dt>Email</dt><dd><a href="mailto:ftrc@nccu.edu.tw">ftrc@nccu.edu.tw</a></dd></div>
                </dl>
                <p className="note mt-6"><Icon name="alert" /><span data-en="Sourced from the Center’s official site on 2026-09-09. Confirm with the Center before publishing.">2026-09-09 取自研究中心官網，上線前仍請向中心確認。</span></p>
              </div>
            </div>
          </div>
        </section>

        <section className="section section--alt" id="members">
          <div className="wrap">
            <div className="sec-head reveal reveal--fade">
              <h2 className="h1" data-en="Officers">幹部</h2>
              <p className="note"><Icon name="alert" /><span data-en="Names are partially masked as provided by the society; photos to be added.">姓名依社團提供的名單，部分遮罩；照片待補。</span></p>
            </div>
            <div className="grid grid-4" data-stagger>
              {officers.map((officer) => (
                <article className="card member reveal reveal--rise" key={`${officer.role}-${officer.name}`}>
                  <div className="member__ava" aria-hidden="true"><Icon name="users" /></div>
                  <span className="member__role" data-en={officer.roleEn}>{officer.role}</span>
                  <h3 className="h3">{officer.name}</h3>
                  <p className="card__body">{officer.dept}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 社員相關資訊：照「加入 → 報名 → 繳費 → 出席領回」的順序講一次，重複的數字不再各段重講 */}
        <section className="section" id="membership">
          <div className="wrap">
            <div className="sec-head reveal reveal--fade">
              <div><h2 className="h1" data-en="Membership">社員相關資訊</h2><p className="lead mt-4" data-en="115-1 semester. Two membership types; project members go through screening and interviews, and get part of the fee back based on attendance.">115-1 學期。社員分兩種身份；專案生經書審與面試錄取，並依出席堂數在期末領回部分社費。</p></div>
              <a className="btn btn--primary" href="https://page.line.me/nccufintechlab"><Icon name="message" /><span data-en="Apply via LINE Bot">透過 LINE Bot 報名</span></a>
            </div>

            <div className="flow" data-stagger>
              <article className="flow__step reveal reveal--rise" id="types">
                <span className="flow__n">1</span>
                <div className="flow__body">
                  <h3 className="h2" data-en="Choose a membership type">選擇身份</h3>
                  <div className="grid grid-2 mt-4">
                    {membership.types.map((type) => (
                      <div className="card" key={type.name}>
                        <div className="card__top"><h4 className="h3" data-en={type.en}>{type.name}</h4><span className="tag num">{type.fee}</span></div>
                        <p className="card__body"><b data-en="How｜">入社方式｜</b>{type.how}</p>
                        <p className="card__body"><b data-en="Includes｜">包含｜</b>{type.perks}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </article>

              <article className="flow__step reveal reveal--rise" id="timeline">
                <span className="flow__n">2</span>
                <div className="flow__body">
                  <h3 className="h2" data-en="Apply (project members)">報名（專案生）</h3>
                  <p className="card__body mt-3" data-en="Fill in the Google form and submit a résumé; interviews are held in groups. Auditors skip this step and pay directly through the LINE Bot.">填寫 Google 表單並繳交履歷，面試採團體面試。旁聽生免書審，直接到步驟 3 透過 LINE Bot 繳費。</p>
                  <ol className="timeline-glass mt-5">
                    {membership.timeline.map((step) => (
                      <li className={`tstep${step.done ? " tstep--done" : ""}`} key={step.date}>
                        <span className="tstep__date num">{step.date}</span>
                        <span className="tstep__label" data-en={step.en}>{step.zh}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </article>

              <article className="flow__step reveal reveal--rise" id="payment">
                <span className="flow__n">3</span>
                <div className="flow__body">
                  <h3 className="h2" data-en="Pay through the LINE Bot">繳費</h3>
                  <ol className="steps mt-4">
                    {membership.payment.map((step, index) => (
                      <li className="card" key={step}><span className="numchip">{index + 1}</span><p className="card__body">{step}</p></li>
                    ))}
                  </ol>
                  <p className="dim mt-4" style={{ fontSize: ".95rem" }} data-en="Cash is not accepted, except at the counter on welcome night.">不接受現金；迎新當日設現金收費櫃台並開立收據。</p>
                </div>
              </article>

              <article className="flow__step reveal reveal--rise" id="reward">
                <span className="flow__n">4</span>
                <div className="flow__body">
                  <h3 className="h2" data-en="Attend, then get part of the fee back">出席，期末領回</h3>
                  <p className="card__body mt-3" data-en="Project members only. Eleven sessions count; the reward is paid at the end of term based on how many you attended.">僅專案生適用。計 11 堂，期末依出席堂數發放。</p>
                  <div className="grid grid-2 mt-4" style={{ alignItems: "start" }}>
                    <div className="panel">
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
                      <div className="card"><h4 className="h3" data-en="How attendance is counted">出席怎麼算</h4><p className="card__body">{membership.reward.attendance}</p></div>
                      <div className="card"><h4 className="h3" data-en="When it is paid">什麼時候發</h4><p className="card__body">{membership.reward.payout}</p></div>
                      <div className="card"><h4 className="h3" data-en="Points prize (separate)">積分獎金（另計）</h4><p className="card__body">{membership.reward.points}</p></div>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="section--tight section section--alt" id="faq">
          <div className="wrap">
            <div className="sec-head reveal reveal--fade">
              <h2 className="h1" data-en="FAQ">常見問題</h2>
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

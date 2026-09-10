import { SitePageShell } from "@/components/layout/SitePageShell";

function Icon({ name, className = "icon" }: { name: string; className?: string }) {
  return <svg className={className} aria-hidden="true"><use href={`#i-${name}`} /></svg>;
}

const members = [
  ["President", "President — name TBC", "社長（待補）", "Finance, senior", "財政系 · 大四"],
  ["Vice President", "Vice President — name TBC", "副社長（待補）", "MIS, junior", "資訊管理系 · 大三"],
  ["Academic Lead", "Academic Lead — name TBC", "學術長（待補）", "Statistics, senior", "統計系 · 大四"],
  ["Project Lead", "Project Lead — name TBC", "專案長（待補）", "Finance, junior", "金融系 · 大三"],
  ["Tech Lead", "Tech Lead — name TBC", "技術長（待補）", "Computer Science, senior", "資訊科學系 · 大四"],
  ["Marketing Lead", "Marketing Lead — name TBC", "行銷長（待補）", "Advertising, junior", "廣告系 · 大三"],
  ["Events Lead", "Events Lead — name TBC", "活動長（待補）", "Business Administration, sophomore", "企業管理系 · 大二"],
  ["Treasurer", "Treasurer — name TBC", "財務長（待補）", "Accounting, junior", "會計系 · 大三"],
] as const;

export function AboutPage() {
  return (
    <SitePageShell>
      <main id="main" className="page">
        <section className="pagehead">
          <div className="wrap reveal">
            <span className="eyebrow" data-en="About">關於我們</span>
            <h1 className="h1" data-en="A club built because the course ended and nothing happened next">一個因為「課上完就沒有下文」而生的社團</h1>
            <p className="lead" data-en="FTL exists to close the gap between finishing a FinTech program and actually having done something. Below: what we insist on, how we started, and who is running it.">FTL 存在的理由，是把「修完金融科技學程」和「真的做過東西」之間那段空白補起來。以下是我們堅持的事、怎麼開始的，以及現在是誰在跑。</p>
          </div>
        </section>

        <section className="section--tight section section--alt" id="mission">
          <div className="wrap">
            <div className="panel reveal" style={{ padding: "clamp(24px,4vw,56px)" }}>
              <span className="eyebrow" data-en="Our mission">社團宗旨</span>
              <h2 className="h2" data-en="Three things we insist on">我們堅持的三件事</h2>
              <div className="grid grid-3 mt-6" data-stagger>
                <article className="reveal">
                  <span className="ios-row__icon"><Icon name="rocket" /></span>
                  <h3 className="h3 mt-4" data-en="Ship it, don’t just discuss it">做出來，不只是討論</h3>
                  <p className="card__body" data-en="Every term, every team ships one thing that works — a model, a dashboard, or a report someone outside the club actually reads. “We researched it” does not count as a deliverable.">每學期每組都要交出一個能用的東西：一個模型、一個儀表板，或一份社團以外的人真的會讀的報告。「我們有研究」不算成果。</p>
                </article>
                <article className="reveal">
                  <span className="ios-row__icon"><Icon name="layers" /></span>
                  <h3 className="h3 mt-4" data-en="Finance and code in the same room">金融與程式坐在同一張桌子</h3>
                  <p className="card__body" data-en="Teams are deliberately mixed — finance, MIS, statistics, law. The friction between someone who knows the regulation and someone who knows the model is where the good questions come from.">分組刻意混編：財金、資管、統計、法律。懂法規的人和懂模型的人互相聽不懂的地方，往往就是好問題出現的地方。</p>
                </article>
                <article className="reveal">
                  <span className="ios-row__icon"><Icon name="building" /></span>
                  <h3 className="h3 mt-4" data-en="Keep one foot in the industry">一隻腳踩在業界</h3>
                  <p className="card__body" data-en="Mentors from banks, brokerages and startups review our work every term — not as a guest lecture, but as a critique of what we actually built.">每學期請銀行、券商與新創的業師來看我們的東西——不是演講，是針對成果的批評。被講難聽話也是成果的一部分。</p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="story">
          <div className="wrap">
            <div className="grid grid-2" style={{ gap: "clamp(32px,5vw,72px)", alignItems: "start" }}>
              <div className="reveal">
                <span className="eyebrow" data-en="How we started">成立背景</span>
                <h2 className="h1" data-en="From a complaint in a group chat to a chartered society">從群組裡的一句抱怨，到正式立案的社團</h2>
                <p className="lead mt-5" data-en="A handful of students in the FinTech program realised they had all taken the same courses, and none of them had anything to show for it. The club came out of that conversation — and out of the willingness of the College of Commerce FinTech Research Center to back it.">一群修完金融科技學程的學生發現：大家上了同樣的課，卻沒有人拿得出東西。這個社團就是從那場對話開始的——以及商學院金融科技研究中心願意背書。</p>
              </div>
              <div className="panel reveal" style={{ padding: "clamp(24px,3.5vw,40px)" }}>
                <dl className="info-list">
                  <div className="info"><dt data-en="Founded">成立</dt><dd><span className="en" style={{ fontSize: "1.3rem", fontWeight: 900, letterSpacing: "-.03em" }}>2026.05.10</span><br /><span className="dim" style={{ fontSize: ".85rem" }} data-en="Dated from the first post on Instagram">以 Instagram 第一篇貼文的日期為準</span></dd></div>
                  <div className="info"><dt data-en="Advisor">指導單位</dt><dd data-en="NCCU College of Commerce FinTech Research Center">政大商學院金融科技研究中心</dd></div>
                  <div className="info"><dt data-en="Open to">招收對象</dt><dd data-en="All departments, all year levels">跨系、跨年級，全校開放</dd></div>
                  <div className="info" style={{ borderBottom: 0 }}><dt data-en="What we do">我們做什麼</dt><dd data-en="Finance × Technology × Industry × Building things">金融 × 科技 × 產學 × 實作</dd></div>
                </dl>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="members">
          <div className="wrap">
            <div className="sec-head reveal">
              <div><span className="eyebrow" data-en="The team">成員</span><h2 className="h1" data-en="Who’s running FTL">現在是誰在跑 FTL</h2></div>
              <p className="note"><Icon name="alert" /><span data-en="Placeholder people and photos — replace with the real roster.">此區為示意人員與照片，之後換成實際名單。</span></p>
            </div>
            <div className="grid grid-4" data-stagger>
              {members.map(([role, enName, zhName, enDept, zhDept]) => (
                <article className="card member reveal" key={role}>
                  <div className="member__ava"><span>—</span></div>
                  <span className="member__role">{role}</span>
                  <h3 className="h3" data-en={enName}>{zhName}</h3>
                  <p className="card__body" style={{ fontSize: ".86rem" }} data-en={enDept}>{zhDept}</p>
                  <div className="member__meta">
                    <span className="dim" data-en="Email — TBC">信箱（待填）</span>
                    <span className="dim"><Icon name="linkedin" />LinkedIn（待填）</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </SitePageShell>
  );
}

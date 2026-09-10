import { SitePageShell } from "@/components/layout/SitePageShell";

function Icon({ name, className = "icon" }: { name: string; className?: string }) {
  return <svg className={className} aria-hidden="true"><use href={`#i-${name}`} /></svg>;
}

const socials = [
  ["https://www.instagram.com/nccufintechlab/", "instagram", "Instagram", "@nccufintechlab"],
  ["https://page.line.me/nccufintechlab", "message", "LINE Bot", "@nccufintechlab"],
  ["https://www.threads.com/@nccufintechlab", "threads", "Threads", "@nccufintechlab"],
  ["mailto:nccufintechlab@gmail.com", "mail", "Email", "nccufintechlab@gmail.com"],
] as const;

export function ContactPage() {
  return (
    <SitePageShell>
      <main id="main" className="page">
        <section className="pagehead">
          <div className="wrap reveal">
            <span className="eyebrow" data-en="Contact">聯絡我們</span>
            <h1 className="h1" data-en="Pick whichever is least effort for you">挑一個對你最不費力的方式</h1>
            <p className="lead" data-en="The LINE bot is fastest and answers most recruitment questions on its own. For collaboration or press, email works better.">LINE Bot 最快，而且大部分招募問題它自己就能回答。談合作或媒體採訪，走 Email 比較好。</p>
          </div>
        </section>

        <section className="section--tight section contact-channel">
          <div className="wrap">
            <div className="panel reveal" style={{ padding: "clamp(28px,4vw,56px)" }}>
              <div className="grid grid-2" style={{ gap: "clamp(32px,5vw,64px)", alignItems: "center" }}>
                <div>
                  <span className="ios-row__icon contact-channel__mark"><Icon name="message" /></span>
                  <h2 className="h1 mt-5" data-en="FTL LINE Bot">FTL LINE Bot</h2>
                  <p className="lead mt-4" data-en="Answers recruitment questions, pushes the weekly digest every Monday, and reminds you before each event. When it can’t help, a human takes over within a day.">回答招募問題、每週一推播週報、每場活動前提醒你。答不出來時，一天內轉給真人。</p>
                  <div className="hero__cta mt-6">
                    <a className="btn btn--primary btn--lg" href="https://page.line.me/nccufintechlab"><Icon name="message" /><span data-en="Add on LINE">加入好友</span></a>
                    <a className="btn btn--lg" href="mailto:nccufintechlab@gmail.com"><Icon name="mail" /><span>Email</span></a>
                  </div>
                  <p className="note mt-6"><Icon name="check" /><span data-en="LINE Bot, Instagram, Threads and email verified 2026-09-09.">LINE Bot、Instagram、Threads 與信箱皆為 2026-09-09 查證過的實際帳號。</span></p>
                </div>

                <div className="ios-list" data-stagger="">
                  {socials.map(([href, icon, label, meta]) => (
                    <a className="ios-row reveal" href={href} key={label}>
                      <span className="ios-row__icon"><Icon name={icon} /></span>
                      <span className="ios-row__label">{label}<br /><span className="dim num contact-channel__meta">{meta}</span></span>
                      <Icon name="chevron-right" className="icon ios-row__chev" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section section--alt contact-detail">
          <div className="wrap">
            <div className="grid grid-2" style={{ gap: "clamp(32px,5vw,64px)", alignItems: "start" }}>
              <div className="reveal">
                <span className="eyebrow" data-en="Write to us">寫信給我們</span>
                <h2 className="h2" data-en="Collaboration, media, or just a question">合作、採訪，或只是有個問題</h2>
                <form className="mt-6" data-demo-form="" noValidate>
                  <div className="field">
                    <label htmlFor="f-name">姓名 <span className="req">*</span></label>
                    <input id="f-name" name="name" type="text" required autoComplete="name" placeholder="王小明" data-en-ph="Your name" />
                    <span className="field__err"><Icon name="alert" /><span data-en="Please enter your name">請填寫姓名</span></span>
                  </div>
                  <div className="field">
                    <label htmlFor="f-email">Email <span className="req">*</span></label>
                    <input id="f-email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" data-en-ph="you@example.com" />
                    <span className="field__hint" data-en="We reply within two working days.">我們會在兩個工作天內回覆。</span>
                    <span className="field__err"><Icon name="alert" /><span data-en="Please enter a valid email address">請填寫正確的 Email 格式</span></span>
                  </div>
                  <div className="field">
                    <label htmlFor="f-msg">訊息內容 <span className="req">*</span></label>
                    <textarea id="f-msg" name="message" required placeholder="想談的合作、想問的問題，或想加入我們的理由。" data-en-ph="What you’d like to work on, ask about, or why you want to join." />
                    <span className="field__err"><Icon name="alert" /><span data-en="Please write a message">請填寫訊息內容</span></span>
                  </div>
                  <button className="btn btn--primary btn--lg btn--block" type="submit"><span data-en="Send">送出</span><Icon name="arrow-right" /></button>
                  <p className="form-note"><Icon name="check" /><span data-en="Sent. This is a demo form — nothing was actually delivered.">已送出。這是示意表單，實際上沒有寄出任何東西。</span></p>
                </form>
              </div>

              <div className="panel reveal" id="center" style={{ padding: "clamp(24px,3.5vw,44px)" }}>
                <span className="eyebrow" data-en="Our advisor">指導單位</span>
                <h2 className="h2" data-en="NCCU College of Commerce FinTech Research Center">政大商學院金融科技研究中心</h2>
                <p className="lead mt-4" style={{ fontSize: "1rem" }} data-en="FTL was founded under the Center’s guidance. For academic collaboration, research partnerships, or matters concerning the FinTech program itself, contact the Center directly.">FTL 在研究中心指導下成立。學術合作、研究夥伴，或與金融科技學程本身有關的事，請直接聯絡研究中心。</p>
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
      </main>
    </SitePageShell>
  );
}

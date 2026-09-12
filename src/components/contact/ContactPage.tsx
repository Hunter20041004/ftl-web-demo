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
            <h1 className="h1" data-en="Contact">聯絡方式</h1>
            <p className="lead" data-en="Recruitment and session questions: LINE Bot. Collaboration and press: email.">招募與社課問題找 LINE Bot；合作與媒體採訪請寄 Email。</p>
          </div>
        </section>

        <section className="section--tight section contact-channel">
          <div className="wrap">
            <div className="panel reveal" style={{ padding: "clamp(28px,4vw,56px)" }}>
              <div className="grid grid-2" style={{ gap: "clamp(32px,5vw,64px)", alignItems: "center" }}>
                <div>
                  <span className="ios-row__icon contact-channel__mark"><Icon name="message" /></span>
                  <h2 className="h1 mt-5" data-en="FTL LINE Bot">FTL LINE Bot</h2>
                  <p className="lead mt-4" data-en="Recruitment questions, payment, session reminders and check-in all run through the LINE Bot. When it can’t help, an officer takes over.">招募問題、繳費、社課提醒與簽到都在 LINE Bot 上。答不出來時由幹部接手。</p>
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
                <span className="eyebrow" data-en="Email">Email</span>
                <h2 className="h2" data-en="Collaboration, press, sponsorship">合作、採訪、贊助</h2>
                <p className="lead mt-4" data-en="Write to the society mailbox. Officers check it on weekdays.">寫信到社團信箱，幹部平日會看信。</p>
                <a className="btn btn--primary btn--lg mt-6" href="mailto:nccufintechlab@gmail.com"><Icon name="mail" /><span>nccufintechlab@gmail.com</span></a>
                <dl className="info-list mt-6">
                  <div className="info"><dt data-en="Instagram">Instagram</dt><dd><a href="https://www.instagram.com/nccufintechlab/" target="_blank" rel="noopener noreferrer">@nccufintechlab</a></dd></div>
                  <div className="info"><dt data-en="Threads">Threads</dt><dd><a href="https://www.threads.com/@nccufintechlab" target="_blank" rel="noopener noreferrer">@nccufintechlab</a></dd></div>
                </dl>
              </div>

              <div className="panel reveal" id="center" style={{ padding: "clamp(24px,3.5vw,44px)" }}>
                <span className="eyebrow" data-en="Our advisor">指導單位</span>
                <h2 className="h2" data-en="NCCU College of Commerce FinTech Research Center">政大商學院金融科技研究中心</h2>
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
      </main>
    </SitePageShell>
  );
}

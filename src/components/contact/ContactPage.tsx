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
            <span className="eyebrow" data-en="Contact" suppressHydrationWarning>聯絡我們</span>
            <h1 className="h1" data-en="Contact" suppressHydrationWarning>聯絡方式</h1>
            <p className="lead" data-en="Membership and session questions: LINE Bot. Collaboration proposals: email." suppressHydrationWarning>入社與社課問題透過 LINE Bot；合作提案請寄 Email。</p>
          </div>
        </section>

        <section className="section--tight section contact-channel">
          <div className="wrap">
            <div className="panel reveal" style={{ padding: "clamp(28px,4vw,56px)" }}>
              <div className="grid grid-2" style={{ gap: "clamp(32px,5vw,64px)", alignItems: "center" }}>
                <div>
                  <span className="ios-row__icon contact-channel__mark"><Icon name="message" /></span>
                  <h2 className="h1 mt-5" data-en="FTL LINE Bot" suppressHydrationWarning>FTL LINE Bot</h2>
                  <p className="lead mt-4" data-en="Recruitment questions, payment, session reminders and check-in all run through the LINE Bot. When it can’t help, an officer takes over." suppressHydrationWarning>招募問題、繳費、社課提醒與簽到都在 LINE Bot 上。答不出來時由幹部接手。</p>
                  <div className="hero__cta mt-6">
                    <a className="btn btn--primary btn--lg" href="https://page.line.me/nccufintechlab"><Icon name="message" /><span data-en="Add on LINE" suppressHydrationWarning>加入好友</span></a>
                    <a className="btn btn--lg" href="mailto:nccufintechlab@gmail.com"><Icon name="mail" /><span>Email</span></a>
                  </div>
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
                <h2 className="h2">Email</h2>
                <a className="btn btn--primary btn--lg mt-6" href="mailto:nccufintechlab@gmail.com"><Icon name="mail" /><span>nccufintechlab@gmail.com</span></a>
                <dl className="info-list mt-6">
                  <div className="info"><dt data-en="Instagram" suppressHydrationWarning>Instagram</dt><dd><a href="https://www.instagram.com/nccufintechlab/" target="_blank" rel="noopener noreferrer">@nccufintechlab</a></dd></div>
                  <div className="info"><dt data-en="Threads" suppressHydrationWarning>Threads</dt><dd><a href="https://www.threads.com/@nccufintechlab" target="_blank" rel="noopener noreferrer">@nccufintechlab</a></dd></div>
                </dl>
              </div>

            </div>
          </div>
        </section>
      </main>
    </SitePageShell>
  );
}

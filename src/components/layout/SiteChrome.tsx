"use client";

import { usePathname } from "next/navigation";
import { navItems, socialItems, withBasePath } from "@/lib/site-data";

function Icon({ name, className = "" }: { name: string; className?: string }) {
  return (
    <svg className={`icon ${className}`.trim()} aria-hidden="true">
      <use href={`#i-${name}`} />
    </svg>
  );
}

function normalizePath(pathname: string) {
  const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");
  const withoutBase = basePath && pathname.startsWith(basePath) ? pathname.slice(basePath.length) : pathname;
  if (!withoutBase || withoutBase === "/") return "/";
  return `${withoutBase.replace(/\/$/, "")}/`;
}

export function SiteHeader() {
  const pathname = usePathname();
  const current = normalizePath(pathname);
  const logoSrc = withBasePath("/assets/ftl-logo.png");

  return (
    <>
      <div className="devbar">
        <span className="devbar__dot" aria-hidden="true" />
        <span
          data-en="Work in progress — numbers, roster, partners and events on this site are placeholders, not official information."
        >
          開發中的展示版 —— 站上的人數、幹部名單、合作對象與活動皆為示意資料，非正式資訊。
        </span>
      </div>
      <div id="site-header">
        <a className="skip" href="#main" data-en="Skip to main content">跳到主要內容</a>
        <header className="nav" data-stuck="false">
          <div className="wrap nav__inner">
            <a className="brand" href={withBasePath("/")} aria-label="NCCU FinTech Innovation Lab">
              <img src={logoSrc} alt="FTL · FinTech Lab · NCCU" width="733" height="692" />
              <span className="brand__id">NCCU FinTech Innovation Lab</span>
            </a>
            <nav className="nav__links" aria-label="主要導覽">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  className="nav__link"
                  href={withBasePath(item.href)}
                  data-en={item.en}
                  aria-current={current === item.href ? "page" : undefined}
                >
                  {item.zh}
                </a>
              ))}
            </nav>
            <div className="nav__side">
              <div className="lang" data-lang="zh" role="group" aria-label="Language / 語言">
                <span className="lang__slider" aria-hidden="true" />
                <button className="lang__btn" type="button" data-set-lang="zh" aria-pressed="true">中文</button>
                <button className="lang__btn" type="button" data-set-lang="en" aria-pressed="false">EN</button>
              </div>
              <button className="nav__burger" type="button" data-menu-open aria-label="開啟選單" aria-expanded="false">
                <Icon name="menu" />
              </button>
            </div>
          </div>
        </header>
        <div className="sheet" data-open="false" id="mobile-sheet" role="dialog" aria-modal="true" aria-label="選單">
          <div className="wrap" style={{ padding: 0 }}>
            <div className="sheet__head">
              <a className="brand" href={withBasePath("/")}>
                <img src={logoSrc} alt="FTL · FinTech Lab · NCCU" width="733" height="692" />
              </a>
              <button className="nav__burger" style={{ display: "grid" }} type="button" data-menu-close aria-label="關閉選單">
                <Icon name="close" />
              </button>
            </div>
            <nav className="sheet__list" aria-label="主要導覽">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  className="sheet__link"
                  href={withBasePath(item.href)}
                  aria-current={current === item.href ? "page" : undefined}
                >
                  <span data-en={item.en}>{item.zh}</span>
                  <Icon name="chevron-right" />
                </a>
              ))}
            </nav>
            <div className="sheet__foot">
              <a className="btn btn--primary btn--block btn--lg" href={withBasePath("/contact/")} data-en="Join FTL">加入 FTL</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function FooterColumn({ title, en, items }: {
  title: string;
  en: string;
  items: Array<{ href: string; zh: string; en: string }>;
}) {
  return (
    <div>
      <h4 data-en={en}>{title}</h4>
      <div className="footer__list">
        {items.map((item) => (
          <a key={item.href} href={item.href.startsWith("/") ? withBasePath(item.href) : item.href} data-en={item.en}>{item.zh}</a>
        ))}
      </div>
    </div>
  );
}

export function SiteFooter() {
  const logoSrc = withBasePath("/assets/ftl-logo.png");
  return (
    <footer id="site-footer" className="footer">
      <div className="wrap">
        <div className="footer__top">
          <div className="footer__brand">
            <img className="flogo" src={logoSrc} alt="FTL · FinTech Lab · NCCU" />
            <p data-en="Finance × Technology × Industry × Building things. NCCU’s first FinTech academic society.">金融 × 科技 × 產學 × 實作。政大第一個 FinTech 學術社團。</p>
            <div className="social">
              {socialItems.map((item) => (
                <a key={item.href} href={item.href} aria-label={item.label} title={item.label}>
                  <Icon name={item.icon} />
                </a>
              ))}
            </div>
          </div>
          <FooterColumn title="探索" en="Explore" items={[
            { href: "/about/", zh: "關於我們", en: "About" },
            { href: "/projects/", zh: "專案", en: "Projects" },
            { href: "/insights/", zh: "洞察", en: "Insights" },
            { href: "/events/", zh: "活動", en: "Events" },
          ]} />
          <FooterColumn title="資源" en="Resources" items={[
            { href: "/resources/#jobs", zh: "職缺快報", en: "Job Alerts" },
            { href: "/resources/#library", zh: "FTL 圖書館", en: "FTL Library" },
            { href: "/resources/#contests", zh: "競賽資訊", en: "Competitions" },
            { href: "/insights/#weekly", zh: "FinTech 週報", en: "Weekly Digest" },
          ]} />
          <FooterColumn title="聯絡" en="Contact" items={[
            { href: "https://page.line.me/nccufintechlab", zh: "LINE Bot", en: "LINE Bot" },
            { href: "mailto:nccufintechlab@gmail.com", zh: "Email", en: "Email" },
            { href: "https://www.instagram.com/nccufintechlab/", zh: "Instagram", en: "Instagram" },
            { href: "https://www.threads.com/@nccufintechlab", zh: "Threads", en: "Threads" },
          ]} />
        </div>
      </div>
      <div className="footer__bar">
        <div className="wrap footer__bottom">
          <span data-en="© 2026 NCCU FinTech Innovation Lab · Demo site">© 2026 政大金融科技創新實驗室 · 展示用網站</span>
          <span data-en="Guided by the NCCU College of Commerce FinTech Research Center">政大商學院金融科技研究中心 指導成立</span>
        </div>
      </div>
    </footer>
  );
}

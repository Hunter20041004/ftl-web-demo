import type { Metadata } from "next";
import "./globals.css";

const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");
const siteUrl = `https://hunter20041004.github.io${basePath || "/ftl-web-demo"}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl.endsWith("/") ? siteUrl : `${siteUrl}/`),
  title: {
    default: "政大金融科技創新實驗室",
    template: "%s ｜ 政大金融科技創新實驗室",
  },
  description: "政大第一個 FinTech 學術社團。金融 × 科技 × 產學 × 實作：業界講座、實務工作坊、英語讀書會、FinTech 週報。",
  robots: { index: false, follow: false },
  openGraph: {
    type: "website",
    locale: "zh_TW",
    siteName: "政大金融科技創新實驗室",
    title: "政大金融科技創新實驗室 NCCU FinTech Innovation Lab",
    description: "政大第一個 FinTech 學術社團。金融 × 科技 × 產學 × 實作。",
    images: [{ url: "/assets/og.png", width: 1200, height: 630, alt: "NCCU FinTech Innovation Lab" }],
  },
  twitter: { card: "summary_large_image" },
};

// 與 SiteInteractions.translateElement 同一套規則：data-zh 存原文、innerHTML 換成 data-en
const EARLY_LANG_SCRIPT = `try{if(localStorage.getItem('ftl-lang')==='en'){var d=document;d.documentElement.lang='en';d.querySelectorAll('[data-en]').forEach(function(e){if(e.dataset.zh===undefined)e.dataset.zh=e.innerHTML;if(e.innerHTML!==e.dataset.en)e.innerHTML=e.dataset.en});d.querySelectorAll('[data-en-ph]').forEach(function(e){if(e.dataset.zhPh===undefined)e.dataset.zhPh=e.placeholder;e.placeholder=e.dataset.enPh||e.placeholder});d.querySelectorAll('.lang').forEach(function(e){e.dataset.lang='en'});d.querySelectorAll('[data-set-lang]').forEach(function(e){e.setAttribute('aria-pressed',String(e.dataset.setLang==='en'))})}}catch(e){}document.documentElement.classList.remove('lang-pending')`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant-TW" suppressHydrationWarning>
      <head>
        {/* 英文模式：在第一次繪製前先把頁面藏起來（規則直接內嵌，不等外部 CSS），等 body 尾端的翻譯腳本換完字再顯示 */}
        <style dangerouslySetInnerHTML={{ __html: "html.lang-pending body{visibility:hidden}" }} />
        <script dangerouslySetInnerHTML={{ __html: "try{if(localStorage.getItem('ftl-lang')==='en')document.documentElement.classList.add('lang-pending')}catch(e){}" }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Huninn&family=IBM+Plex+Mono:wght@400;500&display=swap" />
        <link rel="stylesheet" href={`${basePath}/assets/v6.css`} />
      </head>
      <body>
        {children}
        {/* 翻譯不等 React：DOM 解析完就用原生 JS 把 data-en 換上去，React 掛載時靠 suppressHydrationWarning 接受英文內容 */}
        <script dangerouslySetInnerHTML={{ __html: EARLY_LANG_SCRIPT }} />
      </body>
    </html>
  );
}

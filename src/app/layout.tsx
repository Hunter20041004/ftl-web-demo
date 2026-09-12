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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant-TW" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Huninn&family=IBM+Plex+Mono:wght@400;500&display=swap" />
        <link rel="stylesheet" href={`${basePath}/assets/v6.css`} />
      </head>
      <body>{children}</body>
    </html>
  );
}

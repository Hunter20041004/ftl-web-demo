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
  description: "政大第一個 FinTech 學術社團。週報、產學合作、自主專案、社課與工作坊。",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant-TW" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;600;800;900&family=Noto+Sans+TC:wght@400;500;700;900&display=swap" />
        <link rel="stylesheet" href={`${basePath}/assets/ftl.css`} />
        <link rel="stylesheet" href={`${basePath}/assets/transaction-network.css`} />
        <link rel="stylesheet" href={`${basePath}/assets/transaction-panels.css`} />
      </head>
      <body>{children}</body>
    </html>
  );
}

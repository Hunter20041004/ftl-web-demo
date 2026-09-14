import type { Metadata } from "next";
import "./admin.css";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: "後台 ｜ 政大金融科技創新實驗室",
  robots: { index: false, follow: false },
};

// 後台自己的 root layout：不載前台的 v6.css，只用 admin.css（Tailwind＋shadcn 代幣）。
export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant-TW">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Huninn&display=swap" />
      </head>
      <body>
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { SitePageShell } from "@/components/layout/SitePageShell";

export const metadata: Metadata = { title: "隱私權政策 ｜ 政大金融科技創新實驗室" };

// 給 Google 登入審核與訪客看的隱私權說明：後台只用 Google 帳號的 email 辨識管理員。
export default function PrivacyPage() {
  return (
    <SitePageShell>
      <main id="main" className="page">
        <section className="pagehead">
          <div className="wrap reveal">
            <span className="eyebrow" data-en="Privacy" suppressHydrationWarning>隱私權政策</span>
            <h1 className="h1" data-en="Privacy policy" suppressHydrationWarning>隱私權政策</h1>
            <p className="lead" data-en="Last updated 2026-09-14" suppressHydrationWarning>最後更新：2026-09-14</p>
          </div>
        </section>
        <section className="section--tight section">
          <div className="wrap">
            <div className="panel reveal" style={{ maxWidth: 760 }}>
              <h2 className="h2" data-en="What the public site collects" suppressHydrationWarning>公開網站蒐集什麼</h2>
              <p className="card__body mt-4" data-en="Nothing. The public site is static: it sets no cookies and runs no analytics. The language you choose is stored only in your own browser." suppressHydrationWarning>不蒐集任何資料。公開網站是靜態網頁，不放 cookie、不做流量分析；你選的語言只存在你自己的瀏覽器裡。</p>
              <h2 className="h2 mt-6" data-en="What the admin area uses" suppressHydrationWarning>後台用到什麼</h2>
              <p className="card__body mt-4" data-en="Officers sign in to the admin area with a Google account. We receive only the account’s email address and display name, and use them solely to check whether the account is on the officer list and to record who edited what. Nothing is shared with third parties or used for marketing." suppressHydrationWarning>幹部用 Google 帳號登入後台。我們只會取得該帳號的 email 與顯示名稱，用途只有兩個：確認帳號在幹部名單上、記錄是誰改了內容。不會提供給第三方，也不做行銷用途。</p>
              <h2 className="h2 mt-6" data-en="Where it is stored and how to remove it" suppressHydrationWarning>存在哪裡、怎麼移除</h2>
              <p className="card__body mt-4" data-en="Login records are stored in the society’s Supabase project. To have your account removed from the officer list and its login records deleted, email nccufintechlab@gmail.com." suppressHydrationWarning>登入紀錄存在社團的 Supabase 專案。要從幹部名單移除帳號並刪除登入紀錄，請寄信到 nccufintechlab@gmail.com。</p>
            </div>
          </div>
        </section>
      </main>
    </SitePageShell>
  );
}

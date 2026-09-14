"use client";

import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { hasSupabaseConfig } from "@/lib/admin/supabase";
import { signInWithGoogle, signOut, useIsAdmin, useSession } from "@/lib/admin/auth";
import { withBasePath } from "@/lib/site-data";

// 後台的外殼與登入閘。四種狀態：沒設定 Supabase／沒登入／登入但不是管理員／管理員。
const NAV = [
  { href: "/admin/", label: "總覽" },
  { href: "/admin/partners/", label: "合作對象" },
  { href: "/admin/admins/", label: "管理員" },
  { href: "/admin/trash/", label: "已刪除" },
];

const subscribePath = (cb: () => void) => { window.addEventListener("popstate", cb); return () => window.removeEventListener("popstate", cb); };
const usePathname = () => useSyncExternalStore(subscribePath, () => window.location.pathname, () => "");

export function AdminShell({ children }: { children: React.ReactNode }) {
  const configured = hasSupabaseConfig();
  const session = useSession();
  const isAdmin = useIsAdmin(session?.user.email);
  const pathname = usePathname();

  if (!configured) return <Center><p className="text-muted-foreground">尚未設定 Supabase（NEXT_PUBLIC_SUPABASE_URL）。</p></Center>;
  if (session === undefined) return <Center><p className="text-muted-foreground">載入中…</p></Center>;
  if (session === null) {
    return (
      <Center>
        <div className="w-full max-w-sm glass glass-lift p-8">
          <p className="text-sm font-semibold text-primary">NCCU FinTech Innovation Lab</p>
          <h1 className="mt-2 text-2xl font-bold">後台</h1>
          <p className="mt-2 text-sm text-muted-foreground">用社團登記過的 Google 帳號登入。</p>
          <Button className="mt-6 w-full rounded-full" size="lg" onClick={() => void signInWithGoogle()}>使用 Google 登入</Button>
        </div>
      </Center>
    );
  }
  if (isAdmin === undefined) return <Center><p className="text-muted-foreground">確認權限中…</p></Center>;
  if (!isAdmin) {
    return (
      <Center>
        <div className="w-full max-w-sm glass glass-lift p-8">
          <h1 className="text-xl font-bold">這個帳號沒有權限</h1>
          <p className="mt-2 text-sm text-muted-foreground">{session.user.email}<br />請聯絡社長把這個 email 加進管理員名單。</p>
          <Button variant="outline" className="mt-6 rounded-full" onClick={() => void signOut()}>登出</Button>
        </div>
      </Center>
    );
  }

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-60 shrink-0 flex-col bg-white/55 backdrop-blur-md shadow-[var(--shadow-soft)]">
        <div className="px-5 py-5">
          <p className="text-xs font-semibold tracking-wide text-primary">NCCU FINTECH LAB</p>
          <p className="text-lg font-bold grad-text inline-block">後台</p>
        </div>
        <nav className="flex flex-col gap-1 px-3">
          {NAV.map((item) => {
            const active = pathname.endsWith(item.href.replace(/^\//, "/")) || pathname === withBasePath(item.href);
            return (
              <a key={item.href} href={withBasePath(item.href)} className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${active ? "bg-secondary text-primary" : "text-foreground hover:bg-muted"}`}>
                {item.label}
              </a>
            );
          })}
        </nav>
        <div className="mt-auto px-5 py-4 text-xs text-muted-foreground">
          <p className="truncate" title={session.user.email}>{session.user.email}</p>
          <button type="button" className="mt-1 font-medium text-primary hover:underline" onClick={() => void signOut()}>登出</button>
        </div>
      </aside>
      <main className="min-w-0 flex-1 px-8 py-8">{children}</main>
    </div>
  );
}

function Center({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-screen items-center justify-center p-6">{children}</div>;
}

"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabase } from "./supabase.ts";
import { withBasePath } from "@/lib/site-data";

// 登入狀態：undefined＝還在問 Supabase；null＝沒登入
export function useSession() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  useEffect(() => {
    const sb = getSupabase();
    sb.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = sb.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);
  return session;
}

// 是否在 admins 名單裡：RLS 之下，不在名單的人查 admins 會拿到 0 列，等於「不是」
// 回傳 true／false，或 { error } 代表查不到（例如免費專案閒置中、網路斷線）
export function useIsAdmin(email: string | undefined): boolean | { error: string } | undefined {
  const [state, setState] = useState<boolean | { error: string } | undefined>(undefined);
  useEffect(() => {
    if (!email) return;
    let cancelled = false;
    Promise.resolve(getSupabase().from("admins").select("email").eq("email", email.toLowerCase()).maybeSingle())
      .then(({ data, error }) => { if (!cancelled) setState(error ? { error: error.message } : Boolean(data)); })
      .catch((e: Error) => { if (!cancelled) setState({ error: e.message }); });
    return () => { cancelled = true; };
  }, [email]);
  return email ? state : undefined;
}

export async function signInWithGoogle() {
  await getSupabase().auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${window.location.origin}${withBasePath("/admin/")}` },
  });
}

export async function signOut() {
  await getSupabase().auth.signOut();
}

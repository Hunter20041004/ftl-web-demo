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
export function useIsAdmin(email: string | undefined) {
  const [isAdmin, setIsAdmin] = useState<boolean | undefined>(undefined);
  useEffect(() => {
    if (!email) return;
    let cancelled = false;
    getSupabase().from("admins").select("email").eq("email", email.toLowerCase()).maybeSingle()
      .then(({ data }) => { if (!cancelled) setIsAdmin(Boolean(data)); });
    return () => { cancelled = true; };
  }, [email]);
  return email ? isAdmin : undefined;
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

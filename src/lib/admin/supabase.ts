"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// 後台跟 Supabase 講話的唯一入口。anon key 設計上可公開；真正的權限靠資料庫的 RLS 與使用者的登入 token。
let client: SupabaseClient | null = null;

export const hasSupabaseConfig = () =>
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export function getSupabase(): SupabaseClient {
  if (!client) {
    client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    // E2E 測試用同一個 client 以 email/password 登入（畫面上只有 Google 按鈕）
    if (typeof window !== "undefined") (window as unknown as { __ftlSupabase: SupabaseClient }).__ftlSupabase = client;
  }
  return client;
}

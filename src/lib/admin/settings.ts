// 學期設定：settings 表 id='default'，data = { semester, membership }（前台形狀）
import { membershipSchema, semesterSchema } from "../content.schema.ts";
import type { z } from "zod";
import { getSupabase } from "./supabase.ts";

export type Settings = { semester: z.infer<typeof semesterSchema>; membership: z.infer<typeof membershipSchema> };

export async function getSettings(): Promise<Settings> {
  const { data, error } = await getSupabase().from("settings").select("data").eq("id", "default").single();
  if (error) throw new Error(error.message);
  return data.data as Settings;
}

export async function saveSettings(settings: Settings) {
  const { error } = await getSupabase().from("settings").update({ data: settings, status: "published" }).eq("id", "default");
  if (error) throw new Error(error.message);
}

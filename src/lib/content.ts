// 門面：元件一律 import "@/lib/content"。實際資料分兩處——
// content.static.ts：留在程式裡的；content.remote.ts：從快照（Supabase）來的。
export * from "./content.static.ts";
export * from "./content.remote.ts";

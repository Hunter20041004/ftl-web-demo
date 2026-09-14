// 圖片上傳：縮圖後存到 media bucket 的指定資料夾，回傳前台用的 /media/... 路徑。
import { getSupabase } from "./supabase.ts";
import { resizeImage } from "./image.ts";

export async function uploadMedia(file: File, folder: string, maxEdge: number): Promise<string> {
  const blob = await resizeImage(file, maxEdge);
  const ext = blob.type === "image/svg+xml" ? "svg" : blob.type === "image/png" ? "png" : "jpg";
  const slug = file.name.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "image";
  const path = `${folder}/${slug}-${Date.now()}.${ext}`;
  const { error } = await getSupabase().storage.from("media").upload(path, blob, { contentType: blob.type, upsert: false });
  if (error) throw new Error(error.message);
  return `/media/${path}`;
}

export function publicMediaUrl(mediaPath: string) {
  return getSupabase().storage.from("media").getPublicUrl(mediaPath.replace(/^\/media\//, "")).data.publicUrl;
}

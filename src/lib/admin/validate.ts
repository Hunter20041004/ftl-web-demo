// 發布前的驗證：直接用前台的 zod schema。錯誤對到「a.b.0.c」這種欄位路徑，訊息改成中文。
import type { ZodType } from "zod";

export function zodErrors(schema: ZodType, data: unknown): Record<string, string> {
  const result = schema.safeParse(data);
  if (result.success) return {};
  const out: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const path = issue.path.join(".") || "(root)";
    if (out[path]) continue;
    out[path] = translate(issue.code, issue.message);
  }
  return out;
}

function translate(code: string, message: string) {
  if (code === "invalid_type" && /received undefined|expected string|expected number/.test(message)) return "必填";
  if (code === "too_small") return /string/.test(message) || /characters/.test(message) ? "必填" : "數量不足";
  if (code === "invalid_value" || code === "invalid_enum_value") return "選項不對";
  if (code === "invalid_format") return "格式不對";
  if (code === "invalid_union" || code === "invalid_union_discriminator") return "類型不對";
  return message;
}

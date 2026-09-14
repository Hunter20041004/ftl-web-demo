// 瀏覽器端縮圖：SVG 原樣；其他格式畫到 canvas 縮到最長邊 maxEdge。有透明的存 PNG，否則 JPEG。
export async function resizeImage(file: File, maxEdge: number): Promise<Blob> {
  if (file.type === "image/svg+xml") return file;
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale), h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0, w, h);
  const type = file.type === "image/png" || file.type === "image/webp" ? "image/png" : "image/jpeg";
  return new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("縮圖失敗"))), type, 0.85));
}

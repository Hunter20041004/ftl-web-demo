// 靜態檢查：站內連結一定要包 withBasePath()。
// 預覽站部署在子路徑（/Hunter20041004/ftl-web-demo/preview-glass-v6/），
// 沒包的 href="/about/" 在本機能用、上了預覽站就 404，Playwright 在本機測不出來。
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../src/components/", import.meta.url));
const files = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith(".tsx")) files.push(p);
  }
})(root);

const bad = [];
for (const file of files) {
  readFileSync(file, "utf8").split("\n").forEach((line, i) => {
    // href="/x" 或 href={`/x…`}：站內路徑直接寫死，沒有經過 withBasePath
    if (/href="\/[a-z]/.test(line) || /href=\{`\/[a-z]/.test(line)) bad.push(`${file.replace(root, "src/components/")}:${i + 1}`);
  });
}
if (bad.length) {
  console.error("站內連結沒有包 withBasePath()：\n  " + bad.join("\n  "));
  process.exit(1);
}
console.log(`internal links ok (${files.length} files)`);

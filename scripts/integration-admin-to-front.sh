#!/usr/bin/env bash
# 整合驗證：後台畫面建六類各一筆（測試專案）→ pull-content → next build → 前台 HTML 真的有 → 清掉。
set -euo pipefail
cd "$(dirname "$0")/.."
set -a; . ./.env.local; set +a
export INTEGRATION=1
npx playwright test --project=admin create-samples --reporter=line 2>&1 | tail -1
cp src/lib/content.snapshot.json /tmp/snapshot.before.json
SUPABASE_URL=$SUPABASE_TEST_URL SUPABASE_SERVICE_KEY=$SUPABASE_TEST_SERVICE_KEY node scripts/pull-content.ts
npm run build >/tmp/itg-build.log 2>&1 || { tail -20 /tmp/itg-build.log; exit 1; }
fail=0
check() { if grep -q "$2" "out/$1"; then echo "✔ $1 has $2"; else echo "✘ $1 missing $2"; fail=1; fi; }
check index.html "ITG 合作夥伴"
check index.html "ITG 專案"
check index.html "ITG 短標 1"
check projects/index.html "ITG 專案"   # 投影片內容在點開對話框後才渲染（既有視覺測試涵蓋）
check insights/index.html "ITG 洞察文章"
check insights/itg-article/index.html "第一段"
check insights/index.html "ITG 標題 1"
check resources/index.html "ITG 職缺"
check events/index.html "ITG 期末活動"
node -e '
import("@supabase/supabase-js").then(async ({createClient})=>{ const db=createClient(process.env.SUPABASE_TEST_URL, process.env.SUPABASE_TEST_SERVICE_KEY);
 for (const [t,c,v] of [["partners","data->>zh","ITG%"],["articles","data->>title","ITG%"],["resources","data->>title","ITG%"],["events","data->>zh","ITG%"]]) await db.from(t).delete().like(c,v);
 await db.from("projects").delete().eq("id","itg-project"); await db.from("weekly_issues").delete().eq("vol",98); console.log("cleaned"); });'
cp /tmp/snapshot.before.json src/lib/content.snapshot.json
exit $fail

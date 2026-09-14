import test from "node:test";
import assert from "node:assert/strict";
import { articleParams, EMPTY_ARTICLE_SLUG } from "../../src/lib/article-params.ts";

// 靜態輸出（output: export）規定動態路由至少要產一頁，
// 幹部把文章全刪光時建置不能失敗（2026-09-14 正式站曾因此發布失敗）。
test("no articles still yields one placeholder page", () => {
  assert.deepEqual(articleParams([]), [{ slug: EMPTY_ARTICLE_SLUG }]);
});

test("with articles, one param per slug and no placeholder", () => {
  assert.deepEqual(articleParams([{ slug: "a" }, { slug: "b" }]), [{ slug: "a" }, { slug: "b" }]);
});

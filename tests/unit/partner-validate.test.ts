import test from "node:test";
import assert from "node:assert/strict";
import { validatePartner } from "../../src/lib/admin/partners.ts";

test("publish requires zh, en, href; logo optional", () => {
  assert.deepEqual(validatePartner({ zh: "好廣告數據", en: "Good Ads Data", href: "https://gad.example/" }), {});
  const errors = validatePartner({ zh: "好廣告數據", href: "https://gad.example/" });
  assert.equal(errors.en, "必填");
  assert.equal(Object.keys(errors).length, 1);
});

test("href must be http(s)", () => {
  assert.equal(validatePartner({ zh: "a", en: "a", href: "gad.example" }).href, "要以 http:// 或 https:// 開頭");
});

test("draft save skips required checks but still validates href format", () => {
  assert.deepEqual(validatePartner({ zh: "a" }, { draft: true }), {});
  assert.equal(validatePartner({ href: "nope" }, { draft: true }).href, "要以 http:// 或 https:// 開頭");
});

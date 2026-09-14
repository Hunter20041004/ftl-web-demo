import test from "node:test";
import assert from "node:assert/strict";
import { zodErrors } from "../../src/lib/admin/validate.ts";
import { paperSchema } from "../../src/lib/content.schema.ts";

test("zodErrors maps issues to dotted field paths with Chinese messages", () => {
  const errors = zodErrors(paperSchema, { title: "t", authors: "a", venue: "v", year: 2020, region: "intl", summary: "s", href: "https://x" });
  assert.equal(errors.summaryEn, "必填");
  assert.equal(Object.keys(errors).length, 1);
  assert.deepEqual(zodErrors(paperSchema, { title: "t", authors: "a", venue: "v", year: 2020, region: "intl", summary: "s", summaryEn: "s", href: "https://x" }), {});
});

test("nested array paths use dots", () => {
  const errors = zodErrors(paperSchema, { title: "", authors: "a", venue: "v", year: "x", region: "eu", summary: "s", summaryEn: "s", href: "h" });
  assert.equal(errors.title, "必填");
  assert.ok(errors.year);
  assert.ok(errors.region);
});

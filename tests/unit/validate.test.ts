import test from "node:test";
import assert from "node:assert/strict";
import { zodErrors } from "../../src/lib/admin/validate.ts";
import { articleSchema } from "../../src/lib/content.schema.ts";

test("zodErrors maps issues to dotted field paths with Chinese messages", () => {
  const ok = { slug: "a-b", title: "t", titleEn: "t", author: "a", authorEn: "a", date: "2026-09-14", summary: "s", summaryEn: "s", body: "b", tags: [], tagsEn: [] };
  const errors = zodErrors(articleSchema, { ...ok, summaryEn: undefined });
  assert.equal(errors.summaryEn, "必填");
  assert.equal(Object.keys(errors).length, 1);
  assert.deepEqual(zodErrors(articleSchema, ok), {});
});

test("nested array paths use dots", () => {
  const errors = zodErrors(articleSchema, { slug: "Bad Slug", title: "", titleEn: "t", author: "a", authorEn: "a", date: "2026/09/14", summary: "s", summaryEn: "s", body: "b", tags: [], tagsEn: [] });
  assert.equal(errors.title, "必填");
  assert.ok(errors.slug);
  assert.ok(errors.date);
});

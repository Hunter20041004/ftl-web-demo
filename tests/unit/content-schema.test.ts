import test from "node:test";
import assert from "node:assert/strict";
import { parseSnapshot, partnerSchema, resourceSchema, weeklyIssueSchema } from "../../src/lib/content.schema.ts";

test("partner requires zh/en/href; logo and markOnly optional", () => {
  assert.ok(partnerSchema.safeParse({ zh: "市民永續", en: "City Sustainability", href: "https://x.tw/" }).success);
  assert.ok(!partnerSchema.safeParse({ zh: "市民永續", href: "https://x.tw/" }).success);
});

test("resource kind is job/scholarship/program only, deadline optional", () => {
  const ok = { kind: "job", kindZh: "職缺", kindEn: "Job", title: "t", titleEn: "t", org: "o", orgEn: "o", summary: "s", summaryEn: "s" };
  assert.ok(resourceSchema.safeParse(ok).success);
  assert.ok(!resourceSchema.safeParse({ ...ok, kind: "book" }).success);
});

test("weekly issue needs exactly 3 headlines and stories with bilingual fields", () => {
  const story = {
    title: "t", titleEn: "t", lede: "l", ledeEn: "l", facts: ["a"], factsEn: ["a"], context: "c", contextEn: "c",
    why: "w", whyEn: "w", taiwan: "tw", taiwanEn: "tw", watch: ["x"], watchEn: ["x"],
    sources: [{ label: "s", labelEn: "s", href: "https://a.b/", primary: true }],
  };
  const issue = { vol: 1, range: "08/27 – 09/01", year: 2026, headlines: ["a", "b", "c"], headlinesEn: ["a", "b", "c"], lede: "x", ledeEn: "x", stories: [story, story, story] };
  assert.ok(weeklyIssueSchema.safeParse(issue).success);
  assert.ok(!weeklyIssueSchema.safeParse({ ...issue, headlines: ["a", "b"] }).success);
  assert.ok(!weeklyIssueSchema.safeParse({ ...issue, stories: [{ ...story, whyEn: undefined }] }).success);
});

test("parseSnapshot throws with a path when a field is missing", () => {
  assert.throws(() => parseSnapshot({ generatedAt: "2026-09-14T00:00:00Z" }), /semester/);
});

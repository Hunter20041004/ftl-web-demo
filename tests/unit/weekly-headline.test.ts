import test from "node:test";
import assert from "node:assert/strict";
import { emptyIssue, issueSchema } from "../../src/lib/admin/weekly.ts";

// 短標曾限制 14 字，外商公司名一長就寫不下（例如「JPMorgan 推出代幣化存款」）。放寬到 100 字。
const filled = () => {
  const issue = emptyIssue(1, "2026-09-01", "2026-09-07");
  issue.lede = "x"; issue.ledeEn = "x";
  for (const s of issue.stories) Object.assign(s, { headline: "短標", headlineEn: "h", title: "t", titleEn: "t", lede: "l", ledeEn: "l", facts: ["a"], factsEn: ["a"], context: "c", contextEn: "c", why: "w", whyEn: "w", taiwan: "t", taiwanEn: "t", watch: ["w"], watchEn: ["w"], sources: [{ label: "s", labelEn: "s", href: "https://example.com/", primary: true }] });
  return issue;
};

test("headline accepts up to 100 characters", () => {
  const issue = filled();
  issue.stories[0].headline = "JPMorgan 推出代幣化存款服務"; // 17 字
  assert.ok(issueSchema.safeParse(issue).success);
  issue.stories[0].headline = "一".repeat(100);
  assert.ok(issueSchema.safeParse(issue).success);
});

test("headline rejects 101 characters or empty", () => {
  const issue = filled();
  issue.stories[0].headline = "一".repeat(101);
  assert.ok(!issueSchema.safeParse(issue).success);
  issue.stories[0].headline = "";
  assert.ok(!issueSchema.safeParse(issue).success);
});

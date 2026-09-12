import type { Metadata } from "next";
import { InsightsPage } from "@/components/insights/InsightsPage";

export const metadata: Metadata = { title: "洞察", description: "FinTech 週報與深度產業研究。" };

export default function Page() {
  return <InsightsPage />;
}

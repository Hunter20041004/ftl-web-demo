import type { Metadata } from "next";
import { LegacyPage } from "@/components/legacy/LegacyPage";

export const metadata: Metadata = {
  title: "NCCU FinTech Innovation Lab",
  description: "政大第一個 FinTech 學術社團。週報、產學合作、自主專案、社課與工作坊。",
};

export default function HomePage() {
  return <LegacyPage name="index" mobius />;
}

import type { Metadata } from "next";
import { LegacyPage } from "@/components/legacy/LegacyPage";
export const metadata: Metadata = { title: "洞察", description: "FinTech 週報與深度產業研究。" };
export default function Page() { return <LegacyPage name="insights" />; }

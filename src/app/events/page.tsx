import type { Metadata } from "next";
import { LegacyPage } from "@/components/legacy/LegacyPage";
export const metadata: Metadata = { title: "活動", description: "社課、工作坊、讀書會與年會。" };
export default function Page() { return <LegacyPage name="events" />; }

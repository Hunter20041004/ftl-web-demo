import type { Metadata } from "next";
import { LegacyPage } from "@/components/legacy/LegacyPage";
export const metadata: Metadata = { title: "資源", description: "職缺快報、FTL 圖書館與金融科技競賽資訊。" };
export default function Page() { return <LegacyPage name="resources" />; }

import type { Metadata } from "next";
import { ResourcesPage } from "@/components/resources/ResourcesPage";

export const metadata: Metadata = {
  title: "資源",
  description: "職缺快報、FTL 圖書館與金融科技競賽資訊。",
};

export default function Page() {
  return <ResourcesPage />;
}

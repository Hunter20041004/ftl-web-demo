import type { Metadata } from "next";
import { ProjectsPage } from "@/components/projects/ProjectsPage";

export const metadata: Metadata = {
  title: "專案",
  description: "政大金融科技創新實驗室的產學合作與自主專案。",
};

export default function Page() {
  return <ProjectsPage />;
}

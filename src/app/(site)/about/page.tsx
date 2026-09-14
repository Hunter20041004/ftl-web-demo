import type { Metadata } from "next";
import { AboutPage } from "@/components/about/AboutPage";

export const metadata: Metadata = {
  title: "關於我們",
  description: "社團宗旨、成立背景與成員介紹。",
};

export default function Page() {
  return <AboutPage />;
}

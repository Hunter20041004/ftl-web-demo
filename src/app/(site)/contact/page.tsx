import type { Metadata } from "next";
import { ContactPage } from "@/components/contact/ContactPage";

export const metadata: Metadata = {
  title: "聯絡我們",
  description: "LINE Bot、Email、社群與研究中心聯絡資訊。",
};

export default function Page() {
  return <ContactPage />;
}

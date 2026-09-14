import type { Metadata } from "next";
import { EventsPage } from "@/components/events/EventsPage";

export const metadata: Metadata = {
  title: "活動",
  description: "社課、工作坊、讀書會與年會。",
};

export default function Page() {
  return <EventsPage />;
}

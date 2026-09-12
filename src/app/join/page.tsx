import type { Metadata } from "next";
import { JoinPage } from "@/components/join/JoinPage";

export const metadata: Metadata = {
  title: "入社",
  description: "專案生與旁聽生怎麼加入、社費多少、出席獎勵金怎麼算、招募時程。",
};

export default function Page() {
  return <JoinPage />;
}

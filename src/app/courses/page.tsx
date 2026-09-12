import type { Metadata } from "next";
import { CoursesPage } from "@/components/courses/CoursesPage";

export const metadata: Metadata = {
  title: "課程",
  description: "115-1 學期的講座、實務工作坊、英語讀書會與區塊鏈基礎系列課程。",
};

export default function Page() {
  return <CoursesPage />;
}
